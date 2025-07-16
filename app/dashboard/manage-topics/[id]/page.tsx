"use client"

import { useState, useEffect } from "react"
import { use } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Plus, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  Users, 
  BookOpen, 
  Calendar,
  CheckCircle,
  AlertCircle,
  Play,
  ChevronLeft,
  MoreHorizontal,
  Clock,
  Grid3X3,
  List,
  Upload,
  X,
  Link as LinkIcon,
  Image as ImageIcon
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTopics, useLessons, useLessonCompletions } from "@/hooks/use-api-data-store"
import { useToast } from "@/hooks/use-toast"

export default function TopicDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { data: session } = useSession()
  const router = useRouter()
  const { getTopicById, deleteTopic, updateTopic, loading: topicsLoading } = useTopics()
  const { getLessonsByTopicId, deleteLesson, loading: lessonsLoading } = useLessons()
  const { isLessonCompleted } = useLessonCompletions()
  const { toast } = useToast()

  const resolvedParams = use(params)
  const topicId = Number.parseInt(resolvedParams.id)
  const topic = getTopicById(topicId)
  const lessons = getLessonsByTopicId(topicId)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [topicToDelete, setTopicToDelete] = useState<any>(null)
  const [lessonToDelete, setLessonToDelete] = useState<any>(null)
  const [deleteLessonDialogOpen, setDeleteLessonDialogOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "",
    image: "",
  })
  const [isEditing, setIsEditing] = useState(false)
  const [imageUploadMethod, setImageUploadMethod] = useState<"upload" | "url">("upload")
  const [isDragOver, setIsDragOver] = useState(false)

  // Initialize form data when topic loads
  useEffect(() => {
    if (topic) {
      setEditFormData({
        title: topic.title,
        description: topic.description || "",
        category: topic.category,
        difficulty: topic.difficulty,
        image: topic.image || "",
      })
    }
  }, [topic])

  // Redirect if topic not found (only after loading is complete)
  useEffect(() => {
    if (!topicsLoading && !topic) {
      router.push('/dashboard/manage-topics')
    }
  }, [topic, router, topicsLoading])

  // Calculate total duration from all lessons
  const calculateTotalDuration = () => {
    if (lessons.length === 0) return "0 min"
    
    let totalMinutes = 0
    lessons.forEach(lesson => {
      const duration = lesson.duration || "0 min"
      const match = duration.match(/(\d+)\s*(min|hour|hr|h)/)
      if (match) {
        const value = parseInt(match[1])
        const unit = match[2].toLowerCase()
        if (unit === 'min') {
          totalMinutes += value
        } else if (unit === 'hour' || unit === 'hr' || unit === 'h') {
          totalMinutes += value * 60
        }
      }
    })
    
    if (totalMinutes < 60) {
      return `${totalMinutes} min`
    } else {
      const hours = Math.floor(totalMinutes / 60)
      const minutes = totalMinutes % 60
      return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`
    }
  }

  if (topicsLoading || lessonsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900">Loading {topicsLoading ? 'topic' : 'lessons'}...</h2>
        </div>
      </div>
    )
  }

  if (!topic) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Topic not found</h2>
          <p className="text-gray-600 mt-2">Redirecting to topics list...</p>
        </div>
      </div>
    )
  }

  const handleDeleteTopic = (topicToDelete: any) => {
    setTopicToDelete(topicToDelete)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteTopic = () => {
    if (topicToDelete) {
      deleteTopic(topicToDelete.id)
      toast({
        title: "Success",
        description: "Topic deleted successfully",
      })
      router.push('/dashboard/manage-topics')
    }
    setDeleteDialogOpen(false)
    setTopicToDelete(null)
  }

  const handleDeleteLesson = (lesson: any) => {
    // Only store the id and title to avoid rendering the entire lesson object
    setLessonToDelete({
      id: lesson.id,
      title: lesson.title || 'Untitled Lesson'
    })
    setDeleteLessonDialogOpen(true)
  }

  const confirmDeleteLesson = () => {
    if (lessonToDelete) {
      deleteLesson(lessonToDelete.id)
      toast({
        title: "Success",
        description: "Lesson deleted successfully",
      })
    }
    setDeleteLessonDialogOpen(false)
    setLessonToDelete(null)
  }

  const handleSaveTopicChanges = () => {
    if (!topic) return

    const updates = {
      title: editFormData.title,
      description: editFormData.description,
      category: editFormData.category,
      difficulty: editFormData.difficulty,
      image: editFormData.image,
    }

    updateTopic(topic.id, updates)
    setIsEditing(false)
    toast({
      title: "Success",
      description: "Topic updated successfully",
    })
  }

  const handleCancelEdit = () => {
    setEditFormData({
      title: topic?.title || "",
      description: topic?.description || "",
      category: topic?.category || "",
      difficulty: topic?.difficulty || "",
      image: topic?.image || "",
    })
    setIsEditing(false)
  }

  const handleImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    const imageFile = files.find(file => file.type.startsWith('image/'))
    
    if (imageFile) {
      handleImageFile(imageFile)
    }
  }

  const handleImageFile = (file: File) => {
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: "Error",
        description: "Image size must be less than 5MB",
        variant: "destructive",
      })
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setEditFormData({ ...editFormData, image: result })
    }
    reader.readAsDataURL(file)
  }

  const handleImageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleImageFile(file)
    }
  }

  const removeImage = () => {
    setEditFormData({ ...editFormData, image: "" })
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "Advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Published":
        return "bg-green-100 text-green-800"
      case "Draft":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/manage-topics">
            <ChevronLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{topic.title}</h1>
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
                <Link href={`/dashboard/topics/${topic.id}?returnTo=manage&topicId=${topic.id}`}>
                  <Eye className="w-4 h-4 mr-2" />
                  Preview Topic
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDeleteTopic(topic)}>
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
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                    <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Students Enrolled</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{topic.students}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                    <BookOpen className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Lessons</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{lessons.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-full">
                    <Calendar className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Created</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{topic.createdAt}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Topic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Topic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Description</p>
                <p className="text-gray-900 dark:text-gray-100">{topic.description}</p>
              </div>
              <div className="flex items-center space-x-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Category</p>
                  <Badge variant="secondary">{topic.category}</Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Difficulty</p>
                  <Badge className={getDifficultyColor(topic.difficulty)}>
                    {topic.difficulty}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Duration</p>
                  <p className="text-gray-900 dark:text-gray-100 font-medium">{topic.duration || "Duration not specified"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

                    {/* Lessons Management */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Lessons ({lessons.length})</CardTitle>
                <p className="text-sm text-gray-600 mt-1">Manage and organize your lesson content</p>
              </div>
              <div className="flex items-center space-x-2">
                {lessons.length > 0 && (
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
                )}
                <Button asChild>
                  <Link href={`/dashboard/manage-topics/${topic.id}/lessons/create`}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Lesson
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {lessons.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No lessons yet</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Create your first lesson to get started</p>
                  <Button asChild>
                    <Link href={`/dashboard/manage-topics/${topic.id}/lessons/create`}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Lesson
                    </Link>
                  </Button>
                </div>
              ) : viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {lessons.filter(lesson => {
                    // Ensure lesson is properly normalized (has camelCase properties, not snake_case)
                    return lesson && 
                           lesson.id && 
                           typeof lesson === 'object' && 
                           lesson.topicId && // This is camelCase, not topic_id
                           !lesson.topic_id && // Ensure no snake_case properties
                           !lesson.created_at && 
                           !lesson.updated_at &&
                           !lesson.video_url &&
                           !lesson.social_links
                  }).map((lesson, index) => (
                    <Card key={lesson.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                      <div className="aspect-video bg-gradient-to-br from-orange-400 to-orange-600 relative">
                        <img
                          src={lesson.image || "/placeholder.svg?height=200&width=300"}
                          alt={lesson.title}
                          className="w-full h-full object-cover opacity-80"
                        />
                        <div className="absolute inset-0 bg-black/20" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Play className="w-12 h-12 text-white opacity-80" />
                        </div>
                        <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
                          <div className="flex flex-col space-y-2">
                            <Badge variant="secondary" className="bg-white/20 text-white w-fit">
                              Lesson {index + 1}
                            </Badge>
                            <Badge className={`w-fit ${getDifficultyColor(lesson.difficulty)} bg-white/90`}>
                              {lesson.difficulty}
                            </Badge>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="secondary" size="icon" className="h-8 w-8 bg-white/90 backdrop-blur-sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/dashboard/topics/${topic.id}/lessons/${lesson.id}?returnTo=manage&topicId=${topic.id}`}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  Preview
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/dashboard/manage-topics/${topic.id}/lessons/${lesson.id}/edit`}>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteLesson(lesson)}
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
                            {lesson.title}
                          </h3>
                          <div className="flex items-center justify-between text-white/80 text-sm">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{lesson.duration || "Not specified"}</span>
                            </div>
                            <Badge className={`${getStatusColor(lesson.status)} bg-white/90 text-gray-800`}>
                              {lesson.status}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <CardContent className="p-4">
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {lesson.description}
                        </p>

                        {lesson.prerequisites && lesson.prerequisites.length > 0 && (
                          <div className="mb-4">
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
                            <Link href={`/dashboard/topics/${topic.id}/lessons/${lesson.id}?returnTo=manage&topicId=${topic.id}`}>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-blue-500 border-blue-500 bg-transparent hover:bg-blue-50"
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                Preview
                              </Button>
                            </Link>
                            <Link href={`/dashboard/manage-topics/${topic.id}/lessons/${lesson.id}/edit`}>
                              <Button
                                size="sm"
                                className="bg-orange-500 hover:bg-orange-600"
                              >
                                <Edit className="w-4 h-4 mr-1" />
                                Edit
                              </Button>
                            </Link>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteLesson(lesson)}
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
                <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden shadow-sm">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-orange-500 hover:bg-orange-500 dark:bg-orange-600 border-b-0">
                        <TableHead className="text-white font-semibold py-4">Lesson</TableHead>
                        <TableHead className="text-white font-semibold py-4">Duration</TableHead>
                        <TableHead className="text-white font-semibold py-4">Difficulty</TableHead>
                        <TableHead className="text-white font-semibold py-4">Status</TableHead>
                        <TableHead className="text-right text-white font-semibold py-4">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lessons.filter(lesson => {
                        // Ensure lesson is properly normalized (has camelCase properties, not snake_case)
                        return lesson && 
                               lesson.id && 
                               typeof lesson === 'object' && 
                               lesson.topicId && // This is camelCase, not topic_id
                               !lesson.topic_id && // Ensure no snake_case properties
                               !lesson.created_at && 
                               !lesson.updated_at &&
                               !lesson.video_url &&
                               !lesson.social_links
                      }).map((lesson) => (
                        <TableRow key={lesson.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border-b border-gray-100 dark:border-gray-800">
                          <TableCell className="py-4">
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-gray-100">{lesson.title || 'Untitled Lesson'}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{lesson.description || 'No description available'}</p>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1 text-gray-400 dark:text-gray-500" />
                              <span className="text-gray-900 dark:text-gray-100">{lesson.duration || "Not specified"}</span>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <Badge className={getDifficultyColor(lesson.difficulty)}>
                              {lesson.difficulty || 'Beginner'}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-4">
                            <Badge className={getStatusColor(lesson.status)}>
                              {lesson.status || 'Draft'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right py-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="hover:bg-gray-100 dark:hover:bg-gray-700">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="dark:bg-gray-900 dark:border-gray-800">
                                <DropdownMenuItem asChild className="dark:hover:bg-gray-800 dark:focus:bg-gray-800">
                                  <Link href={`/dashboard/topics/${topic.id}/lessons/${lesson.id}?returnTo=manage&topicId=${topic.id}`}>
                                    <Eye className="w-4 h-4 mr-2" />
                                    Preview
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="dark:hover:bg-gray-800 dark:focus:bg-gray-800">
                                  <Link href={`/dashboard/manage-topics/${topic.id}/lessons/${lesson.id}/edit`}>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleDeleteLesson(lesson)}
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Topic Settings</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage topic information and configuration</p>
              </div>
              {!isEditing && (
                <Button onClick={() => setIsEditing(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Topic
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {isEditing ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Topic Title *</Label>
                      <Input
                        id="title"
                        value={editFormData.title}
                        onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                        placeholder="Enter topic title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select 
                        value={editFormData.category}
                        onValueChange={(value) => setEditFormData({ ...editFormData, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Programming">Programming</SelectItem>
                          <SelectItem value="Design">Design</SelectItem>
                          <SelectItem value="Business">Business</SelectItem>
                          <SelectItem value="Technology">Technology</SelectItem>
                          <SelectItem value="Science">Science</SelectItem>
                          <SelectItem value="Marketing">Marketing</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="difficulty">Difficulty Level *</Label>
                      <Select 
                        value={editFormData.difficulty}
                        onValueChange={(value) => setEditFormData({ ...editFormData, difficulty: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Beginner">Beginner</SelectItem>
                          <SelectItem value="Intermediate">Intermediate</SelectItem>
                          <SelectItem value="Advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-4">
                      <Label>Topic Image</Label>
                      <Tabs value={imageUploadMethod} onValueChange={(value) => setImageUploadMethod(value as "upload" | "url")}>
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="upload" className="flex items-center space-x-2">
                            <Upload className="w-4 h-4" />
                            <span>Upload Image</span>
                          </TabsTrigger>
                          <TabsTrigger value="url" className="flex items-center space-x-2">
                            <LinkIcon className="w-4 h-4" />
                            <span>Image URL</span>
                          </TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="upload" className="space-y-4">
                          <div
                            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                              isDragOver 
                                ? "border-orange-500 bg-orange-50" 
                                : "border-gray-300 hover:border-gray-400"
                            }`}
                            onDrop={handleImageDrop}
                            onDragOver={(e) => {
                              e.preventDefault()
                              setIsDragOver(true)
                            }}
                            onDragLeave={() => setIsDragOver(false)}
                          >
                            <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                            <p className="text-sm text-gray-600 mb-2">
                              Drag and drop your image here, or{" "}
                              <label htmlFor="image-upload" className="text-orange-500 cursor-pointer hover:text-orange-600">
                                browse to upload
                              </label>
                            </p>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                            <input
                              id="image-upload"
                              type="file"
                              accept="image/*"
                              onChange={handleImageInputChange}
                              className="hidden"
                            />
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="url" className="space-y-4">
                          <Input
                            type="url"
                            value={editFormData.image.startsWith('data:') ? '' : editFormData.image}
                            onChange={(e) => setEditFormData({ ...editFormData, image: e.target.value })}
                            placeholder="https://example.com/image.jpg"
                          />
                        </TabsContent>
                      </Tabs>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={editFormData.description}
                      onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                      placeholder="Enter topic description"
                      rows={4}
                    />
                  </div>
                  {editFormData.image && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Image Preview</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={removeImage}
                          className="text-red-500 hover:text-red-600"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                      <div className="border rounded-lg p-4 bg-gray-50">
                        <img 
                          src={editFormData.image} 
                          alt="Topic preview" 
                          className="w-full h-48 object-cover rounded-lg"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/placeholder.svg?height=200&width=300"
                          }}
                        />
                        <div className="mt-2 text-xs text-gray-500 text-center">
                          {editFormData.image.startsWith('data:') ? 
                            `Uploaded image (${Math.round(editFormData.image.length * 0.75 / 1024)}KB)` : 
                            'External image URL'
                          }
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center space-x-4 pt-4 border-t">
                    <Button onClick={handleSaveTopicChanges} className="bg-orange-500 hover:bg-orange-600">
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Title</Label>
                      <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{topic.title}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Category</Label>
                      <div className="mt-1">
                        <Badge variant="outline">{topic.category}</Badge>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Difficulty</Label>
                      <div className="mt-1">
                        <Badge variant="outline">{topic.difficulty}</Badge>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Duration</Label>
                      <p className="text-lg font-semibold text-orange-600 dark:text-orange-400">{calculateTotalDuration()}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Calculated from {lessons.length} lesson(s)</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</Label>
                      <div className="mt-1">
                        <Badge variant={topic.status === "Published" ? "default" : "secondary"}>
                          {topic.status}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Students Enrolled</Label>
                      <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{topic.students}</p>
                    </div>
                  </div>
                  {topic.description && (
                    <div>
                      <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Description</Label>
                      <p className="text-gray-700 dark:text-gray-300 mt-1">{topic.description}</p>
                    </div>
                  )}
                  {topic.image && (
                    <div>
                      <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Topic Image</Label>
                      <div className="mt-2 border rounded-lg p-4">
                        <img 
                          src={topic.image} 
                          alt={topic.title} 
                          className="w-full h-48 object-cover rounded-lg"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/placeholder.svg?height=200&width=300"
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Topic Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the topic "{topicToDelete?.title}" and all its lessons.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteTopic} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Lesson Dialog */}
      <AlertDialog open={deleteLessonDialogOpen} onOpenChange={setDeleteLessonDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the lesson "{lessonToDelete?.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteLesson} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 