/**
 * Permission and role-based access control
 * Centralized authorization logic
 */

import { User } from "@/lib/auth-context"

/**
 * Check if user has admin role
 */
export function hasAdminRole(user: User | null): boolean {
  if (!user) return false
  return user.role === "ADMIN"
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(user: User | null): boolean {
  return user !== null && user !== undefined
}

/**
 * Check if user has verified email
 */
export function isEmailVerified(user: User | null): boolean {
  if (!user) return false
  return user.emailVerified === true
}

/**
 * Guard for admin routes - redirect to home if not admin
 */
export function requireAdmin(user: User | null): boolean {
  return hasAdminRole(user)
}

/**
 * Guard for authenticated routes - redirect to login if not authenticated
 */
export function requireAuth(user: User | null): boolean {
  return isAuthenticated(user)
}

/**
 * Guard for verified email - redirect if email not verified
 */
export function requireEmailVerified(user: User | null): boolean {
  return isEmailVerified(user)
}

/**
 * Check if user can access account pages
 */
export function canAccessAccount(user: User | null): boolean {
  return requireAuth(user)
}

/**
 * Check if user can access admin pages
 */
export function canAccessAdmin(user: User | null): boolean {
  return requireAdmin(user)
}

/**
 * Check if user can place orders
 */
export function canPlaceOrder(user: User | null): boolean {
  return requireAuth(user) && requireEmailVerified(user)
}

export default {
  hasAdminRole,
  isAuthenticated,
  isEmailVerified,
  requireAdmin,
  requireAuth,
  requireEmailVerified,
  canAccessAccount,
  canAccessAdmin,
  canPlaceOrder,
}
