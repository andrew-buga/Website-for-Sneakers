import CatalogProductGrid from "@/components/catalog-product-grid"
import SiteShell from "@/components/site-shell"
import { getStoreProducts } from "@/lib/server/storefront"

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
