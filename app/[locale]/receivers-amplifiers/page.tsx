import { notFound } from "next/navigation"

import InfoPageLayout from "@/components/info-page-layout"
import { getDictionary, isLocale } from "@/lib/i18n"

export default function LocalizedReceiversPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) {
    notFound()
  }

  const locale = params.locale
  const t = getDictionary(locale)

  return (
    <InfoPageLayout title={t.infoPages.receiversTitle} subtitle={t.infoPages.receiversSubtitle} locale={locale}>
      <p>{t.infoPages.receiversP1}</p>
      <p>{t.infoPages.receiversP2}</p>
      <p>{t.infoPages.receiversP3}</p>
    </InfoPageLayout>
  )
}
