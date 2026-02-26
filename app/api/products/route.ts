import { NextResponse } from "next/server"
import { z } from "zod"

import { prisma } from "@/lib/server/prisma"

const createProductSchema = z.object({
  sku: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  priceCents: z.number().int().nonnegative(),
  currency: z.string().length(3).optional(),
  imageUrl: z.string().url().optional(),
  stock: z.number().int().nonnegative().optional(),
  isActive: z.boolean().optional(),
})

export async function GET() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json({ products })
}

export async function POST(request: Request) {
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
