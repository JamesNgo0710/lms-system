"use client"

import { useState, useEffect } from "react"
import { use } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, Plus, Trash2, Link as LinkIcon, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface Question {
  id: number
  type: "true-false" | "multiple-choice"
  question: string
  options?: string[]
  correctAnswer: string | number
}

export default function EditAssessmentPage({ params }: { params: Promise<{ id: string }> }) {
  // Safe hook loading with error handling
  let useTopics, useAssessments
  let getTopicById, getAssessmentByTopic, createAssessment, updateAssessment
  let topicsLoading, assessmentsLoading
  
  try {
    const { useTopics: useTopicsHook } = require("@/hooks/use-api-data-store")
    const { useAssessments: useAssessmentsHook } = require("@/hooks/use-api-data-store")
    
    const topicsHook = useTopicsHook()
    const assessmentsHook = useAssessmentsHook()
    
    getTopicById = topicsHook.getTopicById
    topicsLoading = topicsHook.loading
    
    getAssessmentByTopic = assessmentsHook.getAssessmentByTopic
    createAssessment = assessmentsHook.createAssessment
    updateAssessment = assessmentsHook.updateAssessment
    assessmentsLoading = assessmentsHook.loading
  } catch (error) {
    // console.error('Error loading hooks:', error)
    getTopicById = () => null
    getAssessmentByTopic = () => null
    createAssessment = async () => null
    updateAssessment = async () => null
    topicsLoading = false
    assessmentsLoading = false
  }

  const router = useRouter()
  const { toast } = useToast()
  
  // Basic state
  const [questions, setQuestions] = useState<Question[]>([{
    id: 1,
    type: "true-false",
    question: "",
    correctAnswer: "true",
  }])
  const [cooldownPeriod, setCooldownPeriod] = useState<number>(1)
  const [timeLimit, setTimeLimit] = useState<string>("01:00")
  const [isLoading, setIsLoading] = useState(true)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Safe data extraction
  const resolvedParams = use(params)
  const topicIdParam = String(resolvedParams?.id || '')
  const topicId = parseInt(topicIdParam) || 0
  
  let topic = null
  let existingAssessment = null
  
  try {
    if (topicId > 0) {
      topic = getTopicById(topicId)
      // Only check for existing assessment from local cache (no API calls)
      existingAssessment = getAssessmentByTopic(topicId)
    }
  } catch (error) {
    // console.error('Error getting data:', error)
    topic = null
    existingAssessment = null
  }

  // Safe primitive extraction
  const topicTitle = String(topic?.title || 'Unknown Topic')
  const topicIdSafe = String(topic?.id || topicId || 'N/A')

  // Load existing assessment data safely
  useEffect(() => {
    const loadAssessmentData = async () => {
      try {
        setIsLoading(true)
        
        if (existingAssessment && existingAssessment.questions && Array.isArray(existingAssessment.questions)) {
          const safeQuestions = existingAssessment.questions
            .filter((q: any) => q && typeof q === 'object')
            .map((q: any, index: number) => ({
              id: Number(q.id) || index + 1,
              type: String(q.type) === 'multiple-choice' ? 'multiple-choice' : 'true-false',
              question: String(q.question || ''),
              options: Array.isArray(q.options) ? q.options.map((opt: any) => String(opt || '')) : undefined,
              correctAnswer: q.type === 'multiple-choice' ? Number(q.correctAnswer) || 0 : String(q.correctAnswer) || 'true'
            }))
          
          if (safeQuestions.length > 0) {
            setQuestions(safeQuestions)
          }
          
          setCooldownPeriod(Number(existingAssessment.cooldownPeriod) || 1)
          setTimeLimit(String(existingAssessment.timeLimit) || "01:00")
        }
      } catch (error) {
        // console.error('Error loading assessment data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadAssessmentData()
  }, [existingAssessment])

  // Helper functions
  const addQuestion = () => {
    const newId = Math.max(...questions.map(q => q.id), 0) + 1
    setQuestions([...questions, {
      id: newId,
      type: "true-false",
      question: "",
      correctAnswer: "true",
    }])
    setHasUnsavedChanges(true)
  }

  const updateQuestion = (id: number, updates: Partial<Question>) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, ...updates } : q))
    setHasUnsavedChanges(true)
  }

  const deleteQuestion = (id: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter(q => q.id !== id))
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

  const handleSave = async () => {
    try {
      // Validate questions
      const validQuestions = questions.filter(q => String(q.question).trim() !== "")
      if (validQuestions.length === 0) {
        toast({
          title: "Error",
          description: "Please add at least one question with content",
          variant: "destructive",
        })
        return
      }

      let result
      
      if (existingAssessment) {
        // Update existing assessment
        result = await updateAssessment(existingAssessment.id, {
          questions: validQuestions,
          totalQuestions: validQuestions.length,
          timeLimit: timeLimit,
          cooldownPeriod: cooldownPeriod,
        })
      } else {
        // Create new assessment
        result = await createAssessment({
          topic_id: topicId,
          title: `${topicTitle} Assessment`,
          description: `Assessment for ${topicTitle}`,
          questions: validQuestions,
          totalQuestions: validQuestions.length,
          timeLimit: timeLimit,
          cooldownPeriod: cooldownPeriod,
          status: 'Draft'
        })
      }

      if (result) {
        setHasUnsavedChanges(false)
        toast({
          title: "Success",
          description: existingAssessment ? "Assessment updated successfully" : "Assessment created successfully",
        })
      } else {
        throw new Error("Failed to save assessment")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save assessment. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Loading state
  if (isLoading || topicsLoading || assessmentsLoading) {
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

  // Error state - invalid topic ID
  if (topicId === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard/manage-assessments">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-red-500">Invalid Topic ID</h1>
          </div>
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
            <h1 className="text-3xl font-bold text-orange-500">
              {existingAssessment ? 'Edit Assessment' : 'Create Assessment'}
            </h1>
            <p className="text-gray-600">Topic: {topicTitle}</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Questions Section */}
        <Card>
          <CardHeader>
            <CardTitle>Assessment Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {questions.map((question, index) => (
              <div key={question.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Question {index + 1}</h3>
                  {questions.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteQuestion(question.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div>
                  <Label>Question Type</Label>
                  <Select
                    value={question.type}
                    onValueChange={(value: "true-false" | "multiple-choice") =>
                      handleTypeChange(question.id, value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true-false">True/False</SelectItem>
                      <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Question Text</Label>
                  <Textarea
                    value={question.question}
                    onChange={(e) =>
                      updateQuestion(question.id, { question: e.target.value })
                    }
                    placeholder="Enter your question here..."
                  />
                </div>

                {question.type === "multiple-choice" && (
                  <div className="space-y-2">
                    <Label>Answer Options</Label>
                    {question.options?.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center space-x-2">
                        <Input
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...(question.options || [])]
                            newOptions[optionIndex] = e.target.value
                            updateQuestion(question.id, { options: newOptions })
                          }}
                          placeholder={`Option ${optionIndex + 1}`}
                        />
                        <Button
                          variant={question.correctAnswer === optionIndex ? "default" : "outline"}
                          size="sm"
                          onClick={() =>
                            updateQuestion(question.id, { correctAnswer: optionIndex })
                          }
                        >
                          Correct
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {question.type === "true-false" && (
                  <div>
                    <Label>Correct Answer</Label>
                    <Select
                      value={String(question.correctAnswer)}
                      onValueChange={(value) =>
                        updateQuestion(question.id, { correctAnswer: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">True</SelectItem>
                        <SelectItem value="false">False</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            ))}

            <Button onClick={addQuestion} variant="outline" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Question
            </Button>
          </CardContent>
        </Card>

        {/* Assessment Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Assessment Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Time Limit</Label>
              <Input
                type="time"
                value={timeLimit}
                onChange={(e) => {
                  setTimeLimit(e.target.value)
                  setHasUnsavedChanges(true)
                }}
              />
            </div>

            <div>
              <Label>Cooldown Period</Label>
              <div className="grid grid-cols-4 gap-2">
                {[1, 6, 24, 72].map((hours) => (
                  <Button
                    key={hours}
                    variant={cooldownPeriod === hours ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setCooldownPeriod(hours)
                      setHasUnsavedChanges(true)
                    }}
                  >
                    {hours === 1 ? '1 Hour' : hours < 24 ? `${hours} Hours` : `${hours / 24} Day${hours / 24 > 1 ? 's' : ''}`}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Button 
            onClick={handleSave} 
            variant="outline"
            className={hasUnsavedChanges ? "border-orange-500 text-orange-600" : ""}
          >
            {existingAssessment ? 'Save Draft' : 'Create Assessment'}
            {hasUnsavedChanges && " *"}
          </Button>
        </div>
      </div>
    </div>
  )
}