"use client"

import { useState } from "react"
import { Search, ShoppingBag, Heart, Menu, X } from "lucide-react"

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 lg:px-12">
      {/* Logo */}
      <a href="#" className="text-2xl font-display font-bold tracking-wider text-foreground">
        NIKE
      </a>

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
      <div className="flex items-center gap-4">
        <button type="button" aria-label="Search" className="text-muted-foreground hover:text-foreground transition-colors">
          <Search className="h-5 w-5" />
        </button>
        <button type="button" aria-label="Wishlist" className="hidden sm:block text-muted-foreground hover:text-foreground transition-colors">
          <Heart className="h-5 w-5" />
        </button>
        <button type="button" aria-label="Cart" className="text-muted-foreground hover:text-foreground transition-colors">
          <ShoppingBag className="h-5 w-5" />
        </button>
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
