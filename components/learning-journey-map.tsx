"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Lock, PlayCircle, Clock, Star, Trophy, ChevronRight, Info } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { useTopics, useLessonCompletions } from "@/hooks/use-data-store"
import { CourseMetadata } from "@/components/course-metadata"
import type { Topic } from "@/lib/data-store"

interface LearningJourneyMapProps {
  topics: Topic[]
  className?: string
}

interface TopicWithProgress extends Topic {
  progress: {
    completed: number
    total: number
    percentage: number
  }
  isCompleted: boolean
  isUnlocked: boolean
  position: number
  totalTopics: number
}

export function LearningJourneyMap({ topics, className }: LearningJourneyMapProps) {
  const { data: session } = useSession()
  const user = session?.user
  const { getTopicProgress } = useLessonCompletions()
  const [isHydrated, setIsHydrated] = useState(false)
  const [completedMilestone, setCompletedMilestone] = useState<number | null>(null)
  const [expandedTopic, setExpandedTopic] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (!isHydrated || !user) {
    return <div className="animate-pulse h-96 bg-gray-100 rounded-lg" />
  }

  // Calculate progress for each topic and determine unlock status
  const topicsWithProgress: TopicWithProgress[] = topics.map((topic, index) => {
    const progress = getTopicProgress(user.id, topic.id)
    const isCompleted = progress.percentage === 100
    
    // Simple unlock logic: first topic is always unlocked, others unlock when previous is completed
    const isUnlocked = index === 0 || 
      (index > 0 && getTopicProgress(user.id, topics[index - 1].id).percentage === 100)

    return {
      ...topic,
      progress,
      isCompleted,
      isUnlocked,
      position: index + 1,
      totalTopics: topics.length
    }
  })

  // Trigger celebration animation when a milestone is reached
  useEffect(() => {
    if (!isHydrated || !user) return
    
    const completedCount = topicsWithProgress.filter(t => t.isCompleted).length
    const milestones = [1, 3, 5, 10] // Celebrate at these completion counts
    
    if (milestones.includes(completedCount) && completedMilestone !== completedCount) {
      setCompletedMilestone(completedCount)
      setTimeout(() => setCompletedMilestone(null), 3000) // Clear after 3 seconds
    }
  }, [topicsWithProgress, completedMilestone, isHydrated, user])

  const totalProgress = Math.round(
    (topicsWithProgress.filter(t => t.isCompleted).length / topicsWithProgress.length) * 100
  )

  return (
    <div className={cn("space-y-6", className)}>
      {/* Journey Overview */}
      <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-orange-800">Your Learning Journey</h2>
              <p className="text-orange-600">
                {topicsWithProgress.filter(t => t.isCompleted).length} of {topicsWithProgress.length} topics completed
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-orange-600">{totalProgress}%</div>
              <div className="text-sm text-orange-500">Overall Progress</div>
            </div>
          </div>
          
          <Progress value={totalProgress} className="h-3 mb-2" />
          
          {/* Milestone celebration */}
          <AnimatePresence>
            {completedMilestone && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg"
              >
                <div className="flex items-center space-x-2 text-yellow-800">
                  <Trophy className="w-5 h-5" />
                  <span className="font-semibold">
                    🎉 Milestone Reached! You've completed {completedMilestone} topic{completedMilestone > 1 ? 's' : ''}!
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Learning Path Visualization */}
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute left-8 top-16 bottom-0 w-0.5 bg-gray-200 z-0" />
        <div 
          className="absolute left-8 top-16 w-0.5 bg-gradient-to-b from-orange-400 to-orange-600 z-10 transition-all duration-1000"
          style={{ 
            height: `${(topicsWithProgress.filter(t => t.isCompleted).length / topicsWithProgress.length) * 100}%` 
          }}
        />

        {/* Topic Cards */}
        <div className="space-y-6">
          {topicsWithProgress.map((topic, index) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative flex items-start space-x-6"
            >
              {/* Position Indicator */}
              <div className="relative z-20 flex-shrink-0">
                <motion.div
                  className={cn(
                    "w-16 h-16 rounded-full border-4 flex items-center justify-center font-bold text-lg",
                    topic.isCompleted
                      ? "bg-green-500 border-green-400 text-white"
                      : topic.isUnlocked
                        ? "bg-orange-500 border-orange-400 text-white"
                        : "bg-gray-300 border-gray-200 text-gray-500"
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {topic.isCompleted ? (
                    <CheckCircle className="w-8 h-8" />
                  ) : topic.isUnlocked ? (
                    <span>{topic.position}</span>
                  ) : (
                    <Lock className="w-6 h-6" />
                  )}
                </motion.div>
                
                {/* Completion celebration */}
                {topic.isCompleted && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.2, 1] }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center"
                  >
                    <Star className="w-4 h-4 text-yellow-800 fill-current" />
                  </motion.div>
                )}
              </div>

              {/* Topic Card */}
              <Card 
                className={cn(
                  "flex-1 transition-all duration-300 cursor-pointer",
                  topic.isCompleted
                    ? "border-green-200 bg-green-50 shadow-md"
                    : topic.isUnlocked
                      ? "border-orange-200 bg-orange-50 shadow-md hover:shadow-lg active:scale-[0.98]"
                      : "border-gray-200 bg-gray-50 opacity-60",
                  isMobile && "touch-manipulation"
                )}
                onClick={() => {
                  if (isMobile && topic.isUnlocked) {
                    setExpandedTopic(expandedTopic === topic.id ? null : topic.id)
                  }
                }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold">{topic.title}</h3>
                        <Badge variant="outline" className="text-xs">
                          {topic.position} of {topic.totalTopics}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {topic.description || "Comprehensive learning material covering essential concepts."}
                      </p>

                      {/* Topic Metadata */}
                      <div className="mb-4">
                        <CourseMetadata topic={topic} showDetailed={false} />
                      </div>

                      {/* Progress for unlocked topics */}
                      {topic.isUnlocked && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-gray-600">Progress</span>
                            <span className={cn(
                              "font-medium",
                              topic.isCompleted ? "text-green-600" : "text-orange-600"
                            )}>
                              {topic.progress.percentage}%
                            </span>
                          </div>
                          <Progress 
                            value={topic.progress.percentage} 
                            className={cn(
                              "h-2",
                              topic.isCompleted && "bg-green-100"
                            )}
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            {topic.progress.completed} of {topic.progress.total} lessons completed
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="ml-4 flex items-center space-x-2">
                      {/* Mobile expand indicator */}
                      {isMobile && topic.isUnlocked && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-2"
                          onClick={(e) => {
                            e.stopPropagation()
                            setExpandedTopic(expandedTopic === topic.id ? null : topic.id)
                          }}
                        >
                          <motion.div
                            animate={{ rotate: expandedTopic === topic.id ? 90 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronRight className="w-4 h-4" />
                          </motion.div>
                        </Button>
                      )}
                      
                      {/* Main action button */}
                      <div>
                        {topic.isCompleted ? (
                          <Link href={`/dashboard/topics/${topic.id}`}>
                            <Button 
                              size={isMobile ? "default" : "sm"} 
                              className="bg-green-500 hover:bg-green-600 touch-manipulation"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Review
                            </Button>
                          </Link>
                        ) : topic.isUnlocked ? (
                          <Link href={`/dashboard/topics/${topic.id}`}>
                            <Button 
                              size={isMobile ? "default" : "sm"} 
                              className="bg-orange-500 hover:bg-orange-600 touch-manipulation"
                            >
                              <PlayCircle className="w-4 h-4 mr-1" />
                              {topic.progress.completed > 0 ? "Continue" : "Start"}
                            </Button>
                          </Link>
                        ) : (
                          <Button size={isMobile ? "default" : "sm"} variant="outline" disabled>
                            <Lock className="w-4 h-4 mr-1" />
                            Locked
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Mobile Expanded Content */}
                  <AnimatePresence>
                    {isMobile && expandedTopic === topic.id && topic.isUnlocked && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 border-t border-gray-200 mt-4">
                          <CourseMetadata topic={topic} showDetailed={true} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Prerequisites for locked topics */}
                  {!topic.isUnlocked && index > 0 && (
                    <div className="text-xs text-gray-500 bg-gray-100 p-2 rounded">
                      Complete "{topics[index - 1].title}" to unlock this topic
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Journey Complete Celebration */}
        {totalProgress === 100 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 text-center"
          >
            <Card className="bg-gradient-to-r from-green-400 to-green-600 text-white">
              <CardContent className="p-8">
                <Trophy className="w-16 h-16 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">🎉 Journey Complete!</h3>
                <p className="text-green-100">
                  Congratulations! You've completed all learning topics. You're now ready for advanced challenges!
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}