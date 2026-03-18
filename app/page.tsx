import type { Metadata } from "next"
import Navbar from "@/components/navbar"
import Hero from "@/components/hero"
import ProductShowcase from "@/components/product-showcase"
import Collections from "@/components/collections"
import Subscribe from "@/components/subscribe"
import Footer from "@/components/footer"
import { defaultLocale, getDictionary } from "@/lib/i18n"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sneakerportfolio.me"
const locale = defaultLocale
const t = getDictionary(locale)

export const metadata: Metadata = {
  title: t.pages.home.metadataTitle,
  description: t.pages.home.metadataDescription,
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: t.pages.home.ogTitle,
    description: t.pages.home.ogDescription,
    url: siteUrl,
  },
}

export default function Page() {
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
