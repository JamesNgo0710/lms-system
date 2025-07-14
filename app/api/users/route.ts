import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

const LARAVEL_BASE_URL = process.env.LARAVEL_BASE_URL || 'http://localhost:8000'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only admins can list all users
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const response = await fetch(`${LARAVEL_BASE_URL}/api/users`, {
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
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: response.status })
    }

    const users = await response.json()
    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only admins can create users
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { firstName, lastName, email, password, role } = body

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !role) {
      return NextResponse.json({ 
        error: 'All fields are required: firstName, lastName, email, password, role' 
      }, { status: 400 })
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json({ 
        error: 'Password must be at least 6 characters long' 
      }, { status: 400 })
    }

    // Validate role
    if (!['admin', 'student', 'creator'].includes(role)) {
      return NextResponse.json({ 
        error: 'Invalid role. Must be admin, student, or creator' 
      }, { status: 400 })
    }

    // Create user via Laravel API
    const response = await fetch(`${LARAVEL_BASE_URL}/api/users`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.user.laravelToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password,
        role: role === 'creator' ? 'teacher' : role, // Map creator to teacher for Laravel
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

      return NextResponse.json({ error: 'Failed to create user' }, { status: response.status })
    }

    const newUser = await response.json()
    return NextResponse.json(newUser, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}