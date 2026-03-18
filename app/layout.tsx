import React from "react"
import type { Metadata, Viewport } from 'next'
import { CartProvider } from '@/lib/cart-context'
import { WishlistProvider } from '@/lib/wishlist-context'
import { AuthProvider } from '@/lib/auth-context'

import './globals.css'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sneakerportfolio.me"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Streater Sneakers — Shop New Drops | Кросівки Онлайн",
    template: "%s | Streater Sneakers",
  },
  description:
    "Streater — your online sneaker store. Shop the freshest drops in men's & women's athletic shoes, running shoes, and streetwear kicks. Free EU shipping. Easy 30-day returns. — Інтернет-магазин кросівок Streater: каталог нових кросів, доставка по Україні та Європі.",
  keywords: [
    // English — broad
    "sneakers", "sneaker shop", "buy sneakers online", "sneaker store", "trainers",
    "athletic shoes", "running shoes", "kicks", "streetwear shoes", "sports shoes",
    "men sneakers", "women sneakers", "new sneaker drops", "limited edition sneakers",
    "affordable sneakers", "best sneakers 2025", "best sneakers 2026",
    // English — slang / informal
    "shoe shop", "shoe store", "fresh kicks", "clean sneakers", "sneaker boutique",
    // Ukrainian
    "кросівки", "купити кросівки", "магазин кросівок", "кросівки онлайн",
    "кросівки для бігу", "кросівки для чоловіків", "кросівки для жінок",
    "нові кросівки", "спортивне взуття", "взуття онлайн", "купити взуття",
    // Ukrainian slang
    "крости", "кроси", "кросики", "магаз з кросами", "магазин кросів",
    "купити кроси", "де купити кросівки", "круті кроси", "нові крости",
    // Russian
    "кроссовки", "купить кроссовки", "интернет магазин кроссовок", "магазин кроссовок",
    "кроссовки онлайн", "спортивная обувь", "кроссовки для бега",
    // Russian slang
    "кросы", "кросы купить", "магаз с кросами", "крутые кросы", "новые кросы",
    "кроссы", "тачки кроссовки",
    // Brand / model related
    "Streater", "Streater Impossible", "Streater sneakers", "Streater shoes",
  ],
  authors: [{ name: "Streater", url: siteUrl }],
  creator: "Andrew Buga",
  publisher: "Streater",
  category: "Shopping",
  applicationName: "Streater Sneakers",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["uk_UA", "ru_RU"],
    url: siteUrl,
    siteName: "Streater Sneakers",
    title: "Streater Sneakers — New Drops & Fresh Kicks",
    description:
      "Discover the latest sneaker drops at Streater. Premium athletic shoes, streetwear kicks, and everyday trainers. Free EU shipping. Easy returns. — Найкращий магазин кросівок онлайн.",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Streater Sneakers — Shop New Drops | Інтернет-магазин кросівок",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@StreaterShoes",
    creator: "@AndrewBuga",
    title: "Streater Sneakers — New Drops & Fresh Kicks",
    description:
      "Shop the freshest sneakers at Streater. Free EU shipping, easy 30-day returns. — Купуй кросівки онлайн у Streater.",
    images: ["/images/og-image.png"],
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      "en-US": siteUrl,
      "uk-UA": `${siteUrl}/uk`,
      "ru-RU": `${siteUrl}/ru`,
      "x-default": siteUrl,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
  other: {
    "google-site-verification": "9HGhgYtoRKfi8lJFdNqJCEuOKZdxeNc4E-sOMGrtBU0",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ff7300",
}

// JSON-LD structured data for the Organization + WebSite
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "Streater Sneakers",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/images/logo.png`,
        width: 200,
        height: 60,
      },
      description:
        "Streater is an online sneaker store offering the latest athletic shoes, running shoes, and streetwear kicks for men and women.",
      contactPoint: {
        "@type": "ContactPoint",
        email: "official.andrew.buga@gmail.com",
        contactType: "customer service",
        availableLanguage: ["English", "Ukrainian", "Russian"],
      },
      sameAs: [
        "https://github.com/andrew-buga",
        "https://www.behance.net/andrewbuga",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Streater Sneakers",
      description: "Online sneaker store — Інтернет-магазин кросівок",
      publisher: { "@id": `${siteUrl}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${siteUrl}/trends?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
      inLanguage: ["en", "uk"],
    },
    {
      "@type": "Store",
      "@id": `${siteUrl}/#store`,
      name: "Streater Sneakers",
      url: siteUrl,
      image: `${siteUrl}/images/og-image.png`,
      description:
        "Premium sneaker store online. Shop men's and women's athletic, running, and street shoes. — Магазин кросівок онлайн.",
      priceRange: "$$",
      paymentAccepted: "Credit Card, Debit Card",
      currenciesAccepted: "EUR, USD, UAH",
      hasMap: `${siteUrl}/store-locator`,
      returnPolicy: {
        "@type": "MerchantReturnPolicy",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 30,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn",
      },
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>{children}</WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
