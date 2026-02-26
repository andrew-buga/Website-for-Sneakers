import { NextRequest, NextResponse } from "next/server"

import { authCookieName, verifyAuthToken } from "@/lib/server/auth"
import { prisma } from "@/lib/server/prisma"

export function requireAuth(request: NextRequest) {
  const token = request.cookies.get(authCookieName)?.value
  if (!token) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) }

  const payload = verifyAuthToken(token)
  if (!payload) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) }

  return { payload }
}

export async function requireAdmin(request: NextRequest) {
  const auth = requireAuth(request)
  if ("error" in auth) return auth

  const user = await prisma.user.findUnique({
    where: { id: auth.payload.sub },
    select: { role: true },
  })

  if (!user || user.role !== "ADMIN") {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) }
  }

  return auth
}
