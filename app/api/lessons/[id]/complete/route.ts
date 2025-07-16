import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../auth/[...nextauth]/route'



export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const body = await request.json()

    // Proxy request to Laravel backend
    const response = await fetch(createApiEndpoint('/lessons/${id}/complete'), {
      method: 'POST',
      headers: createApiHeaders(session),
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to mark lesson complete' }, { status: response.status })
    }

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error marking lesson complete:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    // Proxy request to Laravel backend
    const response = await fetch(createApiEndpoint('/lessons/${id}/complete'), {
      method: 'DELETE',
      headers: createApiHeaders(session),
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to mark lesson incomplete' }, { status: response.status })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error marking lesson incomplete:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}