/**
 * Centralized input validation and sanitization
 * Prevents injection attacks and invalid data
 */

/**
 * Validate email format
 */
export function isValidEmail(email: unknown): email is string {
  if (typeof email !== "string") return false
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 254
}

/**
 * Validate password strength (consistent with backend)
 */
export interface PasswordValidation {
  isValid: boolean
  errors: string[]
}

export function validatePassword(password: unknown): PasswordValidation {
  const errors: string[] = []

  if (typeof password !== "string") {
    return { isValid: false, errors: ["Password must be a string"] }
  }

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters")
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain uppercase letter")
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain lowercase letter")
  }

  if (!/\d/.test(password)) {
    errors.push("Password must contain number")
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push("Password must contain special character")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Sanitize string input (remove potential XSS vectors)
 */
export function sanitizeString(input: unknown): string {
  if (typeof input !== "string") {
    return ""
  }

  return input
    .replace(/[<>]/g, "") // Remove angle brackets
    .trim()
    .slice(0, 500) // Limit length
}

/**
 * Validate URL format
 */
export function isValidUrl(url: unknown): url is string {
  if (typeof url !== "string") return false
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Validate SKU format (alphanumeric, hyphens, underscores)
 */
export function isValidSKU(sku: unknown): sku is string {
  if (typeof sku !== "string") return false
  return /^[A-Z0-9_-]{3,50}$/.test(sku.toUpperCase())
}

/**
 * Parse and validate price
 */
export function parsePrice(price: unknown): number | null {
  if (typeof price === "number") {
    return price >= 0 ? price : null
  }

  if (typeof price === "string") {
    const cleaned = price.replace(/[^0-9.]/g, "")
    const parsed = parseFloat(cleaned)
    return !isNaN(parsed) && parsed >= 0 ? parsed : null
  }

  return null
}

/**
 * Validate product quantity
 */
export function parseQuantity(qty: unknown): number | null {
  if (typeof qty === "number") {
    return Number.isInteger(qty) && qty > 0 ? qty : null
  }

  if (typeof qty === "string") {
    const parsed = parseInt(qty, 10)
    return !isNaN(parsed) && parsed > 0 ? parsed : null
  }

  return null
}

/**
 * Validate UUID format
 */
export function isValidUUID(uuid: unknown): uuid is string {
  if (typeof uuid !== "string") return false
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

/**
 * Validate address object
 */
export interface Address {
  id?: string
  name: string
  address: string
  city: string
  zipCode: string
  country: string
  isDefault?: boolean
}

export function isValidAddress(addr: unknown): addr is Address {
  if (!addr || typeof addr !== "object") return false

  const a = addr as Record<string, unknown>
  return (
    typeof a.name === "string" &&
    a.name.length > 0 &&
    a.name.length <= 100 &&
    typeof a.address === "string" &&
    a.address.length > 0 &&
    a.address.length <= 255 &&
    typeof a.city === "string" &&
    a.city.length > 0 &&
    a.city.length <= 100 &&
    typeof a.zipCode === "string" &&
    a.zipCode.length > 0 &&
    a.zipCode.length <= 20 &&
    typeof a.country === "string" &&
    a.country.length > 0 &&
    a.country.length <= 100
  )
}

/**
 * Validate address with detailed error messages
 */
export interface AddressValidation {
  isValid: boolean
  errors: Record<string, string>
}

export function validateAddress(addr: unknown): AddressValidation {
  const errors: Record<string, string> = {}

  if (!addr || typeof addr !== "object") {
    return { isValid: false, errors: { general: "Invalid address object" } }
  }

  const a = addr as Record<string, unknown>

  // Validate name (recipient name)
  if (typeof a.name !== "string" || a.name.trim().length === 0) {
    errors.name = "Recipient name is required"
  } else if (a.name.length > 100) {
    errors.name = "Name must be 100 characters or less"
  } else if (!/^[a-zA-Z\s'-]+$/.test(a.name)) {
    errors.name = "Name can only contain letters, spaces, apostrophes, and hyphens"
  }

  // Validate street address
  if (typeof a.address !== "string" || a.address.trim().length === 0) {
    errors.address = "Street address is required"
  } else if (a.address.length > 255) {
    errors.address = "Street address must be 255 characters or less"
  } else if (a.address.length < 5) {
    errors.address = "Street address must be at least 5 characters"
  }

  // Validate city
  if (typeof a.city !== "string" || a.city.trim().length === 0) {
    errors.city = "City is required"
  } else if (a.city.length > 100) {
    errors.city = "City name must be 100 characters or less"
  } else if (!/^[a-zA-Z\s'-]+$/.test(a.city)) {
    errors.city = "City name can only contain letters, spaces, apostrophes, and hyphens"
  }

  // Validate postal code/zip
  if (typeof a.zipCode !== "string" || a.zipCode.trim().length === 0) {
    errors.zipCode = "Postal code is required"
  } else if (a.zipCode.length > 20) {
    errors.zipCode = "Postal code must be 20 characters or less"
  } else if (!/^[a-zA-Z0-9\s-]+$/.test(a.zipCode)) {
    errors.zipCode = "Postal code can only contain letters, numbers, spaces, and hyphens"
  }

  // Validate country
  if (typeof a.country !== "string" || a.country.trim().length === 0) {
    errors.country = "Country is required"
  } else if (a.country.length > 100) {
    errors.country = "Country name must be 100 characters or less"
  } else if (!/^[a-zA-Z\s'-]+$/.test(a.country)) {
    errors.country = "Country name can only contain letters, spaces, apostrophes, and hyphens"
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}
