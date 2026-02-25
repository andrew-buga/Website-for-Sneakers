import Image from "next/image"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { ArrowLeft } from "lucide-react"
import { Suspense } from "react"

const allProducts = [
  { id: 1, image: "/images/product-1.jpg", name: "Nike Air Max Plus III", colorShown: "Black/Black/Wolf Grey", style: "CJ9684-002", price: "$180", collection: "summer", sizes: ["6", "7", "8", "9"], colors: ["Black", "White"] },
  { id: 2, image: "/images/product-2.jpg", name: "Nike Air Max Plus III", colorShown: "White/University Red", style: "CJ9684-100", price: "$180", collection: "summer", sizes: ["7", "8", "9", "10"], colors: ["White", "Navy"] },
  { id: 3, image: "/images/product-3.jpg", name: "Nike Air Max Plus III", colorShown: "Midnight Navy/White", style: "CJ9684-400", price: "$180", collection: "summer", sizes: ["8", "9", "10", "11"], colors: ["Navy"] },
]

const collectionMeta = {
  summer: { title: "Summer Collection", description: "Light, breathable, and built for the heat. Discover our best summer kicks.", banner: "/images/summer-collection.jpg" },
  winter: { title: "Winter Collection", description: "Warm, sturdy, and ready for the cold. Built to handle everything winter throws at you.", banner: "/images/winter-collection.jpg" },
  autumn: { title: "Autumn Collection", description: "Rich tones and durable builds for the season of change.", banner: "/images/autumn-collection.jpg" },
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const meta = collectionMeta[slug as keyof typeof collectionMeta]
  const products = allProducts.filter((p) => p.collection === slug)

  if (!meta) {
    return (
      <main>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center"><p className="text-muted-foreground">Collection not found.</p></div>
        <Footer />
      </main>
    )
  }

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
        
        {products.length === 0 ? (
          <p className="text-muted-foreground text-center py-20">No products in this collection yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {products.map((product) => (
              <Link key={product.id} href={`/product/${product.id}`} className="group relative rounded-2xl overflow-hidden bg-card border border-border">
                <div className="relative aspect-square overflow-hidden bg-secondary">
                  <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-95 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg font-semibold text-foreground">{product.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{product.colorShown}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-primary font-bold">{product.price}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  )
}