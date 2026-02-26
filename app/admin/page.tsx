"use client"

import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth-context"

type Product = {
  id: string
  sku: string
  name: string
  priceCents: number
  stock: number
  sizes: string[]
  colors: string[]
  isActive: boolean
}

export default function AdminPage() {
  const { user } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [form, setForm] = useState({ sku: "", name: "", priceCents: 0, stock: 0, sizes: "", colors: "" })
  const [stockDrafts, setStockDrafts] = useState<Record<string, string>>({})
  const [message, setMessage] = useState("")

  const loadProducts = async () => {
    try {
      const res = await fetch("/api/products?includeInactive=true", { credentials: "include" })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setMessage(data.error ?? "Failed to load products")
        return
      }

      const nextProducts = data.products ?? []
      setProducts(nextProducts)
      setStockDrafts(Object.fromEntries(nextProducts.map((p: Product) => [p.id, String(p.stock)])))
    } catch {
      setMessage("Failed to load products")
    }
  }

  useEffect(() => {
    void loadProducts()
  }, [])

  const createProduct = async () => {
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        sku: form.sku,
        name: form.name,
        priceCents: Number(form.priceCents),
        stock: Number(form.stock),
        sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
        colors: form.colors.split(",").map((s) => s.trim()).filter(Boolean),
      }),
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setMessage(data.error ?? "Failed to create product")
      return
    }

    setMessage("Product created")
    setForm({ sku: "", name: "", priceCents: 0, stock: 0, sizes: "", colors: "" })
    await loadProducts()
  }

  const updateStock = async (productId: string) => {
    const stockValue = Number(stockDrafts[productId] ?? "0")
    if (!Number.isInteger(stockValue) || stockValue < 0) {
      setMessage("Stock must be a non-negative integer")
      return
    }

    const res = await fetch(`/api/products/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ stock: stockValue }),
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setMessage(data.error ?? "Failed to update stock")
      return
    }

    setMessage("Stock updated")
    await loadProducts()
  }

  const deactivateProduct = async (productId: string) => {
    const res = await fetch(`/api/products/${productId}`, {
      method: "DELETE",
      credentials: "include",
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setMessage(data.error ?? "Failed to deactivate product")
      return
    }

    setMessage("Product deactivated")
    await loadProducts()
  }

  const exportCustomers = async () => {
    const res = await fetch("/api/admin/export/customers", { credentials: "include" })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setMessage(data.error ?? "Export failed")
      return
    }

    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `customers-${new Date().toISOString().slice(0, 10)}.xlsx`
    a.click()
    URL.revokeObjectURL(url)
    setMessage("Customers exported")
  }

  if (!user || user.role !== "ADMIN") {
    return <main className="max-w-5xl mx-auto px-6 py-10">Admin access only.</main>
  }

  return (
    <main className="max-w-5xl mx-auto px-6 py-10 space-y-8">
      <h1 className="text-3xl font-bold">Admin Panel</h1>
      <div className="space-y-3 rounded-xl border p-5">
        <h2 className="font-semibold">Customers</h2>
        <Button onClick={exportCustomers}>Export customers to Excel</Button>
      </div>

      <div className="space-y-3 rounded-xl border p-5">
        <h2 className="font-semibold">Create product</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input placeholder="SKU" value={form.sku} onChange={(e) => setForm((p) => ({ ...p, sku: e.target.value }))} />
          <Input placeholder="Name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
          <Input type="number" placeholder="Price cents" value={form.priceCents} onChange={(e) => setForm((p) => ({ ...p, priceCents: Number(e.target.value) }))} />
          <Input type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm((p) => ({ ...p, stock: Number(e.target.value) }))} />
          <Input placeholder="Sizes: 40,41,42" value={form.sizes} onChange={(e) => setForm((p) => ({ ...p, sizes: e.target.value }))} />
          <Input placeholder="Colors: Black,White" value={form.colors} onChange={(e) => setForm((p) => ({ ...p, colors: e.target.value }))} />
        </div>
        <Button onClick={createProduct}>Create product</Button>
      </div>

      <div className="rounded-xl border p-5">
        <h2 className="font-semibold mb-3">Products</h2>
        <div className="space-y-3">
          {products.map((product) => (
            <div key={product.id} className="text-sm border rounded p-3 space-y-2">
              <div>
                {product.sku} · {product.name} · ${(product.priceCents / 100).toFixed(2)} · sizes [{product.sizes.join(", ")}] · colors [{product.colors.join(", ")}] {product.isActive ? "" : "(inactive)"}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Input
                  className="w-36"
                  type="number"
                  min={0}
                  value={stockDrafts[product.id] ?? String(product.stock)}
                  onChange={(e) => setStockDrafts((prev) => ({ ...prev, [product.id]: e.target.value }))}
                />
                <Button size="sm" onClick={() => updateStock(product.id)}>Update stock</Button>
                {product.isActive ? (
                  <Button size="sm" variant="outline" onClick={() => deactivateProduct(product.id)}>Deactivate</Button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>

      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
    </main>
  )
}
