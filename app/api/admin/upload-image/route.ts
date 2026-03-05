import { put } from "@vercel/blob"
import { NextRequest, NextResponse } from "next/server"

import { requireAdmin } from "@/lib/server/guards"

const MAX_FILE_SIZE = 5 * 1024 * 1024

export async function POST(request: NextRequest) {
  const admin = await requireAdmin(request)
  if ("error" in admin) return admin.error

  try {
    const formData = await request.formData()
    const file = formData.get("file")

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File is required" }, { status: 400 })
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "Image must be less than 5MB" }, { status: 400 })
    }

    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg"
    const fileName = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`

    const blob = await put(fileName, file, {
      access: "public",
      addRandomSuffix: false,
      contentType: file.type,
    })

    return NextResponse.json({ imageUrl: blob.url })
  } catch {
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
  }
}
