import { notFound } from "next/navigation"

import InfoPageLayout from "@/components/info-page-layout"
import { getDictionary, isLocale } from "@/lib/i18n"

export default function LocalizedTermsConditionsPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) {
    notFound()
  }

  const locale = params.locale
  const t = getDictionary(locale)

  return (
    <InfoPageLayout title={t.infoPages.termsTitle} subtitle={t.infoPages.termsSubtitle} locale={locale}>
      <p>{t.infoPages.termsP1}</p>
      <p>{t.infoPages.termsP2}</p>
      <p>{t.infoPages.termsP3}</p>
      <p>{t.infoPages.termsP4}</p>
    </InfoPageLayout>
  )
}
