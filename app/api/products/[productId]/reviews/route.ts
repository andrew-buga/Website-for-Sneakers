import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

import { requireAuth } from "@/lib/server/guards"
import { prisma } from "@/lib/server/prisma"
import { authCookieName, verifyAuthToken } from "@/lib/server/auth"

const createReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  text: z.string().min(10).max(1200),
})

type Params = { params: Promise<{ productId: string }> }

export async function GET(request: NextRequest, { params }: Params) {
  const { productId } = await params
  const token = request.cookies.get(authCookieName)?.value
  const payload = token ? verifyAuthToken(token) : null

  if (payload) {
    const reviews = await prisma.productReview.findMany({
      where: { productKey: productId },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        likes: { where: { userId: payload.sub }, select: { userId: true } },
        _count: {
          select: { likes: true },
        },
      },
    })

    return NextResponse.json({
      reviews: reviews.map((review) => ({
        id: review.id,
        author: review.user.name,
        rating: review.rating,
        date: review.createdAt,
        text: review.text,
        helpful: review._count.likes,
        likedByMe: review.likes.length > 0,
        userId: review.user.id,
      })),
    })
  }

  const reviews = await prisma.productReview.findMany({
    where: { productKey: productId },
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
      _count: {
        select: { likes: true },
      },
    },
  })

  return NextResponse.json({
    reviews: reviews.map((review) => ({
      id: review.id,
      author: review.user.name,
      rating: review.rating,
      date: review.createdAt,
      text: review.text,
      helpful: review._count.likes,
      likedByMe: false,
      userId: review.user.id,
    })),
  })
}

export async function POST(request: NextRequest, { params }: Params) {
  const auth = requireAuth(request)
  if ("error" in auth) return auth.error

  try {
    const { productId } = await params
    const payload = createReviewSchema.parse(await request.json())

    const review = await prisma.productReview.create({
      data: {
        productKey: productId,
        userId: auth.payload.sub,
        rating: payload.rating,
        text: payload.text,
      },
      include: {
        user: { select: { id: true, name: true } },
        _count: { select: { likes: true } },
      },
    })

    return NextResponse.json({
      review: {
        id: review.id,
        author: review.user.name,
        rating: review.rating,
        date: review.createdAt,
        text: review.text,
        helpful: review._count.likes,
        likedByMe: false,
        userId: review.user.id,
      },
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request payload", details: error.flatten() }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to create review" }, { status: 500 })
  }
}
