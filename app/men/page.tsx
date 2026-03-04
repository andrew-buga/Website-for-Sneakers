import CatalogProductGrid from "@/components/catalog-product-grid"
import SiteShell from "@/components/site-shell"
import { getStoreProducts } from "@/lib/server/storefront"

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
