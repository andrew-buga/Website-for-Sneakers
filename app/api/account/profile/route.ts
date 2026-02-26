import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

import { authCookieName, verifyAuthToken } from "@/lib/server/auth"
import { prisma } from "@/lib/server/prisma"

const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().min(5).optional(),
})

export async function PATCH(request: NextRequest) {
  const token = request.cookies.get(authCookieName)?.value
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const payload = verifyAuthToken(token)
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = updateProfileSchema.parse(await request.json())
    const user = await prisma.user.update({
      where: { id: payload.sub },
      data: body,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        emailVerified: true,
        createdAt: true,
      },
    })

    return NextResponse.json({ user })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request payload", details: error.flatten() }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}
