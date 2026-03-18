import InfoPageLayout from "@/components/info-page-layout"
import { defaultLocale, getDictionary } from "@/lib/i18n"

const locale = defaultLocale
const t = getDictionary(locale)

export default function TermsOfUsePage() {
  return (
    <InfoPageLayout title={t.infoPages.useTitle} subtitle={t.infoPages.useSubtitle} locale={locale}>
      <p>{t.infoPages.useP1}</p>
      <p>{t.infoPages.useP2}</p>
      <p>{t.infoPages.useP3}</p>
      <p>{t.infoPages.useP4}</p>
    </InfoPageLayout>
  )
}

