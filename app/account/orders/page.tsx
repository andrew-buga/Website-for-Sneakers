"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import Footer from "@/components/footer"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"

type ApiOrder = {
  id: string
  status: "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED"
  totalCents: number
  createdAt: string
}

export default function OrdersPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [orders, setOrders] = useState<ApiOrder[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push("/account/login")
      return
    }

    const load = async () => {
      const response = await fetch(`/api/orders?page=${page}&pageSize=10`, { credentials: "include" })
      if (!response.ok) return
      const body = await response.json()
      setOrders(body.orders ?? [])
      setTotalPages(body.pagination?.totalPages ?? 1)
    }

    void load()
  }, [isAuthenticated, page, router, user])

  if (!isAuthenticated || !user) return null

  return (
    <main>
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 lg:px-12 py-12 min-h-screen">
        <Link href="/account/profile" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" /> Back to Account
        </Link>

        <h1 className="font-display text-4xl font-bold text-foreground mb-6">My Orders</h1>

        <div className="space-y-4">
          {orders.map((order) => (
            <Link key={order.id} href={`/account/orders/${order.id}`} className="block rounded-xl border p-4 hover:bg-muted/40 transition-colors">
              <div className="flex justify-between">
                <span className="font-semibold">Order #{order.id.slice(-8).toUpperCase()}</span>
                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">Status: {order.status} · Total: ${(order.totalCents / 100).toFixed(2)}</div>
            </Link>
          ))}
        </div>

        <div className="flex gap-3 mt-6">
          <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Prev</Button>
          <Button variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
          <span className="text-sm text-muted-foreground self-center">Page {page} / {totalPages}</span>
        </div>
      </div>
      <Footer />
    </main>
  )
}
