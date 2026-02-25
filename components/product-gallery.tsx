"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface GalleryProps {
  images: string[]
  productName: string
}

export default function ProductGallery({ images, productName }: GalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const goNext = () => {
    setSelectedIndex((prev) => (prev + 1) % images.length)
  }

  const goPrev = () => {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  if (!images || images.length === 0) {
    return (
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-secondary flex items-center justify-center">
        <p className="text-muted-foreground">No images available</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-secondary">
        <Image
          src={images[selectedIndex]}
          alt={`${productName} - View ${selectedIndex + 1}`}
          fill
          className="object-cover"
          priority
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={goPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur flex items-center justify-center text-foreground hover:bg-background transition-all z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={goNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur flex items-center justify-center text-foreground hover:bg-background transition-all z-10"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur px-3 py-1 rounded-full text-xs font-medium text-foreground">
            {selectedIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Grid */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                selectedIndex === index ? "border-primary" : "border-border hover:border-foreground"
              }`}
            >
              <Image
                src={image}
                alt={`${productName} thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}