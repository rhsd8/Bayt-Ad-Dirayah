import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Check if pathname already has a locale
  if (pathname.startsWith('/en/') || pathname.startsWith('/ar/') || pathname.startsWith('/fr/') || 
      pathname === '/en' || pathname === '/ar' || pathname === '/fr') {
    return NextResponse.next()
  }
  
  // Skip internal Next.js paths
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname === '/favicon.ico') {
    return NextResponse.next()
  }
  
  // Default to English locale
  const locale = 'en'
  return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url))
}

export const config = {
  matcher: [
    '/((?!_next|api|favicon.ico).*)',
  ],
}