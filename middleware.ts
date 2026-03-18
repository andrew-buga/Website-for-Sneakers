import { NextRequest, NextResponse } from "next/server"

const LOCALES = ["en", "uk", "ru"] as const
const DEFAULT_LOCALE = "en"
const NON_LOCALIZED_PREFIXES = new Set(["account", "admin", "checkout"])

function isPublicPath(pathname: string) {
  if (pathname.startsWith("/_next") || pathname.startsWith("/api")) return true
  if (pathname === "/favicon.ico" || pathname === "/robots.txt" || pathname === "/sitemap.xml" || pathname === "/site.webmanifest") return true
  return /\.[^/]+$/.test(pathname)
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (isPublicPath(pathname)) {
    return NextResponse.next()
  }

  const segments = pathname.split("/").filter(Boolean)
  const first = segments[0]

  if (first && LOCALES.includes(first as (typeof LOCALES)[number])) {
    if (first === DEFAULT_LOCALE) {
      const redirectUrl = request.nextUrl.clone()
      const stripped = `/${segments.slice(1).join("/")}`
      redirectUrl.pathname = stripped === "/" ? "/" : stripped
      return NextResponse.redirect(redirectUrl, 308)
    }

    const maybeNonLocalizedSection = segments[1]

    if (maybeNonLocalizedSection && NON_LOCALIZED_PREFIXES.has(maybeNonLocalizedSection)) {
      const rewriteUrl = request.nextUrl.clone()
      rewriteUrl.pathname = `/${segments.slice(1).join("/")}`
      return NextResponse.rewrite(rewriteUrl)
    }

    return NextResponse.next()
  }

  if (first && NON_LOCALIZED_PREFIXES.has(first)) {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|site.webmanifest).*)"],
}
