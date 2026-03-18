"use client"

import { FormEvent, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Star, ThumbsUp } from "lucide-react"

import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { defaultLocale, getDictionary, Locale } from "@/lib/i18n"

interface Review {
  id: string
  author: string
  rating: number
  date: string
  text: string
  helpful: number
  likedByMe: boolean
  userId: string
}

export default function ProductReviews({ productId, locale = defaultLocale }: { productId: string; locale?: Locale }) {
  const { isAuthenticated } = useAuth()
  const t = getDictionary(locale)
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newRating, setNewRating] = useState(5)
  const [newText, setNewText] = useState("")

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/products/${productId}/reviews`, { credentials: "include" })
        const body = await response.json()
        setReviews(body.reviews ?? [])
      } finally {
        setIsLoading(false)
      }
    }

    void load()
  }, [productId])

  const avgRating = useMemo(() => {
    if (reviews.length === 0) return "0.0"
    const avg = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    return avg.toFixed(1)
  }, [reviews])

  const ratingCounts = useMemo(() => {
    return {
      5: reviews.filter((r) => r.rating === 5).length,
      4: reviews.filter((r) => r.rating === 4).length,
      3: reviews.filter((r) => r.rating === 3).length,
      2: reviews.filter((r) => r.rating === 2).length,
      1: reviews.filter((r) => r.rating === 1).length,
    }
  }, [reviews])

  const handleCreateReview = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!isAuthenticated) return

    const trimmed = newText.trim()
    if (trimmed.length < 10) {
      alert(t.reviews.minLength)
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ rating: newRating, text: trimmed }),
      })

      const body = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(body.error ?? t.reviews.createFailed)
      }

      setReviews((prev) => [body.review, ...prev])
      setNewRating(5)
      setNewText("")
    } catch (error) {
      alert(error instanceof Error ? error.message : t.reviews.createFailed)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLike = async (review: Review) => {
    if (!isAuthenticated) {
      alert(t.reviews.signInToLike)
      return
    }

    const method = review.likedByMe ? "DELETE" : "POST"
    const response = await fetch(`/api/reviews/${review.id}/like`, {
      method,
      credentials: "include",
    })

    if (!response.ok) {
      return
    }

    const body = await response.json()
    setReviews((prev) => prev.map((item) => item.id === review.id ? { ...item, likedByMe: body.likedByMe, helpful: body.helpful } : item))
  }

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24">
      <h2 className="font-display text-4xl lg:text-5xl font-bold text-foreground mb-12">{t.reviews.title}</h2>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
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
            <p className="text-sm text-muted-foreground">{t.reviews.basedOn(reviews.length)}</p>
          </div>

          <div className="mt-8 space-y-3">
            {[5, 4, 3, 2, 1].map((stars) => (
              <div key={stars} className="flex items-center gap-2">
                <span className="text-xs font-medium text-foreground w-6">{stars}*</span>
                <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${reviews.length ? (ratingCounts[stars as keyof typeof ratingCounts] / reviews.length) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-8 text-right">{ratingCounts[stars as keyof typeof ratingCounts]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          {isAuthenticated ? (
            <form onSubmit={handleCreateReview} className="bg-card border border-border rounded-2xl p-6 space-y-4">
              <h3 className="font-semibold text-foreground">{t.reviews.writeReview}</h3>
              <div>
                <p className="text-sm text-foreground mb-2">{t.reviews.rating}</p>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setNewRating(value)}
                      aria-label={`${t.reviews.rating} ${value}`}
                      className="text-primary"
                    >
                      <Star className={`h-5 w-5 ${value <= newRating ? "fill-primary" : ""}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Textarea
                  value={newText}
                  onChange={(event) => setNewText(event.target.value)}
                  placeholder={t.reviews.shareExperience}
                  className="min-h-[120px]"
                />
              </div>
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? t.reviews.posting : t.reviews.postReview}</Button>
            </form>
          ) : (
            <div className="bg-card border border-border rounded-2xl p-6 text-sm text-muted-foreground">
              <p>
                {t.reviews.onlyRegistered} <Link href="/account/login" className="text-primary font-semibold hover:underline">{t.reviews.signIn}</Link>
              </p>
            </div>
          )}

          {isLoading ? (
            <div className="bg-card border border-border rounded-2xl p-6 text-sm text-muted-foreground">{t.reviews.loading}</div>
          ) : reviews.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-6 text-sm text-muted-foreground">{t.reviews.empty} {t.reviews.beFirst}</div>
          ) : (
            reviews.map((review) => (
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
                <button
                  onClick={() => handleLike(review)}
                  className={`text-xs font-medium transition-colors inline-flex items-center gap-2 ${review.likedByMe ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <ThumbsUp className={`h-3.5 w-3.5 ${review.likedByMe ? "fill-primary" : ""}`} /> {t.reviews.helpful(review.helpful)}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
