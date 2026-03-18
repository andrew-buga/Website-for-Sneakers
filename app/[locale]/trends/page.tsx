import type { Metadata } from "next"
import { notFound } from "next/navigation"

import CatalogProductGrid from "@/components/catalog-product-grid"
import SiteShell from "@/components/site-shell"
import { getStoreProducts } from "@/lib/server/storefront"
import { getDictionary, isLocale } from "@/lib/i18n"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sneakerportfolio.me"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params

  if (!isLocale(locale)) {
    return {}
  }

  const t = getDictionary(locale)
  const canonical = locale === "en" ? `${siteUrl}/trends` : `${siteUrl}/${locale}/trends`

  return {
    title: t.pages.trends.metadataTitle,
    description: t.pages.trends.metadataDescription,
    alternates: { canonical },
    openGraph: {
      title: t.pages.trends.ogTitle,
      description: t.pages.trends.ogDescription,
      url: canonical,
    },
  }
}

export default async function LocalizedTrendsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  if (!isLocale(locale)) {
    notFound()
  }
  const t = getDictionary(locale)
  const products = await getStoreProducts({ trending: true })

  return (
    <SiteShell
      eyebrow={t.pages.trends.eyebrow}
      title={t.pages.trends.title}
      description={t.pages.trends.description}
      locale={locale}
    >
      <CatalogProductGrid products={products} locale={locale} />
    </SiteShell>
  )
}
