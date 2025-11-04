import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Get single ad request by ID
export async function GET(_, { params }) {
  const { id } = params;
  const item = await db.adRequest.findUnique({ where: { id } });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

// Update ad request
export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();

    const updated = await db.adRequest.update({
      where: { id },
      data: {
        cityTargets: body.cityTargets,
        radiusKm: body.radiusKm ? Number(body.radiusKm) : undefined,
        startDate: body.startDate ? new Date(body.startDate) : undefined,
        endDate: body.endDate ? new Date(body.endDate) : undefined,
        status: body.status,
        adminRemarks: body.adminRemarks,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

// Delete ad request
export async function DELETE(_, { params }) {
  try {
    const { id } = params;
    await db.adRequest.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
