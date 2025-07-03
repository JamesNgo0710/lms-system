"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Clock, Play } from "lucide-react"
import Link from "next/link"
import { getDashboardStats } from "@/lib/data-store"

export function AdminDashboard() {
  const { admin: dashboardStats } = getDashboardStats()
  const { topVideos } = dashboardStats

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
          <CardTitle className="text-xl font-bold">Top Videos Of The Month:</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topVideos.map((video) => (
              <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-200 relative">
                  <img
                    src={video.image}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Button size="icon" className="bg-white/90 hover:bg-white text-gray-900">
                      <Play className="w-6 h-6" />
                    </Button>
                  </div>
                </div>

                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 text-sm">{video.title}</h3>
                  <p className="text-xs text-orange-500 mb-2">Topic: {video.topic}</p>

                  <div className="space-y-1 text-xs text-gray-600">
                    <div className="flex items-center justify-between">
                      <span>Total Views:</span>
                      <Badge variant="outline" className="text-xs">
                        {video.totalViews}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Number Of Users:</span>
                      <Badge variant="outline" className="text-xs">
                        {video.numberOfUsers}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Link href="/dashboard/reports">
              <Button className="bg-orange-500 hover:bg-orange-600">View Video Reports</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
