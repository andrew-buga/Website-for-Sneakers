import type { Metadata } from "next"
import { notFound } from "next/navigation"

import Navbar from "@/components/navbar"
import Hero from "@/components/hero"
import ProductShowcase from "@/components/product-showcase"
import Collections from "@/components/collections"
import Subscribe from "@/components/subscribe"
import Footer from "@/components/footer"
import { getDictionary, isLocale } from "@/lib/i18n"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sneakerportfolio.me"

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  if (!isLocale(params.locale)) {
    return {}
  }

  const t = getDictionary(params.locale)
  const canonical = params.locale === "en" ? siteUrl : `${siteUrl}/${params.locale}`

  return {
    title: t.pages.home.metadataTitle,
    description: t.pages.home.metadataDescription,
    alternates: { canonical },
    openGraph: {
      title: t.pages.home.ogTitle,
      description: t.pages.home.ogDescription,
      url: canonical,
    },
  }
}

export default function LocalizedHomePage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) {
    notFound()
  }

  const locale = params.locale

  return (
    <main>
      <Navbar locale={locale} />
      <Hero locale={locale} />
      <ProductShowcase locale={locale} />
      <Collections locale={locale} />
      <Subscribe locale={locale} />
      <Footer locale={locale} />
    </main>
  )
}
