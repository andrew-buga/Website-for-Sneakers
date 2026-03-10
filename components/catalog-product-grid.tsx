"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart } from "lucide-react"

import { StoreProduct, formatPriceCents } from "@/lib/storefront-types"
import { useWishlist } from "@/lib/wishlist-context"

export default function CatalogProductGrid({ products }: { products: StoreProduct[] }) {
  const { addSnapshotToWishlist, removeFromWishlist, isInWishlist } = useWishlist()

  if (products.length === 0) {
    return <p className="text-muted-foreground text-center py-20">No products found.</p>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {products.map((product) => (
        <article
          key={product.id}
          className="group relative rounded-2xl overflow-hidden bg-card border border-border transition-all duration-500 hover:-translate-y-1 hover:ring-2 hover:ring-primary/80 hover:shadow-[0_0_40px_rgba(255,115,0,0.35)]"
        >
          {/* Image wrapper — only the image scales on hover, not the button */}
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-secondary">
            <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-95">
              <Link href={`/product/${product.id}`} className="absolute inset-0">
                <Image
                  src={product.imageUrl}
                  alt={`${product.name} — sneakers`}
                  fill
                  className="rounded-2xl object-cover"
                />
              </Link>
            </div>

            {/* Heart / Favorite button sits OUTSIDE the scaling div — no shake */}
            <button
              type="button"
              aria-label={isInWishlist(product.id) ? `Remove ${product.name} from favorites` : `Add ${product.name} to favorites`}
              className="absolute bottom-3 right-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/90 text-foreground shadow-sm backdrop-blur transition-colors duration-200 hover:border-primary hover:text-primary"
              onClick={() => {
                if (isInWishlist(product.id)) {
                  removeFromWishlist(product.id)
                } else {
                  addSnapshotToWishlist({
                    id: product.id,
                    name: product.name,
                    imageUrl: product.imageUrl,
                    priceCents: product.priceCents,
                    currency: product.currency,
                  })
                }
              }}
            >
              <Heart className={`h-5 w-5 transition-colors duration-200 ${isInWishlist(product.id) ? "fill-primary text-primary" : ""}`} />
            </button>
          </div>

          <Link href={`/product/${product.id}`} className="block p-5">
            <h3 className="font-display text-lg font-semibold text-foreground">{product.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{product.colors.join("/") || "Standard colorway"}</p>
            <div className="flex items-center justify-between mt-3">
              <span className="text-primary font-bold">{formatPriceCents(product.priceCents, product.currency)}</span>
            </div>
          </Link>
        </article>
      ))}
    </div>
  )
}
