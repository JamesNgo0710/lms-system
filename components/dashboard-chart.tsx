"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Activity, Users, Clock, Target } from "lucide-react"

interface ChartData {
  label: string
  value: number
  color: string
}

interface DashboardChartProps {
  title: string
  data: ChartData[]
  type: "bar" | "line" | "pie"
  className?: string
}

export function DashboardChart({ title, data, type, className = "" }: DashboardChartProps) {
  const maxValue = Math.max(...data.map(d => d.value))
  const total = data.reduce((sum, d) => sum + d.value, 0)

  const renderBarChart = () => (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={index} className="space-y-1">
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium text-gray-900 dark:text-gray-100">{item.label}</span>
            <span className="text-gray-600 dark:text-gray-400">{item.value}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${(item.value / maxValue) * 100}%`,
                backgroundColor: item.color 
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )

  const renderLineChart = () => (
    <div className="relative h-32 flex items-end gap-2">
      {data.map((item, index) => (
        <div key={index} className="flex-1 flex flex-col items-center">
          <div 
            className="w-full rounded-t transition-all duration-300"
            style={{ 
              height: `${(item.value / maxValue) * 100}%`,
              backgroundColor: item.color,
              minHeight: '4px'
            }}
          />
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 text-center">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  )

  const renderPieChart = () => (
    <div className="grid grid-cols-2 gap-4">
      <div className="flex items-center justify-center">
        <div className="relative w-24 h-24 sm:w-32 sm:h-32">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="2"
              className="dark:stroke-gray-600"
            />
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100
              const offset = data.slice(0, index).reduce((sum, d) => sum + (d.value / total) * 100, 0)
              return (
                <path
                  key={index}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={item.color}
                  strokeWidth="2"
                  strokeDasharray={`${percentage}, 100`}
                  strokeDashoffset={`${-offset}`}
                  className="transition-all duration-300"
                />
              )
            })}
          </svg>
        </div>
      </div>
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {item.label}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {item.value} ({((item.value / total) * 100).toFixed(1)}%)
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <Card className={`${className} hover:shadow-lg transition-shadow duration-200`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {type === "bar" && renderBarChart()}
        {type === "line" && renderLineChart()}
        {type === "pie" && renderPieChart()}
      </CardContent>
    </Card>
  )
}

// Pre-configured chart components for common dashboard metrics
export function UserActivityChart() {
  const data = [
    { label: "Mon", value: 45, color: "#3b82f6" },
    { label: "Tue", value: 78, color: "#3b82f6" },
    { label: "Wed", value: 62, color: "#3b82f6" },
    { label: "Thu", value: 89, color: "#3b82f6" },
    { label: "Fri", value: 71, color: "#3b82f6" },
    { label: "Sat", value: 34, color: "#3b82f6" },
    { label: "Sun", value: 28, color: "#3b82f6" }
  ]

  return (
    <DashboardChart
      title="Weekly User Activity"
      data={data}
      type="line"
    />
  )
}

export function TopicCompletionChart() {
  const data = [
    { label: "React Basics", value: 85, color: "#10b981" },
    { label: "JavaScript", value: 72, color: "#f59e0b" },
    { label: "TypeScript", value: 67, color: "#3b82f6" },
    { label: "Node.js", value: 54, color: "#8b5cf6" },
    { label: "Database", value: 43, color: "#ef4444" }
  ]

  return (
    <DashboardChart
      title="Topic Completion Rates"
      data={data}
      type="bar"
    />
  )
}

export function UserDistributionChart() {
  const data = [
    { label: "Students", value: 145, color: "#3b82f6" },
    { label: "Teachers", value: 12, color: "#10b981" },
    { label: "Admins", value: 3, color: "#f59e0b" }
  ]

  return (
    <DashboardChart
      title="User Distribution"
      data={data}
      type="pie"
    />
  )
}