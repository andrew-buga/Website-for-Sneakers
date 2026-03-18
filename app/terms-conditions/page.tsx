import InfoPageLayout from "@/components/info-page-layout"
import { defaultLocale, getDictionary } from "@/lib/i18n"

const locale = defaultLocale
const t = getDictionary(locale)

export default function TermsConditionsPage() {
  return (
    <InfoPageLayout title={t.infoPages.termsTitle} subtitle={t.infoPages.termsSubtitle} locale={locale}>
      <p>{t.infoPages.termsP1}</p>
      <p>{t.infoPages.termsP2}</p>
      <p>{t.infoPages.termsP3}</p>
      <p>{t.infoPages.termsP4}</p>
    </InfoPageLayout>
  )
}

