import { notFound } from "next/navigation"

import InfoPageLayout from "@/components/info-page-layout"
import { getDictionary, isLocale } from "@/lib/i18n"

export default function LocalizedContactPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) {
    notFound()
  }

  const locale = params.locale
  const t = getDictionary(locale)

  return (
    <InfoPageLayout title={t.infoPages.contactTitle} subtitle={t.infoPages.contactSubtitle} locale={locale}>
      <p>{t.infoPages.contactPhone}</p>
      <p>{t.infoPages.contactEmail}</p>
      <p>{t.infoPages.contactResponse}</p>
    </InfoPageLayout>
  )
}
