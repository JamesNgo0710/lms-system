import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

const LARAVEL_BASE_URL = process.env.LARAVEL_BASE_URL || 'http://localhost:8000'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params for NextJS 15+ compatibility
    const { id } = await params
    console.log("Password change API called for user:", id)

    // Get the authenticated session
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Ensure users can only change their own password (unless admin)
    if (session.user.id !== id && session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden - can only change your own password" },
        { status: 403 }
      )
    }
    
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

    console.log("Password change validated for user:", id)
    
    // Update password via Laravel API
    const response = await fetch(`${LARAVEL_BASE_URL}/api/users/${id}/password`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${session.user.laravelToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        password: newPassword,
        password_confirmation: newPassword,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Laravel API error:', errorData)
      
      // Handle validation errors
      if (response.status === 422) {
        return NextResponse.json({ 
          error: 'Validation failed', 
          details: errorData.errors 
        }, { status: 422 })
      }

      return NextResponse.json({ error: 'Failed to change password' }, { status: response.status })
    }

    const result = await response.json()
    console.log("Password change successful for user:", id)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error changing password:", error)
    console.error("Error stack:", error instanceof Error ? error.stack : 'No stack trace')
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
} 