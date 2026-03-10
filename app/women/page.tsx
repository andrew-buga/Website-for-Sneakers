import type { Metadata } from "next"
import CatalogProductGrid from "@/components/catalog-product-grid"
import SiteShell from "@/components/site-shell"
import { getStoreProducts } from "@/lib/server/storefront"

export const metadata: Metadata = {
  title: "Women's Sneakers — Athletic & Lifestyle Shoes | Кросівки для Жінок",
  description:
    "Shop women's sneakers at Streater. Comfort-first silhouettes, new-season looks, and streetwear styles. Free EU shipping. — Жіночі кросівки онлайн: купити крости для жінок у Streater.",
  alternates: { canonical: "https://streater.vercel.app/women" },
  openGraph: {
    title: "Women's Sneakers — Streater",
    description: "Comfort-first women's sneakers and new-season styles. Free EU shipping.",
    url: "https://streater.vercel.app/women",
  },
}

export default async function WomenPage() {
  const products = await getStoreProducts({ category: "women" })

  return (
    <SiteShell
      eyebrow="Shop"
      title="Women"
      description="Comfort-first silhouettes and new-season looks for women."
    >
      <CatalogProductGrid products={products} />
    </SiteShell>
  )
}
