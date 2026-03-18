"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { defaultLocale, getDictionary, Locale } from "@/lib/i18n"

interface FilterProps {
  onFilterChange: (filters: {
    sizes: string[]
    colors: string[]
    priceRange: [number, number]
  }) => void
  locale?: Locale
}

const sizes = ["6", "7", "8", "9", "10", "11", "12", "13"]
const colors = [
  { name: "Black", hex: "#1a1a1a" },
  { name: "White", hex: "#ffffff" },
  { name: "Navy", hex: "#001f3f" },
]

export default function ProductFilters({ onFilterChange, locale = defaultLocale }: FilterProps) {
  const t = getDictionary(locale)
  const [expandedSections, setExpandedSections] = useState({
    size: true,
    color: true,
    price: true,
  })

  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500])

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const handleSizeChange = (size: string) => {
    const newSizes = selectedSizes.includes(size)
      ? selectedSizes.filter((s) => s !== size)
      : [...selectedSizes, size]
    setSelectedSizes(newSizes)
    onFilterChange({ sizes: newSizes, colors: selectedColors, priceRange })
  }

  const handleColorChange = (color: string) => {
    const newColors = selectedColors.includes(color)
      ? selectedColors.filter((c) => c !== color)
      : [...selectedColors, color]
    setSelectedColors(newColors)
    onFilterChange({ sizes: selectedSizes, colors: newColors, priceRange })
  }

  const handlePriceChange = (index: number, value: number) => {
    const newRange: [number, number] = [...priceRange] as [number, number]
    newRange[index] = value
    if (newRange[0] <= newRange[1]) {
      setPriceRange(newRange)
      onFilterChange({ sizes: selectedSizes, colors: selectedColors, priceRange: newRange })
    }
  }

  return (
    <div className="space-y-6">
      {/* Size Filter */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <button
          onClick={() => toggleSection("size")}
          className="flex items-center justify-between w-full text-foreground font-semibold"
        >
          <span>{t.filters.size}</span>
          <ChevronDown
            className={`h-5 w-5 transition-transform ${expandedSections.size ? "rotate-180" : ""}`}
          />
        </button>
        {expandedSections.size && (
          <div className="grid grid-cols-2 gap-3 mt-4">
            {sizes.map((size) => (
              <label key={size} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedSizes.includes(size)}
                  onChange={() => handleSizeChange(size)}
                  className="rounded w-4 h-4"
                />
                <span className="text-sm text-muted-foreground">{size}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Color Filter */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <button
          onClick={() => toggleSection("color")}
          className="flex items-center justify-between w-full text-foreground font-semibold"
        >
          <span>{t.filters.color}</span>
          <ChevronDown
            className={`h-5 w-5 transition-transform ${expandedSections.color ? "rotate-180" : ""}`}
          />
        </button>
        {expandedSections.color && (
          <div className="flex gap-3 mt-4 flex-wrap">
            {colors.map((color) => (
              <button
                key={color.name}
                onClick={() => handleColorChange(color.name)}
                className={`w-10 h-10 rounded-full border-2 transition-all ${
                  selectedColors.includes(color.name) ? "border-primary scale-110" : "border-border hover:border-foreground"
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
          </div>
        )}
      </div>

      {/* Price Filter */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <button
          onClick={() => toggleSection("price")}
          className="flex items-center justify-between w-full text-foreground font-semibold"
        >
          <span>{t.filters.price}</span>
          <ChevronDown
            className={`h-5 w-5 transition-transform ${expandedSections.price ? "rotate-180" : ""}`}
          />
        </button>
        {expandedSections.price && (
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-xs text-muted-foreground">{t.filters.minPrice(priceRange[0])}</label>
              <input
                type="range"
                min="0"
                max="500"
                value={priceRange[0]}
                onChange={(e) => handlePriceChange(0, parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">{t.filters.maxPrice(priceRange[1])}</label>
              <input
                type="range"
                min="0"
                max="500"
                value={priceRange[1]}
                onChange={(e) => handlePriceChange(1, parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <p className="text-sm font-semibold text-foreground">
              {t.filters.range(priceRange[0], priceRange[1])}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}