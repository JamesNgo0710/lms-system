"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  Users, 
  BookOpen, 
  Clock,
  Star,
  TrendingUp,
  Calendar,
  Target,
  CheckCircle,
  AlertCircle,
  FileText,
  Upload,
  Download,
  ExternalLink,
  Copy,
  BarChart3,
  ChevronLeft,
  MoreHorizontal,
  Play,
  Grid3X3,
  List
} from "lucide-react"
import Link from "next/link"
import { useTopics, useLessons, useLessonCompletions } from "@/hooks/use-api-data-store"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export default function ManageTopicsPage() {
  const { data: session } = useSession()
  const user = session?.user
  const router = useRouter()
  const { topics, deleteTopic, updateTopic } = useTopics()
  const { getLessonsByTopicId, deleteLesson } = useLessons()
  const { isLessonCompleted } = useLessonCompletions()
  const { toast } = useToast()

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTopic, setSelectedTopic] = useState<any>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [topicToDelete, setTopicToDelete] = useState<any>(null)
  const [isHydrated, setIsHydrated] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  const filteredTopics = topics.filter(
    (topic) =>
      topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topic.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDeleteTopic = (topic: any) => {
    setTopicToDelete(topic)
    setDeleteDialogOpen(true)
  }

  const handleTogglePublish = (topic: any) => {
    const newStatus = topic.status === "Published" ? "Draft" : "Published"
    updateTopic(topic.id, { status: newStatus })
    
    toast({
      title: "Success",
      description: `Topic ${newStatus === "Published" ? "published" : "unpublished"} successfully`,
    })
  }

  const confirmDelete = () => {
    if (topicToDelete) {
      deleteTopic(topicToDelete.id)
      toast({
        title: "Success",
        description: "Topic deleted successfully",
      })
      setDeleteDialogOpen(false)
      setTopicToDelete(null)
      setSelectedTopic(null)
    }
  }

  const handleDeleteLesson = (lessonId: number) => {
    deleteLesson(lessonId)
    toast({
      title: "Success",
      description: "Lesson deleted successfully",
    })
    // Refresh selected topic if it's currently selected
    if (selectedTopic) {
      const updatedLessons = getLessonsByTopicId(selectedTopic.id) || []
      setSelectedTopic({ ...selectedTopic, lessons: updatedLessons })
    }
  }

  const handleRowClick = (topic: any) => {
    setSelectedTopic(topic)
  }

  const handleBackToList = () => {
    setSelectedTopic(null)
  }

  if (selectedTopic) {
    const lessons = getLessonsByTopicId(selectedTopic.id) || []

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={handleBackToList}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{selectedTopic.title}</h1>
            <p className="text-gray-600">Manage topic content and lessons</p>
          </div>
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/topics/${selectedTopic.id}?returnTo=manage&topicId=${selectedTopic.id}`}>
                    <Eye className="w-4 h-4 mr-2" />
                    Preview Topic
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleTogglePublish(selectedTopic)}>
                  {selectedTopic.status === "Published" ? (
                    <>
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Unpublish Topic
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Publish Topic
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDeleteTopic(selectedTopic)}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Topic
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Students Enrolled</p>
                      <p className="text-2xl font-bold">{selectedTopic.students}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-green-100 rounded-full">
                      <BookOpen className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Lessons</p>
                      <p className="text-2xl font-bold">{lessons.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-orange-100 rounded-full">
                      <Calendar className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Created</p>
                      <p className="text-2xl font-bold">{selectedTopic.createdAt}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Topic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedTopic.description && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">Description</p>
                    <p className="text-gray-800 leading-relaxed">{selectedTopic.description}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Category</p>
                    <p className="text-lg">{selectedTopic.category}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Difficulty</p>
                    <Badge variant="outline">{selectedTopic.difficulty}</Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Status</p>
                    <Badge variant={selectedTopic.status === "Published" ? "default" : "secondary"}>
                      {selectedTopic.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Assessment</p>
                    <Badge variant={selectedTopic.hasAssessment ? "default" : "secondary"}>
                      {selectedTopic.hasAssessment ? "Available" : "Not Available"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lessons Management Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Lessons Management</CardTitle>
                    <p className="text-sm text-gray-600">Create and manage lessons for this topic ({lessons.length} lessons)</p>
                  </div>
                  <Link href={`/dashboard/manage-topics/${selectedTopic.id}/lessons/create`}>
                    <Button className="bg-orange-500 hover:bg-orange-600">
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Lesson
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {lessons.length === 0 ? (
                  <div className="p-12 text-center">
                    <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No lessons yet</h3>
                    <p className="text-gray-600 mb-4">Get started by creating your first lesson for this topic.</p>
                    <Link href={`/dashboard/manage-topics/${selectedTopic.id}/lessons/create`}>
                      <Button className="bg-orange-500 hover:bg-orange-600">
                        <Plus className="w-4 h-4 mr-2" />
                        Create First Lesson
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {lessons.filter(lesson => lesson && lesson.id && typeof lesson === 'object').map((lesson, index) => (
                      <Card key={lesson.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="aspect-video relative overflow-hidden">
                          <img
                            src={lesson.image || "/placeholder.svg?height=225&width=400"}
                            alt={lesson.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/20" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Play className="w-12 h-12 text-white opacity-80" />
                          </div>
                          <div className="absolute top-4 left-4">
                            <div className="bg-white/20 text-white px-2 py-1 rounded text-sm font-medium">
                              Lesson {index + 1}
                            </div>
                          </div>
                          <div className="absolute bottom-4 left-4 right-4">
                            <h3 className="text-white font-semibold text-lg mb-2">{lesson.title || 'Untitled Lesson'}</h3>
                            <div className="flex items-center justify-between">
                              <Badge variant="secondary" className="bg-white/20 text-white">
                                {lesson.difficulty || 'Beginner'}
                              </Badge>
                              <Badge variant="secondary" className="bg-white/20 text-white">
                                <Clock className="w-3 h-3 mr-1" />
                                {lesson.duration || '15 min'}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <CardContent className="p-4">
                          <p className="text-sm text-gray-600 mb-3 overflow-hidden text-ellipsis" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'}}>{lesson.description || 'No description available'}</p>

                          {Array.isArray(lesson.prerequisites) && lesson.prerequisites.length > 0 && (
                            <div className="mb-3">
                              <p className="text-xs font-medium text-gray-500 mb-1">Prerequisites:</p>
                              <div className="flex flex-wrap gap-1">
                                {lesson.prerequisites.slice(0, 2).map((prereq, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {typeof prereq === 'string' ? prereq : String(prereq)}
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
                            <div className="flex items-center space-x-2">
                              <Link href={`/dashboard/manage-topics/${selectedTopic.id}/lessons/${lesson.id}/edit`}>
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
                            <Badge variant={lesson.status === "Published" ? "default" : "secondary"}>{lesson.status || 'Draft'}</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>



          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Topic Settings</CardTitle>
                <p className="text-sm text-gray-600">Configure topic settings and preferences</p>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Settings panel coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Delete Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Topic</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{topicToDelete?.title}"? This action cannot be undone and will also
                delete all associated lessons and assessments.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete Topic
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold dark:text-gray-100">Manage Topics</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Create and manage learning topics</p>
          <p className="text-xs sm:text-sm text-orange-600 dark:text-orange-400 mt-1">💡 Tip: Click on any row to manage lessons and content</p>
        </div>
        <Link href="/dashboard/manage-topics/create">
          <Button className="bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-500 w-full sm:w-auto text-sm sm:text-base">
            <Plus className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Create New Topic</span>
            <span className="sm:hidden">New Topic</span>
          </Button>
        </Link>
      </div>

      {/* Search and View Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
          <Input
            placeholder="Search topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-200 dark:placeholder-gray-500"
          />
        </div>
        <div className="flex items-center border rounded-lg p-1 dark:border-gray-800">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="px-2 sm:px-3 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="px-2 sm:px-3 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Topics Grid/List View */}
      <Card className="dark:bg-gray-900 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="dark:text-gray-100">Topics ({filteredTopics.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredTopics.map((topic) => (
                <Card 
                  key={topic.id} 
                  className="overflow-hidden hover:shadow-lg transition-shadow group dark:bg-gray-900 dark:border-gray-800"
                >
                  <div className="aspect-video bg-gradient-to-br from-orange-400 to-orange-600 relative">
                    <img 
                      src={topic.image || "/placeholder.svg?height=225&width=400"} 
                      alt={topic.title}
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-white opacity-80" />
                    </div>
                    <div className="absolute top-2 left-2 right-2 sm:top-4 sm:left-4 sm:right-4 flex items-start justify-between">
                      <div className="flex flex-col space-y-1 sm:space-y-2 max-w-[60%]">
                        <Badge variant="secondary" className="bg-white/90 text-gray-800 text-xs truncate">
                          {topic.category}
                        </Badge>
                        <Badge 
                          className={`text-xs truncate ${
                            topic.difficulty === "Beginner"
                              ? "bg-green-500 text-white"
                              : topic.difficulty === "Intermediate"
                                ? "bg-yellow-500 text-white"
                                : "bg-red-500 text-white"
                          }`}
                        >
                          {topic.difficulty}
                        </Badge>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="secondary" 
                            size="icon" 
                            className="h-8 w-8 bg-white/95 text-gray-700 hover:bg-white hover:text-gray-900 backdrop-blur-sm shadow-md dark:bg-gray-800/95 dark:text-gray-200 dark:hover:bg-gray-800"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="dark:bg-gray-900 dark:border-gray-800">
                          <DropdownMenuItem asChild className="dark:hover:bg-gray-800 dark:focus:bg-gray-800">
                            <Link href={`/dashboard/topics/${topic.id}?returnTo=manage&topicId=${topic.id}`}>
                              <Eye className="w-4 h-4 mr-2" />
                              Preview
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild className="dark:hover:bg-gray-800 dark:focus:bg-gray-800">
                            <Link href={`/dashboard/manage-topics/${topic.id}`}>
                              <Edit className="w-4 h-4 mr-2" />
                              Manage
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleTogglePublish(topic)}
                            className={`${
                              topic.status === "Published" 
                                ? "text-orange-600 dark:text-orange-400" 
                                : "text-green-600 dark:text-green-400"
                            } dark:hover:bg-gray-800 dark:focus:bg-gray-800`}
                          >
                            {topic.status === "Published" ? (
                              <>
                                <AlertCircle className="w-4 h-4 mr-2" />
                                Unpublish
                              </>
                            ) : (
                              <>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Publish
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteTopic(topic)}
                            className="text-red-600 dark:text-red-400 dark:hover:bg-gray-800 dark:focus:bg-gray-800"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4">
                      <h3 className="text-white font-bold text-sm sm:text-lg mb-1 sm:mb-2 group-hover:text-orange-200 transition-colors line-clamp-2">
                        {topic.title}
                      </h3>
                      <div className="flex items-center justify-between text-white/80 text-xs sm:text-sm">
                        <div className="flex items-center space-x-2 sm:space-x-4">
                          <div className="flex items-center space-x-1">
                            <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="hidden sm:inline">{topic.students}</span>
                            <span className="sm:hidden">{topic.students}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="hidden sm:inline">{topic.lessons} lessons</span>
                            <span className="sm:hidden">{topic.lessons}</span>
                          </div>
                        </div>
                        <Badge 
                          className={`text-xs ${
                            topic.status === "Published" 
                              ? "bg-green-500/90 text-white" 
                              : "bg-gray-500/90 text-white"
                          }`}
                        >
                          {topic.status}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-3 sm:p-4">
                    <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
                      {topic.description || "Comprehensive learning material covering essential concepts and practical applications."}
                    </p>

                    <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                      <div className="flex items-center space-x-2">
                        <Link href={`/dashboard/topics/${topic.id}?returnTo=manage&topicId=${topic.id}`}>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-blue-600 border-blue-500 bg-transparent hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-gray-800 text-xs px-2 py-1 h-7"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            <span className="hidden sm:inline">Preview</span>
                            <span className="sm:hidden">View</span>
                          </Button>
                        </Link>
                        <Link href={`/dashboard/manage-topics/${topic.id}`}>
                          <Button
                            size="sm"
                            className="bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-500 text-xs px-2 py-1 h-7"
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Manage
                          </Button>
                        </Link>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteTopic(topic)}
                        className="text-red-600 border-red-500 hover:bg-red-50 dark:text-red-400 dark:border-red-400 dark:hover:bg-gray-800 text-xs px-2 py-1 h-7 self-end sm:self-auto"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span className="ml-1 hidden sm:inline">Delete</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow className="bg-orange-500 hover:bg-orange-500 dark:bg-orange-600 border-b-0">
                    <TableHead className="text-white font-semibold py-4">Topic</TableHead>
                    <TableHead className="hidden md:table-cell text-white font-semibold py-4">Category</TableHead>
                    <TableHead className="hidden lg:table-cell text-white font-semibold py-4">Students</TableHead>
                    <TableHead className="hidden lg:table-cell text-white font-semibold py-4">Lessons</TableHead>
                    <TableHead className="hidden sm:table-cell text-white font-semibold py-4">Status</TableHead>
                    <TableHead className="w-[70px] text-white font-semibold py-4">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTopics.map((topic) => (
                    <TableRow
                      key={topic.id}
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border-b border-gray-100 dark:border-gray-800"
                      onClick={() => router.push(`/dashboard/manage-topics/${topic.id}`)}
                    >
                      <TableCell className="py-4">
                        <div className="flex items-center space-x-3">
                          <img 
                            src={topic.image || "/placeholder.svg?height=48&width=48"} 
                            alt={topic.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-gray-100">{topic.title}</p>
                            <div className="flex items-center space-x-2 mt-1 flex-wrap gap-1">
                              <Badge variant="outline" className="text-xs bg-gray-100 dark:bg-gray-700 dark:border-gray-600">
                                {topic.difficulty}
                              </Badge>
                              <span className="text-xs text-gray-500 dark:text-gray-400 md:hidden">
                                {topic.category} • {topic.students} students
                              </span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell py-4">
                        <Badge variant="outline" className="bg-gray-100 dark:bg-gray-700 dark:border-gray-600">{topic.category}</Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell py-4 font-medium text-gray-900 dark:text-gray-100">{topic.students}</TableCell>
                      <TableCell className="hidden lg:table-cell py-4 font-medium text-gray-900 dark:text-gray-100">{topic.lessons}</TableCell>
                      <TableCell className="hidden sm:table-cell py-4">
                        <Badge variant={topic.status === "Published" ? "default" : "secondary"} className={topic.status === "Published" ? "bg-green-500" : ""}>{topic.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="dark:text-gray-300 dark:hover:bg-gray-800 hover:bg-gray-100"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="dark:bg-gray-900 dark:border-gray-800">
                            <DropdownMenuItem asChild className="dark:hover:bg-gray-800 dark:focus:bg-gray-800">
                              <Link href={`/dashboard/topics/${topic.id}?returnTo=manage&topicId=${topic.id}`}>
                                <Eye className="w-4 h-4 mr-2" />
                                Preview
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild className="dark:hover:bg-gray-800 dark:focus:bg-gray-800">
                              <Link href={`/dashboard/manage-topics/${topic.id}`}>
                                <Edit className="w-4 h-4 mr-2" />
                                Manage
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                handleTogglePublish(topic)
                              }}
                              className={`${
                                topic.status === "Published" 
                                  ? "text-orange-600 dark:text-orange-400" 
                                  : "text-green-600 dark:text-green-400"
                              } dark:hover:bg-gray-800 dark:focus:bg-gray-800`}
                            >
                              {topic.status === "Published" ? (
                                <>
                                  <AlertCircle className="w-4 h-4 mr-2" />
                                  Unpublish
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Publish
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteTopic(topic)
                              }}
                              className="text-red-600 dark:text-red-400 dark:hover:bg-gray-800 dark:focus:bg-gray-800"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {filteredTopics.length === 0 && (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2 dark:text-gray-100">No topics found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm sm:text-base">
                {searchTerm ? "Try adjusting your search terms." : "Get started by creating your first topic."}
              </p>
              {!searchTerm && (
                <Link href="/dashboard/manage-topics/create">
                  <Button className="bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-500">
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Topic
                  </Button>
                </Link>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="dark:bg-gray-900 dark:border-gray-800">
          <DialogHeader>
            <DialogTitle className="dark:text-gray-100">Delete Topic</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Are you sure you want to delete "{topicToDelete?.title}"? This action cannot be undone and will also
              delete all associated lessons and assessments.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialogOpen(false)}
              className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              className="dark:bg-red-600 dark:hover:bg-red-500"
            >
              Delete Topic
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
