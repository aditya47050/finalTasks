import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/getsession";

export async function PATCH(request) {
  try {
    const body = await request.json(); // frontend sends PAN, GST, Aadhaar + brand info
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }

    const seller = await db.martSeller.findFirst({ where: { id: session.id } });
    if (!seller) {
      return NextResponse.json({ success: false, error: "Seller not found" }, { status: 404 });
    }

    // Merge existing documents with new ones
    const documents = {
      pan: {
        number: body.panNumber || seller.documents?.pan?.number || "",
        fileUrl: body.panCardUrl || seller.documents?.pan?.fileUrl || "",
      },
      gst: {
        number: body.gstNumber || seller.documents?.gst?.number || "",
        fileUrl: body.gstCardUrl || seller.documents?.gst?.fileUrl || "",
      },
      aadhar: {
        number: body.aadharNumber || seller.documents?.aadhar?.number || "",
        fileUrl: body.aadharCardUrl || seller.documents?.aadhar?.fileUrl || "",
      },
    };

    // Update seller documents
    await db.martSeller.update({
      where: { id: seller.id },
      data: { documents },
    });
    
   if (body.brandName) {
  const existingBrand = await db.brand.findFirst({
    where: { sellerId: seller.id }
  });

  if (existingBrand) {
    await db.brand.update({
      where: { id: existingBrand.id },
      data: {
        name: body.brandName,
        image: body.brandLogoUrl || null,
      },
    });
  } else {
    await db.brand.create({
      data: {
        name: body.brandName,         // ✅ actual value from request
        image: body.brandLogoUrl || null,
        sellerId: seller.id,
      },
    });
  }
}



    return NextResponse.json({ success: true, message: "Documents & brand updated successfully" });
  } catch (error) {
    console.error("[Documents PATCH error]:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
