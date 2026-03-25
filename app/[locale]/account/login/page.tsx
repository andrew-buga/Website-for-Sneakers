"use client"

import { useEffect, useState, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { isValidEmail } from "@/lib/validation"
import { useCsrfToken } from "@/lib/use-csrf-token"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle, AlertCircle } from "lucide-react"
import { stripLocale } from "@/lib/i18n"

function LoginContent({ locale }: { locale: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, isAuthenticated } = useAuth()
  const { token: csrfToken } = useCsrfToken()
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const verified = searchParams.get("verified") === "true"
  const paramError = searchParams.get("error")

  const paramErrorMessage =
    paramError === "invalid-token"
      ? "The verification link is invalid. Please try again."
      : paramError === "token-expired"
      ? "The verification link has expired. Please register again or contact support."
      : paramError === "server-error"
      ? "A server error occurred. Please try again later."
      : null

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(`/${locale}/account/profile`)
    }
  }, [isAuthenticated, router, locale])

  if (isAuthenticated) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Validate inputs
      const trimmedEmail = formData.email.trim()
      const trimmedPassword = formData.password.trim()

      if (!trimmedEmail || !trimmedPassword) {
        throw new Error("Please fill in all fields")
      }

      if (!isValidEmail(trimmedEmail)) {
        throw new Error("Please enter a valid email address")
      }

      if (trimmedPassword.length < 6) {
        throw new Error("Password must be at least 6 characters")
      }

      // Make direct API call with CSRF token
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      }
      
      if (csrfToken) {
        headers["x-csrf-token"] = csrfToken
      }

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify({
          email: trimmedEmail,
          password: trimmedPassword,
        }),
      })

      const data = await response.json().catch(() => ({}))
      
      if (!response.ok) {
        throw new Error(data.error ?? "Login failed")
      }

      // Authentication successful, redirect to profile
      router.push(`/${locale}/account/profile`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-6 py-24 min-h-screen flex flex-col justify-center">
      <Link href={locale === "en" ? "/" : `/${locale}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>

      <h1 className="font-display text-4xl font-bold text-foreground mb-2">Sign In</h1>
      <p className="text-muted-foreground mb-8">Access your account and order history</p>

      {verified && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
          <p className="text-green-700 text-sm font-medium">Email verified successfully! You can now sign in.</p>
        </div>
      )}

      {paramErrorMessage && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
          <p className="text-red-600 text-sm">{paramErrorMessage}</p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        {/* CSRF token field */}
        {csrfToken && (
          <input
            type="hidden"
            name="csrf_token"
            value={csrfToken}
          />
        )}

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
            placeholder="john@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
            placeholder="Enter your password"
          />
        </div>

        <div className="text-right">
          <Link href={`/${locale}/account/forgot-password`} className="text-sm text-primary hover:underline">
            Forgot your password?
          </Link>
        </div>

        <Button type="submit" size="lg" className="w-full text-base" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link href={`/${locale}/account/register`} className="text-primary hover:underline font-semibold">
          Create one
        </Link>
      </p>
    </div>
  )
}

export default function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const [locale, setLocale] = useState<string>("")
  const pathname = usePathname()

  useEffect(() => {
    // Extract locale from pathname or params
    const extractedLocale = pathname.split("/")[1] || "en"
    setLocale(extractedLocale)
  }, [pathname])

  if (!locale) return null

  return (
    <main>
      <Navbar />
      <Suspense fallback={<div className="min-h-screen" />}>
        <LoginContent locale={locale} />
      </Suspense>
      <Footer />
    </main>
  )
}
