import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  try {
    // ✅ Await params since Next.js 15+ makes them async
    const { hospitalid } = await params;

    if (!hospitalid) {
      console.error("❌ Missing hospitalid in route params");
      return NextResponse.json(
        { success: false, message: "Hospital ID is required" },
        { status: 400 }
      );
    }

    console.log(`🏥 Fetching specialties for hospital: ${hospitalid}`);

    // ✅ Fetch doctors that belong to this hospital (via HospitalDoctor relation)
    const hospitalDoctors = await prisma.hospitalDoctor.findMany({
      where: { hospitalId: hospitalid },
      select: {
        doctor: {
          select: {
            id: true,
            specialities: {
              select: {
                speciality: {
                  select: { id: true, title: true },
                },
              },
            },
          },
        },
      },
    });

    // 🧠 Collect specialties and count doctors per specialty
    const specialityMap = new Map();

    hospitalDoctors.forEach(({ doctor }) => {
      doctor?.specialities?.forEach((spec) => {
        const s = spec.speciality;
        if (!s) return;
        if (!specialityMap.has(s.id)) {
          specialityMap.set(s.id, {
            id: s.id,
            title: s.title,
            doctorCount: 1,
          });
        } else {
          specialityMap.get(s.id).doctorCount += 1;
        }
      });
    });

    const specialties = Array.from(specialityMap.values());
    console.log(`✅ Found ${specialties.length} specialties for hospital ${hospitalid}`);

    return NextResponse.json({
      success: true,
      specialties,
    });
  } catch (error) {
    console.error("🔥 Error fetching specialties:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch specialties",
        error: error.message,
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
