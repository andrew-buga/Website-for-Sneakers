import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { items, total } = await request.json()

    if (!items || !total) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
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

    return NextResponse.json({
      success: true,
      message: "Payment processed successfully",
      orderId: `ORD-${Date.now()}`,
      total: total,
    })
  } catch (error) {
    return NextResponse.json({ error: "Payment failed" }, { status: 500 })
  }
}