import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow access to the main landing page (root path)
  if (pathname === '/') {
    return NextResponse.next()
  }

  // Public routes that don't require authentication
  const publicRoutes = ['/auth/signin', '/auth/error', '/api/auth', '/test', '/surveys', '/reports', '/workshops', '/api/export', '/admin/timeline', '/api/surveys']
  
  // Check if the current path is public
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Allow dashboard access if user info is in query params (simple auth)
  if (pathname === '/dashboard') {
    const user = request.nextUrl.searchParams.get('user')
    const role = request.nextUrl.searchParams.get('role')
    const orgId = request.nextUrl.searchParams.get('orgId')
    
    if (user && role && orgId) {
      return NextResponse.next()
    }
  }

  // API routes for surveys (allow anonymous for public surveys)
  if (pathname.startsWith('/api/surveys/') && pathname.includes('/respond')) {
    return NextResponse.next()
  }

  // If not authenticated, redirect to signin
  const signInUrl = new URL('/auth/signin', request.url)
  signInUrl.searchParams.set('callbackUrl', request.url)
  return NextResponse.redirect(signInUrl)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}