import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export async function POST(req, { params }) {
  try {
    const { pharmacyId } = params;
    const body = await req.json();
    if (!pharmacyId) return NextResponse.json({ error: "pharmacyId required" }, { status: 400 });

    // Ensure pharmacy exists
    const exists = await db.pharmacy.findUnique({ where: { id: pharmacyId }, select: { id: true } });
    if (!exists) return NextResponse.json({ error: "Pharmacy not found" }, { status: 404 });

    const created = await db.pharmacist.create({
      data: {
        pharmacyId,
        regno: body.regno ?? null,
        fullname: body.fullname ?? null,
        regdate: body.regdate ?? null,
        panno: body.panno ?? null,
        pandoc: body.pandoc ?? null,
        gender: body.gender ?? null,
        aadharno: body.aadharno ?? null,
        aadharfront: body.aadharfront ?? null,
        aadharback: body.aadharback ?? null,
        profilepic: body.profilepic ?? null,
      },
      select: { id: true },
    });

    return NextResponse.json({ ok: true, pharmacist: created }, { status: 201 });
  } catch (err) {
    console.error("Create pharmacist error:", err);
    return NextResponse.json({ error: err?.message || "Failed to create pharmacist" }, { status: 500 });
  }
}


