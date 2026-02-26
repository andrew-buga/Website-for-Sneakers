import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

import { authCookieName, verifyAuthToken } from "@/lib/server/auth"
import { prisma } from "@/lib/server/prisma"

const updateAddressSchema = z.object({
  fullName: z.string().min(1).optional(),
  line1: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
  postalCode: z.string().min(1).optional(),
  country: z.string().min(1).optional(),
  isDefault: z.boolean().optional(),
})

type Params = { params: Promise<{ userId: string; addressId: string }> }

function isAuthorized(request: NextRequest, userId: string) {
  const token = request.cookies.get(authCookieName)?.value
  if (!token) return false
  const payload = verifyAuthToken(token)
  return payload?.sub === userId
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const { userId, addressId } = await params

  if (!isAuthorized(request, userId)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const payload = updateAddressSchema.parse(await request.json())

    const existing = await prisma.address.findFirst({ where: { id: addressId, userId } })
    if (!existing) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 })
    }

    if (payload.isDefault) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      })
    }

    const updatedAddress = await prisma.address.update({
      where: { id: addressId },
      data: payload,
    })

    return NextResponse.json({ address: updatedAddress })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request payload", details: error.flatten() }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to update address" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const { userId, addressId } = await params

  if (!isAuthorized(request, userId)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const result = await prisma.address.deleteMany({
      where: { id: addressId, userId },
    })

    if (result.count === 0) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Failed to delete address" }, { status: 500 })
  }
}
