import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../../auth/[...nextauth]/route'



export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; topicId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, topicId } = params

    // Proxy request to Laravel backend
    const response = await fetch(createApiEndpoint('/users/${id}/topics/${topicId}/progress'), {
      headers: createApiHeaders(session),
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch topic progress' }, { status: response.status })
    }

    const progress = await response.json()
    return NextResponse.json(progress)
  } catch (error) {
    console.error('Error fetching topic progress:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}