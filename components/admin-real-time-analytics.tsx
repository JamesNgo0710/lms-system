"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  BookOpen, 
  Clock, 
  Award, 
  AlertTriangle,
  CheckCircle,
  PlayCircle,
  Target,
  Activity,
  Zap
} from "lucide-react"

// Mock real-time data - in production, this would come from WebSocket or polling
const generateRealTimeData = () => ({
  activeUsers: Math.floor(Math.random() * 50) + 20,
  onlineUsers: Math.floor(Math.random() * 15) + 5,
  currentSessions: Math.floor(Math.random() * 100) + 50,
  activeTopics: Math.floor(Math.random() * 8) + 3,
  completionRate: Math.floor(Math.random() * 20) + 70,
  engagementScore: Math.floor(Math.random() * 15) + 80,
  systemLoad: Math.floor(Math.random() * 30) + 20,
  responseTime: Math.floor(Math.random() * 100) + 150,
})

const generateTimeSeriesData = () => {
  const data = []
  for (let i = 0; i < 24; i++) {
    data.push({
      time: `${i}:00`,
      users: Math.floor(Math.random() * 30) + 10,
      sessions: Math.floor(Math.random() * 50) + 20,
      completions: Math.floor(Math.random() * 15) + 5,
    })
  }
  return data
}

const mockUserActivity = [
  { id: "1", user: "Alice Johnson", action: "Completed Assessment", topic: "Blockchain Basics", time: "2 min ago", type: "success" },
  { id: "2", user: "Bob Smith", action: "Started Learning", topic: "DeFi Fundamentals", time: "3 min ago", type: "info" },
  { id: "3", user: "Carol Davis", action: "Failed Assessment", topic: "Smart Contracts", time: "5 min ago", type: "warning" },
  { id: "4", user: "David Wilson", action: "Completed Topic", topic: "MetaMask Guide", time: "7 min ago", type: "success" },
  { id: "5", user: "Eve Brown", action: "Joined Platform", topic: "New User", time: "10 min ago", type: "info" },
]

const mockAlerts = [
  { id: "1", type: "warning", message: "High server load detected", time: "1 min ago" },
  { id: "2", type: "info", message: "New user registrations spike", time: "5 min ago" },
  { id: "3", type: "error", message: "Assessment timeout increased", time: "12 min ago" },
]

export default function AdminRealTimeAnalytics() {
  const [realTimeData, setRealTimeData] = useState(generateRealTimeData())
  const [timeSeriesData, setTimeSeriesData] = useState(generateTimeSeriesData())
  const [timeRange, setTimeRange] = useState("24h")
  const [isLive, setIsLive] = useState(true)

  // Simulate real-time updates
  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      setRealTimeData(generateRealTimeData())
      // Update time series data less frequently
      if (Math.random() > 0.7) {
        setTimeSeriesData(generateTimeSeriesData())
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [isLive])

  const getStatusColor = (type: string) => {
    switch (type) {
      case "success": return "bg-green-500"
      case "warning": return "bg-yellow-500"
      case "error": return "bg-red-500"
      default: return "bg-blue-500"
    }
  }

  const getStatusIcon = (type: string) => {
    switch (type) {
      case "success": return <CheckCircle className="w-4 h-4" />
      case "warning": return <AlertTriangle className="w-4 h-4" />
      case "error": return <AlertTriangle className="w-4 h-4" />
      default: return <Activity className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Real-Time Analytics</h2>
          <p className="text-gray-600 dark:text-gray-400">Live platform monitoring and insights</p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant={isLive ? "default" : "outline"} 
            onClick={() => setIsLive(!isLive)}
            className="flex items-center gap-2"
          >
            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
            {isLive ? "Live" : "Paused"}
          </Button>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{realTimeData.activeUsers}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="w-3 h-3 mr-1" />
              +12% from last hour
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Online Now</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{realTimeData.onlineUsers}</div>
            <div className="flex items-center text-xs text-blue-600">
              <Activity className="w-3 h-3 mr-1" />
              Real-time
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <PlayCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{realTimeData.currentSessions}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="w-3 h-3 mr-1" />
              +5% from yesterday
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{realTimeData.completionRate}%</div>
            <div className="flex items-center text-xs text-red-600">
              <TrendingDown className="w-3 h-3 mr-1" />
              -2% from last week
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">User Activity</TabsTrigger>
          <TabsTrigger value="content">Content Performance</TabsTrigger>
          <TabsTrigger value="system">System Health</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Engagement Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Engagement Overview</CardTitle>
                <CardDescription>Platform engagement metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>User Engagement</span>
                    <span>{realTimeData.engagementScore}%</span>
                  </div>
                  <Progress value={realTimeData.engagementScore} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Content Completion</span>
                    <span>{realTimeData.completionRate}%</span>
                  </div>
                  <Progress value={realTimeData.completionRate} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Active Topics</span>
                    <span>{realTimeData.activeTopics}/12</span>
                  </div>
                  <Progress value={(realTimeData.activeTopics / 12) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* System Alerts */}
            <Card>
              <CardHeader>
                <CardTitle>System Alerts</CardTitle>
                <CardDescription>Recent system notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockAlerts.map((alert) => (
                    <div key={alert.id} className="flex items-center gap-3 p-3 rounded-lg border">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(alert.type)}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{alert.message}</p>
                        <p className="text-xs text-gray-500">{alert.time}</p>
                      </div>
                      {getStatusIcon(alert.type)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Live User Activity</CardTitle>
              <CardDescription>Real-time user actions and engagement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockUserActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(activity.type)}`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{activity.user}</span>
                        <span className="text-sm text-gray-500">{activity.action}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <BookOpen className="w-4 h-4" />
                        <span>{activity.topic}</span>
                        <span className="text-xs">•</span>
                        <span>{activity.time}</span>
                      </div>
                    </div>
                    <Badge variant={activity.type === "success" ? "default" : activity.type === "warning" ? "destructive" : "secondary"}>
                      {activity.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Performance</CardTitle>
                <CardDescription>Live content engagement metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Blockchain Basics</p>
                      <p className="text-sm text-gray-500">Most viewed today</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">847</p>
                      <p className="text-sm text-green-600">+23%</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">DeFi Fundamentals</p>
                      <p className="text-sm text-gray-500">Highest completion rate</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">92%</p>
                      <p className="text-sm text-green-600">+8%</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Smart Contracts</p>
                      <p className="text-sm text-gray-500">Most challenging</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">67%</p>
                      <p className="text-sm text-red-600">-12%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Learning Patterns</CardTitle>
                <CardDescription>User behavior insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="font-medium">Peak Hours</span>
                    </div>
                    <p className="text-sm text-gray-600">9:00 AM - 11:00 AM, 2:00 PM - 4:00 PM</p>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-4 h-4 text-green-600" />
                      <span className="font-medium">Top Category</span>
                    </div>
                    <p className="text-sm text-gray-600">Blockchain Basics (43% of activity)</p>
                  </div>
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                      <span className="font-medium">Attention Needed</span>
                    </div>
                    <p className="text-sm text-gray-600">Smart Contracts topic needs review</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Load</CardTitle>
                <CardDescription>Server performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold">{realTimeData.systemLoad}%</div>
                    <Progress value={realTimeData.systemLoad} className="mt-2" />
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>CPU Usage: {realTimeData.systemLoad}%</p>
                    <p>Memory: {Math.min(realTimeData.systemLoad + 10, 100)}%</p>
                    <p>Storage: {Math.min(realTimeData.systemLoad + 5, 100)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Response Time</CardTitle>
                <CardDescription>API performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold">{realTimeData.responseTime}ms</div>
                    <Progress value={(realTimeData.responseTime / 500) * 100} className="mt-2" />
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>Database: {realTimeData.responseTime - 20}ms</p>
                    <p>API: {realTimeData.responseTime}ms</p>
                    <p>Frontend: {realTimeData.responseTime + 50}ms</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>Service health</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Database</span>
                    <Badge variant="default">Online</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">API Server</span>
                    <Badge variant="default">Online</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">File Storage</span>
                    <Badge variant="default">Online</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Cache</span>
                    <Badge variant="secondary">Degraded</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}