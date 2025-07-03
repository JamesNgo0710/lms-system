"use client"

import { useEffect, useState } from "react"

interface HydrationWrapperProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

/**
 * A wrapper component that only renders its children on the client side
 * after hydration is complete. This prevents hydration mismatches for
 * components that use browser-only APIs or generate dynamic content.
 */
export function HydrationWrapper({ children, fallback = null }: HydrationWrapperProps) {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  if (!isHydrated) {
    return <>{fallback}</>
  }

  return <>{children}</>
} 