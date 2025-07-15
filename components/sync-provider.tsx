"use client"

import { useSync } from "@/hooks/use-api-data-store"

export function SyncProvider({ children }: { children: React.ReactNode }) {
  // Initialize the sync hook - it handles session management internally
  useSync()

  return <>{children}</>
} 