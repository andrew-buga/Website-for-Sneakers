import type { Metadata } from "next"
import Navbar from "@/components/navbar"
import { defaultLocale, getDictionary, withLocaleHref } from "@/lib/i18n"

const locale = defaultLocale
const t = getDictionary(locale)
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sneakerportfolio.me"
import Footer from "@/components/footer"
import Link from "next/link"
  title: `${t.returns.title} | Streater Sneakers`,
  description: t.returns.description,
  alternates: { canonical: `${siteUrl}/returns` },
  keywords: ["returns", "refunds", "exchange", "sneaker return policy", "Streater returns"],
  description:
const steps = t.returns.steps
const faqs = t.returns.faqs
    a: "After we approve your return, the refund is processed within 5–7 business days. Depending on your bank, it may take 1–3 extra days to appear on your statement.",
  },
]

export default function ReturnsPage() {
  return (
    <main>
      <Navbar locale={locale} />

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 lg:px-12 pt-28 pb-10">
        <div className="inline-flex items-center gap-2 text-sm text-primary font-semibold mb-4">
          <RefreshCw className="h-4 w-4" />
          {t.returns.title}
        </div>
        <h1 className="font-display text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
          {t.returns.heroTitleLine1}<br />
          <span className="text-primary">{t.returns.heroTitleLine2}</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          {t.returns.heroDescription}
        </p>

        <div className="mt-6 flex flex-wrap gap-4">
          <div className="flex items-center gap-2 text-sm text-foreground/80 bg-secondary px-4 py-2 rounded-full">
            <Clock className="h-4 w-4 text-primary" />
            {t.returns.badgeReturnWindow}
          </div>
          <div className="flex items-center gap-2 text-sm text-foreground/80 bg-secondary px-4 py-2 rounded-full">
            <Truck className="h-4 w-4 text-primary" />
            {t.returns.badgeFreeShipping}
          </div>
          <div className="flex items-center gap-2 text-sm text-foreground/80 bg-secondary px-4 py-2 rounded-full">
            <RefreshCw className="h-4 w-4 text-primary" />
            {t.returns.badgeFreeExchange}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-6 lg:px-12 pb-14">
        <h2 className="font-display text-2xl font-bold text-foreground mb-8">{t.returns.howItWorks}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {steps.map(({ step, title, description }, index) => {
            const Icon = [Package, Truck, RefreshCw, CheckCircle][index] ?? Package
            return (
            <div
              key={step}
              className="relative flex gap-4 p-6 rounded-2xl border border-border bg-card hover:border-primary/50 hover:shadow-[0_0_24px_rgba(255,115,0,0.12)] transition-all duration-300"
            >
              <div className="shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                  {t.returns.stepLabel} {step}
                </span>
                <h3 className="font-semibold text-foreground mt-0.5 mb-1">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </div>
            </div>
          )})}
        </div>

        {/* CTA */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link
            href="/account"
            className="inline-flex items-center justify-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors"
          >
            {t.returns.startReturn}
            <ChevronRight className="h-4 w-4" />
          </Link>
          <Link
            href={withLocaleHref(locale, "/contact")}
            className="inline-flex items-center justify-center gap-2 border border-border text-foreground font-semibold px-6 py-3 rounded-xl hover:border-primary hover:text-primary transition-colors"
          >
            {t.returns.contactSupport}
          </Link>
        </div>
      </section>

      {/* Return conditions */}
      <section className="max-w-4xl mx-auto px-6 lg:px-12 pb-14">
        <h2 className="font-display text-2xl font-bold text-foreground mb-6">{t.returns.conditionsTitle}</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl border border-green-500/30 bg-green-500/5">
            <p className="text-sm font-semibold text-green-400 mb-3 uppercase tracking-wider">{t.returns.acceptedTitle}</p>
            <ul className="space-y-2 text-sm text-foreground/80">
              {t.returns.accepted.map((item) => (
                <li key={item} className="flex gap-2"><CheckCircle className="h-4 w-4 text-green-400 shrink-0 mt-0.5" /> {item}</li>
              ))}
            </ul>
          </div>
          <div className="p-5 rounded-2xl border border-red-500/30 bg-red-500/5">
            <p className="text-sm font-semibold text-red-400 mb-3 uppercase tracking-wider">{t.returns.notAcceptedTitle}</p>
            <ul className="space-y-2 text-sm text-foreground/80">
              {t.returns.notAccepted.map((item) => (
                <li key={item} className="flex gap-2"><AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" /> {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-6 lg:px-12 pb-20">
        <h2 className="font-display text-2xl font-bold text-foreground mb-6">{t.returns.faqTitle}</h2>
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
            <p className="text-foreground font-semibold mb-1">{t.returns.stillQuestions}</p>
          <p className="text-sm text-muted-foreground mb-4">
              {t.returns.stillQuestionsBody}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="mailto:official.andrew.buga@gmail.com"
              className="inline-flex items-center justify-center gap-2 bg-primary text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-colors text-sm"
            >
                {t.returns.emailSupport}
            </a>
            <Link
                href={withLocaleHref(locale, "/contact")}
              className="inline-flex items-center justify-center gap-2 border border-border text-foreground font-semibold px-5 py-2.5 rounded-xl hover:border-primary hover:text-primary transition-colors text-sm"
            >
                {t.returns.contactForm}
            </Link>
          </div>
        </div>
      </section>

        <Footer locale={locale} />
    </main>
  )
}
