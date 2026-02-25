"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error("Failed to load user:", error)
      }
    }
    setIsLoading(false)
  }, [])

  const register = async (email: string, password: string, name: string) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    if (users.some((u: any) => u.email === email)) {
      throw new Error("Email already registered")
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      addresses: [],
      emailVerified: false,
      createdAt: new Date().toISOString(),
    }

    const hashedPassword = btoa(password)
    users.push({ ...newUser, password: hashedPassword })
    localStorage.setItem("users", JSON.stringify(users))
    localStorage.setItem("user", JSON.stringify(newUser))
    setUser(newUser)
  }

  const login = async (email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const userRecord = users.find((u: any) => u.email === email)

    if (!userRecord) {
      throw new Error("User not found")
    }

    const hashedPassword = btoa(password)
    if (userRecord.password !== hashedPassword) {
      throw new Error("Invalid password")
    }

    const { password: _, ...userWithoutPassword } = userRecord
    localStorage.setItem("user", JSON.stringify(userWithoutPassword))
    setUser(userWithoutPassword)
  }

  const logout = () => {
    localStorage.removeItem("user")
    setUser(null)
  }

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) throw new Error("No user logged in")

    const updatedUser = { ...user, ...updates }
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const userIndex = users.findIndex((u: any) => u.id === user.id)

    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates }
      localStorage.setItem("users", JSON.stringify(users))
    }

    localStorage.setItem("user", JSON.stringify(updatedUser))
    setUser(updatedUser)
  }

  const addAddress = async (addressData: Omit<Address, "id">) => {
    if (!user) throw new Error("No user logged in")

    const newAddress: Address = {
      id: Math.random().toString(36).substr(2, 9),
      ...addressData,
    }

    const updatedAddresses = [...user.addresses, newAddress]
    const updatedUser = { ...user, addresses: updatedAddresses }

    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const userIndex = users.findIndex((u: any) => u.id === user.id)
    if (userIndex !== -1) {
      users[userIndex].addresses = updatedAddresses
      localStorage.setItem("users", JSON.stringify(users))
    }

    localStorage.setItem("user", JSON.stringify(updatedUser))
    setUser(updatedUser)
  }

  const updateAddress = async (addressId: string, updates: Partial<Address>) => {
    if (!user) throw new Error("No user logged in")

    const updatedAddresses = user.addresses.map(addr =>
      addr.id === addressId ? { ...addr, ...updates } : addr
    )
    const updatedUser = { ...user, addresses: updatedAddresses }

    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const userIndex = users.findIndex((u: any) => u.id === user.id)
    if (userIndex !== -1) {
      users[userIndex].addresses = updatedAddresses
      localStorage.setItem("users", JSON.stringify(users))
    }

    localStorage.setItem("user", JSON.stringify(updatedUser))
    setUser(updatedUser)
  }

  const deleteAddress = async (addressId: string) => {
    if (!user) throw new Error("No user logged in")

    const updatedAddresses = user.addresses.filter(addr => addr.id !== addressId)
    const updatedUser = {
      ...user,
      addresses: updatedAddresses,
      defaultAddressId: user.defaultAddressId === addressId ? undefined : user.defaultAddressId,
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const userIndex = users.findIndex((u: any) => u.id === user.id)
    if (userIndex !== -1) {
      users[userIndex].addresses = updatedAddresses
      if (users[userIndex].defaultAddressId === addressId) {
        users[userIndex].defaultAddressId = undefined
      }
      localStorage.setItem("users", JSON.stringify(users))
    }

    localStorage.setItem("user", JSON.stringify(updatedUser))
    setUser(updatedUser)
  }

  const setDefaultAddress = async (addressId: string) => {
    if (!user) throw new Error("No user logged in")

    const updatedUser = { ...user, defaultAddressId: addressId }

    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const userIndex = users.findIndex((u: any) => u.id === user.id)
    if (userIndex !== -1) {
      users[userIndex].defaultAddressId = addressId
      localStorage.setItem("users", JSON.stringify(users))
    }

    localStorage.setItem("user", JSON.stringify(updatedUser))
    setUser(updatedUser)
  }

  const requestPasswordReset = async (email: string) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const userRecord = users.find((u: any) => u.email === email)

    if (!userRecord) {
      throw new Error("Email not found")
    }

    const token = Math.random().toString(36).substr(2, 20)
    const expiresAt = Date.now() + 3600000 // 1 hour

    let resetTokens = JSON.parse(localStorage.getItem("resetTokens") || "{}")
    resetTokens[token] = { email, expiresAt }
    localStorage.setItem("resetTokens", JSON.stringify(resetTokens))

    // In production, send email with reset link
    console.log(`Password reset token: ${token}`)
  }

  const resetPassword = async (token: string, newPassword: string) => {
    let resetTokens = JSON.parse(localStorage.getItem("resetTokens") || "{}")

    if (!resetTokens[token]) {
      throw new Error("Invalid or expired reset token")
    }

    const { email, expiresAt } = resetTokens[token]
    if (Date.now() > expiresAt) {
      delete resetTokens[token]
      localStorage.setItem("resetTokens", JSON.stringify(resetTokens))
      throw new Error("Reset token has expired")
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const userIndex = users.findIndex((u: any) => u.email === email)

    if (userIndex !== -1) {
      const hashedPassword = btoa(newPassword)
      users[userIndex].password = hashedPassword
      localStorage.setItem("users", JSON.stringify(users))
    }

    delete resetTokens[token]
    localStorage.setItem("resetTokens", JSON.stringify(resetTokens))
  }

  return (
    <AuthContext.Provider
      value={{
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
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
