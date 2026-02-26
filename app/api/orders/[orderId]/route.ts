import { OrderStatus } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

import { requireAuth } from "@/lib/server/guards"
import { prisma } from "@/lib/server/prisma"

const orderTransitions: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["PAID", "CANCELLED"],
  PAID: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
}

const updateOrderSchema = z.object({
  status: z.nativeEnum(OrderStatus).optional(),
  notes: z.string().optional(),
})

type Params = { params: Promise<{ orderId: string }> }

export async function GET(request: NextRequest, { params }: Params) {
  const auth = requireAuth(request)
  if ("error" in auth) return auth.error

  const { orderId } = await params

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: { include: { product: true } },
      address: true,
      user: { select: { id: true, name: true, email: true } },
    },
  })

  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 })
  if (auth.payload.role !== "ADMIN" && order.userId !== auth.payload.sub) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  return NextResponse.json({ order })
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const auth = requireAuth(request)
  if ("error" in auth) return auth.error
  if (auth.payload.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const { orderId } = await params
    const payload = updateOrderSchema.parse(await request.json())

    const existingOrder = await prisma.order.findUnique({ where: { id: orderId } })
    if (!existingOrder) return NextResponse.json({ error: "Order not found" }, { status: 404 })

    if (payload.status && !orderTransitions[existingOrder.status].includes(payload.status)) {
      return NextResponse.json({ error: `Invalid status transition from ${existingOrder.status} to ${payload.status}` }, { status: 400 })
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: payload,
    })

    return NextResponse.json({ order })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request payload", details: error.flatten() }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
  }
}
