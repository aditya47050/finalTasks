import { db } from "@/lib/db";

export async function POST(req, context) {
  try {
    const pharmacyId = context.params?.pharmacyId; // safe access
    const body = await req.json();

    if (!pharmacyId) {
      return new Response(
        JSON.stringify({ error: "Pharmacy ID is required" }),
        { status: 400 }
      );
    }

    // Only keep string fields; remove stateId/districtId/talukaId
    const {
      stateId,
      districtId,
      talukaId,
      ...branchData
    } = body;

    const created = await db.pharmacybranch.create({
      data: {
        pharmacyId,
        ...branchData,
      },
      select: { id: true },
    });

    return new Response(
      JSON.stringify({ success: true, id: created.id }),
      { status: 201 }
    );
  } catch (err) {
    console.error("Create branch error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
