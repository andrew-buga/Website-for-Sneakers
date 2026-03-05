import { Product } from "@prisma/client"
import { prisma } from "@/lib/server/prisma"
import { StoreProduct } from "@/lib/storefront-types"
import { demoProducts } from "@/lib/server/demo-products"

function normalizeProduct(product: Product): StoreProduct {
  return {
    id: product.id,
    sku: product.sku,
    name: product.name,
    description: product.description ?? "Premium sneakers for everyday wear.",
    category: product.category === "women" ? "women" : "men",
    collection: product.collection === "winter" || product.collection === "autumn" ? product.collection : "summer",
    isTrending: Boolean(product.isTrending),
    priceCents: product.priceCents,
    currency: product.currency ?? "USD",
    imageUrl: product.imageUrl ?? "/placeholder.svg",
    stock: product.stock,
    sizes: product.sizes ?? [],
    colors: product.colors ?? [],
    isActive: product.isActive,
  }
}

function normalizeDemoProduct(product: (typeof demoProducts)[number]): StoreProduct {
  return {
    id: product.sku,
    sku: product.sku,
    name: product.name,
    description: product.description ?? "Premium sneakers for everyday wear.",
    category: product.category,
    collection: product.collection,
    isTrending: Boolean(product.isTrending),
    priceCents: product.priceCents,
    currency: product.currency ?? "USD",
    imageUrl: product.imageUrl ?? "/placeholder.svg",
    stock: product.stock ?? 0,
    sizes: product.sizes ?? [],
    colors: product.colors ?? [],
    isActive: product.isActive ?? true,
  }
}

function getFallbackProducts(filters?: {
  category?: "men" | "women"
  collection?: "summer" | "winter" | "autumn"
  trending?: boolean
  includeInactive?: boolean
  limit?: number
}) {
  const filtered = demoProducts.filter((product) => {
    if (!filters?.includeInactive && !product.isActive) return false
    if (filters?.category && product.category !== filters.category) return false
    if (filters?.collection && product.collection !== filters.collection) return false
    if (filters?.trending && !product.isTrending) return false
    return true
  })

  const limited = filters?.limit ? filtered.slice(0, filters.limit) : filtered
  return limited.map(normalizeDemoProduct)
}

export async function getStoreProducts(filters?: {
  category?: "men" | "women"
  collection?: "summer" | "winter" | "autumn"
  trending?: boolean
  includeInactive?: boolean
  limit?: number
}) {
  if (!process.env.DATABASE_URL) {
    return getFallbackProducts(filters)
  }

  try {
    const products = await prisma.product.findMany({
      where: {
        ...(filters?.includeInactive ? {} : { isActive: true }),
        ...(filters?.category ? { category: filters.category } : {}),
        ...(filters?.collection ? { collection: filters.collection } : {}),
        ...(filters?.trending ? { isTrending: true } : {}),
      },
      orderBy: { createdAt: "desc" },
      ...(filters?.limit ? { take: filters.limit } : {}),
    })

    return products.map(normalizeProduct)
  } catch {
    return getFallbackProducts(filters)
  }
}

export async function getStoreProductById(id: string) {
  if (!process.env.DATABASE_URL) {
    const fallback = getFallbackProducts({ includeInactive: true }).find((product) => product.id === id)
    return fallback?.isActive ? fallback : null
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id },
    })

    if (!product || !product.isActive) return null
    return normalizeProduct(product)
  } catch {
    const fallback = getFallbackProducts({ includeInactive: true }).find((product) => product.id === id)
    return fallback?.isActive ? fallback : null
  }
}
