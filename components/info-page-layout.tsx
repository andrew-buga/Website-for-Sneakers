import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { ReactNode } from "react"

export default function InfoPageLayout({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: ReactNode
}) {
  return (
    <main>
      <Navbar />
      <section className="max-w-4xl mx-auto px-6 lg:px-12 pt-28 pb-16 lg:pb-24">
        <h1 className="font-display text-4xl lg:text-5xl font-bold text-foreground mb-3">{title}</h1>
        <p className="text-muted-foreground mb-8">{subtitle}</p>
        <div className="space-y-4 text-foreground/90 text-sm leading-relaxed">{children}</div>
      </section>
      <Footer />
    </main>
  )
}
