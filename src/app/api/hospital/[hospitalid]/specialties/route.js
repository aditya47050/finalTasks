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

    // Verify hospital exists
    const hospital = await db.Hospital.findUnique({
      where: { id: hospitalid },
      select: { id: true },
    });

    if (!hospital) {
      return NextResponse.json(
        { error: "Hospital not found" },
        { status: 404 }
      );
    }

    // Fetch ONLY specialties assigned to THIS specific hospital
    const hospitalSpecialties = await db.HospitalSpeciality.findMany({
      where: { 
        hospitalId: hospitalid, // Only this hospital's specialties
      },
      include: {
        speciality: true, // Include specialty details
      },
    });

    console.log(`✅ Found ${hospitalSpecialties.length} specialties for hospital ${hospitalid}`);

    // Get doctor count for each specialty at this hospital
    const specialtiesWithDoctorCount = await Promise.all(
      hospitalSpecialties.map(async (hs) => {
        // Count only doctors at THIS hospital with this specialty
        const doctorCount = await db.HospitalDoctor.count({
          where: {
            hospitalId: hospitalid,
            doctor: {
              specialities: {
                some: {
                  specialityId: hs.specialityId,
                },
              },
            },
          },
        });

        return {
          id: hs.id,
          specialityId: hs.specialityId,
          hospitalId: hs.hospitalId,
          speciality: hs.speciality,
          doctorCount,
        };
      })
    );

    return NextResponse.json({
      success: true,
      specialties: specialtiesWithDoctorCount,
      count: specialtiesWithDoctorCount.length,
    });
  } catch (error) {
    console.error("Error fetching hospital specialties:", error);
    return NextResponse.json(
      { error: "Failed to fetch specialties", details: error.message },
      { status: 500 }
    );
  }
}

