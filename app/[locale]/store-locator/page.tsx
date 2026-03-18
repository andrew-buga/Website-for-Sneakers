import { notFound } from "next/navigation"

import InfoPageLayout from "@/components/info-page-layout"
import { getDictionary, isLocale } from "@/lib/i18n"

export default function LocalizedStoreLocatorPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) {
    notFound()
  }

  const locale = params.locale
  const t = getDictionary(locale)

  return (
    <InfoPageLayout title={t.infoPages.storeTitle} subtitle={t.infoPages.storeSubtitle} locale={locale}>
      <p>{t.infoPages.storeP1}</p>
      <p>{t.infoPages.storeP2}</p>
      <p>{t.infoPages.storeP3}</p>
      <p>{t.infoPages.storeP4}</p>
    </InfoPageLayout>
  )
}
