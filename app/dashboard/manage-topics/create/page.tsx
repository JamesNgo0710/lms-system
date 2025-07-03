"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, Upload, X, Link as LinkIcon, Image as ImageIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useTopics } from "@/hooks/use-data-store"

interface TopicFormData {
  title: string
  description: string
  image: string
}

export default function CreateTopicPage() {
  const { addTopic } = useTopics()
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState<TopicFormData>({
    title: "",
    description: "",
    image: "",
  })
  const [imageUploadMethod, setImageUploadMethod] = useState<"upload" | "url">("upload")
  const [isDragOver, setIsDragOver] = useState(false)

  const handleSave = () => {
    if (!formData.title || !formData.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const newTopic = addTopic({
      title: formData.title,
      category: "Other", // Default category
      status: "Draft", // Default status
      students: 0,
      lessons: 0,
      createdAt: new Date().toLocaleDateString('en-CA'), // YYYY-MM-DD format
      hasAssessment: false,
      difficulty: "Beginner", // Default difficulty
      description: formData.description,
      image: formData.image || "/placeholder.svg?height=200&width=300",
    })

    toast({
      title: "Success",
      description: "Topic created successfully",
    })

    router.push(`/dashboard/manage-topics`)
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
      setFormData({ ...formData, image: result })
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
    setFormData({ ...formData, image: "" })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/dashboard/manage-topics">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-orange-500">Create New Topic</h1>
          <p className="text-gray-600">Add a new learning topic to the platform</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-8 space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Topic Name *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter topic name"
                className="text-lg"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter topic description..."
                rows={4}
                className="resize-none"
              />
            </div>

            {/* Image URL */}
            <div className="space-y-4">
              <Label>Topic Image (Optional)</Label>
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
                    value={formData.image.startsWith('data:') ? '' : formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                  <p className="text-sm text-gray-500">Enter a URL for the topic image</p>
                </TabsContent>
              </Tabs>
            </div>

            {/* Preview */}
            {formData.image && (
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
                    src={formData.image} 
                    alt="Topic preview" 
                    className="w-full h-48 object-cover rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg?height=200&width=300"
                    }}
                  />
                  <div className="mt-2 text-xs text-gray-500 text-center">
                    {formData.image.startsWith('data:') ? 
                      `Uploaded image (${Math.round(formData.image.length * 0.75 / 1024)}KB)` : 
                      'External image URL'
                    }
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-center space-x-4 pt-6">
              <Button onClick={handleSave} className="bg-orange-500 hover:bg-orange-600 px-8">
                Create Topic
              </Button>
              <Link href="/dashboard/manage-topics">
                <Button variant="outline" className="px-8">Cancel</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 