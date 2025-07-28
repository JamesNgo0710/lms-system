"use client"

import { useState, useEffect, useRef } from "react"
import { use } from "react"
import { useSession } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Download, ChevronLeft, FileText, CheckCircle, Play, Clock } from "lucide-react"
import Link from "next/link"
import { useTopics, useLessons, useLessonCompletions } from "@/hooks/use-api-data-store"
import { useToast } from "@/hooks/use-toast"
import { RichContentRenderer } from "@/components/rich-content-renderer"

export default function LessonViewPage({ params }: { params: Promise<{ id: string; lessonId: string }> }) {
  const { data: session } = useSession()
  const user = session?.user
  const searchParams = useSearchParams()
  const { getTopicById } = useTopics()
  const { getLessonById, getLessonsByTopicId } = useLessons()
  const { isLessonCompleted, markLessonComplete, markLessonIncomplete, getTopicProgress, trackLessonView, completions } = useLessonCompletions()
  const { toast } = useToast()

  const resolvedParams = use(params)
  const topicId = Number.parseInt(resolvedParams.id)
  const lessonId = Number.parseInt(resolvedParams.lessonId)
  const topic = getTopicById(topicId)
  const lesson = getLessonById(lessonId)
  const allLessons = getLessonsByTopicId(topicId)
  
  // Get return navigation info
  const returnTo = searchParams.get('returnTo')
  const manageTopicId = searchParams.get('topicId')
  
  // Determine back navigation URL
  const getBackUrl = () => {
    if (returnTo === 'manage') {
      // If coming from manage topics, return to topic preview with manage context
      const targetTopicId = manageTopicId || topicId
      return `/dashboard/topics/${topicId}?returnTo=manage&topicId=${targetTopicId}`
    }
    return `/dashboard/topics/${topicId}`
  }

  const [startTime, setStartTime] = useState<Date | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  const hasTracked = useRef(false)

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (user && isHydrated) {
      const completed = isLessonCompleted(user.id, lessonId)
      console.log('🔄 useEffect: Checking completion status:', { userId: user.id, lessonId, completed, completionsCount: completions?.length })
      console.log('🔄 useEffect: Current completions:', completions)
      setIsCompleted(completed)
    }
  }, [user, lessonId, isLessonCompleted, isHydrated, completions])

  useEffect(() => {
    // Track when lesson starts and track view only once
    if (!hasTracked.current && isHydrated && user) {
      setStartTime(new Date())
      trackLessonView(lessonId)
      hasTracked.current = true
    }
  }, [isHydrated, user, lessonId, trackLessonView])

  const handleToggleCompletion = async () => {
    if (!user) return

    console.log('🔄 Toggling completion for lesson:', lessonId, 'Current state:', isCompleted)
    const timeSpent = startTime ? Math.round((new Date().getTime() - startTime.getTime()) / 60000) : undefined

    try {
      if (isCompleted) {
        console.log('⏳ Marking lesson as incomplete...')
        const success = await markLessonIncomplete(lessonId)
        console.log('✅ markLessonIncomplete result:', success)
        
        if (success) {
          setIsCompleted(false)
          console.log('✅ Local state updated to incomplete')
          toast({
            title: "Lesson marked as incomplete",
            description: "You can complete it again anytime.",
          })
        } else {
          console.log('❌ Failed to mark lesson as incomplete')
          toast({
            title: "Error",
            description: "Failed to mark lesson as incomplete. Please try again.",
            variant: "destructive"
          })
        }
      } else {
        console.log('⏳ Marking lesson as complete...')
        const success = await markLessonComplete(lessonId, timeSpent)
        console.log('✅ markLessonComplete result:', success)
        
        if (success) {
          setIsCompleted(true)
          console.log('✅ Local state updated to complete')
          toast({
            title: "Congratulations! 🎉",
            description: "Lesson completed successfully!",
          })
        } else {
          console.log('❌ Failed to mark lesson as complete')
          toast({
            title: "Error", 
            description: "Failed to mark lesson as complete. Please try again.",
            variant: "destructive"
          })
        }
      }
    } catch (error) {
      console.error('❌ Error toggling lesson completion:', error)
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      })
    }
  }

  if (!topic || !lesson) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">Lesson Not Found</h2>
          <Link href="/dashboard/topics">
            <Button>Back to Topics</Button>
          </Link>
        </div>
      </div>
    )
  }

  const currentLessonIndex = allLessons.findIndex((l) => l.id === lessonId)
  const nextLesson = allLessons[currentLessonIndex + 1]
  const prevLesson = allLessons[currentLessonIndex - 1]

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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{lesson.title}</h1>
          <p className="text-gray-600 dark:text-gray-400">{topic.title}</p>
          {returnTo === 'manage' && (
            <Badge variant="outline" className="mt-2">
              Preview Mode
            </Badge>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">{lesson.difficulty}</Badge>
          <Badge variant="outline">
            <Clock className="w-3 h-3 mr-1" />
            {lesson.duration}
          </Badge>
          {isHydrated && isCompleted && (
            <Badge className="bg-green-500">
              <CheckCircle className="w-3 h-3 mr-1" />
              Completed
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Player */}
          <Card>
            <CardContent className="p-0">
              <div className="aspect-video bg-gray-900 relative rounded-t-lg overflow-hidden">
                {(lesson.videoUrl || lesson.video_url) ? (
                  <iframe
                    width="100%"
                    height="100%"
                    src={(lesson.videoUrl || lesson.video_url).replace("watch?v=", "embed/")}
                    title={lesson.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Play className="w-16 h-16 mx-auto mb-4 opacity-70" />
                      <p className="text-lg font-semibold">{lesson.title}</p>
                      <p className="text-sm opacity-70">Video content coming soon</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{lesson.title}</h2>
                  <div className="flex items-center space-x-2">
                    {isHydrated && (
                      <Button
                        onClick={handleToggleCompletion}
                        variant={isCompleted ? "default" : "outline"}
                        size="sm"
                        className={isCompleted ? "bg-green-500 hover:bg-green-600" : ""}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {isCompleted ? "Completed" : "Mark Complete"}
                      </Button>
                    )}
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{lesson.description}</p>
                <RichContentRenderer content={typeof lesson.content === 'string' ? lesson.content : ''} />

                {/* Social Links */}
                {((lesson.socialLinks?.youtube || lesson.social_links?.youtube) || (lesson.socialLinks?.twitter || lesson.social_links?.twitter)) && (
                  <div className="mt-6 space-y-2">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">Additional Resources:</h3>
                    {(lesson.socialLinks?.youtube || lesson.social_links?.youtube) && (
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        YouTube:{" "}
                        <a
                          href={lesson.socialLinks?.youtube || lesson.social_links?.youtube}
                          className="text-blue-600 hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {lesson.socialLinks?.youtube || lesson.social_links?.youtube}
                        </a>
                      </p>
                    )}
                    {(lesson.socialLinks?.twitter || lesson.social_links?.twitter) && (
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        Twitter:{" "}
                        <a
                          href={lesson.socialLinks?.twitter || lesson.social_links?.twitter}
                          className="text-blue-600 hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {lesson.socialLinks?.twitter || lesson.social_links?.twitter}
                        </a>
                      </p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Downloads */}
          {lesson.downloads.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Downloads</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {lesson.downloads.map((download) => (
                    <div key={download.id} className="flex items-center justify-between p-3 border dark:border-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-red-500" />
                        <div>
                          <p className="font-medium text-sm text-gray-900 dark:text-gray-100">{download.name || 'Unknown file'}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{download.size || 'Unknown size'}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                {prevLesson ? (
                  <Link href={`/dashboard/topics/${topicId}/lessons/${prevLesson.id}${returnTo ? `?returnTo=${returnTo}&topicId=${manageTopicId || topicId}` : ''}`}>
                    <Button variant="outline">
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Previous: {prevLesson.title}
                    </Button>
                  </Link>
                ) : (
                  <div></div>
                )}

                {nextLesson ? (
                  <Link href={`/dashboard/topics/${topicId}/lessons/${nextLesson.id}${returnTo ? `?returnTo=${returnTo}&topicId=${manageTopicId || topicId}` : ''}`}>
                    <Button className="bg-orange-500 hover:bg-orange-600">
                      Next: {nextLesson.title}
                      <ChevronLeft className="w-4 h-4 ml-2 rotate-180" />
                    </Button>
                  </Link>
                ) : (
                  <Link href={getBackUrl()}>
                    <Button className="bg-orange-500 hover:bg-orange-600">Back to Topic</Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Lesson Info */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Duration</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{lesson.duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Difficulty</span>
                  <Badge variant="outline">{lesson.difficulty}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                  <Badge
                    variant={isHydrated && isCompleted ? "default" : "secondary"}
                    className={isHydrated && isCompleted ? "bg-green-500" : ""}
                  >
                    {isHydrated ? (isCompleted ? "Completed" : "In Progress") : "Loading..."}
                  </Badge>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-900 dark:text-gray-100">Lesson Progress</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{isHydrated ? (isCompleted ? "100%" : "0%") : "0%"}</span>
                  </div>
                  <Progress value={isHydrated && isCompleted ? 100 : 0} className="h-2" />
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-900 dark:text-gray-100">Topic Progress</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{topicProgress.percentage}%</span>
                  </div>
                  <Progress value={topicProgress.percentage} className="h-2" />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {topicProgress.completed} of {topicProgress.total} lessons completed
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Prerequisites */}
          {lesson.prerequisites.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Prerequisites</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {lesson.prerequisites.map((prereq, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-900 dark:text-gray-100">{typeof prereq === 'string' ? prereq : String(prereq)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* All Lessons */}
          <Card>
            <CardHeader>
              <CardTitle>All Lessons ({allLessons.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {allLessons.map((l, index) => {
                  const lessonCompleted = user && isHydrated ? isLessonCompleted(user.id, l.id) : false
                  return (
                    <Link key={l.id} href={`/dashboard/topics/${topicId}/lessons/${l.id}${returnTo ? `?returnTo=${returnTo}&topicId=${manageTopicId || topicId}` : ''}`}>
                      <div
                        className={`flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${l.id === lessonId ? "bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700" : ""}`}
                      >
                        <div
                          className={`flex-shrink-0 w-6 h-6 rounded-full text-xs flex items-center justify-center font-medium ${isHydrated && lessonCompleted ? "bg-green-500 text-white" : "bg-orange-500 text-white"}`}
                        >
                          {isHydrated && lessonCompleted ? <CheckCircle className="w-3 h-3" /> : index + 1}
                        </div>
                        <div className="flex-1">
                          <p
                            className={`text-sm font-medium ${isHydrated && lessonCompleted ? "line-through text-gray-500 dark:text-gray-400" : "text-gray-900 dark:text-gray-100"}`}
                          >
                            {l.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{l.duration}</p>
                        </div>
                        {l.id === lessonId && (
                          <Badge variant="default" className="bg-orange-500">
                            Current
                          </Badge>
                        )}
                        {isHydrated && lessonCompleted && l.id !== lessonId && (
                          <Badge variant="default" className="bg-green-500">
                            ✓
                          </Badge>
                        )}
                      </div>
                    </Link>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
