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

    // Fetch ambulances assigned to hospital
    const hospitalAmbulances = await db.HospitalAmbulance.findMany({
      where: { hospitalId: hospitalid },
      include: {
        ambulance: {
          include: {
            AmbulanceVaichicle: {
              include: {
                driver: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const ambulances = hospitalAmbulances.map((ha) => {
      const a = ha.ambulance;
      const v = a?.AmbulanceVaichicle?.[0] || null; // single vehicle
      const d = v?.driver || null;

      return {
        id: ha.id, // HospitalAmbulance ID
        email: a.email,
        mobile: a.mobile,
        category: a.category,
        status: ha.status || "PENDING",
        createdAt: ha.createdAt,
        hospitalId: ha.hospitalId,

        // 🔥 MOST IMPORTANT → This is the ID for the single view page
        vehicleId: v?.id || null,

        vehicle: {
          model: v?.ambulancemodel || null,
          type: v?.ambulancetype || null,
          category: v?.ambulancecategory || null,
          pincode: v?.ambulanceareapincode || null,
          frontImage: v?.ambulancefrontimage || null,
          insideImage: v?.ambulanceinsideimage || null,
          rcBook: v?.ambulancercbook || null,
          insurance: v?.ambulanceinsurance || null,
        },

        driver: {
          name: `${d?.firstname || ""} ${d?.lastname || ""}`.trim() || "N/A",
          mobile: d?.mobile || null,
        },
      };
    });

    return NextResponse.json({
      success: true,
      ambulances,
      count: ambulances.length,
    });
  } catch (error) {
    console.error("❌ Error fetching hospital ambulances:", error);
    return NextResponse.json(
      { error: "Failed to fetch ambulances", details: error.message },
      { status: 500 }
    );
  }
}
