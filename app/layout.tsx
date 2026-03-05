import React from "react"
import type { Metadata } from 'next'
import { Inter, Oswald } from 'next/font/google'
import { CartProvider } from '@/lib/cart-context'
import { WishlistProvider } from '@/lib/wishlist-context'
import { AuthProvider } from '@/lib/auth-context'

import './globals.css'

const _inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const _oswald = Oswald({ subsets: ['latin'], variable: '--font-oswald' })

export const metadata: Metadata = {
  title: 'Nike Sneakers - New Collection',
  description: 'Discover the latest Nike sneakers. Easy. Airy. Universal.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${_inter.variable} ${_oswald.variable} font-sans antialiased`} suppressHydrationWarning><AuthProvider><CartProvider><WishlistProvider>{children}</WishlistProvider></CartProvider></AuthProvider></body>
    </html>
  )
}
