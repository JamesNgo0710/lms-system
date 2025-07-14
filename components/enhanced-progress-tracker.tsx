"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ProgressRing } from "@/components/progress-ring"
import { Trophy } from "lucide-react"
import { Target } from "lucide-react" 
import { Clock } from "lucide-react"
import { Fire } from "lucide-react"
import { Calendar } from "lucide-react"
import { TrendingUp } from "lucide-react"
import { BookOpen } from "lucide-react"
import { CheckCircle } from "lucide-react"
import { Star } from "lucide-react"
import { Award } from "lucide-react"
import { Zap } from "lucide-react"
import { AlertTriangle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useTopics, useLessonCompletions } from "@/hooks/use-data-store"
import Link from "next/link"

interface ProgressMetrics {
  totalTopics: number
  completedTopics: number
  totalLessons: number
  completedLessons: number
  overallProgress: number
  weeklyGoal: number
  weeklyProgress: number
  streak: number
  xpPoints: number
  level: number
  nextLevelXP: number
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  unlocked: boolean
  unlockedAt?: Date
}

export function EnhancedProgressTracker() {
  const { data: session } = useSession()
  const user = session?.user
  const { topics } = useTopics()
  const { completions, getTopicProgress } = useLessonCompletions()
  const [isHydrated, setIsHydrated] = useState(false)
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)

  // ALL useEffect hooks must be at the top level
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Calculate progress metrics (moved before useEffect hooks that depend on them)
  const userCompletions = isHydrated && user ? completions.filter(c => c.userId === user.id) : []
  
  const completedTopics = isHydrated && user ? topics.filter(topic => {
    const progress = getTopicProgress(user.id, topic.id)
    return progress.percentage === 100
  }) : []

  const totalLessons = topics.reduce((sum, topic) => sum + (topic.lessons || 0), 0)
  const completedLessons = userCompletions.length

  // Calculate XP and level system
  const xpPerLesson = 100
  const xpPerTopic = 500
  const totalXP = completedLessons * xpPerLesson + completedTopics.length * xpPerTopic
  const level = Math.floor(totalXP / 1000) + 1
  const nextLevelXP = level * 1000
  const currentLevelProgress = ((totalXP % 1000) / 1000) * 100

  // Calculate weekly progress
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  const weeklyCompletions = userCompletions.filter(c => 
    new Date(c.completedAt) >= oneWeekAgo
  ).length
  const weeklyGoal = 5 // 5 lessons per week
  const weeklyProgress = Math.min((weeklyCompletions / weeklyGoal) * 100, 100)

  // Calculate streak
  const calculateStreak = () => {
    const uniqueDays = new Set(
      userCompletions.map(c => new Date(c.completedAt).toDateString())
    )
    
    let streak = 0
    const today = new Date()
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today)
      checkDate.setDate(today.getDate() - i)
      const dateString = checkDate.toDateString()
      
      if (uniqueDays.has(dateString)) {
        streak++
      } else if (i > 0) {
        break
      }
    }
    
    return streak
  }

  const streak = calculateStreak()

  const metrics: ProgressMetrics = {
    totalTopics: topics.length,
    completedTopics: completedTopics.length,
    totalLessons,
    completedLessons,
    overallProgress: Math.round(topics.length > 0 ? (completedTopics.length / topics.length) * 100 : 0),
    weeklyGoal,
    weeklyProgress,
    streak,
    xpPoints: totalXP,
    level,
    nextLevelXP
  }

  // Define achievements with safe icon references
  const achievements: Achievement[] = [
    {
      id: "first_lesson",
      title: "Getting Started",
      description: "Complete your first lesson",
      icon: BookOpen || Trophy, // Fallback to Trophy if BookOpen is undefined
      unlocked: completedLessons >= 1
    },
    {
      id: "first_topic", 
      title: "Topic Master",
      description: "Complete your first topic",
      icon: Trophy || Star, // Fallback to Star if Trophy is undefined
      unlocked: completedTopics.length >= 1
    },
    {
      id: "week_warrior",
      title: "Week Warrior", 
      description: "Complete 5 lessons in a week",
      icon: Target || Trophy,
      unlocked: weeklyCompletions >= 5
    },
    {
      id: "streak_starter",
      title: "Streak Starter",
      description: "Maintain a 3-day learning streak",
      icon: Fire || Trophy,
      unlocked: streak >= 3
    },
    {
      id: "streak_master",
      title: "Streak Master",
      description: "Maintain a 7-day learning streak",
      icon: Zap || Trophy,
      unlocked: streak >= 7
    },
    {
      id: "half_way",
      title: "Halfway Hero",
      description: "Complete 50% of all topics",
      icon: Star || Trophy,
      unlocked: metrics.overallProgress >= 50
    },
    {
      id: "completionist",
      title: "Completionist",
      description: "Complete all available topics",
      icon: Award || Trophy,
      unlocked: metrics.overallProgress === 100
    }
  ]

  // Check for new achievements - must be after calculations but before early return
  useEffect(() => {
    if (!isHydrated || !user) return
    
    const checkNewAchievements = async () => {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      
      try {
        // Get user's current achievements from API
        const response = await fetch(`${API_URL}/api/users/${user.id}/achievements`, {
          headers: {
            'Authorization': `Bearer ${(session as any)?.accessToken}`,
            'Accept': 'application/json',
          },
        })
        
        if (response.ok) {
          const userAchievements = await response.json()
          const achievementIds = userAchievements.map((ua: any) => ua.achievement_id)
          
          const newlyUnlocked = achievements.find(achievement => 
            achievement.unlocked && 
            !achievementIds.includes(parseInt(achievement.id))
          )
          
          if (newlyUnlocked) {
            setNewAchievement(newlyUnlocked)
            setTimeout(() => setNewAchievement(null), 5000)
          }
        }
      } catch (error) {
        console.error('Error checking achievements:', error)
      }
    }
    
    checkNewAchievements()
  }, [achievements, user?.id, isHydrated, session])

  // Trigger celebration for milestones
  useEffect(() => {
    if (!isHydrated || !user) return
    
    const milestones = [25, 50, 75, 100]
    if (milestones.includes(metrics.overallProgress)) {
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 3000)
    }
  }, [metrics.overallProgress, isHydrated, user])

  // Early return after all hooks are declared
  if (!isHydrated || !user) {
    return <div className="animate-pulse h-96 bg-gray-100 rounded-lg" />
  }

  return (
    <div className="space-y-6">
      {/* Beta Notice */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <div>
            <h3 className="font-semibold text-amber-800 dark:text-amber-200">
              🚧 Beta Feature - Work in Progress
            </h3>
            <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
              The detailed progress analytics are currently in beta development. Advanced features and visualizations may be incomplete or subject to change.
            </p>
          </div>
        </div>
      </div>

      {/* Achievement Notification */}
      <AnimatePresence>
        {newAchievement && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-4 right-4 z-50 max-w-sm"
          >
            <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-yellow-300 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/20 rounded-full">
                    {newAchievement.icon ? (
                      <newAchievement.icon className="w-6 h-6" />
                    ) : (
                      <Trophy className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold">🎉 Achievement Unlocked!</h4>
                    <p className="text-sm opacity-90">{newAchievement.title}</p>
                    <p className="text-xs opacity-75">{newAchievement.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Celebration for milestones */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none"
          >
            <div className="text-6xl animate-bounce">🎉</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overall Progress Overview */}
      <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <ProgressRing 
                progress={metrics.overallProgress}
                size={100}
                color="orange"
                animated={true}
              />
              
              <div>
                <h3 className="text-2xl font-bold text-orange-800">
                  Learning Progress
                </h3>
                <p className="text-orange-600 mb-2">
                  {metrics.completedTopics} of {metrics.totalTopics} topics completed
                </p>
                <div className="flex items-center space-x-4 text-sm text-orange-700">
                  <div className="flex items-center space-x-1">
                    {BookOpen ? <BookOpen className="w-4 h-4" /> : <Trophy className="w-4 h-4" />}
                    <span>{metrics.completedLessons}/{metrics.totalLessons} lessons</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {Star ? <Star className="w-4 h-4" /> : <Trophy className="w-4 h-4" />}
                    <span>Level {metrics.level}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {Zap ? <Zap className="w-4 h-4" /> : <Trophy className="w-4 h-4" />}
                    <span>{metrics.xpPoints} XP</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm text-orange-600 mb-1">Next Level</div>
              <div className="text-lg font-semibold text-orange-800">
                {metrics.nextLevelXP - metrics.xpPoints} XP
              </div>
              <Progress 
                value={currentLevelProgress} 
                className="w-32 h-2 mt-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Weekly Goal */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Goal</CardTitle>
            {Target ? <Target className="h-4 w-4 text-muted-foreground" /> : <Trophy className="h-4 w-4 text-muted-foreground" />}
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl font-bold">
                {weeklyCompletions}/{metrics.weeklyGoal}
              </div>
              <Badge variant={weeklyProgress >= 100 ? "default" : "secondary"}>
                {Math.round(weeklyProgress)}%
              </Badge>
            </div>
            <Progress value={weeklyProgress} className="h-2 mb-2" />
            <p className="text-xs text-muted-foreground">
              {weeklyProgress >= 100 
                ? "🎯 Goal achieved this week!" 
                : `${metrics.weeklyGoal - weeklyCompletions} lessons to go`
              }
            </p>
          </CardContent>
        </Card>

        {/* Learning Streak */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Learning Streak</CardTitle>
            {Fire ? <Fire className="h-4 w-4 text-muted-foreground" /> : <Trophy className="h-4 w-4 text-muted-foreground" />}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center space-x-2">
              <span>{metrics.streak}</span>
              {metrics.streak > 0 && <span className="text-orange-500">🔥</span>}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.streak === 0 
                ? "Start your streak today!" 
                : metrics.streak === 1 
                  ? "Keep it going!"
                  : `${metrics.streak} days strong!`
              }
            </p>
            {metrics.streak >= 3 && (
              <Badge variant="outline" className="mt-2 text-xs">
                {Fire ? <Fire className="w-3 h-3 mr-1" /> : <Trophy className="w-3 h-3 mr-1" />}
                On Fire!
              </Badge>
            )}
          </CardContent>
        </Card>

        {/* XP & Level */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Experience Points</CardTitle>
            {Star ? <Star className="h-4 w-4 text-muted-foreground" /> : <Trophy className="h-4 w-4 text-muted-foreground" />}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.xpPoints}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Level {metrics.level} • {metrics.nextLevelXP - metrics.xpPoints} XP to next level
            </p>
            <div className="mt-2">
              <Progress value={currentLevelProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {Trophy ? <Trophy className="w-5 h-5" /> : <div className="w-5 h-5 bg-yellow-500 rounded" />}
            <span>Achievements</span>
            <Badge variant="outline">
              {achievements.filter(a => a.unlocked).length}/{achievements.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <motion.div
                key={achievement.id}
                className={cn(
                  "p-4 rounded-lg border transition-all",
                  achievement.unlocked
                    ? "bg-green-50 border-green-200"
                    : "bg-gray-50 border-gray-200 opacity-60"
                )}
                whileHover={{ scale: achievement.unlocked ? 1.02 : 1 }}
              >
                <div className="flex items-start space-x-3">
                  <div className={cn(
                    "p-2 rounded-full",
                    achievement.unlocked 
                      ? "bg-green-500 text-white" 
                      : "bg-gray-300 text-gray-500"
                  )}>
                    {achievement.icon ? (
                      <achievement.icon className="w-4 h-4" />
                    ) : (
                      <Trophy className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className={cn(
                      "font-semibold text-sm",
                      achievement.unlocked ? "text-green-800" : "text-gray-500"
                    )}>
                      {achievement.title}
                    </h4>
                    <p className={cn(
                      "text-xs mt-1",
                      achievement.unlocked ? "text-green-600" : "text-gray-400"
                    )}>
                      {achievement.description}
                    </p>
                    {achievement.unlocked && (
                      <Badge variant="outline" className="mt-2 text-xs bg-green-100">
                        Unlocked!
                      </Badge>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}