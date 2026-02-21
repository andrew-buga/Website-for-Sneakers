import Navbar from "@/components/navbar"
import Hero from "@/components/hero"
import ProductShowcase from "@/components/product-showcase"
import Collections from "@/components/collections"
import Subscribe from "@/components/subscribe"
import Footer from "@/components/footer"

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
