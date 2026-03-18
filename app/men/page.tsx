import type { Metadata } from "next"
import CatalogProductGrid from "@/components/catalog-product-grid"
import SiteShell from "@/components/site-shell"
import { getStoreProducts } from "@/lib/server/storefront"
import { defaultLocale, getDictionary } from "@/lib/i18n"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sneakerportfolio.me"
const locale = defaultLocale
const t = getDictionary(locale)

export const metadata: Metadata = {
  title: t.pages.men.metadataTitle,
  description: t.pages.men.metadataDescription,
  alternates: { canonical: `${siteUrl}/men` },
  openGraph: {
    title: t.pages.men.ogTitle,
    description: t.pages.men.ogDescription,
    url: `${siteUrl}/men`,
  },
}

export default async function MenPage() {
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
