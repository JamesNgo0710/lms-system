"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, FileText, Users, Play, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useTopics, useLessons, useLessonCompletions, useLessonViews, useUsers } from "@/hooks/use-data-store"

interface VideoReport {
  lessonId: number
  topicId: number
  lesson: string
  category: string
  views: number
  avgViews: number
  completionRate: number
  dateActive: string
  videoUrl?: string
}

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("videos")
  const { topics } = useTopics()
  const { lessons } = useLessons()
  const { completions } = useLessonCompletions()
  const { views } = useLessonViews()
  const { users } = useUsers()
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Calculate real video reports from actual data
  const calculateVideoReports = (): VideoReport[] => {
    if (!isHydrated) return []

    const students = users.filter(user => user.role === 'student')
    const studentCount = students.length || 1 // Avoid division by zero

    return lessons.map(lesson => {
      const topic = topics.find(t => t.id === lesson.topicId)
      
      // Count views for this lesson
      const lessonViews = views.filter(view => view.lessonId === lesson.id)
      const uniqueViewers = new Set(lessonViews.map(view => view.userId)).size
      
      // Count completions for this lesson
      const lessonCompletions = completions.filter(completion => completion.lessonId === lesson.id)
      
      // Calculate completion rate
      const completionRate = uniqueViewers > 0 ? Math.round((lessonCompletions.length / uniqueViewers) * 100) : 0
      
      // Average views (total views / total students)
      const avgViews = Math.round(lessonViews.length / studentCount)

      return {
        lessonId: lesson.id,
        topicId: lesson.topicId,
        lesson: lesson.title,
        category: topic?.category || 'Unknown',
        views: lessonViews.length,
        avgViews: avgViews,
        completionRate: completionRate,
        dateActive: lesson.createdAt || new Date().toLocaleDateString('en-GB'),
        videoUrl: lesson.videoUrl
      }
    }).sort((a, b) => b.views - a.views) // Sort by most viewed
  }

  // Calculate real user reports
  const calculateUserReports = () => {
    if (!isHydrated) return []

    const students = users.filter(user => user.role === 'student')
    
    return students.map(user => {
      const userCompletions = completions.filter(completion => completion.userId === user.id)
      const userViews = views.filter(view => view.userId === user.id)
      
      // Calculate average time spent (from completion data)
      const totalTimeSpent = userCompletions.reduce((sum, completion) => 
        sum + (completion.timeSpent || 0), 0)
      const avgTimeHours = Math.round(totalTimeSpent / 60) || user.thisWeekHours

      return {
        name: `${user.firstName} ${user.lastName}`,
        lastLoggedIn: userViews.length > 0 
          ? new Date(Math.max(...userViews.map(v => new Date(v.viewedAt).getTime()))).toLocaleDateString('en-GB')
          : user.joinedDate,
        averageTime: `${avgTimeHours} hours`,
        sessionsCompleted: `${userCompletions.length} sessions`,
        assessments: `${userCompletions.length} Assessments`, // Assuming 1:1 for now
        status: userViews.length > 0 ? "Active" : "Inactive",
      }
    })
  }

  const videoReports = calculateVideoReports()
  const userReports = calculateUserReports()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Reports</h1>
        <Link href="/dashboard">
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Go to Dashboard
          </Button>
        </Link>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="videos" className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Videos</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Users</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="videos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Video Reports</span>
                <Badge variant="outline" className="text-sm">
                  {videoReports.length} Lessons
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!isHydrated ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Loading reports...</p>
                </div>
              ) : videoReports.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No video data yet</h3>
                  <p className="text-gray-600 mb-4">Video reports will appear as students watch lessons.</p>
                  <Link href="/dashboard/topics">
                    <Button className="bg-orange-500 hover:bg-orange-600">
                      View Topics
                    </Button>
                  </Link>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-orange-500 hover:bg-orange-500">
                      <TableHead className="text-white">Lesson</TableHead>
                      <TableHead className="text-white">Topic Category</TableHead>
                      <TableHead className="text-white">Number Of Views</TableHead>
                      <TableHead className="text-white">Average Of Views</TableHead>
                      <TableHead className="text-white">Completion Rate</TableHead>
                      <TableHead className="text-white">Date Active</TableHead>
                      <TableHead className="text-white">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {videoReports.map((report) => (
                      <TableRow key={report.lessonId}>
                        <TableCell className="font-medium">{report.lesson}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{report.category}</Badge>
                        </TableCell>
                        <TableCell>{report.views}</TableCell>
                        <TableCell>{report.avgViews}</TableCell>
                        <TableCell>{report.completionRate}%</TableCell>
                        <TableCell>{report.dateActive}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Link href={`/dashboard/topics/${report.topicId}/lessons/${report.lessonId}`}>
                              <Button size="sm" variant="outline" className="text-orange-500 border-orange-500">
                                <Play className="w-3 h-3 mr-1" />
                                View
                              </Button>
                            </Link>
                            {report.videoUrl && (
                              <a 
                                href={report.videoUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex"
                              >
                                <Button size="sm" variant="outline">
                                  <ExternalLink className="w-3 h-3 mr-1" />
                                  Video
                                </Button>
                              </a>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>User Reports</span>
                <Badge variant="outline" className="text-sm">
                  {userReports.filter(u => u.status === 'Active').length} Active Users
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!isHydrated ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Loading user reports...</p>
                </div>
              ) : userReports.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No users yet</h3>
                  <p className="text-gray-600 mb-4">User reports will appear as students join and use the platform.</p>
                  <Link href="/dashboard/user-management">
                    <Button className="bg-orange-500 hover:bg-orange-600">
                      Manage Users
                    </Button>
                  </Link>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-orange-500 hover:bg-orange-500">
                      <TableHead className="text-white">Name</TableHead>
                      <TableHead className="text-white">Last Logged In</TableHead>
                      <TableHead className="text-white">Average Time Spent</TableHead>
                      <TableHead className="text-white">Sessions Completed</TableHead>
                      <TableHead className="text-white">Number of Assessments Taken</TableHead>
                      <TableHead className="text-white">Status</TableHead>
                      <TableHead className="text-white">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userReports.map((report, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{report.name}</TableCell>
                        <TableCell>{report.lastLoggedIn}</TableCell>
                        <TableCell>{report.averageTime}</TableCell>
                        <TableCell>{report.sessionsCompleted}</TableCell>
                        <TableCell>{report.assessments}</TableCell>
                        <TableCell>
                          <Badge variant={report.status === 'Active' ? "default" : "secondary"}>
                            {report.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-orange-500 text-white border-orange-500 hover:bg-orange-600"
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
