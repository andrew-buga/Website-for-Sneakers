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

/**
 * Security headers to prevent common attacks
 */
function addSecurityHeaders(response: NextResponse): NextResponse {
  // Prevent clickjacking attacks
  response.headers.set('X-Frame-Options', 'DENY')
  
  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff')
  
  // Enable XSS protection in older browsers
  response.headers.set('X-XSS-Protection', '1; mode=block')
  
  // Referrer policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // Require HTTPS
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  
  // Control permissions
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')
  
  return response
}

export function middleware(request: NextRequest) {
  // Parse pathname
  const pathname = request.nextUrl.pathname

  // Skip API routes, public assets, etc.
  if (pathname.startsWith('/api') || pathname.startsWith('/_next') || pathname.startsWith('/images')) {
    const response = NextResponse.next()
    return addSecurityHeaders(response)
  }

  // Check if path already has a locale prefix
  const pathnameHasLocale = locales.some((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`)

  if (pathnameHasLocale) {
    // Already localized, pass through
    const response = NextResponse.next()
    return addSecurityHeaders(response)
  }

  // Check if pathname matches any route that should be redirected
  const parts = pathname.split('/').filter(Boolean)
  const firstSegment = parts[0]

  // Root path or should redirect
  if (pathname === '/' || redirectRoutes.includes(firstSegment)) {
    // Redirect to default locale variant, preserving query parameters
    const redirectPath = `/${defaultLocale}${pathname}`
    const redirectUrl = new URL(redirectPath, request.url)
    // Preserve all query parameters from original request
    redirectUrl.search = request.nextUrl.search
    const response = NextResponse.redirect(redirectUrl, 307) // 307: temporary redirect
    return addSecurityHeaders(response)
  }

  const response = NextResponse.next()
  return addSecurityHeaders(response)
}

export const config = {
  matcher: [
    // Apply to everything except:
    '/((?!_next|api|images|favicon|.*\\..*|public).*)',
  ],
}
