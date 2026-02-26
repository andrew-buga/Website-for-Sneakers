import { Product } from "@prisma/client"
import { prisma } from "@/lib/server/prisma"
import { StoreProduct } from "@/lib/storefront-types"

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

export async function getStoreProducts(filters?: {
  category?: "men" | "women"
  collection?: "summer" | "winter" | "autumn"
  trending?: boolean
  includeInactive?: boolean
  limit?: number
}) {
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
}

export async function getStoreProductById(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
  })

  if (!product || !product.isActive) return null
  return normalizeProduct(product)
}
