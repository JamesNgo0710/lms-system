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
    const response = await fetch(createApiEndpoint('/assessments/${id}/submit'), {
      method: 'POST',
      headers: createApiHeaders(session),
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to submit assessment' }, { status: response.status })
    }

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error submitting assessment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}