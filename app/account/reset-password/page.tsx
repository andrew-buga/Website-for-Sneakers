"use client"

import { useState, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const token = searchParams.get("token") || ""
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { resetPassword } = useAuth()

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

      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters")
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
      <Link href="/account/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
        <ArrowLeft className="h-4 w-4" />
        Back to Sign In
      </Link>

      {success ? (
        <>
          <h1 className="font-display text-4xl font-bold text-foreground mb-2">Password Reset Successful</h1>
          <p className="text-muted-foreground mb-8">
            Your password has been successfully reset. You can now sign in with your new password.
          </p>

          <Link href="/account/login">
            <Button size="lg" className="w-full">
              Sign In
            </Button>
          </Link>
        </>
      ) : (
        <>
          <h1 className="font-display text-4xl font-bold text-foreground mb-2">Reset Password</h1>
          <p className="text-muted-foreground mb-8">
            Enter your new password below. Make sure it's at least 6 characters long and different from your old password.
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
                placeholder="At least 6 characters"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
                placeholder="Confirm your new password"
              />
            </div>

            <Button type="submit" size="lg" className="w-full text-base" disabled={isLoading}>
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Remember your password?{" "}
            <Link href="/account/login" className="text-primary hover:underline font-semibold">
              Sign in
            </Link>
          </p>
        </>
      )}
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <main>
      <Navbar />
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
        <ResetPasswordContent />
      </Suspense>
      <Footer />
    </main>
  )
}
