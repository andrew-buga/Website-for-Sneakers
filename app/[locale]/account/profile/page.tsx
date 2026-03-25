"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useAuth, Address } from "@/lib/auth-context"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowLeft, LogOut, Plus, Edit2, Trash2, Check } from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout, updateProfile, addAddress, updateAddress, deleteAddress, setDefaultAddress, isAuthenticated } = useAuth()
  const [locale, setLocale] = useState<string>("")
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
    const extractedLocale = pathname.split("/")[1] || "en"
    setLocale(extractedLocale)
  }, [pathname])

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(`/${locale}/account/login`)
    }
  }, [isAuthenticated, router, locale])

  useEffect(() => {
    setFormData({
      name: user?.name || "",
      phone: user?.phone || "",
    })
  }, [user])

  if (!isAuthenticated || !user || !locale) return null

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
    setError("")
    setIsLoading(true)

    try {
      await deleteAddress(addressId)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete address failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSetDefault = async (addressId: string) => {
    setError("")
    setIsLoading(true)

    try {
      await setDefaultAddress(addressId)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Set default address failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    router.push(`/${locale}/account/login`)
  }

  return (
    <main>
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 lg:px-12 py-12 min-h-screen">
        <Link href={locale === "en" ? "/" : `/${locale}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <div className="flex justify-between items-center mb-8">
          <h1 className="font-display text-4xl font-bold text-foreground">My Account</h1>
          <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 text-sm">{error}</div>}

        {/* Profile Section */}
        <div className="bg-card border rounded-xl p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-foreground">Profile Information</h2>
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(!isEditing)} className="gap-2">
              <Edit2 className="h-4 w-4" />
              {isEditing ? "Cancel" : "Edit"}
            </Button>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:border-primary"
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          ) : (
            <div className="space-y-2">
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground">Name:</span> {user.name}
              </p>
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground">Email:</span> {user.email}
              </p>
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground">Phone:</span> {user.phone || "Not set"}
              </p>
            </div>
          )}
        </div>

        {/* Addresses Section */}
        <div className="bg-card border rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-foreground">Addresses</h2>
            {!isAddingAddress && (
              <Button size="sm" onClick={() => setIsAddingAddress(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Address
              </Button>
            )}
          </div>

          {isAddingAddress && (
            <form onSubmit={handleAddAddress} className="bg-muted p-4 rounded-lg mb-4 space-y-4 border">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={addressForm.name}
                  onChange={handleAddressChange}
                  placeholder="e.g., Home, Office"
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Address</label>
                <input
                  type="text"
                  name="address"
                  value={addressForm.address}
                  onChange={handleAddressChange}
                  placeholder="Street address"
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:border-primary"
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
                    placeholder="City"
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">ZIP Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={addressForm.zipCode}
                    onChange={handleAddressChange}
                    placeholder="ZIP Code"
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:border-primary"
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
                  placeholder="Country"
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:border-primary"
                />
              </div>
              <div className="flex gap-3">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Adding..." : "Add"}
                </Button>
                <Button type="button" variant="outline" onClick={() => { setIsAddingAddress(false); setAddressForm({ name: "", address: "", city: "", zipCode: "", country: "", isDefault: false }); }}>
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {user.addresses?.length === 0 ? (
            <p className="text-muted-foreground">No addresses added yet.</p>
          ) : (
            <div className="space-y-4">
              {user.addresses?.map(address => (
                <div key={address.id} className="border rounded-lg p-4 relative">
                  {address.isDefault && (
                    <div className="absolute top-2 right-2 bg-green-500/20 text-green-700 text-xs px-2 py-1 rounded flex items-center gap-1">
                      <Check className="h-3 w-3" /> Default
                    </div>
                  )}
                  <p className="font-semibold">{address.name}</p>
                  <p className="text-sm text-muted-foreground">{address.address}</p>
                  <p className="text-sm text-muted-foreground">{address.city}, {address.zipCode}</p>
                  <p className="text-sm text-muted-foreground">{address.country}</p>
                  <div className="mt-3 flex gap-2">
                    {!address.isDefault && (
                      <Button size="sm" variant="outline" onClick={() => handleSetDefault(address.id)} className="gap-2">
                        <Check className="h-3 w-3" />
                        Set as Default
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        if (window.confirm("Delete this address?")) {
                          handleDeleteAddress(address.id)
                        }
                      }}
                      className="gap-2"
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Link href={`/${locale}/account/orders`} className="mt-8">
          <Button variant="outline" size="lg" className="gap-2">
            View Order History
          </Button>
        </Link>
      </div>
      <Footer />
    </main>
  )
}
