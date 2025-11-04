import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(request, { params }) {
  const { id } = params; // prescription id
  const { medications } = await request.json();

  if (!id || !Array.isArray(medications)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    // Optionally: Add authentication/authorization here

    // Update the medications array for the prescription
    const updated = await db.prescription.update({
      where: { id },
      data: { medications },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Error updating pharmacist notes:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Optionally, you can add a GET handler to fetch the prescription if needed
export async function GET(request, { params }) {
  const { id } = params;
  if (!id) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  try {
    const prescription = await db.prescription.findUnique({
      where: { id },
    });
    if (!prescription) {
      return NextResponse.json({ error: "Prescription not found" }, { status: 404 });
    }
    return NextResponse.json(prescription, { status: 200 });
  } catch (error) {
    console.error("Error fetching prescription:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}