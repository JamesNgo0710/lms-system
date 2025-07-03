"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Clock, Users, Star, Search, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useTopics, useLessonCompletions } from "@/hooks/use-data-store"

export default function TopicsPage() {
  const { data: session } = useSession()
  const user = session?.user
  const { topics } = useTopics()
  const { getTopicProgress } = useLessonCompletions()
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [difficultyFilter, setDifficultyFilter] = useState("all")
  const [isHydrated, setIsHydrated] = useState(false)

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  const categories = Array.from(new Set(topics.map((topic) => topic.category)))
  const difficulties = ["Beginner", "Intermediate", "Advanced"]

  const filteredTopics = topics.filter((topic) => {
    const matchesSearch =
      topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topic.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || topic.category === categoryFilter
    const matchesDifficulty = difficultyFilter === "all" || topic.difficulty === difficultyFilter
    return matchesSearch && matchesCategory && matchesDifficulty
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Learning Topics</h1>
          <p className="text-gray-600">Explore our comprehensive learning materials</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-sm">
            {filteredTopics.length} Topics Available
          </Badge>
        </div>
      </div>

      {/* Filters */}
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

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTopics.map((topic) => {
          const topicProgress =
            user && isHydrated ? getTopicProgress(user.id, topic.id) : { completed: 0, total: 0, percentage: 0 }
          const isCompleted = topicProgress.percentage === 100

          return (
            <Card key={topic.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="aspect-video bg-gradient-to-br from-orange-400 to-orange-600 relative">
                <img
                  src={topic.image || "/placeholder.svg?height=200&width=300"}
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
                  {user?.role === "student" && isHydrated && isCompleted && (
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
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {topic.description ||
                    "Comprehensive learning material covering all essential concepts and practical applications."}
                </p>

                {/* Progress for students */}
                {user?.role === "student" && isHydrated && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium text-orange-600">{topicProgress.percentage}%</span>
                    </div>
                    <Progress value={topicProgress.percentage} className="h-2" />
                    <p className="text-xs text-gray-500 mt-1">
                      {topicProgress.completed} of {topicProgress.total} lessons completed
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>2-3 hours</span>
                    </div>
                    <Badge variant={topic.status === "Published" ? "default" : "secondary"} className="text-xs">
                      {topic.status}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link href={`/dashboard/topics/${topic.id}`}>
                      <Button
                        size="sm"
                        className={
                          user?.role === "student" && isHydrated && isCompleted
                            ? "bg-green-500 hover:bg-green-600"
                            : "bg-orange-500 hover:bg-orange-600"
                        }
                      >
                        {user?.role === "student" && isHydrated && isCompleted ? "Review" : "Start Learning"}
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredTopics.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No topics found</h3>
            <p className="text-gray-600">Try adjusting your search terms or filters.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
