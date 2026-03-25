import { notFound } from "next/navigation"
import type { Metadata } from "next"
import type { ReactNode } from "react"
import { isLocale } from "@/lib/i18n"

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: true,
  },
}

export async function generateStaticParams() {
  return [{ locale: "en" }, { locale: "uk" }, { locale: "ru" }]
}

export default async function LocalizedAccountLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!isLocale(locale)) {
    notFound()
  }

  return <>{children}</>
}
