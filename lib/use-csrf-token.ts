/**
 * React hook for CSRF token management
 * Automatically fetches new token when component mounts
 */

"use client"

import { useEffect, useState } from "react"

export function useCsrfToken() {
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchToken = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        const response = await fetch("/api/csrf-token", {
          method: "GET",
          credentials: "include",
        })
        
        if (!response.ok) {
          throw new Error(`Failed to fetch CSRF token: ${response.statusText}`)
        }
        
        const data = await response.json()
        setToken(data.token)
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error"
        console.error("CSRF token error:", message)
        setError(message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchToken()
  }, [])

  return { token, isLoading, error }
}

export default useCsrfToken
