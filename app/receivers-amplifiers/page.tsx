import InfoPageLayout from "@/components/info-page-layout"
import { defaultLocale, getDictionary } from "@/lib/i18n"

const locale = defaultLocale
const t = getDictionary(locale)

export default function ReceiversAmplifiersPage() {
  return (
    <InfoPageLayout title={t.infoPages.receiversTitle} subtitle={t.infoPages.receiversSubtitle} locale={locale}>
      <p>{t.infoPages.receiversP1}</p>
      <p>{t.infoPages.receiversP2}</p>
      <p>{t.infoPages.receiversP3}</p>
    </InfoPageLayout>
  )
}

