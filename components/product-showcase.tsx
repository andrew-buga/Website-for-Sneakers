"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { formatPriceCents, StoreProduct } from "@/lib/storefront-types"

export default function ProductShowcase() {
  const [products, setProducts] = useState<StoreProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [active, setActive] = useState(-1)

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("/api/products?limit=3", { credentials: "include" })
        const body = await response.json().catch(() => ({}))
        setProducts(body.products ?? [])
      } finally {
        setIsLoading(false)
      }
    }

    void load()
  }, [])

  const goNext = () => setActive((prev) => (products.length ? (prev + 1) % products.length : -1))
  const goPrev = () => setActive((prev) => (products.length ? (prev - 1 + products.length) % products.length : -1))

  return (
    <section className="relative bg-background py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-end justify-between mb-12 lg:mb-16">
          <div>
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary">
              Featured
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold uppercase text-foreground mt-2">
              New Drops
            </h2>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous product"
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next product"
              className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {isLoading ? (
          <p className="text-muted-foreground">Loading featured products...</p>
        ) : products.length === 0 ? (
          <p className="text-muted-foreground">No products available yet.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {products.map((product, index) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  className={`group relative rounded-2xl overflow-hidden bg-card border border-border transition-all duration-500 hover:-translate-y-1 hover:ring-2 hover:ring-primary/80 hover:shadow-[0_0_40px_rgba(255,115,0,0.35)] ${
                    index === active ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <div className="relative aspect-square overflow-hidden bg-secondary">
                    <Image
                      src={product.imageUrl || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="p-5">
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      {product.name}
                    </h3>
                    <div className="mt-3 flex flex-col gap-1 text-sm text-muted-foreground">
                      <p>
                        <span className="text-foreground/70">Color:</span>{" "}
                        {product.colors.join("/") || "Standard"}
                      </p>
                      <p>
                        <span className="text-foreground/70">SKU:</span>{" "}
                        {product.sku}
                      </p>
                      <p>
                        <span className="text-foreground/70">Collection:</span>{" "}
                        {product.collection}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-primary group-hover:underline">
                      {formatPriceCents(product.priceCents, product.currency)}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="flex sm:hidden items-center justify-center gap-3 mt-8">
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous product"
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Next product"
                className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
