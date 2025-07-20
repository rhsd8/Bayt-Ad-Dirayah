import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const locales = ["en", "ar", "fr"]
const defaultLocale = "en"

function getLocale(request: NextRequest): string {
  // Check if there is any supported locale in the pathname
  const pathname = request.nextUrl.pathname
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  )

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    // Try to get locale from Accept-Language header
    const acceptLanguage = request.headers.get("accept-language")
    let locale = defaultLocale

    if (acceptLanguage) {
      const preferredLocale = acceptLanguage.split(",")[0].split("-")[0].toLowerCase()

      if (locales.includes(preferredLocale)) {
        locale = preferredLocale
      }
    }

    return locale
  }

  // Extract locale from pathname
  const locale = pathname.split("/")[1]
  return locales.includes(locale) ? locale : defaultLocale
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Check if the pathname is missing a locale
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  )

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request)
    const redirectUrl = new URL(`/${locale}${pathname}`, request.url)

    // Preserve search params
    redirectUrl.search = request.nextUrl.search

    return NextResponse.redirect(redirectUrl)
  }

  // Validate that the locale in the pathname is supported
  const currentLocale = pathname.split("/")[1]
  if (!locales.includes(currentLocale)) {
    const redirectUrl = new URL(pathname.replace(`/${currentLocale}`, `/${defaultLocale}`), request.url)
    redirectUrl.search = request.nextUrl.search
    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, api, etc.)
    "/((?!_next|api|favicon.ico|.*\\.).*)",
  ],
}
