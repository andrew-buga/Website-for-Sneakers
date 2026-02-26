import Image from "next/image"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { ArrowLeft } from "lucide-react"
import CatalogProductGrid from "@/components/catalog-product-grid"
import { getStoreProducts } from "@/lib/server/storefront"
import { collectionsMeta } from "@/lib/storefront-types"

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const key = slug as keyof typeof collectionsMeta
  const meta = collectionsMeta[key]

  if (!meta) {
    return (
      <main>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center"><p className="text-muted-foreground">Collection not found.</p></div>
        <Footer />
      </main>
    )
  }

  const products = await getStoreProducts({ collection: key })

  return (
    <main>
      <Navbar />

      <section className="relative h-[50vh] min-h-[300px] flex items-end overflow-hidden">
        <Image src={meta.banner} alt={meta.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pb-12 w-full">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <span className="block text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-2">Seasonal</span>
          <h1 className="font-display text-4xl lg:text-6xl font-bold uppercase text-foreground">{meta.title}</h1>
          <p className="text-muted-foreground mt-2 max-w-xl">{meta.description}</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24">
        <h2 className="font-display text-3xl font-bold text-foreground mb-8">Products ({products.length})</h2>
        <CatalogProductGrid products={products} />
      </section>

      <Footer />
    </main>
  )
}
