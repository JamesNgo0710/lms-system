"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  BookOpen, 
  Users, 
  Clock, 
  PlayCircle, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Eye,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  BarChart3,
  PieChart,
  LineChart,
  Target,
  Zap,
  Award,
  Star,
  Heart,
  Share2,
  Download,
  Filter,
  Search,
  RefreshCw,
  Lightbulb,
  Flag,
  Calendar,
  Globe,
  Smartphone,
  Monitor,
  Tablet
} from "lucide-react"

// Mock data for content analytics
const mockTopics = [
  {
    id: "1",
    title: "Blockchain Basics",
    category: "Fundamentals",
    status: "published",
    views: 1247,
    uniqueViews: 892,
    completions: 456,
    completionRate: 51.1,
    avgTimeSpent: 45,
    engagementScore: 78,
    difficulty: "Beginner",
    lastUpdated: "2024-01-15",
    trending: "up",
    userRating: 4.2,
    totalRatings: 89,
    dropOffPoints: [
      { lesson: "Introduction", dropOff: 15 },
      { lesson: "Hash Functions", dropOff: 32 },
      { lesson: "Consensus Mechanisms", dropOff: 45 }
    ]
  },
  {
    id: "2", 
    title: "DeFi Fundamentals",
    category: "Advanced",
    status: "published",
    views: 856,
    uniqueViews: 623,
    completions: 387,
    completionRate: 62.1,
    avgTimeSpent: 38,
    engagementScore: 85,
    difficulty: "Intermediate",
    lastUpdated: "2024-01-10",
    trending: "up",
    userRating: 4.6,
    totalRatings: 67,
    dropOffPoints: [
      { lesson: "Liquidity Pools", dropOff: 28 },
      { lesson: "Yield Farming", dropOff: 35 },
      { lesson: "Impermanent Loss", dropOff: 42 }
    ]
  },
  {
    id: "3",
    title: "Smart Contracts",
    category: "Development",
    status: "published", 
    views: 634,
    uniqueViews: 445,
    completions: 201,
    completionRate: 45.2,
    avgTimeSpent: 52,
    engagementScore: 65,
    difficulty: "Advanced",
    lastUpdated: "2024-01-08",
    trending: "down",
    userRating: 3.8,
    totalRatings: 34,
    dropOffPoints: [
      { lesson: "Solidity Basics", dropOff: 25 },
      { lesson: "Contract Deployment", dropOff: 58 },
      { lesson: "Security Best Practices", dropOff: 67 }
    ]
  },
  {
    id: "4",
    title: "MetaMask Guide",
    category: "Tools",
    status: "published",
    views: 923,
    uniqueViews: 712,
    completions: 589,
    completionRate: 82.7,
    avgTimeSpent: 22,
    engagementScore: 92,
    difficulty: "Beginner",
    lastUpdated: "2024-01-12",
    trending: "stable",
    userRating: 4.8,
    totalRatings: 123,
    dropOffPoints: [
      { lesson: "Installation", dropOff: 8 },
      { lesson: "Setup", dropOff: 12 },
      { lesson: "Basic Usage", dropOff: 15 }
    ]
  }
]

const mockLearningPatterns = {
  peakHours: [
    { hour: "9 AM", activity: 85 },
    { hour: "10 AM", activity: 92 },
    { hour: "11 AM", activity: 78 },
    { hour: "2 PM", activity: 88 },
    { hour: "3 PM", activity: 95 },
    { hour: "4 PM", activity: 82 },
    { hour: "8 PM", activity: 67 },
    { hour: "9 PM", activity: 71 }
  ],
  deviceUsage: [
    { device: "Desktop", percentage: 45, users: 2340 },
    { device: "Mobile", percentage: 35, users: 1820 },
    { device: "Tablet", percentage: 20, users: 1040 }
  ],
  topRegions: [
    { region: "North America", users: 1240, percentage: 38 },
    { region: "Europe", users: 980, percentage: 30 },
    { region: "Asia", users: 720, percentage: 22 },
    { region: "Others", users: 320, percentage: 10 }
  ]
}

const mockRecommendations = [
  {
    id: "1",
    type: "optimization",
    priority: "high",
    title: "Optimize Smart Contracts Content",
    description: "High drop-off rate at 'Contract Deployment' lesson. Consider breaking into smaller modules.",
    impact: "Could improve completion rate by 15-20%",
    action: "Split lesson into 2-3 smaller segments"
  },
  {
    id: "2",
    type: "content",
    priority: "medium",
    title: "Add Interactive Elements",
    description: "Blockchain Basics has good views but low engagement. Add quizzes or interactive demos.",
    impact: "Potential 10-15% increase in engagement",
    action: "Add 2-3 interactive components"
  },
  {
    id: "3",
    type: "promotion",
    priority: "low",
    title: "Promote DeFi Fundamentals",
    description: "High completion rate and user rating. Consider featuring more prominently.",
    impact: "Increase overall platform satisfaction",
    action: "Add to featured topics"
  }
]

export default function AdminContentAnalytics() {
  const [selectedTopic, setSelectedTopic] = useState("all")
  const [timeRange, setTimeRange] = useState("7d")
  const [sortBy, setSortBy] = useState("views")
  const [topics, setTopics] = useState(mockTopics)

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="w-4 h-4 text-green-600" />
      case "down": return <TrendingDown className="w-4 h-4 text-red-600" />
      default: return <div className="w-4 h-4" />
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800"
      case "Intermediate": return "bg-yellow-100 text-yellow-800"
      case "Advanced": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getEngagementColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 border-red-200"
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low": return "bg-green-100 text-green-800 border-green-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case "Desktop": return <Monitor className="w-4 h-4" />
      case "Mobile": return <Smartphone className="w-4 h-4" />
      case "Tablet": return <Tablet className="w-4 h-4" />
      default: return <Monitor className="w-4 h-4" />
    }
  }

  const sortedTopics = [...topics].sort((a, b) => {
    switch (sortBy) {
      case "views": return b.views - a.views
      case "completion": return b.completionRate - a.completionRate
      case "engagement": return b.engagementScore - a.engagementScore
      case "rating": return b.userRating - a.userRating
      default: return b.views - a.views
    }
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Content Analytics</h2>
          <p className="text-gray-600 dark:text-gray-400">Comprehensive content performance and optimization insights</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {topics.reduce((sum, topic) => sum + topic.views, 0).toLocaleString()}
            </div>
            <div className="text-xs text-green-600 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              +18% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Completion</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(topics.reduce((sum, topic) => sum + topic.completionRate, 0) / topics.length)}%
            </div>
            <div className="text-xs text-green-600 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              +3% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Engagement</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(topics.reduce((sum, topic) => sum + topic.engagementScore, 0) / topics.length)}%
            </div>
            <div className="text-xs text-yellow-600 flex items-center">
              <TrendingDown className="w-3 h-3 mr-1" />
              -2% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(topics.reduce((sum, topic) => sum + topic.userRating, 0) / topics.length).toFixed(1)}
            </div>
            <div className="text-xs text-green-600 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              +0.2 from last period
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="optimization">A/B Testing</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          {/* Sort Controls */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="views">Views</SelectItem>
                <SelectItem value="completion">Completion Rate</SelectItem>
                <SelectItem value="engagement">Engagement</SelectItem>
                <SelectItem value="rating">User Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Content Performance Table */}
          <Card>
            <CardHeader>
              <CardTitle>Content Performance Overview</CardTitle>
              <CardDescription>Detailed metrics for all topics</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Topic</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Completion</TableHead>
                    <TableHead>Engagement</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Trend</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedTopics.map((topic) => (
                    <TableRow key={topic.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="font-medium">{topic.title}</div>
                            <div className="text-sm text-gray-500 flex items-center gap-2">
                              <Badge className={getDifficultyColor(topic.difficulty)}>
                                {topic.difficulty}
                              </Badge>
                              <span>{topic.category}</span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{topic.views.toLocaleString()}</div>
                          <div className="text-sm text-gray-500">{topic.uniqueViews} unique</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{topic.completionRate}%</span>
                          </div>
                          <Progress value={topic.completionRate} className="h-2 w-16" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={`font-medium ${getEngagementColor(topic.engagementScore)}`}>
                          {topic.engagementScore}%
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="font-medium">{topic.userRating}</span>
                          <span className="text-sm text-gray-500">({topic.totalRatings})</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getTrendIcon(topic.trending)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <BarChart3 className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Lightbulb className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Learning Patterns */}
            <Card>
              <CardHeader>
                <CardTitle>Learning Patterns</CardTitle>
                <CardDescription>When users are most active</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockLearningPatterns.peakHours.map((hour) => (
                    <div key={hour.hour} className="flex items-center gap-3">
                      <div className="w-16 text-sm font-medium">{hour.hour}</div>
                      <div className="flex-1">
                        <Progress value={hour.activity} className="h-2" />
                      </div>
                      <div className="text-sm text-gray-500">{hour.activity}%</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Device Usage */}
            <Card>
              <CardHeader>
                <CardTitle>Device Usage</CardTitle>
                <CardDescription>How users access content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockLearningPatterns.deviceUsage.map((device) => (
                    <div key={device.device} className="flex items-center gap-3">
                      <div className="flex items-center gap-2 w-20">
                        {getDeviceIcon(device.device)}
                        <span className="text-sm font-medium">{device.device}</span>
                      </div>
                      <div className="flex-1">
                        <Progress value={device.percentage} className="h-2" />
                      </div>
                      <div className="text-sm text-gray-500">{device.percentage}%</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Geographic Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Geographic Distribution</CardTitle>
                <CardDescription>Where your users are located</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockLearningPatterns.topRegions.map((region) => (
                    <div key={region.region} className="flex items-center gap-3">
                      <div className="flex items-center gap-2 w-32">
                        <Globe className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-medium">{region.region}</span>
                      </div>
                      <div className="flex-1">
                        <Progress value={region.percentage} className="h-2" />
                      </div>
                      <div className="text-sm text-gray-500">{region.users} users</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Drop-off Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Drop-off Analysis</CardTitle>
                <CardDescription>Where users stop engaging</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topics.slice(0, 3).map((topic) => (
                    <div key={topic.id} className="border rounded-lg p-4">
                      <div className="font-medium mb-2">{topic.title}</div>
                      <div className="space-y-2">
                        {topic.dropOffPoints.map((point, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <div className="w-32 text-sm">{point.lesson}</div>
                            <div className="flex-1">
                              <Progress value={point.dropOff} className="h-2" />
                            </div>
                            <div className="text-sm text-red-600">{point.dropOff}%</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Recommendations</CardTitle>
              <CardDescription>Actionable insights to improve content performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRecommendations.map((rec) => (
                  <Card key={rec.id} className={`border-l-4 ${getPriorityColor(rec.priority)}`}>
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getPriorityColor(rec.priority)}>
                              {rec.priority} priority
                            </Badge>
                            <Badge variant="outline">{rec.type}</Badge>
                          </div>
                          <h3 className="font-semibold mb-1">{rec.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1 text-green-600">
                              <Target className="w-4 h-4" />
                              <span>{rec.impact}</span>
                            </div>
                            <div className="flex items-center gap-1 text-blue-600">
                              <Lightbulb className="w-4 h-4" />
                              <span>{rec.action}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <Flag className="w-4 h-4 mr-1" />
                            Implement
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>A/B Testing Dashboard</CardTitle>
              <CardDescription>Test different content variations to optimize performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">A/B Testing Coming Soon</h3>
                  <p className="text-gray-600 mb-4">Test different versions of your content to optimize engagement and completion rates.</p>
                  <Button>
                    <Zap className="w-4 h-4 mr-2" />
                    Enable A/B Testing
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}