"use client"

import { ChangeEvent, useEffect, useState } from "react"

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

type ProductDraft = {
  sku: string
  name: string
  description: string
  category: "men" | "women"
  collection: "summer" | "winter" | "autumn"
  isTrending: boolean
  imageUrl: string
  priceCents: number
  stock: number
  sizes: string
  colors: string
  isActive: boolean
}

export default function AdminPage() {
  const { user } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
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
  const [productDrafts, setProductDrafts] = useState<Record<string, ProductDraft>>({})
  const [uploading, setUploading] = useState(false)
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
    } catch {
      setMessage("Failed to load products")
    }
  }

  useEffect(() => {
    void loadProducts()
  }, [])

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
        currency: form.currency || "USD",
        priceCents: Number(form.priceCents),
        stock: Number(form.stock),
        sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
        colors: form.colors.split(",").map((s) => s.trim()).filter(Boolean),
      }),
    })

    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
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
        sizes: draft.sizes.split(",").map((s) => s.trim()).filter(Boolean),
        colors: draft.colors.split(",").map((s) => s.trim()).filter(Boolean),
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

  const setProductActive = async (productId: string, isActive: boolean) => {
    const res = await fetch(`/api/products/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
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

  const hardDeleteProduct = async (productId: string) => {
    const confirmed = window.confirm("Delete this product permanently? It will fail if linked to orders.")
    if (!confirmed) return

    const res = await fetch(`/api/products/${productId}?hard=true`, {
      method: "DELETE",
      credentials: "include",
    })

    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      setMessage(data.error ?? "Failed to delete product")
      return
    }

    setMessage("Product deleted")
    await loadProducts()
  }

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
  }

  if (!user || user.role !== "ADMIN") {
    return <main className="max-w-5xl mx-auto px-6 py-10">Admin access only.</main>
  }

  return (
    <main className="max-w-5xl mx-auto px-6 py-10 space-y-8">
      <h1 className="text-3xl font-bold">Admin Panel</h1>
      <div className="space-y-3 rounded-xl border p-5">
        <h2 className="font-semibold">Customers</h2>
        <div className="flex flex-wrap gap-2">
        <Button onClick={async () => {
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
        }}>Export customers to Excel</Button>
        <Button variant="outline" onClick={seedDemoProducts}>Seed demo products</Button>
        </div>
      </div>

      <div className="space-y-3 rounded-xl border p-5">
        <h2 className="font-semibold">Create product</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input placeholder="SKU" value={form.sku} onChange={(e) => setForm((p) => ({ ...p, sku: e.target.value }))} />
          <Input placeholder="Name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
          <Input placeholder="Description" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
          <select
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={form.category}
            onChange={(e) => setForm((p) => ({ ...p, category: e.target.value as "men" | "women" }))}
          >
            <option value="men">Men</option>
            <option value="women">Women</option>
          </select>
          <select
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={form.collection}
            onChange={(e) => setForm((p) => ({ ...p, collection: e.target.value as "summer" | "winter" | "autumn" }))}
          >
            <option value="summer">Summer</option>
            <option value="winter">Winter</option>
            <option value="autumn">Autumn</option>
          </select>
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={form.isTrending}
              onChange={(e) => setForm((p) => ({ ...p, isTrending: e.target.checked }))}
            />
            Trending product
          </label>
          <Input placeholder="Image URL (/uploads/... or https://...)" value={form.imageUrl} onChange={(e) => setForm((p) => ({ ...p, imageUrl: e.target.value }))} />
          <Input placeholder="Currency (USD)" value={form.currency} onChange={(e) => setForm((p) => ({ ...p, currency: e.target.value.toUpperCase() }))} />
          <Input type="number" placeholder="Price cents" value={form.priceCents} onChange={(e) => setForm((p) => ({ ...p, priceCents: Number(e.target.value) }))} />
          <Input type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm((p) => ({ ...p, stock: Number(e.target.value) }))} />
          <Input placeholder="Sizes: 40,41,42" value={form.sizes} onChange={(e) => setForm((p) => ({ ...p, sizes: e.target.value }))} />
          <Input placeholder="Colors: Black,White" value={form.colors} onChange={(e) => setForm((p) => ({ ...p, colors: e.target.value }))} />
          <Input type="file" accept="image/*" onChange={uploadImage} disabled={uploading} />
        </div>
        {form.imageUrl ? (
          <div className="rounded-md border p-2 inline-block">
            <img src={form.imageUrl} alt="New product preview" className="rounded object-cover h-[120px] w-[120px]" />
          </div>
        ) : null}
        <Button onClick={createProduct} disabled={uploading}>{uploading ? "Uploading image..." : "Create product"}</Button>
      </div>

      <div className="rounded-xl border p-5">
        <h2 className="font-semibold mb-3">Products</h2>
        <div className="space-y-4">
          {products.map((product) => {
            const draft = productDrafts[product.id]
            if (!draft) return null

            return (
              <div key={product.id} className="text-sm border rounded p-3 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <Input value={draft.sku} onChange={(e) => setProductDrafts((prev) => ({ ...prev, [product.id]: { ...prev[product.id], sku: e.target.value } }))} />
                  <Input value={draft.name} onChange={(e) => setProductDrafts((prev) => ({ ...prev, [product.id]: { ...prev[product.id], name: e.target.value } }))} />
                  <Input value={draft.description} onChange={(e) => setProductDrafts((prev) => ({ ...prev, [product.id]: { ...prev[product.id], description: e.target.value } }))} placeholder="Description" />
                  <select
                    className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={draft.category}
                    onChange={(e) => setProductDrafts((prev) => ({ ...prev, [product.id]: { ...prev[product.id], category: e.target.value as "men" | "women" } }))}
                  >
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                  </select>
                  <select
                    className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={draft.collection}
                    onChange={(e) => setProductDrafts((prev) => ({ ...prev, [product.id]: { ...prev[product.id], collection: e.target.value as "summer" | "winter" | "autumn" } }))}
                  >
                    <option value="summer">Summer</option>
                    <option value="winter">Winter</option>
                    <option value="autumn">Autumn</option>
                  </select>
                  <label className="flex items-center gap-2 text-sm text-foreground">
                    <input
                      type="checkbox"
                      checked={draft.isTrending}
                      onChange={(e) => setProductDrafts((prev) => ({ ...prev, [product.id]: { ...prev[product.id], isTrending: e.target.checked } }))}
                    />
                    Trending product
                  </label>
                  <Input value={draft.imageUrl} onChange={(e) => setProductDrafts((prev) => ({ ...prev, [product.id]: { ...prev[product.id], imageUrl: e.target.value } }))} placeholder="Image URL" />
                  <Input type="number" min={0} value={draft.priceCents} onChange={(e) => setProductDrafts((prev) => ({ ...prev, [product.id]: { ...prev[product.id], priceCents: Number(e.target.value) } }))} />
                  <Input type="number" min={0} value={draft.stock} onChange={(e) => setProductDrafts((prev) => ({ ...prev, [product.id]: { ...prev[product.id], stock: Number(e.target.value) } }))} />
                  <Input value={draft.sizes} onChange={(e) => setProductDrafts((prev) => ({ ...prev, [product.id]: { ...prev[product.id], sizes: e.target.value } }))} placeholder="Sizes: 40,41,42" />
                  <Input value={draft.colors} onChange={(e) => setProductDrafts((prev) => ({ ...prev, [product.id]: { ...prev[product.id], colors: e.target.value } }))} placeholder="Colors: Black,White" />
                </div>
                {draft.imageUrl ? (
                  <div className="rounded-md border p-2 inline-block">
                    <img src={draft.imageUrl} alt={draft.name} className="rounded object-cover h-[100px] w-[100px]" />
                  </div>
                ) : null}
                <div className="flex flex-wrap items-center gap-2">
                  <Button size="sm" onClick={() => updateProduct(product.id)}>Save changes</Button>
                  {product.isActive ? (
                    <Button size="sm" variant="outline" onClick={() => setProductActive(product.id, false)}>Deactivate</Button>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => setProductActive(product.id, true)}>Activate</Button>
                  )}
                  <Button size="sm" variant="destructive" onClick={() => hardDeleteProduct(product.id)}>Delete permanently</Button>
                  {!product.isActive ? <span className="text-xs text-muted-foreground">inactive</span> : null}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
    </main>
  )
}
