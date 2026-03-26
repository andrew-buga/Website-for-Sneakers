/**
 * Generate canonical URL for a page
 * Ensures every page has a locale-specific canonical URL
 * Prevents Google from treating localized pages as duplicates
 */

export function getCanonicalUrl(
  locale: string | undefined,
  pathname: string = "/"
): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sneakerportfolio.me"

  // Ensure locale is provided
  if (!locale) {
    return `${baseUrl}${pathname}`
  }

  // Homepage
  if (pathname === "/" || pathname === "") {
    return `${baseUrl}/${locale}`
  }

  // All other pages: include locale + pathname
  return `${baseUrl}/${locale}${pathname}`
}

/**
 * Validate canonical URL (for testing)
 */
export function validateCanonicalUrl(url: string): boolean {
  try {
    const urlObj = new URL(url)
    // Must be HTTPS
    if (urlObj.protocol !== "https:") return false
    // Must have locale in path
    const parts = urlObj.pathname.split("/").filter(Boolean)
    if (!parts.length) return false
    // First part should be locale (en, uk, ru)
    const validLocales = ["en", "uk", "ru"]
    return validLocales.includes(parts[0])
  } catch {
    return false
  }
}
