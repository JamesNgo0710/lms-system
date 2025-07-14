"use client"

import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Footer } from "@/components/ui/footer"
import { CommandPalette } from "@/components/command-palette"
import { LoadingScreen } from "@/components/loading-screen"
import { ErrorBoundaryEnhanced, NetworkStatusIndicator } from "@/components/error-boundary-enhanced"
import { useCommandPalette } from "@/hooks/use-command-palette"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { isOpen, openCommandPalette, closeCommandPalette } = useCommandPalette()

  useEffect(() => {
    if (status === "loading") return // Still loading
    if (!session) {
      router.push("/")
    }
  }, [session, status, router])

  if (status === "loading") {
    return <LoadingScreen variant="dashboard" />
  }

  if (!session) {
    return null // Will redirect in useEffect
  }

  return (
    <ErrorBoundaryEnhanced>
      <NetworkStatusIndicator />
      <div className="relative min-h-screen bg-gray-100 dark:bg-neutral-800 w-full flex flex-col">
        <DashboardSidebar />
        <div className="flex flex-col flex-1 md:pl-[60px]">
          <div className="hidden md:block">
            <DashboardHeader onOpenSearch={openCommandPalette} />
          </div>
          <main className="flex-1 p-2 md:p-6 bg-white dark:bg-neutral-900 m-2 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700">
            <ErrorBoundaryEnhanced>
              {children}
            </ErrorBoundaryEnhanced>
          </main>
          <div className="md:ml-2">
            <Footer />
          </div>
        </div>
        <CommandPalette isOpen={isOpen} onClose={closeCommandPalette} />
      </div>
    </ErrorBoundaryEnhanced>
  )
}
