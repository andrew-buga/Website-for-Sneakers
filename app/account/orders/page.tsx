"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ShoppingBag, Search } from "lucide-react"

export interface Order {
  id: string
  userId: string
  date: string
  total: number
  status: "Pending" | "Processing" | "Shipped" | "Delivered"
  items: Array<{
    name: string
    quantity: number
    price: string
    color: string
    size: string
  }>
}

export default function OrdersPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push("/account/login")
      return
    }

    const allOrders = JSON.parse(localStorage.getItem("orders") || "[]")
    const userOrders = allOrders.filter((o: Order) => o.userId === user.id).reverse()
    setOrders(userOrders)
    setFilteredOrders(userOrders)
  }, [isAuthenticated, user, router])

  const applyFilters = () => {
    let filtered = [...orders]

    if (statusFilter !== "all") {
      filtered = filtered.filter(o => o.status === statusFilter)
    }

    if (searchTerm) {
      filtered = filtered.filter(o =>
        o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (startDate) {
      const start = new Date(startDate).getTime()
      filtered = filtered.filter(o => new Date(o.date).getTime() >= start)
    }

    if (endDate) {
      const end = new Date(endDate).getTime()
      filtered = filtered.filter(o => new Date(o.date).getTime() <= end)
    }

    setFilteredOrders(filtered)
  }

  const resetFilters = () => {
    setStatusFilter("all")
    setSearchTerm("")
    setStartDate("")
    setEndDate("")
    setFilteredOrders(orders)
  }

  useEffect(() => {
    applyFilters()
  }, [statusFilter, searchTerm, startDate, endDate, orders])

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <main>
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 lg:px-12 py-12 min-h-screen">
        <Link href="/account/profile" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to Account
        </Link>

        <div className="mb-12">
          <h1 className="font-display text-4xl font-bold text-foreground">My Orders</h1>
          <p className="text-muted-foreground mt-2">Track your orders and view order history</p>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-8">
          <h2 className="font-display text-lg font-bold text-foreground mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Search Order</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Order ID or product name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
              >
                <option value="all">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">From Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">To Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
              />
            </div>
          </div>

          <Button onClick={resetFilters} variant="outline" size="sm">
            Reset Filters
          </Button>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-12 text-center">
            <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h2 className="font-display text-2xl font-bold text-foreground mb-2">No Orders Found</h2>
            <p className="text-muted-foreground mb-6">
              {orders.length === 0
                ? "You haven't placed any orders yet. Start shopping to create your first order."
                : "No orders match your current filters. Try adjusting your search criteria."}
            </p>
            <Link href="/">
              <Button size="lg">Continue Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Showing {filteredOrders.length} of {orders.length} orders</p>
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-card border border-border rounded-lg p-6 hover:border-foreground transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-foreground">Order #{order.id}</h3>
                    <p className="text-sm text-muted-foreground">{new Date(order.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      order.status === "Delivered"
                        ? "bg-green-500/20 text-green-600"
                        : order.status === "Shipped"
                        ? "bg-blue-500/20 text-blue-600"
                        : order.status === "Processing"
                        ? "bg-yellow-500/20 text-yellow-600"
                        : "bg-gray-500/20 text-gray-600"
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="border-t border-border pt-4 mb-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">
                        {item.name} ({item.color}, Size {item.size}) x{item.quantity}
                      </span>
                      <span className="font-semibold text-foreground">{item.price}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-xl font-bold text-primary">${order.total.toFixed(2)}</p>
                  </div>
                  <Button variant="outline">View Details</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </main>
  )
}
