import { NextRequest, NextResponse } from "next/server"
import { OrderStatus } from "@prisma/client"
import { z } from "zod"

import { requireAuth } from "@/lib/server/guards"
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

export async function GET(request: NextRequest) {
  const auth = requireAuth(request)
  if ("error" in auth) return auth.error

  const { searchParams } = new URL(request.url)
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"))
  const pageSize = Math.min(50, Math.max(1, Number(searchParams.get("pageSize") ?? "10")))

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where: { userId: auth.payload.sub },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        items: { include: { product: { select: { id: true, sku: true, name: true } } } },
        address: true,
      },
    }),
    prisma.order.count({ where: { userId: auth.payload.sub } }),
  ])

  return NextResponse.json({
    orders,
    pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
  })
}

export async function POST(request: NextRequest) {
  const auth = requireAuth(request)
  if ("error" in auth) return auth.error

  try {
    const payload = createOrderSchema.parse(await request.json())
    if (payload.userId !== auth.payload.sub) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: payload.userId }, select: { id: true } })
      if (!user) throw new Error("USER_NOT_FOUND")

      const address = await tx.address.findUnique({ where: { id: payload.addressId }, select: { id: true, userId: true } })
      if (!address || address.userId !== payload.userId) throw new Error("ADDRESS_NOT_FOUND")

      const products = await tx.product.findMany({
        where: { id: { in: payload.items.map((item) => item.productId) }, isActive: true },
      })

      const productsById = new Map(products.map((product) => [product.id, product]))
      let subtotalCents = 0

      const validatedItems = payload.items.map((item) => {
        const product = productsById.get(item.productId)
        if (!product) throw new Error(`PRODUCT_NOT_FOUND:${item.productId}`)
        if (product.stock < item.quantity) throw new Error(`INSUFFICIENT_STOCK:${item.productId}`)
        if (item.size && !product.sizes.includes(item.size)) throw new Error(`SIZE_NOT_AVAILABLE:${item.productId}`)
        if (item.color && !product.colors.includes(item.color)) throw new Error(`COLOR_NOT_AVAILABLE:${item.productId}`)

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

      const order = await tx.order.create({
        data: {
          userId: payload.userId,
          addressId: payload.addressId,
          notes: payload.notes,
          shippingCents: payload.shippingCents,
          subtotalCents,
          totalCents: subtotalCents + payload.shippingCents,
          status: OrderStatus.PENDING,
          items: { create: validatedItems },
        },
      })

      await Promise.all(validatedItems.map((item) => tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      })))

      return order
    })

    return NextResponse.json({ order: result }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request payload", details: error.flatten() }, { status: 400 })
    }

    if (error instanceof Error && /NOT_FOUND|INSUFFICIENT_STOCK|NOT_AVAILABLE/.test(error.message)) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
