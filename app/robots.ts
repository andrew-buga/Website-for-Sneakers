import type { MetadataRoute } from "next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sneakerportfolio.me"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/account/",
          "/checkout/",
          "/cart/",
          "/favorites/",
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
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}
