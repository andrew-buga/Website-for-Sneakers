import type { ReactNode } from "react"
import type { Metadata } from "next"

import { locales } from "@/lib/i18n"
import { getCanonicalUrl } from "@/lib/get-canonical-url"
import { LocaleLayoutClient } from "./layout-client"

export const dynamicParams = true

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const { locale } = await params

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sneakerportfolio.me"
  const canonicalUrl = getCanonicalUrl(locale, "/")

  return {
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "en": `${siteUrl}/en`,
        "uk": `${siteUrl}/uk`,
        "ru": `${siteUrl}/ru`,
        "x-default": `${siteUrl}/en`,
      },
    },
    verification: {
      other: {
        "tiktok-developers-site-verification": "b8axbizBv8DSSLZOMQ4qeQGNKzNrC6fH",
      },
    },
  }
}

export default function LocaleLayout({ children }: { children: ReactNode }) {
  return (
    <LocaleLayoutClient>
      {children}
    </LocaleLayoutClient>
  )
}