import { notFound } from "next/navigation"

import InfoPageLayout from "@/components/info-page-layout"
import { getDictionary, isLocale } from "@/lib/i18n"

export default function LocalizedPaginationPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) {
    notFound()
  }

  const locale = params.locale
  const t = getDictionary(locale)

  return (
    <InfoPageLayout title={t.infoPages.paginationTitle} subtitle={t.infoPages.paginationSubtitle} locale={locale}>
      <p>{t.infoPages.paginationP1}</p>
      <p>{t.infoPages.paginationP2}</p>
      <p>{t.infoPages.paginationP3}</p>
      <p>{t.infoPages.paginationP4}</p>
    </InfoPageLayout>
  )
}
