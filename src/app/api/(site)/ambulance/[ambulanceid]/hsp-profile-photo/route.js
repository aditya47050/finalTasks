import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  const id = params.ambulanceid;

  try {
    const data = await request.formData();
    const hsplogo = data.get("hsplogo");

    const ambulance = await db.Ambulance.findUnique({
      where: { id },
      include: { AmbulanceHsp: true },
    });

    if (!ambulance) {
      return NextResponse.json({ error: "Ambulance not found." }, { status: 404 });
    }

    const existingHsp = ambulance.AmbulanceHsp;
    let updatedlogo;

    if (existingHsp) {
      updatedlogo = await db.AmbulanceHsp.update({
        where: { id: existingHsp.id },
        data: { hsplogo },
      });
    } else {
      updatedlogo = await db.AmbulanceHsp.create({
        data: {
          hsplogo,
          ambulanceId: ambulance.id,
        },
      });
    }

    return NextResponse.json(updatedlogo);
  } catch (error) {
    console.error("Error updating Hsp logo:", error);
    return NextResponse.json(
      { error: "An error occurred: " + error.message },
      { status: 500 }
    );
  }
}
