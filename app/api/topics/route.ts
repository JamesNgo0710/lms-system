import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { createApiEndpoint, createApiHeaders } from '@/lib/api-url-utils'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Proxy request to Laravel backend
    const response = await fetch(createApiEndpoint('/topics'), {
      headers: createApiHeaders(session),
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch topics' }, { status: response.status })
    }

    const topics = await response.json()
    return NextResponse.json(topics)
  } catch (error) {
    console.error('Error fetching topics:', error)
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
    const response = await fetch(createApiEndpoint('/topics'), {
      method: 'POST',
      headers: createApiHeaders(session),
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to create topic' }, { status: response.status })
    }

    const topic = await response.json()
    return NextResponse.json(topic)
  } catch (error) {
    console.error('Error creating topic:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}