"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { isValidEmail, validatePassword } from "@/lib/validation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const pathname = usePathname()
  const { register, isAuthenticated } = useAuth()
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [locale, setLocale] = useState<string>("")

  useEffect(() => {
    const extractedLocale = pathname.split("/")[1] || "en"
    setLocale(extractedLocale)
  }, [pathname])

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
      // Trim inputs
      const trimmedName = formData.name.trim()
      const trimmedEmail = formData.email.trim()
      const trimmedPassword = formData.password.trim()
      const trimmedConfirmPassword = formData.confirmPassword.trim()

      // Validate required fields
      if (!trimmedName || !trimmedEmail || !trimmedPassword || !trimmedConfirmPassword) {
        throw new Error("Please fill in all fields")
      }

      // Validate email format
      if (!isValidEmail(trimmedEmail)) {
        throw new Error("Please enter a valid email address")
      }

      // Validate password match
      if (trimmedPassword !== trimmedConfirmPassword) {
        throw new Error("Passwords do not match")
      }

      // Validate password strength using centralized validation
      const passwordValidation = validatePassword(trimmedPassword)
      if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.errors.join(", "))
      }

      // Validate name length
      if (trimmedName.length < 2) {
        throw new Error("Full name must be at least 2 characters")
      }

      if (trimmedName.length > 100) {
        throw new Error("Full name must not exceed 100 characters")
      }

      await register(trimmedEmail, trimmedPassword, trimmedName)
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed")
    } finally {
      setIsLoading(false)
    }
  }

  if (!locale) return null

  return (
    <main>
      <Navbar />
      <div className="max-w-md mx-auto px-6 py-24 min-h-screen flex flex-col justify-center">
        <Link href={locale === "en" ? "/" : `/${locale}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        {success ? (
          <>
            <h1 className="font-display text-4xl font-bold text-foreground mb-2">Check Your Email</h1>
            <p className="text-muted-foreground mb-8">
              We've sent a verification link to your email. Please check your inbox and follow the link to activate your account.
            </p>
            <Link href={`/${locale}/account/login`}>
              <Button size="lg" className="w-full">
                Back to Sign In
              </Button>
            </Link>
          </>
        ) : (
          <>
            <h1 className="font-display text-4xl font-bold text-foreground mb-2">Create Account</h1>
            <p className="text-muted-foreground mb-8">Sign up to start shopping and track your orders</p>
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
                  placeholder="John Doe"
                />
              </div>

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
                <p className="text-xs text-muted-foreground mt-2">
                  Uppercase, lowercase, number, and special character required
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
                  placeholder="Confirm your password"
                />
              </div>

              <Button type="submit" size="lg" className="w-full text-base" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
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
