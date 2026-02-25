"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

interface WishlistItem {
  id: number
  name: string
}

interface WishlistContextType {
  items: WishlistItem[]
  addToWishlist: (id: number, name: string) => void
  removeFromWishlist: (id: number) => void
  isInWishlist: (id: number) => boolean
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedWishlist = localStorage.getItem("wishlist")
    if (savedWishlist) {
      try {
        setItems(JSON.parse(savedWishlist))
      } catch (error) {
        console.error("Failed to load wishlist:", error)
      }
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("wishlist", JSON.stringify(items))
    }
  }, [items, mounted])

  const addToWishlist = (id: number, name: string) => {
    setItems((prev) => {
      const exists = prev.find((item) => item.id === id)
      if (exists) return prev
      return [...prev, { id, name }]
    })
  }

  const removeFromWishlist = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const isInWishlist = (id: number) => {
    return items.some((item) => item.id === id)
  }

  return (
    <WishlistContext.Provider value={{ items, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}