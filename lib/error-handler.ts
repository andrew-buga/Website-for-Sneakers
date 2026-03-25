/**
 * Centralized error handling for the application
 * Ensures all errors are logged and user-friendly messages are displayed
 */

export interface AppError {
  message: string
  code?: string
  originalError?: Error
  context?: Record<string, unknown>
}

/**
 * Log error to console in development, external service in production
 */
export function logError(error: unknown, context?: Record<string, unknown>): void {
  const err = error instanceof Error ? error : new Error(String(error))
  
  // Extract code from error if it exists (for custom error types)
  let code: string | undefined
  if (typeof error === "object" && error !== null && "code" in error) {
    code = String((error as any).code)
  }

  const errorData: AppError = {
    message: err.message,
    code,
    originalError: err,
    context,
  }

  if (process.env.NODE_ENV === "development") {
    console.error("[ERROR]", errorData)
  } else {
    // In production, send to external logging service (e.g., Sentry)
    // Example: Sentry.captureException(err, { tags: context })
    console.error("[ERROR]", {
      message: errorData.message,
      code: errorData.code,
      context: errorData.context,
    })
  }
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyMessage(error: unknown): string {
  if (error instanceof Error) {
    // Map specific errors to user messages
    if (error.message.includes("network") || error.message.includes("fetch")) {
      return "Network error. Please check your connection and try again."
    }
    if (error.message.includes("unauthorized")) {
      return "Please log in to continue."
    }
    if (error.message.includes("not found")) {
      return "The requested item could not be found."
    }
    
    // Default to generic message
    return "Something went wrong. Please try again."
  }

  return "An unexpected error occurred."
}

/**
 * Wrapper for async operations with proper error handling
 */
export async function handleAsync<T>(
  asyncFn: () => Promise<T>,
  context?: Record<string, unknown>
): Promise<T | null> {
  try {
    return await asyncFn()
  } catch (error) {
    logError(error, context)
    return null
  }
}

/**
 * Wrapper with user error message
 */
export async function handleAsyncWithMessage<T>(
  asyncFn: () => Promise<T>,
  onError?: (message: string) => void,
  context?: Record<string, unknown>
): Promise<T | null> {
  try {
    return await asyncFn()
  } catch (error) {
    const message = getUserFriendlyMessage(error)
    logError(error, context)
    onError?.(message)
    return null
  }
}
