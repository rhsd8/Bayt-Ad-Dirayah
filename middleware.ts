import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const locales = ["en", "ar", "fr"]
const defaultLocale = "en"

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Skip internal Next.js paths and static files
  if (pathname.startsWith('/_next') || 
      pathname.startsWith('/api') || 
      pathname === '/favicon.ico' ||
      pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|ico|css|js)$/i)) {
    return NextResponse.next()
  }

  // Check if pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) {
    return NextResponse.next()
  }

  // Redirect to default locale
  return NextResponse.redirect(new URL(`/${defaultLocale}${pathname}`, request.url))
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}