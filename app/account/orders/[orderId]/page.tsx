"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"

import Footer from "@/components/footer"
import Navbar from "@/components/navbar"
import { useAuth } from "@/lib/auth-context"

type OrderDetails = {
  id: string
  status: string
  createdAt: string
  totalCents: number
  subtotalCents: number
  shippingCents: number
  address: {
    fullName: string
    line1: string
    city: string
    postalCode: string
    country: string
  }
  items: Array<{
    id: string
    quantity: number
    unitPriceCents: number
    totalPriceCents: number
    size: string | null
    color: string | null
    product: { name: string; sku: string }
  }>
}

export default function OrderDetailsPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const params = useParams<{ orderId: string }>()

  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.replace("/account/login")
      return
    }

    const load = async () => {
      setIsLoading(true)
      const response = await fetch(`/api/orders/${params.orderId}`, { credentials: "include" })
      if (!response.ok) {
        setOrder(null)
        setIsLoading(false)
        return
      }

      const body = await response.json()
      setOrder(body.order ?? null)
      setIsLoading(false)
    }

    void load()
  }, [isAuthenticated, params.orderId, router, user])

  if (!isAuthenticated || !user) return null

  if (isLoading) {
    return (
      <main>
        <Navbar />
        <div className="max-w-5xl mx-auto px-6 py-10 min-h-screen">Loading order...</div>
        <Footer />
      </main>
    )
  }

  if (!order) {
    return (
      <main>
        <Navbar />
        <div className="max-w-5xl mx-auto px-6 py-10 min-h-screen">Order not found.</div>
        <Footer />
      </main>
    )
  }

  return (
    <main>
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-6 min-h-screen">
        <Link href="/account/orders" className="text-sm underline">
          Back to orders
        </Link>
        <h1 className="text-3xl font-bold">Order #{order.id.slice(-8).toUpperCase()}</h1>
        <p className="text-muted-foreground">Status: {order.status} · {new Date(order.createdAt).toLocaleString()}</p>

        <div className="rounded-xl border p-4">
          <h2 className="font-semibold mb-2">Shipping address</h2>
          <p>{order.address.fullName}</p>
          <p>{order.address.line1}</p>
          <p>
            {order.address.city}, {order.address.postalCode}, {order.address.country}
          </p>
        </div>

        <div className="rounded-xl border p-4 space-y-2">
          <h2 className="font-semibold">Items</h2>
          {order.items.map((item) => (
            <div key={item.id} className="text-sm border rounded p-2">
              {item.product.name} ({item.product.sku}) · qty {item.quantity} · ${(item.totalPriceCents / 100).toFixed(2)}
              {item.size ? ` · size ${item.size}` : ""}
              {item.color ? ` · color ${item.color}` : ""}
            </div>
          ))}
        </div>

        <div className="rounded-xl border p-4">
          <p>Subtotal: ${(order.subtotalCents / 100).toFixed(2)}</p>
          <p>Shipping: ${(order.shippingCents / 100).toFixed(2)}</p>
          <p className="font-bold">Total: ${(order.totalCents / 100).toFixed(2)}</p>
        </div>
      </div>
      <Footer />
    </main>
  )
}

