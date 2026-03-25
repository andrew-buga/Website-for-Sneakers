"use client"

import React, { ReactNode } from "react"
import { ErrorBoundary } from "@/lib/error-boundary"

interface LocaleLayoutClientProps {
  children: ReactNode
}

export function LocaleLayoutClient({ children }: LocaleLayoutClientProps) {
  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  )
}
