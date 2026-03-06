import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

import { hashPassword, hashToken, isStrongPassword } from "@/lib/server/auth"
import { prisma } from "@/lib/server/prisma"
import { checkRateLimit } from "@/lib/server/rate-limit"

const confirmSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8),
})

export async function POST(request: NextRequest) {
  try {
    const payload = confirmSchema.parse(await request.json())

    if (!isStrongPassword(payload.password)) {
      return NextResponse.json(
        { error: "Password must be 8+ chars and include uppercase, lowercase, number, and special character" },
        { status: 400 }
      )
    }

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"
    const limit = checkRateLimit(`password-reset-confirm:${ip}`, 10, 60 * 60 * 1000)

    if (!limit.allowed) {
      return NextResponse.json({ error: "Too many password reset attempts. Please try again later." }, { status: 429 })
    }

    const tokenHash = hashToken(payload.token)
    const user = await prisma.user.findFirst({
      where: {
        passwordResetTokenHash: tokenHash,
        passwordResetTokenExpiresAt: {
          gt: new Date(),
        },
      },
      select: { id: true },
    })

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired reset token" }, { status: 400 })
    }

    const nextHash = await hashPassword(payload.password)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: nextHash,
        passwordResetTokenHash: null,
        passwordResetTokenExpiresAt: null,
      },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request payload", details: error.flatten() }, { status: 400 })
    }

    console.error("POST /api/auth/password-reset/confirm failed", error)
    return NextResponse.json({ error: "Failed to reset password" }, { status: 500 })
  }
}

