"use client"

import React from "react"

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error?: Error }>
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo)
    // Log the component stack to help identify the exact component causing the issue
    console.error("Component stack:", errorInfo.componentStack)
  }

  render() {
    if (this.state.hasError) {
      // TEMPORARILY DISABLED: Show the actual error instead of the fallback
      // This will help us identify exactly where the lesson object is being rendered
      throw this.state.error
      
      // if (this.props.fallback) {
      //   const FallbackComponent = this.props.fallback
      //   return <FallbackComponent error={this.state.error} />
      // }
      
      // return (
      //   <div className="min-h-screen flex items-center justify-center bg-background">
      //     <div className="text-center">
      //       <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
      //       <p className="text-muted-foreground mb-4">
      //         Please refresh the page or try again later.
      //       </p>
      //       <button
      //         onClick={() => window.location.reload()}
      //         className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
      //       >
      //         Refresh Page
      //       </button>
      //     </div>
      //   </div>
      // )
    }

    return this.props.children
  }
}

export default ErrorBoundary 