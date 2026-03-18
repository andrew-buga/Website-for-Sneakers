import type { Metadata } from "next"
import { notFound } from "next/navigation"

import CatalogProductGrid from "@/components/catalog-product-grid"
import SiteShell from "@/components/site-shell"
import { getStoreProducts } from "@/lib/server/storefront"
import { getDictionary, isLocale } from "@/lib/i18n"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sneakerportfolio.me"

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  if (!isLocale(params.locale)) {
    return {}
  }

  const t = getDictionary(params.locale)
  const canonical = params.locale === "en" ? `${siteUrl}/men` : `${siteUrl}/${params.locale}/men`

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

export default async function LocalizedMenPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) {
    notFound()
  }

  const locale = params.locale
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
