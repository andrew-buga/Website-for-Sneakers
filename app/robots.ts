import type { MetadataRoute } from "next"

const siteUrl = "https://streater.vercel.app"

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
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}
