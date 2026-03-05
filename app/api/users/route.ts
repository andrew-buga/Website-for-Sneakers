<<<<<<< ours
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
=======
import { NextResponse } from "next/server"
import { z } from "zod"

import { prisma } from "@/lib/server/prisma"

const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  passwordHash: z.string().min(1),
  phone: z.string().min(5).optional(),
  emailVerified: z.boolean().optional(),
})

export async function GET() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      addresses: true,
      orders: {
        select: { id: true, status: true, totalCents: true, createdAt: true },
>>>>>>> theirs
      },
    },
  })

  return NextResponse.json({ users })
}

<<<<<<< ours
export async function POST() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
=======
export async function POST(request: Request) {
  try {
    const payload = createUserSchema.parse(await request.json())

    const user = await prisma.user.create({
      data: payload,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        emailVerified: true,
        createdAt: true,
      },
    })

    return NextResponse.json({ user }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request payload", details: error.flatten() }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
>>>>>>> theirs
}
