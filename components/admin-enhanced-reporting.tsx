"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { 
  FileText, 
  Download, 
  Mail, 
  Calendar as CalendarIcon, 
  Clock,
  Users,
  BookOpen,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  LineChart,
  Filter,
  Search,
  Settings,
  Plus,
  Edit,
  Trash2,
  Eye,
  Share2,
  Printer,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Award,
  Target,
  Activity,
  Zap,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Star,
  Heart,
  MessageSquare,
  ThumbsUp,
  PlayCircle,
  PauseCircle,
  RotateCcw,
  Send,
  Save,
  Copy,
  ExternalLink
} from "lucide-react"
// import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"

// Mock data for reports
const mockReports = [
  {
    id: "1",
    name: "Monthly User Engagement",
    type: "user",
    category: "Analytics",
    description: "Comprehensive user engagement metrics and trends",
    frequency: "monthly",
    lastGenerated: "2024-01-15T10:30:00Z",
    nextScheduled: "2024-02-15T10:30:00Z",
    status: "completed",
    format: "pdf",
    size: "2.4 MB",
    recipients: ["admin@example.com", "analytics@example.com"],
    isScheduled: true
  },
  {
    id: "2",
    name: "Weekly Content Performance",
    type: "content",
    category: "Performance",
    description: "Topic completion rates and user feedback analysis",
    frequency: "weekly",
    lastGenerated: "2024-01-14T09:00:00Z",
    nextScheduled: "2024-01-21T09:00:00Z",
    status: "scheduled",
    format: "excel",
    size: "1.8 MB",
    recipients: ["content@example.com"],
    isScheduled: true
  },
  {
    id: "3",
    name: "Daily System Health",
    type: "system",
    category: "Operations",
    description: "System performance metrics and health indicators",
    frequency: "daily",
    lastGenerated: "2024-01-15T06:00:00Z",
    nextScheduled: "2024-01-16T06:00:00Z",
    status: "generating",
    format: "pdf",
    size: "856 KB",
    recipients: ["devops@example.com"],
    isScheduled: true
  },
  {
    id: "4",
    name: "Quarterly Business Review",
    type: "business",
    category: "Executive",
    description: "High-level business metrics and strategic insights",
    frequency: "quarterly",
    lastGenerated: "2024-01-01T00:00:00Z",
    nextScheduled: "2024-04-01T00:00:00Z",
    status: "draft",
    format: "pdf",
    size: "5.2 MB",
    recipients: ["ceo@example.com", "cto@example.com"],
    isScheduled: false
  }
]

const mockReportTemplates = [
  {
    id: "1",
    name: "User Analytics Dashboard",
    category: "Analytics",
    description: "Comprehensive user behavior and engagement analysis",
    metrics: ["user_count", "engagement_rate", "session_duration", "retention_rate"],
    visualizations: ["line_chart", "bar_chart", "pie_chart"],
    filters: ["date_range", "user_role", "topic_category"]
  },
  {
    id: "2",
    name: "Content Performance Report",
    category: "Content",
    description: "Topic and lesson performance with completion analytics",
    metrics: ["view_count", "completion_rate", "user_rating", "time_spent"],
    visualizations: ["heat_map", "trend_chart", "comparison_chart"],
    filters: ["date_range", "topic", "difficulty_level"]
  },
  {
    id: "3",
    name: "System Health Summary",
    category: "Operations",
    description: "Infrastructure performance and system reliability metrics",
    metrics: ["uptime", "response_time", "error_rate", "resource_usage"],
    visualizations: ["gauge_chart", "line_chart", "status_grid"],
    filters: ["date_range", "service", "severity"]
  }
]

const mockMetrics = {
  totalUsers: 5247,
  activeUsers: 3892,
  newUsers: 234,
  userGrowth: 12.4,
  totalContent: 48,
  publishedContent: 42,
  avgRating: 4.3,
  contentGrowth: 8.7,
  totalViews: 28456,
  avgSessionTime: 32,
  completionRate: 68.5,
  engagementGrowth: 15.2
}

export default function AdminEnhancedReporting() {
  const [reports, setReports] = useState(mockReports)
  const [selectedReport, setSelectedReport] = useState<string | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(2024, 0, 1),
    to: new Date()
  })
  const [reportType, setReportType] = useState("user")
  const [reportFormat, setReportFormat] = useState("pdf")
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800"
      case "generating": return "bg-blue-100 text-blue-800"
      case "scheduled": return "bg-yellow-100 text-yellow-800"
      case "draft": return "bg-gray-100 text-gray-800"
      case "failed": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-4 h-4 text-green-600" />
      case "generating": return <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
      case "scheduled": return <Clock className="w-4 h-4 text-yellow-600" />
      case "draft": return <Edit className="w-4 h-4 text-gray-600" />
      case "failed": return <XCircle className="w-4 h-4 text-red-600" />
      default: return <FileText className="w-4 h-4 text-gray-600" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "user": return <Users className="w-4 h-4 text-blue-600" />
      case "content": return <BookOpen className="w-4 h-4 text-green-600" />
      case "system": return <Activity className="w-4 h-4 text-purple-600" />
      case "business": return <TrendingUp className="w-4 h-4 text-orange-600" />
      default: return <FileText className="w-4 h-4 text-gray-600" />
    }
  }

  const generateReport = async (reportId: string) => {
    setIsGenerating(true)
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    setReports(prev => prev.map(report => 
      report.id === reportId 
        ? { ...report, status: "completed", lastGenerated: new Date().toISOString() }
        : report
    ))
    
    setIsGenerating(false)
    toast({
      title: "Report Generated",
      description: "Your report has been generated successfully and is ready for download.",
    })
  }

  const scheduleReport = (reportId: string) => {
    setReports(prev => prev.map(report => 
      report.id === reportId 
        ? { ...report, isScheduled: !report.isScheduled }
        : report
    ))
    
    const report = reports.find(r => r.id === reportId)
    toast({
      title: report?.isScheduled ? "Report Unscheduled" : "Report Scheduled",
      description: report?.isScheduled 
        ? "Automatic report generation has been disabled."
        : "Report will be generated automatically according to schedule.",
    })
  }

  const exportReport = (format: string) => {
    toast({
      title: "Export Started",
      description: `Exporting report in ${format.toUpperCase()} format...`,
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Enhanced Reporting</h2>
          <p className="text-gray-600 dark:text-gray-400">Comprehensive analytics and automated reporting system</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Create Report
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Report</DialogTitle>
                <DialogDescription>
                  Set up a new report with custom metrics and scheduling options.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="reportName">Report Name</Label>
                    <Input id="reportName" placeholder="My Custom Report" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reportType">Report Type</Label>
                    <Select value={reportType} onValueChange={setReportType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User Analytics</SelectItem>
                        <SelectItem value="content">Content Performance</SelectItem>
                        <SelectItem value="system">System Health</SelectItem>
                        <SelectItem value="business">Business Metrics</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input id="description" placeholder="Brief description of the report..." />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="format">Format</Label>
                    <Select value={reportFormat} onValueChange={setReportFormat}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="excel">Excel</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="json">JSON</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="frequency">Frequency</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="schedule" />
                  <Label htmlFor="schedule">Enable automatic scheduling</Label>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsCreateDialogOpen(false)}>
                    Create Report
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.length}</div>
            <div className="text-xs text-green-600">+2 this month</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled Reports</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.filter(r => r.isScheduled).length}</div>
            <div className="text-xs text-blue-600">Active schedules</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Generated Today</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <div className="text-xs text-green-600">+25% from yesterday</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.8 GB</div>
            <div className="text-xs text-yellow-600">78% of quota</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="reports" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="exports">Exports</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Report Management</CardTitle>
              <CardDescription>Manage your automated and custom reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reports.map((report) => (
                  <Card key={report.id} className="relative">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            {getTypeIcon(report.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{report.name}</h3>
                              <Badge variant="outline">{report.category}</Badge>
                              <Badge className={getStatusColor(report.status)}>
                                {report.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{report.description}</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">Frequency:</span>
                                <span className="ml-1 font-medium capitalize">{report.frequency}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Format:</span>
                                <span className="ml-1 font-medium uppercase">{report.format}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Size:</span>
                                <span className="ml-1 font-medium">{report.size}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Recipients:</span>
                                <span className="ml-1 font-medium">{report.recipients.length}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                              <span>Last: {new Date(report.lastGenerated).toLocaleDateString()}</span>
                              {report.isScheduled && (
                                <span>Next: {new Date(report.nextScheduled).toLocaleDateString()}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => generateReport(report.id)}
                            disabled={isGenerating}
                          >
                            {getStatusIcon(report.status)}
                            <span className="ml-1">Generate</span>
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => scheduleReport(report.id)}
                          >
                            <Clock className="w-4 h-4 mr-1" />
                            {report.isScheduled ? "Unschedule" : "Schedule"}
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
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

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Report Templates</CardTitle>
              <CardDescription>Pre-built report templates for common use cases</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockReportTemplates.map((template) => (
                  <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <BarChart3 className="w-5 h-5 text-white" />
                        </div>
                        <Badge variant="outline">{template.category}</Badge>
                      </div>
                      <h3 className="font-semibold mb-2">{template.name}</h3>
                      <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-blue-500" />
                          <span className="text-sm">{template.metrics.length} metrics</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <PieChart className="w-4 h-4 text-green-500" />
                          <span className="text-sm">{template.visualizations.length} charts</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Filter className="w-4 h-4 text-purple-500" />
                          <span className="text-sm">{template.filters.length} filters</span>
                        </div>
                      </div>
                      <Button className="w-full mt-4" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Use Template
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Report Usage Analytics</CardTitle>
                <CardDescription>How your reports are being used</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Most Generated Report</span>
                    <span className="text-sm font-medium">Monthly User Engagement</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average Generation Time</span>
                    <span className="text-sm font-medium">2.3 minutes</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Success Rate</span>
                    <span className="text-sm font-medium">98.5%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Storage Growth</span>
                    <span className="text-sm font-medium">+1.2 GB/month</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Popular Report Types</CardTitle>
                <CardDescription>Distribution of report types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">User Analytics</span>
                        <span className="text-sm font-medium">45%</span>
                      </div>
                      <Progress value={45} className="h-2 mt-1" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Content Performance</span>
                        <span className="text-sm font-medium">35%</span>
                      </div>
                      <Progress value={35} className="h-2 mt-1" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">System Health</span>
                        <span className="text-sm font-medium">15%</span>
                      </div>
                      <Progress value={15} className="h-2 mt-1" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Business Metrics</span>
                        <span className="text-sm font-medium">5%</span>
                      </div>
                      <Progress value={5} className="h-2 mt-1" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="exports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Export Center</CardTitle>
              <CardDescription>Export your data in various formats</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-red-600" />
                      </div>
                      <Badge variant="outline">PDF</Badge>
                    </div>
                    <h3 className="font-semibold mb-2">Export as PDF</h3>
                    <p className="text-sm text-gray-600 mb-4">Generate professional PDF reports with charts and tables</p>
                    <Button className="w-full" size="sm" onClick={() => exportReport('pdf')}>
                      <Download className="w-4 h-4 mr-2" />
                      Export PDF
                    </Button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-green-600" />
                      </div>
                      <Badge variant="outline">Excel</Badge>
                    </div>
                    <h3 className="font-semibold mb-2">Export as Excel</h3>
                    <p className="text-sm text-gray-600 mb-4">Export data in spreadsheet format for analysis</p>
                    <Button className="w-full" size="sm" onClick={() => exportReport('excel')}>
                      <Download className="w-4 h-4 mr-2" />
                      Export Excel
                    </Button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <Badge variant="outline">CSV</Badge>
                    </div>
                    <h3 className="font-semibold mb-2">Export as CSV</h3>
                    <p className="text-sm text-gray-600 mb-4">Raw data export for custom analysis and processing</p>
                    <Button className="w-full" size="sm" onClick={() => exportReport('csv')}>
                      <Download className="w-4 h-4 mr-2" />
                      Export CSV
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}