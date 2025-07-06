"use client"

import { useSession, signOut } from "next-auth/react"
import { useCallback, memo } from "react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { LogOut } from "lucide-react"

const DashboardHeader = memo(function DashboardHeader() {
  const { data: session } = useSession()
  const user = session?.user

  const handleLogout = useCallback(() => {
    signOut({ callbackUrl: "/" })
  }, [])

  return (
    <header className="flex h-16 items-center justify-between border-b px-6">
      <div>
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome back, {user?.firstName ? `${user.firstName} ${user.lastName}` : user?.name || "User"}
        </p>
      </div>
      <div className="flex items-center gap-2">
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
