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
import { useTopics, useLessons, useLessonCompletions } from "@/hooks/use-data-store"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export default function ManageTopicsPage() {
  const { data: session } = useSession()
  const user = session?.user
  const router = useRouter()
  const { topics, deleteTopic } = useTopics()
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
      const updatedLessons = getLessonsByTopicId(selectedTopic.id)
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
    const lessons = getLessonsByTopicId(selectedTopic.id)

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
                    {lessons.map((lesson, index) => (
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
                          <p className="text-sm text-gray-600 mb-3 overflow-hidden text-ellipsis" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'}}>{lesson.description}</p>

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
                            <Badge variant={lesson.status === "Published" ? "default" : "secondary"}>{lesson.status}</Badge>
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
          <h1 className="text-3xl font-bold">Manage Topics</h1>
          <p className="text-gray-600">Create and manage learning topics</p>
          <p className="text-sm text-orange-600 mt-1">💡 Tip: Click on any row to manage lessons and content</p>
        </div>
        <Link href="/dashboard/manage-topics/create">
          <Button className="bg-orange-500 hover:bg-orange-600 w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Create New Topic
          </Button>
        </Link>
      </div>

      {/* Search and View Toggle */}
      <div className="flex items-center justify-between space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center border rounded-lg p-1">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="px-3"
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="px-3"
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Topics Grid/List View */}
      <Card>
        <CardHeader>
          <CardTitle>Topics ({filteredTopics.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTopics.map((topic) => (
                <Card 
                  key={topic.id} 
                  className="overflow-hidden hover:shadow-lg transition-shadow group"
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
                    <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
                      <div className="flex flex-col space-y-2">
                        <Badge variant="secondary" className="bg-white/20 text-white w-fit">
                          {topic.category}
                        </Badge>
                        <Badge 
                          className={`w-fit bg-white/90 ${
                            topic.difficulty === "Beginner"
                              ? "text-green-800"
                              : topic.difficulty === "Intermediate"
                                ? "text-yellow-800"
                                : "text-red-800"
                          }`}
                        >
                          {topic.difficulty}
                        </Badge>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="secondary" size="icon" className="h-8 w-8 bg-white/90 backdrop-blur-sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/topics/${topic.id}?returnTo=manage&topicId=${topic.id}`}>
                              <Eye className="w-4 h-4 mr-2" />
                              Preview
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/manage-topics/${topic.id}`}>
                              <Edit className="w-4 h-4 mr-2" />
                              Manage
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteTopic(topic)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-bold text-lg mb-2 group-hover:text-orange-200 transition-colors">
                        {topic.title}
                      </h3>
                      <div className="flex items-center justify-between text-white/80 text-sm">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{topic.students}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <BookOpen className="w-4 h-4" />
                            <span>{topic.lessons} lessons</span>
                          </div>
                        </div>
                        <Badge 
                          className={`${
                            topic.status === "Published" 
                              ? "bg-green-500/80 text-white" 
                              : "bg-gray-500/80 text-white"
                          }`}
                        >
                          {topic.status}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {topic.description || "Comprehensive learning material covering essential concepts and practical applications."}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Link href={`/dashboard/topics/${topic.id}?returnTo=manage&topicId=${topic.id}`}>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-blue-500 border-blue-500 bg-transparent hover:bg-blue-50"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Preview
                          </Button>
                        </Link>
                        <Link href={`/dashboard/manage-topics/${topic.id}`}>
                          <Button
                            size="sm"
                            className="bg-orange-500 hover:bg-orange-600"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Manage
                          </Button>
                        </Link>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteTopic(topic)}
                        className="text-red-500 border-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Topic</TableHead>
                    <TableHead className="hidden md:table-cell">Category</TableHead>
                    <TableHead className="hidden lg:table-cell">Students</TableHead>
                    <TableHead className="hidden lg:table-cell">Lessons</TableHead>
                    <TableHead className="hidden sm:table-cell">Status</TableHead>
                    <TableHead className="w-[70px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTopics.map((topic) => (
                    <TableRow
                      key={topic.id}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => router.push(`/dashboard/manage-topics/${topic.id}`)}
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium">{topic.title}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {topic.difficulty}
                            </Badge>
                            <span className="text-xs text-gray-500 md:hidden">
                              {topic.category} • {topic.students} students
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="outline">{topic.category}</Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">{topic.students}</TableCell>
                      <TableCell className="hidden lg:table-cell">{topic.lessons}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge variant={topic.status === "Published" ? "default" : "secondary"}>{topic.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/topics/${topic.id}?returnTo=manage&topicId=${topic.id}`}>
                                <Eye className="w-4 h-4 mr-2" />
                                Preview
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/manage-topics/${topic.id}`}>
                                <Edit className="w-4 h-4 mr-2" />
                                Manage
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteTopic(topic)
                              }}
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
              <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No topics found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? "Try adjusting your search terms." : "Get started by creating your first topic."}
              </p>
              {!searchTerm && (
                <Link href="/dashboard/manage-topics/create">
                  <Button className="bg-orange-500 hover:bg-orange-600">
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
