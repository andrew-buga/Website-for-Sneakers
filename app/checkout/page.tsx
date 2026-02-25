"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const { user } = useAuth()
  const [formData, setFormData] = useState({ name: "", email: "", address: "", phone: "" })
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [cardData, setCardData] = useState({ cardNumber: "", expiry: "", cvc: "" })
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      }))
    }
  }, [user])

  const subtotal = total
  const shipping = 10
  const tax = subtotal * 0.1
  const finalTotal = subtotal + shipping + tax

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCardChange = (e) => {
    const { name, value } = e.target
    setCardData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsProcessing(true)

    setTimeout(() => {
      if (user) {
        const order = {
          id: Math.random().toString(36).substr(2, 9),
          userId: user.id,
          date: new Date().toISOString(),
          total: finalTotal,
          status: "Processing",
          items: items.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            color: item.color,
            size: item.size,
          })),
        }
        const allOrders = JSON.parse(localStorage.getItem("orders") || "[]")
        allOrders.push(order)
        localStorage.setItem("orders", JSON.stringify(allOrders))
      }
      setOrderPlaced(true)
      clearCart()
      setIsProcessing(false)
    }, 2000)
  }

  if (orderPlaced) {
    return (
      <main>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center space-y-6 text-center">
          <h1 className="font-display text-5xl font-bold text-primary">Order Placed!</h1>
          <p className="text-muted-foreground text-xl max-w-xl">Thank you for your purchase.</p>
          <div className="flex gap-4">
            {user && (
              <Link href="/account/orders">
                <Button size="lg" variant="outline">View Order History</Button>
              </Link>
            )}
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

        <h1 className="font-display text-4xl lg:text-5xl font-bold text-foreground mb-12">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <h2 className="font-display text-2xl font-bold text-foreground">Shipping</h2>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Full Name</label>
                <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground" placeholder="John Doe" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Email</label>
                <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground" placeholder="john@example.com" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Address</label>
                <input type="text" name="address" required value={formData.address} onChange={handleChange} className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground" placeholder="123 Main St" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Phone</label>
                <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground" placeholder="+1 555 123 4567" />
              </div>
            </div>

            <div className="space-y-6 border-t border-border pt-8">
              <h2 className="font-display text-2xl font-bold text-foreground">Payment</h2>

              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer p-4 border border-border rounded-lg hover:border-foreground" style={{borderColor: paymentMethod === "card" ? "var(--primary)" : ""}}>
                  <input type="radio" name="payment" value="card" checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")} />
                  <span className="font-semibold text-foreground">Credit Card</span>
                </label>

                {paymentMethod === "card" && (
                  <div className="mt-4 p-6 bg-card rounded-lg border border-border space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">Card Number</label>
                      <input type="text" name="cardNumber" required value={cardData.cardNumber} onChange={handleCardChange} className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground" placeholder="1234 5678 9012 3456" maxLength="19" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">Expiry Date</label>
                        <input type="text" name="expiry" required value={cardData.expiry} onChange={handleCardChange} className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground" placeholder="MM/YY" maxLength="5" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">CVC</label>
                        <input type="text" name="cvc" required value={cardData.cvc} onChange={handleCardChange} className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground" placeholder="123" maxLength="4" />
                      </div>
                    </div>
                  </div>
                )}

                <label className="flex items-center gap-3 cursor-pointer p-4 border border-border rounded-lg hover:border-foreground" style={{borderColor: paymentMethod === "paypal" ? "var(--primary)" : ""}}>
                  <input type="radio" name="payment" value="paypal" checked={paymentMethod === "paypal"} onChange={() => setPaymentMethod("paypal")} className="w-4 h-4" />
                  <span className="font-semibold text-foreground">PayPal</span>
                </label>

                {paymentMethod === "paypal" && (
                  <div className="mt-4 p-6 bg-card rounded-lg border border-border">
                    <p className="text-sm text-muted-foreground">You will be redirected to PayPal to complete the payment.</p>
                  </div>
                )}
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full text-base" disabled={isProcessing}>
              {isProcessing ? "Processing..." : "Place Order"}
            </Button>
          </form>

          <div className="bg-card rounded-2xl border border-border p-8 h-fit sticky top-6">
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">Order Summary</h2>

            <div className="space-y-3 max-h-96 overflow-y-auto mb-8 pb-8 border-b border-border">
              {items.map((item) => (
                <div key={item.id + item.size + item.color} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.name} x{item.quantity}</span>
                  <span className="font-semibold text-foreground">{"$" + (parseFloat(item.price.replace("$", "")) * item.quantity).toFixed(2)}</span>
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