import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/server/prisma"

export async function GET(request: NextRequest) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.redirect(new URL("/account/login?error=server-error", request.url))
  }

  const token = request.nextUrl.searchParams.get("token")

  if (!token) {
    return NextResponse.redirect(new URL("/account/login?error=invalid-token", request.url))
  }

  const user = await prisma.user.findFirst({
    where: { emailVerifyToken: token },
    select: { id: true, emailVerifyTokenExpiresAt: true },
  })

  if (!user) {
    return NextResponse.redirect(new URL("/account/login?error=invalid-token", request.url))
  }

  if (user.emailVerifyTokenExpiresAt && user.emailVerifyTokenExpiresAt < new Date()) {
    return NextResponse.redirect(new URL("/account/login?error=token-expired", request.url))
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: true,
      emailVerifyToken: null,
      emailVerifyTokenExpiresAt: null,
    },
  })

  return NextResponse.redirect(new URL("/account/login?verified=true", request.url))
}
