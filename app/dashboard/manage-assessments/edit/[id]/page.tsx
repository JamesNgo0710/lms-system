"use client"

import { useState, useEffect } from "react"
import { use } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, Upload, Plus, Trash2, Link as LinkIcon, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useTopics, useAssessments } from "@/hooks/use-data-store"
import { uploadImageFree, isValidImageUrl, loadImageFromUrl } from "@/lib/image-utils"

interface Question {
  id: number
  type: "true-false" | "multiple-choice"
  question: string
  options?: string[]
  correctAnswer: string | number
  image?: string
}

export default function EditAssessmentPage({ params }: { params: Promise<{ id: string }> }) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [cooldownPeriod, setCooldownPeriod] = useState<number>(1)
  const [timeLimit, setTimeLimit] = useState<string>("01:00")
  const [isLoading, setIsLoading] = useState(true)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [uploadingImages, setUploadingImages] = useState<Set<number>>(new Set())
  const [imageUrlInputs, setImageUrlInputs] = useState<Record<number, string>>({})
  const router = useRouter()
  const { toast } = useToast()
  const { getTopicById } = useTopics()
  const { getAssessmentByTopicId, updateAssessment, updateAssessmentCooldown, formatCooldownPeriod } = useAssessments()
  
  const resolvedParams = use(params)
  const topicId = Number.parseInt(resolvedParams.id)
  const topic = getTopicById(topicId)
  const existingAssessment = getAssessmentByTopicId(topicId)

  // Load existing assessment data or initialize with empty question
  useEffect(() => {
    if (existingAssessment && existingAssessment.questions.length > 0) {
      // Load existing questions, cooldown period, and time limit
      setQuestions(existingAssessment.questions)
      setCooldownPeriod(existingAssessment.cooldownPeriod || 1) // Default 1 hour
      setTimeLimit(existingAssessment.timeLimit || "01:00") // Default 1 hour
    } else {
      // Initialize with one empty question if no assessment exists
      setQuestions([{
        id: 1,
        type: "true-false",
        question: "",
        correctAnswer: "true",
      }])
      setCooldownPeriod(1) // Default 1 hour cooldown
      setTimeLimit("01:00") // Default 1 hour time limit
    }
    setIsLoading(false)
  }, [existingAssessment])

  // Listen for storage quota exceeded events
  useEffect(() => {
    const handleStorageQuotaExceeded = (event: any) => {
      toast({
        title: "Storage Warning",
        description: "Browser storage is running low. Some older data has been automatically cleaned up to save your changes.",
        variant: "destructive",
      })
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('storageQuotaExceeded', handleStorageQuotaExceeded)
      
      return () => {
        window.removeEventListener('storageQuotaExceeded', handleStorageQuotaExceeded)
      }
    }
  }, [])

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Math.max(...questions.map(q => q.id), 0) + 1,
      type: "true-false",
      question: "",
      correctAnswer: "true",
    }
    setQuestions([...questions, newQuestion])
    setHasUnsavedChanges(true)
  }

  const updateQuestion = (id: number, updates: Partial<Question>) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, ...updates } : q)))
    setHasUnsavedChanges(true)
  }

  const handleImageUpload = async (questionId: number, file: File) => {
    if (!file) return

    setUploadingImages(prev => new Set(prev).add(questionId))
    
    try {
      const result = await uploadImageFree(file)
      
      if (result.success && result.url) {
        updateQuestion(questionId, { image: result.url })
        toast({
          title: "Image Uploaded",
          description: "Question image has been uploaded successfully.",
        })
      } else {
        toast({
          title: "Upload Failed",
          description: result.error || "Failed to upload image. Please try entering an image URL directly.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Image upload error:', error)
      toast({
        title: "Upload Error",
        description: "Failed to upload image. Please try again or enter an image URL.",
        variant: "destructive",
      })
    } finally {
      setUploadingImages(prev => {
        const newSet = new Set(prev)
        newSet.delete(questionId)
        return newSet
      })
    }
  }

  const handleImageUrlInput = async (questionId: number, url: string) => {
    if (!url.trim()) {
      setImageUrlInputs(prev => ({ ...prev, [questionId]: '' }))
      return
    }

    if (!isValidImageUrl(url)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid image URL (jpg, png, gif, webp).",
        variant: "destructive",
      })
      return
    }

    try {
      // Test if image loads
      await loadImageFromUrl(url)
      updateQuestion(questionId, { image: url })
      setImageUrlInputs(prev => ({ ...prev, [questionId]: '' }))
      toast({
        title: "Image Added",
        description: "Image URL has been added successfully.",
      })
    } catch (error) {
      toast({
        title: "Invalid Image",
        description: "Could not load image from this URL. Please check the URL and try again.",
        variant: "destructive",
      })
    }
  }

  const removeImage = (questionId: number) => {
    updateQuestion(questionId, { image: undefined })
    toast({
      title: "Image Removed",
      description: "Question image has been removed.",
    })
  }

  const deleteQuestion = (id: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((q) => q.id !== id))
      setHasUnsavedChanges(true)
    }
  }

  const handleTypeChange = (id: number, type: "true-false" | "multiple-choice") => {
    const updates: Partial<Question> = { type }
    if (type === "multiple-choice") {
      updates.options = ["", "", "", ""]
      updates.correctAnswer = 0
    } else {
      updates.options = undefined
      updates.correctAnswer = "true"
    }
    updateQuestion(id, updates)
  }

  const handleCooldownUpdate = (hours: number) => {
    if (!existingAssessment) return
    
    try {
      updateAssessmentCooldown(existingAssessment.id, hours)
      setCooldownPeriod(hours)
      toast({
        title: "Success",
        description: `Cooldown period updated to ${formatCooldownPeriod(hours)}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update cooldown period",
        variant: "destructive",
      })
    }
  }

  const handleSave = () => {
    if (!existingAssessment) {
      toast({
        title: "Error",
        description: "No assessment found to save",
        variant: "destructive",
      })
      return
    }

    // Validate questions
    const validQuestions = questions.filter(q => q.question.trim() !== "")
    if (validQuestions.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one question with content",
        variant: "destructive",
      })
      return
    }

    // Update the assessment with new questions, cooldown, and time limit
    updateAssessment(existingAssessment.id, {
      questions: validQuestions,
      totalQuestions: validQuestions.length,
      timeLimit: timeLimit,
    })

    // Update cooldown period separately
    handleCooldownUpdate(cooldownPeriod)

    setHasUnsavedChanges(false)
    toast({
      title: "Success",
      description: "Assessment saved as draft successfully",
    })
  }

  const handlePreview = () => {
    if (hasUnsavedChanges) {
      toast({
        title: "Unsaved Changes",
        description: "Please save your changes before previewing the assessment.",
        variant: "destructive",
      })
      return
    }
    router.push(`/dashboard/manage-assessments/preview/${resolvedParams.id}`)
  }

  const handlePublish = () => {
    if (!existingAssessment) return

    if (hasUnsavedChanges) {
      toast({
        title: "Unsaved Changes",
        description: "Please save your changes before publishing the assessment.",
        variant: "destructive",
      })
      return
    }

    // Validate questions before publishing
    const validQuestions = questions.filter(q => q.question.trim() !== "")
    if (validQuestions.length === 0) {
      toast({
        title: "Cannot Publish",
        description: "Please add at least one question with content before publishing.",
        variant: "destructive",
      })
      return
    }

    const newStatus = existingAssessment.status === "Published" ? "Draft" : "Published"
    
    updateAssessment(existingAssessment.id, { status: newStatus })
    
    toast({
      title: "Success",
      description: `Assessment ${newStatus === "Published" ? "published" : "unpublished"} successfully`,
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard/manage-assessments">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-orange-500">Loading...</h1>
          </div>
        </div>
      </div>
    )
  }

  if (!topic) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard/manage-assessments">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-red-500">Topic Not Found</h1>
          </div>
        </div>
      </div>
    )
  }

  if (!existingAssessment) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard/manage-assessments">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-red-500">No Assessment Found</h1>
          </div>
        </div>
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">No Assessment Available</h2>
              <p className="text-gray-600 mb-4">No assessment has been created for "{topic.title}" yet.</p>
              <Link href="/dashboard/manage-assessments">
                <Button>Back to Assessments</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/manage-assessments">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-orange-500">Edit Assessment</h1>
            <p className="text-gray-600">Topic: {topic.title}</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Assessment Info */}
        <Card>
          <CardHeader>
            <CardTitle>Assessment Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-gray-600">Total Questions</Label>
                <p className="font-medium">{questions.length}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-600">Time Limit</Label>
                <Select
                  value={timeLimit}
                  onValueChange={(value) => {
                    setTimeLimit(value)
                    setHasUnsavedChanges(true)
                  }}
                >
                  <SelectTrigger className="w-full max-w-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="00:15">15 minutes</SelectItem>
                    <SelectItem value="00:30">30 minutes</SelectItem>
                    <SelectItem value="00:45">45 minutes</SelectItem>
                    <SelectItem value="01:00">1 hour</SelectItem>
                    <SelectItem value="01:30">1.5 hours</SelectItem>
                    <SelectItem value="02:00">2 hours</SelectItem>
                    <SelectItem value="02:30">2.5 hours</SelectItem>
                    <SelectItem value="03:00">3 hours</SelectItem>
                    <SelectItem value="04:00">4 hours</SelectItem>
                    <SelectItem value="05:00">5 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Cooldown Period Configuration */}
            <div className="border-t pt-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-lg font-semibold">Cooldown Period</Label>
                  <p className="text-sm text-gray-600">Time students must wait before retaking this assessment</p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Label htmlFor="cooldown-input" className="text-sm font-medium">Hours:</Label>
                  <Input
                    id="cooldown-input"
                    type="number"
                    min="1"
                    max="168"
                    value={cooldownPeriod}
                    onChange={(e) => {
                      setCooldownPeriod(Number(e.target.value))
                      setHasUnsavedChanges(true)
                    }}
                    className="w-20"
                  />
                  <span className="text-sm text-gray-600">
                    ({formatCooldownPeriod(cooldownPeriod)})
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={cooldownPeriod === 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setCooldownPeriod(1)
                      setHasUnsavedChanges(true)
                    }}
                    className={cooldownPeriod === 1 ? "bg-orange-500 hover:bg-orange-600" : ""}
                  >
                    1 Hour
                  </Button>
                  <Button
                    variant={cooldownPeriod === 6 ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setCooldownPeriod(6)
                      setHasUnsavedChanges(true)
                    }}
                    className={cooldownPeriod === 6 ? "bg-orange-500 hover:bg-orange-600" : ""}
                  >
                    6 Hours
                  </Button>
                  <Button
                    variant={cooldownPeriod === 24 ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setCooldownPeriod(24)
                      setHasUnsavedChanges(true)
                    }}
                    className={cooldownPeriod === 24 ? "bg-orange-500 hover:bg-orange-600" : ""}
                  >
                    1 Day
                  </Button>
                  <Button
                    variant={cooldownPeriod === 72 ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setCooldownPeriod(72)
                      setHasUnsavedChanges(true)
                    }}
                    className={cooldownPeriod === 72 ? "bg-orange-500 hover:bg-orange-600" : ""}
                  >
                    3 Days
                  </Button>
                  <Button
                    variant={cooldownPeriod === 168 ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setCooldownPeriod(168)
                      setHasUnsavedChanges(true)
                    }}
                    className={cooldownPeriod === 168 ? "bg-orange-500 hover:bg-orange-600" : ""}
                  >
                    7 Days
                  </Button>
                </div>

                <Button
                  onClick={() => handleCooldownUpdate(cooldownPeriod)}
                  variant="outline"
                  size="sm"
                >
                  Update Cooldown
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Questions */}
        {questions.map((question, index) => (
          <Card key={question.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Question No. {index + 1}</CardTitle>
                {questions.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteQuestion(question.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Image Upload */}
              <div className="space-y-4">
                <div className="space-y-3">
                  <Label>Question Image (Optional)</Label>
                  <p className="text-sm text-gray-600">Upload small images (under 30KB) or paste URLs from Imgur, GitHub, or other image hosting services. For larger images, please upload to an external service first.</p>
                  
                  {/* Upload Methods */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    {/* File Upload */}
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            handleImageUpload(question.id, file)
                          }
                        }}
                        className="hidden"
                        id={`image-upload-${question.id}`}
                      />
                      <Button 
                        variant="outline" 
                        onClick={() => document.getElementById(`image-upload-${question.id}`)?.click()}
                        disabled={uploadingImages.has(question.id)}
                        className="w-full"
                      >
                        {uploadingImages.has(question.id) ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Image
                          </>
                        )}
                      </Button>
                    </div>
                    
                    {/* URL Input */}
                    <div className="flex-1 flex gap-2">
                      <Input
                        placeholder="Or paste image URL..."
                        value={imageUrlInputs[question.id] || ''}
                        onChange={(e) => setImageUrlInputs(prev => ({ ...prev, [question.id]: e.target.value }))}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleImageUrlInput(question.id, imageUrlInputs[question.id] || '')}
                        disabled={!imageUrlInputs[question.id]?.trim()}
                      >
                        <LinkIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Remove Image Button */}
                  {question.image && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => removeImage(question.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove Image
                    </Button>
                  )}
                </div>
                
                {/* Display Image */}
                {question.image && (
                  <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                    <img 
                      src={question.image} 
                      alt="Question image" 
                      className="max-w-full max-h-48 rounded-md object-contain mx-auto"
                      onError={(e) => {
                        console.error('Failed to load image:', question.image)
                        toast({
                          title: "Image Load Error",
                          description: "Failed to load the image. Please check the URL or upload a new image.",
                          variant: "destructive",
                        })
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Question Type */}
              <div className="space-y-2">
                <Label>Question Type</Label>
                <Select
                  value={question.type}
                  onValueChange={(value: "true-false" | "multiple-choice") => handleTypeChange(question.id, value)}
                >
                  <SelectTrigger className="max-w-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true-false">True or False</SelectItem>
                    <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Question Text */}
              <div className="space-y-2">
                <Label>Question</Label>
                <Textarea
                  value={question.question}
                  onChange={(e) => updateQuestion(question.id, { question: e.target.value })}
                  placeholder="Enter your question here..."
                  className="min-h-[100px]"
                />
              </div>

              {/* Answer Options */}
              {question.type === "true-false" ? (
                <div className="space-y-2">
                  <Label>Answer:</Label>
                  <div className="flex space-x-2">
                    <Button
                      variant={question.correctAnswer === "true" ? "default" : "outline"}
                      onClick={() => updateQuestion(question.id, { correctAnswer: "true" })}
                      className={question.correctAnswer === "true" ? "bg-orange-500 hover:bg-orange-600" : ""}
                    >
                      True
                    </Button>
                    <Button
                      variant={question.correctAnswer === "false" ? "default" : "outline"}
                      onClick={() => updateQuestion(question.id, { correctAnswer: "false" })}
                      className={question.correctAnswer === "false" ? "bg-orange-500 hover:bg-orange-600" : ""}
                    >
                      False
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Multiple Choice Options */}
                  <div className="grid grid-cols-2 gap-4">
                    {["A", "B", "C", "D"].map((letter, optIndex) => (
                      <div key={letter} className="space-y-2">
                        <Label>{letter}</Label>
                        <Input
                          value={question.options?.[optIndex] || ""}
                          onChange={(e) => {
                            const newOptions = [...(question.options || ["", "", "", ""])]
                            newOptions[optIndex] = e.target.value
                            updateQuestion(question.id, { options: newOptions })
                          }}
                          placeholder={`Option ${letter}`}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Correct Answer Selection */}
                  <div className="space-y-2">
                    <Label>Answer:</Label>
                    <div className="flex space-x-2">
                      {["A", "B", "C", "D"].map((letter, optIndex) => (
                        <Button
                          key={letter}
                          variant={question.correctAnswer === optIndex ? "default" : "outline"}
                          onClick={() => updateQuestion(question.id, { correctAnswer: optIndex })}
                          className={question.correctAnswer === optIndex ? "bg-orange-500 hover:bg-orange-600" : ""}
                        >
                          {letter}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {/* Add Question Button */}
        <div className="flex justify-center">
          <Button onClick={addQuestion} variant="outline" className="w-full max-w-md">
            <Plus className="w-4 h-4 mr-2" />
            Add Question
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 pb-8">
          <Button 
            onClick={handlePublish} 
            className={existingAssessment?.status === "Published" ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}
          >
            {existingAssessment?.status === "Published" ? "Unpublish" : "Publish"}
          </Button>
          <Button 
            onClick={handlePreview} 
            variant="outline"
            className={hasUnsavedChanges ? "opacity-50" : ""}
          >
            Preview
            {hasUnsavedChanges && " (Save First)"}
          </Button>
          <Button 
            onClick={handleSave} 
            variant="outline"
            className={hasUnsavedChanges ? "border-orange-500 text-orange-600" : ""}
          >
            Save Draft
            {hasUnsavedChanges && " *"}
          </Button>
        </div>
      </div>
    </div>
  )
}
