"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Clock, 
  Users, 
  Star, 
  Target, 
  BookOpen, 
  Video, 
  FileText, 
  Trophy,
  TrendingUp,
  User,
  Calendar,
  Zap
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Topic } from "@/lib/data-store"

interface CourseMetadataProps {
  topic: Topic
  showDetailed?: boolean
  className?: string
}

interface TimeEstimate {
  total: string
  lessons: string
  practice: string
  assessment: string
}

interface SkillOutcome {
  skill: string
  level: "Beginner" | "Intermediate" | "Advanced"
  description: string
}

export function CourseMetadata({ topic, showDetailed = false, className }: CourseMetadataProps) {
  // Calculate estimated time based on topic data
  const estimateTime = (lessons: number): TimeEstimate => {
    const avgLessonTime = 15 // minutes per lesson
    const practiceTime = lessons * 5 // 5 minutes practice per lesson
    const assessmentTime = topic.hasAssessment ? 30 : 0 // 30 minutes for assessment
    
    const totalMinutes = lessons * avgLessonTime + practiceTime + assessmentTime
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    
    return {
      total: `${hours}h ${minutes}m`,
      lessons: `${Math.round(lessons * avgLessonTime / 60 * 10) / 10}h`,
      practice: `${Math.round(practiceTime / 60 * 10) / 10}h`,
      assessment: assessmentTime > 0 ? `${assessmentTime}m` : "None"
    }
  }

  // Generate skill outcomes based on topic
  const getSkillOutcomes = (topic: Topic): SkillOutcome[] => {
    const baseSkills: SkillOutcome[] = [
      {
        skill: "Theoretical Knowledge",
        level: topic.difficulty as "Beginner" | "Intermediate" | "Advanced",
        description: `Master core concepts in ${topic.category}`
      },
      {
        skill: "Practical Application",
        level: topic.difficulty === "Beginner" ? "Beginner" : 
               topic.difficulty === "Advanced" ? "Advanced" : "Intermediate",
        description: "Apply knowledge to real-world scenarios"
      }
    ]

    // Add category-specific skills
    if (topic.category === "Technology") {
      baseSkills.push({
        skill: "Technical Implementation",
        level: topic.difficulty as "Beginner" | "Intermediate" | "Advanced",
        description: "Implement technical solutions effectively"
      })
    } else if (topic.category === "Business") {
      baseSkills.push({
        skill: "Strategic Thinking",
        level: topic.difficulty as "Beginner" | "Intermediate" | "Advanced", 
        description: "Develop business strategies and insights"
      })
    }

    return baseSkills
  }

  const timeEstimate = estimateTime(topic.lessons || 0)
  const skillOutcomes = getSkillOutcomes(topic)
  
  // Difficulty color mapping
  const difficultyColors = {
    Beginner: {
      bg: "bg-green-100",
      text: "text-green-800",
      border: "border-green-200",
      icon: "text-green-600"
    },
    Intermediate: {
      bg: "bg-yellow-100", 
      text: "text-yellow-800",
      border: "border-yellow-200",
      icon: "text-yellow-600"
    },
    Advanced: {
      bg: "bg-red-100",
      text: "text-red-800", 
      border: "border-red-200",
      icon: "text-red-600"
    }
  }

  const difficultyStyle = difficultyColors[topic.difficulty as keyof typeof difficultyColors]

  if (!showDetailed) {
    // Compact metadata view
    return (
      <div className={cn("flex items-center space-x-4 text-sm", className)}>
        <div className="flex items-center space-x-1 text-gray-600">
          <Clock className="w-4 h-4" />
          <span>{timeEstimate.total}</span>
        </div>
        
        <div className="flex items-center space-x-1 text-gray-600">
          <BookOpen className="w-4 h-4" />
          <span>{topic.lessons} lessons</span>
        </div>
        
        <Badge 
          variant="outline" 
          className={cn(
            "text-xs",
            difficultyStyle.bg,
            difficultyStyle.text,
            difficultyStyle.border
          )}
        >
          {topic.difficulty}
        </Badge>
        
        <div className="flex items-center space-x-1 text-gray-600">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span>4.8</span>
        </div>
        
        <div className="flex items-center space-x-1 text-gray-600">
          <Users className="w-4 h-4" />
          <span>{topic.students}</span>
        </div>
      </div>
    )
  }

  // Detailed metadata view
  return (
    <div className={cn("space-y-6", className)}>
      {/* Time Breakdown */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Clock className="w-5 h-5 text-blue-600" />
            <h4 className="font-semibold">Time Investment</h4>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{timeEstimate.total}</div>
              <div className="text-xs text-gray-500">Total Time</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">{timeEstimate.lessons}</div>
              <div className="text-xs text-gray-500">Lessons</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">{timeEstimate.practice}</div>
              <div className="text-xs text-gray-500">Practice</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">{timeEstimate.assessment}</div>
              <div className="text-xs text-gray-500">Assessment</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Difficulty & Prerequisites */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Target className={cn("w-5 h-5", difficultyStyle.icon)} />
            <h4 className="font-semibold">Difficulty Level</h4>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <Badge 
              className={cn(
                "text-sm px-3 py-1",
                difficultyStyle.bg,
                difficultyStyle.text,
                difficultyStyle.border
              )}
            >
              {topic.difficulty}
            </Badge>
            
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <TrendingUp className="w-4 h-4" />
              <span>
                {topic.difficulty === "Beginner" ? "Perfect for newcomers" :
                 topic.difficulty === "Intermediate" ? "Some experience helpful" :
                 "Advanced knowledge required"}
              </span>
            </div>
          </div>

          {topic.difficulty !== "Beginner" && (
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="text-sm font-medium mb-1">Prerequisites:</div>
              <div className="text-sm text-gray-600">
                {topic.difficulty === "Intermediate" 
                  ? `Basic understanding of ${topic.category} concepts`
                  : `Advanced experience in ${topic.category} and related technologies`
                }
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Content Types */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Video className="w-5 h-5 text-purple-600" />
            <h4 className="font-semibold">Content Types</h4>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="flex items-center space-x-2 p-2 bg-purple-50 rounded">
              <Video className="w-4 h-4 text-purple-600" />
              <span className="text-sm">Video Lessons</span>
            </div>
            <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded">
              <FileText className="w-4 h-4 text-blue-600" />
              <span className="text-sm">Reading Materials</span>
            </div>
            <div className="flex items-center space-x-2 p-2 bg-green-50 rounded">
              <Zap className="w-4 h-4 text-green-600" />
              <span className="text-sm">Interactive Exercises</span>
            </div>
            {topic.hasAssessment && (
              <div className="flex items-center space-x-2 p-2 bg-orange-50 rounded">
                <Trophy className="w-4 h-4 text-orange-600" />
                <span className="text-sm">Final Assessment</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Learning Outcomes */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Star className="w-5 h-5 text-yellow-600" />
            <h4 className="font-semibold">Skills You'll Gain</h4>
          </div>
          
          <div className="space-y-3">
            {skillOutcomes.map((outcome, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded">
                <Badge 
                  variant="outline" 
                  className={cn(
                    "text-xs mt-0.5",
                    outcome.level === "Beginner" && "bg-green-100 text-green-800",
                    outcome.level === "Intermediate" && "bg-yellow-100 text-yellow-800", 
                    outcome.level === "Advanced" && "bg-red-100 text-red-800"
                  )}
                >
                  {outcome.level}
                </Badge>
                <div className="flex-1">
                  <div className="font-medium text-sm">{outcome.skill}</div>
                  <div className="text-xs text-gray-600 mt-1">{outcome.description}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Users className="w-5 h-5 text-green-600" />
            <h4 className="font-semibold">Course Statistics</h4>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-xl font-bold text-green-600">{topic.students}</div>
              <div className="text-xs text-gray-500">Students Enrolled</div>
            </div>
            <div>
              <div className="text-xl font-bold text-blue-600">4.8</div>
              <div className="text-xs text-gray-500">Average Rating</div>
            </div>
            <div>
              <div className="text-xl font-bold text-purple-600">87%</div>
              <div className="text-xs text-gray-500">Completion Rate</div>
            </div>
            <div>
              <div className="text-xl font-bold text-orange-600">
                {topic.hasAssessment ? "Yes" : "No"}
              </div>
              <div className="text-xs text-gray-500">Certificate Available</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}