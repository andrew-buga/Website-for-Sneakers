"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart } from "lucide-react"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useWishlist } from "@/lib/wishlist-context"
import { catalogProducts, formatPrice } from "@/lib/catalog"
import { Button } from "@/components/ui/button"

export default function FavoritesPage() {
  const { items, removeFromWishlist } = useWishlist()
  const products = items
    .map((item) => catalogProducts.find((product) => product.id === item.id))
    .filter((product): product is NonNullable<typeof product> => Boolean(product))

  return (
    <main>
      <Navbar />
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pt-28 pb-16 lg:pb-24">
        <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary">Wishlist</span>
        <h1 className="font-display text-4xl lg:text-6xl font-bold text-foreground mt-2 mb-4">Favorites</h1>
        <p className="text-muted-foreground max-w-2xl mb-10">Sneakers that you marked with a heart.</p>

        {products.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-10 text-center">
            <p className="text-muted-foreground mb-4">No products in favorites yet.</p>
            <Link href="/trends" className="text-primary font-semibold hover:underline">Explore trends</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {products.map((product) => (
              <div key={product.id} className="rounded-2xl border border-border bg-card p-5">
                <Link href={`/product/${product.id}`} className="block">
                  <div className="aspect-square rounded-xl bg-secondary overflow-hidden mb-4">
                    <Image src={product.image} alt={product.name} width={600} height={600} className="h-full w-full object-cover" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground">{product.name}</h3>
                </Link>
                <p className="text-sm text-muted-foreground mt-1">{product.colorShown}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-semibold text-primary">{formatPrice(product.price)}</span>
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
