<<<<<<< ours
﻿import { NextRequest, NextResponse } from "next/server"
=======
import { NextRequest, NextResponse } from "next/server"
>>>>>>> theirs

import { authCookieName, verifyAuthToken } from "@/lib/server/auth"
import { prisma } from "@/lib/server/prisma"

export async function GET(request: NextRequest) {
<<<<<<< ours
  try {
    const token = request.cookies.get(authCookieName)?.value
    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    const payload = verifyAuthToken(token)
    if (!payload) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

=======
  const token = request.cookies.get(authCookieName)?.value
  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 })
  }

  const payload = verifyAuthToken(token)
  if (!payload) {
    return NextResponse.json({ user: null }, { status: 401 })
  }

  try {
>>>>>>> theirs
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        addresses: {
          orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
        },
      },
    })

    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    return NextResponse.json({
<<<<<<< ours
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        emailVerified: user.emailVerified,
        role: user.role,
        createdAt: user.createdAt,
        addresses: user.addresses.map((addr) => ({
          id: addr.id,
          name: addr.fullName,
          address: addr.line1,
          city: addr.city,
          zipCode: addr.postalCode,
          country: addr.country,
          isDefault: addr.isDefault,
        })),
        defaultAddressId: user.addresses.find((addr) => addr.isDefault)?.id,
      },
    })
  } catch {
    return NextResponse.json({ error: "Temporary auth service issue" }, { status: 503 })
=======
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      emailVerified: user.emailVerified,
      role: user.role,
      createdAt: user.createdAt,
      addresses: user.addresses.map((addr) => ({
        id: addr.id,
        name: addr.fullName,
        address: addr.line1,
        city: addr.city,
        zipCode: addr.postalCode,
        country: addr.country,
        isDefault: addr.isDefault,
      })),
      defaultAddressId: user.addresses.find((addr) => addr.isDefault)?.id,
    },
  })
  } catch {
    return NextResponse.json({ error: "Failed to load session" }, { status: 500 })
>>>>>>> theirs
  }
}
