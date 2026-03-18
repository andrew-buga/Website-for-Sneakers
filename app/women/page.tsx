import type { Metadata } from "next"
import CatalogProductGrid from "@/components/catalog-product-grid"
import SiteShell from "@/components/site-shell"
import { getStoreProducts } from "@/lib/server/storefront"
import { defaultLocale, getDictionary } from "@/lib/i18n"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sneakerportfolio.me"
const locale = defaultLocale
const t = getDictionary(locale)

export const metadata: Metadata = {
  title: t.pages.women.metadataTitle,
  description: t.pages.women.metadataDescription,
  alternates: { canonical: `${siteUrl}/women` },
  openGraph: {
    title: t.pages.women.ogTitle,
    description: t.pages.women.ogDescription,
    url: `${siteUrl}/women`,
  },
}

export default async function WomenPage() {
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
