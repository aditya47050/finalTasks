import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PUT(request, { params }) {
  const id = params.ambulanceid;

  try {
    const data = await request.formData();

    const ownerfirstname = data.get("ownerfirstname")?.toString() || "";
    const ownermiddlename = data.get("ownermiddlename")?.toString() || "";
    const ownerlastname = data.get("ownerlastname")?.toString() || "";
    const dateofbirthRaw = data.get("dateofbirth")?.toString() || "";
    const gender = data.get("gender")?.toString() || "";
    const alternatemobileno = data.get("alternatemobileno")?.toString() || "";
    const owneraadharcardno = data.get("owneraadharcardno")?.toString() || "";
    const ownerpanno = data.get("ownerpanno")?.toString() || "";
    const resetToken = data.get("resetToken")?.toString() || null;
    const resetTokenExpirationRaw =
      data.get("resetTokenExpiration")?.toString() || null;
    const role = data.get("role")?.toString() || "Ambulance";
    const adminname = data.get("adminname")?.toString() || "";
    const adminemail = data.get("adminemail")?.toString() || "";
    const admincontact = data.get("admincontact")?.toString() || "";

    const owneraadharcardfront = data.get("owneraadharcardfront");
    const owneraadharcardback = data.get("owneraadharcardback");
    const ownerpanfront = data.get("ownerpanfront");

    // Handle hspcategory[] titles
    const hspcategoryTitles = data.getAll("hspcategory[]") || [];
    let hspcategoryIds = [];

    if (hspcategoryTitles.length > 0) {
      const hspcategories = await db.hospitalsCategory.findMany({
        where: { title: { in: hspcategoryTitles } },
        select: { id: true },
      });

      hspcategoryIds = hspcategories.map((cat) => cat.id);

      if (!hspcategoryIds.length) {
        return NextResponse.json(
          { error: "Specialty categories not found." },
          { status: 400 }
        );
      }
    }

    // Validate required fields
    const requiredFields = {
      ownerfirstname,
      ownermiddlename,
      ownerlastname,
      dateofbirthRaw,
      gender,
      alternatemobileno,
      owneraadharcardno,
      owneraadharcardfront,
      owneraadharcardback,
      ownerpanno,
      ownerpanfront,
      adminname,
      adminemail,
      admincontact,
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value || value.toString().trim() === "")
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { message: `Missing fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    const dateofbirth = new Date(dateofbirthRaw);
    const resetTokenExpiration = resetTokenExpirationRaw
      ? new Date(resetTokenExpirationRaw)
      : null;

    if (isNaN(dateofbirth.getTime())) {
      return NextResponse.json(
        { message: "Invalid date of birth." },
        { status: 400 }
      );
    }

    const existing = await db.ambulance.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { message: "Ambulance owner not found." },
        { status: 404 }
      );
    }

    // ✅ Update main ambulance record
    const updated = await db.ambulance.update({
      where: { id },
      data: {
        ownerfirstname,
        ownermiddlename,
        ownerlastname,
        dateofbirth:dateofbirth.toISOString(),
        gender,
        alternatemobileno,
        owneraadharcardno,
        ownerpanno,
        resetToken,
        resetTokenExpiration,
        role,
        owneraadharcardfront,
        owneraadharcardback,
        ownerpanfront,
        adminname,
        adminemail,
        admincontact,
      },
    });

    // ✅ Get corresponding AmbulanceHsp ID
    const ambulanceHsp = await db.ambulanceHsp.findUnique({
      where: { ambulanceId: id },
    });

    if (!ambulanceHsp) {
      return NextResponse.json(
        { message: "AmbulanceHsp not found." },
        { status: 404 }
      );
    }

    // ✅ Update HspCategory relations
    if (hspcategoryIds.length > 0) {
      // Remove old relations
      await db.hspCategory.deleteMany({
        where: { ambulanceHspId: ambulanceHsp.id },
      });

      // Create new relations
      await db.hspCategory.createMany({
        data: hspcategoryIds.map((catId) => ({
          ambulanceHspId: ambulanceHsp.id,
          hspcategoryId: catId,
          hspInfoId: ambulanceHsp.id, // optional: adjust if needed
        })),
      });
    }

    return NextResponse.json({
      message: "Updated successfully.",
      data: updated,
    });
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json(
      { message: "An error occurred: " + error.message },
      { status: 500 }
    );
  }
}
