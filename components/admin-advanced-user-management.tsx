"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { 
  Search, 
  Filter, 
  Download, 
  Upload, 
  UserPlus, 
  Users, 
  Shield, 
  Clock, 
  Activity,
  CheckCircle,
  AlertTriangle,
  Trash2,
  Edit,
  MoreHorizontal,
  FileDown,
  FileUp,
  Ban,
  UserCheck,
  Eye,
  Mail,
  Phone,
  Calendar,
  BookOpen,
  Award,
  TrendingUp,
  TrendingDown
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock data
const mockUsers = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice@example.com",
    role: "student",
    status: "active",
    lastActive: "2 hours ago",
    joinDate: "2024-01-15",
    completedTopics: 8,
    totalTopics: 12,
    engagementScore: 85,
    weeklyHours: 12,
    riskLevel: "low"
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob@example.com",
    role: "admin",
    status: "active",
    lastActive: "30 minutes ago",
    joinDate: "2023-12-01",
    completedTopics: 12,
    totalTopics: 12,
    engagementScore: 95,
    weeklyHours: 8,
    riskLevel: "low"
  },
  {
    id: "3",
    name: "Carol Davis",
    email: "carol@example.com",
    role: "student",
    status: "inactive",
    lastActive: "1 week ago",
    joinDate: "2024-02-20",
    completedTopics: 2,
    totalTopics: 12,
    engagementScore: 45,
    weeklyHours: 2,
    riskLevel: "high"
  },
  {
    id: "4",
    name: "David Wilson",
    email: "david@example.com",
    role: "creator",
    status: "active",
    lastActive: "1 hour ago",
    joinDate: "2024-01-10",
    completedTopics: 10,
    totalTopics: 12,
    engagementScore: 78,
    weeklyHours: 15,
    riskLevel: "medium"
  },
]

const mockAuditLogs = [
  {
    id: "1",
    action: "User Created",
    user: "Alice Johnson",
    performedBy: "Admin",
    timestamp: "2024-01-15 10:30:00",
    details: "New student account created",
    ipAddress: "192.168.1.100"
  },
  {
    id: "2",
    action: "Password Changed",
    user: "Bob Smith",
    performedBy: "Bob Smith",
    timestamp: "2024-01-14 14:22:00",
    details: "Password updated successfully",
    ipAddress: "192.168.1.101"
  },
  {
    id: "3",
    action: "Role Updated",
    user: "Carol Davis",
    performedBy: "Admin",
    timestamp: "2024-01-13 09:15:00",
    details: "Role changed from student to creator",
    ipAddress: "192.168.1.102"
  },
  {
    id: "4",
    action: "Account Suspended",
    user: "David Wilson",
    performedBy: "Admin",
    timestamp: "2024-01-12 16:45:00",
    details: "Account suspended for policy violation",
    ipAddress: "192.168.1.103"
  },
]

export default function AdminAdvancedUserManagement() {
  const [users, setUsers] = useState(mockUsers)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [riskFilter, setRiskFilter] = useState("all")
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [auditLogs, setAuditLogs] = useState(mockAuditLogs)
  const { toast } = useToast()

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    const matchesRisk = riskFilter === "all" || user.riskLevel === riskFilter
    
    return matchesSearch && matchesRole && matchesStatus && matchesRisk
  })

  // Handle user selection
  const handleUserSelect = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const handleSelectAll = () => {
    setSelectedUsers(
      selectedUsers.length === filteredUsers.length 
        ? [] 
        : filteredUsers.map(user => user.id)
    )
  }

  // Bulk operations
  const handleBulkAction = (action: string) => {
    const selectedUserNames = users
      .filter(user => selectedUsers.includes(user.id))
      .map(user => user.name)
      .join(", ")

    switch (action) {
      case "activate":
        setUsers(prev => prev.map(user => 
          selectedUsers.includes(user.id) 
            ? { ...user, status: "active" }
            : user
        ))
        toast({
          title: "Users Activated",
          description: `Activated ${selectedUsers.length} users: ${selectedUserNames}`,
        })
        break
      case "deactivate":
        setUsers(prev => prev.map(user => 
          selectedUsers.includes(user.id) 
            ? { ...user, status: "inactive" }
            : user
        ))
        toast({
          title: "Users Deactivated",
          description: `Deactivated ${selectedUsers.length} users: ${selectedUserNames}`,
        })
        break
      case "delete":
        setUsers(prev => prev.filter(user => !selectedUsers.includes(user.id)))
        toast({
          title: "Users Deleted",
          description: `Deleted ${selectedUsers.length} users: ${selectedUserNames}`,
          variant: "destructive",
        })
        break
      case "export":
        // Mock export functionality
        const exportData = users.filter(user => selectedUsers.includes(user.id))
        const csvContent = "data:text/csv;charset=utf-8," + 
          "Name,Email,Role,Status,Join Date,Completed Topics,Engagement Score\n" +
          exportData.map(user => 
            `${user.name},${user.email},${user.role},${user.status},${user.joinDate},${user.completedTopics},${user.engagementScore}`
          ).join("\n")
        
        const link = document.createElement("a")
        link.setAttribute("href", encodeURI(csvContent))
        link.setAttribute("download", "users_export.csv")
        link.click()
        
        toast({
          title: "Export Complete",
          description: `Exported ${selectedUsers.length} users to CSV`,
        })
        break
    }
    setSelectedUsers([])
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low": return "bg-green-100 text-green-800"
      case "medium": return "bg-yellow-100 text-yellow-800"
      case "high": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800"
      case "inactive": return "bg-gray-100 text-gray-800"
      case "suspended": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getEngagementTrend = (score: number) => {
    if (score >= 80) return { icon: TrendingUp, color: "text-green-600" }
    if (score >= 60) return { icon: Activity, color: "text-yellow-600" }
    return { icon: TrendingDown, color: "text-red-600" }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Advanced User Management</h2>
          <p className="text-gray-600 dark:text-gray-400">Comprehensive user administration and analytics</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Import Users
          </Button>
          <Button className="flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            Add User
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <div className="text-xs text-green-600">+12% from last month</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter(u => u.status === "active").length}</div>
            <div className="text-xs text-green-600">+8% from last week</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter(u => u.riskLevel === "high").length}</div>
            <div className="text-xs text-red-600">Needs attention</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Engagement</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(users.reduce((sum, u) => sum + u.engagementScore, 0) / users.length)}%
            </div>
            <div className="text-xs text-blue-600">Platform average</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="analytics">User Analytics</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="creator">Creator</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Select value={riskFilter} onValueChange={setRiskFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Risk" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk</SelectItem>
                <SelectItem value="low">Low Risk</SelectItem>
                <SelectItem value="medium">Medium Risk</SelectItem>
                <SelectItem value="high">High Risk</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bulk Actions */}
          {selectedUsers.length > 0 && (
            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      {selectedUsers.length} users selected
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleBulkAction("activate")}
                    >
                      <UserCheck className="w-4 h-4 mr-1" />
                      Activate
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleBulkAction("deactivate")}
                    >
                      <Ban className="w-4 h-4 mr-1" />
                      Deactivate
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleBulkAction("export")}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Export
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleBulkAction("delete")}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Users Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox 
                        checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Engagement</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => {
                    const engagementTrend = getEngagementTrend(user.engagementScore)
                    const TrendIcon = engagementTrend.icon
                    
                    return (
                      <TableRow key={user.id}>
                        <TableCell>
                          <Checkbox 
                            checked={selectedUsers.includes(user.id)}
                            onCheckedChange={() => handleUserSelect(user.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={`/avatars/${user.id}.jpg`} />
                              <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="capitalize">
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(user.status)}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="w-20">
                            <div className="flex items-center gap-1 text-sm mb-1">
                              <span>{user.completedTopics}</span>
                              <span className="text-gray-500">/ {user.totalTopics}</span>
                            </div>
                            <Progress value={(user.completedTopics / user.totalTopics) * 100} className="h-2" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{user.engagementScore}%</span>
                            <TrendIcon className={`w-4 h-4 ${engagementTrend.color}`} />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getRiskColor(user.riskLevel)}>
                            {user.riskLevel}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {user.lastActive}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="ghost">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Engagement Distribution</CardTitle>
                <CardDescription>Breakdown of user engagement levels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">High Engagement (80%+)</span>
                    <span className="text-sm font-medium">
                      {users.filter(u => u.engagementScore >= 80).length} users
                    </span>
                  </div>
                  <Progress value={(users.filter(u => u.engagementScore >= 80).length / users.length) * 100} />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Medium Engagement (60-79%)</span>
                    <span className="text-sm font-medium">
                      {users.filter(u => u.engagementScore >= 60 && u.engagementScore < 80).length} users
                    </span>
                  </div>
                  <Progress value={(users.filter(u => u.engagementScore >= 60 && u.engagementScore < 80).length / users.length) * 100} />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Low Engagement (Below 60%)</span>
                    <span className="text-sm font-medium">
                      {users.filter(u => u.engagementScore < 60).length} users
                    </span>
                  </div>
                  <Progress value={(users.filter(u => u.engagementScore < 60).length / users.length) * 100} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Assessment</CardTitle>
                <CardDescription>User risk levels and recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.filter(u => u.riskLevel === "high").slice(0, 3).map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">{user.name}</div>
                          <div className="text-xs text-gray-500">Last active: {user.lastActive}</div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Mail className="w-4 h-4 mr-1" />
                        Contact
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Audit Logs</CardTitle>
              <CardDescription>User activity and system changes</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Action</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Performed By</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>IP Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <Badge variant="outline">{log.action}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{log.user}</TableCell>
                      <TableCell>{log.performedBy}</TableCell>
                      <TableCell className="text-sm text-gray-500">{log.timestamp}</TableCell>
                      <TableCell className="text-sm">{log.details}</TableCell>
                      <TableCell className="text-sm text-gray-500">{log.ipAddress}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}