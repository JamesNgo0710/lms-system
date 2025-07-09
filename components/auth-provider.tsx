"use client"

import type React from "react"
import { useEffect } from "react"
import { SessionProvider } from "next-auth/react"
import { HydrationWrapper } from "./ui/hydration-wrapper"
import ErrorBoundary from "./error-boundary"
import { initializeApiClient } from "@/lib/api-client"

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  // Initialize CSRF tokens on app startup
  useEffect(() => {
    initializeApiClient()
  }, [])

  return (
    <ErrorBoundary>
      <HydrationWrapper fallback={<div className="min-h-screen bg-background">Loading...</div>}>
        <SessionProvider refetchInterval={0} refetchOnWindowFocus={false}>
          {children}
        </SessionProvider>
      </HydrationWrapper>
    </ErrorBoundary>
  )
}
