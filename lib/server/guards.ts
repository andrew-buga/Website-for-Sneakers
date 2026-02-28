import { NextRequest, NextResponse } from "next/server"

import { authCookieName, verifyAuthToken } from "@/lib/server/auth"
import { prisma } from "@/lib/server/prisma"
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) }
  }

  return auth
}
