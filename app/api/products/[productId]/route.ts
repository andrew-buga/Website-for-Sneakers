import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

import { requireAdmin } from "@/lib/server/guards"
import { prisma } from "@/lib/server/prisma"

const updateProductSchema = z.object({
  sku: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
<<<<<<< ours
  category: z.enum(["men", "women"]).optional(),
  collection: z.enum(["summer", "winter", "autumn"]).optional(),
  isTrending: z.boolean().optional(),
  priceCents: z.number().int().nonnegative().optional(),
  currency: z.string().length(3).optional(),
  imageUrl: z.string().min(1).refine((value) => value.startsWith("/") || /^https?:\/\//.test(value), {
    message: "Image URL must be a local path (/uploads/...) or a valid http(s) URL",
  }).nullable().optional(),
=======
  priceCents: z.number().int().nonnegative().optional(),
  currency: z.string().length(3).optional(),
  imageUrl: z.string().url().nullable().optional(),
>>>>>>> theirs
  stock: z.number().int().nonnegative().optional(),
  sizes: z.array(z.string().min(1)).optional(),
  colors: z.array(z.string().min(1)).optional(),
  isActive: z.boolean().optional(),
})

type Params = { params: Promise<{ productId: string }> }

<<<<<<< ours
export async function GET(_request: NextRequest, { params }: Params) {
  const { productId } = await params
  const product = await prisma.product.findUnique({
    where: { id: productId },
  })

  if (!product || !product.isActive) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 })
  }

  return NextResponse.json({ product })
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const admin = await requireAdmin(request)
=======
export async function PATCH(request: NextRequest, { params }: Params) {
  const admin = requireAdmin(request)
>>>>>>> theirs
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
<<<<<<< ours
  const admin = await requireAdmin(request)
  if ("error" in admin) return admin.error

  const { productId } = await params
  const { searchParams } = new URL(request.url)
  const hardDelete = searchParams.get("hard") === "true"

  if (hardDelete) {
    try {
      await prisma.product.delete({
        where: { id: productId },
      })

      return NextResponse.json({ ok: true, mode: "hard" })
    } catch {
      return NextResponse.json({ error: "Cannot hard delete product that is linked to orders" }, { status: 409 })
    }
  }
=======
  const admin = requireAdmin(request)
  if ("error" in admin) return admin.error

  const { productId } = await params
>>>>>>> theirs

  await prisma.product.update({
    where: { id: productId },
    data: { isActive: false },
  })

<<<<<<< ours
  return NextResponse.json({ ok: true, mode: "soft" })
=======
  return NextResponse.json({ ok: true })
>>>>>>> theirs
}
