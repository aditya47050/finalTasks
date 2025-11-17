import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// ---------------------------------------------------
// GET Inhouse Canteen Info
// ---------------------------------------------------
export async function GET(req, { params }) {
  try {
    const { hospitalid } = params;

    if (!hospitalid) {
      return NextResponse.json(
        { success: false, message: "Hospital ID is required." },
        { status: 400 }
      );
    }

    const hospital = await db.hospital.findUnique({
      where: { id: hospitalid },
      select: {
        inhouseCanteenJson: true,
      },
    });

    if (!hospital || !hospital.inhouseCanteenJson) {
      return NextResponse.json({
        success: true,
        message: "No Inhouse Canteen data found for this hospital.",
        canteen: null,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Inhouse Canteen data fetched successfully.",
      canteen: hospital.inhouseCanteenJson,
    });
  } catch (error) {
    console.error("🔥 Error fetching Inhouse Canteen data:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch Inhouse Canteen data.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------
// PUT Update Inhouse Canteen Info
// ---------------------------------------------------
export async function PUT(req, { params }) {
  try {
    const { hospitalid } = params;
    const body = await req.json();

    if (!hospitalid) {
      return NextResponse.json(
        { success: false, message: "Hospital ID is required." },
        { status: 400 }
      );
    }

    // 🔥 ENSURE BOOLEAN CORRECTLY — FINAL FIX
    const isAvailable = Boolean(body.available);

    // 🔥 Construct final JSON to store
    const updatedCanteenData = {
      available: isAvailable,
      capacity: body.capacity || "",
      openHours: body.openHours || "",
      menuHighlights: Array.isArray(body.menuHighlights)
        ? body.menuHighlights
        : [],
      hygieneCertified: Boolean(body.hygieneCertified),
      managedBy: body.managedBy || "",
      contact: {
        managerName: body?.contact?.managerName || "",
        phone: body?.contact?.phone || "",
      },
    };

    // ---------------------------------------------------
    // Update inhouseCanteenJson + Hospital Services flag
    // ---------------------------------------------------
    const updated = await db.hospital.update({
      where: { id: hospitalid },
      data: {
        inhouseCanteenJson: updatedCanteenData,

        // 🔥 ALSO update hospital service availability
        hspInfo: {
          update: {
            inhousecanteen: isAvailable ? "yes" : "no",
          },
        },
      },
      include: { hspInfo: true },
    });

    return NextResponse.json({
      success: true,
      message: "Inhouse Canteen updated successfully.",
      canteen: updated.inhouseCanteenJson,
    });
  } catch (error) {
    console.error("🔥 Error updating Inhouse Canteen:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update Inhouse Canteen.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
