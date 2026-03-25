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
  const canonical = locale === "en" ? `${siteUrl}/men` : `${siteUrl}/${locale}/men`

  return {
    title: t.pages.men.metadataTitle,
    description: t.pages.men.metadataDescription,
    alternates: { canonical },
    openGraph: {
      title: t.pages.men.ogTitle,
      description: t.pages.men.ogDescription,
      url: canonical,
    },
  }
}

export default async function LocalizedMenPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  if (!isLocale(locale)) {
    notFound()
  }
  const t = getDictionary(locale)
  const products = await getStoreProducts({ category: "men" })

  return (
    <SiteShell
      eyebrow={t.pages.men.eyebrow}
      title={t.pages.men.title}
      description={t.pages.men.description}
      locale={locale}
    >
      <CatalogProductGrid products={products} locale={locale} />
    </SiteShell>
  )
}
