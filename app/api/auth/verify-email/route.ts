import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/server/prisma"

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token")

  if (!token) {
    return NextResponse.redirect(new URL("/auth/login?error=invalid-token", request.url))
  }

  const user = await prisma.user.findFirst({
    where: { emailVerifyToken: token },
  })

  if (!user) {
    return NextResponse.redirect(new URL("/auth/login?error=invalid-token", request.url))
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: true,
      emailVerifyToken: null,
    },
  })

  return NextResponse.redirect(new URL("/auth/login?verified=true", request.url))
}