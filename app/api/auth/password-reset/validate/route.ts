import { NextRequest, NextResponse } from "next/server"

import { hashToken } from "@/lib/server/auth"
import { prisma } from "@/lib/server/prisma"

export async function GET(request: NextRequest) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ valid: false, error: "Server database configuration error" }, { status: 500 })
  }

  const token = request.nextUrl.searchParams.get("token")
  if (!token) {
    return NextResponse.json({ valid: false }, { status: 400 })
  }

  const tokenHash = hashToken(token)
  const now = new Date()
  
  const user = await prisma.user.findFirst({
    where: {
      passwordResetTokenHash: tokenHash,
      passwordResetTokenExpiresAt: {
        gt: now,
      },
    },
    select: { id: true, passwordResetTokenExpiresAt: true },
  })

  // Diagnostic logging
  if (!user) {
    console.warn(
      `[PASSWORD_RESET] Token validation failed. Time now: ${now.toISOString()}, Token hash: ${tokenHash.substring(0, 10)}...`
    )
  }

  return NextResponse.json({ valid: Boolean(user) })
}

