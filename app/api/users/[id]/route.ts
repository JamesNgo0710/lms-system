import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

const LARAVEL_BASE_URL = process.env.LARAVEL_BASE_URL || 'http://localhost:8000'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    // Users can only view their own profile unless they're admin
    if (session.user.id !== id && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const response = await fetch(`${LARAVEL_BASE_URL}/api/users/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.user.laravelToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Laravel API error:', errorText)
      return NextResponse.json({ error: 'Failed to fetch user' }, { status: response.status })
    }

    const user = await response.json()
    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    // Users can only update their own profile unless they're admin
    if (session.user.id !== id && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { firstName, lastName, email, role } = body

    // Validate required fields
    if (!firstName || !lastName || !email) {
      return NextResponse.json({ 
        error: 'firstName, lastName, and email are required' 
      }, { status: 400 })
    }

    // Validate role if provided
    if (role && !['admin', 'student', 'creator'].includes(role)) {
      return NextResponse.json({ 
        error: 'Invalid role. Must be admin, student, or creator' 
      }, { status: 400 })
    }

    // Update user via Laravel API
    const updateData: any = {
      first_name: firstName,
      last_name: lastName,
      email: email,
    }

    // Only admins can update roles
    if (role && session.user.role === 'admin') {
      updateData.role = role === 'creator' ? 'teacher' : role
    }

    const response = await fetch(`${LARAVEL_BASE_URL}/api/users/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${session.user.laravelToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(updateData),
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

      return NextResponse.json({ error: 'Failed to update user' }, { status: response.status })
    }

    const updatedUser = await response.json()
    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only admins can delete users
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = params

    // Prevent admin from deleting themselves
    if (session.user.id === id) {
      return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 })
    }

    const response = await fetch(`${LARAVEL_BASE_URL}/api/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${session.user.laravelToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Laravel API error:', errorText)
      return NextResponse.json({ error: 'Failed to delete user' }, { status: response.status })
    }

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}