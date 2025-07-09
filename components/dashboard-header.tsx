"use client"

import { useSession, signOut } from "next-auth/react"
import { useCallback, memo } from "react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { SyncIndicator } from "./sync-status"
import { LogOut, Home } from "lucide-react"
import Link from "next/link"

const DashboardHeader = memo(function DashboardHeader() {
  const { data: session } = useSession()
  const user = session?.user

  const handleLogout = useCallback(() => {
    signOut({ callbackUrl: "/" })
  }, [])

  return (
    <header className="flex h-16 items-center justify-between border-b px-6">
      <div>
        <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Home className="h-5 w-5 text-orange-500" />
          <h1 className="text-xl font-semibold">Back to home page</h1>
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <SyncIndicator />
        <ThemeToggle />
        <Button variant="outline" size="sm" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </header>
  )
})

export { DashboardHeader }
