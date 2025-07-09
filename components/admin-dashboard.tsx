"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Clock, Play, BookOpen, Eye, CheckCircle, TrendingUp } from "lucide-react"
import Link from "next/link"
import { getDashboardStats } from "@/lib/data-store"

export function AdminDashboard() {
  const { admin: dashboardStats } = getDashboardStats()
  const { topVideos, mostViewedTopics } = dashboardStats

  return (
    <div className="space-y-6">
      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Top Active Users */}
        <Card className="bg-gray-800 text-white">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gray-700 rounded-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-300">Top Active Users</p>
                <p className="text-lg font-semibold text-orange-500">This Month</p>
                <Button size="sm" className="mt-2 bg-orange-500 hover:bg-orange-600 text-xs">
                  View Users Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Users This Month */}
        <Card className="bg-gray-800 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">{dashboardStats.activeUsersThisMonth}</p>
                <p className="text-sm text-gray-300">Active Users</p>
                <p className="text-xs text-orange-500">This Month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Users Last Month */}
        <Card className="bg-gray-800 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">{dashboardStats.activeUsersLastMonth}</p>
                <p className="text-sm text-gray-300">Active Users</p>
                <p className="text-xs text-orange-500">Last Month</p>
                <div className="w-full bg-gray-700 rounded-full h-1 mt-2">
                  <div className="bg-orange-500 h-1 rounded-full" style={{ width: `${(dashboardStats.activeUsersLastMonth / 100) * 100}%` }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actual Users */}
        <Card className="bg-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">{dashboardStats.actualUsers}</p>
                <p className="text-sm">Actual Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Second Row Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Average Time Weekly This Month */}
        <Card className="bg-gray-800 text-white">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gray-700 rounded-lg">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-300">Average Time Weekly</p>
                <p className="text-lg font-semibold text-orange-500">This Month</p>
                <p className="text-2xl font-bold">{dashboardStats.averageTimeThisMonth} hours</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Average Time Weekly Last Month */}
        <Card className="bg-gray-800 text-white">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gray-700 rounded-lg">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-300">Average Time Weekly</p>
                <p className="text-lg font-semibold text-orange-500">Last Month</p>
                <p className="text-2xl font-bold">{dashboardStats.averageTimeLastMonth} hours</p>
              </div>
            </div>
          </CardContent>
        </Card>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
