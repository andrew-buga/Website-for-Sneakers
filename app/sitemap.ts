import type { MetadataRoute } from "next"

import { collectionsMeta } from "@/lib/storefront-types"
import { getStoreProducts } from "@/lib/server/storefront"
import { locales } from "@/lib/i18n"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sneakerportfolio.me"

type ChangeFrequency = MetadataRoute.Sitemap[number]["changeFrequency"]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // Define all static routes
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

  // Get products
  let products: Awaited<ReturnType<typeof getStoreProducts>>
  try {
    products = await getStoreProducts()
  } catch {
    products = []
  }

  const sitemapEntries: MetadataRoute.Sitemap = []

  // Generate entries for ALL LOCALES
  for (const locale of locales) {
    // Static routes
    for (const path of staticRoutePaths) {
      const changeFrequency: ChangeFrequency =
        path === "" || path === "/trends" ? "daily" : "weekly"
      const url = path === "" ? `${siteUrl}/${locale}` : `${siteUrl}/${locale}${path}`

      // Create hreflang alternates for all language variants
      const alternates: { hrefLang?: Record<string, string> } = {}
      const hrefLangMap: Record<string, string> = {}

      for (const l of locales) {
        const hrefPath = path === "" ? `${siteUrl}/${l}` : `${siteUrl}/${l}${path}`
        hrefLangMap[l] = hrefPath
      }

      if (Object.keys(hrefLangMap).length > 0) {
        alternates.hrefLang = hrefLangMap
      }

      sitemapEntries.push({
        url,
        lastModified: now,
        changeFrequency,
        priority: path === "" ? 1.0 : 0.7,
      })
    }

    // Collections
    for (const slug of Object.keys(collectionsMeta)) {
      const url = `${siteUrl}/${locale}/collection/${slug}`

      sitemapEntries.push({
        url,
        lastModified: now,
        changeFrequency: "weekly" as ChangeFrequency,
        priority: 0.8,
      })
    }

    // Products
    for (const product of products) {
      const url = `${siteUrl}/${locale}/product/${product.id}`

      sitemapEntries.push({
        url,
        lastModified: now,
        changeFrequency: "weekly" as ChangeFrequency,
        priority: 0.6,
      })
    }
  }

  return sitemapEntries
}
