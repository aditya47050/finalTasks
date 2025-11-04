import { NextResponse } from "next/server";
import { createScanSession } from "@/lib/getscansession";

export async function POST(req) {
  const { email } = await req.json();
  await createScanSession(email);
  return NextResponse.json({ success: true });
}
