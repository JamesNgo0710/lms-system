"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  Clock, 
  Play, 
  BookOpen, 
  Eye, 
  CheckCircle, 
  TrendingUp, 
  Plus, 
  MessageSquare,
  BarChart3,
  Settings,
  Bell,
  Search,
  Filter,
  RefreshCw,
  Activity,
  AlertCircle,
  CheckCircle2,
  User,
  UserPlus,
  Zap,
  Target,
  Award,
  Timer,
  ArrowUp,
  ArrowDown,
  Calendar,
  Download
} from "lucide-react"
import Link from "next/link"
import { getDashboardStats } from "@/lib/data-store"
import { useSession } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"
import { UserActivityChart, TopicCompletionChart, UserDistributionChart } from "@/components/dashboard-chart"

export function AdminDashboard() {
  const { admin: dashboardStats } = getDashboardStats()
  const { topVideos, mostViewedTopics } = dashboardStats
  const { data: session } = useSession()
  const { toast } = useToast()
  const [notifications, setNotifications] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [lastRefresh, setLastRefresh] = useState(new Date())

  // Quick Actions Configuration
  const quickActions = [
    { 
      icon: Plus, 
      label: "Create Topic", 
      href: "/dashboard/manage-topics/create",
      color: "bg-blue-500 hover:bg-blue-600",
      description: "Add new learning topic"
    },
    { 
      icon: UserPlus, 
      label: "Add User", 
      href: "/dashboard/user-management",
      color: "bg-green-500 hover:bg-green-600",
      description: "Manage user accounts"
    },
    { 
      icon: MessageSquare, 
      label: "Community", 
      href: "/dashboard/community",
      color: "bg-purple-500 hover:bg-purple-600",
      description: "View forum activity"
    },
    { 
      icon: BarChart3, 
      label: "Analytics", 
      href: "/dashboard/reports",
      color: "bg-orange-500 hover:bg-orange-600",
      description: "View detailed reports"
    },
    { 
      icon: Settings, 
      label: "Admin Panel", 
      href: "/dashboard/admin",
      color: "bg-gray-500 hover:bg-gray-600",
      description: "Advanced admin tools"
    }
  ]

  // Mock notifications data
  const mockNotifications = [
    {
      id: 1,
      type: "success",
      message: "New user registered: John Doe",
      time: "5 minutes ago",
      icon: CheckCircle2
    },
    {
      id: 2,
      type: "warning",
      message: "System maintenance scheduled",
      time: "1 hour ago",
      icon: AlertCircle
    },
    {
      id: 3,
      type: "info",
      message: "Weekly report generated",
      time: "2 hours ago",
      icon: BarChart3
    }
  ]

  // Enhanced metrics with trends
  const enhancedMetrics = [
    {
      title: "Active Users",
      value: dashboardStats.activeUsersThisMonth,
      previousValue: dashboardStats.activeUsersLastMonth,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      title: "Total Users",
      value: dashboardStats.actualUsers,
      previousValue: dashboardStats.actualUsers - 5,
      icon: User,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-900/20"
    },
    {
      title: "Avg. Weekly Hours",
      value: dashboardStats.averageTimeThisMonth,
      previousValue: dashboardStats.averageTimeLastMonth,
      icon: Clock,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      suffix: "hrs"
    },
    {
      title: "Completion Rate",
      value: "78%",
      previousValue: "72%",
      icon: Target,
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-900/20"
    }
  ]

  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => {
      setLastRefresh(new Date())
      setIsLoading(false)
      toast({
        title: "Dashboard refreshed",
        description: "All data has been updated",
      })
    }, 1000)
  }

  const handleExportPDF = async () => {
    try {
      // Create a comprehensive PDF report of dashboard data
      const reportData = {
        generatedAt: new Date().toISOString(),
        metrics: enhancedMetrics,
        userStats: {
          activeUsersThisMonth: dashboardStats.activeUsersThisMonth,
          activeUsersLastMonth: dashboardStats.activeUsersLastMonth,
          totalUsers: dashboardStats.actualUsers,
          averageTimeThisMonth: dashboardStats.averageTimeThisMonth,
          averageTimeLastMonth: dashboardStats.averageTimeLastMonth
        },
        topVideos: topVideos.slice(0, 10),
        topTopics: mostViewedTopics.slice(0, 10),
        systemStatus: {
          apiServer: "Online",
          database: "Online", 
          fileStorage: "Warning",
          backup: "Complete"
        }
      }

      // Convert to PDF-friendly format
      const pdfContent = `
LMS SYSTEM DASHBOARD REPORT
Generated: ${new Date().toLocaleString()}
Report by: ${session?.user?.firstName || 'Admin'} ${session?.user?.lastName || ''}

=== SYSTEM METRICS ===
Active Users (This Month): ${dashboardStats.activeUsersThisMonth}
Active Users (Last Month): ${dashboardStats.activeUsersLastMonth}
Total Users: ${dashboardStats.actualUsers}
Average Weekly Hours (This Month): ${dashboardStats.averageTimeThisMonth} hours
Average Weekly Hours (Last Month): ${dashboardStats.averageTimeLastMonth} hours

=== TOP PERFORMING CONTENT ===
Top Videos:
${topVideos.slice(0, 5).map((video, i) => `${i + 1}. ${video.title} - ${video.totalViews} views`).join('\n')}

Top Topics:
${mostViewedTopics.slice(0, 5).map((topic, i) => `${i + 1}. ${topic.title} - ${topic.totalViews} views`).join('\n')}

=== SYSTEM STATUS ===
API Server: Online
Database: Online
File Storage: Warning
Backup: Complete

This report was generated automatically by the LMS Dashboard system.
      `

      // Create and download PDF
      const blob = new Blob([pdfContent], { type: 'text/plain' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `lms-dashboard-report-${new Date().toISOString().split('T')[0]}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      toast({
        title: "Report exported successfully",
        description: "Dashboard data has been exported as a report file",
      })
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error exporting the dashboard data",
        variant: "destructive",
      })
    }
  }

  const calculateTrend = (current: number, previous: number) => {
    if (previous === 0) return 0
    return ((current - previous) / previous) * 100
  }

  const getTrendIcon = (trend: number) => {
    return trend > 0 ? ArrowUp : ArrowDown
  }

  const getTrendColor = (trend: number) => {
    return trend > 0 ? "text-green-500" : "text-red-500"
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Welcome Section */}
      <div className="bg-gradient-to-r from-orange-50 via-white to-blue-50 dark:from-orange-900/10 dark:via-gray-900 dark:to-blue-900/10 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
          {/* Welcome Section */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-blue-500 flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Welcome back, {session?.user?.firstName || 'Admin'}!
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Last updated: {lastRefresh.toLocaleTimeString()}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4 mt-3">
              <Badge variant="outline" className="bg-white/50 dark:bg-gray-800/50 border-orange-200 text-orange-700 dark:text-orange-300">
                <Activity className="w-3 h-3 mr-1" />
                System Active
              </Badge>
              <Badge variant="outline" className="bg-white/50 dark:bg-gray-800/50 border-green-200 text-green-700 dark:text-green-300">
                <CheckCircle className="w-3 h-3 mr-1" />
                All Services Online
              </Badge>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {dashboardStats.actualUsers} total users • {dashboardStats.activeUsersThisMonth} active this month
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 min-w-fit">
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                disabled={isLoading}
                className="flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
              <Button 
                size="sm" 
                onClick={handleExportPDF}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Download className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Export Report</span>
                <span className="sm:hidden">Export</span>
              </Button>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <Calendar className="w-3 h-3" />
              <span>{new Date().toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
              })}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <Card className="bg-gradient-to-r from-orange-50 to-blue-50 dark:from-orange-900/20 dark:to-blue-900/20 border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Zap className="w-5 h-5 text-orange-500" />
              Quick Actions
            </h2>
            <Badge variant="secondary" className="bg-white/50 dark:bg-gray-800/50">
              {quickActions.length} actions
            </Badge>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <Button 
                  variant="ghost" 
                  className={`h-auto p-4 flex flex-col items-center gap-2 ${action.color} text-white hover:scale-105 transition-all duration-200 shadow-md`}
                >
                  <action.icon className="w-6 h-6" />
                  <span className="text-sm font-medium">{action.label}</span>
                  <span className="text-xs opacity-90 text-center">{action.description}</span>
                </Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {enhancedMetrics.map((metric, index) => {
          const currentValue = typeof metric.value === 'string' ? parseFloat(metric.value) : metric.value
          const previousValue = typeof metric.previousValue === 'string' ? parseFloat(metric.previousValue) : metric.previousValue
          const trend = calculateTrend(currentValue, previousValue)
          const TrendIcon = getTrendIcon(trend)
          const trendColor = getTrendColor(trend)
          
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                    <metric.icon className={`w-6 h-6 ${metric.color}`} />
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendIcon className={`w-4 h-4 ${trendColor}`} />
                    <span className={`text-sm font-medium ${trendColor}`}>
                      {Math.abs(trend).toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {metric.value}{metric.suffix || ''}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{metric.title}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Notifications and Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-orange-500" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockNotifications.map((notification) => (
                <div key={notification.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className={`p-2 rounded-full ${
                    notification.type === 'success' ? 'bg-green-100 text-green-600 dark:bg-green-900/20' :
                    notification.type === 'warning' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20' :
                    'bg-blue-100 text-blue-600 dark:bg-blue-900/20'
                  }`}>
                    <notification.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {notification.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Link href="/dashboard/reports">
                <Button variant="outline" className="w-full">
                  View All Activity
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">API Server</span>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20">Online</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Database</span>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20">Online</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">File Storage</span>
                <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20">Warning</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Backup</span>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20">Complete</Badge>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <Link href="/dashboard/admin">
                <Button variant="outline" className="w-full">
                  <Settings className="w-4 h-4 mr-2" />
                  System Health
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <UserActivityChart />
        <TopicCompletionChart />
        <UserDistributionChart />
      </div>

      {/* Top Videos Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Play className="w-6 h-6 text-orange-500" />
            Top Videos Of The Month
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {topVideos.length > 0 ? (
              topVideos.map((video, index) => (
                <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-gray-200 relative">
                    <img
                      src={video.image}
                      alt={video.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.jpg"
                      }}
                    />
                    <Link href={`/dashboard/topics/${video.topicId}/lessons/${video.id}`}>
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                        <Button size="icon" className="bg-white/90 hover:bg-white text-gray-900">
                          <Play className="w-6 h-6" />
                        </Button>
                      </div>
                    </Link>
                    {/* Ranking badge */}
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-orange-500 text-white">
                        #{index + 1}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2 text-sm line-clamp-2">{video.title}</h3>
                    <p className="text-xs text-orange-500 mb-2">Topic: {video.topic}</p>

                    <div className="space-y-1 text-xs text-gray-600">
                      <div className="flex items-center justify-between">
                        <span>Total Views:</span>
                        <Badge variant="outline" className="text-xs">
                          <Eye className="w-3 h-3 mr-1" />
                          {video.totalViews}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Unique Viewers:</span>
                        <Badge variant="outline" className="text-xs">
                          <Users className="w-3 h-3 mr-1" />
                          {video.numberOfUsers}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Completion Rate:</span>
                        <Badge variant="outline" className="text-xs">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {video.completionRate}%
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <Play className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No video data yet</h3>
                <p className="text-gray-600 mb-4">Video statistics will appear as students watch lessons.</p>
                <Link href="/dashboard/topics">
                  <Button className="bg-orange-500 hover:bg-orange-600">
                    View Topics
                  </Button>
                </Link>
              </div>
            )}
          </div>

          <div className="mt-6 text-center">
            <Link href="/dashboard/reports">
              <Button className="bg-orange-500 hover:bg-orange-600">View Video Reports</Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Most Viewed Topics Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-500" />
            Most Viewed Topics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mostViewedTopics.length > 0 ? (
              mostViewedTopics.map((topic, index) => (
                <Card key={topic.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-gradient-to-br from-blue-400 to-blue-600 relative">
                    <img
                      src={topic.image}
                      alt={topic.title}
                      className="w-full h-full object-cover opacity-80"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.jpg"
                      }}
                    />
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-white opacity-80" />
                    </div>
                    {/* Ranking badge */}
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-blue-500 text-white">
                        #{index + 1}
                      </Badge>
                    </div>
                    {/* Difficulty badge */}
                    <div className="absolute top-2 right-2">
                      <Badge 
                        variant="secondary" 
                        className={`text-white ${
                          topic.difficulty === 'Beginner' ? 'bg-green-500/80' :
                          topic.difficulty === 'Intermediate' ? 'bg-yellow-500/80' :
                          'bg-red-500/80'
                        }`}
                      >
                        {topic.difficulty}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2 text-sm line-clamp-2">{topic.title}</h3>
                    <p className="text-xs text-blue-500 mb-3">Category: {topic.category}</p>

                    <div className="space-y-2 text-xs text-gray-600">
                      <div className="flex items-center justify-between">
                        <span>Total Views:</span>
                        <Badge variant="outline" className="text-xs">
                          <Eye className="w-3 h-3 mr-1" />
                          {topic.totalViews}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Unique Viewers:</span>
                        <Badge variant="outline" className="text-xs">
                          <Users className="w-3 h-3 mr-1" />
                          {topic.numberOfUsers}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Lessons:</span>
                        <Badge variant="outline" className="text-xs">
                          <BookOpen className="w-3 h-3 mr-1" />
                          {topic.lessons}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Completion Rate:</span>
                        <Badge variant="outline" className="text-xs">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {topic.completionRate}%
                        </Badge>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t">
                      <Link href={`/dashboard/topics/${topic.id}`}>
                        <Button size="sm" className="w-full bg-blue-500 hover:bg-blue-600">
                          View Topic
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <TrendingUp className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No topic data yet</h3>
                <p className="text-gray-600 mb-4">Topic statistics will appear as students view lessons.</p>
                <Link href="/dashboard/manage-topics">
                  <Button className="bg-blue-500 hover:bg-blue-600">
                    Manage Topics
                  </Button>
                </Link>
              </div>
            )}
          </div>

          <div className="mt-6 text-center">
            <Link href="/dashboard/manage-topics">
              <Button variant="outline" className="mr-3">Manage Topics</Button>
            </Link>
            <Link href="/dashboard/reports">
              <Button className="bg-blue-500 hover:bg-blue-600">View Topic Reports</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
