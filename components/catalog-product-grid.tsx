import Image from "next/image"
import Link from "next/link"

import { CatalogProduct, formatPrice } from "@/lib/catalog"

export default function CatalogProductGrid({ products }: { products: CatalogProduct[] }) {
  if (products.length === 0) {
    return <p className="text-muted-foreground text-center py-20">No products found.</p>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {products.map((product) => (
        <Link key={product.id} href={`/product/${product.id}`} className="group relative rounded-2xl overflow-hidden bg-card border border-border">
          <div className="relative aspect-square overflow-hidden bg-secondary">
            <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-95 transition-transform duration-500" />
          </div>
          <div className="p-5">
            <h3 className="font-display text-lg font-semibold text-foreground">{product.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{product.colorShown}</p>
            <div className="flex items-center justify-between mt-3">
              <span className="text-primary font-bold">{formatPrice(product.price)}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
