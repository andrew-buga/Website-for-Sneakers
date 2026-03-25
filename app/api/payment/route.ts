import { NextRequest, NextResponse } from "next/server"

/**
 * MOCK PAYMENT ENDPOINT - FOR DEVELOPMENT ONLY
 * 
 * ⚠️ WARNING: This endpoint does NOT process real payments.
 * It simulates successful payment responses for testing purposes.
 * 
 * For production, integrate:
 * - Stripe (stripe.com)
 * - Paddle (paddle.com)
 * - Square (squareup.com)
 * 
 * NEVER use this in production for real customer payments.
 */

export async function POST(request: NextRequest) {
  // This endpoint is not implemented - it's a placeholder for a real payment processor
  // For production, integrate Stripe, Paddle, or Square payment processing
  
  return NextResponse.json(
    {
      error: "Payment processing is not yet implemented",
      message: "This is a demonstration store. To add real payments, integrate Stripe, Paddle, or Square.",
      demoStore: true,
      documentation: "See TODO: Add payment processor integration",
    },
    { status: 501, statusText: "Not Implemented" }
  )
}