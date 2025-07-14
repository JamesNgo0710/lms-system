"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Server, 
  Database, 
  Cloud, 
  Wifi, 
  HardDrive, 
  Cpu, 
  MemoryStick, 
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  Shield,
  Globe,
  FileText,
  Settings,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Gauge,
  Bell,
  Download,
  Upload,
  Users,
  BarChart3,
  LineChart,
  PieChart,
  Monitor,
  Smartphone,
  Tablet,
  Router,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Play,
  Pause,
  Square,
  RotateCcw,
  Power,
  Thermometer,
  Battery,
  Signal
} from "lucide-react"

// Mock real-time system data
const generateSystemMetrics = () => ({
  cpu: Math.floor(Math.random() * 40) + 30,
  memory: Math.floor(Math.random() * 30) + 50,
  storage: Math.floor(Math.random() * 20) + 60,
  network: Math.floor(Math.random() * 15) + 85,
  temperature: Math.floor(Math.random() * 10) + 45,
  uptime: "15d 8h 42m",
  activeConnections: Math.floor(Math.random() * 200) + 300,
  requestsPerSecond: Math.floor(Math.random() * 50) + 150,
  responseTime: Math.floor(Math.random() * 100) + 120,
  errorRate: Math.floor(Math.random() * 5) + 2,
})

const mockServices = [
  {
    id: "1",
    name: "API Server",
    status: "online",
    uptime: "99.9%",
    responseTime: "145ms",
    lastCheck: "30s ago",
    port: 8000,
    version: "v2.1.3"
  },
  {
    id: "2", 
    name: "Database",
    status: "online",
    uptime: "99.8%",
    responseTime: "23ms",
    lastCheck: "15s ago",
    port: 5432,
    version: "v14.2"
  },
  {
    id: "3",
    name: "Redis Cache",
    status: "online",
    uptime: "99.9%",
    responseTime: "8ms",
    lastCheck: "10s ago",
    port: 6379,
    version: "v7.0"
  },
  {
    id: "4",
    name: "File Storage",
    status: "warning",
    uptime: "98.5%",
    responseTime: "890ms",
    lastCheck: "45s ago",
    port: 9000,
    version: "v1.8.2"
  },
  {
    id: "5",
    name: "Email Service",
    status: "offline",
    uptime: "95.2%",
    responseTime: "timeout",
    lastCheck: "2m ago",
    port: 587,
    version: "v3.1.1"
  },
  {
    id: "6",
    name: "Authentication",
    status: "online",
    uptime: "99.7%",
    responseTime: "67ms",
    lastCheck: "20s ago",
    port: 3000,
    version: "v1.5.0"
  }
]

const mockAlerts = [
  {
    id: "1",
    type: "warning",
    title: "High Memory Usage",
    description: "Memory usage has exceeded 85% for the last 10 minutes",
    timestamp: "2 minutes ago",
    severity: "medium",
    service: "API Server"
  },
  {
    id: "2",
    type: "error",
    title: "Email Service Down",
    description: "Email service is not responding to health checks",
    timestamp: "5 minutes ago",
    severity: "high",
    service: "Email Service"
  },
  {
    id: "3",
    type: "info",
    title: "Scheduled Maintenance",
    description: "Database backup completed successfully",
    timestamp: "1 hour ago",
    severity: "low",
    service: "Database"
  },
  {
    id: "4",
    type: "warning",
    title: "Slow Response Time",
    description: "File storage response time increased by 200%",
    timestamp: "3 hours ago",
    severity: "medium",
    service: "File Storage"
  }
]

const mockLogs = [
  {
    id: "1",
    timestamp: "2024-01-15 10:30:15",
    level: "INFO",
    service: "API Server",
    message: "User authentication successful",
    ip: "192.168.1.100"
  },
  {
    id: "2",
    timestamp: "2024-01-15 10:29:45",
    level: "ERROR",
    service: "Email Service",
    message: "SMTP connection timeout",
    ip: "192.168.1.101"
  },
  {
    id: "3",
    timestamp: "2024-01-15 10:28:30",
    level: "WARN",
    service: "Database",
    message: "Query execution time exceeded threshold",
    ip: "192.168.1.102"
  },
  {
    id: "4",
    timestamp: "2024-01-15 10:27:12",
    level: "INFO",
    service: "File Storage",
    message: "File upload completed",
    ip: "192.168.1.103"
  }
]

export default function AdminSystemHealth() {
  const [metrics, setMetrics] = useState(generateSystemMetrics())
  const [services, setServices] = useState(mockServices)
  const [alerts, setAlerts] = useState(mockAlerts)
  const [logs, setLogs] = useState(mockLogs)
  const [isLive, setIsLive] = useState(true)

  // Simulate real-time updates
  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      setMetrics(generateSystemMetrics())
      
      // Occasionally update service status
      if (Math.random() > 0.8) {
        setServices(prev => prev.map(service => ({
          ...service,
          responseTime: service.status === "online" 
            ? `${Math.floor(Math.random() * 200) + 50}ms`
            : service.responseTime,
          lastCheck: "now"
        })))
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [isLive])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-100 text-green-800"
      case "warning": return "bg-yellow-100 text-yellow-800"
      case "offline": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online": return <CheckCircle className="w-4 h-4 text-green-600" />
      case "warning": return <AlertTriangle className="w-4 h-4 text-yellow-600" />
      case "offline": return <XCircle className="w-4 h-4 text-red-600" />
      default: return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case "error": return "border-red-200 bg-red-50"
      case "warning": return "border-yellow-200 bg-yellow-50"
      case "info": return "border-blue-200 bg-blue-50"
      default: return "border-gray-200 bg-gray-50"
    }
  }

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case "ERROR": return "text-red-600 bg-red-100"
      case "WARN": return "text-yellow-600 bg-yellow-100"
      case "INFO": return "text-blue-600 bg-blue-100"
      default: return "text-gray-600 bg-gray-100"
    }
  }

  const getMetricColor = (value: number, thresholds: { warning: number, critical: number }) => {
    if (value >= thresholds.critical) return "text-red-600"
    if (value >= thresholds.warning) return "text-yellow-600"
    return "text-green-600"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">System Health</h2>
          <p className="text-gray-600 dark:text-gray-400">Real-time monitoring and system diagnostics</p>
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
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* System Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.cpu}%</div>
            <Progress value={metrics.cpu} className="mt-2" />
            <div className={`text-xs mt-1 ${getMetricColor(metrics.cpu, { warning: 70, critical: 90 })}`}>
              {metrics.cpu < 70 ? "Normal" : metrics.cpu < 90 ? "High" : "Critical"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            <MemoryStick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.memory}%</div>
            <Progress value={metrics.memory} className="mt-2" />
            <div className={`text-xs mt-1 ${getMetricColor(metrics.memory, { warning: 80, critical: 95 })}`}>
              {metrics.memory < 80 ? "Normal" : metrics.memory < 95 ? "High" : "Critical"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Usage</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.storage}%</div>
            <Progress value={metrics.storage} className="mt-2" />
            <div className={`text-xs mt-1 ${getMetricColor(metrics.storage, { warning: 80, critical: 95 })}`}>
              {metrics.storage < 80 ? "Normal" : metrics.storage < 95 ? "High" : "Critical"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network</CardTitle>
            <Wifi className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.network}%</div>
            <Progress value={metrics.network} className="mt-2" />
            <div className={`text-xs mt-1 ${metrics.network > 90 ? "text-green-600" : "text-yellow-600"}`}>
              {metrics.network > 90 ? "Excellent" : "Good"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.uptime}</div>
            <div className="text-xs text-green-600">99.9% availability</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Connections</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeConnections}</div>
            <div className="text-xs text-blue-600">+12% from yesterday</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Requests/sec</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.requestsPerSecond}</div>
            <div className="text-xs text-green-600">Within normal range</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.responseTime}ms</div>
            <div className="text-xs text-green-600">Optimal performance</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="services" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Service Status</CardTitle>
              <CardDescription>Real-time status of all system services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map((service) => (
                  <Card key={service.id} className="relative">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Server className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{service.name}</h3>
                            <p className="text-sm text-gray-500">:{service.port}</p>
                          </div>
                        </div>
                        {getStatusIcon(service.status)}
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Status</span>
                          <Badge className={getStatusColor(service.status)}>
                            {service.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Uptime</span>
                          <span className="font-medium">{service.uptime}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Response</span>
                          <span className="font-medium">{service.responseTime}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Version</span>
                          <span className="font-medium">{service.version}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Last Check</span>
                          <span className="text-gray-500">{service.lastCheck}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-4">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Play className="w-4 h-4 mr-1" />
                          Restart
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="w-4 h-4 mr-1" />
                          Logs
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Alerts</CardTitle>
              <CardDescription>Recent system alerts and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <Alert key={alert.id} className={getAlertColor(alert.type)}>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">{alert.title}</span>
                            <Badge variant="outline">{alert.service}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>{alert.timestamp}</span>
                            <span>Severity: {alert.severity}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Logs</CardTitle>
              <CardDescription>Real-time system log entries</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>IP Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-sm">{log.timestamp}</TableCell>
                      <TableCell>
                        <Badge className={getLogLevelColor(log.level)}>
                          {log.level}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{log.service}</TableCell>
                      <TableCell className="max-w-md truncate">{log.message}</TableCell>
                      <TableCell className="font-mono text-sm">{log.ip}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Thermometer className="w-4 h-4 text-orange-500" />
                      <span className="text-sm">Temperature</span>
                    </div>
                    <span className="text-sm font-medium">{metrics.temperature}°C</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Download className="w-4 h-4 text-blue-500" />
                      <span className="text-sm">Download Speed</span>
                    </div>
                    <span className="text-sm font-medium">850 Mbps</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Upload className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Upload Speed</span>
                    </div>
                    <span className="text-sm font-medium">420 Mbps</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Signal className="w-4 h-4 text-purple-500" />
                      <span className="text-sm">Error Rate</span>
                    </div>
                    <span className="text-sm font-medium">{metrics.errorRate}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resource Usage Trend</CardTitle>
                <CardDescription>Last 24 hours overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Peak CPU Usage</span>
                    <span className="text-sm font-medium">78%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Peak Memory Usage</span>
                    <span className="text-sm font-medium">85%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Peak Disk I/O</span>
                    <span className="text-sm font-medium">450 MB/s</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Peak Network Usage</span>
                    <span className="text-sm font-medium">1.2 GB/s</span>
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