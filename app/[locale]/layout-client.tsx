"use client"

import React, { ReactNode } from "react"
import { ErrorBoundary } from "@/lib/error-boundary"
import { useLocalePreference } from "@/lib/use-locale-preference"

interface LocaleLayoutClientProps {
  children: ReactNode
}

export function LocaleLayoutClient({ children }: LocaleLayoutClientProps) {
  // Redirect to preferred locale if saved preference differs from current URL locale
  useLocalePreference()

  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  )
}
