"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingBag, Heart, Menu, X, User } from "lucide-react"
import SearchBar from "./search-bar"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { useWishlist } from "@/lib/wishlist-context"

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const { items } = useCart()
  const { isAuthenticated, user } = useAuth()
  const { items: wishlistItems } = useWishlist()

  const navItems = [
    { label: "Men", href: "/men", match: (path: string) => path === "/men" },
    { label: "Women", href: "/women", match: (path: string) => path === "/women" },
    {
      label: "Collections",
      href: "/collections",
      match: (path: string) => path === "/collections" || path.startsWith("/collection/"),
    },
    { label: "Trends", href: "/trends", match: (path: string) => path === "/trends" },
  ]

  const getNavClassName = (active: boolean) =>
    active ? "transition-colors text-foreground" : "transition-colors hover:text-foreground"

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 lg:px-12">
      {/* Logo */}
      <Link href="/" className="text-2xl font-display font-bold tracking-wider text-foreground">
        NIKE
      </Link>

      {/* Desktop Links */}
      <ul className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
        {navItems.map((item) => {
          const active = item.match(pathname)
          return (
            <li key={item.label}>
              <Link href={item.href} className={getNavClassName(active)}>
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>

      {/* Icons */}
      <div className="flex items-center gap-4" suppressHydrationWarning>
        <SearchBar />
        <Link href="/favorites" aria-label="Wishlist" className={`hidden sm:block relative transition-colors ${pathname === "/favorites" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
          <Heart className="h-5 w-5" />
          <span suppressHydrationWarning className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center" style={{display: wishlistItems.length > 0 ? 'flex' : 'none'}}>
            {wishlistItems.length}
          </span>
        </Link>
        <Link href="/cart" aria-label="Cart" className={`relative transition-colors ${pathname === "/cart" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
          <ShoppingBag className="h-5 w-5" />
          <span suppressHydrationWarning className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center" style={{display: items.length > 0 ? 'flex' : 'none'}}>
            {items.length}
          </span>
        </Link>
        <Link href={isAuthenticated && user ? "/account/profile" : "/account/login"} aria-label="Account" className="text-muted-foreground hover:text-foreground transition-colors">
          <User className="h-5 w-5" />
        </Link>
        {!isAuthenticated ? (
          <Link href="/account/login" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
            Sign In
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
              const active = item.match(pathname)
              return (
                <li key={item.label}>
                  <Link href={item.href} className={`block py-2 transition-colors ${active ? "text-foreground" : "hover:text-foreground"}`} onClick={() => setMobileOpen(false)}>
                    {item.label}
                  </Link>
                </li>
              )
            })}
            <li>
              <Link href="/favorites" className={`block py-2 transition-colors ${pathname === "/favorites" ? "text-foreground" : "hover:text-foreground"}`} onClick={() => setMobileOpen(false)}>Favorites</Link>
            </li>
            <li>
              <Link
                href={isAuthenticated && user ? "/account/profile" : "/account/login"}
                className={`block py-2 transition-colors ${pathname.startsWith("/account") ? "text-foreground" : "hover:text-foreground"}`}
                onClick={() => setMobileOpen(false)}
              >
                {isAuthenticated && user ? "My account" : "Sign in"}
              </Link>
            </li>
            {!isAuthenticated ? (
              <li>
                <Link href="/account/register" className="block py-2 transition-colors hover:text-foreground" onClick={() => setMobileOpen(false)}>
                  Register
                </Link>
              </li>
            ) : null}
          </ul>
        </div>
      )}
    </nav>
  )
}
