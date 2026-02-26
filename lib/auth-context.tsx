"use client"

import React, { createContext, useContext, useEffect, useMemo, useState } from "react"

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
  const body = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(body.error ?? "Request failed")
  }
  return body
}

function normalizeUser(payload: any): User {
  return {
    ...payload,
    createdAt: typeof payload.createdAt === "string" ? payload.createdAt : new Date(payload.createdAt).toISOString(),
    addresses: payload.addresses ?? [],
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
        setUser(null)
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

    const body = await parseApiResponse(response)
    setUser(normalizeUser({ ...body.user, addresses: [] }))
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

  const requestPasswordReset = async (_email: string) => {
    throw new Error("Password reset flow is not implemented yet")
  }

  const resetPassword = async (_token: string, _newPassword: string) => {
    throw new Error("Password reset flow is not implemented yet")
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
