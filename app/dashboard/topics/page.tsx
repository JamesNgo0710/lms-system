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
import { useTopics, useLessonCompletions, useLessons } from "@/hooks/use-api-data-store"
import { LearningJourneyMap } from "@/components/learning-journey-map"

export default function TopicsPage() {
  // console.log('🔍 TopicsPage component starting...')
  
  const { data: session } = useSession()
  const user = session?.user
  
  // Safe hook loading with error handling
  let topics, topicsLoading, getTopicProgress, getLessonsByTopicId, getUserLessonCompletions
  try {
    const topicsHook = useTopics()
    topics = topicsHook.topics
    topicsLoading = topicsHook.loading
    
    const completionsHook = useLessonCompletions()
    getTopicProgress = completionsHook.getTopicProgress
    getUserLessonCompletions = completionsHook.getUserLessonCompletions
    
    const lessonsHook = useLessons()
    getLessonsByTopicId = lessonsHook.getLessonsByTopicId
  } catch (error) {
    // Provide safe defaults if hooks fail
    topics = []
    topicsLoading = false
    getTopicProgress = () => ({ completed: 0, total: 0, percentage: 0 })
    getUserLessonCompletions = () => []
    getLessonsByTopicId = () => []
  }

  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [difficultyFilter, setDifficultyFilter] = useState("all")
  const [isHydrated, setIsHydrated] = useState(false)
  const [viewMode, setViewMode] = useState<"journey" | "grid">("grid")

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Add comprehensive error checks
  if (!isHydrated) {
    return <div>Loading...</div>
  }

  if (!Array.isArray(topics)) {
    // console.error('Topics is not an array:', topics)
    return <div>Error loading topics. Please refresh the page.</div>
  }

  // SAFE: Extract primitive values for categories
  let categories: string[] = []
  try {
    categories = Array.from(new Set(
      topics
        .filter(topic => topic && typeof topic === 'object' && topic.category)
        .map(topic => String(topic.category || ''))
        .filter(cat => cat.length > 0)
    ))
  } catch (error) {
    categories = []
  }
  
  const difficulties = ["Beginner", "Intermediate", "Advanced"]

  // SAFE: Filter topics with bulletproof checks
  let filteredTopics: any[] = []
  if (Array.isArray(topics)) {
    filteredTopics = topics.filter(topic => {
      if (!topic || typeof topic !== 'object' || !topic.id) return false
      
      const topicTitle = String(topic.title || '')
      const topicDescription = String(topic.description || '')
      const topicCategory = String(topic.category || '')
      const topicDifficulty = String(topic.difficulty || 'Beginner')
      
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch = 
        topicTitle.toLowerCase().includes(searchLower) ||
        topicDescription.toLowerCase().includes(searchLower)
      const matchesCategory = categoryFilter === "all" || topicCategory === categoryFilter
      const matchesDifficulty = difficultyFilter === "all" || topicDifficulty === difficultyFilter
      
      return matchesSearch && matchesCategory && matchesDifficulty
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Learning Topics</h1>
          <p className="text-gray-600">
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
            {Array.isArray(filteredTopics) ? filteredTopics.length : 0} Topics Available
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
            {!Array.isArray(filteredTopics) ? (
              <div className="text-center py-8">
                <p className="text-red-500">Error: Topics data is not properly loaded</p>
              </div>
            ) : filteredTopics.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No topics found</h3>
                <p className="text-gray-600">
                  {searchTerm ? "Try adjusting your search terms or filters." : "No topics available at the moment."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredTopics.map((topic, index) => {
                  // Safely extract only primitive values to prevent React error #31
                  const topicId = String(topic?.id || '')
                  const topicTitle = String(topic?.title || 'Untitled Topic')
                  const topicDescription = String(topic?.description || 'Comprehensive learning material covering all essential concepts and practical applications.')
                  const topicCategory = String(topic?.category || 'General')
                  const topicDifficulty = String(topic?.difficulty || 'Beginner')
                  const topicStatus = String(topic?.status || 'Draft')
                  const topicImage = String(topic?.image || '/placeholder.svg?height=200&width=300')
                  const topicLessons = Number(topic?.lessons || 0)
                  const topicStudents = Number(topic?.students || 0)
                  
                  if (!topicId) return null
                  
                  // SAFE: Calculate progress properly using both lessons and completions data
                  let progressPercentage = 0
                  let progressCompleted = 0
                  let progressTotal = 0
                  let isCompleted = false
                  
                  if (user?.id && user.role === "student" && topicId) {
                    try {
                      // Get lessons for this topic
                      const topicLessons = getLessonsByTopicId(Number(topicId)) || []
                      // Only count published lessons for students
                      const publishedLessons = topicLessons.filter(lesson => 
                        lesson && lesson.status === 'Published'
                      )
                      
                      // Get user's completions for this topic
                      const userCompletions = getUserLessonCompletions(user.id) || []
                      const topicCompletions = userCompletions.filter(completion => 
                        completion && completion.topic_id === Number(topicId)
                      )
                      
                      // Calculate progress
                      progressTotal = publishedLessons.length
                      progressCompleted = topicCompletions.length
                      progressPercentage = progressTotal > 0 ? Math.round((progressCompleted / progressTotal) * 100) : 0
                      isCompleted = progressPercentage === 100
                      
                    } catch (error) {
                      // Safe defaults if progress calculation fails
                      progressPercentage = 0
                      progressCompleted = 0
                      progressTotal = 0
                      isCompleted = false
                    }
                  }
                  
                  return (
                    <Link key={topicId} href={`/dashboard/topics/${topicId}`} className="block">
                      <Card className="overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer h-full">
                        <div className="aspect-video bg-gradient-to-br from-orange-400 to-orange-600 relative">
                          <img
                            src={topicImage}
                            alt={topicTitle}
                            className="w-full h-full object-cover opacity-80"
                          />
                          <div className="absolute inset-0 bg-black/20" />
                          <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
                            <div className="flex flex-col space-y-2">
                              <Badge variant="secondary" className="bg-white/20 text-white w-fit">
                                {topicCategory}
                              </Badge>
                              <Badge
                                variant="secondary"
                                className={`w-fit ${
                                  topicDifficulty === "Beginner"
                                    ? "bg-green-500/80 text-white"
                                    : topicDifficulty === "Intermediate"
                                      ? "bg-yellow-500/80 text-white"
                                      : "bg-red-500/80 text-white"
                                }`}
                              >
                                {topicDifficulty}
                              </Badge>
                            </div>
                            {user?.role === "student" && isCompleted && (
                              <Badge className="bg-green-500">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Completed
                              </Badge>
                            )}
                          </div>
                          <div className="absolute bottom-4 left-4 right-4">
                            <h3 className="text-white font-bold text-xl mb-2 group-hover:text-orange-200 transition-colors">
                              {topicTitle}
                            </h3>
                            <div className="flex items-center justify-between text-white/80 text-sm">
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-1">
                                  <BookOpen className="w-4 h-4" />
                                  <span>{topicLessons} lessons</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Users className="w-4 h-4" />
                                  <span>{topicStudents}</span>
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
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {topicDescription}
                          </p>

                          {/* Progress for students - SAFE: Only primitive values */}
                          {user?.role === "student" && (
                            <div className="mb-4">
                              <div className="flex items-center justify-between text-sm mb-2">
                                <span className="text-gray-600">Progress</span>
                                <span className="font-medium text-orange-600">{progressPercentage}%</span>
                              </div>
                              <Progress value={progressPercentage} className="h-2" />
                              <p className="text-xs text-gray-500 mt-1">
                                {progressCompleted} of {progressTotal} lessons completed
                              </p>
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              {/* Course metadata removed to prevent object issues */}
                              {user?.role !== "student" && (
                                <Badge variant={topicStatus === "Published" ? "default" : "secondary"} className="text-xs">
                                  {topicStatus}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              <Button
                                size="sm"
                                className={
                                  user?.role === "student" && isCompleted
                                    ? "bg-green-500 hover:bg-green-600"
                                    : "bg-orange-500 hover:bg-orange-600"
                                }
                                onClick={(e) => {
                                  e.preventDefault()
                                  window.location.href = `/dashboard/topics/${topicId}`
                                }}
                              >
                                {user?.role === "student" && isCompleted ? "Review" : "Start Learning"}
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