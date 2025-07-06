import { NextRequest, NextResponse } from "next/server"
import { serverDataStore } from "@/lib/server-data-store"

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log("Profile image update API called for user:", params.id)

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

    console.log("Attempting to update profile image for user:", params.id)
    const success = serverDataStore.updateUserProfileImage(params.id, imageData)
    console.log("Profile image update result:", success)

    if (!success) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    console.log("Profile image updated successfully for user:", params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating profile image:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 