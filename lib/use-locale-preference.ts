import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { getPathLocale, getLocalePreference, stripLocale, withLocaleHref, Locale } from './i18n'

/**
 * Hook that ensures user is on their preferred locale
 * If user has a saved locale preference but current page is in a different locale,
 * this will redirect them to the preferred locale
 */
export function useLocalePreference() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const currentLocale = getPathLocale(pathname)
    const savedPreference = getLocalePreference()

    // If user has a saved preference and it differs from current locale, redirect
    if (savedPreference && currentLocale && savedPreference !== currentLocale) {
      const strippedPath = stripLocale(pathname)
      const preferredPath = withLocaleHref(savedPreference, strippedPath)
      router.push(preferredPath)
    }
  }, [pathname, router])
}
