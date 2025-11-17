// app/api/hospital/[hospitalid]/home-healthcare/route.js

import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const hospitalId = params.hospitalid;

  console.log("Hospital ID:", hospitalId);

  try {
    if (!hospitalId) {
      return NextResponse.json(
        { success: false, message: "Hospital ID is required" },
        { status: 400 }
      );
    }

    const homeHealthcare = await db.HomeHealthcare.findMany({
      where: {
        hospitalId: hospitalId,
      },
      select: {
        id: true,
        serviceName: true,
        // category: true,   ← YEH FIELD HAI HI NAHI → REMOVE KAR DO
        isAvailable: true,
        minPrice: true,
        maxPrice: true,
        startingPrice: true,
        finalprice: true,
        discount: true,
        hospitalId: true,
      },
      orderBy: {
        serviceName: "asc",
      },
    });

    return NextResponse.json(
      {
        success: true,
        homeHealthcare,
        count: homeHealthcare.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}