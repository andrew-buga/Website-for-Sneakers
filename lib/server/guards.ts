import { NextRequest, NextResponse } from "next/server"

import { authCookieName, verifyAuthToken } from "@/lib/server/auth"

export function requireAuth(request: NextRequest) {
  const token = request.cookies.get(authCookieName)?.value
  if (!token) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) }

  const payload = verifyAuthToken(token)
  if (!payload) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) }

  return { payload }
}

export function requireAdmin(request: NextRequest) {
  const auth = requireAuth(request)
  if ("error" in auth) return auth

  if (auth.payload.role !== "ADMIN") {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) }
  }

  return auth
}
