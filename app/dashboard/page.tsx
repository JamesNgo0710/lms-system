"use client"

import { useSession } from "next-auth/react"
import { AdminDashboard } from "@/components/admin-dashboard"
import { StudentDashboard } from "@/components/student-dashboard"

export default function Dashboard() {
  const { data: session } = useSession()
  const user = session?.user

  if (!session) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {user?.role === "admin" ? <AdminDashboard /> : <StudentDashboard />}
    </div>
  )
}
