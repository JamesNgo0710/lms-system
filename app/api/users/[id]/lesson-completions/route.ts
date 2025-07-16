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
    const response = await fetch(createApiEndpoint('/users/${id}/lesson-completions'), {
      headers: createApiHeaders(session),
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch lesson completions' }, { status: response.status })
    }

    const completions = await response.json()
    return NextResponse.json(completions)
  } catch (error) {
    console.error('Error fetching lesson completions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}