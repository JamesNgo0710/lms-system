"use client"

import { useState, useEffect, useRef } from "react"
import { use } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, Upload, Plus, Trash2, Twitter, Youtube, FileText, Download, Bold, Italic, Underline, Undo2, Redo2, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, X, Play, Clock, ChevronDown } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useTopics, useLessons } from "@/hooks/use-api-data-store"

interface VideoPreview {
  title: string
  thumbnail: string
  duration: string
  platform: string
}

export default function EditLessonPage({ params }: { params: Promise<{ id: string; lessonId: string }> }) {
  const { getTopicById } = useTopics()
  const { getLessonById, updateLesson, getLessonsByTopicId } = useLessons()
  const router = useRouter()
  const { toast } = useToast()
  const contentEditorRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const resolvedParams = use(params)
  const topicId = Number.parseInt(resolvedParams.id)
  const lessonId = Number.parseInt(resolvedParams.lessonId)
  const topic = getTopicById(topicId)
  const lesson = getLessonById(lessonId)
  const existingLessons = getLessonsByTopicId(topicId).filter((l) => l.id !== lessonId)
  const [downloadIdCounter, setDownloadIdCounter] = useState(1)
  const [videoPreview, setVideoPreview] = useState<VideoPreview | null>(null)
  const [isLoadingPreview, setIsLoadingPreview] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "15",
    difficulty: "Beginner" as "Beginner" | "Intermediate" | "Advanced",
    videoUrl: "",
    prerequisites: [] as string[],
    content: "",
    socialLinks: {
      twitter: "",
      youtube: "",
    },
    downloads: [] as any[],
    status: "Draft" as "Published" | "Draft",
  })

  const [difficultyValue, setDifficultyValue] = useState([1])
  const [prerequisitesOpen, setPrerequisitesOpen] = useState(false)

  // Duration options in minutes
  const durationOptions = [
    { value: "5", label: "5 minutes" },
    { value: "10", label: "10 minutes" },
    { value: "15", label: "15 minutes" },
    { value: "20", label: "20 minutes" },
    { value: "25", label: "25 minutes" },
    { value: "30", label: "30 minutes" },
    { value: "45", label: "45 minutes" },
    { value: "60", label: "1 hour" },
    { value: "90", label: "1.5 hours" },
    { value: "120", label: "2 hours" },
  ]

  useEffect(() => {
    if (lesson) {
      // Extract numeric value from duration string like "15 min"
      const durationMatch = lesson.duration.match(/(\d+)/)
      const durationNumber = durationMatch ? durationMatch[1] : "15"

      setFormData({
        title: lesson.title,
        description: lesson.description,
        duration: durationNumber,
        difficulty: lesson.difficulty,
        videoUrl: lesson.videoUrl || "",
        prerequisites: lesson.prerequisites,
        content: lesson.content,
        socialLinks: {
          twitter: lesson.socialLinks.twitter || "",
          youtube: lesson.socialLinks.youtube || "",
        },
        downloads: lesson.downloads,
        status: lesson.status,
      })

      const difficultyMap = { Beginner: 1, Intermediate: 2, Advanced: 3 }
      setDifficultyValue([difficultyMap[lesson.difficulty]])
      
      // Set counter to highest existing download ID + 1
      const maxId = lesson.downloads.length > 0 ? Math.max(...lesson.downloads.map(d => d.id)) : 0
      setDownloadIdCounter(maxId + 1)

      // Set content in rich text editor
      if (contentEditorRef.current) {
        contentEditorRef.current.innerHTML = lesson.content
      }

      // Load video preview if URL exists
      if (lesson.videoUrl) {
        extractVideoInfo(lesson.videoUrl)
      }
    }
  }, [lesson])

  const availablePrerequisites = existingLessons.map((l) => l.title)

  const handlePrerequisiteToggle = (lessonTitle: string) => {
    setFormData(prev => ({
      ...prev,
      prerequisites: prev.prerequisites.includes(lessonTitle)
        ? prev.prerequisites.filter(p => p !== lessonTitle)
        : [...prev.prerequisites, lessonTitle]
    }))
  }

  const removePrerequisite = (lessonTitle: string) => {
    setFormData(prev => ({
      ...prev,
      prerequisites: prev.prerequisites.filter(p => p !== lessonTitle)
    }))
  }

  const handleDifficultyChange = (value: number[]) => {
    setDifficultyValue(value)
    const difficulties: ("Beginner" | "Intermediate" | "Advanced")[] = ["Beginner", "Intermediate", "Advanced"]
    setFormData(prev => ({
      ...prev,
      difficulty: difficulties[value[0] - 1],
    }))
  }

  // Video preview functionality
  const extractVideoInfo = async (url: string) => {
    setIsLoadingPreview(true)
    try {
      let videoId = ""
      let platform = ""
      
      // YouTube URL patterns
      const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
      const youtubeMatch = url.match(youtubeRegex)
      
      if (youtubeMatch) {
        videoId = youtubeMatch[1]
        platform = "youtube"
        
        // Try to fetch video metadata using YouTube oEmbed API
        try {
          const oEmbedResponse = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`)
          if (oEmbedResponse.ok) {
            const oEmbedData = await oEmbedResponse.json()
            setVideoPreview({
              title: oEmbedData.title || "YouTube Video",
              thumbnail: oEmbedData.thumbnail_url || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
              duration: "Loading...",
              platform: "YouTube"
            })
          } else {
            throw new Error("oEmbed failed")
          }
        } catch (oEmbedError) {
          // Fallback to basic preview if oEmbed fails
          setVideoPreview({
            title: "YouTube Video",
            thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
            duration: "Video duration available after upload",
            platform: "YouTube"
          })
        }
      } else {
        // Check for other video platforms
        const vimeoRegex = /vimeo\.com\/(?:channels\/|groups\/|album\/\d+\/video\/|video\/|)(\d+)/
        const vimeoMatch = url.match(vimeoRegex)
        
        if (vimeoMatch) {
          videoId = vimeoMatch[1]
          platform = "vimeo"
          
          try {
            const vimeoResponse = await fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${videoId}`)
            if (vimeoResponse.ok) {
              const vimeoData = await vimeoResponse.json()
              setVideoPreview({
                title: vimeoData.title || "Vimeo Video",
                thumbnail: vimeoData.thumbnail_url || "/placeholder.svg?height=180&width=320",
                duration: vimeoData.duration ? `${Math.floor(vimeoData.duration / 60)}:${(vimeoData.duration % 60).toString().padStart(2, '0')}` : "Video duration available after upload",
                platform: "Vimeo"
              })
            } else {
              throw new Error("Vimeo oEmbed failed")
            }
          } catch (vimeoError) {
            setVideoPreview({
              title: "Vimeo Video",
              thumbnail: "/placeholder.svg?height=180&width=320",
              duration: "Video duration available after upload",
              platform: "Vimeo"
            })
          }
        } else {
          setVideoPreview(null)
        }
      }
    } catch (error) {
      console.error("Error loading video preview:", error)
      setVideoPreview(null)
    }
    setIsLoadingPreview(false)
  }

  useEffect(() => {
    if (formData.videoUrl) {
      const timeoutId = setTimeout(() => {
        extractVideoInfo(formData.videoUrl)
      }, 1000)
      return () => clearTimeout(timeoutId)
    } else {
      setVideoPreview(null)
    }
  }, [formData.videoUrl])

  // Rich text editor functions
  const formatText = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    contentEditorRef.current?.focus()
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    
    files.forEach(file => {
      // Check file size (limit to 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} is larger than 10MB limit`,
          variant: "destructive",
        })
        return
      }

      // Check file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ]

      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a supported file type`,
          variant: "destructive",
        })
        return
      }

      const newDownload = {
        id: downloadIdCounter,
        name: file.name,
        size: formatFileSize(file.size),
        url: URL.createObjectURL(file),
        file: file
      }

      setDownloadIdCounter(prev => prev + 1)
      setFormData(prev => ({
        ...prev,
        downloads: [...prev.downloads, newDownload]
      }))
    })

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'pdf':
        return <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center"><span className="text-xs font-medium text-red-600">PDF</span></div>
      case 'doc':
      case 'docx':
        return <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center"><span className="text-xs font-medium text-blue-600">DOC</span></div>
      case 'xls':
      case 'xlsx':
        return <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center"><span className="text-xs font-medium text-green-600">XLS</span></div>
      default:
        return <FileText className="w-5 h-5 text-gray-500" />
    }
  }

  const removeDownload = (id: number) => {
    setFormData(prev => ({
      ...prev,
      downloads: prev.downloads.filter((d) => d.id !== id)
    }))
  }

  const handleSave = () => {
    if (!formData.title || !formData.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    updateLesson(lessonId, {
      title: formData.title,
      description: formData.description,
      duration: `${formData.duration} min`,
      difficulty: formData.difficulty,
      videoUrl: formData.videoUrl,
      prerequisites: formData.prerequisites,
      content: contentEditorRef.current?.innerHTML || formData.content,
      socialLinks: formData.socialLinks,
      downloads: formData.downloads.map(download => ({
        id: download.id,
        name: download.name,
        size: download.size,
        url: download.url
      })),
      status: formData.status,
      image: lesson?.image,
    })

    toast({
      title: "Success",
      description: "Lesson updated successfully",
    })

    router.push(`/dashboard/manage-topics/${topicId}`)
  }

  if (!topic || !lesson) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">Lesson Not Found</h2>
          <Link href="/dashboard/manage-topics">
            <Button>Back to Topics</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href={`/dashboard/manage-topics/${topicId}`}>
          <Button variant="ghost" size="icon">
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-orange-500">Edit Lesson</h1>
          <p className="text-gray-600 dark:text-gray-400">Topic: {topic.title}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-8 space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter lesson title"
              />
            </div>

            {/* Prerequisites */}
            {availablePrerequisites.length > 0 && (
              <div className="space-y-2">
                <Label>Pre-Requisites</Label>
                <DropdownMenu open={prerequisitesOpen} onOpenChange={setPrerequisitesOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      <span>
                        {formData.prerequisites.length > 0 
                          ? `${formData.prerequisites.length} prerequisite${formData.prerequisites.length > 1 ? 's' : ''} selected`
                          : "Select prerequisites"
                        }
                      </span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full max-w-md">
                    {availablePrerequisites.map((lessonTitle) => (
                      <DropdownMenuCheckboxItem
                        key={lessonTitle}
                        checked={formData.prerequisites.includes(lessonTitle)}
                        onCheckedChange={() => handlePrerequisiteToggle(lessonTitle)}
                      >
                        {lessonTitle}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                
                {formData.prerequisites.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.prerequisites.map((prereq) => (
                      <Badge key={prereq} variant="secondary" className="pr-1">
                        {prereq}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-1 ml-1"
                          onClick={() => removePrerequisite(prereq)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Duration */}
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Select
                value={formData.duration}
                onValueChange={(value) => setFormData(prev => ({ ...prev, duration: value }))}
              >
                <SelectTrigger className="w-full">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {durationOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Difficulty */}
            <div className="space-y-4">
              <Label>Difficulty</Label>
              <div className="space-y-2">
                <Slider
                  value={difficultyValue}
                  onValueChange={handleDifficultyChange}
                  max={3}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>Beginner</span>
                  <span>Intermediate</span>
                  <span>Advanced</span>
                </div>
                <p className="text-sm font-medium text-orange-500">Current: {formData.difficulty}</p>
              </div>
            </div>

            {/* Video URL */}
            <div className="space-y-2">
              <Label htmlFor="videoUrl">Video URL</Label>
              <Input
                id="videoUrl"
                value={formData.videoUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
                placeholder="https://www.youtube.com/watch?v=..."
              />
              
              {/* Video Preview */}
              {isLoadingPreview && (
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                  <span>Loading preview...</span>
                </div>
              )}
              
              {videoPreview && (
                <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                  <div className="flex items-start space-x-4">
                    <div className="relative">
                      <img 
                        src={videoPreview.thumbnail} 
                        alt="Video thumbnail"
                        className="w-32 h-18 object-cover rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder.svg?height=72&width=128"
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Play className="w-8 h-8 text-white opacity-80" />
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-900 dark:text-gray-100">{videoPreview.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Platform: {videoPreview.platform}</p>
                      {videoPreview.duration && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">Duration: {videoPreview.duration}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Rich Text Content Editor */}
            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              
              {/* Rich Text Toolbar */}
              <div className="border border-gray-300 dark:border-gray-600 rounded-t-lg p-2 bg-gray-50 dark:bg-gray-700 flex items-center space-x-1 flex-wrap">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => formatText('bold')}
                  className="h-8 w-8 p-0 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <Bold className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => formatText('italic')}
                  className="h-8 w-8 p-0 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <Italic className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => formatText('underline')}
                  className="h-8 w-8 p-0 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <Underline className="h-4 w-4" />
                </Button>
                <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => formatText('justifyLeft')}
                  className="h-8 w-8 p-0 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <AlignLeft className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => formatText('justifyCenter')}
                  className="h-8 w-8 p-0 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <AlignCenter className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => formatText('justifyRight')}
                  className="h-8 w-8 p-0 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <AlignRight className="h-4 w-4" />
                </Button>
                <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => formatText('insertUnorderedList')}
                  className="h-8 w-8 p-0 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => formatText('insertOrderedList')}
                  className="h-8 w-8 p-0 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <ListOrdered className="h-4 w-4" />
                </Button>
                <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => formatText('undo')}
                  className="h-8 w-8 p-0 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <Undo2 className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => formatText('redo')}
                  className="h-8 w-8 p-0 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <Redo2 className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Rich Text Editor */}
              <div
                ref={contentEditorRef}
                contentEditable
                className="min-h-[200px] p-4 border border-gray-300 dark:border-gray-600 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                style={{ minHeight: '200px' }}
                onInput={(e) => {
                  setFormData(prev => ({ ...prev, content: e.currentTarget.innerHTML }))
                }}
                suppressContentEditableWarning={true}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter lesson description..."
                rows={3}
              />
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <Label>Social Links</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Twitter className="w-5 h-5 text-blue-500" />
                  <Input
                    value={formData.socialLinks.twitter || ""}
                    onChange={(e) =>
                      setFormData(prev => ({
                        ...prev,
                        socialLinks: { ...prev.socialLinks, twitter: e.target.value },
                      }))
                    }
                    placeholder="Twitter URL"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Youtube className="w-5 h-5 text-red-500" />
                  <Input
                    value={formData.socialLinks.youtube || ""}
                    onChange={(e) =>
                      setFormData(prev => ({
                        ...prev,
                        socialLinks: { ...prev.socialLinks, youtube: e.target.value },
                      }))
                    }
                    placeholder="YouTube URL"
                  />
                </div>
              </div>
            </div>

            {/* Downloads */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Downloads</Label>
                <Button 
                  onClick={() => fileInputRef.current?.click()} 
                  size="sm" 
                  variant="outline"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add File
                </Button>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.xls,.xlsx"
                onChange={handleFileUpload}
                className="hidden"
              />

              {formData.downloads.length === 0 ? (
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 mb-2">No files added yet</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">Supported formats: PDF, DOC, DOCX, XLS, XLSX (Max 10MB)</p>
                  <Button onClick={() => fileInputRef.current?.click()} variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add First File
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {formData.downloads.map((download) => (
                    <div key={download.id} className="flex items-center justify-between p-3 border dark:border-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getFileIcon(download.name)}
                        <div>
                          <p className="font-medium text-sm text-gray-900 dark:text-gray-100">{download.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{download.size}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={() => {
                            if (download.file) {
                              const url = URL.createObjectURL(download.file)
                              const a = document.createElement('a')
                              a.href = url
                              a.download = download.name
                              a.click()
                              URL.revokeObjectURL(url)
                            }
                          }}
                          size="sm"
                          variant="ghost"
                          className="text-blue-500"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => removeDownload(download.id)}
                          size="sm"
                          variant="ghost"
                          className="text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "Published" | "Draft") => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4 pt-6">
              <Button onClick={handleSave} className="bg-orange-500 hover:bg-orange-600">
                Update Lesson
              </Button>
              <Link href={`/dashboard/manage-topics/${topicId}`}>
                <Button variant="outline">Cancel</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
