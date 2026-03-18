import InfoPageLayout from "@/components/info-page-layout"
import { defaultLocale, getDictionary } from "@/lib/i18n"

const locale = defaultLocale
const t = getDictionary(locale)

export default function AccessoriesPage() {
  return (
    <InfoPageLayout title={t.infoPages.accessoriesTitle} subtitle={t.infoPages.accessoriesSubtitle} locale={locale}>
      <p>{t.infoPages.accessoriesP1}</p>
      <p>{t.infoPages.accessoriesP2}</p>
      <p>{t.infoPages.accessoriesP3}</p>
    </InfoPageLayout>
  )
}

