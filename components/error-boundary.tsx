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
      // TEMPORARILY DISABLED: Don't show error page - just render children normally
      // This will suppress the "Something went wrong" page and let the app continue
      console.warn('Error boundary caught error but suppressing error page:', this.state.error)
      return this.props.children
    }

    return this.props.children
  }
}

export default ErrorBoundary 