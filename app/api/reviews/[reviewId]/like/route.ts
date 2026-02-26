import { NextRequest, NextResponse } from "next/server"

import { requireAuth } from "@/lib/server/guards"
import { prisma } from "@/lib/server/prisma"

type Params = { params: Promise<{ reviewId: string }> }

async function getLikeState(reviewId: string, userId: string) {
  const [likedByMe, helpful] = await Promise.all([
    prisma.reviewLike.findUnique({
      where: {
        reviewId_userId: {
          reviewId,
          userId,
        },
      },
    }),
    prisma.reviewLike.count({ where: { reviewId } }),
  ])

  return { likedByMe: Boolean(likedByMe), helpful }
}

export async function POST(request: NextRequest, { params }: Params) {
  const auth = requireAuth(request)
  if ("error" in auth) return auth.error

  const { reviewId } = await params

  await prisma.reviewLike.upsert({
    where: {
      reviewId_userId: {
        reviewId,
        userId: auth.payload.sub,
      },
    },
    create: {
      reviewId,
      userId: auth.payload.sub,
    },
    update: {},
  })

  return NextResponse.json(await getLikeState(reviewId, auth.payload.sub))
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const auth = requireAuth(request)
  if ("error" in auth) return auth.error

  const { reviewId } = await params

  await prisma.reviewLike.deleteMany({
    where: {
      reviewId,
      userId: auth.payload.sub,
    },
  })

  return NextResponse.json(await getLikeState(reviewId, auth.payload.sub))
}
