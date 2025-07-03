"use client"

import type React from "react"

import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Calendar, Trophy, TrendingUp } from "lucide-react"
import Link from "next/link"
import { getDashboardStats } from "@/lib/data-store"

export function StudentDashboard() {
  const { data: session } = useSession()
  const user = session?.user
  const { student: studentData } = getDashboardStats(user?.id)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user?.name || "Student"}!</h1>
        <p className="text-muted-foreground">Continue your learning journey in blockchain technology</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Topic</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{studentData.currentTopic}</div>
            <p className="text-xs text-muted-foreground mt-1">Last: {studentData.recentActivity}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Learning Progress</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {studentData.completedTopics}/{studentData.totalTopics}
            </div>
            <p className="text-xs text-muted-foreground">Topics completed</p>
            <Progress 
              value={studentData.progressPercentage} 
              className="mt-2" 
            />
            <p className="text-xs text-muted-foreground mt-1">{Math.round(studentData.progressPercentage)}% complete</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentData.thisWeekHours}h</div>
            <p className="text-xs text-muted-foreground">Learning time</p>
            <p className="text-xs text-orange-500 mt-1">
              {studentData.remainingHours}h remaining this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Goal</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentData.weeklyGoal}h</div>
            <p className="text-xs text-muted-foreground">Target hours</p>
            <Progress 
              value={studentData.weeklyProgressPercentage} 
              className="mt-2" 
            />
            <p className="text-xs text-muted-foreground mt-1">{Math.round(studentData.weeklyProgressPercentage)}% achieved</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Continue Learning</CardTitle>
            <CardDescription>
              Pick up where you left off in {studentData.currentTopic}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/dashboard/topics">
                <BookOpen className="mr-2 h-4 w-4" />
                Continue Learning
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Practice Assessment</CardTitle>
            <CardDescription>
              Complete all lessons in a topic to unlock its assessment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild className="w-full">
              <Link href="/dashboard/topics">
                <Trophy className="mr-2 h-4 w-4" />
                View Topics
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {studentData.recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {activity.icon === "BookOpen" && <BookOpen className="h-5 w-5 text-blue-500" />}
                  {activity.icon === "Trophy" && <Trophy className="h-5 w-5 text-yellow-500" />}
                  <div>
                    <p className="font-medium text-sm">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.date}
                      {activity.score && ` • Score: ${activity.score}`}
                    </p>
                  </div>
                </div>
                <Badge className={`${
                  activity.statusColor === 'green' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {activity.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
