"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

interface WishlistItem {
  id: string;
  name: string;
  imageUrl?: string;
  priceCents?: number;
  currency?: string;
  colors?: string[];
}

interface WishlistContextType {
  items: WishlistItem[];
  addToWishlist: (id: string, name: string) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  addSnapshotToWishlist: (item: WishlistItem) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

// Storage adapter that safely checks if window is available (prevents hydration mismatch)
const StorageAdapter = {
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined') return null
    try {
      return window.localStorage.getItem(key)
    } catch {
      return null
    }
  },
  setItem: (key: string, value: string): void => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(key, value)
    } catch {
      // Silently fail if localStorage is unavailable
    }
  },
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedWishlist = StorageAdapter.getItem("wishlist");
    if (savedWishlist) {
      try {
        const parsed = JSON.parse(savedWishlist);
        if (Array.isArray(parsed)) {
          setItems(parsed.map((item) => ({
            id: String(item.id),
            name: item.name,
            imageUrl: item.imageUrl,
            priceCents: item.priceCents,
            currency: item.currency,
            colors: item.colors,
          })));
        }
      } catch (error) {
        console.error("Failed to load wishlist:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      StorageAdapter.setItem("wishlist", JSON.stringify(items));
    }
  }, [items, mounted]);

  const addToWishlist = (id: string, name: string) => {
    setItems((prev) => {
      const exists = prev.find((item) => item.id === id);
      if (exists) return prev;
      return [...prev, { id, name }];
    });
  };

  const addSnapshotToWishlist = (item: WishlistItem) => {
    setItems((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      if (exists) return prev;
      return [...prev, item];
    });
  };

  const removeFromWishlist = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const isInWishlist = (id: string) => {
    return items.some((item) => item.id === id);
  };

  return (
    <WishlistContext.Provider value={{ items, addToWishlist, removeFromWishlist, isInWishlist, addSnapshotToWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}
