import { UserRole } from "@prisma/client"
import bcrypt from "bcryptjs"
<<<<<<< ours
import { createHash } from "crypto"
=======
>>>>>>> theirs
import jwt from "jsonwebtoken"

const JWT_EXPIRES_IN = "7d"
const COOKIE_NAME = "auth_token"

export type AuthTokenPayload = {
  sub: string
  email: string
  role: UserRole
}

function getJwtSecret() {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error("JWT_SECRET is not configured")
  }
  return secret
}

export const authCookieName = COOKIE_NAME

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash)
}

export function signAuthToken(payload: AuthTokenPayload) {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: JWT_EXPIRES_IN,
  })
}

export function verifyAuthToken(token: string): AuthTokenPayload | null {
  try {
    return jwt.verify(token, getJwtSecret()) as AuthTokenPayload
  } catch {
    return null
  }
}

export function isStrongPassword(password: string) {
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasDigit = /\d/.test(password)
  const hasSpecial = /[^A-Za-z0-9]/.test(password)

  return password.length >= 8 && hasUppercase && hasLowercase && hasDigit && hasSpecial
}
<<<<<<< ours

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex")
}
=======
>>>>>>> theirs
