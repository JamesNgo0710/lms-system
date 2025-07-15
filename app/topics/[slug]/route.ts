import { redirect } from 'next/navigation'

// Handle API requests to old topic URLs - redirect all to empty topics dashboard
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  // All topics have been removed, redirect to topics list
  redirect('/dashboard/topics')
}

// Handle other HTTP methods
export async function POST() {
  redirect('/dashboard/topics')
}

export async function PUT() {
  redirect('/dashboard/topics')
}

export async function DELETE() {
  redirect('/dashboard/topics')
}