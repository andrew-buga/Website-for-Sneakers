import Image from "next/image"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { ArrowLeft, ArrowRight } from "lucide-react"

// Всі продукти — в реальному проекті це була б база даних
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

export default function ProductPage({ params }: { params: { id: string } }) {
  const productId = parseInt(params.id)
  const product = allProducts.find((p) => p.id === productId)

  if (!product) {
    return (
      <main>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground">Product not found.</p>
        </div>
        <Footer />
      </main>
    )
  }

  // Схожі продукти — з тієї ж колекції, крім поточного
  const similar = allProducts.filter(
    (p) => p.collection === product.collection && p.id !== product.id
  )

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

      {/* Product detail */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-secondary">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Info */}
          <div className="flex flex-col gap-6">
            <div>
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary">
                {product.collection} collection
              </span>
              <h1 className="font-display text-4xl lg:text-5xl font-bold uppercase text-foreground mt-2">
                {product.name}
              </h1>
            </div>

            <p className="text-3xl font-bold text-primary">{product.price}</p>

            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <p>
                <span className="text-foreground/70">Colour Shown:</span>{" "}
                {product.colorShown}
              </p>
              <p>
                <span className="text-foreground/70">Style:</span>{" "}
                {product.style}
              </p>
              <p>
                <span className="text-foreground/70">Country:</span>{" "}
                {product.country}
              </p>
            </div>

            <div className="flex items-center gap-4 mt-4">
              <button
                type="button"
                className="flex-1 bg-primary text-primary-foreground px-7 py-4 rounded-full text-sm font-semibold transition-all hover:opacity-90"
              >
                Add to Cart
              </button>
              <Link
                href={`/collection/${product.collection}`}
                className="inline-flex items-center gap-2 border border-border text-foreground px-7 py-4 rounded-full text-sm font-semibold transition-all hover:bg-secondary"
              >
                View Collection
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Similar products */}
      {similar.length > 0 && (
        <section className="bg-card py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="mb-10">
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary">
                From the same collection
              </span>
              <h2 className="font-display text-3xl font-bold uppercase text-foreground mt-2">
                You might also like
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {similar.map((item) => (
                <Link
                  key={item.id}
                  href={`/product/${item.id}`}
                  className="group relative rounded-2xl overflow-hidden bg-background border border-border transition-all duration-300"
                >
                  <div className="relative aspect-square overflow-hidden bg-secondary">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-95 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      {item.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.colorShown}
                    </p>
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

      <Footer />
    </main>
  )
}
