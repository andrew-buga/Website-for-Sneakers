import { NextResponse } from "next/server"

import { authCookieName } from "@/lib/server/auth"

export async function POST() {
  const response = NextResponse.json({ ok: true })
  response.cookies.set({
    name: authCookieName,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  })

  return response
}
