import type { Metadata } from "next"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Link from "next/link"
import { CheckCircle, Package, RefreshCw, Truck, Clock, AlertCircle, ChevronRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Returns & Refunds | Streater Sneakers",
  description:
    "Easy 30-day returns on all Streater sneakers. Learn how to return or exchange your order — simple, fast, and free.",
  keywords: ["returns", "refunds", "exchange", "sneaker return policy", "Streater returns"],
}

const steps = [
  {
    icon: Package,
    step: "1",
    title: "Start your return",
    description:
      "Go to your account order history or contact our support team. Select the item you'd like to return and choose a reason.",
  },
  {
    icon: Truck,
    step: "2",
    title: "Pack & ship",
    description:
      "Pack the item in its original box with all accessories (laces, tags, insoles). Print the prepaid return label we'll send you by email.",
  },
  {
    icon: RefreshCw,
    step: "3",
    title: "We inspect it",
    description:
      "Once we receive your parcel, our team inspects the product within 2 business days to confirm it's in original, unworn condition.",
  },
  {
    icon: CheckCircle,
    step: "4",
    title: "Get your refund",
    description:
      "The refund is issued back to your original payment method within 5–7 business days after inspection is complete.",
  },
]

const faqs = [
  {
    q: "How long do I have to return?",
    a: "You have 30 days from the date of delivery to initiate a return. Items must be unworn, in original packaging, with all tags attached.",
  },
  {
    q: "Can I exchange for a different size?",
    a: "Yes! Simply select \u2018Exchange\u2019 when starting your return. If the size you want is in stock, we\u2019ll ship it immediately after receiving your return. If not, we\u2019ll issue a full refund.",
  },
  {
    q: "Is return shipping free?",
    a: "Return shipping is free for all orders shipped within the EU. For international returns, a small flat fee of €5 applies and is deducted from your refund.",
  },
  {
    q: "What if the item arrived damaged?",
    a: "If your sneakers arrived with a defect or damage, contact us within 48 hours of delivery. We'll arrange a free pick-up and send you a brand-new pair or a full refund — your choice.",
  },
  {
    q: "What items cannot be returned?",
    a: "Worn, washed, or altered items cannot be returned. Customised, personalised, or limited-edition drops are final sale and cannot be returned or exchanged.",
  },
  {
    q: "When will I see the money on my card?",
    a: "After we approve your return, the refund is processed within 5–7 business days. Depending on your bank, it may take 1–3 extra days to appear on your statement.",
  },
]

export default function ReturnsPage() {
  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 lg:px-12 pt-28 pb-10">
        <div className="inline-flex items-center gap-2 text-sm text-primary font-semibold mb-4">
          <RefreshCw className="h-4 w-4" />
          Returns &amp; Refunds
        </div>
        <h1 className="font-display text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
          Hassle-free returns.<br />
          <span className="text-primary">30 days, no drama.</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Changed your mind? Wrong size? No problem. We make returns simple so you can shop with confidence. Most refunds land back in your account within a week.
        </p>

        <div className="mt-6 flex flex-wrap gap-4">
          <div className="flex items-center gap-2 text-sm text-foreground/80 bg-secondary px-4 py-2 rounded-full">
            <Clock className="h-4 w-4 text-primary" />
            30-day return window
          </div>
          <div className="flex items-center gap-2 text-sm text-foreground/80 bg-secondary px-4 py-2 rounded-full">
            <Truck className="h-4 w-4 text-primary" />
            Free return shipping (EU)
          </div>
          <div className="flex items-center gap-2 text-sm text-foreground/80 bg-secondary px-4 py-2 rounded-full">
            <RefreshCw className="h-4 w-4 text-primary" />
            Free size exchanges
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-6 lg:px-12 pb-14">
        <h2 className="font-display text-2xl font-bold text-foreground mb-8">How it works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {steps.map(({ icon: Icon, step, title, description }) => (
            <div
              key={step}
              className="relative flex gap-4 p-6 rounded-2xl border border-border bg-card hover:border-primary/50 hover:shadow-[0_0_24px_rgba(255,115,0,0.12)] transition-all duration-300"
            >
              <div className="shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                  Step {step}
                </span>
                <h3 className="font-semibold text-foreground mt-0.5 mb-1">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link
            href="/account"
            className="inline-flex items-center justify-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors"
          >
            Start a return
            <ChevronRight className="h-4 w-4" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 border border-border text-foreground font-semibold px-6 py-3 rounded-xl hover:border-primary hover:text-primary transition-colors"
          >
            Contact support
          </Link>
        </div>
      </section>

      {/* Return conditions */}
      <section className="max-w-4xl mx-auto px-6 lg:px-12 pb-14">
        <h2 className="font-display text-2xl font-bold text-foreground mb-6">Return conditions</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl border border-green-500/30 bg-green-500/5">
            <p className="text-sm font-semibold text-green-400 mb-3 uppercase tracking-wider">✓ Accepted</p>
            <ul className="space-y-2 text-sm text-foreground/80">
              <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-green-400 shrink-0 mt-0.5" /> Unworn, unmarked soles</li>
              <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-green-400 shrink-0 mt-0.5" /> Original box &amp; packaging intact</li>
              <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-green-400 shrink-0 mt-0.5" /> All tags still attached</li>
              <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-green-400 shrink-0 mt-0.5" /> Returned within 30 days of delivery</li>
              <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-green-400 shrink-0 mt-0.5" /> Defective or incorrectly shipped items (48 h window)</li>
            </ul>
          </div>
          <div className="p-5 rounded-2xl border border-red-500/30 bg-red-500/5">
            <p className="text-sm font-semibold text-red-400 mb-3 uppercase tracking-wider">✗ Not accepted</p>
            <ul className="space-y-2 text-sm text-foreground/80">
              <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" /> Worn or washed sneakers</li>
              <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" /> Missing laces, insoles, or original box</li>
              <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" /> Items returned after 30 days</li>
              <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" /> Personalised or custom orders</li>
              <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" /> Limited-edition &amp; final-sale drops</li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-6 lg:px-12 pb-20">
        <h2 className="font-display text-2xl font-bold text-foreground mb-6">Frequently asked questions</h2>
        <div className="space-y-4">
          {faqs.map(({ q, a }) => (
            <details
              key={q}
              className="group border border-border rounded-2xl overflow-hidden open:border-primary/50 transition-colors duration-200"
            >
              <summary className="flex items-center justify-between cursor-pointer px-6 py-4 font-semibold text-foreground hover:text-primary transition-colors duration-200 list-none gap-4">
                {q}
                <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200 group-open:rotate-90" />
              </summary>
              <p className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed">{a}</p>
            </details>
          ))}
        </div>

        {/* Still have questions */}
        <div className="mt-10 p-6 rounded-2xl bg-card border border-border text-center">
          <p className="text-foreground font-semibold mb-1">Still have questions?</p>
          <p className="text-sm text-muted-foreground mb-4">
            Our support team is available Monday – Friday, 9 am – 6 pm (CET).
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="mailto:official.andrew.buga@gmail.com"
              className="inline-flex items-center justify-center gap-2 bg-primary text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-colors text-sm"
            >
              Email support
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 border border-border text-foreground font-semibold px-5 py-2.5 rounded-xl hover:border-primary hover:text-primary transition-colors text-sm"
            >
              Contact form
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
