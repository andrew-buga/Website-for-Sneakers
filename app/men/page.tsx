import type { Metadata } from "next"
import CatalogProductGrid from "@/components/catalog-product-grid"
import SiteShell from "@/components/site-shell"
import { getStoreProducts } from "@/lib/server/storefront"

export const metadata: Metadata = {
  title: "Men's Sneakers — Athletic & Streetwear Shoes | Кросівки для Чоловіків",
  description:
    "Shop men's sneakers at Streater. Performance running shoes, streetwear kicks, and lifestyle footwear. Free EU shipping. — Чоловічі кросівки онлайн: купити кроси для чоловіків у Streater.",
  alternates: { canonical: "https://streater.vercel.app/men" },
  openGraph: {
    title: "Men's Sneakers — Streater",
    description: "Performance and lifestyle sneakers for men. Shop new drops with free EU shipping.",
    url: "https://streater.vercel.app/men",
  },
}

export default async function MenPage() {
  const products = await getStoreProducts({ category: "men" })

  return (
    <SiteShell
      eyebrow="Shop"
      title="Men"
      description="Performance and lifestyle sneakers curated for men."
    >
      <CatalogProductGrid products={products} />
    </SiteShell>
  )
}
