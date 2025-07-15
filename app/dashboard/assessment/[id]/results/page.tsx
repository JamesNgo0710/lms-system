"use client"

import { useState, useEffect, useMemo, use } from "react"
import { useSession } from "next-auth/react"
import { notFound, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Trophy, 
  Target,
  TrendingUp,
  Download,
  Share2,
  RefreshCw,
  Eye,
  BookOpen,
  Users,
  Calendar,
  Star,
  AlertCircle
} from "lucide-react"
import Link from "next/link"
import { useAssessments, useAssessmentAttempts, useTopics } from "@/hooks/use-api-data-store"

interface WrongAnswer {
  questionNo: number
  question: string
  userAnswer: string | number
  correctAnswer: string | number
  type: string
  options?: string[]
  image?: string
}

export default function AssessmentResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { data: session } = useSession()
  const user = session?.user
  const searchParams = useSearchParams()
  const { getAssessmentByTopicId } = useAssessments()
  const { getUserAssessmentAttempts } = useAssessmentAttempts()
  const { getTopicById } = useTopics()

  // Unwrap params Promise
  const resolvedParams = use(params)

  const score = Number.parseInt(searchParams.get("score") || "0")
  const timeSpent = Number.parseInt(searchParams.get("timeSpent") || "0")
  const correct = Number.parseInt(searchParams.get("correct") || "0")
  const total = Number.parseInt(searchParams.get("total") || "0")

  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswer[]>([])
  const [isCalculated, setIsCalculated] = useState(false)

  // Memoize data to prevent infinite re-renders
  const topicId = useMemo(() => Number.parseInt(resolvedParams.id), [resolvedParams.id])
  const topic = useMemo(() => getTopicById(topicId), [topicId, getTopicById])
  const assessment = useMemo(() => getAssessmentByTopicId(topicId), [topicId, getAssessmentByTopicId])

  // Calculate wrong answers once when we have the necessary data
  useEffect(() => {
    if (user?.id && assessment?.id && assessment?.questions && !isCalculated) {
      const userAttempts = getUserAssessmentAttempts(user.id)
      const assessmentAttempts = userAttempts.filter(attempt => attempt.assessmentId === assessment.id)
      const latestAttempt = assessmentAttempts.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())[0]

      if (latestAttempt) {
        // Calculate wrong answers
        const wrongAnswersData: WrongAnswer[] = []
        
        assessment.questions.forEach((question: any, index: number) => {
          const userAnswer = latestAttempt.answers[index]
          const isCorrect = userAnswer === question.correctAnswer || 
                          (question.type === "true-false" && userAnswer?.toString() === question.correctAnswer?.toString())
          
          if (!isCorrect) {
            // Format the answers based on question type
            let formattedUserAnswer: string | number = userAnswer ?? "No answer"
            let formattedCorrectAnswer: string | number = question.correctAnswer

            if (question.type === "multiple-choice" && question.options) {
              formattedUserAnswer = typeof userAnswer === "number" ? question.options[userAnswer] || "No answer" : "No answer"
              formattedCorrectAnswer = typeof question.correctAnswer === "number" ? question.options[question.correctAnswer] || question.correctAnswer : question.correctAnswer
            } else if (question.type === "true-false") {
              formattedUserAnswer = userAnswer?.toString() || "No answer"
              formattedCorrectAnswer = question.correctAnswer?.toString() || "No answer"
            }

            wrongAnswersData.push({
              questionNo: index + 1,
              question: question.question,
              userAnswer: formattedUserAnswer,
              correctAnswer: formattedCorrectAnswer,
              type: question.type,
              options: question.options,
              image: question.image
            })
          }
        })

        setWrongAnswers(wrongAnswersData)
        setIsCalculated(true)
      }
    }
  }, [user?.id, assessment?.id, assessment?.questions?.length, isCalculated])

  const passed = score >= 70
  const timeSpentFormatted = `${Math.floor(timeSpent / 3600)}:${Math.floor((timeSpent % 3600) / 60)
    .toString()
    .padStart(2, "0")}:${(timeSpent % 60).toString().padStart(2, "0")}`

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold dark:text-white">Assessment Completed</h1>
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Result Header */}
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center space-x-4 mb-6">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="text-lg">
                  {user?.firstName?.[0]}
                  {user?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">
                  Result:{" "}
                  <span className={passed ? "text-green-600" : "text-red-600"}>{passed ? "Passed" : "Failed"}</span>
                </h2>
                <p className="text-gray-600 dark:text-gray-300">Topic: {topic?.title || "Assessment"}</p>
                <p className="text-gray-600 dark:text-gray-300">Time Limit: {assessment?.timeLimit || "Not specified"}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gray-800 dark:bg-gray-700 text-white">
                <CardContent className="p-6 text-center">
                  <Clock className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm text-gray-300 dark:text-gray-400">Time Spent</p>
                  <p className="text-2xl font-bold">{timeSpentFormatted}</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 dark:bg-gray-700 text-white">
                <CardContent className="p-6 text-center">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm text-gray-300 dark:text-gray-400">Status</p>
                  <p className="text-2xl font-bold text-orange-500">Completed</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 dark:bg-gray-700 text-white">
                <CardContent className="p-6 text-center">
                  <div className="text-center">
                    <p className="text-sm text-gray-300 dark:text-gray-400">Total Score</p>
                    <div className="flex items-center justify-center space-x-2 mt-2">
                      <span className="text-3xl font-bold text-orange-500">{correct}</span>
                      <span className="text-xl text-gray-400">/</span>
                      <span className="text-xl text-gray-400">{total}</span>
                    </div>
                    <div className="w-full bg-gray-700 dark:bg-gray-600 rounded-full h-2 mt-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${score}%` }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Wrong Answers */}
        {wrongAnswers.length > 0 && (
          <Card>
            <CardHeader className="bg-red-50 dark:bg-red-900/20 border-b dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <CardTitle className="text-xl text-red-700 dark:text-red-400">
                  Questions to Review ({wrongAnswers.length})
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {wrongAnswers.map((item, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                      <div className="lg:col-span-3">
                        {/* Question Header */}
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 font-semibold px-3 py-1 rounded-full text-sm">
                            Question {item.questionNo}
                          </div>
                          <Badge variant="outline" className="text-xs dark:border-gray-600 dark:text-gray-300">
                            {item.type === "multiple-choice" ? "Multiple Choice" : "True/False"}
                          </Badge>
                        </div>

                        {/* Question Text */}
                        <p className="text-gray-800 dark:text-gray-200 mb-6 leading-relaxed font-medium">{item.question}</p>

                        {/* Answer Comparison */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          {/* Your Answer */}
                          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-2">
                              <XCircle className="w-4 h-4 text-red-600" />
                              <span className="text-sm font-medium text-red-700 dark:text-red-400">Your Answer</span>
                            </div>
                            <div className="bg-white dark:bg-gray-800 border border-red-300 dark:border-red-700 rounded-md px-3 py-2">
                              <span className="text-red-800 dark:text-red-300 font-medium">{item.userAnswer}</span>
                            </div>
                          </div>

                          {/* Correct Answer */}
                          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-2">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span className="text-sm font-medium text-green-700 dark:text-green-400">Correct Answer</span>
                            </div>
                            <div className="bg-white dark:bg-gray-800 border border-green-300 dark:border-green-700 rounded-md px-3 py-2">
                              <span className="text-green-800 dark:text-green-300 font-medium">{item.correctAnswer}</span>
                            </div>
                          </div>
                        </div>

                        {/* Show all options for multiple choice questions */}
                        {item.type === "multiple-choice" && item.options && (
                          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">All Available Options:</p>
                            <div className="grid grid-cols-1 gap-2">
                              {item.options.map((option, optionIndex) => {
                                const isUserAnswer = option === item.userAnswer
                                const isCorrectAnswer = optionIndex === item.correctAnswer
                                
                                return (
                                  <div 
                                    key={optionIndex} 
                                    className={`p-2 rounded-md border text-sm flex items-center ${
                                      isCorrectAnswer 
                                        ? "bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700 text-green-800 dark:text-green-300" 
                                        : isUserAnswer 
                                          ? "bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700 text-red-800 dark:text-red-300"
                                          : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                                    }`}
                                  >
                                    <span className="font-medium mr-3 w-6">
                                      {String.fromCharCode(65 + optionIndex)}.
                                    </span>
                                    <span className="flex-1">{option}</span>
                                    {isCorrectAnswer && (
                                      <CheckCircle className="w-4 h-4 text-green-600 ml-2" />
                                    )}
                                    {isUserAnswer && !isCorrectAnswer && (
                                      <XCircle className="w-4 h-4 text-red-600 ml-2" />
                                    )}
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Question Image */}
                      <div className="lg:col-span-1">
                        {item.image && (
                          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt="Question illustration"
                              className="w-full h-48 object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* No wrong answers message */}
        {isCalculated && wrongAnswers.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-green-600">Perfect Score!</h3>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Congratulations! You answered all questions correctly. Outstanding performance!
              </p>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex justify-center space-x-4">
          <Link href="/dashboard/topics">
            <Button variant="outline" className="px-6 py-2">
              <BookOpen className="w-4 h-4 mr-2" />
              Continue Learning
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button className="bg-orange-500 hover:bg-orange-600 px-6 py-2">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
