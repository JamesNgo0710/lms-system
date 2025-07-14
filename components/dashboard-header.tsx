"use client"

import { useSession, signOut } from "next-auth/react"
import { useCallback, memo } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { SyncIndicator } from "./sync-status"
import { LogOut, Home, Search, Command } from "lucide-react"
import Link from "next/link"

interface DashboardHeaderProps {
  onOpenSearch?: () => void
}

const DashboardHeader = memo(function DashboardHeader({ onOpenSearch }: DashboardHeaderProps) {
  const { data: session } = useSession()
  const user = session?.user
  const pathname = usePathname()
  const isOnDashboard = pathname === "/dashboard"

  const handleLogout = useCallback(async () => {
    try {
      // Clear any localStorage data
      localStorage.clear()
      
      // Clear any sessionStorage data
      sessionStorage.clear()
      
      // Sign out with redirect
      await signOut({ callbackUrl: "/" })
    } catch (error) {
      console.error('Logout error:', error)
      // Force redirect even if signOut fails
      window.location.href = "/"
    }
  }, [])

  return (
    <header className="flex h-16 items-center justify-between border-b px-6">
      <div>
        {!isOnDashboard && (
          <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Home className="h-5 w-5 text-orange-500" />
            <h1 className="text-xl font-semibold">Back to home page</h1>
          </Link>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onOpenSearch}
          className="flex items-center gap-2"
        >
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline">Search</span>
          <div className="hidden sm:flex items-center gap-1 text-xs text-gray-500">
            <Command className="h-3 w-3" />
            <span>K</span>
          </div>
        </Button>
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
