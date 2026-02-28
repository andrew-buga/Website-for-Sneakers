"use client"

<<<<<<< ours
import { useEffect, useMemo, useState, FormEvent } from "react"
=======
import { useState, useEffect, ChangeEvent, FormEvent } from "react"
>>>>>>> theirs
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

function parsePrice(value: string) {
  return Number(value.replace(/[^0-9.]/g, "")) || 0
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clearCart } = useCart()
  const { user, isAuthenticated } = useAuth()
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [cardData, setCardData] = useState({ cardNumber: "", expiry: "", cvc: "" })
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
<<<<<<< ours
    if (!isAuthenticated) {
      router.push("/account/login")
=======
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.addresses.find((addr) => addr.id === user.defaultAddressId)?.address || user.addresses[0]?.address || "",
      }))
>>>>>>> theirs
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

<<<<<<< ours
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
=======
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCardChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCardData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsProcessing(true)
>>>>>>> theirs

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
<<<<<<< ours
                      <input type="text" name="cardNumber" required value={cardData.cardNumber} onChange={(e) => setCardData((prev) => ({ ...prev, cardNumber: e.target.value }))} className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground" placeholder="1234 5678 9012 3456" maxLength={19} />
=======
                      <input type="text" name="cardNumber" required value={cardData.cardNumber} onChange={handleCardChange} className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground" placeholder="1234 5678 9012 3456" maxLength={19} />
>>>>>>> theirs
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">Expiry Date</label>
<<<<<<< ours
                        <input type="text" name="expiry" required value={cardData.expiry} onChange={(e) => setCardData((prev) => ({ ...prev, expiry: e.target.value }))} className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground" placeholder="MM/YY" maxLength={5} />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">CVC</label>
                        <input type="text" name="cvc" required value={cardData.cvc} onChange={(e) => setCardData((prev) => ({ ...prev, cvc: e.target.value }))} className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground" placeholder="123" maxLength={4} />
=======
                        <input type="text" name="expiry" required value={cardData.expiry} onChange={handleCardChange} className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground" placeholder="MM/YY" maxLength={5} />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">CVC</label>
                        <input type="text" name="cvc" required value={cardData.cvc} onChange={handleCardChange} className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground" placeholder="123" maxLength={4} />
>>>>>>> theirs
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
