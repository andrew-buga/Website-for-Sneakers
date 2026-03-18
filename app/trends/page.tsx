import type { Metadata } from "next"
import CatalogProductGrid from "@/components/catalog-product-grid"
import SiteShell from "@/components/site-shell"
import { getStoreProducts } from "@/lib/server/storefront"
import { defaultLocale, getDictionary } from "@/lib/i18n"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sneakerportfolio.me"
const locale = defaultLocale
const t = getDictionary(locale)

export const metadata: Metadata = {
  title: t.pages.trends.metadataTitle,
  description: t.pages.trends.metadataDescription,
  alternates: {
    canonical: `${siteUrl}/trends`,
  },
  openGraph: {
    title: t.pages.trends.ogTitle,
    description: t.pages.trends.ogDescription,
    url: `${siteUrl}/trends`,
  },
}

export default async function TrendsPage() {
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
