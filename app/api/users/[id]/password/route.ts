import { NextRequest, NextResponse } from "next/server"
import { serverDataStore } from "@/lib/server-data-store"

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log("Password change API called for user:", params.id)
    
    const body = await request.json()
    console.log("Request body received:", { hasNewPassword: !!body.newPassword })
    const { newPassword } = body

    if (!newPassword || newPassword.length < 6) {
      console.log("Password validation failed:", { 
        hasPassword: !!newPassword, 
        length: newPassword?.length 
      })
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      )
    }

    console.log("Attempting to change password for user:", params.id)
    const success = serverDataStore.changeUserPassword(params.id, newPassword)
    console.log("Password change result:", success)

    if (!success) {
      console.log("User not found:", params.id)
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    console.log("Password changed successfully for user:", params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error changing password:", error)
    console.error("Error stack:", error instanceof Error ? error.stack : 'No stack trace')
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
} 