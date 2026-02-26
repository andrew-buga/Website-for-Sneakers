"use client"

import { useState } from "react"
import Link from "next/link"
import { ShoppingBag, Heart, Menu, X, User } from "lucide-react"
import SearchBar from "./search-bar"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { useWishlist } from "@/lib/wishlist-context"

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { items } = useCart()
  const { isAuthenticated, user } = useAuth()
  const { items: wishlistItems } = useWishlist()

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 lg:px-12">
      {/* Logo */}
      <Link href="/" className="text-2xl font-display font-bold tracking-wider text-foreground">
        NIKE
      </Link>

      {/* Desktop Links */}
      <ul className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
        <li>
          <Link href="/men" className="transition-colors hover:text-foreground">
            Men
          </Link>
        </li>
        <li>
          <Link href="/women" className="transition-colors hover:text-foreground">
            Women
          </Link>
        </li>
        <li>
          <Link href="/collections" className="transition-colors hover:text-foreground">
            Collections
          </Link>
        </li>
        <li>
          <Link href="/trends" className="transition-colors hover:text-foreground">
            Trends
          </Link>
        </li>
      </ul>

      {/* Icons */}
      <div className="flex items-center gap-4" suppressHydrationWarning>
        <SearchBar />
        <Link href="/favorites" aria-label="Wishlist" className="hidden sm:block relative text-muted-foreground hover:text-foreground transition-colors">
          <Heart className="h-5 w-5" />
          <span suppressHydrationWarning className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center" style={{display: wishlistItems.length > 0 ? 'flex' : 'none'}}>
            {wishlistItems.length}
          </span>
        </Link>
        <Link href="/cart" aria-label="Cart" className="relative text-muted-foreground hover:text-foreground transition-colors">
          <ShoppingBag className="h-5 w-5" />
          <span suppressHydrationWarning className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center" style={{display: items.length > 0 ? 'flex' : 'none'}}>
            {items.length}
          </span>
        </Link>
        {isAuthenticated && user ? (
          <Link href="/account/profile" aria-label="Account" className="text-muted-foreground hover:text-foreground transition-colors">
            <User className="h-5 w-5" />
          </Link>
        ) : (
          <Link href="/account/login" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
            Sign In
          </Link>
        )}
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
            <li>
              <Link href="/men" className="block py-2 hover:text-foreground transition-colors">Men</Link>
            </li>
            <li>
              <Link href="/women" className="block py-2 hover:text-foreground transition-colors">Women</Link>
            </li>
            <li>
              <Link href="/collections" className="block py-2 hover:text-foreground transition-colors">Collections</Link>
            </li>
            <li>
              <Link href="/trends" className="block py-2 hover:text-foreground transition-colors">Trends</Link>
            </li>
            <li>
              <Link href="/favorites" className="block py-2 hover:text-foreground transition-colors">Favorites</Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  )
}
