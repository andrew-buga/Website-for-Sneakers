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
  const canonical = locale === "en" ? `${siteUrl}/women` : `${siteUrl}/${locale}/women`

  return {
    title: t.pages.women.metadataTitle,
    description: t.pages.women.metadataDescription,
    alternates: { canonical },
    openGraph: {
      title: t.pages.women.ogTitle,
      description: t.pages.women.ogDescription,
      url: canonical,
    },
  }
}

export default async function LocalizedWomenPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  if (!isLocale(locale)) {
    notFound()
  }
  const t = getDictionary(locale)
  const products = await getStoreProducts({ category: "women" })

  return (
    <SiteShell
      eyebrow={t.pages.women.eyebrow}
      title={t.pages.women.title}
      description={t.pages.women.description}
      locale={locale}
    >
      <CatalogProductGrid products={products} locale={locale} />
    </SiteShell>
  )
}
