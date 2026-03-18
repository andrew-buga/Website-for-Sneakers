import { notFound } from "next/navigation"

import InfoPageLayout from "@/components/info-page-layout"
import { getDictionary, isLocale } from "@/lib/i18n"

export default function LocalizedAccessoriesPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) {
    notFound()
  }

  const locale = params.locale
  const t = getDictionary(locale)

  return (
    <InfoPageLayout title={t.infoPages.accessoriesTitle} subtitle={t.infoPages.accessoriesSubtitle} locale={locale}>
      <p>{t.infoPages.accessoriesP1}</p>
      <p>{t.infoPages.accessoriesP2}</p>
      <p>{t.infoPages.accessoriesP3}</p>
    </InfoPageLayout>
  )
}
