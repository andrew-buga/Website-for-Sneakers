import { ReactNode } from "react"

import Footer from "@/components/footer"
import Navbar from "@/components/navbar"

type SiteShellProps = {
  eyebrow?: string
  title: string
  description?: string
  children: ReactNode
  contentClassName?: string
}

export default function SiteShell({
  eyebrow,
  title,
  description,
  children,
  contentClassName = "max-w-7xl mx-auto px-6 lg:px-12 pt-28 pb-16 lg:pb-24",
}: SiteShellProps) {
  return (
    <main>
      <Navbar />
      <section className={contentClassName}>
        {eyebrow ? <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary">{eyebrow}</span> : null}
        <h1 className="font-display text-4xl lg:text-6xl font-bold text-foreground mt-2 mb-4">{title}</h1>
        {description ? <p className="text-muted-foreground max-w-2xl mb-10">{description}</p> : null}
        {children}
      </section>
      <Footer />
    </main>
  )
}

