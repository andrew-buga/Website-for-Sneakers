import type { MetadataRoute } from "next"

import { collectionsMeta } from "@/lib/storefront-types"
import { getStoreProducts } from "@/lib/server/storefront"
import { locales } from "@/lib/i18n"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sneakerportfolio.me"

type ChangeFrequency = MetadataRoute.Sitemap[number]["changeFrequency"]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticRoutes = [
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
  ].map((path) => {
    const changeFrequency: ChangeFrequency = path === "" || path === "/trends" ? "daily" : "weekly"

    return {
      url: `${siteUrl}${path}`,
      lastModified: now,
      changeFrequency,
      priority: path === "" ? 1.0 : 0.7,
    }
  })

  const collectionRoutes = Object.keys(collectionsMeta).map((slug) => ({
    url: `${siteUrl}/collection/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as ChangeFrequency,
    priority: 0.8,
  }))

  let products: Awaited<ReturnType<typeof getStoreProducts>>
  try {
    products = await getStoreProducts()
  } catch {
    // Keep sitemap available for crawlers even if product API is temporarily down.
    products = []
  }
  const productRoutes = products.map((product) => ({
    url: `${siteUrl}/product/${product.id}`,
    lastModified: now,
    changeFrequency: "weekly" as ChangeFrequency,
    priority: 0.6,
  }))

  const localizedLocales = locales.filter((locale) => locale !== "en")
  const localizedStatic = localizedLocales.flatMap((locale) =>
    staticRoutes.map((route) => ({
      ...route,
      url: route.url.replace(siteUrl, `${siteUrl}/${locale}`),
    }))
  )
  const localizedCollections = localizedLocales.flatMap((locale) =>
    collectionRoutes.map((route) => ({
      ...route,
      url: route.url.replace(siteUrl, `${siteUrl}/${locale}`),
    }))
  )
  const localizedProducts = localizedLocales.flatMap((locale) =>
    productRoutes.map((route) => ({
      ...route,
      url: route.url.replace(siteUrl, `${siteUrl}/${locale}`),
    }))
  )

  return [...staticRoutes, ...collectionRoutes, ...productRoutes, ...localizedStatic, ...localizedCollections, ...localizedProducts]
}
