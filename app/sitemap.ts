import type { MetadataRoute } from "next"

import { collectionsMeta } from "@/lib/storefront-types"
import { getStoreProducts } from "@/lib/server/storefront"
import { locales } from "@/lib/i18n"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sneakerportfolio.me"

type ChangeFrequency = MetadataRoute.Sitemap[number]["changeFrequency"]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // Define all static routes - these will be generated for Each locale
  const staticRoutePaths = [
    "",
    "/trends",
    "/collections",
    "/men",
    "/women",
    "/accessories",
    "/contact",
    "/returns",
    "/store-locator",
    "/help-center",
    "/help/pagination",
    "/privacy-policy",
    "/terms-conditions",
    "/terms-of-use",
    "/receivers-amplifiers",
  ]

  // Generate static routes ONLY for English locale (not base routes)
  const staticRoutes = staticRoutePaths.map((path) => {
    const changeFrequency: ChangeFrequency = path === "" || path === "/trends" ? "daily" : "weekly"
    // For English, use /en prefix except for collections index which mirrors /collections
    const url = path === "" ? `${siteUrl}/en` : `${siteUrl}/en${path}`

    return {
      url,
      lastModified: now,
      changeFrequency,
      priority: path === "" ? 1.0 : 0.7,
    }
  })

  // Collections for English
  const collectionRoutes = Object.keys(collectionsMeta).map((slug) => ({
    url: `${siteUrl}/en/collection/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as ChangeFrequency,
    priority: 0.8,
  }))

  // Products for English
  let products: Awaited<ReturnType<typeof getStoreProducts>>
  try {
    products = await getStoreProducts()
  } catch {
    // Keep sitemap available for crawlers even if product API is temporarily down.
    products = []
  }
  const productRoutes = products.map((product) => ({
    url: `${siteUrl}/en/product/${product.id}`,
    lastModified: now,
    changeFrequency: "weekly" as ChangeFrequency,
    priority: 0.6,
  }))

  // Generate localized routes for UK and RU ONLY (not English, already done above)
  const localizedLocales = locales.filter((locale) => locale !== "en")
  
  const localizedStatic = localizedLocales.flatMap((locale) =>
    staticRoutePaths.map((path) => {
      const changeFrequency: ChangeFrequency = path === "" || path === "/trends" ? "daily" : "weekly"
      const url = path === "" ? `${siteUrl}/${locale}` : `${siteUrl}/${locale}${path}`

      return {
        url,
        lastModified: now,
        changeFrequency,
        priority: path === "" ? 1.0 : 0.7,
      }
    })
  )

  const localizedCollections = localizedLocales.flatMap((locale) =>
    Object.keys(collectionsMeta).map((slug) => ({
      url: `${siteUrl}/${locale}/collection/${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as ChangeFrequency,
      priority: 0.8,
    }))
  )

  const localizedProducts = localizedLocales.flatMap((locale) =>
    products.map((product) => ({
      url: `${siteUrl}/${locale}/product/${product.id}`,
      lastModified: now,
      changeFrequency: "weekly" as ChangeFrequency,
      priority: 0.6,
    }))
  )

  // REMOVED: Base routes (/, /men, /product/123, etc.) - these are redirect sources
  // ONLY include final destinations after middleware processing
  return [...staticRoutes, ...collectionRoutes, ...productRoutes, ...localizedStatic, ...localizedCollections, ...localizedProducts]
}
