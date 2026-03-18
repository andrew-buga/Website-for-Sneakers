import InfoPageLayout from "@/components/info-page-layout"
import { defaultLocale, getDictionary } from "@/lib/i18n"

const locale = defaultLocale
const t = getDictionary(locale)

export default function PrivacyPolicyPage() {
  return (
    <InfoPageLayout title={t.infoPages.privacyTitle} subtitle={t.infoPages.privacySubtitle} locale={locale}>
      <p>{t.infoPages.privacyP1}</p>
      <p>{t.infoPages.privacyP2}</p>
      <p>{t.infoPages.privacyP3}</p>
      <p>{t.infoPages.privacyP4}</p>
    </InfoPageLayout>
  )
}

