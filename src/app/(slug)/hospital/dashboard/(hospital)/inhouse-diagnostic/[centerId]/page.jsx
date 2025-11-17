import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req, context) {
  try {
    const params = await context.params;
    const { hospitalid, centerid } = params;

    if (!hospitalid || !centerid) {
      return NextResponse.json(
        { success: false, message: "Missing hospital or center id" },
        { status: 400 }
      );
    }

    // Check if linked
    const link = await db.hospitalHomeHealthcare.findFirst({
      where: {
        hospitalId: hospitalid,
        homeHealthcareId: centerid,
      },
      include: {
        homeHealthcare: {
          include: {
            hspInfo: true,
            hspcontact: true,
          },
        },
      },
    });

    if (!link) {
      return NextResponse.json(
        { success: false, message: "Center not linked with hospital" },
        { status: 404 }
      );
    }

    // Fetch services created by that home healthcare center
    const services = await db.homeHealthcare.findMany({
      where: {
        hospitalId: centerid,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      center: link.homeHealthcare,
      services,
      count: services.length,
    });
  } catch (error) {
    console.error("FETCH HH SERVICES ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
