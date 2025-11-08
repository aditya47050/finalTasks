import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req, context) {
  try {
    const params = await context.params;
    const { hospitalid } = params;

    if (!hospitalid) {
      return NextResponse.json(
        { success: false, message: "Hospital ID is required" },
        { status: 400 }
      );
    }

    const wellnessPackages = await db.wellnesspackage.findMany({
      where: { hospitalId: hospitalid },
      orderBy: { aapackagename: "asc" }, // ✅ valid field
    });

    if (!wellnessPackages || wellnessPackages.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No wellness packages found for this hospital.",
        wellnessPackages: [],
        count: 0,
      });
    }

    const formattedPackages = wellnessPackages.map((pkg) => ({
      id: pkg.id,
      name: pkg.aapackagename || pkg.labpackagename || "Unnamed Package",
      labPackage: pkg.labpackagename,
      includes: pkg.includestest
        ? pkg.includestest.split(",").map((i) => i.trim())
        : [],
      price: pkg.price || 0,
      finalPrice: pkg.finalpackageprice || pkg.price || 0,
      discount: pkg.discount || "0%",
      available: pkg.available ?? true,
      homevisit: pkg.homevisit ?? false,
      hospitalId: pkg.hospitalId,
    }));

    return NextResponse.json({
      success: true,
      count: formattedPackages.length,
      wellnessPackages: formattedPackages,
    });
  } catch (error) {
    console.error("🔥 Error fetching wellness packages:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch wellness packages.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
