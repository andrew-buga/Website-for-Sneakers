<<<<<<< ours
﻿"use client"

import { ChangeEvent, useEffect, useState } from "react"
=======
"use client"

import { useEffect, useState } from "react"
>>>>>>> theirs

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth-context"

<<<<<<< ours
// ---- Тип продукту ----
=======
>>>>>>> theirs
type Product = {
  id: string
  sku: string
  name: string
<<<<<<< ours
  description: string | null
  category: "men" | "women"
  collection: "summer" | "winter" | "autumn"
  isTrending: boolean
  currency: string
  imageUrl: string | null
=======
>>>>>>> theirs
  priceCents: number
  stock: number
  sizes: string[]
  colors: string[]
  isActive: boolean
}

<<<<<<< ours
export default function AdminPanel() {
  const { user } = useAuth()

  // ---- Стани ----
  const [message, setMessage] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [productDrafts, setProductDrafts] = useState<Record<string, any>>({})
  const [form, setForm] = useState({
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
  const [uploading, setUploading] = useState(false)

  // ---- Завантаження продуктів ----
=======
export default function AdminPage() {
  const { user } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [form, setForm] = useState({ sku: "", name: "", priceCents: 0, stock: 0, sizes: "", colors: "" })
  const [stockDrafts, setStockDrafts] = useState<Record<string, string>>({})
  const [message, setMessage] = useState("")

>>>>>>> theirs
  const loadProducts = async () => {
    try {
      const res = await fetch("/api/products?includeInactive=true", { credentials: "include" })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setMessage(data.error ?? "Failed to load products")
        return
      }

<<<<<<< ours
      const nextProducts: Product[] = data.products ?? []
      setProducts(nextProducts)
      setProductDrafts(
        Object.fromEntries(
          nextProducts.map((p) => [
            p.id,
            {
              sku: p.sku,
              name: p.name,
              description: p.description ?? "",
              category: p.category,
              collection: p.collection,
              isTrending: p.isTrending,
              imageUrl: p.imageUrl ?? "",
              priceCents: p.priceCents,
              stock: p.stock,
              sizes: p.sizes.join(", "),
              colors: p.colors.join(", "),
              isActive: p.isActive,
            },
          ])
        )
      )
      setMessage("")
=======
      const nextProducts = data.products ?? []
      setProducts(nextProducts)
      setStockDrafts(Object.fromEntries(nextProducts.map((p: Product) => [p.id, String(p.stock)])))
>>>>>>> theirs
    } catch {
      setMessage("Failed to load products")
    }
  }

  useEffect(() => {
    void loadProducts()
  }, [])

<<<<<<< ours
  // ---- Завантаження зображення ----
  const uploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    setUploading(true)
    try {
      const res = await fetch("/api/admin/upload-image", {
        method: "POST",
        credentials: "include",
        body: formData,
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setMessage(data.error ?? "Upload failed")
        return
      }

      setForm((prev) => ({ ...prev, imageUrl: data.imageUrl }))
      setMessage("Image uploaded")
    } catch {
      setMessage("Upload failed")
    } finally {
      setUploading(false)
    }
  }

  // ---- Оновлення продукту ----
  const updateProduct = async (productId: string) => {
    const draft = productDrafts[productId]
    if (!draft) return

    const res = await fetch(`/api/products/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        sku: draft.sku,
        name: draft.name,
        description: draft.description || null,
        category: draft.category,
        collection: draft.collection,
        isTrending: draft.isTrending,
        imageUrl: draft.imageUrl || null,
        priceCents: Number(draft.priceCents),
        stock: Number(draft.stock),
        sizes: draft.sizes.split(",").map((s: string) => s.trim()).filter(Boolean),
        colors: draft.colors.split(",").map((s: string) => s.trim()).filter(Boolean),
        isActive: draft.isActive,
      }),
    })

    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      setMessage(data.error ?? "Failed to update product")
      return
    }

    setMessage("Product updated")
    await loadProducts()
  }

  // ---- Статус продукту ----
  const setProductActive = async (productId: string, isActive: boolean) => {
=======
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

>>>>>>> theirs
    const res = await fetch(`/api/products/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
<<<<<<< ours
      body: JSON.stringify({ isActive }),
    })

    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      setMessage(data.error ?? "Failed to update status")
      return
    }

    setMessage(isActive ? "Product activated" : "Product deactivated")
    await loadProducts()
  }

  // ---- Видалення продукту ----
  const hardDeleteProduct = async (productId: string) => {
    const confirmed = window.confirm("Delete this product permanently? It will fail if linked to orders.")
    if (!confirmed) return

    const res = await fetch(`/api/products/${productId}?hard=true`, {
=======
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
>>>>>>> theirs
      method: "DELETE",
      credentials: "include",
    })

<<<<<<< ours
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      setMessage(data.error ?? "Failed to delete product")
      return
    }

    setMessage("Product deleted")
    await loadProducts()
  }

  // ---- Сів посилання на демо ----
  const seedDemoProducts = async () => {
    const res = await fetch("/api/admin/seed-products", {
      method: "POST",
      credentials: "include",
    })

    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      setMessage(data.error ?? "Failed to seed demo products")
      return
    }

    setMessage(`Seeded ${data.seeded} products. Total in DB: ${data.totalProducts}`)
    await loadProducts()
=======
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
>>>>>>> theirs
  }

  if (!user || user.role !== "ADMIN") {
    return <main className="max-w-5xl mx-auto px-6 py-10">Admin access only.</main>
  }

  return (
    <main className="max-w-5xl mx-auto px-6 py-10 space-y-8">
      <h1 className="text-3xl font-bold">Admin Panel</h1>
<<<<<<< ours

      {/* Тут йде решта JSX з продуктами, формами і кнопками */}
      {/* Всі виклики useState тепер працюють */}
    </main>
  )
}

=======
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
>>>>>>> theirs
