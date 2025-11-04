import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const url = new URL(request.url);
    const patientid = url.pathname.split('/').slice(-2, -1)[0];

    const { bpValue, weight, height, temperature, pulseRate } = await request.json();

    // Validate input data
    if (!patientid || !bpValue || !weight || !temperature || !pulseRate) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Prepare data for update, ensuring field names match the schema
    const updateData = {
      bpvalue: bpValue, 
      weight,           
      temperature,      
      pulseRate,       
    };

    if (height !== undefined) {
      updateData.height = height; 
    }

    // Update the patient's medical history with the new body info
    await db.medicalHistory.update({
      where: { patientId: patientid },
      data: updateData,
    });

    return NextResponse.json({ message: "Body info updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating body info:", error.message, error.stack);
    return NextResponse.json({ message: "Failed to update body info" }, { status: 500 });
  }
}