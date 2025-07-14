"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Layout, 
  Settings, 
  Palette,
  GripVertical,
  Eye,
  EyeOff,
  Move,
  Save,
  RotateCcw,
  Grid,
  List,
  BarChart3,
  Users,
  BookOpen,
  Award
} from "lucide-react"

interface DashboardWidget {
  id: string
  title: string
  type: "stat" | "chart" | "list" | "grid"
  enabled: boolean
  position: number
  size: "small" | "medium" | "large"
  settings: any
}

export function DashboardCustomizer() {
  const [previewMode, setPreviewMode] = useState(false)
  const [dashboardSettings, setDashboardSettings] = useState({
    theme: "default",
    layout: "grid",
    cardSpacing: 6,
    showWelcomeMessage: true,
    welcomeText: "Continue your learning journey",
    enableAnimations: true,
    compactMode: false
  })

  const [widgets, setWidgets] = useState<DashboardWidget[]>([
    {
      id: "progress-overview",
      title: "Progress Overview",
      type: "stat",
      enabled: true,
      position: 1,
      size: "large",
      settings: { showPercentage: true, showStreak: true }
    },
    {
      id: "current-courses",
      title: "Current Courses",
      type: "grid",
      enabled: true,
      position: 2,
      size: "large",
      settings: { maxItems: 6, showProgress: true }
    },
    {
      id: "achievements",
      title: "Recent Achievements",
      type: "list",
      enabled: true,
      position: 3,
      size: "medium",
      settings: { maxItems: 5, showDate: true }
    },
    {
      id: "learning-stats",
      title: "Learning Statistics",
      type: "chart",
      enabled: true,
      position: 4,
      size: "medium",
      settings: { chartType: "bar", timeframe: "week" }
    },
    {
      id: "study-streak",
      title: "Study Streak",
      type: "stat",
      enabled: true,
      position: 5,
      size: "small",
      settings: { showFire: true, showDays: true }
    },
    {
      id: "upcoming-assessments",
      title: "Upcoming Assessments",
      type: "list",
      enabled: false,
      position: 6,
      size: "medium",
      settings: { maxItems: 3, showDueDate: true }
    }
  ])

  const updateWidget = (id: string, updates: Partial<DashboardWidget>) => {
    setWidgets(widgets.map(widget => 
      widget.id === id ? { ...widget, ...updates } : widget
    ))
  }

  const moveWidget = (id: string, direction: "up" | "down") => {
    const index = widgets.findIndex(w => w.id === id)
    if (index === -1) return

    const newWidgets = [...widgets]
    if (direction === "up" && index > 0) {
      [newWidgets[index], newWidgets[index - 1]] = [newWidgets[index - 1], newWidgets[index]]
    } else if (direction === "down" && index < widgets.length - 1) {
      [newWidgets[index], newWidgets[index + 1]] = [newWidgets[index + 1], newWidgets[index]]
    }

    setWidgets(newWidgets.map((widget, idx) => ({ ...widget, position: idx + 1 })))
  }

  const resetToDefaults = () => {
    setDashboardSettings({
      theme: "default",
      layout: "grid",
      cardSpacing: 6,
      showWelcomeMessage: true,
      welcomeText: "Continue your learning journey",
      enableAnimations: true,
      compactMode: false
    })
  }

  const getWidgetIcon = (type: string) => {
    switch (type) {
      case "stat": return <BarChart3 className="w-4 h-4" />
      case "chart": return <BarChart3 className="w-4 h-4" />
      case "list": return <List className="w-4 h-4" />
      case "grid": return <Grid className="w-4 h-4" />
      default: return <Layout className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Dashboard Configuration</h2>
          <p className="text-gray-600 dark:text-gray-400">Customize the student dashboard layout and widgets</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setPreviewMode(!previewMode)}
            className="flex items-center gap-2"
          >
            {previewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {previewMode ? "Edit Mode" : "Preview"}
          </Button>
          <Button variant="outline" onClick={resetToDefaults}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button className="bg-green-600 hover:bg-green-700">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dashboard Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Theme Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Dashboard Theme</label>
              <Select 
                value={dashboardSettings.theme} 
                onValueChange={(value) => setDashboardSettings({...dashboardSettings, theme: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="minimal">Minimal</SelectItem>
                  <SelectItem value="colorful">Colorful</SelectItem>
                  <SelectItem value="dark">Dark Mode</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Layout Style */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Layout Style</label>
              <Select 
                value={dashboardSettings.layout} 
                onValueChange={(value) => setDashboardSettings({...dashboardSettings, layout: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grid">Grid Layout</SelectItem>
                  <SelectItem value="list">List Layout</SelectItem>
                  <SelectItem value="masonry">Masonry Layout</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Card Spacing */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Card Spacing</label>
              <Slider
                value={[dashboardSettings.cardSpacing]}
                onValueChange={(value) => setDashboardSettings({...dashboardSettings, cardSpacing: value[0]})}
                max={12}
                min={2}
                step={2}
                className="w-full"
              />
              <div className="text-xs text-gray-500">
                Current: {dashboardSettings.cardSpacing}px
              </div>
            </div>

            {/* Welcome Message */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Welcome Message</label>
                <Switch 
                  checked={dashboardSettings.showWelcomeMessage}
                  onCheckedChange={(checked) => setDashboardSettings({...dashboardSettings, showWelcomeMessage: checked})}
                />
              </div>
              {dashboardSettings.showWelcomeMessage && (
                <Input
                  value={dashboardSettings.welcomeText}
                  onChange={(e) => setDashboardSettings({...dashboardSettings, welcomeText: e.target.value})}
                  placeholder="Enter welcome message"
                />
              )}
            </div>

            {/* Toggle Settings */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Enable Animations</span>
                <Switch 
                  checked={dashboardSettings.enableAnimations}
                  onCheckedChange={(checked) => setDashboardSettings({...dashboardSettings, enableAnimations: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Compact Mode</span>
                <Switch 
                  checked={dashboardSettings.compactMode}
                  onCheckedChange={(checked) => setDashboardSettings({...dashboardSettings, compactMode: checked})}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Widget Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layout className="w-5 h-5" />
              Widget Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {widgets
                .sort((a, b) => a.position - b.position)
                .map((widget, index) => (
                <Card key={widget.id} className={`p-4 ${widget.enabled ? 'bg-gray-50 dark:bg-gray-800' : 'bg-gray-100 dark:bg-gray-900 opacity-60'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveWidget(widget.id, "up")}
                          disabled={index === 0}
                          className="h-4 p-0"
                        >
                          <GripVertical className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveWidget(widget.id, "down")}
                          disabled={index === widgets.length - 1}
                          className="h-4 p-0"
                        >
                          <GripVertical className="w-3 h-3" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {getWidgetIcon(widget.type)}
                        <div>
                          <p className="font-medium text-sm">{widget.title}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {widget.type}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {widget.size}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Select 
                        value={widget.size} 
                        onValueChange={(value) => updateWidget(widget.id, { size: value as any })}
                      >
                        <SelectTrigger className="w-20 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Switch 
                        checked={widget.enabled}
                        onCheckedChange={(checked) => updateWidget(widget.id, { enabled: checked })}
                      />
                    </div>
                  </div>

                  {/* Widget-specific settings */}
                  {widget.enabled && (
                    <div className="mt-3 pt-3 border-t space-y-2">
                      {widget.type === "list" && (
                        <div className="flex items-center gap-2">
                          <label className="text-xs">Max Items:</label>
                          <Input 
                            type="number" 
                            value={widget.settings.maxItems || 5}
                            onChange={(e) => updateWidget(widget.id, {
                              settings: { ...widget.settings, maxItems: parseInt(e.target.value) }
                            })}
                            className="w-16 h-6 text-xs"
                            min="1"
                            max="10"
                          />
                        </div>
                      )}
                      
                      {widget.type === "chart" && (
                        <div className="flex items-center gap-2">
                          <label className="text-xs">Chart Type:</label>
                          <Select 
                            value={widget.settings.chartType || "bar"}
                            onValueChange={(value) => updateWidget(widget.id, {
                              settings: { ...widget.settings, chartType: value }
                            })}
                          >
                            <SelectTrigger className="w-20 h-6 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="bar">Bar</SelectItem>
                              <SelectItem value="line">Line</SelectItem>
                              <SelectItem value="pie">Pie</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview Section */}
      {previewMode && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Dashboard Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 bg-gray-50 dark:bg-gray-800">
              <div className="space-y-4">
                {dashboardSettings.showWelcomeMessage && (
                  <div className="text-center p-4 bg-white dark:bg-gray-700 rounded-lg">
                    <h2 className="text-xl font-semibold">{dashboardSettings.welcomeText}</h2>
                  </div>
                )}
                
                <div className={`grid gap-${dashboardSettings.cardSpacing} ${
                  dashboardSettings.layout === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" :
                  dashboardSettings.layout === "list" ? "grid-cols-1" :
                  "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                }`}>
                  {widgets
                    .filter(w => w.enabled)
                    .sort((a, b) => a.position - b.position)
                    .map((widget) => (
                      <div
                        key={widget.id}
                        className={`bg-white dark:bg-gray-700 rounded-lg p-4 border ${
                          widget.size === "large" ? "md:col-span-2" :
                          widget.size === "small" ? "h-24" : "h-32"
                        } ${dashboardSettings.compactMode ? "p-2" : "p-4"}`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {getWidgetIcon(widget.type)}
                          <span className="font-medium text-sm">{widget.title}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {widget.type} widget • {widget.size} size
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}