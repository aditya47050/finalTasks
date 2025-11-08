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

    // Fetch ambulances linked to this hospital
    const hospitalAmbulances = await db.HospitalAmbulance.findMany({
      where: { hospitalId: hospitalid },
      include: {
        ambulance: true, // Include full ambulance details
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Format the ambulance data
    const ambulances = hospitalAmbulances.map((ha) => {
      const ambulance = ha.ambulance;
      return {
        id: ambulance.id,
        model: ambulance.ambulancemodel,
        number: ambulance.ambulancenumber,
        type: ambulance.ambulancetype,
        driverName: ambulance.drivername,
        driverNumber: ambulance.drivernumber,
        status: ha.status || "pending",
        createdAt: ha.createdAt,
        hospitalId: ha.hospitalId,
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
