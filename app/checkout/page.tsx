"use client"

import { FormEvent, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, X, Briefcase, Mail, Phone, ExternalLink } from "lucide-react"

import Footer from "@/components/footer"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { useCart } from "@/lib/cart-context"

function PortfolioModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-primary/40 bg-card shadow-[0_0_60px_rgba(255,115,0,0.25)] p-8 text-center">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Icon */}
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-5">
          <Briefcase className="h-7 w-7 text-primary" />
        </div>

        <h2 className="font-display text-2xl font-bold text-foreground mb-2">
          Це портфоліо-сайт 🎨
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed mb-6">
          Цей магазин створено як демонстрація навичок веб-розробки. Оплата та замовлення — симуляція, не реальні транзакції.
          <br /><br />
          Хочеш такий сайт для свого бізнесу? Звертайся — зроблю!
        </p>

        {/* Links */}
        <div className="flex flex-col gap-3 mb-6">
          <a
            href="https://www.behance.net/andrewbuga"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full bg-primary text-white font-semibold px-5 py-3 rounded-xl hover:bg-primary/90 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            Більше робіт на Behance
          </a>
          <a
            href="https://github.com/andrew-buga"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full border border-border text-foreground font-semibold px-5 py-3 rounded-xl hover:border-primary hover:text-primary transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            GitHub — вихідний код
          </a>
        </div>

        {/* Contacts */}
        <div className="border-t border-border pt-5 space-y-2 text-sm text-muted-foreground">
          <p className="text-xs font-semibold uppercase tracking-wider text-foreground/50 mb-3">Контакти для замовлення сайту</p>
          <a
            href="mailto:official.andrew.buga@gmail.com"
            className="flex items-center justify-center gap-2 hover:text-primary transition-colors"
          >
            <Mail className="h-4 w-4" />
            official.andrew.buga@gmail.com
          </a>
          <a
            href="tel:+40740116669"
            className="flex items-center justify-center gap-2 hover:text-primary transition-colors"
          >
            <Phone className="h-4 w-4" />
            +40 740 116 669
          </a>
        </div>

        <button
          onClick={onClose}
          className="mt-6 text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
        >
          Продовжити до оплати
        </button>
      </div>
    </div>
  )
}

function parsePrice(value: string) {
  return Number(value.replace(/[^0-9.]/g, "")) || 0
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clearCart } = useCart()
  const { user, isAuthenticated } = useAuth()
  const [showModal, setShowModal] = useState(true)
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [cardData, setCardData] = useState({ cardNumber: "", expiry: "", cvc: "" })
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/account/login")
    }
  }, [isAuthenticated, router])

  const defaultAddress = useMemo(() => {
    if (!user) return null
    return user.addresses.find((addr) => addr.id === user.defaultAddressId) || user.addresses[0] || null
  }, [user])

  const subtotal = total
  const shipping = 10
  const tax = subtotal * 0.1
  const finalTotal = subtotal + shipping + tax

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    if (!user) {
      setError("Please sign in before checkout")
      return
    }

    if (!defaultAddress) {
      setError("Add a delivery address in your profile before placing an order")
      return
    }

    if (items.length === 0) {
      setError("Your cart is empty")
      return
    }

    setIsProcessing(true)
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          userId: user.id,
          addressId: defaultAddress.id,
          shippingCents: Math.round(shipping * 100),
          notes: `Checkout via ${paymentMethod}`,
          items: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
          })),
        }),
      })

      const body = await response.json().catch(() => ({}))
      if (!response.ok) {
        const apiError = String(body.error ?? "Failed to create order")
        if (apiError.startsWith("INSUFFICIENT_STOCK:")) {
          setError("Some products are out of stock in requested quantity")
        } else if (apiError.startsWith("SIZE_NOT_AVAILABLE:")) {
          setError("Selected size is no longer available")
        } else if (apiError.startsWith("COLOR_NOT_AVAILABLE:")) {
          setError("Selected color is no longer available")
        } else {
          setError(apiError)
        }
        return
      }

      setOrderPlaced(true)
      clearCart()
    } catch {
      setError("Failed to place order")
    } finally {
      setIsProcessing(false)
    }
  }

  if (!isAuthenticated) return null

  if (orderPlaced) {
    return (
      <main>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center space-y-6 text-center">
          <h1 className="font-display text-5xl font-bold text-primary">Order Placed!</h1>
          <p className="text-muted-foreground text-xl max-w-xl">Thank you for your purchase.</p>
          <div className="flex gap-4">
            <Link href="/account/orders">
              <Button size="lg" variant="outline">View Order History</Button>
            </Link>
            <Link href="/">
              <Button size="lg">Continue Shopping</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main>
      {showModal && <PortfolioModal onClose={() => setShowModal(false)} />}
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <Link href="/cart" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to Cart
        </Link>

        <h1 className="font-display text-4xl lg:text-5xl font-bold text-foreground mb-6">Checkout</h1>

        {!defaultAddress ? (
          <div className="mb-8 rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-amber-200 text-sm">
            No delivery address found. <Link href="/account/profile" className="underline">Add one in profile</Link> to place an order.
          </div>
        ) : (
          <div className="mb-8 rounded-lg border border-border bg-card p-4 text-sm">
            <p className="font-semibold text-foreground">Delivery to:</p>
            <p className="text-muted-foreground">{defaultAddress.name}, {defaultAddress.address}, {defaultAddress.city}, {defaultAddress.zipCode}, {defaultAddress.country}</p>
          </div>
        )}

        {error ? (
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-300 text-sm">{error}</div>
        ) : null}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6 border-t border-border pt-8">
              <h2 className="font-display text-2xl font-bold text-foreground">Payment</h2>

              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer p-4 border border-border rounded-lg hover:border-foreground" style={{ borderColor: paymentMethod === "card" ? "var(--primary)" : "" }}>
                  <input type="radio" name="payment" value="card" checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")} />
                  <span className="font-semibold text-foreground">Credit Card</span>
                </label>

                {paymentMethod === "card" && (
                  <div className="mt-4 p-6 bg-card rounded-lg border border-border space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">Card Number</label>
                      <input
                        type="text"
                        name="cardNumber"
                        required
                        value={cardData.cardNumber}
                        onChange={(e) => setCardData((prev) => ({ ...prev, cardNumber: e.target.value }))}
                        className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground"
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">Expiry Date</label>
                        <input
                          type="text"
                          name="expiry"
                          required
                          value={cardData.expiry}
                          onChange={(e) => setCardData((prev) => ({ ...prev, expiry: e.target.value }))}
                          className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground"
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">CVC</label>
                        <input
                          type="text"
                          name="cvc"
                          required
                          value={cardData.cvc}
                          onChange={(e) => setCardData((prev) => ({ ...prev, cvc: e.target.value }))}
                          className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground"
                          placeholder="123"
                          maxLength={4}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <label className="flex items-center gap-3 cursor-pointer p-4 border border-border rounded-lg hover:border-foreground" style={{ borderColor: paymentMethod === "paypal" ? "var(--primary)" : "" }}>
                  <input type="radio" name="payment" value="paypal" checked={paymentMethod === "paypal"} onChange={() => setPaymentMethod("paypal")} className="w-4 h-4" />
                  <span className="font-semibold text-foreground">PayPal</span>
                </label>
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full text-base" disabled={isProcessing || !defaultAddress}>
              {isProcessing ? "Processing..." : "Place Order"}
            </Button>
          </form>

          <div className="bg-card rounded-2xl border border-border p-8 h-fit sticky top-6">
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">Order Summary</h2>

            <div className="space-y-3 max-h-96 overflow-y-auto mb-8 pb-8 border-b border-border">
              {items.map((item) => (
                <div key={item.id + item.size + item.color} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.name} x{item.quantity}</span>
                  <span className="font-semibold text-foreground">{"$" + (parsePrice(item.price) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-foreground">
                <span>Subtotal:</span>
                <span>{"$" + subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-foreground">
                <span>Shipping:</span>
                <span>{"$" + shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-foreground">
                <span>Tax:</span>
                <span>{"$" + tax.toFixed(2)}</span>
              </div>

              <div className="flex justify-between font-display text-xl font-bold text-foreground border-t border-border pt-4 mt-4">
                <span>Total:</span>
                <span className="text-primary">{"$" + finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
