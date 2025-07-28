"use client"

import { useState, useEffect } from "react"
import { use } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Clock, ChevronLeft, Lock } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useTopics, useAssessments, useLessonCompletions, useAssessmentAttempts } from "@/hooks/use-api-data-store"
import { apiDataStore } from "@/lib/api-data-store"

export default function TakeAssessmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { data: session } = useSession()
  const user = session?.user
  const { getTopicById } = useTopics()
  const { getAssessmentByTopicId } = useAssessments()
  const { getTopicProgress } = useLessonCompletions()
  const { canTakeAssessment, addAssessmentAttempt } = useAssessmentAttempts()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(null)
  const [answers, setAnswers] = useState<(string | number)[]>([])
  const [timeLeft, setTimeLeft] = useState(3600) // Default 1 hour
  const [isCompleted, setIsCompleted] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  const [topicProgress, setTopicProgress] = useState({ completed: 0, total: 0, percentage: 0 })
  const router = useRouter()

  const resolvedParams = use(params)
  const topicId = Number.parseInt(resolvedParams.id)
  const topic = getTopicById(topicId)
  const assessment = getAssessmentByTopicId(topicId)

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Load progress data for students  
  useEffect(() => {
    if (isHydrated && user?.role === "student" && user.id) {
      loadProgressData(user.id)
    }
  }, [isHydrated, user, topicId])

  const loadProgressData = async (userId: string) => {
    try {
      // Get lessons for this topic
      const lessons = await apiDataStore.getLessonsByTopic(topicId)
      const publishedLessons = lessons.filter(lesson => lesson?.status === 'Published')
      
      // Get user completions
      const completions = await apiDataStore.getUserLessonCompletions(userId)
      const topicCompletions = completions.filter(completion => 
        Number(completion?.topicId) === Number(topicId) && completion?.isCompleted
      )
      
      const total = publishedLessons.length
      const completed = topicCompletions.length
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
      
      setTopicProgress({ completed, total, percentage })
    } catch (error) {
      console.error('Error loading progress:', error)
      setTopicProgress({ completed: 0, total: 0, percentage: 0 })
    }
  }

  // Check if all lessons are completed for students
  const allLessonsCompleted = topicProgress.completed === topicProgress.total && topicProgress.total > 0

  // Check cooldown for assessments
  const cooldownCheck = user && assessment && isHydrated 
    ? canTakeAssessment(user.id, assessment.id) 
    : { canTake: true, message: "" }

  // Set timer based on assessment time limit
  useEffect(() => {
    if (assessment?.timeLimit) {
      const [hours, minutes] = assessment.timeLimit.split(":").map(Number)
      setTimeLeft(hours * 3600 + minutes * 60)
    }
  }, [assessment])

  const questions = assessment?.questions || []
  const question = questions[currentQuestion]
  const progress = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !isCompleted && questions.length > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && questions.length > 0) {
      handleSubmit()
    }
  }, [timeLeft, isCompleted, questions.length])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleNext = () => {
    if (selectedAnswer !== null) {
      const newAnswers = [...answers]
      newAnswers[currentQuestion] = selectedAnswer
      setAnswers(newAnswers)

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(newAnswers[currentQuestion + 1] || null)
      } else {
        handleSubmit()
      }
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setSelectedAnswer(answers[currentQuestion - 1] || null)
    }
  }

  const handleAnswerSelect = (answer: string | number) => {
    setSelectedAnswer(answer)
  }

  const handleSubmit = async () => {
    const finalAnswers = [...answers]
    if (selectedAnswer !== null) {
      finalAnswers[currentQuestion] = selectedAnswer
    }

    const timeSpent = assessment?.timeLimit
      ? Number.parseInt(assessment.timeLimit.split(":")[0]) * 3600 +
        Number.parseInt(assessment.timeLimit.split(":")[1]) * 60 -
        timeLeft
      : 3600 - timeLeft

    // Submit to backend and get the actual calculated score
    let submissionResult = null
    if (user && assessment) {
      submissionResult = await addAssessmentAttempt({
        userId: user.id,
        assessmentId: assessment.id,
        topicId: topicId,
        score: 0, // Will be calculated by backend
        correctAnswers: 0, // Will be calculated by backend
        totalQuestions: questions.length,
        timeSpent: timeSpent,
        completedAt: new Date().toISOString(),
        answers: finalAnswers
      })
    }

    setIsCompleted(true)

    // Use backend-calculated score if available, otherwise fallback to 0
    const actualScore = submissionResult?.score || 0
    const actualCorrect = submissionResult?.correctAnswers || 0

    console.log('🔍 Assessment submission result:', {
      backendScore: actualScore,
      backendCorrect: actualCorrect,
      totalQuestions: questions.length,
      submissionResult
    })

    // Redirect to results page with actual calculated values
    router.push(
      `/dashboard/assessment/${resolvedParams.id}/results?score=${actualScore}&timeSpent=${timeSpent}&correct=${actualCorrect}&total=${questions.length}`,
    )
  }

  // Loading or no assessment
  if (!topic || !assessment || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">Assessment Not Available</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {!topic
                ? "Topic not found"
                : !assessment
                  ? "No assessment created for this topic"
                  : "No questions available"}
            </p>
            <Link href="/dashboard/topics">
              <Button>Back to Topics</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Check if student has completed all lessons
  if (user?.role === "student" && isHydrated && !allLessonsCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <Lock className="w-16 h-16 text-orange-500" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-orange-600">Assessment Locked</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              You must complete all lessons in this topic before taking the assessment.
            </p>
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-medium dark:text-gray-200">Progress</span>
                <span className="font-bold text-orange-600 dark:text-orange-400">{topicProgress.percentage}%</span>
              </div>
              <Progress value={topicProgress.percentage} className="h-2 mb-2" />
              <p className="text-xs text-orange-700 dark:text-orange-300">
                {topicProgress.completed} of {topicProgress.total} lessons completed
              </p>
              <p className="text-xs text-orange-600 dark:text-orange-400 mt-1 font-medium">
                {topicProgress.total - topicProgress.completed} lesson(s) remaining
              </p>
            </div>
            <Link href={`/dashboard/topics/${topicId}`}>
              <Button className="w-full">Continue Learning</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Check cooldown period for students
  if (user?.role === "student" && isHydrated && !cooldownCheck.canTake) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <Clock className="w-16 h-16 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-red-600">Assessment Cooldown Active</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              You must wait before retaking this assessment.
            </p>
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-700 dark:text-red-300 font-medium">
                {cooldownCheck.message}
              </p>
              {cooldownCheck.timeRemaining && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                  Time remaining: {Math.floor(cooldownCheck.timeRemaining / 60)}h {cooldownCheck.timeRemaining % 60}m
                </p>
              )}
            </div>
            <Link href={`/dashboard/topics/${topicId}`}>
              <Button className="w-full">Return to Topic</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">Assessment Submitted!</h2>
            <p className="text-gray-600 dark:text-gray-300">Processing your results...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard/topics">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold dark:text-white">{topic.title} Assessment</h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-orange-500">
              <Clock className="w-5 h-5" />
              <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white dark:bg-gray-800 px-6 py-4 border-b dark:border-gray-700">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-300">{Math.round(progress)}% Complete</span>
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
                <h2 className="text-xl font-semibold mb-6 text-orange-500">Question {currentQuestion + 1}</h2>

                <p className="text-lg mb-8 leading-relaxed dark:text-white">{question.question}</p>

                {/* Answer Options */}
                <div className="space-y-3">
                  {question.type === "multiple-choice" && question.options ? (
                    question.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        className={`w-full p-4 text-left border-2 rounded-lg transition-colors ${
                          selectedAnswer === index
                            ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                            : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 dark:text-white"
                        }`}
                      >
                        {option}
                      </button>
                    ))
                  ) : (
                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleAnswerSelect("true")}
                        className={`px-8 py-3 rounded-lg border-2 transition-colors ${
                          selectedAnswer === "true"
                            ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                            : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 dark:text-white"
                        }`}
                      >
                        True
                      </button>
                      <button
                        onClick={() => handleAnswerSelect("false")}
                        className={`px-8 py-3 rounded-lg border-2 transition-colors ${
                          selectedAnswer === "false"
                            ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                            : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 dark:text-white"
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
                    onClick={handleNext}
                    disabled={selectedAnswer === null}
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    {currentQuestion === questions.length - 1 ? "Submit Assessment" : "Next Question"}
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
          </div>
        </div>
      </div>
    </div>
  )
}
