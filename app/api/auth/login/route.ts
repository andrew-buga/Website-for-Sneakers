import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

import { authCookieName, signAuthToken, verifyPassword } from "@/lib/server/auth"
import { checkRateLimit } from "@/lib/server/rate-limit"
import { prisma } from "@/lib/server/prisma"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export async function POST(request: NextRequest) {
  try {
    const payload = loginSchema.parse(await request.json())
<<<<<<< ours
    const email = payload.email.trim().toLowerCase()

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"
    const key = `login:${ip}:${email}`
=======

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"
    const key = `login:${ip}:${payload.email.toLowerCase()}`
>>>>>>> theirs
    const limit = checkRateLimit(key, 5, 15 * 60 * 1000)

    if (!limit.allowed) {
      return NextResponse.json({ error: "Too many login attempts. Please try again later." }, { status: 429 })
    }

<<<<<<< ours
    const user = await prisma.user.findUnique({ where: { email } })
=======
    const user = await prisma.user.findUnique({ where: { email: payload.email } })
>>>>>>> theirs
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const validPassword = await verifyPassword(payload.password, user.passwordHash)
    if (!validPassword) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const token = signAuthToken({ sub: user.id, email: user.email, role: user.role })

    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        emailVerified: user.emailVerified,
        role: user.role,
        createdAt: user.createdAt,
      },
    })

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

    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
