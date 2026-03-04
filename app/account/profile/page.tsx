"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth, Address } from "@/lib/auth-context"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowLeft, LogOut, Plus, Edit2, Trash2, Check } from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const { user, logout, updateProfile, addAddress, updateAddress, deleteAddress, setDefaultAddress, isAuthenticated } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isAddingAddress, setIsAddingAddress] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  })
  const [addressForm, setAddressForm] = useState({
    name: "",
    address: "",
    city: "",
    zipCode: "",
    country: "",
    isDefault: false,
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/account/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated || !user) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError("")
  }

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setAddressForm(prev => ({ ...prev, [name]: value }))
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await updateProfile(formData)
      setIsEditing(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      if (!addressForm.name || !addressForm.address || !addressForm.city || !addressForm.zipCode || !addressForm.country) {
        throw new Error("Please fill in all address fields")
      }
      await addAddress(addressForm)
      setAddressForm({ name: "", address: "", city: "", zipCode: "", country: "", isDefault: false })
      setIsAddingAddress(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Add address failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateAddress = async (e: React.FormEvent, addressId: string) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const updatingAddress = user?.addresses.find(a => a.id === addressId)
      if (!updatingAddress) throw new Error("Address not found")

      const updates = addressForm.name ? { name: addressForm.name } : {}
      await updateAddress(addressId, updates)
      setEditingAddressId(null)
      setAddressForm({ name: "", address: "", city: "", zipCode: "", country: "", isDefault: false })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update address failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return
    try {
      await deleteAddress(addressId)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete address failed")
    }
  }

  const handleSetDefaultAddress = async (addressId: string) => {
    try {
      await setDefaultAddress(addressId)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Set default address failed")
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <main>
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 lg:px-12 py-12 min-h-screen">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="font-display text-4xl font-bold text-foreground">My Account</h1>
            <p className="text-muted-foreground mt-2">Manage your profile and addresses</p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Section */}
            <div className="bg-card border border-border rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl font-bold text-foreground">Personal Information</h2>
                {!isEditing && (
                  <Button onClick={() => setIsEditing(true)} variant="outline">
                    Edit
                  </Button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Email (Read-only)</label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full px-4 py-3 border border-border rounded-lg bg-secondary text-muted-foreground opacity-70"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground"
                      placeholder="+1 555 123 4567"
                    />
                  </div>

                  <div className="flex gap-3 pt-6">
                    <Button type="submit" size="lg" disabled={isLoading}>
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="text-lg font-semibold text-foreground">{formData.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="text-lg font-semibold text-foreground">{user.email}</p>
                  </div>
                  {formData.phone && (
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="text-lg font-semibold text-foreground">{formData.phone}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Addresses Section */}
            <div className="bg-card border border-border rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl font-bold text-foreground">Delivery Addresses</h2>
                {!isAddingAddress && (
                  <Button onClick={() => setIsAddingAddress(true)} variant="outline" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Address
                  </Button>
                )}
              </div>

              {/* Add Address Form */}
              {isAddingAddress && (
                <form onSubmit={handleAddAddress} className="mb-6 p-6 bg-secondary rounded-lg space-y-4 border border-border">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Address Name (e.g., Home, Work)</label>
                    <input
                      type="text"
                      name="name"
                      value={addressForm.name}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground"
                      placeholder="Home"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Street Address</label>
                    <input
                      type="text"
                      name="address"
                      value={addressForm.address}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground"
                      placeholder="123 Main St"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">City</label>
                      <input
                        type="text"
                        name="city"
                        value={addressForm.city}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground"
                        placeholder="New York"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">Zip Code</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={addressForm.zipCode}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground"
                        placeholder="10001"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={addressForm.country}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground"
                      placeholder="United States"
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Adding..." : "Add Address"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setIsAddingAddress(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              )}

              {/* Existing Addresses */}
              {user.addresses && user.addresses.length > 0 ? (
                <div className="space-y-3">
                  {user.addresses.map((addr) => (
                    <div key={addr.id} className="p-4 border border-border rounded-lg flex items-start justify-between hover:bg-secondary transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-foreground">{addr.name}</h4>
                          {user.defaultAddressId === addr.id && (
                            <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">Default</span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{addr.address}</p>
                        <p className="text-sm text-muted-foreground">{addr.city}, {addr.zipCode}, {addr.country}</p>
                      </div>
                      <div className="flex gap-2">
                        {user.defaultAddressId !== addr.id && (
                          <button
                            onClick={() => handleSetDefaultAddress(addr.id)}
                            className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors"
                            title="Set as default"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setEditingAddressId(addr.id)
                            setAddressForm({ name: addr.name, address: addr.address, city: addr.city, zipCode: addr.zipCode, country: addr.country, isDefault: addr.isDefault })
                          }}
                          className="p-2 hover:bg-secondary text-muted-foreground rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="p-2 hover:bg-red-500/10 text-red-600 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No addresses added yet. Add one to get started.</p>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-card border border-border rounded-2xl p-8 h-fit">
            <h3 className="font-display text-lg font-bold text-foreground mb-4">Quick Links</h3>
            <Link href="/account/orders" className="block w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-center font-semibold mb-3">
              View Orders
            </Link>
            <Link href="/cart" className="block w-full px-4 py-3 border border-border text-foreground rounded-lg hover:bg-secondary transition-colors text-center font-semibold">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
