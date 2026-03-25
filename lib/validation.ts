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
