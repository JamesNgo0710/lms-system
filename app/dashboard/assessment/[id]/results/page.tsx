"use client"

import { useState, useEffect } from "react"
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
  Star
} from "lucide-react"
import Link from "next/link"
import { useAssessments, useAssessmentSubmissions } from "@/hooks/use-data-store"

const wrongAnswers = [
  {
    questionNo: 5,
    question:
      "Lorem Ipsum Dolor Sit Amet Consectetur Adipiscing Elit Sed Do Eiusmod Tempor Incididunt Labore Et Dolore Magna Aliqua",
    userAnswer: "False",
    correctAnswer: "True",
    image: "/placeholder.svg?height=200&width=300",
  },
]

export default function AssessmentResultsPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession()
  const user = session?.user
  const searchParams = useSearchParams()

  const score = Number.parseInt(searchParams.get("score") || "0")
  const timeSpent = Number.parseInt(searchParams.get("timeSpent") || "0")
  const correct = Number.parseInt(searchParams.get("correct") || "0")
  const total = Number.parseInt(searchParams.get("total") || "0")

  const passed = score >= 70
  const timeSpentFormatted = `${Math.floor(timeSpent / 3600)}:${Math.floor((timeSpent % 3600) / 60)
    .toString()
    .padStart(2, "0")}:${(timeSpent % 60).toString().padStart(2, "0")}`

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold">Assessment Completed</h1>
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
                <p className="text-gray-600">Topic: General Info On Blockchain Tech</p>
                <p className="text-gray-600">Time Limit: 3 Hours</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gray-800 text-white">
                <CardContent className="p-6 text-center">
                  <Clock className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm text-gray-300">Time Spent</p>
                  <p className="text-2xl font-bold">{Math.floor(timeSpent / 3600)} Hour</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 text-white">
                <CardContent className="p-6 text-center">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm text-gray-300">Status</p>
                  <p className="text-2xl font-bold text-orange-500">Completed</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 text-white">
                <CardContent className="p-6 text-center">
                  <div className="text-center">
                    <p className="text-sm text-gray-300">Total Score</p>
                    <div className="flex items-center justify-center space-x-2 mt-2">
                      <span className="text-3xl font-bold text-orange-500">{correct}</span>
                      <span className="text-xl text-gray-400">/</span>
                      <span className="text-xl text-gray-400">{total}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
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
            <CardContent className="p-8">
              <h3 className="text-xl font-bold mb-6">Wrong Answer:</h3>

              {wrongAnswers.map((item, index) => (
                <div key={index} className="border rounded-lg p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <h4 className="font-semibold text-orange-500 mb-4">Question No. {item.questionNo}</h4>
                      <p className="text-gray-700 mb-6">{item.question}</p>

                      <div className="flex space-x-4">
                        <div className="flex items-center space-x-2">
                          <Badge variant="destructive" className="bg-red-500">
                            <XCircle className="w-3 h-3 mr-1" />
                            {item.userAnswer}
                          </Badge>
                          <span className="text-sm text-gray-500">Your Answer</span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Badge variant="default" className="bg-green-500">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            {item.correctAnswer}
                          </Badge>
                          <span className="text-sm text-gray-500">Correct Answer</span>
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-1">
                      {item.image && (
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt="Question illustration"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex justify-center space-x-4">
          <Link href="/dashboard/topics">
            <Button variant="outline">Continue Learning</Button>
          </Link>
          <Link href="/dashboard">
            <Button className="bg-orange-500 hover:bg-orange-600">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
