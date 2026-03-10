import type { Metadata } from "next"
import CatalogProductGrid from "@/components/catalog-product-grid"
import SiteShell from "@/components/site-shell"
import { getStoreProducts } from "@/lib/server/storefront"

export const metadata: Metadata = {
  title: "Trending Sneakers — Shop New Drops | Кросівки Тренди 2026",
  description:
    "The hottest sneakers right now at Streater. Shop trending athletic shoes, running shoes & streetwear kicks with free EU shipping. — Найпопулярніші кросівки прямо зараз. Купити модні кроси онлайн.",
  alternates: {
    canonical: "https://streater.vercel.app/trends",
  },
  openGraph: {
    title: "Trending Sneakers — Streater",
    description: "Most-purchased sneakers right now. Shop the hottest drops with free EU shipping.",
    url: "https://streater.vercel.app/trends",
  },
}

export default async function TrendsPage() {
  const products = await getStoreProducts({ trending: true })

  return (
    <SiteShell
      eyebrow="Hot Now"
      title="Trends"
      description="Most purchased sneakers right now."
    >
      <CatalogProductGrid products={products} />
    </SiteShell>
  )
}
