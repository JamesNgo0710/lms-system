"use client"

import { Badge } from "@/components/ui/badge"

import { useState } from "react"
import { use } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTopics, useAssessments } from "@/hooks/use-data-store"
import { useToast } from "@/hooks/use-toast"

export default function PreviewAssessmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { getTopicById } = useTopics()
  const { getAssessmentByTopicId } = useAssessments()
  const router = useRouter()
  const { toast } = useToast()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(null)

  const resolvedParams = use(params)
  const topicId = Number.parseInt(resolvedParams.id)
  const topic = getTopicById(topicId)
  const assessment = getAssessmentByTopicId(topicId)

  const questions = assessment?.questions || []
  const question = questions[currentQuestion]
  const progress = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
    }
  }

  const handleFinish = () => {
    // In preview mode, just show a completion message and redirect
    toast({
      title: "Preview Completed",
      description: "This is how the assessment would end for students. You can now edit or publish the assessment.",
    })
    router.push("/dashboard/manage-assessments")
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setSelectedAnswer(null)
    }
  }

  const handleAnswerSelect = (answer: string | number) => {
    setSelectedAnswer(answer)
  }

  if (!topic) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Topic Not Found</h2>
            <p className="text-gray-600 mb-4">The requested topic could not be found</p>
            <Link href="/dashboard/manage-assessments">
              <Button>Back to Assessments</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!assessment || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">No Assessment Available</h2>
            <p className="text-gray-600 mb-4">No assessment has been created for "{topic.title}" yet.</p>
            <div className="space-y-2">
              <Link href="/dashboard/manage-assessments">
                <Button className="w-full">Back to Assessments</Button>
              </Link>
              <Link href={`/dashboard/manage-assessments/edit/${topic.id}`}>
                <Button variant="outline" className="w-full bg-transparent">
                  Create Assessment
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard/manage-assessments">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Assessment Preview: {topic.title}</h1>
              <p className="text-gray-600">Total Questions: {questions.length}</p>
            </div>
          </div>
          <Link href="/dashboard/manage-assessments">
            <Button variant="outline">Exit Preview</Button>
          </Link>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white px-6 py-4 border-b">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm text-gray-600">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Question Content */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Question */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-orange-500">Question {currentQuestion + 1}</h2>
                  <Badge variant="outline" className="text-sm">
                    {question.type === "multiple-choice" ? "Multiple Choice" : "True/False"}
                  </Badge>
                </div>

                <p className="text-lg mb-8 leading-relaxed">{question.question}</p>

                {/* Answer Options */}
                <div className="space-y-3">
                  {question.type === "multiple-choice" && question.options ? (
                    question.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        className={`w-full p-4 text-left border-2 rounded-lg transition-colors ${
                          selectedAnswer === index
                            ? "border-orange-500 bg-orange-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                        {option}
                      </button>
                    ))
                  ) : (
                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleAnswerSelect("true")}
                        className={`flex-1 px-8 py-4 rounded-lg border-2 transition-colors font-medium ${
                          selectedAnswer === "true"
                            ? "border-orange-500 bg-orange-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        True
                      </button>
                      <button
                        onClick={() => handleAnswerSelect("false")}
                        className={`flex-1 px-8 py-4 rounded-lg border-2 transition-colors font-medium ${
                          selectedAnswer === "false"
                            ? "border-orange-500 bg-orange-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        False
                      </button>
                    </div>
                  )}
                </div>

                <div className="mt-8 flex justify-between">
                  <Button onClick={handlePrevious} disabled={currentQuestion === 0} variant="outline">
                    Previous
                  </Button>
                  <Button
                    onClick={currentQuestion === questions.length - 1 ? handleFinish : handleNext}
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    {currentQuestion === questions.length - 1 ? "Finish" : "Next Question"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Image */}
          <div className="lg:col-span-1">
            {question.image && (
              <Card>
                <CardContent className="p-0">
                  <img
                    src={question.image || "/placeholder.svg"}
                    alt="Question illustration"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </CardContent>
              </Card>
            )}

            {/* Assessment Info */}
            <Card className="mt-4">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Assessment Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Questions:</span>
                    <span className="font-medium">{assessment.totalQuestions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time Limit:</span>
                    <span className="font-medium">{assessment.timeLimit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Retake Period:</span>
                    <span className="font-medium">{assessment.retakePeriod} months</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
