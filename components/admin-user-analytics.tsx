"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Users, 
  Search, 
  Filter,
  TrendingUp,
  Clock,
  Award,
  Target,
  Flame,
  BookOpen,
  Eye,
  Calendar,
  BarChart3
} from "lucide-react"
import { useUsers, useTopics, useLessons, useLessonCompletions, useAssessmentAttempts } from "@/hooks/use-api-data-store"

export function UserAnalytics() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState("name")
  
  const { users } = useUsers()
  const { topics } = useTopics()
  const { lessons } = useLessons()
  const { lessonCompletions } = useLessonCompletions()
  const { assessmentAttempts } = useAssessmentAttempts()
  
  const filteredUsers = users.filter(user => 
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)
      case "progress":
        return (b.completedTopics / b.totalTopics) - (a.completedTopics / a.totalTopics)
      case "xp":
        return (b.weeklyHours * 10) - (a.weeklyHours * 10)
      case "streak":
        return b.thisWeekHours - a.thisWeekHours
      case "joined":
        return new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime()
      default:
        return 0
    }
  })

  const selectedUserData = selectedUser ? users.find(u => u.id === selectedUser) : null

  const calculateXP = (user: any) => user.weeklyHours * 10
  const calculateProgress = (user: any) => Math.round((user.completedTopics / user.totalTopics) * 100)
  const calculateStreak = (user: any) => Math.floor(user.thisWeekHours / 7) // Days based on weekly hours

  return (
    <div className="space-y-6">
      {/* Search and Filter Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 flex gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="progress">Progress</SelectItem>
              <SelectItem value="xp">Experience</SelectItem>
              <SelectItem value="streak">Activity</SelectItem>
              <SelectItem value="joined">Join Date</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Badge variant="outline" className="text-sm">
          {filteredUsers.length} users found
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              All Users
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 max-h-96 overflow-y-auto">
            {sortedUsers.map((user) => (
              <div 
                key={user.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${
                  selectedUser === user.id ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : ''
                }`}
                onClick={() => setSelectedUser(user.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold">{user.firstName} {user.lastName}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <Badge variant="outline" className="text-xs">
                      {calculateProgress(user)}% complete
                    </Badge>
                    <p className="text-xs text-gray-500">
                      {calculateXP(user)} XP
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* User Detail Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              User Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedUserData ? (
              <div className="space-y-6">
                {/* User Header */}
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {selectedUserData.firstName.charAt(0)}{selectedUserData.lastName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold">{selectedUserData.firstName} {selectedUserData.lastName}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{selectedUserData.email}</p>
                    <p className="text-sm text-gray-500">Role: {selectedUserData.role}</p>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
                    <div className="flex items-center gap-3">
                      <Target className="w-8 h-8 text-green-600" />
                      <div>
                        <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                          {calculateProgress(selectedUserData)}%
                        </p>
                        <p className="text-sm text-green-600 dark:text-green-300">Progress</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
                    <div className="flex items-center gap-3">
                      <Award className="w-8 h-8 text-purple-600" />
                      <div>
                        <p className="text-2xl font-bold text-purple-700 dark:text-purple-400">
                          {calculateXP(selectedUserData)}
                        </p>
                        <p className="text-sm text-purple-600 dark:text-purple-300">Experience</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
                    <div className="flex items-center gap-3">
                      <Flame className="w-8 h-8 text-orange-600" />
                      <div>
                        <p className="text-2xl font-bold text-orange-700 dark:text-orange-400">
                          {calculateStreak(selectedUserData)}
                        </p>
                        <p className="text-sm text-orange-600 dark:text-orange-300">Day Streak</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                    <div className="flex items-center gap-3">
                      <Clock className="w-8 h-8 text-blue-600" />
                      <div>
                        <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                          {selectedUserData.thisWeekHours}h
                        </p>
                        <p className="text-sm text-blue-600 dark:text-blue-300">This Week</p>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Detailed Analytics */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Learning Analytics</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-blue-500" />
                        <span className="text-sm">Topics Completed</span>
                      </div>
                      <Badge variant="outline">
                        {selectedUserData.completedTopics} / {selectedUserData.totalTopics}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-green-500" />
                        <span className="text-sm">Weekly Study Hours</span>
                      </div>
                      <Badge variant="outline">
                        {selectedUserData.weeklyHours}h
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-purple-500" />
                        <span className="text-sm">Member Since</span>
                      </div>
                      <Badge variant="outline">
                        {new Date(selectedUserData.joinedDate).toLocaleDateString()}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-orange-500" />
                        <span className="text-sm">Current Topic</span>
                      </div>
                      <Badge variant="outline">
                        {selectedUserData.currentTopic || "Not assigned"}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Progress Visualization */}
                <div className="space-y-3">
                  <h4 className="font-semibold">Progress Breakdown</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Overall Progress</span>
                      <span>{calculateProgress(selectedUserData)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${calculateProgress(selectedUserData)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Select a User</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Click on a user from the list to view their detailed analytics
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}