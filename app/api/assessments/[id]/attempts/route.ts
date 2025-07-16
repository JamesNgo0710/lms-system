import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../auth/[...nextauth]/route'



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
    const response = await fetch(createApiEndpoint('/assessments/${id}/attempts'), {
      headers: createApiHeaders(session),
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch assessment attempts' }, { status: response.status })
    }

    const attempts = await response.json()
    return NextResponse.json(attempts)
  } catch (error) {
    console.error('Error fetching assessment attempts:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}