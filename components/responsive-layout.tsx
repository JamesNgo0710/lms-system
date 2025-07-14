"use client"

import { useEffect, useState } from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { MobileNavigation } from "@/components/mobile-navigation"
import { cn } from "@/lib/utils"

interface ResponsiveLayoutProps {
  children: React.ReactNode
  className?: string
}

export function ResponsiveLayout({ children, className }: ResponsiveLayoutProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Navigation */}
      <div className="md:hidden">
        <MobileNavigation />
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <DashboardSidebar />
      </div>

      {/* Main Content */}
      <div className={cn(
        "transition-all duration-300",
        isMobile 
          ? "pt-16 pb-16" // Space for mobile top/bottom nav
          : "md:ml-64", // Space for desktop sidebar
        className
      )}>
        <div className="p-4 md:p-6">
          {children}
        </div>
      </div>
    </div>
  )
}