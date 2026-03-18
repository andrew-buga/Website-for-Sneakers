import InfoPageLayout from "@/components/info-page-layout"
import { defaultLocale, getDictionary } from "@/lib/i18n"

const locale = defaultLocale
const t = getDictionary(locale)

export default function ContactPage() {
  return (
    <InfoPageLayout title={t.infoPages.contactTitle} subtitle={t.infoPages.contactSubtitle} locale={locale}>
      <p>{t.infoPages.contactPhone}</p>
      <p>{t.infoPages.contactEmail}</p>
      <p>{t.infoPages.contactResponse}</p>
    </InfoPageLayout>
  )
}
