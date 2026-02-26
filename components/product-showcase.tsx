"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { catalogProducts } from "@/lib/catalog"

export default function ProductShowcase() {
  const products = catalogProducts.slice(0, 3)
  const [active, setActive] = useState(0)

  const goNext = () => setActive((prev) => (prev + 1) % products.length)
  const goPrev = () => setActive((prev) => (prev - 1 + products.length) % products.length)

  return (
    <section className="relative bg-background py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section header */}
        <div className="flex items-end justify-between mb-12 lg:mb-16">
          <div>
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary">
              Featured
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold uppercase text-foreground mt-2">
              Explore All
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

        {/* Product cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {products.map((product, index) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className={`group relative rounded-2xl overflow-hidden bg-card border border-border transition-all duration-500 ${
                index === active ? "ring-2 ring-primary" : ""
              }`}
            >
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden bg-secondary">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Product Info */}
              <div className="p-5">
                <h3 className="font-display text-lg font-semibold text-foreground">
                  {product.name}
                </h3>
                <div className="mt-3 flex flex-col gap-1 text-sm text-muted-foreground">
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
                <span className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-primary group-hover:underline">
                  Buy product now
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile nav arrows */}
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
      </div>
    </section>
  )
}
