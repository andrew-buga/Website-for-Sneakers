/**
 * Rate Limiting Configuration
 * Uses Upstash Redis for distributed rate limiting
 * 
 * Environment variables needed:
 * - UPSTASH_REDIS_REST_URL
 * - UPSTASH_REDIS_REST_TOKEN
 */

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

/**
 * Create rate limiter for authentication endpoints
 * 5 attempts per 15 minutes
 */
export const createAuthLimiter = (identifier: string) => {
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(
      5,      // 5 requests
      '15 m'  // per 15 minutes
    ),
    analytics: true,
    prefix: `ratelimit:auth:${identifier}`,
  });
};

/**
 * Create rate limiter for password reset
 * 3 attempts per 1 hour (stricter than login)
 */
export const createPasswordResetLimiter = (email: string) => {
  return new Ratelimit({
    redis,
    limiter: Ratelimit.tokenBucket(
      3,      // 3 requests
      '1 h'   // per hour
    ),
    analytics: true,
    prefix: `ratelimit:reset:${email}`,
  });
};

/**
 * Create rate limiter for API endpoints (general)
 * 100 requests per 1 hour
 */
export const createAPILimiter = (identifier: string) => {
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(
      100,    // 100 requests
      '1 h'   // per hour
    ),
    analytics: true,
    prefix: `ratelimit:api:${identifier}`,
  });
};

/**
 * Helper function to get client IP from request
 */
export function getClientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    request.headers.get('cf-connecting-ip') ||
    'unknown'
  );
}

/**
 * Helper to create standardized rate limit error response
 */
export function createRateLimitErrorResponse(resetTime: number) {
  const secondsRemaining = Math.ceil((resetTime - Date.now()) / 1000);
  const minutesRemaining = Math.ceil(secondsRemaining / 60);

  return new Response(
    JSON.stringify({
      error: 'Too many requests',
      message: `Please try again in ${minutesRemaining} minute${minutesRemaining > 1 ? 's' : ''}.`,
      retryAfter: minutesRemaining * 60,
    }),
    {
      status: 429,
      headers: {
        'Retry-After': String(minutesRemaining * 60),
        'Content-Type': 'application/json',
      },
    }
  );
}
