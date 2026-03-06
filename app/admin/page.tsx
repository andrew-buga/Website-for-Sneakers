"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Upload } from "lucide-react"

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
  currency: string
  imageUrl: string
  priceCents: string
  stock: string
  sizes: string
  colors: string
}

const toDraft = (product: Product): ProductDraft => ({
  sku: product.sku,
  name: product.name,
  description: product.description ?? "",
  category: product.category,
  collection: product.collection,
  isTrending: product.isTrending,
  currency: product.currency,
  imageUrl: product.imageUrl ?? "",
  priceCents: String(product.priceCents),
  stock: String(product.stock),
  sizes: product.sizes.join(","),
  colors: product.colors.join(","),
})

const parseList = (value: string) => value.split(",").map((item) => item.trim()).filter(Boolean)

const toNonNegativeInt = (value: string) => {
  const next = Number(value)
  return Number.isInteger(next) && next >= 0 ? next : null
}

const INITIAL_FORM: ProductDraft = {
  sku: "",
  name: "",
  description: "",
  category: "men",
  collection: "summer",
  isTrending: false,
  currency: "USD",
  imageUrl: "",
  priceCents: "0",
  stock: "0",
  sizes: "",
  colors: "",
}

export default function AdminPage() {
  const { user } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [form, setForm] = useState<ProductDraft>(INITIAL_FORM)
  const [productDrafts, setProductDrafts] = useState<Record<string, ProductDraft>>({})
  const [savingProductId, setSavingProductId] = useState<string | null>(null)
  const [uploadingProductId, setUploadingProductId] = useState<string | null>(null)
  const [isUploadingNewImage, setIsUploadingNewImage] = useState(false)
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
      setProductDrafts(Object.fromEntries(nextProducts.map((product) => [product.id, toDraft(product)])))
      setMessage("")
    } catch {
      setMessage("Failed to load products")
    }
  }

  useEffect(() => {
    void loadProducts()
  }, [])

  const updateDraft = (productId: string, patch: Partial<ProductDraft>) => {
    setProductDrafts((prev) => ({
      ...prev,
      [productId]: {
        ...(prev[productId] ?? INITIAL_FORM),
        ...patch,
      },
    }))
  }

  const uploadImage = async (file: File) => {
    const formData = new FormData()
    formData.append("file", file)

    const res = await fetch("/api/admin/upload-image", {
      method: "POST",
      credentials: "include",
      body: formData,
    })

    const data = await res.json().catch(() => ({}))
    if (!res.ok || !data.imageUrl) {
      throw new Error(data.error ?? "Failed to upload image")
    }

    return String(data.imageUrl)
  }

  const uploadNewProductImage = async (file: File) => {
    try {
      setIsUploadingNewImage(true)
      const imageUrl = await uploadImage(file)
      setForm((prev) => ({ ...prev, imageUrl }))
      setMessage("Image uploaded for new product")
    } catch (error) {
      const text = error instanceof Error ? error.message : "Failed to upload image"
      setMessage(text)
    } finally {
      setIsUploadingNewImage(false)
    }
  }

  const uploadExistingProductImage = async (productId: string, file: File) => {
    try {
      setUploadingProductId(productId)
      const imageUrl = await uploadImage(file)

      const res = await fetch(`/api/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ imageUrl }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setMessage(data.error ?? "Failed to update product image")
        return
      }

      setMessage("Product image updated")
      await loadProducts()
    } catch (error) {
      const text = error instanceof Error ? error.message : "Failed to upload image"
      setMessage(text)
    } finally {
      setUploadingProductId(null)
    }
  }

  const createProduct = async () => {
    const priceCents = toNonNegativeInt(form.priceCents)
    const stock = toNonNegativeInt(form.stock)

    if (priceCents === null || stock === null) {
      setMessage("Price and stock must be non-negative integers")
      return
    }

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
        currency: form.currency.toUpperCase(),
        priceCents,
        stock,
        sizes: parseList(form.sizes),
        colors: parseList(form.colors),
      }),
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setMessage(data.error ?? "Failed to create product")
      return
    }

    setMessage("Product created")
    setForm(INITIAL_FORM)
    await loadProducts()
  }

  const saveProduct = async (productId: string) => {
    const draft = productDrafts[productId]
    if (!draft) return

    const priceCents = toNonNegativeInt(draft.priceCents)
    const stock = toNonNegativeInt(draft.stock)

    if (priceCents === null || stock === null) {
      setMessage("Price and stock must be non-negative integers")
      return
    }

    try {
      setSavingProductId(productId)
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
          currency: draft.currency.toUpperCase(),
          priceCents,
          stock,
          sizes: parseList(draft.sizes),
          colors: parseList(draft.colors),
        }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setMessage(data.error ?? "Failed to update product")
        return
      }

      setMessage("Product updated")
      await loadProducts()
    } finally {
      setSavingProductId(null)
    }
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
          <Input type="number" placeholder="Price cents" value={form.priceCents} onChange={(e) => setForm((p) => ({ ...p, priceCents: e.target.value }))} />
          <Input type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm((p) => ({ ...p, stock: e.target.value }))} />
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
          <label className="md:col-span-2 flex items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-2 text-muted-foreground">
              <Upload className="h-4 w-4" />
              Upload image
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  void uploadNewProductImage(file)
                }
                e.currentTarget.value = ""
              }}
            />
            {isUploadingNewImage ? <span className="text-xs text-muted-foreground">Uploading...</span> : null}
          </label>
        </div>
        <Button onClick={createProduct}>Create product</Button>
      </div>

      <div className="rounded-xl border p-5">
        <h2 className="font-semibold mb-3">Products</h2>
        <div className="space-y-3">
          {products.map((product) => {
            const draft = productDrafts[product.id] ?? toDraft(product)

            return (
              <div key={product.id} className="text-sm border rounded p-3 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="relative h-20 w-20 rounded-lg overflow-hidden border bg-secondary">
                    <Image src={draft.imageUrl || "/placeholder.svg"} alt={draft.name} fill className="object-cover" />
                  </div>
                  <div className="space-y-1">
                    <div className="font-semibold">{draft.name || "(Unnamed product)"}</div>
                    <div className="text-muted-foreground">ID: {product.id}</div>
                    <div className="text-muted-foreground">{product.isActive ? "Active" : "Inactive"}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input placeholder="SKU" value={draft.sku} onChange={(e) => updateDraft(product.id, { sku: e.target.value })} />
                  <Input placeholder="Name" value={draft.name} onChange={(e) => updateDraft(product.id, { name: e.target.value })} />
                  <Input placeholder="Description" value={draft.description} onChange={(e) => updateDraft(product.id, { description: e.target.value })} />
                  <Input placeholder="Image URL" value={draft.imageUrl} onChange={(e) => updateDraft(product.id, { imageUrl: e.target.value })} />
                  <Input placeholder="Currency" value={draft.currency} onChange={(e) => updateDraft(product.id, { currency: e.target.value.toUpperCase() })} />
                  <Input type="number" min={0} placeholder="Price cents" value={draft.priceCents} onChange={(e) => updateDraft(product.id, { priceCents: e.target.value })} />
                  <Input type="number" min={0} placeholder="Stock" value={draft.stock} onChange={(e) => updateDraft(product.id, { stock: e.target.value })} />
                  <Input placeholder="Sizes: 40,41,42" value={draft.sizes} onChange={(e) => updateDraft(product.id, { sizes: e.target.value })} />
                  <Input placeholder="Colors: Black,White" value={draft.colors} onChange={(e) => updateDraft(product.id, { colors: e.target.value })} />

                  <label className="flex items-center gap-2 text-sm">
                    <span>Category</span>
                    <select
                      className="border rounded px-2 py-1 bg-background"
                      value={draft.category}
                      onChange={(e) => updateDraft(product.id, { category: e.target.value as ProductDraft["category"] })}
                    >
                      <option value="men">men</option>
                      <option value="women">women</option>
                    </select>
                  </label>

                  <label className="flex items-center gap-2 text-sm">
                    <span>Collection</span>
                    <select
                      className="border rounded px-2 py-1 bg-background"
                      value={draft.collection}
                      onChange={(e) => updateDraft(product.id, { collection: e.target.value as ProductDraft["collection"] })}
                    >
                      <option value="summer">summer</option>
                      <option value="winter">winter</option>
                      <option value="autumn">autumn</option>
                    </select>
                  </label>

                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={draft.isTrending}
                      onChange={(e) => updateDraft(product.id, { isTrending: e.target.checked })}
                    />
                    Trending
                  </label>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <label className="flex items-center gap-2 text-sm">
                    <span className="inline-flex items-center gap-2 text-muted-foreground">
                      <Upload className="h-4 w-4" />
                      Change image
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          void uploadExistingProductImage(product.id, file)
                        }
                        e.currentTarget.value = ""
                      }}
                    />
                  </label>

                  <Button
                    size="sm"
                    onClick={() => saveProduct(product.id)}
                    disabled={savingProductId === product.id}
                  >
                    {savingProductId === product.id ? "Saving..." : "Save changes"}
                  </Button>

                  {product.isActive ? (
                    <Button size="sm" variant="outline" onClick={() => toggleActive(product.id, false)}>Deactivate</Button>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => toggleActive(product.id, true)}>Activate</Button>
                  )}

                  {uploadingProductId === product.id ? <span className="text-xs text-muted-foreground">Uploading image...</span> : null}
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
