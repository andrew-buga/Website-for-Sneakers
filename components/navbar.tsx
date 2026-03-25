"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingBag, Heart, Menu, X, User } from "lucide-react"
import SearchBar from "./search-bar"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { useWishlist } from "@/lib/wishlist-context"
import { defaultLocale, getDictionary, getPathLocale, Locale, stripLocale, switchLocaleHref, withLocaleHref } from "@/lib/i18n"

export default function Navbar({ locale = defaultLocale }: { locale?: Locale }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const activeLocale = getPathLocale(pathname) ?? locale
  const t = getDictionary(activeLocale)
  const normalizedPath = stripLocale(pathname)
  const { items } = useCart()
  const { isAuthenticated, user } = useAuth()
  const { items: wishlistItems } = useWishlist()

  const navItems = [
    { label: t.nav.men, href: "/men", match: (path: string) => path === "/men" },
    { label: t.nav.women, href: "/women", match: (path: string) => path === "/women" },
    {
      label: t.nav.collections,
      href: "/collections",
      match: (path: string) => path === "/collections" || path.startsWith("/collection/"),
    },
    { label: t.nav.trends, href: "/trends", match: (path: string) => path === "/trends" },
  ]

  const getNavClassName = (active: boolean) =>
    active ? "transition-colors text-foreground" : "transition-colors hover:text-foreground"

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 lg:px-12">
      {/* Logo */}
      <Link href={withLocaleHref(activeLocale, "/")} className="text-2xl font-display font-bold tracking-wider text-foreground">
        Streater
      </Link>

      {/* Desktop Links */}
      <ul className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
        {navItems.map((item) => {
          const active = item.match(normalizedPath)
          return (
            <li key={item.label}>
              <Link href={withLocaleHref(activeLocale, item.href)} className={getNavClassName(active)}>
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>

      {/* Icons */}
      <div className="flex items-center gap-4" suppressHydrationWarning>
        <div className="hidden sm:flex items-center rounded-full border border-border bg-background/60 backdrop-blur px-2 py-1 text-xs font-semibold text-muted-foreground">
          {["en", "uk", "ru"].map((lang) => (
            <Link
              key={lang}
              href={switchLocaleHref(lang as Locale, pathname)}
              className={`px-2 py-1 rounded-full transition-colors ${activeLocale === lang ? "bg-primary text-primary-foreground" : "hover:text-foreground"}`}
              aria-label={`${t.switcher.label}: ${lang.toUpperCase()}`}
            >
              {t.switcher[lang as "en" | "uk" | "ru"]}
            </Link>
          ))}
        </div>
        <SearchBar locale={activeLocale} />
        <Link href={withLocaleHref(activeLocale, "/favorites")} aria-label="Wishlist" className={`hidden sm:block relative transition-colors ${normalizedPath === "/favorites" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
          <Heart className="h-5 w-5" />
          <span suppressHydrationWarning className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center" style={{display: wishlistItems.length > 0 ? 'flex' : 'none'}}>
            {wishlistItems.length}
          </span>
        </Link>
        <Link href={withLocaleHref(activeLocale, "/cart")} aria-label="Cart" className={`relative transition-colors ${normalizedPath === "/cart" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
          <ShoppingBag className="h-5 w-5" />
          <span suppressHydrationWarning className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center" style={{display: items.length > 0 ? 'flex' : 'none'}}>
            {items.length}
          </span>
        </Link>
        <Link href={isAuthenticated && user ? "/account/profile" : "/account/login"} aria-label={t.nav.account} className="text-muted-foreground hover:text-foreground transition-colors">
          <User className="h-5 w-5" />
        </Link>
        {!isAuthenticated ? (
          <Link href="/account/login" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
            {t.nav.signIn}
          </Link>
        ) : null}
        <button
          type="button"
          aria-label="Menu"
          className="md:hidden text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md border-b border-border md:hidden">
          <ul className="flex flex-col px-6 py-4 gap-4 text-sm font-medium text-muted-foreground">
            {navItems.map((item) => {
              const active = item.match(normalizedPath)
              return (
                <li key={item.label}>
                  <Link href={withLocaleHref(activeLocale, item.href)} className={`block py-2 transition-colors ${active ? "text-foreground" : "hover:text-foreground"}`} onClick={() => setMobileOpen(false)}>
                    {item.label}
                  </Link>
                </li>
              )
            })}
            <li>
              <Link href={withLocaleHref(activeLocale, "/favorites")} className={`block py-2 transition-colors ${normalizedPath === "/favorites" ? "text-foreground" : "hover:text-foreground"}`} onClick={() => setMobileOpen(false)}>{t.nav.favorites}</Link>
            </li>
            <li>
              <Link
                href={isAuthenticated && user ? "/account/profile" : "/account/login"}
                className={`block py-2 transition-colors ${normalizedPath.startsWith("/account") ? "text-foreground" : "hover:text-foreground"}`}
                onClick={() => setMobileOpen(false)}
              >
                {isAuthenticated && user ? t.nav.myAccount : t.nav.signIn}
              </Link>
            </li>
            {!isAuthenticated ? (
              <li>
                <Link href="/account/register" className="block py-2 transition-colors hover:text-foreground" onClick={() => setMobileOpen(false)}>
                  {t.nav.register}
                </Link>
              </li>
            ) : null}
            <li className="pt-2 border-t border-border">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                {t.switcher.label}
              </div>
              <div className="flex items-center gap-2 mt-2">
                {["en", "uk", "ru"].map((lang) => (
                  <Link
                    key={lang}
                    href={switchLocaleHref(lang as Locale, pathname)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border border-border ${activeLocale === lang ? "bg-primary text-primary-foreground border-primary" : "hover:text-foreground"}`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {t.switcher[lang as "en" | "uk" | "ru"]}
                  </Link>
                ))}
              </div>
            </li>
          </ul>
        </div>
      )}
    </nav>
  )
}
