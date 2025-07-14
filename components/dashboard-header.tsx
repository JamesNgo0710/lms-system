"use client"

import { useSession, signOut } from "next-auth/react"
import { useCallback, memo } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
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
    <header className="h-14 bg-gray-900 dark:bg-gray-950 border-b border-gray-700 dark:border-gray-800 px-4 flex items-center justify-between">
      {/* Left side - Logo/Home if not on dashboard */}
      <div className="flex items-center">
        {!isOnDashboard && (
          <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity text-white">
            <Home className="h-4 w-4" />
            <span className="text-sm font-medium">Dashboard</span>
          </Link>
        )}
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-3">
        {/* Search Button */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onOpenSearch}
          className="flex items-center gap-2 text-gray-300 hover:text-white hover:bg-gray-800 border-0 h-8 px-3"
        >
          <Search className="h-4 w-4" />
          <span className="text-sm">Search</span>
          <div className="hidden sm:flex items-center gap-1 text-xs bg-gray-700 px-1.5 py-0.5 rounded">
            <Command className="h-3 w-3" />
            <span>K</span>
          </div>
        </Button>

        {/* Live Indicator */}
        <div className="flex items-center gap-2 text-green-400 text-sm">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="hidden sm:inline">Live</span>
        </div>

        {/* Theme Toggle */}
        <div className="text-gray-300 hover:text-white">
          <ThemeToggle />
        </div>

        {/* Logout */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleLogout}
          className="text-gray-300 hover:text-white hover:bg-gray-800 border-0 h-8 px-3"
        >
          <LogOut className="h-4 w-4 mr-2" />
          <span className="text-sm">Logout</span>
        </Button>
      </div>
    </header>
  )
})

export { DashboardHeader }
