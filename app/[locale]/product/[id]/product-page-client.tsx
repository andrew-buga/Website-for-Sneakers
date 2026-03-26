"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { ArrowLeft, Heart, ShoppingCart } from "lucide-react"

import { useCart } from "@/lib/cart-context"
import { useWishlist } from "@/lib/wishlist-context"
import { Button } from "@/components/ui/button"
import ProductGallery from "@/components/product-gallery"
import ProductReviews from "@/components/product-reviews"
import { formatPriceCents, StoreProduct } from "@/lib/storefront-types"
import { getDictionary, withLocaleHref } from "@/lib/i18n"

interface ProductPageClientProps {
  product: StoreProduct
  locale: string
}

export default function ProductPageClient({ product, locale }: ProductPageClientProps) {
  const t = getDictionary(locale as any) // locale is guaranteed from server component validation
  const { addItem } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()

  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState(product.colors[0] ?? t.product.defaultColor)
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [addToCartError, setAddToCartError] = useState("")

  // Memoize wishlist check to prevent race condition
  const checkWishlistStatus = useCallback((productId: string) => {
    return isInWishlist(productId)
  }, [isInWishlist])

  // Initialize wishlist status on mount
  useEffect(() => {
    setIsWishlisted(checkWishlistStatus(product.id))
  }, [product.id, checkWishlistStatus])

  const handleAddToCart = () => {
    if (product.sizes.length > 0 && !selectedSize) {
      setAddToCartError(t.product.addError)
      return
    }
    setAddToCartError("")
    addItem({
      id: product.id,
      name: product?.name,
      price: formatPriceCents(product.priceCents, product.currency),
      image: product.imageUrl,
      quantity,
      size: selectedSize || t.product.oneSize,
      color: selectedColor || t.product.defaultColor,
    })
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  const handleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product.id, product?.name)
    }
    setIsWishlisted(!isWishlisted)
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6">
        <Link href={withLocaleHref(locale as any, "/")} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          {t.product.back}
        </Link>
      </div>

      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-8 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
        <div className="relative">
          <ProductGallery images={[product.imageUrl]} productName={product?.name} locale={locale as any} />
          <Button
            variant="outline"
            size="icon"
            className="absolute bottom-4 right-4 z-10 h-11 w-11 rounded-full border-border bg-background/90 shadow-sm backdrop-blur"
            onClick={handleWishlist}
            aria-label={isWishlisted ? t.product.wishlistRemove : t.product.wishlistAdd}
          >
            <Heart className={`h-5 w-5 ${isWishlisted ? "fill-primary text-primary" : ""}`} />
          </Button>
        </div>

        <div className="flex flex-col justify-start space-y-6">
          <div>
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary">{product.collection}</span>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-foreground mt-2">{product?.name}</h2>
          </div>

          <p className="text-lg text-foreground">{product.description}</p>

          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold text-primary">{formatPriceCents(product.priceCents, product.currency)}</div>
            <span className={"text-sm font-semibold px-3 py-1 rounded-full " + (product.stock > 0 ? "bg-green-500/20 text-green-600" : "bg-red-500/20 text-red-600")}>
              {product.stock > 0 ? t.product.inStock(product.stock) : t.product.outOfStock}
            </span>
          </div>

          <div>
            <label className="text-sm font-semibold text-foreground block mb-3">{t.product.color}: <span className="text-primary">{selectedColor}</span></label>
            <div className="flex gap-2 flex-wrap">
              {(product.colors.length ? product.colors : [t.product.defaultColor]).map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={"py-2 px-3 rounded-lg border-2 text-sm transition-all " + (selectedColor === color ? "bg-primary text-primary-foreground border-primary" : "border-border text-foreground hover:border-foreground")}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {product.sizes.length > 0 ? (
            <div>
              <label className="text-sm font-semibold text-foreground block mb-3">{t.product.size}: <span className="text-primary">{selectedSize || t.product.chooseSize}</span></label>
              <div className="grid grid-cols-4 gap-2">
                {product.sizes.map((size) => (
                  <button key={size} onClick={() => setSelectedSize(size)} className={"py-2 px-3 rounded-lg border-2 font-semibold transition-all " + (selectedSize === size ? "bg-primary text-primary-foreground border-primary" : "border-border text-foreground hover:border-foreground")}>{size}</button>
                ))}
              </div>
            </div>
          ) : null}

          <div>
            <label className="text-sm font-semibold text-foreground block mb-3">{t.product.quantity}</label>
            <div className="flex items-center gap-3">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors">-</button>
              <span className="text-lg font-semibold min-w-[2rem] text-center">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors">+</button>
            </div>
          </div>

          <div className="flex gap-3 pt-6">
            <Button onClick={handleAddToCart} size="lg" className="flex-1 gap-2 text-base" disabled={isAdded || product.stock <= 0}>
              <ShoppingCart className="h-5 w-5" />
              {isAdded ? t.product.added : product.stock <= 0 ? t.product.outOfStock : t.product.addToCart}
            </Button>
          </div>
          {addToCartError ? <p className="text-sm text-red-400">{addToCartError}</p> : null}
        </div>
      </section>

      <ProductReviews productId={product.id} locale={locale as any} />
    </>
  )
}
