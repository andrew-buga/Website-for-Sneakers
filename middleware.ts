import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const locales = ['en', 'uk', 'ru']
const defaultLocale = 'en'

// Routes that should be redirected to /en/ variant
const redirectRoutes = [
  'men',
  'women',
  'collections',
  'collection',
  'trends',
  'product',
  'cart',
  'favorites',
  'account',
  'checkout',
  'contact',
  'help-center',
  'help',
  'privacy-policy',
  'terms-conditions',
  'terms-of-use',
  'accessories',
  'store-locator',
  'receivers-amplifiers',
  'returns',
  'admin',
]

export function middleware(request: NextRequest) {
  // Parse pathname
  const pathname = request.nextUrl.pathname

  // Skip API routes, public assets, etc.
  if (pathname.startsWith('/api') || pathname.startsWith('/_next') || pathname.startsWith('/images')) {
    return NextResponse.next()
  }

  // Check if path already has a locale prefix
  const pathnameHasLocale = locales.some((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`)

  if (pathnameHasLocale) {
    // Already localized, pass through
    return NextResponse.next()
  }

  // Check if pathname matches any route that should be redirected
  const parts = pathname.split('/').filter(Boolean)
  const firstSegment = parts[0]

  // Root path or should redirect
  if (pathname === '/' || redirectRoutes.includes(firstSegment)) {
    // Redirect to default locale variant
    const redirectPath = `/${defaultLocale}${pathname}`
    return NextResponse.redirect(new URL(redirectPath, request.url), 307) // 307: temporary redirect
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Apply to everything except:
    '/((?!_next|api|images|favicon|.*\\..*|public).*)',
  ],
}
