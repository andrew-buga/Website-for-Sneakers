import Link from "next/link"
import { notFound } from "next/navigation"

import InfoPageLayout from "@/components/info-page-layout"
import { getDictionary, isLocale, withLocaleHref } from "@/lib/i18n"

export default function LocalizedHelpCenterPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) {
    notFound()
  }

  const locale = params.locale
  const t = getDictionary(locale)

  return (
    <InfoPageLayout title={t.infoPages.helpTitle} subtitle={t.infoPages.helpSubtitle} locale={locale}>
      <p>{t.infoPages.helpP1}</p>
      <p>{t.infoPages.helpP2}</p>
      <p>{t.infoPages.helpP3}</p>
      <p>
        {t.infoPages.helpP4Prefix}
        <Link href={withLocaleHref(locale, "/contact")} className="text-primary underline underline-offset-4">
          {t.infoPages.helpP4Link}
        </Link>
        {t.infoPages.helpP4Suffix}
      </p>
      <p>
        {t.infoPages.helpPaginationPrefix}
        <Link href={withLocaleHref(locale, "/help/pagination")} className="text-primary underline underline-offset-4">
          {t.infoPages.helpPaginationLink}
        </Link>
        {t.infoPages.helpPaginationSuffix}
      </p>
    </InfoPageLayout>
  )
}
