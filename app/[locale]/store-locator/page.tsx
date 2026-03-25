import { notFound } from "next/navigation"

import InfoPageLayout from "@/components/info-page-layout"
import { getDictionary, isLocale } from "@/lib/i18n"

export default async function LocalizedStoreLocatorPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  if (!isLocale(locale)) {
    notFound()
  }
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
