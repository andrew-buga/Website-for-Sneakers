"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, X } from "lucide-react"

const allProducts = [
  { id: 1, name: "Nike Air Max Plus III", price: "$180", image: "/images/product-1.jpg", collection: "summer" },
  { id: 2, name: "Nike Air Max Plus III", price: "$180", image: "/images/product-2.jpg", collection: "summer" },
  { id: 3, name: "Nike Air Max Plus III", price: "$180", image: "/images/product-3.jpg", collection: "summer" },
]

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<typeof allProducts>([])

  const handleSearch = (value: string) => {
    setQuery(value)
    if (value.trim()) {
      const filtered = allProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(value.toLowerCase()) ||
          product.collection.toLowerCase().includes(value.toLowerCase())
      )
      setResults(filtered)
    } else {
      setResults([])
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Search"
      >
        <Search className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="absolute inset-x-0 top-full mt-4 w-96 bg-card border border-border rounded-2xl shadow-2xl z-50">
          {/* Search Input */}
          <div className="relative p-4 border-b border-border">
            <input
              type="text"
              placeholder="Search products..."
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full bg-secondary text-foreground placeholder:text-muted-foreground rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            />
            <button
              onClick={() => {
                setIsOpen(false)
                setQuery("")
                setResults([])
              }}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto">
            {results.length > 0 ? (
              <div className="space-y-2 p-4">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    onClick={() => {
                      setIsOpen(false)
                      setQuery("")
                      setResults([])
                    }}
                    className="flex gap-3 items-center p-3 rounded-lg hover:bg-secondary transition-colors"
                  >
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-secondary">
                      <Image src={product.image} alt={product.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{product.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{product.collection}</p>
                    </div>
                    <p className="text-sm font-semibold text-primary">{product.price}</p>
                  </Link>
                ))}
              </div>
            ) : query ? (
              <div className="p-8 text-center">
                <p className="text-muted-foreground text-sm">No products found for \"{query}\"</p>
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-muted-foreground text-sm">Start typing to search...</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Overlay to close search */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsOpen(false)
            setQuery("")
            setResults([])
          }}
        />
      )}
    </div>
  )
}