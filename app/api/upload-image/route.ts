// app/api/upload-image/route.ts
import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = file.name;

  const result = await put(fileName, buffer, {
    access: "public", // або "private"
    token: process.env.SNEAKER_WEBSITE_READ_WRITE_TOKEN,
  });

  return NextResponse.json({ url: result.url });
}