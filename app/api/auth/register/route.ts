import { NextResponse } from "next/server"
import { z } from "zod"

import { hashPassword, isStrongPassword, signAuthToken, authCookieName } from "@/lib/server/auth"
import { prisma } from "@/lib/server/prisma"

const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(8),
})

export async function POST(request: Request) {
  try {
    const payload = registerSchema.parse(await request.json())

    if (!isStrongPassword(payload.password)) {
      return NextResponse.json(
        { error: "Password must be 8+ chars and include uppercase, lowercase, number, and special character" },
        { status: 400 }
      )
    }

    const existing = await prisma.user.findUnique({ where: { email: payload.email } })
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 })
    }

    const passwordHash = await hashPassword(payload.password)

    const user = await prisma.user.create({
      data: {
        email: payload.email,
        name: payload.name,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        emailVerified: true,
        createdAt: true,
      },
    })

    const token = signAuthToken({ sub: user.id, email: user.email })

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
