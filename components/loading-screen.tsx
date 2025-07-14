"use client"

import { Card } from "@/components/ui/card"
import { Loader2, BookOpen, Users, BarChart3 } from "lucide-react"

interface LoadingScreenProps {
  message?: string
  variant?: "default" | "dashboard" | "auth"
}

export function LoadingScreen({ message = "Loading...", variant = "default" }: LoadingScreenProps) {
  if (variant === "dashboard") {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-neutral-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center bg-white dark:bg-gray-900 shadow-xl">
          <div className="flex flex-col items-center space-y-6">
            {/* Logo/Icon */}
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-blue-500 rounded-full flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-orange-200 rounded-full animate-ping"></div>
            </div>

            {/* Loading Animation */}
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce"></div>
            </div>

            {/* Text */}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Loading Dashboard
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Please wait while we prepare your learning environment
              </p>
            </div>

            {/* Feature Icons */}
            <div className="flex space-x-4 text-gray-400">
              <div className="text-center">
                <Users className="w-6 h-6 mx-auto mb-1" />
                <span className="text-xs">Users</span>
              </div>
              <div className="text-center">
                <BookOpen className="w-6 h-6 mx-auto mb-1" />
                <span className="text-xs">Content</span>
              </div>
              <div className="text-center">
                <BarChart3 className="w-6 h-6 mx-auto mb-1" />
                <span className="text-xs">Analytics</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  if (variant === "auth") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-sm p-6 text-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            <div className="space-y-1">
              <h3 className="font-medium text-gray-900 dark:text-gray-100">
                Authenticating
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Verifying your credentials...
              </p>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  // Default loading
  return (
    <div className="flex h-screen items-center justify-center bg-white dark:bg-gray-900">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        <div className="text-center">
          <h3 className="font-medium text-gray-900 dark:text-gray-100">
            {message}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            This should only take a moment
          </p>
        </div>
      </div>
    </div>
  )
}

// Skeleton components for dashboard loading states
export function DashboardSkeleton() {
  return (
    <div className="space-y-6 p-6">
      {/* Header skeleton */}
      <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
      
      {/* Metrics skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        ))}
      </div>

      {/* Charts skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        ))}
      </div>

      {/* Content skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        ))}
      </div>
    </div>
  )
}