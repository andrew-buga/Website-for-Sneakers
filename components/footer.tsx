import Link from "next/link"
import { defaultLocale, getDictionary, Locale, withLocaleHref } from "@/lib/i18n"

export default function Footer({ locale = defaultLocale }: { locale?: Locale }) {
  const t = getDictionary(locale)

  return (
    <footer className="bg-background border-t border-border py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <span className="text-2xl font-display font-bold tracking-wider text-foreground">
              STREATER
            </span>
            <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
              {t.footer.description}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              {t.footer.helpInfo}
            </h4>
            <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
              <li>
                <Link href={withLocaleHref(locale, "/returns")} className="hover:text-foreground transition-colors">
                  {t.footer.returnsRefunds}
                </Link>
              </li>
              <li>
                <Link href={withLocaleHref(locale, "/help-center")} className="hover:text-foreground transition-colors">
                  {t.footer.helpCenter}
                </Link>
              </li>
              <li>
                <Link href={withLocaleHref(locale, "/terms-conditions")} className="hover:text-foreground transition-colors">
                  {t.footer.termsConditions}
                </Link>
              </li>
              <li>
                <Link href={withLocaleHref(locale, "/store-locator")} className="hover:text-foreground transition-colors">
                  {t.footer.storeLocator}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              {t.footer.aboutUs}
            </h4>
            <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
              <li>
                <Link href={withLocaleHref(locale, "/accessories")} className="hover:text-foreground transition-colors">
                  {t.footer.accessories}
                </Link>
              </li>
              <li>
                <Link href={withLocaleHref(locale, "/privacy-policy")} className="hover:text-foreground transition-colors">
                  {t.footer.privacyPolicy}
                </Link>
              </li>
              <li>
                <Link href={withLocaleHref(locale, "/terms-of-use")} className="hover:text-foreground transition-colors">
                  {t.footer.termsOfUse}
                </Link>
              </li>
              <li>
                <Link href={withLocaleHref(locale, "/receivers-amplifiers")} className="hover:text-foreground transition-colors">
                  {t.footer.receiversAmplifiers}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              {t.footer.contact}
            </h4>
            <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
              <li><a href="tel:+40740116669" className="hover:text-foreground transition-colors">+40 740 116 669</a></li>
              <li><a href="mailto:official.andrew.buga@gmail.com" className="hover:text-foreground transition-colors">official.andrew.buga@gmail.com</a></li>
              <li><Link href={withLocaleHref(locale, "/contact")} className="hover:text-foreground transition-colors">{t.footer.contactPage}</Link></li>
            </ul>
            <div className="mt-6">
              <span className="text-xs font-semibold text-muted-foreground">{t.footer.portfolioLabel}</span>
              <div className="flex gap-4 mt-2">
                <a href="https://github.com/andrew-buga" target="_blank" rel="noreferrer" className="text-sm text-primary font-semibold underline underline-offset-4 hover:decoration-wavy transition">GitHub</a>
                <a href="https://www.behance.net/andrewbuga" target="_blank" rel="noreferrer" className="text-sm text-primary font-semibold underline underline-offset-4 hover:decoration-wavy transition">Behance</a>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            {t.footer.builtFor}
          </p>
          <p className="text-xs text-muted-foreground">
            {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  )
}
