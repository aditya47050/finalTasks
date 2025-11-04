import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req, { params }) {
  try {
    const { hospitalid } = params;

    if (!hospitalid) {
      return NextResponse.json(
        { error: "Hospital ID is required" },
        { status: 400 }
      );
    }

    // Fetch doctors assigned to this hospital
    const hospitalDoctors = await db.HospitalDoctor.findMany({
      where: { hospitalId: hospitalid },
      include: {
        doctor: {
          include: {
            specialities: {
              include: {
                speciality: true,
              },
            },
            doctorinfo: true,
            DoctorCertificate: true,
          },
        },
      },
    });

    // Format the doctor data
    const doctors = hospitalDoctors.map((hd) => {
      const doctor = hd.doctor;
      return {
        id: doctor.id,
        firstName: doctor.firstName,
        lastName: doctor.lastName,
        email: doctor.email,
        mobile: doctor.mobile,
        education: doctor.education,
        specialities: doctor.specialities,
        doctorinfo: doctor.doctorinfo,
        certificates: doctor.DoctorCertificate,
      };
    });

    return NextResponse.json({
      success: true,
      doctors,
      count: doctors.length,
    });
  } catch (error) {
    console.error("Error fetching hospital doctors:", error);
    return NextResponse.json(
      { error: "Failed to fetch doctors", details: error.message },
      { status: 500 }
    );
  }
}

