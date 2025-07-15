import { redirect } from 'next/navigation'

// Handle API requests to old topic URLs
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug
  
  // Map old slugs to new topic IDs
  const topicMap: Record<string, string> = {
    'blockchain': '2',
    'cryptocurrency': '3', 
    'metamask': '4',
    'defi': '5',
    'nft': '6',
  }
  
  const topicId = topicMap[slug]
  
  if (topicId) {
    // Redirect to the correct dashboard URL
    redirect(`/dashboard/topics/${topicId}`)
  }
  
  // For unknown slugs, redirect to topics list
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