"use client"

import React, { createContext, useContext, useEffect, useMemo, useState } from "react"
import { logError, safeJsonParse } from "@/lib/error-handler"

export interface Address {
  id: string
  name: string
  address: string
  city: string
  zipCode: string
  country: string
  isDefault: boolean
}

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  addresses: Address[]
  defaultAddressId?: string
  emailVerified: boolean
  role: "CUSTOMER" | "ADMIN"
  createdAt: string
}

export interface AuthContextType {
  user: User | null
  isLoading: boolean
  register: (email: string, password: string, name: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  updateProfile: (updates: Partial<User>) => Promise<void>
  addAddress: (address: Omit<Address, "id">) => Promise<void>
  updateAddress: (addressId: string, updates: Partial<Address>) => Promise<void>
  deleteAddress: (addressId: string) => Promise<void>
  setDefaultAddress: (addressId: string) => Promise<void>
  requestPasswordReset: (email: string) => Promise<void>
  resetPassword: (token: string, newPassword: string) => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

async function parseApiResponse(response: Response) {
  const body = await safeJsonParse(response, { context: "parseApiResponse" })
  if (!response.ok) {
    throw new Error(body.error ?? "Request failed")
  }
  return body
}

interface RawUserPayload {
  id: string
  email: string
  name: string
  role: string
  phone?: string
  createdAt: string | number | Date
  addresses?: Address[]
}

function normalizeUser(payload: unknown): User {
  if (!payload || typeof payload !== "object") {
    throw new Error("Invalid user payload")
  }

  const p = payload as Record<string, unknown>
  
  if (typeof p.id !== "string" || typeof p.email !== "string" || typeof p.name !== "string") {
    throw new Error("Missing required user fields")
  }

  // Validate and default role to CUSTOMER if missing or invalid
  let role: "CUSTOMER" | "ADMIN" = "CUSTOMER"
  if (typeof p.role === "string" && (p.role === "CUSTOMER" || p.role === "ADMIN")) {
    role = p.role
  }

  // Validate emailVerified, default to false if missing
  const emailVerified = typeof p.emailVerified === "boolean" ? p.emailVerified : false

  // Optional defaultAddressId
  const defaultAddressId = typeof p.defaultAddressId === "string" ? p.defaultAddressId : undefined

  return {
    id: p.id,
    email: p.email,
    name: p.name,
    role,
    phone: (p.phone as string) || "",
    emailVerified,
    defaultAddressId,
    createdAt: typeof p.createdAt === "string" ? p.createdAt : new Date(p.createdAt as Date).toISOString(),
    addresses: Array.isArray(p.addresses) ? (p.addresses as Address[]) : [],
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadSession = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include",
      })

      if (!response.ok) {
        if (response.status === 401) {
          setUser(null)
        }
        return
      }

      const body = await response.json()
      setUser(body.user ? normalizeUser(body.user) : null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadSession()
  }, [])

  const register = async (email: string, password: string, name: string) => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password, name }),
    })

    // Registration successful — user must verify email before logging in
    await parseApiResponse(response)
  }

  const login = async (email: string, password: string) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    })

    const body = await parseApiResponse(response)

    const meResponse = await fetch("/api/auth/me", {
      method: "GET",
      credentials: "include",
    })

    if (!meResponse.ok) {
      setUser(normalizeUser({ ...body.user, addresses: [] }))
      return
    }

    const meBody = await meResponse.json()
    setUser(meBody.user ? normalizeUser(meBody.user) : normalizeUser({ ...body.user, addresses: [] }))
  }

  const logout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    })

    setUser(null)
  }

  const updateProfile = async (updates: Partial<User>) => {
    const response = await fetch("/api/account/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        name: updates.name,
        phone: updates.phone,
      }),
    })

    const body = await parseApiResponse(response)

    setUser((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        ...body.user,
        addresses: prev.addresses,
        defaultAddressId: prev.defaultAddressId,
      }
    })
  }

  const addAddress = async (address: Omit<Address, "id">) => {
    if (!user) throw new Error("No user logged in")

    const response = await fetch(`/api/users/${user.id}/addresses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        fullName: address.name,
        line1: address.address,
        city: address.city,
        postalCode: address.zipCode,
        country: address.country,
        isDefault: address.isDefault,
      }),
    })

    await parseApiResponse(response)
    await loadSession()
  }

  const updateAddress = async (addressId: string, updates: Partial<Address>) => {
    if (!user) throw new Error("No user logged in")

    const response = await fetch(`/api/users/${user.id}/addresses/${addressId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        fullName: updates.name,
        line1: updates.address,
        city: updates.city,
        postalCode: updates.zipCode,
        country: updates.country,
        isDefault: updates.isDefault,
      }),
    })

    await parseApiResponse(response)
    await loadSession()
  }

  const deleteAddress = async (addressId: string) => {
    if (!user) throw new Error("No user logged in")

    const response = await fetch(`/api/users/${user.id}/addresses/${addressId}`, {
      method: "DELETE",
      credentials: "include",
    })

    await parseApiResponse(response)
    await loadSession()
  }

  const setDefaultAddress = async (addressId: string) => {
    await updateAddress(addressId, { isDefault: true })
  }

  const requestPasswordReset = async (email: string) => {
    const response = await fetch("/api/auth/password-reset/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email }),
    })

    await parseApiResponse(response)
  }

  const resetPassword = async (token: string, newPassword: string) => {
    const response = await fetch("/api/auth/password-reset/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ token, password: newPassword }),
    })

    await parseApiResponse(response)
  }

  const value = useMemo(
    () => ({
      user,
      isLoading,
      register,
      login,
      logout,
      updateProfile,
      addAddress,
      updateAddress,
      deleteAddress,
      setDefaultAddress,
      requestPasswordReset,
      resetPassword,
      isAuthenticated: !!user,
    }),
    [user, isLoading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider")
  }
  return context
}
