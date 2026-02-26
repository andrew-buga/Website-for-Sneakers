import { NextRequest, NextResponse } from "next/server"

import { requireAdmin } from "@/lib/server/guards"
import { prisma } from "@/lib/server/prisma"
import { demoProducts } from "@/lib/server/demo-products"

export async function POST(request: NextRequest) {
  const admin = await requireAdmin(request)
  if ("error" in admin) return admin.error

  for (const product of demoProducts) {
    await prisma.product.upsert({
      where: { sku: product.sku },
      update: product,
      create: product,
    })
  }

  const count = await prisma.product.count()
  return NextResponse.json({ ok: true, seeded: demoProducts.length, totalProducts: count })
}
