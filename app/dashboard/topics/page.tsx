"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Users, Star, Search, CheckCircle, Map } from "lucide-react"
import Link from "next/link"
import { LearningJourneyMap } from "@/components/learning-journey-map"
import { apiDataStore } from "@/lib/api-data-store"

export default function TopicsPage() {
  const { data: session } = useSession()
  const user = session?.user
  
  // Simple state - no complex hooks
  const [topics, setTopics] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [difficultyFilter, setDifficultyFilter] = useState("all")
  const [isHydrated, setIsHydrated] = useState(false)
  const [viewMode, setViewMode] = useState<"journey" | "grid">("grid")
  const [progressData, setProgressData] = useState<Record<string, any>>({})

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Load topics directly without complex hooks
  useEffect(() => {
    if (session?.user) {
      loadTopicsData()
    }
  }, [session?.user])

  const loadTopicsData = async () => {
    try {
      setLoading(true)
      
      // Get topics directly from API
      const topicsData = await apiDataStore.getTopics()
      
      // Normalize and clean topic data
      const cleanTopics = topicsData
        .filter(topic => topic && typeof topic === 'object' && topic.id)
        .map(topic => ({
          id: String(topic.id || ''),
          title: String(topic.title || 'Untitled Topic'),
          description: String(topic.description || 'Comprehensive learning material covering all essential concepts.'),
          category: String(topic.category || 'General'),
          difficulty: String(topic.difficulty || 'Beginner'),
          status: String(topic.status || 'Draft'),
          image: String(topic.image || '/placeholder.svg?height=200&width=300'),
          lessons: Number(topic.lessons || 0),
          students: Number(topic.students || 0),
          hasAssessment: Boolean(topic.hasAssessment || false)
        }))

      setTopics(cleanTopics)
      
      // Load progress data for students
      if (user?.role === "student" && user.id) {
        await loadProgressData(cleanTopics, user.id)
      }
      
    } catch (error) {
      console.error('Error loading topics:', error)
      setTopics([])
    } finally {
      setLoading(false)
    }
  }

  const loadProgressData = async (topicsData: any[], userId: string) => {
    const progressMap: Record<string, any> = {}
    
    for (const topic of topicsData) {
      try {
        // Get lessons for this topic
        const lessons = await apiDataStore.getLessonsByTopic(Number(topic.id))
        const publishedLessons = lessons.filter(lesson => lesson?.status === 'Published')
        
        // Get user completions
        const completions = await apiDataStore.getUserLessonCompletions(userId)
        const topicCompletions = completions.filter(completion => 
          Number(completion?.topicId) === Number(topic.id) && completion?.isCompleted
        )
        
        const total = publishedLessons.length
        const completed = topicCompletions.length
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
        
        progressMap[topic.id] = {
          completed,
          total,
          percentage,
          isCompleted: percentage === 100
        }
      } catch (error) {
        // Set default progress if error
        progressMap[topic.id] = {
          completed: 0,
          total: 0,
          percentage: 0,
          isCompleted: false
        }
      }
    }
    
    setProgressData(progressMap)
  }

  // Handle loading state
  if (!isHydrated || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Loading topics...</h2>
        </div>
      </div>
    )
  }

  // Get categories for filters
  const categories = Array.from(new Set(
    topics
      .filter(topic => topic.category)
      .map(topic => topic.category)
  ))
  
  const difficulties = ["Beginner", "Intermediate", "Advanced"]

  // Filter topics
  const filteredTopics = topics.filter(topic => {
    const searchLower = searchTerm.toLowerCase()
    const matchesSearch = 
      topic.title.toLowerCase().includes(searchLower) ||
      topic.description.toLowerCase().includes(searchLower)
    const matchesCategory = categoryFilter === "all" || topic.category === categoryFilter
    const matchesDifficulty = difficultyFilter === "all" || topic.difficulty === difficultyFilter
    
    return matchesSearch && matchesCategory && matchesDifficulty
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Learning Topics</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {viewMode === "journey" 
              ? "Follow your personalized learning path"
              : "Explore our comprehensive learning materials"
            }
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="flex items-center space-x-1"
            >
              <BookOpen className="w-4 h-4" />
              <span>Grid</span>
            </Button>
            <Button
              variant={viewMode === "journey" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("journey")}
              className="flex items-center space-x-1"
            >
              <Map className="w-4 h-4" />
              <span>Journey</span>
              <Badge variant="secondary" className="ml-1 text-xs bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                Beta
              </Badge>
            </Button>
          </div>
          <Badge variant="outline" className="text-sm">
            {filteredTopics.length} Topics Available
          </Badge>
        </div>
      </div>

      {/* Filters - Only show in grid mode */}
      {viewMode === "grid" && (
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  maxLength={100}
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="All Difficulties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Difficulties</SelectItem>
                  {difficulties.map((difficulty) => (
                    <SelectItem key={difficulty} value={difficulty}>
                      {difficulty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content based on view mode */}
      {viewMode === "journey" ? (
        <LearningJourneyMap topics={topics} />
      ) : (
        <Card>
          <CardContent className="p-6">
            {filteredTopics.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">No topics found</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {searchTerm ? "Try adjusting your search terms or filters." : "No topics available at the moment."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredTopics.map((topic) => {
                  // Get progress for this topic
                  const progress = progressData[topic.id] || {
                    completed: 0,
                    total: 0,
                    percentage: 0,
                    isCompleted: false
                  }
                  
                  return (
                    <Link key={topic.id} href={`/dashboard/topics/${topic.id}`} className="block">
                      <Card className="overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer h-full">
                        <div className="aspect-video bg-gradient-to-br from-orange-400 to-orange-600 relative">
                          <img
                            src={topic.image}
                            alt={topic.title}
                            className="w-full h-full object-cover opacity-80"
                          />
                          <div className="absolute inset-0 bg-black/20" />
                          <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
                            <div className="flex flex-col space-y-2">
                              <Badge variant="secondary" className="bg-white/20 text-white w-fit">
                                {topic.category}
                              </Badge>
                              <Badge
                                variant="secondary"
                                className={`w-fit ${
                                  topic.difficulty === "Beginner"
                                    ? "bg-green-500/80 text-white"
                                    : topic.difficulty === "Intermediate"
                                      ? "bg-yellow-500/80 text-white"
                                      : "bg-red-500/80 text-white"
                                }`}
                              >
                                {topic.difficulty}
                              </Badge>
                            </div>
                            {user?.role === "student" && progress.isCompleted && (
                              <Badge className="bg-green-500">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Completed
                              </Badge>
                            )}
                          </div>
                          <div className="absolute bottom-4 left-4 right-4">
                            <h3 className="text-white font-bold text-xl mb-2 group-hover:text-orange-200 transition-colors">
                              {topic.title}
                            </h3>
                            <div className="flex items-center justify-between text-white/80 text-sm">
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-1">
                                  <BookOpen className="w-4 h-4" />
                                  <span>{topic.lessons} lessons</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Users className="w-4 h-4" />
                                  <span>{topic.students}</span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span>4.8</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <CardContent className="p-6">
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                            {topic.description}
                          </p>

                          {/* Progress for students */}
                          {user?.role === "student" && (
                            <div className="mb-4">
                              <div className="flex items-center justify-between text-sm mb-2">
                                <span className="text-gray-600 dark:text-gray-400">Progress</span>
                                <span className="font-medium text-orange-600">{progress.percentage}%</span>
                              </div>
                              <Progress value={progress.percentage} className="h-2" />
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {progress.completed} of {progress.total} lessons completed
                              </p>
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              {user?.role !== "student" && (
                                <Badge variant={topic.status === "Published" ? "default" : "secondary"} className="text-xs">
                                  {topic.status}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              <Button
                                size="sm"
                                className={
                                  user?.role === "student" && progress.isCompleted
                                    ? "bg-green-500 hover:bg-green-600"
                                    : "bg-orange-500 hover:bg-orange-600"
                                }
                                onClick={(e) => {
                                  e.preventDefault()
                                  window.location.href = `/dashboard/topics/${topic.id}`
                                }}
                              >
                                {user?.role === "student" && progress.isCompleted ? "Review" : "Start Learning"}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}