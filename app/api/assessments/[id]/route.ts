import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'



export async function GET(
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
    const response = await fetch(createApiEndpoint('/assessments/${id}'), {
      headers: createApiHeaders(session),
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch assessment' }, { status: response.status })
    }

    const assessment = await response.json()
    return NextResponse.json(assessment)
  } catch (error) {
    console.error('Error fetching assessment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
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
    const response = await fetch(createApiEndpoint('/assessments/${id}'), {
      method: 'PUT',
      headers: createApiHeaders(session),
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to update assessment' }, { status: response.status })
    }

    const assessment = await response.json()
    return NextResponse.json(assessment)
  } catch (error) {
    console.error('Error updating assessment:', error)
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
    const response = await fetch(createApiEndpoint('/assessments/${id}'), {
      method: 'DELETE',
      headers: createApiHeaders(session),
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to delete assessment' }, { status: response.status })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting assessment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}