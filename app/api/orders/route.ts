import { NextResponse } from "next/server"
import { z } from "zod"

import { prisma } from "@/lib/server/prisma"

const createOrderSchema = z.object({
  userId: z.string().min(1),
  addressId: z.string().min(1),
  shippingCents: z.number().int().nonnegative().default(0),
  notes: z.string().optional(),
  items: z.array(
    z.object({
      productId: z.string().min(1),
      quantity: z.number().int().positive(),
      size: z.string().optional(),
      color: z.string().optional(),
    })
  ).min(1),
})

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")

  const orders = await prisma.order.findMany({
    where: userId ? { userId } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              sku: true,
              name: true,
            },
          },
        },
      },
      address: true,
    },
  })

  return NextResponse.json({ orders })
}

export async function POST(request: Request) {
  try {
    const payload = createOrderSchema.parse(await request.json())

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: payload.userId }, select: { id: true } })
      if (!user) {
        throw new Error("USER_NOT_FOUND")
      }

      const address = await tx.address.findUnique({ where: { id: payload.addressId }, select: { id: true, userId: true } })
      if (!address || address.userId !== payload.userId) {
        throw new Error("ADDRESS_NOT_FOUND")
      }

      const products = await tx.product.findMany({
        where: { id: { in: payload.items.map((item) => item.productId) }, isActive: true },
      })

      const productsById = new Map(products.map((product) => [product.id, product]))
      let subtotalCents = 0

      const validatedItems = payload.items.map((item) => {
        const product = productsById.get(item.productId)
        if (!product) {
          throw new Error(`PRODUCT_NOT_FOUND:${item.productId}`)
        }
        if (product.stock < item.quantity) {
          throw new Error(`INSUFFICIENT_STOCK:${item.productId}`)
        }

        const totalPriceCents = product.priceCents * item.quantity
        subtotalCents += totalPriceCents

        return {
          productId: item.productId,
          quantity: item.quantity,
          unitPriceCents: product.priceCents,
          totalPriceCents,
          size: item.size,
          color: item.color,
        }
      })

      const totalCents = subtotalCents + payload.shippingCents

      const order = await tx.order.create({
        data: {
          userId: payload.userId,
          addressId: payload.addressId,
          notes: payload.notes,
          shippingCents: payload.shippingCents,
          subtotalCents,
          totalCents,
          items: {
            create: validatedItems,
          },
        },
        include: {
          items: true,
        },
      })

      for (const item of validatedItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        })
      }

      return order
    })

    return NextResponse.json({ order: result }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request payload", details: error.flatten() }, { status: 400 })
    }

    if (error instanceof Error) {
      if (error.message === "USER_NOT_FOUND" || error.message === "ADDRESS_NOT_FOUND") {
        return NextResponse.json({ error: "User or address not found" }, { status: 404 })
      }

      if (error.message.startsWith("PRODUCT_NOT_FOUND") || error.message.startsWith("INSUFFICIENT_STOCK")) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }
    }

    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
