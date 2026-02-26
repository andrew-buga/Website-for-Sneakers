import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

import { requireAdmin } from "@/lib/server/guards"
import { prisma } from "@/lib/server/prisma"

const createProductSchema = z.object({
  sku: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  category: z.enum(["men", "women"]).optional(),
  collection: z.enum(["summer", "winter", "autumn"]).optional(),
  isTrending: z.boolean().optional(),
  priceCents: z.number().int().nonnegative(),
  currency: z.string().length(3).optional(),
  imageUrl: z.string().min(1).refine((value) => value.startsWith("/") || /^https?:\/\//.test(value), {
    message: "Image URL must be a local path (/uploads/...) or a valid http(s) URL",
  }).optional(),
  stock: z.number().int().nonnegative().optional(),
  sizes: z.array(z.string().min(1)).optional(),
  colors: z.array(z.string().min(1)).optional(),
  isActive: z.boolean().optional(),
})

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const includeInactive = searchParams.get("includeInactive") === "true"
  const category = searchParams.get("category")
  const collection = searchParams.get("collection")
  const trending = searchParams.get("trending")
  const limit = Number(searchParams.get("limit") ?? "0")

  const products = await prisma.product.findMany({
    where: {
      ...(includeInactive ? {} : { isActive: true }),
      ...(category ? { category } : {}),
      ...(collection ? { collection } : {}),
      ...(trending === "true" ? { isTrending: true } : {}),
    },
    orderBy: { createdAt: "desc" },
    ...(limit > 0 ? { take: limit } : {}),
  })

  return NextResponse.json({ products })
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin(request)
  if ("error" in admin) return admin.error

  try {
    const payload = createProductSchema.parse(await request.json())

    const product = await prisma.product.create({
      data: payload,
    })

    return NextResponse.json({ product }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request payload", details: error.flatten() }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
