"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useSync } from "@/hooks/use-data-store"

export function SyncProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const { setCurrentUser } = useSync()

  useEffect(() => {
    if (session?.user?.id) {
      // Initialize sync with current user
      setCurrentUser(session.user.id)
      // Sync initialized for user
    }
  }, [session?.user?.id, setCurrentUser])

  return <>{children}</>
} 