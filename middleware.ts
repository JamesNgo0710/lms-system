import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl
  
  // Handle RSC requests for old topic URLs
  if (pathname.startsWith('/topics/')) {
    const topicMap: Record<string, string> = {
      '/topics/blockchain': '/dashboard/topics/2',
      '/topics/cryptocurrency': '/dashboard/topics/3', 
      '/topics/metamask': '/dashboard/topics/4',
      '/topics/defi': '/dashboard/topics/5',
      '/topics/nft': '/dashboard/topics/6',
    }
    
    const newPath = topicMap[pathname]
    if (newPath) {
      const newUrl = new URL(newPath, request.url)
      
      // Preserve RSC parameters if they exist
      if (searchParams.has('_rsc')) {
        newUrl.searchParams.set('_rsc', searchParams.get('_rsc')!)
      }
      
      // Preserve any other query parameters
      searchParams.forEach((value, key) => {
        if (key !== '_rsc') {
          newUrl.searchParams.set(key, value)
        }
      })
      
      return NextResponse.redirect(newUrl, { status: 301 })
    }
    
    // For any other /topics/* URLs, redirect to dashboard
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