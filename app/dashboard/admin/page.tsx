"use client"

import { useSession } from "next-auth/react"
import { AdminCMSDashboard } from "@/components/admin-cms-dashboard"
import { redirect } from "next/navigation"

export default function AdminCMSPage() {
  const { data: session } = useSession()
  
  if (!session) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (session.user?.role !== "admin") {
    redirect("/dashboard")
  }

  return <AdminCMSDashboard />
}