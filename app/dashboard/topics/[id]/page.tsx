"use client"

import { useState, useEffect } from "react"
import { use } from "react"
import { useSession } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { ChevronLeft, Star, Play, Edit, Trash2, Plus, CheckCircle, Clock, Eye } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { apiDataStore } from "@/lib/api-data-store"

export default function TopicDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { data: session } = useSession()
  const user = session?.user
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isHydrated, setIsHydrated] = useState(false)
  
  // Simple state - no complex hooks
  const [topic, setTopic] = useState<any>(null)
  const [lessons, setLessons] = useState<any[]>([])
  const [assessment, setAssessment] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState({ completed: 0, total: 0, percentage: 0 })
  const [cooldownInfo, setCooldownInfo] = useState({ canTake: true, message: "" })
  const [assessmentStatus, setAssessmentStatus] = useState({ 
    hasAttempted: false, 
    bestScore: 0, 
    lastAttemptId: null 
  })

  const resolvedParams = use(params)
  const topicId = Number.parseInt(resolvedParams.id)
  
  // Get return navigation info
  const returnTo = searchParams.get('returnTo')
  const manageTopicId = searchParams.get('topicId')
  
  // Determine back navigation URL
  const getBackUrl = () => {
    if (returnTo === 'manage') {
      const targetTopicId = manageTopicId || topicId
      return `/dashboard/manage-topics/${targetTopicId}`
    }
    return '/dashboard/topics'
  }

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Load data directly without complex hooks
  useEffect(() => {
    if (isHydrated && topicId) {
      loadTopicData()
    }
  }, [isHydrated, topicId])

  const loadTopicData = async () => {
    try {
      setLoading(true)
      
      // Load topic, lessons, and assessment in parallel
      const [topicData, lessonsData, assessmentData] = await Promise.all([
        apiDataStore.getTopic(topicId),
        apiDataStore.getLessonsByTopic(topicId),
        apiDataStore.getAssessmentByTopic(topicId).catch(() => null) // Handle 404s gracefully
      ])
      
      // Clean and normalize topic data
      if (topicData) {
        const cleanTopic = {
          id: String(topicData.id || ''),
          title: String(topicData.title || 'Untitled Topic'),
          description: String(topicData.description || 'Topic Overview'),
          category: String(topicData.category || 'General'),
          difficulty: String(topicData.difficulty || 'Beginner'),
          status: String(topicData.status || 'Draft'),
          students: Number(topicData.students || 0),
          hasAssessment: Boolean(topicData.hasAssessment || false)
        }
        setTopic(cleanTopic)
      }
      
      // Clean and normalize lessons data
      const cleanLessons = (lessonsData || [])
        .filter(lesson => lesson && typeof lesson === 'object' && lesson.id)
        .map((lesson, index) => ({
          id: String(lesson.id || ''),
          topicId: Number(lesson.topicId || topicId),
          title: String(lesson.title || 'Untitled Lesson'),
          description: String(lesson.description || 'No description available'),
          duration: String(lesson.duration || '15 min'),
          difficulty: String(lesson.difficulty || 'Beginner'),
          status: String(lesson.status || 'Draft'),
          image: String(lesson.image || '/placeholder.svg?height=200&width=300'),
          prerequisites: Array.isArray(lesson.prerequisites) ? lesson.prerequisites : [],
          index: index + 1
        }))
        .filter(lesson => {
          // Students only see published lessons
          if (user?.role === 'student' && lesson.status !== 'Published') {
            return false
          }
          return true
        })
      
      setLessons(cleanLessons)
      setAssessment(assessmentData)
      
      // Load progress and completion data for students
      if (user?.role === "student" && user.id) {
        await loadProgressData(cleanLessons, user.id)
        
        // Set cooldown info and assessment status from backend response
        if (assessmentData) {
          console.log('🔍 Assessment data received:', {
            id: assessmentData.id,
            can_take: assessmentData.can_take,
            message: assessmentData.message,
            last_attempt: assessmentData.last_attempt
          })
          
          setCooldownInfo({
            canTake: assessmentData.can_take !== false, // Default to true if not specified
            message: assessmentData.message || ""
          })
          
          // Get all user attempts to find best score
          try {
            const userAttempts = await apiDataStore.getUserAssessmentAttempts(user.id)
            const assessmentAttempts = userAttempts.filter(attempt => 
              Number(attempt.assessmentId) === Number(assessmentData.id)
            )
            
            console.log('🔍 All user attempts for this assessment:', assessmentAttempts)
            
            if (assessmentAttempts.length > 0) {
              // Find best score attempt
              const bestAttempt = assessmentAttempts.reduce((best, current) => 
                (Number(current.score) || 0) > (Number(best.score) || 0) ? current : best
              )
              
              console.log('🔍 Best attempt found:', {
                id: bestAttempt.id,
                score: bestAttempt.score,
                correct_answers: bestAttempt.correct_answers || bestAttempt.correctAnswers,
                total_questions: bestAttempt.total_questions || bestAttempt.totalQuestions
              })
              
              setAssessmentStatus({
                hasAttempted: true,
                bestScore: Number(bestAttempt.score) || 0,
                lastAttemptId: bestAttempt.id
              })
            } else {
              console.log('🔍 No attempts found for this assessment')
              setAssessmentStatus({
                hasAttempted: false,
                bestScore: 0,
                lastAttemptId: null
              })
            }
          } catch (error) {
            console.error('Error getting user attempts:', error)
            // Fallback to last_attempt from assessment data
            if (assessmentData.last_attempt) {
              setAssessmentStatus({
                hasAttempted: true,
                bestScore: assessmentData.last_attempt.score || 0,
                lastAttemptId: assessmentData.last_attempt.id
              })
            } else {
              setAssessmentStatus({
                hasAttempted: false,
                bestScore: 0,
                lastAttemptId: null
              })
            }
          }
        }
      }
      
    } catch (error) {
      console.error('Error loading topic data:', error)
      setTopic(null)
      setLessons([])
      setAssessment(null)
    } finally {
      setLoading(false)
    }
  }

  const loadProgressData = async (lessonsData: any[], userId: string) => {
    try {
      // Get user completions
      const completions = await apiDataStore.getUserLessonCompletions(userId)
      const topicCompletions = completions.filter(completion => 
        Number(completion?.topicId) === Number(topicId) && completion?.isCompleted
      )
      
      const total = lessonsData.length
      const completed = topicCompletions.length
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
      
      setProgress({ completed, total, percentage })
    } catch (error) {
      console.error('Error loading progress:', error)
      setProgress({ completed: 0, total: 0, percentage: 0 })
    }
  }


  const handleDeleteLesson = async (lessonId: number) => {
    try {
      const success = await apiDataStore.deleteLesson(lessonId)
      if (success) {
        toast({
          title: "Success",
          description: "Lesson deleted successfully",
        })
        // Reload lessons
        await loadTopicData()
      } else {
        toast({
          title: "Error",
          description: "Failed to delete lesson",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete lesson",
        variant: "destructive"
      })
    }
  }

  const calculateTotalDuration = () => {
    if (!Array.isArray(lessons) || lessons.length === 0) return "0 min"
    
    let totalMinutes = 0
    lessons.forEach(lesson => {
      const duration = lesson.duration || "0 min"
      const match = duration.match(/(\d+)\s*(min|hour|hr|h)/)
      if (match) {
        const value = parseInt(match[1])
        const unit = match[2].toLowerCase()
        if (unit === 'min') {
          totalMinutes += value
        } else if (unit === 'hour' || unit === 'hr' || unit === 'h') {
          totalMinutes += value * 60
        }
      }
    })
    
    if (totalMinutes < 60) {
      return `${totalMinutes} min`
    } else {
      const hours = Math.floor(totalMinutes / 60)
      const minutes = totalMinutes % 60
      return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`
    }
  }

  if (!isHydrated || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Loading topic...</h2>
        </div>
      </div>
    )
  }

  if (!topic) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">Topic Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">The requested topic could not be found.</p>
          <Link href="/dashboard/topics">
            <Button>Back to Topics</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href={getBackUrl()}>
          <Button variant="ghost" size="icon">
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{topic.title}</h1>
          <p className="text-gray-600 dark:text-gray-400">{topic.category}</p>
          {returnTo === 'manage' && (
            <Badge variant="outline" className="mt-2">
              <Eye className="w-3 h-3 mr-1" />
              Preview Mode
            </Badge>
          )}
        </div>
        {user?.role === "admin" && (
          <div className="flex items-center space-x-2">
            {returnTo === 'manage' && (
              <Link href={`/dashboard/manage-topics/${topicId}`}>
                <Button variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Manage Topic
                </Button>
              </Link>
            )}
            {returnTo !== 'manage' && (
              <Link href={`/dashboard/manage-topics/${topicId}/lessons/create`}>
                <Button className="bg-orange-500 hover:bg-orange-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Lesson
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Topic Overview */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{topic.description}</h2>
                <Badge variant="outline">{topic.difficulty}</Badge>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {topic.description === 'Topic Overview' 
                  ? "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore dolore magna aliquat enim ad minim consectetur."
                  : topic.description
                }
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                This comprehensive course covers all the essential concepts and practical applications you need to
                master this topic.
              </p>

              {/* Progress for students */}
              {user?.role === "student" && (
                <div className="mb-6 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-orange-800 dark:text-orange-200">Your Progress</h3>
                    <span className="text-orange-600 dark:text-orange-400 font-bold">{progress.percentage}%</span>
                  </div>
                  <Progress value={progress.percentage} className="h-3 mb-2" />
                  <p className="text-sm text-orange-700 dark:text-orange-300">
                    {progress.completed} of {progress.total} lessons completed
                  </p>
                </div>
              )}

              {/* Resource Links */}
              <div className="space-y-2">
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  YouTube: <span className="text-blue-600 dark:text-blue-400">https://www.youtube.com/watch?v=example</span>
                </p>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  Discord: <span className="text-blue-600 dark:text-blue-400">https://discord.gg/nft-community</span>
                </p>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  Twitter: <span className="text-blue-600 dark:text-blue-400">https://twitter.com/nftcommunity</span>
                </p>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  Instagram: <span className="text-blue-600 dark:text-blue-400">https://www.instagram.com/nftcommunity</span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Lessons Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-gray-900 dark:text-gray-100">Lessons ({lessons.length})</CardTitle>
                {user?.role === "admin" && (
                  <Link href={`/dashboard/manage-topics/${topicId}/lessons/create`}>
                    <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Lesson
                    </Button>
                  </Link>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                  <h3 className="text-lg font-semibold mb-2">Loading lessons...</h3>
                  <p className="text-gray-600 dark:text-gray-400">Please wait while we fetch the lessons.</p>
                </div>
              ) : lessons.length === 0 ? (
                <div className="text-center py-8">
                  {user?.role === "student" ? (
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 mb-2">No published lessons available for this topic yet.</p>
                      <p className="text-sm text-gray-400 dark:text-gray-500">Check back soon - lessons may be in development!</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">No lessons available for this topic yet.</p>
                      <Link href={`/dashboard/manage-topics/${topicId}/lessons/create`}>
                        <Button className="bg-orange-500 hover:bg-orange-600">
                          <Plus className="w-4 h-4 mr-2" />
                          Create First Lesson
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {lessons.map((lesson) => (
                    <Card key={lesson.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="aspect-video bg-gradient-to-br from-orange-400 to-orange-600 relative">
                        <img
                          src={lesson.image}
                          alt={lesson.title}
                          className="w-full h-full object-cover opacity-80"
                        />
                        <div className="absolute inset-0 bg-black/20" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Play className="w-12 h-12 text-white opacity-80" />
                        </div>
                        <div className="absolute top-4 left-4">
                          <div className="flex items-center space-x-2">
                            <div className="bg-white/20 text-white px-2 py-1 rounded text-sm font-medium">
                              Lesson {lesson.index}
                            </div>
                          </div>
                        </div>
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-white font-semibold text-lg mb-2">{lesson.title}</h3>
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary" className="bg-white/20 text-white">
                              {lesson.difficulty}
                            </Badge>
                            <Badge variant="secondary" className="bg-white/20 text-white">
                              <Clock className="w-3 h-3 mr-1" />
                              {lesson.duration}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <CardContent className="p-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{lesson.description}</p>

                        {lesson.prerequisites.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Prerequisites:</p>
                            <div className="flex flex-wrap gap-1">
                              {lesson.prerequisites.slice(0, 2).map((prereq, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {prereq}
                                </Badge>
                              ))}
                              {lesson.prerequisites.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{lesson.prerequisites.length - 2} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          {user?.role === "admin" ? (
                            <div className="flex items-center space-x-2">
                              <Link href={`/dashboard/topics/${topicId}/lessons/${lesson.id}${returnTo ? `?returnTo=${returnTo}&topicId=${manageTopicId || topicId}` : ''}`}>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-blue-500 border-blue-500 bg-transparent"
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  Preview
                                </Button>
                              </Link>
                              <Link href={`/dashboard/manage-topics/${topicId}/lessons/${lesson.id}/edit`}>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-orange-500 border-orange-500 bg-transparent"
                                >
                                  <Edit className="w-4 h-4 mr-1" />
                                  Edit
                                </Button>
                              </Link>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteLesson(Number(lesson.id))}
                                className="text-red-500 border-red-500"
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          ) : (
                            <Link href={`/dashboard/topics/${topicId}/lessons/${lesson.id}${returnTo ? `?returnTo=${returnTo}&topicId=${manageTopicId || topicId}` : ''}`}>
                              <Button
                                size="sm"
                                className="bg-orange-500 hover:bg-orange-600"
                              >
                                Start Lesson
                              </Button>
                            </Link>
                          )}
                          <Badge variant={lesson.status === "Published" ? "default" : "secondary"}>
                            {lesson.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Topic Info */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Duration</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{calculateTotalDuration()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Students</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{topic.students}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Rating</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-gray-900 dark:text-gray-100">4.8</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Category</span>
                  <Badge variant="outline">{topic.category}</Badge>
                </div>
                <Separator />
                {user?.role === "student" && (
                  <>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Progress</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">{progress.percentage}%</span>
                      </div>
                      <Progress value={progress.percentage} className="h-2" />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {progress.completed} of {progress.total} lessons completed
                      </p>
                    </div>
                    <Separator />
                  </>
                )}
                {assessment ? (
                  user?.role === "student" ? (
                    progress.completed !== progress.total ? (
                      <div className="space-y-2">
                        <Button className="w-full" disabled>
                          Complete All Lessons First
                        </Button>
                        <p className="text-xs text-center text-orange-600 dark:text-orange-400">
                          {progress.total - progress.completed} lesson(s) remaining
                        </p>
                      </div>
                    ) : !cooldownInfo.canTake ? (
                      <div className="space-y-2">
                        <Button className="w-full" disabled>
                          Assessment Cooldown Active
                        </Button>
                        <p className="text-xs text-center text-red-600 dark:text-red-400">
                          {cooldownInfo.message}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Button className="w-full" asChild>
                          <Link href={returnTo === 'manage' ? `/dashboard/manage-assessments/edit/${topicId}` : `/dashboard/assessment/${topicId}`}>
                            {returnTo === 'manage' 
                              ? 'Manage Assessment' 
                              : assessmentStatus.hasAttempted 
                                ? 'Redo Assessment' 
                                : 'Take Assessment'
                            }
                          </Link>
                        </Button>
                        {(() => {
                          // Enhanced debugging for assessment review section
                          const showReview = assessmentStatus.hasAttempted && assessmentStatus.lastAttemptId && returnTo !== 'manage'
                          
                          console.log('🔍 REVIEW SECTION DEBUG:', {
                            assessmentId: assessment?.id,
                            hasAttempted: assessmentStatus.hasAttempted,
                            lastAttemptId: assessmentStatus.lastAttemptId,
                            bestScore: assessmentStatus.bestScore,
                            returnTo,
                            showReview,
                            assessment: assessment ? {
                              id: assessment.id,
                              total_questions: assessment.total_questions,
                              totalQuestions: assessment.totalQuestions
                            } : null
                          })
                          
                          return showReview && (
                            <div className="space-y-1">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full" 
                                asChild
                              >
                                <Link href={`/dashboard/assessment/${assessment.id}/results?score=${assessmentStatus.bestScore}&timeSpent=0&correct=0&total=${assessment.total_questions || assessment.totalQuestions || 0}`}>
                                  Review Assessment
                                </Link>
                              </Button>
                              <p className="text-xs text-center text-green-600 dark:text-green-400">
                                Best Score: {assessmentStatus.bestScore}%
                              </p>
                            </div>
                          )
                        })()}
                      </div>
                    )
                  ) : (
                    <Button className="w-full" asChild>
                      <Link href={returnTo === 'manage' ? `/dashboard/manage-assessments/edit/${topicId}` : `/dashboard/assessment/${topicId}`}>
                        {returnTo === 'manage' ? 'Manage Assessment' : 'Take Assessment'}
                      </Link>
                    </Button>
                  )
                ) : (
                  returnTo === 'manage' ? (
                    <Button className="w-full" asChild>
                      <Link href={`/dashboard/manage-assessments`}>
                        Create Assessment
                      </Link>
                    </Button>
                  ) : (
                    <Button className="w-full" disabled>
                      No Assessment Available
                    </Button>
                  )
                )}
              </div>
            </CardContent>
          </Card>

          {/* Topic Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-gray-100">Topic Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total Lessons</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{lessons.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Published Lessons</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{lessons.filter(l => l.status === "Published").length}</span>
                </div>
                {user?.role === "student" && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Completed Lessons</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">{progress.completed}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Remaining Lessons</span>
                      <span className="font-semibold text-orange-600 dark:text-orange-400">
                        {progress.total - progress.completed}
                      </span>
                    </div>
                  </>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Average Completion</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">78%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Student Rating</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">4.8/5</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}