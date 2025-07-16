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
    const response = await fetch(createApiEndpoint('/assessments'), {
      headers: createApiHeaders(session),
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch assessments' }, { status: response.status })
    }

    const assessments = await response.json()
    return NextResponse.json(assessments)
  } catch (error) {
    console.error('Error fetching assessments:', error)
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
    const response = await fetch(createApiEndpoint('/assessments'), {
      method: 'POST',
      headers: createApiHeaders(session),
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to create assessment' }, { status: response.status })
    }

    const assessment = await response.json()
    return NextResponse.json(assessment)
  } catch (error) {
    console.error('Error creating assessment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}