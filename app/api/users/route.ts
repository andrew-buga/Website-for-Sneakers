import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/server/guards"
import { prisma } from "@/lib/server/prisma"

export async function GET(request: NextRequest) {
  const admin = await requireAdmin(request)
  if ("error" in admin) return admin.error

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      emailVerified: true,
      createdAt: true,
      _count: {
        select: {
          addresses: true,
          orders: true,
        },
      },
    },
  })

  return NextResponse.json({ users })
}

export async function POST() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}
