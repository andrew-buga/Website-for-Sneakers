/**
 * CSRF token generation and validation
 * Uses stateless token approach with HMAC signature
 */

import crypto from "crypto"

// Get CSRF secret from environment, generate random if not set
const CSRF_SECRET = process.env.CSRF_SECRET || crypto.randomBytes(32).toString("hex")

/**
 * Generate a CSRF token with timestamp
 * Token format: timestamp.signature
 */
export function generateCsrfToken(): string {
  const timestamp = Date.now().toString()
  const signature = crypto
    .createHmac("sha256", CSRF_SECRET)
    .update(timestamp)
    .digest("hex")
  
  return `${timestamp}.${signature}`
}

/**
 * Validate CSRF token
 * Checks signature and token age (max 24 hours)
 */
export function validateCsrfToken(token: string): boolean {
  try {
    const [timestamp, signature] = token.split(".")
    
    if (!timestamp || !signature) {
      return false
    }

    // Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", CSRF_SECRET)
      .update(timestamp)
      .digest("hex")
    
    if (signature !== expectedSignature) {
      return false
    }

    // Check token age (max 24 hours)
    const tokenAge = Date.now() - parseInt(timestamp, 10)
    const maxAge = 24 * 60 * 60 * 1000 // 24 hours in ms
    
    if (tokenAge > maxAge) {
      return false
    }

    return true
  } catch (error) {
    return false
  }
}

export default {
  generateCsrfToken,
  validateCsrfToken,
}
