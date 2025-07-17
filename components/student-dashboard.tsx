"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Calendar, Trophy, TrendingUp, Clock, CheckCircle, PlayCircle, Target, Award, BarChart3 } from "lucide-react"
import Link from "next/link"
import { useTopics, useLessons, useLessonCompletions, useLessonViews, useAssessments, useAssessmentAttempts } from "@/hooks/use-api-data-store"
import { UI_TEXT } from "@/lib/constants"
import { CooldownTimer } from "@/components/ui/cooldown-timer"
import { EnhancedProgressTracker } from "@/components/enhanced-progress-tracker"

export function StudentDashboard() {
  const { data: session } = useSession()
  const user = session?.user
  const { topics } = useTopics()
  // TEMPORARY: Disable lessons to test React error #31
  const lessons = []
  console.log('🔍 LESSONS DISABLED IN STUDENT DASHBOARD FOR TESTING')
  const { completions, getTopicProgress, isLessonCompleted } = useLessonCompletions()
  const { views } = useLessonViews()
  const { assessments } = useAssessments()
  const { attempts, canTakeAssessment } = useAssessmentAttempts()
  const [isHydrated, setIsHydrated] = useState(false)
  const [showEnhancedProgress, setShowEnhancedProgress] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  if (!isHydrated || !user) {
    return <div className="animate-pulse">Loading dashboard...</div>
  }

  // Calculate real student data
  const userCompletions = completions.filter(c => c.userId === user.id)
  const userViews = views.filter(v => v.userId === user.id)
  const userAttempts = attempts.filter(a => a.userId === user.id)

  // Calculate completed topics
  const completedTopics = topics.filter(topic => {
    const topicLessons = lessons.filter(l => l.topicId === topic.id)
    const completedLessons = topicLessons.filter(lesson => 
      isLessonCompleted(user.id, lesson.id)
    )
    return topicLessons.length > 0 && completedLessons.length === topicLessons.length
  })

  // Find current topic (most recently viewed but not completed)
  const getCurrentTopic = () => {
    // Find topics with some progress but not completed
    const topicsWithProgress = topics.map(topic => {
      const progress = getTopicProgress(user.id, topic.id)
      const lastView = userViews
        .filter(v => v.topicId === topic.id)
        .sort((a, b) => new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime())[0]
      
      return {
        ...topic,
        progress,
        lastViewedAt: lastView?.viewedAt,
        hasProgress: progress.completed > 0
      }
    }).filter(t => t.hasProgress && t.progress.percentage < 100)
    
    // Sort by most recently viewed
    topicsWithProgress.sort((a, b) => {
      if (!a.lastViewedAt) return 1
      if (!b.lastViewedAt) return -1
      return new Date(b.lastViewedAt).getTime() - new Date(a.lastViewedAt).getTime()
    })
    
    return topicsWithProgress[0] || null
  }

  // Find next lesson to continue
  const getNextLesson = (topicId: number) => {
    const topicLessons = lessons
      .filter(l => l.topicId === topicId)
      .sort((a, b) => a.order - b.order)
    
    return topicLessons.find(lesson => !isLessonCompleted(user.id, lesson.id))
  }

  // Calculate this week's learning time
  const getThisWeekTime = () => {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    
    const thisWeekCompletions = userCompletions.filter(c => 
      new Date(c.completedAt) >= oneWeekAgo
    )
    
    const totalMinutes = thisWeekCompletions.reduce((sum, c) => sum + (c.timeSpent || 0), 0)
    return Math.round(totalMinutes / 60 * 10) / 10 // Convert to hours with 1 decimal
  }

  // Calculate learning streak
  const getLearningStreak = () => {
    const uniqueDays = new Set(
      userCompletions.map(c => new Date(c.completedAt).toDateString())
    )
    
    let streak = 0
    const today = new Date()
    
    for (let i = 0; i < 30; i++) { // Check last 30 days
      const checkDate = new Date(today)
      checkDate.setDate(today.getDate() - i)
      const dateString = checkDate.toDateString()
      
      if (uniqueDays.has(dateString)) {
        streak++
      } else if (i > 0) { // Allow for today to not break streak
        break
      }
    }
    
    return streak
  }

  // Find available assessments
  const getAvailableAssessments = () => {
    return topics.filter(topic => {
      if (!topic.hasAssessment) return false
      
      const progress = getTopicProgress(user.id, topic.id)
      const assessment = assessments.find(a => a.topicId === topic.id)
      
      if (!assessment || progress.percentage < 100) return false
      
      const cooldownCheck = canTakeAssessment(user.id, assessment.id)
      return cooldownCheck.canTake
    })
  }

  const currentTopic = getCurrentTopic()
  const nextLesson = currentTopic ? getNextLesson(currentTopic.id) : null
  const thisWeekHours = getThisWeekTime()
  const streak = getLearningStreak()
  const availableAssessments = getAvailableAssessments()
  const overallProgress = Math.round((completedTopics.length / Math.max(1, topics.length)) * 100)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user.firstName || "Student"}!</h1>
        <p className="text-muted-foreground">{UI_TEXT.welcomeMessage}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Topic</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {currentTopic ? (
              <>
                <div className="text-lg font-bold">{currentTopic.title}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {currentTopic.progress.completed}/{currentTopic.progress.total} lessons • {currentTopic.progress.percentage}% complete
                </p>
                <Link href={`/dashboard/topics/${currentTopic.id}`}>
                  <Button size="sm" className="mt-2 bg-orange-500 hover:bg-orange-600">
                    <PlayCircle className="w-3 h-3 mr-1" />
                    Continue
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <div className="text-lg font-bold">Ready to start!</div>
                <p className="text-xs text-muted-foreground mt-1">Choose a topic to begin learning</p>
                <Link href="/dashboard/topics">
                  <Button size="sm" className="mt-2 bg-orange-500 hover:bg-orange-600">
                    <BookOpen className="w-3 h-3 mr-1" />
                    Browse Topics
                  </Button>
                </Link>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Learning Progress</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {completedTopics.length}/{topics.length}
            </div>
            <p className="text-xs text-muted-foreground">Topics completed</p>
            <Progress 
              value={overallProgress} 
              className="mt-2" 
            />
            <p className="text-xs text-muted-foreground mt-1">{overallProgress}% complete</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{thisWeekHours}h</div>
            <p className="text-xs text-muted-foreground">
              {thisWeekHours === 0 ? "Start learning this week!" : "Learning time this week"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Streak</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {streak} {streak === 1 ? "day" : "days"}
            </div>
            <p className="text-xs text-muted-foreground">
              {streak === 0 ? "Start your streak today! 🚀" : "Keep it up! 🔥"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Continue Learning</CardTitle>
            <CardDescription>
              {currentTopic && nextLesson 
                ? `Resume "${nextLesson.title}" in ${currentTopic.title}`
                : currentTopic
                  ? `You've completed all lessons in ${currentTopic.title}!`
                  : "Pick up where you left off or start something new"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {currentTopic && nextLesson ? (
              <Link href={`/dashboard/topics/${currentTopic.id}/lessons/${nextLesson.id}`}>
                <Button className="w-full bg-orange-500 hover:bg-orange-600">
                  <PlayCircle className="mr-2 h-4 w-4" />
                  Continue Lesson
                </Button>
              </Link>
            ) : currentTopic ? (
              <Link href={`/dashboard/topics/${currentTopic.id}`}>
                <Button className="w-full bg-green-500 hover:bg-green-600">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Review Topic
                </Button>
              </Link>
            ) : (
              <Link href="/dashboard/topics">
                <Button className="w-full bg-orange-500 hover:bg-orange-600">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Browse Topics
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Practice Assessment</CardTitle>
            <CardDescription>
              {availableAssessments.length > 0 
                ? `${availableAssessments.length} assessment${availableAssessments.length > 1 ? 's' : ''} available to take`
                : "Complete lessons to unlock assessments"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {availableAssessments.length > 0 ? (
                <>
                  <Link href={`/dashboard/assessment/${assessments.find(a => a.topicId === availableAssessments[0]?.id)?.id}`}>
                    <Button className="w-full bg-blue-500 hover:bg-blue-600">
                      <Target className="mr-2 h-4 w-4" />
                      Take Assessment
                    </Button>
                  </Link>
                  {availableAssessments.length > 1 && (
                    <Link href="/dashboard/topics">
                      <Button variant="outline" className="w-full">
                        <Trophy className="mr-2 h-4 w-4" />
                        View All ({availableAssessments.length})
                      </Button>
                    </Link>
                  )}
                </>
              ) : (
                <Link href="/dashboard/topics">
                  <Button variant="outline" className="w-full">
                    <Trophy className="mr-2 h-4 w-4" />
                    View Topics
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your learning progress over the past week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userCompletions.length === 0 && userAttempts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No recent activity. Start learning to see your progress here!</p>
              </div>
            ) : (
              (() => {
                // Combine lesson completions and assessment attempts
                const recentActivities = [
                  ...userCompletions.map(completion => ({
                    ...completion,
                    type: 'lesson' as const,
                    date: new Date(completion.completedAt)
                  })),
                  ...userAttempts.map(attempt => ({
                    ...attempt,
                    type: 'assessment' as const,
                    date: new Date(attempt.completedAt)
                  }))
                ]
                
                // Sort by date (most recent first) and take last 5
                const sortedActivities = recentActivities
                  .sort((a, b) => b.date.getTime() - a.date.getTime())
                  .slice(0, 5)
                
                return sortedActivities.map((activity, index) => {
                  if (activity.type === 'lesson') {
                    const lesson = lessons.find(l => l.id === activity.lessonId)
                    const topic = topics.find(t => t.id === activity.topicId)
                    
                    return (
                      <div key={`lesson-${activity.id}`} className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            Completed "{lesson?.title || 'Unknown Lesson'}"
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {topic?.title || 'Unknown Topic'} • {activity.date.toLocaleDateString()}
                            {activity.timeSpent && ` • ${Math.round(activity.timeSpent)} min`}
                          </p>
                        </div>
                        <Badge variant="default">
                          Completed
                        </Badge>
                      </div>
                    )
                  } else {
                    const assessment = assessments.find(a => a.id === activity.assessmentId)
                    const topic = topics.find(t => t.id === activity.topicId)
                    const scorePercentage = Math.round((activity.correctAnswers / activity.totalQuestions) * 100)
                    const isPassed = scorePercentage >= 70
                    const cooldownCheck = canTakeAssessment(user.id, activity.assessmentId)
                    
                    return (
                      <div key={`assessment-${activity.id}`} className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className={`w-2 h-2 ${isPassed ? 'bg-blue-500' : 'bg-red-500'} rounded-full`}></div>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            Assessment: {topic?.title || 'Unknown Topic'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Score: {scorePercentage}% ({activity.correctAnswers}/{activity.totalQuestions}) • {activity.date.toLocaleDateString()}
                            {activity.timeSpent && ` • ${Math.round(activity.timeSpent / 60)} min`}
                          </p>
                          {!cooldownCheck.canTake && cooldownCheck.timeRemaining && (
                            <div className="mt-1">
                              <CooldownTimer 
                                endTime={new Date(Date.now() + (cooldownCheck.timeRemaining * 60 * 1000))}
                                className="text-xs"
                              />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          <Badge variant={isPassed ? "default" : "destructive"}>
                            {scorePercentage}%
                          </Badge>
                          {isPassed && (
                            <Badge variant="outline" className="text-xs">
                              <Award className="w-3 h-3 mr-1" />
                              Passed
                            </Badge>
                          )}
                        </div>
                      </div>
                    )
                  }
                })
              })()
            )}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Progress Tracker Toggle */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle>Detailed Progress Analytics</CardTitle>
              <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-800/20 dark:text-amber-200">
                Beta
              </Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEnhancedProgress(!showEnhancedProgress)}
              className="flex items-center space-x-2"
            >
              <BarChart3 className="w-4 h-4" />
              <span>{showEnhancedProgress ? "Hide" : "Show"} Analytics</span>
            </Button>
          </div>
        </CardHeader>
        {showEnhancedProgress && (
          <CardContent className="pt-0">
            <EnhancedProgressTracker />
          </CardContent>
        )}
      </Card>
    </div>
  )
}
