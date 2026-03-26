import { use } from "react"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { safeJsonParse, logError } from "@/lib/error-handler"
import { getDictionary, isLocale, withLocaleHref } from "@/lib/i18n"
import { StoreProduct } from "@/lib/storefront-types"
import ProductPageClient from "./product-page-client"

// Server component: fetches data and renders H1 for SEO
export default async function LocalizedProductPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const resolved = await params
  if (!isLocale(resolved.locale)) {
    return null
  }

  const locale = resolved.locale
  const t = getDictionary(locale)

  // Fetch product server-side
  let product: StoreProduct | null = null
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://sneakerportfolio.me"}/api/products/${resolved.id}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    })
    const body = await safeJsonParse(response, { productId: resolved.id })
    if (response.ok && body.product) {
      product = body.product
    }
  } catch (error) {
    logError(error, { context: "product page server fetch", productId: resolved.id })
  }

  if (!product) {
    return (
      <main>
        <div className="hidden md:block"><Navbar locale={locale} /></div>
        <div className="min-h-screen flex items-center justify-center"><p className="text-muted-foreground">{t.product.notFound}</p></div>
        <Footer locale={locale} />
      </main>
    )
  }

  const breadcrumbs = [
    { label: locale === 'uk' ? 'Головна' : locale === 'ru' ? 'Главная' : 'Home', href: '/' },
    { label: locale === 'uk' ? 'Товари' : locale === 'ru' ? 'Товары' : 'Products', href: '/products' },
    { label: product.collection, href: `/collection/${product.collection.toLowerCase()}` },
    { label: product.name, current: true }
  ]

  return (
    <main>
      <div className="hidden md:block"><Navbar locale={locale} /></div>
      <Breadcrumbs items={breadcrumbs} locale={locale} />
      
      {/* Server-rendered H1 for SEO */}
      <div className="sr-only">
        <h1>{product.name}</h1>
      </div>

      {/* Client-side interactive component */}
      <ProductPageClient product={product} locale={locale} />

      <Footer locale={locale} />
    </main>
  )
}
