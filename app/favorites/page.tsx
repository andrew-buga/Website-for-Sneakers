"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useWishlist } from "@/lib/wishlist-context"
import { formatPriceCents, StoreProduct } from "@/lib/storefront-types"
import { Button } from "@/components/ui/button"

export default function FavoritesPage() {
  const { items, removeFromWishlist } = useWishlist()
  const [products, setProducts] = useState<StoreProduct[]>([])
  const [apiAvailable, setApiAvailable] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch("/api/products", { credentials: "include" })
        const body = await response.json().catch(() => ({}))
        setProducts(body.products ?? [])
        setApiAvailable(true)
      } catch {
        setApiAvailable(false)
      }
    }
    void load()
  }, [])

  // Merge API products and local snapshot
  const favoriteProducts = useMemo(() => {
    const ids = new Set(items.map((item) => item.id))
    const apiMap = new Map(products.map((p) => [p.id, p]))
    // Prefer API product, fallback to local snapshot
    return items.map((item) => apiMap.get(item.id) || item)
  }, [items, products])

  return (
    <main>
      <Navbar />
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pt-28 pb-16 lg:pb-24">
        <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary">Wishlist</span>
        <h1 className="font-display text-4xl lg:text-6xl font-bold text-foreground mt-2 mb-4">Favorites</h1>
        <p className="text-muted-foreground max-w-2xl mb-10">Sneakers that you marked with a heart.</p>

        {favoriteProducts.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-10 text-center">
            <p className="text-muted-foreground mb-4">No products in favorites yet.</p>
            <Link href="/trends" className="text-primary font-semibold hover:underline">Explore trends</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {favoriteProducts.map((product) => (
              <div key={product.id} className="rounded-2xl border border-border bg-card p-5">
                <Link href={`/product/${product.id}`} className="block">
                  <div className="aspect-square rounded-xl bg-secondary overflow-hidden mb-4">
                    {product.imageUrl ? (
                      <Image src={product.imageUrl} alt={product.name} width={600} height={600} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-muted-foreground text-2xl">No image</div>
                    )}
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground">{product.name}</h3>
                </Link>
                <p className="text-sm text-muted-foreground mt-1">{product.colors ? product.colors.join("/") : "Standard colorway"}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-semibold text-primary">
                    {typeof product.priceCents === "number" && product.currency ? formatPriceCents(product.priceCents, product.currency) : ""}
                  </span>
                  <Button variant="outline" size="sm" onClick={() => removeFromWishlist(product.id)}>
                    <Heart className="h-4 w-4 fill-primary text-primary" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      <Footer />
    </main>
  )
}
