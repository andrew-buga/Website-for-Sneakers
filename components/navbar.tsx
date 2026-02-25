"use client"

import { useState } from "react"
import Link from "next/link"
import { ShoppingBag, Heart, Menu, X, User } from "lucide-react"
import SearchBar from "./search-bar"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { items } = useCart()
  const { isAuthenticated, user } = useAuth()

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 lg:px-12">
      {/* Logo */}
      <Link href="/" className="text-2xl font-display font-bold tracking-wider text-foreground">
        NIKE
      </Link>

      {/* Desktop Links */}
      <ul className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
        <li>
          <a href="#" className="transition-colors hover:text-foreground">
            Men
          </a>
        </li>
        <li>
          <a href="#" className="transition-colors hover:text-foreground">
            Women
          </a>
        </li>
        <li>
          <a href="#" className="transition-colors hover:text-foreground">
            Collections
          </a>
        </li>
        <li>
          <a href="#" className="transition-colors hover:text-foreground">
            Trends
          </a>
        </li>
        <li>
          <a href="#" className="transition-colors hover:text-foreground">
            Sneakers
          </a>
        </li>
      </ul>

      {/* Icons */}
      <div className="flex items-center gap-4" suppressHydrationWarning>
        <SearchBar />
        <button type="button" aria-label="Wishlist" className="hidden sm:block text-muted-foreground hover:text-foreground transition-colors">
          <Heart className="h-5 w-5" />
        </button>
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
              <a href="#" className="block py-2 hover:text-foreground transition-colors">Men</a>
            </li>
            <li>
              <a href="#" className="block py-2 hover:text-foreground transition-colors">Women</a>
            </li>
            <li>
              <a href="#" className="block py-2 hover:text-foreground transition-colors">Collections</a>
            </li>
            <li>
              <a href="#" className="block py-2 hover:text-foreground transition-colors">Trends</a>
            </li>
            <li>
              <a href="#" className="block py-2 hover:text-foreground transition-colors">Sneakers</a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  )
}
