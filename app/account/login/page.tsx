"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { login, isAuthenticated } = useAuth()
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  if (isAuthenticated) {
    router.push("/account/profile")
    return null
  }

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
      if (!formData.email || !formData.password) {
        throw new Error("Please fill in all fields")
      }

      await login(formData.email, formData.password)
      router.push("/account/profile")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main>
      <Navbar />
      <div className="max-w-md mx-auto px-6 py-24 min-h-screen flex flex-col justify-center">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        <h1 className="font-display text-4xl font-bold text-foreground mb-2">Sign In</h1>
        <p className="text-muted-foreground mb-8">Access your account and order history</p>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
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
            <Link href="/account/forgot-password" className="text-sm text-primary hover:underline">
              Forgot your password?
            </Link>
          </div>

          <Button type="submit" size="lg" className="w-full text-base" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/account/register" className="text-primary hover:underline font-semibold">
            Create one
          </Link>
        </p>
      </div>
      <Footer />
    </main>
  )
}
