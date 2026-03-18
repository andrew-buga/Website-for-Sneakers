import { notFound } from "next/navigation"

import InfoPageLayout from "@/components/info-page-layout"
import { getDictionary, isLocale } from "@/lib/i18n"

export default async function LocalizedContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  if (!isLocale(locale)) {
    notFound()
  }
  const t = getDictionary(locale)

  return (
    <InfoPageLayout title={t.infoPages.contactTitle} subtitle={t.infoPages.contactSubtitle} locale={locale}>
      <p>{t.infoPages.contactPhone}</p>
      <p>{t.infoPages.contactEmail}</p>
      <p>{t.infoPages.contactResponse}</p>
    </InfoPageLayout>
  )
}
