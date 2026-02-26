import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import CatalogProductGrid from "@/components/catalog-product-grid"
import { catalogProducts } from "@/lib/catalog"

export default function TrendsPage() {
  const products = catalogProducts.filter((item) => item.isTrending)

  return (
    <main>
      <Navbar />
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pt-28 pb-16 lg:pb-24">
        <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary">Hot Now</span>
        <h1 className="font-display text-4xl lg:text-6xl font-bold text-foreground mt-2 mb-4">Trends</h1>
        <p className="text-muted-foreground max-w-2xl mb-10">Most purchased sneakers right now.</p>
        <CatalogProductGrid products={products} />
      </section>
      <Footer />
    </main>
  )
}
