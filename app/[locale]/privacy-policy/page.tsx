import { notFound } from "next/navigation"

import InfoPageLayout from "@/components/info-page-layout"
import { getDictionary, isLocale } from "@/lib/i18n"

export default function LocalizedPrivacyPolicyPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) {
    notFound()
  }

  const locale = params.locale
  const t = getDictionary(locale)

  return (
    <InfoPageLayout title={t.infoPages.privacyTitle} subtitle={t.infoPages.privacySubtitle} locale={locale}>
      <p>{t.infoPages.privacyP1}</p>
      <p>{t.infoPages.privacyP2}</p>
      <p>{t.infoPages.privacyP3}</p>
      <p>{t.infoPages.privacyP4}</p>
    </InfoPageLayout>
  )
}
