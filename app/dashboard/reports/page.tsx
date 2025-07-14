"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, FileText, Users, Play, ExternalLink, Flag, Eye, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useTopics, useLessons, useLessonCompletions, useLessonViews, useUsers } from "@/hooks/use-data-store"
import { apiClient } from "@/lib/api-client"
import { useSession } from "next-auth/react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

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

interface CommunityReport {
  id: number
  reportable_type: string
  reportable_id: number
  reporter: {
    id: number
    first_name: string
    last_name: string
    email: string
  }
  reason: string
  description: string
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed'
  reviewed_by?: number
  admin_notes?: string
  reviewed_at?: string
  created_at: string
  reportable?: {
    id: number
    title?: string
    content: string
    author: {
      first_name: string
      last_name: string
    }
  }
}

export default function ReportsPage() {
  const searchParams = useSearchParams()
  const tabParam = searchParams.get('tab')
  const [activeTab, setActiveTab] = useState(tabParam || "videos")
  const { topics } = useTopics()
  const { lessons } = useLessons()
  const { completions } = useLessonCompletions()
  const { views } = useLessonViews()
  const { users } = useUsers()
  const [isHydrated, setIsHydrated] = useState(false)
  const [communityReports, setCommunityReports] = useState<CommunityReport[]>([])
  const [loadingReports, setLoadingReports] = useState(false)
  const { data: session } = useSession()

  useEffect(() => {
    setIsHydrated(true)
    loadCommunityReports()
    if (tabParam) {
      setActiveTab(tabParam)
    }
  }, [tabParam])

  const loadCommunityReports = async () => {
    if (!session?.accessToken) return
    
    try {
      setLoadingReports(true)
      const response = await apiClient.get('/community/reports')
      // Handle paginated response - extract data array
      const reports = response.data?.data || response.data || []
      setCommunityReports(Array.isArray(reports) ? reports : [])
    } catch (error) {
      console.error('Error loading community reports:', error)
      setCommunityReports([]) // Set empty array on error
    } finally {
      setLoadingReports(false)
    }
  }

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
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        lastLoggedIn: userViews.length > 0 
          ? new Date(Math.max(...userViews.map(v => new Date(v.viewedAt).getTime()))).toLocaleDateString('en-GB')
          : user.joinedDate,
        averageTime: `${avgTimeHours} hours`,
        sessionsCompleted: `${userCompletions.length} sessions`,
        assessments: `${userCompletions.length} Assessments`, // Assuming 1:1 for now
        status: userViews.length > 0 ? "Active" : "Inactive",
        totalCompletions: userCompletions.length,
        totalViews: userViews.length,
        joinedDate: user.joinedDate,
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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="videos" className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Videos</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Users</span>
          </TabsTrigger>
          <TabsTrigger value="community" className="flex items-center space-x-2">
            <Flag className="w-4 h-4" />
            <span>Community Reports</span>
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
                <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden shadow-sm">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-orange-500 hover:bg-orange-500 dark:bg-orange-600 border-b-0">
                        <TableHead className="text-white font-semibold py-4">Lesson</TableHead>
                        <TableHead className="text-white font-semibold py-4">Topic Category</TableHead>
                        <TableHead className="text-white font-semibold py-4">Number Of Views</TableHead>
                        <TableHead className="text-white font-semibold py-4">Average Of Views</TableHead>
                        <TableHead className="text-white font-semibold py-4">Completion Rate</TableHead>
                        <TableHead className="text-white font-semibold py-4">Date Active</TableHead>
                        <TableHead className="text-white font-semibold py-4">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {videoReports.map((report) => (
                        <TableRow key={report.lessonId} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border-b border-gray-100 dark:border-gray-800">
                          <TableCell className="font-semibold text-gray-900 dark:text-gray-100 py-4">{report.lesson}</TableCell>
                          <TableCell className="py-4">
                            <Badge variant="outline" className="bg-gray-100 dark:bg-gray-700">{report.category}</Badge>
                          </TableCell>
                          <TableCell className="py-4 font-medium">{report.views}</TableCell>
                          <TableCell className="py-4 font-medium">{report.avgViews}</TableCell>
                          <TableCell className="py-4">
                            <span className="font-medium">{report.completionRate}%</span>
                          </TableCell>
                          <TableCell className="py-4 text-gray-600 dark:text-gray-400">{report.dateActive}</TableCell>
                          <TableCell className="py-4">
                            <div className="flex items-center space-x-2">
                              <Link href={`/dashboard/topics/${report.topicId}/lessons/${report.lessonId}`}>
                                <Button size="sm" variant="outline" className="text-orange-600 border-orange-200 hover:bg-orange-50 dark:border-orange-600 dark:hover:bg-orange-900/20">
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
                                  <Button size="sm" variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50 dark:border-blue-600 dark:hover:bg-blue-900/20">
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
                </div>
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
                <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden shadow-sm">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-orange-500 hover:bg-orange-500 dark:bg-orange-600 border-b-0">
                        <TableHead className="text-white font-semibold py-4">Name</TableHead>
                        <TableHead className="text-white font-semibold py-4">Last Logged In</TableHead>
                        <TableHead className="text-white font-semibold py-4">Average Time Spent</TableHead>
                        <TableHead className="text-white font-semibold py-4">Sessions Completed</TableHead>
                        <TableHead className="text-white font-semibold py-4">Number of Assessments Taken</TableHead>
                        <TableHead className="text-white font-semibold py-4">Status</TableHead>
                        <TableHead className="text-white font-semibold py-4">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userReports.map((report) => (
                        <TableRow key={report.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border-b border-gray-100 dark:border-gray-800">
                          <TableCell className="font-semibold text-gray-900 dark:text-gray-100 py-4">{report.name}</TableCell>
                          <TableCell className="py-4 text-gray-600 dark:text-gray-400">{report.lastLoggedIn}</TableCell>
                          <TableCell className="py-4 font-medium">{report.averageTime}</TableCell>
                          <TableCell className="py-4 font-medium">{report.sessionsCompleted}</TableCell>
                          <TableCell className="py-4 font-medium">{report.assessments}</TableCell>
                          <TableCell className="py-4">
                            <Badge variant={report.status === 'Active' ? "default" : "secondary"} className={report.status === 'Active' ? "bg-green-500" : ""}>
                              {report.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="flex items-center space-x-2">
                              <Link href={`/dashboard/user-management`}>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-orange-600 border-orange-200 hover:bg-orange-50 dark:border-orange-600 dark:hover:bg-orange-900/20"
                                >
                                  Manage Users
                                </Button>
                              </Link>
                              <Link href={`/dashboard/profile?userId=${report.id}&admin=true`}>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-blue-600 border-blue-200 hover:bg-blue-50 dark:border-blue-600 dark:hover:bg-blue-900/20"
                                >
                                  View Profile
                                </Button>
                              </Link>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="community" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Community Reports</span>
                <Badge variant="outline" className="text-sm">
                  {communityReports.filter(r => r.status === 'pending').length} Pending
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingReports ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Loading community reports...</p>
                </div>
              ) : communityReports.length === 0 ? (
                <div className="text-center py-8">
                  <Flag className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No reports yet</h3>
                  <p className="text-gray-600 mb-4">Community reports will appear when users report content.</p>
                  <Link href="/dashboard/community">
                    <Button className="bg-orange-500 hover:bg-orange-600">
                      View Community
                    </Button>
                  </Link>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-orange-500 hover:bg-orange-500">
                      <TableHead className="text-white">Reporter</TableHead>
                      <TableHead className="text-white">Content Type</TableHead>
                      <TableHead className="text-white">Reason</TableHead>
                      <TableHead className="text-white">Status</TableHead>
                      <TableHead className="text-white">Reported</TableHead>
                      <TableHead className="text-white">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {communityReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">
                          {report.reporter.first_name} {report.reporter.last_name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {report.reportable_type.includes('Post') ? 'Post' : 'Comment'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {report.reason.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {report.status === 'pending' && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
                            {report.status === 'reviewed' && <Eye className="w-4 h-4 text-blue-500" />}
                            {report.status === 'resolved' && <CheckCircle className="w-4 h-4 text-green-500" />}
                            {report.status === 'dismissed' && <XCircle className="w-4 h-4 text-gray-500" />}
                            <Badge variant={
                              report.status === 'pending' ? 'destructive' :
                              report.status === 'reviewed' ? 'default' :
                              report.status === 'resolved' ? 'default' : 'secondary'
                            }>
                              {report.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(report.created_at).toLocaleDateString('en-GB')}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Link href={`/dashboard/community/${report.reportable_type.includes('Post') ? report.reportable_id : ''}`}>
                              <Button size="sm" variant="outline" className="text-orange-500 border-orange-500">
                                <Eye className="w-3 h-3 mr-1" />
                                View Content
                              </Button>
                            </Link>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                alert(`Report Details:
Reporter: ${report.reporter.first_name} ${report.reporter.last_name} (${report.reporter.email})
Reason: ${report.reason.replace('_', ' ')}
Description: ${report.description}
${report.admin_notes ? `Admin Notes: ${report.admin_notes}` : ''}`)
                              }}
                            >
                              Details
                            </Button>
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
      </Tabs>

    </div>
  )
}
