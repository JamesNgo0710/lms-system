import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params for NextJS 15+ compatibility
    const { id } = await params
    console.log("Profile update API called for user:", id)

    // Get the authenticated session
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Ensure users can only update their own profile (unless admin)
    if (session.user.id !== id && session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden - can only update your own profile" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { firstName, lastName } = body

    // Validate required fields
    if (!firstName?.trim() || !lastName?.trim()) {
      return NextResponse.json(
        { error: "First name and last name are required" },
        { status: 400 }
      )
    }

    // Validate name lengths
    if (firstName.trim().length < 2 || lastName.trim().length < 2) {
      return NextResponse.json(
        { error: "First name and last name must be at least 2 characters long" },
        { status: 400 }
      )
    }

    // Validate max lengths
    if (firstName.trim().length > 50 || lastName.trim().length > 50) {
      return NextResponse.json(
        { error: "First name and last name must be 50 characters or less" },
        { status: 400 }
      )
    }

    // Update profile in Laravel backend
    const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:8000'
    const response = await fetch(`${API_URL}/api/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
      return NextResponse.json(
        { error: errorData.error || `Failed to update profile: ${response.status}` },
        { status: response.status }
      )
    }

    const updatedUser = await response.json()
    console.log("Profile updated successfully for user:", id)
    
    return NextResponse.json({ 
      success: true,
      message: "Profile updated successfully",
      user: updatedUser
    })
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 