export type ProductCategory = "men" | "women"
export type ProductCollection = "summer" | "winter" | "autumn"

export interface CatalogProduct {
  id: number
  image: string
  images: string[]
  name: string
  colorShown: string
  style: string
  country: string
  price: number
  description: string
  sizes: string[]
  colors: { name: string; hex: string }[]
  inStock: boolean
  category: ProductCategory
  collection: ProductCollection
  isTrending: boolean
}

export const catalogProducts: CatalogProduct[] = [
  {
    id: 1,
    image: "/images/product-1.jpg",
    images: ["/images/product-1.jpg"],
    name: "Nike Air Max Plus III",
    colorShown: "Black/Black/Wolf Grey",
    style: "CJ9684-002",
    country: "Vietnam",
    price: 180,
    description: "Experience maximum comfort with responsive cushioning and all-day support.",
    sizes: ["6", "7", "8", "9", "10", "11", "12", "13"],
    colors: [
      { name: "Black", hex: "#1a1a1a" },
      { name: "White", hex: "#ffffff" },
      { name: "Navy", hex: "#001f3f" },
    ],
    inStock: true,
    category: "men",
    collection: "summer",
    isTrending: true,
  },
  {
    id: 2,
    image: "/images/product-2.jpg",
    images: ["/images/product-2.jpg"],
    name: "Nike Zoom Street Pro",
    colorShown: "White/University Red",
    style: "CZ1102-100",
    country: "Vietnam",
    price: 165,
    description: "Classic design meets modern comfort for daily city wear.",
    sizes: ["6", "7", "8", "9", "10", "11", "12"],
    colors: [
      { name: "White", hex: "#f7f7f7" },
      { name: "Red", hex: "#c1121f" },
    ],
    inStock: true,
    category: "women",
    collection: "summer",
    isTrending: true,
  },
  {
    id: 3,
    image: "/images/product-3.jpg",
    images: ["/images/product-3.jpg"],
    name: "Nike React Winter Run",
    colorShown: "Midnight Navy/White",
    style: "CJ9684-400",
    country: "Vietnam",
    price: 195,
    description: "Built for cold-weather runs with a stable and cushioned ride.",
    sizes: ["7", "8", "9", "10", "11", "12"],
    colors: [
      { name: "Navy", hex: "#0b1f52" },
      { name: "Grey", hex: "#7b7b7b" },
    ],
    inStock: false,
    category: "men",
    collection: "winter",
    isTrending: false,
  },
  {
    id: 4,
    image: "/images/product-1.jpg",
    images: ["/images/product-1.jpg"],
    name: "Nike Motion Lite",
    colorShown: "Pearl White/Sand",
    style: "DM2100-109",
    country: "Indonesia",
    price: 150,
    description: "Lightweight comfort with sleek styling for versatile outfits.",
    sizes: ["5", "6", "7", "8", "9", "10"],
    colors: [
      { name: "Pearl", hex: "#f2efe8" },
      { name: "Sand", hex: "#d8c3a5" },
    ],
    inStock: true,
    category: "women",
    collection: "autumn",
    isTrending: true,
  },
  {
    id: 5,
    image: "/images/product-2.jpg",
    images: ["/images/product-2.jpg"],
    name: "Nike Court Edge",
    colorShown: "Black/Volt",
    style: "CT3901-007",
    country: "Vietnam",
    price: 172,
    description: "Street-ready silhouette with durable traction and firm support.",
    sizes: ["7", "8", "9", "10", "11", "12", "13"],
    colors: [
      { name: "Black", hex: "#101010" },
      { name: "Volt", hex: "#b7ff00" },
    ],
    inStock: true,
    category: "men",
    collection: "autumn",
    isTrending: true,
  },
  {
    id: 6,
    image: "/images/product-3.jpg",
    images: ["/images/product-3.jpg"],
    name: "Nike Flex Aura",
    colorShown: "Rose/White",
    style: "FX2008-615",
    country: "Indonesia",
    price: 158,
    description: "Soft flex platform for comfort-focused movement and travel days.",
    sizes: ["5", "6", "7", "8", "9", "10", "11"],
    colors: [
      { name: "Rose", hex: "#d88ea7" },
      { name: "White", hex: "#ffffff" },
    ],
    inStock: true,
    category: "women",
    collection: "winter",
    isTrending: false,
  },
]

export const collectionsMeta: Record<ProductCollection, { title: string; description: string; banner: string }> = {
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

export function getProductById(id: number) {
  return catalogProducts.find((item) => item.id === id)
}

export function formatPrice(price: number) {
  return `$${price}`
}
