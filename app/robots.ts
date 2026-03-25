import type { MetadataRoute } from "next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sneakerportfolio.me"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Block base routes (redirect sources) AND localized private pages
        // Base routes: /account/, /checkout/, /cart/, /favorites/
        // Localized private pages: /en/account/, /uk/account/, etc.
        disallow: [
          "/api/",
          "/admin/",
          // Base routes that redirect to /en/* - don't crawl the source
          "/account/",
          "/checkout/",
          "/cart/",
          "/favorites/",
          // Localized private pages - don't index these
          "/en/account/",
          "/uk/account/",
          "/ru/account/",
          "/en/checkout/",
          "/uk/checkout/",
          "/ru/checkout/",
          "/en/cart/",
          "/uk/cart/",
          "/ru/cart/",
          "/en/favorites/",
          "/uk/favorites/",
          "/ru/favorites/",
          "/_next/",
        ],
      },
      {
        // Allow major search engine crawlers full access to public pages
        userAgent: [
          "Googlebot",
          "Bingbot",
          "Yandexbot",
          "DuckDuckBot",
          "Baiduspider",
        ],
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/account/",
          "/checkout/",
          "/cart/",
          "/favorites/",
          "/en/account/",
          "/uk/account/",
          "/ru/account/",
          "/en/checkout/",
          "/uk/checkout/",
          "/ru/checkout/",
          "/en/cart/",
          "/uk/cart/",
          "/ru/cart/",
          "/en/favorites/",
          "/uk/favorites/",
          "/ru/favorites/",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}
