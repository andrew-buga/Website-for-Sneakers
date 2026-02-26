import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

import { authCookieName, verifyAuthToken } from "@/lib/server/auth"
import { prisma } from "@/lib/server/prisma"

const createAddressSchema = z.object({
  fullName: z.string().min(1),
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().optional(),
  postalCode: z.string().min(1),
  country: z.string().min(1),
  phone: z.string().optional(),
  isDefault: z.boolean().optional(),
})

type Params = { params: Promise<{ userId: string }> }

function isAuthorized(request: NextRequest, userId: string) {
  const token = request.cookies.get(authCookieName)?.value
  if (!token) return false
  const payload = verifyAuthToken(token)
  return payload?.sub === userId
}

export async function GET(request: NextRequest, { params }: Params) {
  const { userId } = await params

  if (!isAuthorized(request, userId)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const addresses = await prisma.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  })

  return NextResponse.json({ addresses })
}

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { userId } = await params

    if (!isAuthorized(request, userId)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payload = createAddressSchema.parse(await request.json())

    const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const address = await prisma.$transaction(async (tx) => {
      if (payload.isDefault) {
        await tx.address.updateMany({
          where: { userId, isDefault: true },
          data: { isDefault: false },
        })
      }

      return tx.address.create({
        data: {
          ...payload,
          userId,
        },
      })
    })

    return NextResponse.json({ address }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request payload", details: error.flatten() }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to create address" }, { status: 500 })
  }
}
