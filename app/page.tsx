import type { Metadata } from "next"
import Navbar from "@/components/navbar"
import Hero from "@/components/hero"
import ProductShowcase from "@/components/product-showcase"
import Collections from "@/components/collections"
import Subscribe from "@/components/subscribe"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: "Streater Sneakers — Shop New Drops | Кросівки Онлайн | Кроси Онлайн",
  description:
    "Streater — the online sneaker store for fresh kicks. Shop men's & women's athletic shoes, running sneakers, and streetwear. Free EU shipping, easy 30-day returns. — Інтернет-магазин кросівок Streater: нові кроси, доставка по Україні та Європі, повернення 30 днів.",
  alternates: {
    canonical: "https://streater.vercel.app",
  },
  openGraph: {
    title: "Streater Sneakers — Shop New Drops | Кросівки Онлайн",
    description:
      "Shop the freshest sneakers at Streater. Men's & women's athletic shoes with free EU shipping. — Купуй кросівки онлайн.",
    url: "https://streater.vercel.app",
  },
}

export default function Page() {
  return (
    <main>
      <Navbar />
      <Hero />
      <ProductShowcase />
      <Collections />
      <Subscribe />
      <Footer />
    </main>
  )
}
