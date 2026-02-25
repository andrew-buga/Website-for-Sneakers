"use client"

import { Star } from "lucide-react"

interface Review {
  id: number
  author: string
  rating: number
  date: string
  text: string
  helpful: number
}

const mockReviews: Review[] = [
  {
    id: 1,
    author: "Michael Chen",
    rating: 5,
    date: "2024-02-15",
    text: "Absolutely love these sneakers! The comfort is unmatched, and they look great with any outfit. Wore them for 8 hours straight at the mall and no foot pain whatsoever. Definitely worth every penny.",
    helpful: 245,
  },
  {
    id: 2,
    author: "Sarah Johnson",
    rating: 4,
    date: "2024-02-10",
    text: "Great quality and very comfortable. My only complaint is that they run a bit small, so I'd recommend going half a size up. Other than that, perfect shoes for everyday wear.",
    helpful: 189,
  },
  {
    id: 3,
    author: "David Rodriguez",
    rating: 5,
    date: "2024-02-05",
    text: "Best purchase I've made this year! The design is fire and the cushioning is incredible. I've worn them to the gym and for casual outings - they're versatile and durable.",
    helpful: 312,
  },
  {
    id: 4,
    author: "Emma Williams",
    rating: 4,
    date: "2024-01-28",
    text: "Very happy with my purchase. The color is exactly as shown in the photos. Shipping was fast too. Only minor issue is the box came slightly damaged, but the shoes were perfect.",
    helpful: 156,
  },
  {
    id: 5,
    author: "James Patterson",
    rating: 5,
    date: "2024-01-20",
    text: "I've owned these shoes for a month now and they're still looking brand new. The build quality is exceptional. Highly recommend to anyone looking for premium sneakers.",
    helpful: 278,
  },
]

export default function ProductReviews() {
  const avgRating = (mockReviews.reduce((sum, r) => sum + r.rating, 0) / mockReviews.length).toFixed(1)
  const ratingCounts = {
    5: mockReviews.filter((r) => r.rating === 5).length,
    4: mockReviews.filter((r) => r.rating === 4).length,
    3: mockReviews.filter((r) => r.rating === 3).length,
    2: mockReviews.filter((r) => r.rating === 2).length,
    1: mockReviews.filter((r) => r.rating === 1).length,
  }

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24">
      <h2 className="font-display text-4xl lg:text-5xl font-bold text-foreground mb-12">Customer Reviews</h2>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
        {/* Rating Summary */}
        <div className="lg:col-span-1 bg-card border border-border rounded-2xl p-8">
          <div className="text-center">
            <div className="text-5xl font-bold text-primary mb-2">{avgRating}</div>
            <div className="flex justify-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(parseFloat(avgRating)) ? "fill-primary text-primary" : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">Based on {mockReviews.length} reviews</p>
          </div>

          {/* Rating Breakdown */}
          <div className="mt-8 space-y-3">
            {[5, 4, 3, 2, 1].map((stars) => (
              <div key={stars} className="flex items-center gap-2">
                <span className="text-xs font-medium text-foreground w-6">{stars}★</span>
                <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${(ratingCounts[stars as keyof typeof ratingCounts] / mockReviews.length) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-8 text-right">{ratingCounts[stars as keyof typeof ratingCounts]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-3 space-y-6">
          {mockReviews.map((review) => (
            <div key={review.id} className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-foreground">{review.author}</p>
                  <p className="text-xs text-muted-foreground">{new Date(review.date).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < review.rating ? "fill-primary text-primary" : "text-muted-foreground"}`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-foreground leading-relaxed mb-4">{review.text}</p>
              <button className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                👍 Helpful ({review.helpful})
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}