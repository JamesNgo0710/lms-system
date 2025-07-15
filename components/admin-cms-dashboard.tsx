"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Users, 
  BookOpen, 
  Settings, 
  BarChart3, 
  Layout,
  FileText,
  UserCheck,
  TrendingUp,
  Eye,
  Clock,
  Award,
  Target,
  Flame,
  AlertTriangle
} from "lucide-react"
import { UserAnalytics } from "@/components/admin-user-analytics"
import { ContentManagement } from "@/components/admin-content-management"
import { DashboardCustomizer } from "@/components/admin-dashboard-customizer"
import AdminRealTimeAnalytics from "@/components/admin-real-time-analytics"
import AdminAdvancedUserManagement from "@/components/admin-advanced-user-management"
import AdminContentAnalytics from "@/components/admin-content-analytics"
import AdminSystemHealth from "@/components/admin-system-health"
import AdminEnhancedReporting from "@/components/admin-enhanced-reporting"
import { getApiDashboardStats } from "@/lib/api-dashboard-stats"
import { useUsers } from "@/hooks/use-api-data-store"

export function AdminCMSDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const { admin: dashboardStats } = getApiDashboardStats()
  const { users } = useUsers()
  
  const totalUsers = users.length
  const activeUsers = users.filter(user => {
    const lastMonth = new Date()
    lastMonth.setMonth(lastMonth.getMonth() - 1)
    return new Date(user.joinedDate) > lastMonth
  }).length

  const totalXP = users.reduce((sum, user) => sum + (user.weeklyHours * 10), 0)
  const avgProgress = users.length > 0 ? 
    users.reduce((sum, user) => sum + (user.completedTopics / user.totalTopics * 100), 0) / users.length : 0

  return (
    <div className="space-y-6">
      {/* Beta Notice */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <div>
            <h3 className="font-semibold text-amber-800 dark:text-amber-200">
              🚧 Beta Feature - Work in Progress
            </h3>
            <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
              The CMS system is currently in beta development. Some features may be incomplete or subject to change. 
              We're actively working on improvements and welcome your feedback.
            </p>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">Content Management System</h1>
            <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-800/20 dark:text-amber-200">
              Beta
            </Badge>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Manage your learning platform content and users</p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          Admin Panel
        </Badge>
      </div>

      {/* Quick Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total Users</p>
                <p className="text-3xl font-bold">{totalUsers}</p>
              </div>
              <Users className="w-8 h-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Active Users</p>
                <p className="text-3xl font-bold">{activeUsers}</p>
              </div>
              <UserCheck className="w-8 h-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total XP</p>
                <p className="text-3xl font-bold">{totalXP.toLocaleString()}</p>
              </div>
              <Award className="w-8 h-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Avg Progress</p>
                <p className="text-3xl font-bold">{avgProgress.toFixed(0)}%</p>
              </div>
              <Target className="w-8 h-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main CMS Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="overview" className="flex items-center gap-1 text-xs">
            <BarChart3 className="w-3 h-3" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-1 text-xs">
            <TrendingUp className="w-3 h-3" />
            <span>Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="advanced-users" className="flex items-center gap-1 text-xs">
            <UserCheck className="w-3 h-3" />
            <span>Users</span>
          </TabsTrigger>
          <TabsTrigger value="content-analytics" className="flex items-center gap-1 text-xs">
            <BookOpen className="w-3 h-3" />
            <span>Content</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-1 text-xs">
            <Settings className="w-3 h-3" />
            <span>System</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-1 text-xs">
            <FileText className="w-3 h-3" />
            <span>Reports</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-1 text-xs">
            <Users className="w-3 h-3" />
            <span>Legacy</span>
          </TabsTrigger>
          <TabsTrigger value="dashboard" className="flex items-center gap-1 text-xs">
            <Layout className="w-3 h-3" />
            <span>Config</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* System Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  Platform Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Content Views</span>
                  <Badge variant="outline">{dashboardStats.totalContentViews || 1250}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Assessment Completions</span>
                  <Badge variant="outline">{dashboardStats.totalAssessments || 89}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Learning Streaks Active</span>
                  <Badge variant="outline">{users.filter(u => u.thisWeekHours > 0).length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Average Session Time</span>
                  <Badge variant="outline">42 min</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm space-y-2">
                  <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <span>New user registration</span>
                    <span className="text-xs text-gray-500">2 hours ago</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <span>Topic completed</span>
                    <span className="text-xs text-gray-500">4 hours ago</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <span>Assessment submitted</span>
                    <span className="text-xs text-gray-500">6 hours ago</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <span>Content updated</span>
                    <span className="text-xs text-gray-500">1 day ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Performers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                Top Performers This Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {users
                  .sort((a, b) => (b.completedTopics / b.totalTopics) - (a.completedTopics / a.totalTopics))
                  .slice(0, 3)
                  .map((user, index) => (
                    <Card key={user.id} className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                          index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-600'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">{user.firstName} {user.lastName}</p>
                          <p className="text-sm text-gray-600">
                            {user.completedTopics}/{user.totalTopics} topics completed
                          </p>
                        </div>
                        <Badge variant="outline">
                          {Math.round((user.completedTopics / user.totalTopics) * 100)}%
                        </Badge>
                      </div>
                    </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <UserAnalytics />
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <ContentManagement />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <AdminRealTimeAnalytics />
        </TabsContent>

        <TabsContent value="advanced-users" className="space-y-6">
          <AdminAdvancedUserManagement />
        </TabsContent>

        <TabsContent value="content-analytics" className="space-y-6">
          <AdminContentAnalytics />
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <AdminSystemHealth />
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <AdminEnhancedReporting />
        </TabsContent>

        <TabsContent value="dashboard" className="space-y-6">
          <DashboardCustomizer />
        </TabsContent>
      </Tabs>
    </div>
  )
}