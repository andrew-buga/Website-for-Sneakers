<<<<<<< ours
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { randomBytes } from "crypto"

import { hashPassword, isStrongPassword, signAuthToken, authCookieName } from "@/lib/server/auth"
import { checkRateLimit } from "@/lib/server/rate-limit"
import { prisma } from "@/lib/server/prisma"
import { sendVerificationEmail } from "@/lib/server/email"
=======
import { NextResponse } from "next/server"
import { z } from "zod"

import { hashPassword, isStrongPassword, signAuthToken, authCookieName } from "@/lib/server/auth"
import { prisma } from "@/lib/server/prisma"
>>>>>>> theirs

const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(8),
})

<<<<<<< ours
export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"
    const limit = checkRateLimit(`register:${ip}`, 5, 60 * 60 * 1000)

    if (!limit.allowed) {
      return NextResponse.json({ error: "Too many registration attempts. Please try again later." }, { status: 429 })
    }

    const payload = registerSchema.parse(await request.json())
    const email = payload.email.trim().toLowerCase()
=======
export async function POST(request: Request) {
  try {
    const payload = registerSchema.parse(await request.json())
>>>>>>> theirs

    if (!isStrongPassword(payload.password)) {
      return NextResponse.json(
        { error: "Password must be 8+ chars and include uppercase, lowercase, number, and special character" },
        { status: 400 }
      )
    }

<<<<<<< ours
    const existing = await prisma.user.findUnique({ where: { email } })
=======
    const existing = await prisma.user.findUnique({ where: { email: payload.email } })
>>>>>>> theirs
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 })
    }

    const passwordHash = await hashPassword(payload.password)
<<<<<<< ours
    const emailVerifyToken = randomBytes(32).toString("hex")

    const user = await prisma.user.create({
      data: {
        email,
        name: payload.name,
        passwordHash,
        emailVerifyToken,
=======

    const user = await prisma.user.create({
      data: {
        email: payload.email,
        name: payload.name,
        passwordHash,
>>>>>>> theirs
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

<<<<<<< ours
    await sendVerificationEmail(email, payload.name, emailVerifyToken)

=======
>>>>>>> theirs
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

    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}
