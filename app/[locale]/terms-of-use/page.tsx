import { notFound } from "next/navigation"

import InfoPageLayout from "@/components/info-page-layout"
import { getDictionary, isLocale } from "@/lib/i18n"

export default function LocalizedTermsOfUsePage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) {
    notFound()
  }

  const locale = params.locale
  const t = getDictionary(locale)

  return (
    <InfoPageLayout title={t.infoPages.useTitle} subtitle={t.infoPages.useSubtitle} locale={locale}>
      <p>{t.infoPages.useP1}</p>
      <p>{t.infoPages.useP2}</p>
      <p>{t.infoPages.useP3}</p>
      <p>{t.infoPages.useP4}</p>
    </InfoPageLayout>
  )
}
