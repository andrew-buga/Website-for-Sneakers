import { randomBytes } from "crypto"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

import { hashToken } from "@/lib/server/auth"
import { sendPasswordResetEmail } from "@/lib/server/email"
import { prisma } from "@/lib/server/prisma"
import { checkRateLimit } from "@/lib/server/rate-limit"

const requestSchema = z.object({
  email: z.string().email(),
})

export async function POST(request: NextRequest) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: "Server database configuration error" }, { status: 500 })
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "Email service is not configured" }, { status: 500 })
  }

  try {
    const payload = requestSchema.parse(await request.json())
    const email = payload.email.trim().toLowerCase()

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"
    const limit = checkRateLimit(`password-reset-request:${ip}:${email}`, 5, 60 * 60 * 1000)

    if (!limit.allowed) {
      return NextResponse.json({ error: "Too many password reset attempts. Please try again later." }, { status: 429 })
    }

    const user = await prisma.user.findUnique({ where: { email } })

    if (user) {
      const rawToken = randomBytes(32).toString("hex")
      const tokenHash = hashToken(rawToken)
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000)

      await prisma.user.update({
        where: { id: user.id },
        data: {
          passwordResetTokenHash: tokenHash,
          passwordResetTokenExpiresAt: expiresAt,
        },
      })

      try {
        await sendPasswordResetEmail(user.email, user.name, rawToken)
      } catch (emailError) {
        console.error("POST /api/auth/password-reset/request: failed to send reset email", emailError)
      }
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request payload", details: error.flatten() }, { status: 400 })
    }

    console.error("POST /api/auth/password-reset/request failed", error)
    return NextResponse.json({ error: "Failed to request password reset" }, { status: 500 })
  }
}

