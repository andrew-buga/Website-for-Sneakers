import { NextResponse } from "next/server"

import { prisma } from "@/lib/server/prisma"

export async function GET() {
  const checks = {
    database: "ok" as "ok" | "error",
    jwtSecretConfigured: Boolean(process.env.JWT_SECRET),
    resendConfigured: Boolean(process.env.RESEND_API_KEY),
    blobConfigured: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
  }

  try {
    await prisma.$queryRaw`SELECT 1`
  } catch (error) {
    checks.database = "error"
    console.error("Health check failed: database", error)
  }

  const ok = checks.database === "ok" && checks.jwtSecretConfigured

  return NextResponse.json(
    {
      ok,
      checks,
      timestamp: new Date().toISOString(),
    },
    { status: ok ? 200 : 503 }
  )
}

