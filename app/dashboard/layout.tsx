"use client"

import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
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

  useEffect(() => {
    if (status === "loading") return // Still loading
    if (!session) {
      router.push("/")
    }
  }, [session, status, router])

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-neutral-800 w-full">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="hidden md:block">
          <DashboardHeader />
        </div>
        <main className="flex-1 overflow-auto p-2 md:p-6 bg-white dark:bg-neutral-900 m-2 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700">
          {children}
        </main>
      </div>
    </div>
  )
}
