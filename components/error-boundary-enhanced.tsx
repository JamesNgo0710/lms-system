"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw, Home, Bug, Wifi, WifiOff } from "lucide-react"
import Link from "next/link"

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>
}

export class ErrorBoundaryEnhanced extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorInfo: null
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({
      error,
      errorInfo
    })

    // Log to external service in production
    if (process.env.NODE_ENV === 'production') {
      // Example: logErrorToService(error, errorInfo)
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })
  }

  render() {
    if (this.state.hasError) {
      // TEMPORARILY DISABLED: Suppress error page and render children normally
      console.warn('Enhanced error boundary caught error but suppressing error page:', this.state.error)
      return this.props.children
      
      // if (this.props.fallback) {
      //   const FallbackComponent = this.props.fallback
      //   return <FallbackComponent error={this.state.error!} reset={this.handleReset} />
      // }

      // return <DefaultErrorFallback error={this.state.error!} reset={this.handleReset} />
    }

    return this.props.children
  }
}

function DefaultErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
  const is404Error = error.message.includes('404') || error.message.includes('Not Found')
  const isNetworkError = error.message.includes('fetch') || error.message.includes('network')
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {is404Error ? (
              <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
              </div>
            ) : isNetworkError ? (
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <WifiOff className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
            ) : (
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <Bug className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
            )}
          </div>
          <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {is404Error ? 'Page Not Found' : isNetworkError ? 'Connection Error' : 'Something went wrong'}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            {is404Error 
              ? 'The page you are looking for might have been removed or is temporarily unavailable.'
              : isNetworkError 
              ? 'Unable to connect to the server. Please check your internet connection and try again.'
              : 'An unexpected error occurred. Our team has been notified and is working on a fix.'
            }
          </p>
          
          {process.env.NODE_ENV === 'development' && (
            <details className="text-left bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm">
              <summary className="cursor-pointer font-medium mb-2">Error Details (Development)</summary>
              <pre className="text-red-600 dark:text-red-400 overflow-auto">
                {error.message}
              </pre>
              {error.stack && (
                <pre className="text-gray-600 dark:text-gray-400 mt-2 text-xs overflow-auto">
                  {error.stack}
                </pre>
              )}
            </details>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={reset} className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
            <Link href="/dashboard">
              <Button variant="outline" className="flex items-center gap-2 w-full sm:w-auto">
                <Home className="w-4 h-4" />
                Go to Dashboard
              </Button>
            </Link>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              If this problem persists, please contact support or try refreshing the page.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Network status hook for detecting connection issues
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = React.useState(true)
  const [hasNetworkError, setHasNetworkError] = React.useState(false)

  React.useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setHasNetworkError(false)
    }
    
    const handleOffline = () => {
      setIsOnline(false)
      setHasNetworkError(true)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return { isOnline, hasNetworkError }
}

// Network status indicator component
export function NetworkStatusIndicator() {
  const { isOnline, hasNetworkError } = useNetworkStatus()

  if (isOnline && !hasNetworkError) return null

  return (
    <div className="fixed top-0 left-0 right-0 bg-red-500 text-white text-center py-2 z-50">
      <div className="flex items-center justify-center gap-2">
        <WifiOff className="w-4 h-4" />
        <span className="text-sm font-medium">
          No internet connection. Some features may not work properly.
        </span>
      </div>
    </div>
  )
}