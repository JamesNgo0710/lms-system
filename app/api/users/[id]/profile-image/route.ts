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
    console.log("Profile image update API called for user:", id)

    // Get the authenticated session
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Ensure users can only update their own profile image (unless admin)
    if (session.user.id !== id && session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden - can only update your own profile image" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { imageData } = body

    if (!imageData) {
      return NextResponse.json(
        { error: "Image data is required" },
        { status: 400 }
      )
    }

    // Validate that it's a valid base64 image
    if (!imageData.startsWith("data:image/")) {
      return NextResponse.json(
        { error: "Invalid image format. Please provide a base64 encoded image." },
        { status: 400 }
      )
    }

    // Check file size (limit to 2MB)
    const base64Data = imageData.split(",")[1]
    const sizeInBytes = (base64Data.length * 3) / 4
    if (sizeInBytes > 2 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image size must be less than 2MB" },
        { status: 400 }
      )
    }

    // Update profile image in Laravel backend
    const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:8000'
    const response = await fetch(`${API_URL}/api/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({
        profile_image: imageData,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
      return NextResponse.json(
        { error: errorData.error || `Failed to update profile image: ${response.status}` },
        { status: response.status }
      )
    }

    console.log("Profile image updated successfully for user:", id)
    
    return NextResponse.json({ 
      success: true,
      message: "Profile image updated successfully" 
    })
  } catch (error) {
    console.error("Error updating profile image:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 