import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import CatalogProductGrid from "@/components/catalog-product-grid"
import { getStoreProducts } from "@/lib/server/storefront"
import { collectionsMeta } from "@/lib/storefront-types"

export default async function CollectionsPage() {
  const products = await getStoreProducts()

  return (
    <main>
      <Navbar />
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pt-28 pb-8">
        <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary">Seasonal</span>
        <h1 className="font-display text-4xl lg:text-6xl font-bold text-foreground mt-2 mb-4">Collections</h1>
        <p className="text-muted-foreground max-w-2xl">Browse seasonal drops and explore all available products.</p>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {Object.entries(collectionsMeta).map(([slug, meta]) => (
            <Link key={slug} href={`/collection/${slug}`} className="group relative aspect-[4/5] rounded-2xl overflow-hidden">
              <Image src={meta.banner} alt={meta.title} fill className="rounded-2xl object-cover group-hover:scale-95 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between">
                <h3 className="font-display text-xl font-bold uppercase text-foreground">{meta.title}</h3>
                <span className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-8 lg:pb-24">
        <h2 className="font-display text-3xl font-bold text-foreground mb-8">All Products</h2>
        <CatalogProductGrid products={products} />
      </section>
      <Footer />
    </main>
  )
}
