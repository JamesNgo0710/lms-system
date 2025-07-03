"use client"

import type React from "react"
import { SessionProvider } from "next-auth/react"
import { HydrationWrapper } from "./ui/hydration-wrapper"
import ErrorBoundary from "./error-boundary"

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
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
