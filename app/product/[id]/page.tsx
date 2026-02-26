"use client"

import { useState, use } from "react"
import Link from "next/link"
import { useCart } from "@/lib/cart-context"
import { useWishlist } from "@/lib/wishlist-context"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import ProductGallery from "@/components/product-gallery"
import ProductReviews from "@/components/product-reviews"
import { ArrowLeft, Heart, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatPrice, getProductById } from "@/lib/catalog"

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const product = getProductById(parseInt(id, 10))
  const { addItem } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()

  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState(product?.colors[0]?.name || "")
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(product ? isInWishlist(product.id) : false)

  if (!product) {
    return <main><Navbar /><div className="min-h-screen flex items-center justify-center"><p className="text-muted-foreground">Product not found</p></div><Footer /></main>
  }

  const handleAddToCart = () => {
    if (!selectedSize) return alert("Please select a size")
    addItem({ id: product.id, name: product.name, price: formatPrice(product.price), image: product.image, quantity, size: selectedSize, color: selectedColor })
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  const handleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product.id, product.name)
    }
    setIsWishlisted(!isWishlisted)
  }

  return (
    <main>
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </div>

      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-8 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
        <ProductGallery images={product.images} productName={product.name} />

        <div className="flex flex-col justify-start space-y-6">
          <div>
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary">{product.collection}</span>
            <h1 className="font-display text-4xl lg:text-5xl font-bold text-foreground mt-2">{product.name}</h1>
          </div>

          <p className="text-lg text-foreground">{product.description}</p>

          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold text-primary">{formatPrice(product.price)}</div>
            <span className={"text-sm font-semibold px-3 py-1 rounded-full " + (product.inStock ? "bg-green-500/20 text-green-600" : "bg-red-500/20 text-red-600")}>
              {product.inStock ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          <div>
            <label className="text-sm font-semibold text-foreground block mb-3">Color: <span className="text-primary">{selectedColor}</span></label>
            <div className="flex gap-3 flex-wrap">
              {product.colors.map((color) => (
                <button key={color.name} onClick={() => setSelectedColor(color.name)} className={"w-12 h-12 rounded-full border-2 transition-all " + (selectedColor === color.name ? "border-primary scale-110" : "border-border hover:border-foreground")} style={{ backgroundColor: color.hex }} />
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-foreground block mb-3">Size: <span className="text-primary">{selectedSize || "Choose size"}</span></label>
            <div className="grid grid-cols-4 gap-2">
              {product.sizes.map((size) => (
                <button key={size} onClick={() => setSelectedSize(size)} className={"py-2 px-3 rounded-lg border-2 font-semibold transition-all " + (selectedSize === size ? "bg-primary text-primary-foreground border-primary" : "border-border text-foreground hover:border-foreground")}>{size}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-foreground block mb-3">Quantity</label>
            <div className="flex items-center gap-3">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors">-</button>
              <span className="text-lg font-semibold min-w-[2rem] text-center">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors">+</button>
            </div>
          </div>

          <div className="flex gap-3 pt-6">
            <Button onClick={handleAddToCart} size="lg" className="flex-1 gap-2 text-base" disabled={isAdded || !product.inStock}>
              <ShoppingCart className="h-5 w-5" />
              {isAdded ? "Added to Cart!" : !product.inStock ? "Out of Stock" : "Add to Cart"}
            </Button>
            <Button variant="outline" size="lg" className="px-6" onClick={handleWishlist}>
              <Heart className={`h-5 w-5 ${isWishlisted ? "fill-primary text-primary" : ""}`} />
            </Button>
          </div>
        </div>
      </section>

      <ProductReviews productId={product.id.toString()} />

      <Footer />
    </main>
  )
}
