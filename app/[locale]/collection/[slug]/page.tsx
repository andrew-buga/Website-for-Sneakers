import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import CatalogProductGrid from "@/components/catalog-product-grid"
import { getStoreProducts } from "@/lib/server/storefront"
import { collectionsMeta } from "@/lib/storefront-types"
import { getDictionary, isLocale, withLocaleHref } from "@/lib/i18n"

export default async function LocalizedCollectionPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const resolved = await params

  if (!isLocale(resolved.locale)) {
    notFound()
  }

  const locale = resolved.locale
  const t = getDictionary(locale)
  const key = resolved.slug as keyof typeof collectionsMeta
  const meta = collectionsMeta[key]

  if (!meta) {
    return (
      <main>
        <Navbar locale={locale} />
        <div className="min-h-screen flex items-center justify-center"><p className="text-muted-foreground">{t.common.collectionNotFound}</p></div>
        <Footer locale={locale} />
      </main>
    )
  }

  const localizedTitle = key === "winter" ? t.collections.winter : key === "summer" ? t.collections.summer : t.collections.autumn
  const localizedDescription = key === "winter" ? t.collections.winterDescription : key === "summer" ? t.collections.summerDescription : t.collections.autumnDescription
  const products = await getStoreProducts({ collection: key })

  return (
    <main>
      <Navbar locale={locale} />

      <section className="relative h-[50vh] min-h-[300px] flex items-end overflow-hidden">
        <Image src={meta.banner} alt={localizedTitle} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pb-12 w-full">
          <Link href={withLocaleHref(locale, "/")} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ArrowLeft className="h-4 w-4" />
            {t.common.back}
          </Link>
          <span className="block text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-2">{t.common.seasonal}</span>
          <h1 className="font-display text-4xl lg:text-6xl font-bold uppercase text-foreground">{localizedTitle}</h1>
          <p className="text-muted-foreground mt-2 max-w-xl">{localizedDescription}</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24">
        <h2 className="font-display text-3xl font-bold text-foreground mb-8">{t.common.productsCount(products.length)}</h2>
        <CatalogProductGrid products={products} locale={locale} />
      </section>

      <Footer locale={locale} />
    </main>
  )
}
