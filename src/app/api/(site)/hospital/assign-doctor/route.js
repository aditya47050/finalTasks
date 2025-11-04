import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { hospitalId, doctorId, hospitalSpecialityId } = await request.json();

    console.log("Assigning doctor:", {
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

    // Check if the hospital specialty exists
    const hospitalSpecialty = await db.hospitalSpeciality.findFirst({
      where: {
        id: hospitalSpecialityId,
        hospitalId: hospitalId
      }
    });

    if (!hospitalSpecialty) {
      return NextResponse.json(
        { error: "Hospital specialty not found" },
        { status: 404 }
      );
    }

    // Check if the doctor is approved for this hospital
    const hospitalDoctor = await db.HospitalDoctor.findFirst({
      where: {
        hospitalId: hospitalId,
        doctorId: doctorId,
        status: "APPROVED"
      }
    });

    if (!hospitalDoctor) {
      return NextResponse.json(
        { error: "Doctor is not approved for this hospital" },
        { status: 400 }
      );
    }

    // Update the HospitalDoctor record with the specialty
    const updatedHospitalDoctor = await db.HospitalDoctor.updateMany({
      where: {
        hospitalId: hospitalId,
        doctorId: doctorId,
        status: "APPROVED"
      },
      data: {
        hospitalSpecialityId: hospitalSpecialityId
      }
    });

    console.log("Doctor assigned successfully:", updatedHospitalDoctor);

    return NextResponse.json({ 
      success: true, 
      message: "Doctor assigned to specialty successfully",
      data: updatedHospitalDoctor 
    });
  } catch (error) {
    console.error("Error assigning doctor:", error);
    return NextResponse.json(
      { error: "Failed to assign doctor to specialty" },
      { status: 500 }
    );
  }
}