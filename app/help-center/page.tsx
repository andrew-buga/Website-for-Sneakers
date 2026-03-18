import Link from "next/link"
import InfoPageLayout from "@/components/info-page-layout"
import { defaultLocale, getDictionary, withLocaleHref } from "@/lib/i18n"

const locale = defaultLocale
const t = getDictionary(locale)

export default function HelpCenterPage() {
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
