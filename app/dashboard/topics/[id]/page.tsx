"use client"

import { useState, useEffect } from "react"
import { use } from "react"
import { useSession } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { notFound } from "next/navigation"
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
  const { data: session } = useSession()
  const user = session?.user
  const searchParams = useSearchParams()
  const { getTopicById } = useTopics()
  const { getLessonsByTopicId, deleteLesson } = useLessons()
  const { isLessonCompleted, getTopicProgress } = useLessonCompletions()
  const { getAssessmentByTopic } = useAssessments()
  const { canTakeAssessment } = useAssessmentAttempts()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")
  const [isHydrated, setIsHydrated] = useState(false)

  const resolvedParams = use(params)
  const topicId = Number.parseInt(resolvedParams.id)
  const topic = getTopicById(topicId)
  const lessons = getLessonsByTopicId(topicId)
  const assessment = getAssessmentByTopic(topicId)
  
  // Get return navigation info
  const returnTo = searchParams.get('returnTo')
  const manageTopicId = searchParams.get('topicId')
  
  // Determine back navigation URL
  const getBackUrl = () => {
    if (returnTo === 'manage') {
      // If coming from manage topics, always go back to the specific manage topic page
      const targetTopicId = manageTopicId || topicId
      return `/dashboard/manage-topics/${targetTopicId}`
    }
    return '/dashboard/topics'
  }
  
  // Check cooldown for assessments
  const cooldownCheck = user && assessment && isHydrated 
    ? canTakeAssessment(user.id, assessment.id) 
    : { canTake: true, message: "" }

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  const handleDeleteLesson = (lessonId: number) => {
    deleteLesson(lessonId)
    toast({
      title: "Success",
      description: "Lesson deleted successfully",
    })
  }

  // Calculate total duration from all lessons
  const calculateTotalDuration = () => {
    if (lessons.length === 0) return "0 min"
    
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

  const topicProgress =
    user && isHydrated ? getTopicProgress(user.id, topicId) : { completed: 0, total: 0, percentage: 0 }

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
          <h1 className="text-3xl font-bold">{topic.title}</h1>
          <p className="text-gray-600">{topic.category}</p>
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
                <h2 className="text-xl font-semibold">{topic.description || "Topic Overview"}</h2>
                <Badge variant="outline">{topic.difficulty}</Badge>
              </div>
              <p className="text-gray-600 mb-4">
                {topic.description ||
                  "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore dolore magna aliquat enim ad minim consectetur."}
              </p>
              <p className="text-gray-600 mb-6">
                This comprehensive course covers all the essential concepts and practical applications you need to
                master this topic.
              </p>

              {/* Progress for students */}
              {user?.role === "student" && isHydrated && (
                <div className="mb-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-orange-800">Your Progress</h3>
                    <span className="text-orange-600 font-bold">{topicProgress.percentage}%</span>
                  </div>
                  <Progress value={topicProgress.percentage} className="h-3 mb-2" />
                  <p className="text-sm text-orange-700">
                    {topicProgress.completed} of {topicProgress.total} lessons completed
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

          {/* Lessons Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Lessons ({lessons.length})</CardTitle>
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
              {lessons.length === 0 ? (
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
                  {lessons.map((lesson, index) => {
                    const lessonCompleted = user && isHydrated ? isLessonCompleted(user.id, lesson.id) : false
                    return (
                      <Card key={lesson.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="aspect-video bg-gradient-to-br from-orange-400 to-orange-600 relative">
                          <img
                            src="/placeholder.svg?height=200&width=300"
                            alt={lesson.title}
                            className="w-full h-full object-cover opacity-80"
                          />
                          <div className="absolute inset-0 bg-black/20" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            {isHydrated && lessonCompleted ? (
                              <CheckCircle className="w-12 h-12 text-white opacity-80" />
                            ) : (
                              <Play className="w-12 h-12 text-white opacity-80" />
                            )}
                          </div>
                          <div className="absolute top-4 left-4">
                            <div className="flex items-center space-x-2">
                              <div className="bg-white/20 text-white px-2 py-1 rounded text-sm font-medium">
                                Lesson {index + 1}
                              </div>
                              {isHydrated && lessonCompleted && (
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
                                  onClick={() => handleDeleteLesson(lesson.id)}
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
                                    isHydrated && lessonCompleted
                                      ? "bg-green-500 hover:bg-green-600"
                                      : "bg-orange-500 hover:bg-orange-600"
                                  }
                                >
                                  {isHydrated && lessonCompleted ? "Review Lesson" : "Start Lesson"}
                                </Button>
                              </Link>
                            )}
                            <Badge variant={lesson.status === "Published" ? "default" : "secondary"}>
                              {lesson.status}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
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
                  <span className="text-sm text-gray-600">Duration</span>
                  <span className="font-medium">{calculateTotalDuration()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Students</span>
                  <span className="font-medium">{topic.students}</span>
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
                  <Badge variant="outline">{topic.category}</Badge>
                </div>
                <Separator />
                {user?.role === "student" && isHydrated && (
                  <>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span className="font-medium">{topicProgress.percentage}%</span>
                      </div>
                      <Progress value={topicProgress.percentage} className="h-2" />
                      <p className="text-xs text-gray-500">
                        {topicProgress.completed} of {topicProgress.total} lessons completed
                      </p>
                    </div>
                    <Separator />
                  </>
                )}
                {topic.hasAssessment ? (
                  user?.role === "student" && isHydrated ? (
                    topicProgress.completed !== topicProgress.total ? (
                      <div className="space-y-2">
                        <Button className="w-full" disabled>
                          Complete All Lessons First
                        </Button>
                        <p className="text-xs text-center text-orange-600">
                          {topicProgress.total - topicProgress.completed} lesson(s) remaining
                        </p>
                      </div>
                    ) : !cooldownCheck.canTake ? (
                      <div className="space-y-2">
                        <Button className="w-full" disabled>
                          Assessment Cooldown Active
                        </Button>
                        <p className="text-xs text-center text-red-600">
                          {cooldownCheck.message}
                        </p>
                      </div>
                    ) : (
                      <Button className="w-full" asChild>
                        <Link href={returnTo === 'manage' ? `/dashboard/manage-assessments/edit/${topic.id}` : `/dashboard/assessment/${topic.id}`}>
                          {returnTo === 'manage' ? 'Manage Assessment' : 'Take Assessment'}
                        </Link>
                      </Button>
                    )
                  ) : (
                    <Button className="w-full" asChild>
                      <Link href={returnTo === 'manage' ? `/dashboard/manage-assessments/edit/${topic.id}` : `/dashboard/assessment/${topic.id}`}>
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
              <CardTitle>Topic Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total Lessons</span>
                  <span className="font-semibold">{lessons.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Published Lessons</span>
                  <span className="font-semibold">{lessons.filter((l) => l.status === "Published").length}</span>
                </div>
                {user?.role === "student" && isHydrated && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Completed Lessons</span>
                      <span className="font-semibold text-green-600">{topicProgress.completed}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Remaining Lessons</span>
                      <span className="font-semibold text-orange-600">
                        {topicProgress.total - topicProgress.completed}
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
