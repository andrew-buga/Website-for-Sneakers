import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

import { requireAdmin } from "@/lib/server/guards"
import { prisma } from "@/lib/server/prisma"

const updateProductSchema = z.object({
  sku: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  priceCents: z.number().int().nonnegative().optional(),
  currency: z.string().length(3).optional(),
  imageUrl: z.string().url().nullable().optional(),
  stock: z.number().int().nonnegative().optional(),
  sizes: z.array(z.string().min(1)).optional(),
  colors: z.array(z.string().min(1)).optional(),
  isActive: z.boolean().optional(),
})

type Params = { params: Promise<{ productId: string }> }

export async function PATCH(request: NextRequest, { params }: Params) {
  const admin = requireAdmin(request)
  if ("error" in admin) return admin.error

  try {
    const { productId } = await params
    const payload = updateProductSchema.parse(await request.json())

    const product = await prisma.product.update({
      where: { id: productId },
      data: payload,
    })

    return NextResponse.json({ product })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request payload", details: error.flatten() }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const admin = requireAdmin(request)
  if ("error" in admin) return admin.error

  const { productId } = await params

  await prisma.product.update({
    where: { id: productId },
    data: { isActive: false },
  })

  return NextResponse.json({ ok: true })
}
