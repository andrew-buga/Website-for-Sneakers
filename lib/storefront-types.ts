export type StoreProduct = {
  id: string
  sku: string
  name: string
  description: string
  category: "men" | "women"
  collection: "summer" | "winter" | "autumn"
  isTrending: boolean
  priceCents: number
  currency: string
  imageUrl: string
  stock: number
  sizes: string[]
  colors: string[]
  isActive: boolean
}

export const collectionsMeta: Record<StoreProduct["collection"], { title: string; description: string; banner: string }> = {
  summer: {
    title: "Summer Collection",
    description: "Light, breathable, and built for warm weather movement.",
    banner: "/images/summer-collection.jpg",
  },
  winter: {
    title: "Winter Collection",
    description: "Warm, durable, and ready for the cold season.",
    banner: "/images/winter-collection.jpg",
  },
  autumn: {
    title: "Autumn Collection",
    description: "Balanced comfort and richer tones for changing conditions.",
    banner: "/images/autumn-collection.jpg",
  },
}

export function formatPriceCents(priceCents: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(priceCents / 100)
}
