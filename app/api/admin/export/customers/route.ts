<<<<<<< ours
﻿import ExcelJS from "exceljs"
=======
import ExcelJS from "exceljs"
>>>>>>> theirs
import { NextRequest, NextResponse } from "next/server"

import { requireAdmin } from "@/lib/server/guards"
import { prisma } from "@/lib/server/prisma"

export async function GET(request: NextRequest) {
<<<<<<< ours
  const admin = await requireAdmin(request)
=======
  const admin = requireAdmin(request)
>>>>>>> theirs
  if ("error" in admin) {
    return admin.error
  }

<<<<<<< ours
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      addresses: { orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }], take: 1 },
      _count: { select: { orders: true } },
    },
  })

  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet("Customers")

  sheet.columns = [
    { header: "User ID", key: "id", width: 28 },
    { header: "Email", key: "email", width: 28 },
    { header: "Name", key: "name", width: 20 },
    { header: "Role", key: "role", width: 12 },
    { header: "Phone", key: "phone", width: 18 },
    { header: "Orders", key: "orders", width: 10 },
    { header: "City", key: "city", width: 16 },
    { header: "Country", key: "country", width: 16 },
    { header: "Registered At", key: "createdAt", width: 24 },
  ]

  for (const user of users) {
    const address = user.addresses[0]
    sheet.addRow({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone ?? "",
      orders: user._count.orders,
      city: address?.city ?? "",
      country: address?.country ?? "",
      createdAt: user.createdAt.toISOString(),
    })
  }

  const buffer = await workbook.xlsx.writeBuffer()

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="customers-${new Date().toISOString().slice(0, 10)}.xlsx"`,
    },
  })
=======
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        addresses: { orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }], take: 1 },
        _count: { select: { orders: true } },
      },
    })

    const workbook = new ExcelJS.Workbook()
    const sheet = workbook.addWorksheet("Customers")

    sheet.columns = [
      { header: "User ID", key: "id", width: 28 },
      { header: "Email", key: "email", width: 28 },
      { header: "Name", key: "name", width: 20 },
      { header: "Role", key: "role", width: 12 },
      { header: "Phone", key: "phone", width: 18 },
      { header: "Orders", key: "orders", width: 10 },
      { header: "City", key: "city", width: 16 },
      { header: "Country", key: "country", width: 16 },
      { header: "Registered At", key: "createdAt", width: 24 },
    ]

    for (const user of users) {
      const address = user.addresses[0]
      sheet.addRow({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone ?? "",
        orders: user._count.orders,
        city: address?.city ?? "",
        country: address?.country ?? "",
        createdAt: user.createdAt.toISOString(),
      })
    }

    const buffer = await workbook.xlsx.writeBuffer()

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="customers-${new Date().toISOString().slice(0, 10)}.xlsx"`,
      },
    })
  } catch {
    return NextResponse.json({ error: "Failed to export customers" }, { status: 500 })
  }
>>>>>>> theirs
}
