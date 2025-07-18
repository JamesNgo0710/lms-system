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
import { useTopics, useLessons, useLessonCompletions, useAssessments, useAssessmentAttempts } from "@/hooks/use-api-data-store"
import { useToast } from "@/hooks/use-toast"

export default function TopicDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // console.log('🔍 TopicDetailPage component starting...')
  
  const { data: session } = useSession()
  const user = session?.user
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isHydrated, setIsHydrated] = useState(false)

  // Safe hook loading with error handling
  let getTopicById, getLessonsByTopicId, deleteLesson, topicsLoading, lessonsLoading
  let isLessonCompleted, getTopicProgress
  let getAssessmentByTopic, canTakeAssessment
  
  try {
    const topicsHook = useTopics()
    getTopicById = topicsHook.getTopicById
    topicsLoading = topicsHook.loading
    
    const lessonsHook = useLessons()
    getLessonsByTopicId = lessonsHook.getLessonsByTopicId
    deleteLesson = lessonsHook.deleteLesson
    lessonsLoading = lessonsHook.loading
    
    const completionsHook = useLessonCompletions()
    isLessonCompleted = completionsHook.isLessonCompleted
    getTopicProgress = completionsHook.getTopicProgress
    
    const assessmentsHook = useAssessments()
    getAssessmentByTopic = assessmentsHook.getAssessmentByTopic
    
    const attemptsHook = useAssessmentAttempts()
    canTakeAssessment = attemptsHook.canTakeAssessment
  } catch (error) {
    // Provide safe defaults if hooks fail
    getTopicById = () => null
    getLessonsByTopicId = () => []
    deleteLesson = async () => false
    topicsLoading = false
    lessonsLoading = false
    isLessonCompleted = () => false
    getTopicProgress = () => ({ completed: 0, total: 0, percentage: 0 })
    getAssessmentByTopic = () => null
    canTakeAssessment = () => ({ canTake: true, message: "" })
  }

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

  // Safe topic and lessons loading
  let topic = null
  let lessons: any[] = []
  let assessment = null
  
  try {
    topic = getTopicById(topicId)
    lessons = getLessonsByTopicId(topicId) || []
    assessment = getAssessmentByTopic(topicId)
  } catch (error) {
    topic = null
    lessons = []
    assessment = null
  }

  // Check cooldown for assessments - SAFE: Only primitive values
  let cooldownCanTake = true
  let cooldownMessage = ""
  
  if (user && assessment && isHydrated) {
    try {
      const cooldownCheck = canTakeAssessment(user.id, assessment.id)
      if (cooldownCheck && typeof cooldownCheck === 'object') {
        cooldownCanTake = Boolean(cooldownCheck.canTake)
        cooldownMessage = String(cooldownCheck.message || "")
      }
    } catch (error) {
      cooldownCanTake = true
      cooldownMessage = ""
    }
  }

  // Safe lesson deletion
  const handleDeleteLesson = async (lessonId: number) => {
    try {
      const success = await deleteLesson(lessonId)
      if (success) {
        toast({
          title: "Success",
          description: "Lesson deleted successfully",
        })
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

  // Safe duration calculation with primitive values only
  const calculateTotalDuration = () => {
    if (!Array.isArray(lessons) || lessons.length === 0) return "0 min"
    
    let totalMinutes = 0
    lessons.forEach(lesson => {
      if (!lesson || typeof lesson !== 'object') return
      
      const duration = String(lesson.duration || "0 min")
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

  if (!isHydrated) {
    return <div>Loading...</div>
  }

  if (topicsLoading || lessonsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900">Loading {topicsLoading ? 'topic' : 'lessons'}...</h2>
        </div>
      </div>
    )
  }

  if (!topic) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Topic Not Found</h2>
          <p className="text-gray-600 mb-4">The requested topic could not be found.</p>
          <Link href="/dashboard/topics">
            <Button>Back to Topics</Button>
          </Link>
        </div>
      </div>
    )
  }

  // SAFE: Extract primitive values from topic
  const topicTitle = String(topic?.title || 'Untitled Topic')
  const topicDescription = String(topic?.description || 'Topic Overview')
  const topicCategory = String(topic?.category || 'General')
  const topicDifficulty = String(topic?.difficulty || 'Beginner')
  const topicStudents = Number(topic?.students || 0)
  const topicHasAssessment = Boolean(topic?.hasAssessment || false)

  // SAFE: Get progress with error handling - only primitive values
  let progressPercentage = 0
  let progressCompleted = 0
  let progressTotal = 0
  
  if (user && isHydrated) {
    try {
      const progress = getTopicProgress(user.id, topicId)
      if (progress && typeof progress === 'object') {
        progressPercentage = Number(progress.percentage || 0)
        progressCompleted = Number(progress.completed || 0)
        progressTotal = Number(progress.total || 0)
      }
    } catch (error) {
      progressPercentage = 0
      progressCompleted = 0
      progressTotal = 0
    }
  }

  // SAFE: Filter and normalize lessons - extract primitive values only
  const safeLessons = Array.isArray(lessons) ? lessons
    .filter(lesson => lesson && typeof lesson === 'object' && lesson.id)
    .map((lesson, index) => {
      // Extract only primitive values to prevent React error #31
      const lessonId = String(lesson?.id || '')
      const lessonTitle = String(lesson?.title || 'Untitled Lesson')
      const lessonDescription = String(lesson?.description || 'No description available')
      const lessonDuration = String(lesson?.duration || '15 min')
      const lessonDifficulty = String(lesson?.difficulty || 'Beginner')
      const lessonStatus = String(lesson?.status || 'Draft')
      const lessonImage = String(lesson?.image || '/placeholder.svg?height=200&width=300')
      
      // Safe prerequisite handling
      let lessonPrerequisites: string[] = []
      try {
        if (Array.isArray(lesson.prerequisites)) {
          lessonPrerequisites = lesson.prerequisites.map((prereq: any) => String(prereq)).filter(p => p.length > 0)
        }
      } catch (error) {
        lessonPrerequisites = []
      }
      
      if (!lessonId) return null
      
      // Safe completion check
      let isCompleted = false
      try {
        if (user && isHydrated) {
          isCompleted = Boolean(isLessonCompleted(user.id, Number(lessonId)))
        }
      } catch (error) {
        isCompleted = false
      }
      
      return {
        id: lessonId,
        title: lessonTitle,
        description: lessonDescription,
        duration: lessonDuration,
        difficulty: lessonDifficulty,
        status: lessonStatus,
        image: lessonImage,
        prerequisites: lessonPrerequisites,
        isCompleted: isCompleted,
        index: index + 1
      }
    })
    .filter(lesson => lesson !== null) : []

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
          <h1 className="text-3xl font-bold">{topicTitle}</h1>
          <p className="text-gray-600">{topicCategory}</p>
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
                <h2 className="text-xl font-semibold">{topicDescription}</h2>
                <Badge variant="outline">{topicDifficulty}</Badge>
              </div>
              <p className="text-gray-600 mb-4">
                {topicDescription === 'Topic Overview' 
                  ? "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore dolore magna aliquat enim ad minim consectetur."
                  : topicDescription
                }
              </p>
              <p className="text-gray-600 mb-6">
                This comprehensive course covers all the essential concepts and practical applications you need to
                master this topic.
              </p>

              {/* Progress for students - SAFE: Only primitive values */}
              {user?.role === "student" && isHydrated && (
                <div className="mb-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-orange-800">Your Progress</h3>
                    <span className="text-orange-600 font-bold">{progressPercentage}%</span>
                  </div>
                  <Progress value={progressPercentage} className="h-3 mb-2" />
                  <p className="text-sm text-orange-700">
                    {progressCompleted} of {progressTotal} lessons completed
                  </p>
                </div>
              )}

              {/* Resource Links */}
              <div className="space-y-2">
                <p className="font-medium">
                  YouTube: <span className="text-blue-600">https://www.youtube.com/watch?v=example</span>
                </p>
                <p className="font-medium">
                  Discord: <span className="text-blue-600">https://discord.gg/nft-community</span>
                </p>
                <p className="font-medium">
                  Twitter: <span className="text-blue-600">https://twitter.com/nftcommunity</span>
                </p>
                <p className="font-medium">
                  Instagram: <span className="text-blue-600">https://www.instagram.com/nftcommunity</span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Lessons Section - SAFE: Only primitive values */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Lessons ({safeLessons.length})</CardTitle>
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
              {safeLessons.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No lessons available for this topic yet.</p>
                  {user?.role === "admin" && (
                    <Link href={`/dashboard/manage-topics/${topicId}/lessons/create`}>
                      <Button className="bg-orange-500 hover:bg-orange-600">
                        <Plus className="w-4 h-4 mr-2" />
                        Create First Lesson
                      </Button>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {safeLessons.map((lesson) => (
                    <Card key={lesson.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="aspect-video bg-gradient-to-br from-orange-400 to-orange-600 relative">
                        <img
                          src={lesson.image}
                          alt={lesson.title}
                          className="w-full h-full object-cover opacity-80"
                        />
                        <div className="absolute inset-0 bg-black/20" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          {isHydrated && lesson.isCompleted ? (
                            <CheckCircle className="w-12 h-12 text-white opacity-80" />
                          ) : (
                            <Play className="w-12 h-12 text-white opacity-80" />
                          )}
                        </div>
                        <div className="absolute top-4 left-4">
                          <div className="flex items-center space-x-2">
                            <div className="bg-white/20 text-white px-2 py-1 rounded text-sm font-medium">
                              Lesson {lesson.index}
                            </div>
                            {isHydrated && lesson.isCompleted && (
                              <Badge className="bg-green-500">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Completed
                              </Badge>
                            )}
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
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{lesson.description}</p>

                        {lesson.prerequisites.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs font-medium text-gray-500 mb-1">Prerequisites:</p>
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
                                className={
                                  isHydrated && lesson.isCompleted
                                    ? "bg-green-500 hover:bg-green-600"
                                    : "bg-orange-500 hover:bg-orange-600"
                                }
                              >
                                {isHydrated && lesson.isCompleted ? "Review Lesson" : "Start Lesson"}
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

        {/* Sidebar - SAFE: Only primitive values */}
        <div className="space-y-6">
          {/* Topic Info */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Duration</span>
                  <span className="font-medium">{calculateTotalDuration()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Students</span>
                  <span className="font-medium">{topicStudents}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Rating</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">4.8</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Category</span>
                  <Badge variant="outline">{topicCategory}</Badge>
                </div>
                <Separator />
                {user?.role === "student" && isHydrated && (
                  <>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span className="font-medium">{progressPercentage}%</span>
                      </div>
                      <Progress value={progressPercentage} className="h-2" />
                      <p className="text-xs text-gray-500">
                        {progressCompleted} of {progressTotal} lessons completed
                      </p>
                    </div>
                    <Separator />
                  </>
                )}
                {topicHasAssessment ? (
                  user?.role === "student" && isHydrated ? (
                    progressCompleted !== progressTotal ? (
                      <div className="space-y-2">
                        <Button className="w-full" disabled>
                          Complete All Lessons First
                        </Button>
                        <p className="text-xs text-center text-orange-600">
                          {progressTotal - progressCompleted} lesson(s) remaining
                        </p>
                      </div>
                    ) : !cooldownCanTake ? (
                      <div className="space-y-2">
                        <Button className="w-full" disabled>
                          Assessment Cooldown Active
                        </Button>
                        <p className="text-xs text-center text-red-600">
                          {cooldownMessage}
                        </p>
                      </div>
                    ) : (
                      <Button className="w-full" asChild>
                        <Link href={returnTo === 'manage' ? `/dashboard/manage-assessments/edit/${topicId}` : `/dashboard/assessment/${topicId}`}>
                          {returnTo === 'manage' ? 'Manage Assessment' : 'Take Assessment'}
                        </Link>
                      </Button>
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

          {/* Topic Stats - SAFE: Only primitive values */}
          <Card>
            <CardHeader>
              <CardTitle>Topic Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total Lessons</span>
                  <span className="font-semibold">{safeLessons.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Published Lessons</span>
                  <span className="font-semibold">{safeLessons.filter(l => l.status === "Published").length}</span>
                </div>
                {user?.role === "student" && isHydrated && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Completed Lessons</span>
                      <span className="font-semibold text-green-600">{progressCompleted}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Remaining Lessons</span>
                      <span className="font-semibold text-orange-600">
                        {progressTotal - progressCompleted}
                      </span>
                    </div>
                  </>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm">Average Completion</span>
                  <span className="font-semibold">78%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Student Rating</span>
                  <span className="font-semibold">4.8/5</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}