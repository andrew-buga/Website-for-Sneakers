"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { ArrowLeft, ArrowRight, Heart } from "lucide-react"

import { formatPriceCents, StoreProduct } from "@/lib/storefront-types"
import { useWishlist } from "@/lib/wishlist-context"
import { defaultLocale, getDictionary, Locale, withLocaleHref } from "@/lib/i18n"

export default function ProductShowcase({ locale = defaultLocale }: { locale?: Locale }) {
  const [products, setProducts] = useState<StoreProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [active, setActive] = useState(-1)
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const t = getDictionary(locale)

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
              {t.showcase.featured}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold uppercase text-foreground mt-2">
              {t.showcase.newDrops}
            </h2>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <button
              type="button"
              onClick={goPrev}
              aria-label={t.showcase.prev}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label={t.showcase.next}
              className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {isLoading ? (
          <p className="text-muted-foreground">{t.showcase.loading}</p>
        ) : products.length === 0 ? (
          <p className="text-muted-foreground">{t.showcase.empty}</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {products.map((product, index) => (
                <article
                  key={product.id}
                  className={`group relative rounded-2xl overflow-hidden bg-card border border-border transition-all duration-500 hover:-translate-y-1 hover:ring-2 hover:ring-primary/80 hover:shadow-[0_0_40px_rgba(255,115,0,0.35)] ${
                    index === active ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <div className="relative aspect-square overflow-hidden bg-secondary">
                    <Link href={withLocaleHref(locale, `/product/${product.id}`)} className="absolute inset-0">
                      <Image
                        src={product.imageUrl || "/placeholder.svg"}
                        alt={`${product.name} — Streater sneakers`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>

                    <button
                      type="button"
                      aria-label={isInWishlist(product.id) ? t.showcase.wishlistRemove(product.name) : t.showcase.wishlistAdd(product.name)}
                      className="absolute bottom-3 right-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/90 text-foreground shadow-sm backdrop-blur transition-colors duration-200 hover:border-primary hover:text-primary"
                      onClick={() => {
                        if (isInWishlist(product.id)) {
                          removeFromWishlist(product.id)
                        } else {
                          addToWishlist(product.id, product.name)
                        }
                      }}
                    >
                      <Heart className={`h-5 w-5 transition-colors duration-200 ${isInWishlist(product.id) ? "fill-primary text-primary" : ""}`} />
                    </button>
                  </div>

                  <Link href={withLocaleHref(locale, `/product/${product.id}`)} className="block p-5">
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      {product.name}
                    </h3>
                    <div className="mt-3 flex flex-col gap-1 text-sm text-muted-foreground">
                      <p>
                        <span className="text-foreground/70">{t.showcase.colorLabel}:</span>{" "}
                        {product.colors.join("/") || t.catalogGrid.standardColorway}
                      </p>
                      <p>
                        <span className="text-foreground/70">{t.showcase.skuLabel}:</span>{" "}
                        {product.sku}
                      </p>
                      <p>
                        <span className="text-foreground/70">{t.showcase.collectionLabel}:</span>{" "}
                        {product.collection}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-primary group-hover:underline">
                      {formatPriceCents(product.priceCents, product.currency)}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </Link>
                </article>
              ))}
            </div>

            <div className="flex sm:hidden items-center justify-center gap-3 mt-8">
              <button
                type="button"
                onClick={goPrev}
                aria-label={t.showcase.prev}
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label={t.showcase.next}
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
