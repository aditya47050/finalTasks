import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { hospitalId, doctorId, hospitalSpecialityId } = await request.json();

    console.log("Removing doctor from specialty:", {
      hospitalId,
      doctorId,
      hospitalSpecialityId
    });

    // Validate required fields
    if (!hospitalId || !doctorId || !hospitalSpecialityId) {
      return NextResponse.json(
        { error: "Missing required fields: hospitalId, doctorId, hospitalSpecialityId" },
        { status: 400 }
      );
    }

    // Remove the specialty assignment by setting hospitalSpecialityId to null
    const updatedHospitalDoctor = await db.HospitalDoctor.updateMany({
      where: {
        hospitalId: hospitalId,
        doctorId: doctorId,
        hospitalSpecialityId: hospitalSpecialityId,
        status: "APPROVED"
      },
      data: {
        hospitalSpecialityId: null
      }
    });

    if (updatedHospitalDoctor.count === 0) {
      return NextResponse.json(
        { error: "Doctor assignment not found or already removed" },
        { status: 404 }
      );
    }

    console.log("Doctor removed from specialty successfully:", updatedHospitalDoctor);

    return NextResponse.json({ 
      success: true, 
      message: "Doctor removed from specialty successfully",
      data: updatedHospitalDoctor 
    });
  } catch (error) {
    console.error("Error removing doctor:", error);
    return NextResponse.json(
      { error: "Failed to remove doctor from specialty" },
      { status: 500 }
    );
  }
}