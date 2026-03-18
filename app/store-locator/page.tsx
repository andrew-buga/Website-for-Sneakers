import InfoPageLayout from "@/components/info-page-layout"
import { defaultLocale, getDictionary } from "@/lib/i18n"

const locale = defaultLocale
const t = getDictionary(locale)

export default function StoreLocatorPage() {
  return (
    <InfoPageLayout title={t.infoPages.storeTitle} subtitle={t.infoPages.storeSubtitle} locale={locale}>
      <p>{t.infoPages.storeP1}</p>
      <p>{t.infoPages.storeP2}</p>
      <p>{t.infoPages.storeP3}</p>
      <p>{t.infoPages.storeP4}</p>
    </InfoPageLayout>
  )
}
