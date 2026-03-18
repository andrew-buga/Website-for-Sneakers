import InfoPageLayout from "@/components/info-page-layout"
import { defaultLocale, getDictionary } from "@/lib/i18n"

const locale = defaultLocale
const t = getDictionary(locale)

export default function PaginationHelpPage() {
  return (
    <InfoPageLayout title={t.infoPages.paginationTitle} subtitle={t.infoPages.paginationSubtitle} locale={locale}>
      <p>{t.infoPages.paginationP1}</p>
      <p>{t.infoPages.paginationP2}</p>
      <p>{t.infoPages.paginationP3}</p>
      <p>{t.infoPages.paginationP4}</p>
    </InfoPageLayout>
  )
}
