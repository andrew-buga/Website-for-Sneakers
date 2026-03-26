"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const pathname = usePathname()
  const { requestPasswordReset } = useAuth()
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [locale, setLocale] = useState<string>("")
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    const extractedLocale = pathname.split("/")[1] || "en"
    setLocale(extractedLocale)
    setIsMounted(true)
  }, [pathname])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      if (!email) {
        throw new Error("Please enter your email address")
      }

      await requestPasswordReset(email)
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reset request failed")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isMounted) return null

  return (
    <main>
      <Navbar />
      <div className="max-w-md mx-auto px-6 py-24 min-h-screen flex flex-col justify-center">
        <Link href={`/${locale}/account/login`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to Sign In
        </Link>

        {success ? (
          <>
            <h1 className="font-display text-4xl font-bold text-foreground mb-2">Check Your Email</h1>
            <p className="text-muted-foreground mb-8">
              We've sent password reset instructions to {email}. Please check your email and follow the link to reset your password.
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              For security, this link will expire in 1 hour.
            </p>

            <Link href={`/${locale}/account/login`}>
              <Button size="lg" className="w-full">
                Back to Sign In
              </Button>
            </Link>
          </>
        ) : (
          <>
            <h1 className="font-display text-4xl font-bold text-foreground mb-2">Forgot Password?</h1>
            <p className="text-muted-foreground mb-8">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
                  placeholder="john@example.com"
                />
              </div>

              <Button type="submit" size="lg" className="w-full text-base" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              Remember your password?{" "}
              <Link href={`/${locale}/account/login`} className="text-primary hover:underline font-semibold">
                Sign in
              </Link>
            </p>
          </>
        )}
      </div>
      <Footer />
    </main>
  )
}
