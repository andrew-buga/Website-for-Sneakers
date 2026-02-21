import Image from "next/image"
import { ArrowUpRight } from "lucide-react"

const collections = [
  {
    name: "Winter collection",
    image: "/images/winter-collection.jpg",
  },
  {
    name: "Summer collection",
    image: "/images/summer-collection.jpg",
  },
  {
    name: "Autumn collection",
    image: "/images/autumn-collection.jpg",
  },
]

export default function Collections() {
  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-12" suppressHydrationWarning>
        {/* Section header */}
        <div className="mb-12 lg:mb-16" suppressHydrationWarning>
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary">
            Seasonal
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold uppercase text-foreground mt-2">
            Collections
          </h2>
        </div>

        {/* Collection cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8" suppressHydrationWarning>
          {collections.map((collection) => (
            <a
              key={collection.name}
              href="#"
              className="group relative aspect-[4/5] rounded-2xl overflow-hidden"
            >
              <Image
                src={collection.image || "/placeholder.svg"}
                alt={collection.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" suppressHydrationWarning />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between" suppressHydrationWarning>
                <h3 className="font-display text-xl font-bold uppercase text-foreground">
                  {collection.name}
                </h3>
                <span className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
