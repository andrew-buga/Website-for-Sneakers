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
  try {
    const { items, total } = await request.json()

    if (!items || !total) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate items structure
    if (!Array.isArray(items)) {
      return NextResponse.json({ error: "Items must be an array" }, { status: 400 })
    }

    const lineItems = items.map(
      (item: { name: string; price: string; quantity: number; size: string; color: string }) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: `${item.name} - Size ${item.size}, ${item.color}`,
          },
          unit_amount: parseFloat(item.price.replace("$", "")) * 100,
        },
        quantity: item.quantity,
      })
    )

    // 🎭 MOCK RESPONSE - This is simulated payment success
    // In production, you would call Stripe.checkout.sessions.create() or similar
    console.warn(`[MOCK PAYMENT] Processing ${lineItems.length} items for total $${total}`)
    
    return NextResponse.json({
      success: true,
      message: "Payment processed successfully (MOCK/DEVELOPMENT MODE)",
      orderId: `ORD-${Date.now()}`,
      total: total,
      // Add explicit demo indicator
      isDemoMode: process.env.NODE_ENV !== "production",
      warning: process.env.NODE_ENV === "production" 
        ? undefined 
        : "⚠️ This is a mock payment endpoint. No real transaction occurred.",
    })
  } catch (error) {
    console.error("Payment error:", error)
    return NextResponse.json({ error: "Payment failed" }, { status: 500 })
  }
}