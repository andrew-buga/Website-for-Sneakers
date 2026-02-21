import Image from "next/image"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { ArrowLeft, ArrowRight } from "lucide-react"

// All products — in a real project this would be a database
const allProducts = [
  {
    id: 1,
    image: "/images/product-1.jpg",
    name: "Nike Air Max Plus III",
    colorShown: "Black/Black/Wolf Grey",
    style: "CJ9684-002",
    country: "Vietnam",
    collection: "summer",
    price: "$180",
    description:
      "The Nike Air Max Plus III brings the TN silhouette into the future. Updated cushioning and a fresh upper keep the iconic look alive while delivering all-day comfort.",
  },
  {
    id: 2,
    image: "/images/product-2.jpg",
    name: "Nike Air Max Plus III",
    colorShown: "White/University Red",
    style: "CJ9684-100",
    country: "Vietnam",
    collection: "summer",
    price: "$180",
    description:
      "The Nike Air Max Plus III brings the TN silhouette into the future. Updated cushioning and a fresh upper keep the iconic look alive while delivering all-day comfort.",
  },
  {
    id: 3,
    image: "/images/product-3.jpg",
    name: "Nike Air Max Plus III",
    colorShown: "Midnight Navy/White",
    style: "CJ9684-400",
    country: "Vietnam",
    collection: "summer",
    price: "$180",
    description:
      "The Nike Air Max Plus III brings the TN silhouette into the future. Updated cushioning and a fresh upper keep the iconic look alive while delivering all-day comfort.",
  },
]

const collectionInfo: { [key: string]: { name: string; image: string; description: string } } = {
  winter: {
    name: "Winter collection",
    image: "/images/winter-collection.jpg",
    description:
      "Explore our winter collection featuring the latest cold-weather sneaker releases with premium insulation and enhanced durability.",
  },
  summer: {
    name: "Summer collection",
    image: "/images/summer-collection.jpg",
    description:
      "Discover lightweight and breathable sneakers perfect for warm weather. featuring vibrant colors and fresh designs.",
  },
  autumn: {
    name: "Autumn collection",
    image: "/images/autumn-collection.jpg",
    description:
      "Experience our autumn collection with versatile designs that transition seamlessly between seasons.",
  },
}

export default function CollectionPage({ params }: { params: { slug: string } }) {
  const slug = params.slug
  const info = collectionInfo[slug]

  if (!info) {
    return (
      <main>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground">Collection not found.</p>
        </div>
        <Footer />
      </main>
    )
  }

  // Filter products by collection
  const products = allProducts.filter((product) => product.collection === slug)

  return (
    <main>
      <Navbar />

      {/* Back link */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-28 pb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>
      </div>

      {/* Collection header */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-secondary">
            <Image
              src={info.image}
              alt={info.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Info */}
          <div className="flex flex-col gap-6">
            <div>
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary">
                Collection
              </span>
              <h1 className="font-display text-4xl lg:text-5xl font-bold uppercase text-foreground mt-2">
                {info.name}
              </h1>
            </div>

            <p className="text-muted-foreground leading-relaxed">{info.description}</p>

            <div className="flex items-center gap-4 mt-4">
              <button
                type="button"
                className="flex-1 bg-primary text-primary-foreground px-7 py-4 rounded-full text-sm font-semibold transition-all hover:opacity-90"
              >
                Shop Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Products grid */}
      {products.length > 0 && (
        <section className="bg-card py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="mb-10">
              <h2 className="font-display text-3xl font-bold uppercase text-foreground">
                All items
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="group relative rounded-2xl overflow-hidden bg-background border border-border transition-all duration-300"
                >
                  <div className="relative aspect-square overflow-hidden bg-secondary">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-95 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      {product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">{product.colorShown}</p>
                    <p className="text-sm font-semibold text-primary mt-2">{product.price}</p>
                    <span className="inline-flex items-center gap-2 mt-3 text-sm font-semibold text-primary group-hover:underline">
                      View product
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {products.length === 0 && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
            <p className="text-muted-foreground">No products in this collection yet.</p>
          </div>
        </section>
      )}

      <Footer />
    </main>
  )
}
