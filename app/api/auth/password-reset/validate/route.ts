import { NextRequest, NextResponse } from "next/server"

import { hashToken } from "@/lib/server/auth"
import { prisma } from "@/lib/server/prisma"

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token")
  if (!token) {
    return NextResponse.json({ valid: false }, { status: 400 })
  }

  const tokenHash = hashToken(token)
  const user = await prisma.user.findFirst({
    where: {
      passwordResetTokenHash: tokenHash,
      passwordResetTokenExpiresAt: {
        gt: new Date(),
      },
    },
    select: { id: true },
  })

  return NextResponse.json({ valid: Boolean(user) })
}

