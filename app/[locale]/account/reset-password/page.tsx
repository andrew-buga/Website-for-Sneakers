"use client"

import { useEffect, useState, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { safeJsonParse, logError } from "@/lib/error-handler"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

function ResetPasswordContent({ locale }: { locale: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const token = searchParams.get("token") || ""
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null)
  const { resetPassword } = useAuth()

  useEffect(() => {
    if (!token) {
      setIsTokenValid(false)
      return
    }

    const validateToken = async () => {
      const response = await fetch(`/api/auth/password-reset/validate?token=${encodeURIComponent(token)}`)
      const body = await safeJsonParse(response, { context: "validateToken", token })
      setIsTokenValid(Boolean(body.valid))
    }

    void validateToken()
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      if (!token) {
        throw new Error("Invalid reset link")
      }

      if (!password || !confirmPassword) {
        throw new Error("Please fill in all fields")
      }

      if (password !== confirmPassword) {
        throw new Error("Passwords do not match")
      }

      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters")
      }

      const hasUppercase = /[A-Z]/.test(password)
      const hasLowercase = /[a-z]/.test(password)
      const hasDigit = /\d/.test(password)
      const hasSpecial = /[^A-Za-z0-9]/.test(password)

      if (!hasUppercase || !hasLowercase || !hasDigit || !hasSpecial) {
        throw new Error("Password must include uppercase, lowercase, number, and special character")
      }

      await resetPassword(token, password)
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Password reset failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-6 py-24 min-h-screen flex flex-col justify-center">
      <Link href={`/${locale}/account/login`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
        <ArrowLeft className="h-4 w-4" />
        Back to Sign In
      </Link>

      {success ? (
        <>
          <h1 className="font-display text-4xl font-bold text-foreground mb-2">Password Reset Successful</h1>
          <p className="text-muted-foreground mb-8">
            Your password has been successfully reset. You can now sign in with your new password.
          </p>

          <Link href={`/${locale}/account/login`}>
            <Button size="lg" className="w-full">
              Sign In
            </Button>
          </Link>
        </>
      ) : isTokenValid === null ? (
        <div className="text-center">
          <p className="text-muted-foreground">Validating reset link...</p>
        </div>
      ) : isTokenValid === false ? (
        <>
          <h1 className="font-display text-4xl font-bold text-foreground mb-2">Invalid or Expired Link</h1>
          <p className="text-muted-foreground mb-8">
            This password reset link is invalid or has expired. Please request a new one.
          </p>

          <Link href={`/${locale}/account/forgot-password`}>
            <Button size="lg" className="w-full">
              Request New Password Reset
            </Button>
          </Link>
        </>
      ) : (
        <>
          <h1 className="font-display text-4xl font-bold text-foreground mb-2">Reset Your Password</h1>
          <p className="text-muted-foreground mb-8">
            Enter your new password below.
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
                placeholder="Enter new password"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Uppercase, lowercase, number, and special character required
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
                placeholder="Confirm new password"
              />
            </div>

            <Button type="submit" size="lg" className="w-full text-base" disabled={isLoading}>
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </>
      )}
    </div>
  )
}

export default function ResetPasswordPage() {
  const pathname = usePathname()
  const [locale, setLocale] = useState<string>("")

  useEffect(() => {
    const extractedLocale = pathname.split("/")[1] || "en"
    setLocale(extractedLocale)
  }, [pathname])

  if (!locale) return null

  return (
    <main>
      <Navbar />
      <Suspense fallback={<div className="min-h-screen" />}>
        <ResetPasswordContent locale={locale} />
      </Suspense>
      <Footer />
    </main>
  )
}
