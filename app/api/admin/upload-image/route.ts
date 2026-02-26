import { mkdir, writeFile } from "fs/promises"
import path from "path"
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

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg"
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`

    const uploadDir = path.join(process.cwd(), "public", "uploads")
    await mkdir(uploadDir, { recursive: true })

    const fullPath = path.join(uploadDir, fileName)
    await writeFile(fullPath, buffer)

    return NextResponse.json({ imageUrl: `/uploads/${fileName}` })
  } catch {
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
  }
}
