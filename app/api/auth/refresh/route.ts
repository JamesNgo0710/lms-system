import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import axios from "axios"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch updated user data from Laravel backend
    const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:8000'
    const response = await axios.get(`${API_URL}/api/users/${session.user.id}`, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Accept': 'application/json',
      },
    })

    const updatedUser = response.data

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id.toString(),
        email: updatedUser.email,
        name: updatedUser.name,
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name,
        role: updatedUser.role,
        image: updatedUser.profile_image,
        bio: updatedUser.bio,
        phone: updatedUser.phone,
        location: updatedUser.location,
        skills: updatedUser.skills,
        interests: updatedUser.interests,
        joinedDate: updatedUser.joined_date,
      }
    })
  } catch (error) {
    console.error("Error refreshing user data:", error)
    return NextResponse.json(
      { error: "Failed to refresh user data" },
      { status: 500 }
    )
  }
} 