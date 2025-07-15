import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl
  
  // Handle RSC requests for old topic URLs - redirect all to empty topics dashboard
  if (pathname.startsWith('/topics/')) {
    const dashboardUrl = new URL('/dashboard/topics', request.url)
    if (searchParams.has('_rsc')) {
      dashboardUrl.searchParams.set('_rsc', searchParams.get('_rsc')!)
    }
    return NextResponse.redirect(dashboardUrl, { status: 301 })
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/topics/:path*'
  ]
}