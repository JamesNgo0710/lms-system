import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'



export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Proxy request to Laravel backend
    const response = await fetch(createApiEndpoint('/lessons'), {
      headers: createApiHeaders(session),
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch lessons' }, { status: response.status })
    }

    const lessons = await response.json()
    return NextResponse.json(lessons)
  } catch (error) {
    console.error('Error fetching lessons:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Proxy request to Laravel backend
    const response = await fetch(createApiEndpoint('/lessons'), {
      method: 'POST',
      headers: createApiHeaders(session),
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to create lesson' }, { status: response.status })
    }

    const lesson = await response.json()
    return NextResponse.json(lesson)
  } catch (error) {
    console.error('Error creating lesson:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}