import { OrderStatus } from "@prisma/client"
import { NextResponse } from "next/server"
import { z } from "zod"

import { prisma } from "@/lib/server/prisma"

const updateOrderSchema = z.object({
  status: z.nativeEnum(OrderStatus).optional(),
  notes: z.string().optional(),
})

type Params = { params: Promise<{ orderId: string }> }

export async function GET(_request: Request, { params }: Params) {
  const { orderId } = await params

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      address: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  })

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 })
  }

  return NextResponse.json({ order })
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const { orderId } = await params
    const payload = updateOrderSchema.parse(await request.json())

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
