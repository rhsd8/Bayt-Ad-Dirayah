import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const locales = ["en", "ar", "fr"]
const defaultLocale = "en"

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const proto = request.headers.get('x-forwarded-proto')
  const host = request.headers.get('host') || ''

  // Skip internal Next.js paths and static files
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname === '/favicon.ico' || pathname === '/robots.txt' || pathname === '/sitemap.xml') {
    return NextResponse.next()
  }

  // Enforce HTTPS (fallback for platforms that don't auto-redirect)
  if (proto && proto !== 'https') {
    const url = new URL(request.url)
    url.protocol = 'https:'
    return NextResponse.redirect(url.toString(), 301)
  }

  // Enforce canonical host (redirect www to apex)
  if (host.toLowerCase() === 'www.harfproject.com') {
    const url = new URL(request.url)
    url.hostname = 'harfproject.com'
    url.protocol = 'https:'
    return NextResponse.redirect(url.toString(), 301)
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
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
}