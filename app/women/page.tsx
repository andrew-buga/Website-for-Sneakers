import CatalogProductGrid from "@/components/catalog-product-grid"
import SiteShell from "@/components/site-shell"
import { getStoreProducts } from "@/lib/server/storefront"

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
