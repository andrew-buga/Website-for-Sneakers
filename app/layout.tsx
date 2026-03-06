import React from "react"
import type { Metadata } from 'next'
import { CartProvider } from '@/lib/cart-context'
import { WishlistProvider } from '@/lib/wishlist-context'
import { AuthProvider } from '@/lib/auth-context'

import './globals.css'

export const metadata: Metadata = {
  title: 'Streater Sneakers - New Collection',
  description: 'Discover the latest Streater sneakers. Easy. Airy. Universal.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning><AuthProvider><CartProvider><WishlistProvider>{children}</WishlistProvider></CartProvider></AuthProvider></body>
    </html>
  )
}
