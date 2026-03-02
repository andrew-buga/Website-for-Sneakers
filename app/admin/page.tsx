"use client"

import { ChangeEvent, useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth-context"

// ---- Тип продукту ----
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

  // ---- Видалення продукту ----
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
  }

  if (!user || user.role !== "ADMIN") {
    return <main className="max-w-5xl mx-auto px-6 py-10">Admin access only.</main>
  }

  return (
    <main className="max-w-5xl mx-auto px-6 py-10 space-y-8">
      <h1 className="text-3xl font-bold">Admin Panel</h1>

      {/* Тут йде решта JSX з продуктами, формами і кнопками */}
      {/* Всі виклики useState тепер працюють */}
    </main>
  )
}

