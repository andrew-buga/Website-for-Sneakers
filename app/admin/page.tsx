"use client"

import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth-context"

type Product = {
  id: string
  sku: string
  name: string
  description: string | null
  category: "men" | "women"
  collection: "summer" | "winter" | "autumn"
  isTrending: boolean
  currency: string
  imageUrl: string | null
  priceCents: number
  stock: number
  sizes: string[]
  colors: string[]
  isActive: boolean
}

export default function AdminPage() {
  const { user } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [form, setForm] = useState({
    sku: "",
    name: "",
    description: "",
    category: "men" as "men" | "women",
    collection: "summer" as "summer" | "winter" | "autumn",
    isTrending: false,
    imageUrl: "",
    currency: "USD",
    priceCents: 0,
    stock: 0,
    sizes: "",
    colors: "",
  })
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

      const nextProducts: Product[] = data.products ?? []
      setProducts(nextProducts)
      setStockDrafts(Object.fromEntries(nextProducts.map((p) => [p.id, String(p.stock)])))
      setMessage("")
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
        description: form.description || undefined,
        category: form.category,
        collection: form.collection,
        isTrending: form.isTrending,
        imageUrl: form.imageUrl || undefined,
        currency: form.currency,
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
    setForm({
      sku: "",
      name: "",
      description: "",
      category: "men",
      collection: "summer",
      isTrending: false,
      imageUrl: "",
      currency: "USD",
      priceCents: 0,
      stock: 0,
      sizes: "",
      colors: "",
    })
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

  const toggleActive = async (productId: string, isActive: boolean) => {
    const res = await fetch(`/api/products/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ isActive }),
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setMessage(data.error ?? "Failed to update status")
      return
    }

    setMessage(isActive ? "Product activated" : "Product deactivated")
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
          <Input placeholder="Description" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
          <Input placeholder="Image URL (/uploads/... or https://...)" value={form.imageUrl} onChange={(e) => setForm((p) => ({ ...p, imageUrl: e.target.value }))} />
          <Input placeholder="Currency (USD)" value={form.currency} onChange={(e) => setForm((p) => ({ ...p, currency: e.target.value.toUpperCase() }))} />
          <Input type="number" placeholder="Price cents" value={form.priceCents} onChange={(e) => setForm((p) => ({ ...p, priceCents: Number(e.target.value) }))} />
          <Input type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm((p) => ({ ...p, stock: Number(e.target.value) }))} />
          <Input placeholder="Sizes: 40,41,42" value={form.sizes} onChange={(e) => setForm((p) => ({ ...p, sizes: e.target.value }))} />
          <Input placeholder="Colors: Black,White" value={form.colors} onChange={(e) => setForm((p) => ({ ...p, colors: e.target.value }))} />
          <label className="flex items-center gap-2 text-sm">
            <span>Category</span>
            <select className="border rounded px-2 py-1 bg-background" value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value as "men" | "women" }))}>
              <option value="men">men</option>
              <option value="women">women</option>
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <span>Collection</span>
            <select className="border rounded px-2 py-1 bg-background" value={form.collection} onChange={(e) => setForm((p) => ({ ...p, collection: e.target.value as "summer" | "winter" | "autumn" }))}>
              <option value="summer">summer</option>
              <option value="winter">winter</option>
              <option value="autumn">autumn</option>
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isTrending} onChange={(e) => setForm((p) => ({ ...p, isTrending: e.target.checked }))} />
            Trending
          </label>
        </div>
        <Button onClick={createProduct}>Create product</Button>
      </div>

      <div className="rounded-xl border p-5">
        <h2 className="font-semibold mb-3">Products</h2>
        <div className="space-y-3">
          {products.map((product) => (
            <div key={product.id} className="text-sm border rounded p-3 space-y-2">
              <div>
                {product.sku} - {product.name} - ${(product.priceCents / 100).toFixed(2)} - sizes [{product.sizes.join(", ")}] - colors [{product.colors.join(", ")}] {product.isActive ? "" : "(inactive)"}
              </div>
              <div className="text-muted-foreground">
                {product.category}/{product.collection}{product.isTrending ? " - trending" : ""}
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
                  <Button size="sm" variant="outline" onClick={() => toggleActive(product.id, false)}>Deactivate</Button>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => toggleActive(product.id, true)}>Activate</Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
    </main>
  )
}
