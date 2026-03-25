import type { ReactNode } from "react"

import { locales } from "@/lib/i18n"
import { LocaleLayoutClient } from "./layout-client"

export const dynamicParams = true

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default function LocaleLayout({ children }: { children: ReactNode }) {
  return (
    <LocaleLayoutClient>
      {children}
    </LocaleLayoutClient>
  )
}
