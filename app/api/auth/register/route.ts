import { randomBytes } from "crypto"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

import { hashPassword, isStrongPassword, signAuthToken, authCookieName } from "@/lib/server/auth"
import { checkRateLimit } from "@/lib/server/rate-limit"
import { prisma } from "@/lib/server/prisma"
import { sendVerificationEmail } from "@/lib/server/email"

const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(8),
})

export async function POST(request: NextRequest) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: "Server database configuration error" }, { status: 500 })
  }

  if (!process.env.JWT_SECRET) {
    return NextResponse.json({ error: "Server auth configuration error" }, { status: 500 })
  }

  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"
    const limit = checkRateLimit(`register:${ip}`, 5, 60 * 60 * 1000)

    if (!limit.allowed) {
      return NextResponse.json({ error: "Too many registration attempts. Please try again later." }, { status: 429 })
    }

    const payload = registerSchema.parse(await request.json())
    const email = payload.email.trim().toLowerCase()

    if (!isStrongPassword(payload.password)) {
      return NextResponse.json(
        { error: "Password must be 8+ chars and include uppercase, lowercase, number, and special character" },
        { status: 400 }
      )
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 })
    }

    const passwordHash = await hashPassword(payload.password)
    const emailVerifyToken = randomBytes(32).toString("hex")
    const emailVerifyTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

    const user = await prisma.user.create({
      data: {
        email,
        name: payload.name,
        passwordHash,
        emailVerifyToken,
        emailVerifyTokenExpiresAt,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        emailVerified: true,
        createdAt: true,
        role: true,
      },
    })

    try {
      await sendVerificationEmail(email, payload.name, emailVerifyToken)
    } catch (emailError) {
      console.error("POST /api/auth/register: failed to send verification email", emailError)
    }

    const token = signAuthToken({ sub: user.id, email: user.email, role: user.role })

    const response = NextResponse.json({ user }, { status: 201 })
    response.cookies.set({
      name: authCookieName,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    })

    return response
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request payload", details: error.flatten() }, { status: 400 })
    }

    if (error instanceof Error && error.message.includes("JWT_SECRET is not configured")) {
      console.error("POST /api/auth/register failed: JWT_SECRET is not configured")
      return NextResponse.json({ error: "Server auth configuration error" }, { status: 500 })
    }

    console.error("POST /api/auth/register failed", error)
    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}
