import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req, context) {
  try {
    // ✅ await params
    const { hospitalid } = await context.params;
    const hospitalId = hospitalid;

    // Destructure incoming JSON
    const {
      name,
      chargeType,
      minPrice,
      maxPrice,
      finalPrice,
      discount,
      bedCount,
      hasgovernmentschema,
      schema,
      schemabedcounts,
      images,
    } = await req.json();

    // ✅ normalize chargeType to Prisma enum
    // in your POST/PUT API handler
const normalizedChargeType =
  chargeType?.toLowerCase() === "hourly"
    ? "Hourly"
    : chargeType?.toLowerCase() === "daily"
    ? "daily"
    : null;


    const normalizedSchema = Array.isArray(schema) ? schema : [];

    const safeImages = (images || []).map((img) => {
      if (typeof img !== "string" || img.trim() === "") return null;
      if (img.length > 1000) throw new Error("Image string too long for DB column");
      return img;
    });
    console.log(normalizedChargeType);

    const result = await db.$transaction(async (tx) => {
      const bedCategory = await tx.bedCategory.create({
        data: {
          name,
          chargeType: normalizedChargeType,
          minPrice: minPrice || null,
          maxPrice: maxPrice || null,
          finalPrice: finalPrice || null,
          discount: discount || null,
          bedCount,
          hasgovernmentschema,
          schema: normalizedSchema,
          schemabedcounts: schemabedcounts ? JSON.stringify(schemabedcounts) : null,
          hospitalId,
          image: safeImages[0] || null,
          image1: safeImages[1] || null,
          image2: safeImages[2] || null,
          image3: safeImages[3] || null,
        },
      });

      // Get last bed number
            // Get last bed number
      const lastBed = await tx.bed.findFirst({
        where: { hospitalId },
        orderBy: { bedNumber: "desc" },
      });
      let bedNumber = lastBed ? lastBed.bedNumber + 1 : 1;

      // Prepare all beds in memory
      const bedsToCreate = [];

      // Government beds
      const totalSchemeBeds = Object.values(schemabedcounts || {}).reduce(
        (a, b) => a + Number(b || 0),
        0
      );
      const privateBedCount = Math.max(bedCount - totalSchemeBeds, 0);

      for (const [schemeName, count] of Object.entries(schemabedcounts || {})) {
        for (let i = 0; i < Number(count || 0); i++) {
          bedsToCreate.push({
            bedNumber: bedNumber++,
            status: "AVAILABLE",
            hospitalId,
            categoryId: bedCategory.id,
            scheme: hasgovernmentschema ? "Government" : schemeName,
          });
        }
      }

      // Private beds
      for (let i = 0; i < privateBedCount; i++) {
        bedsToCreate.push({
          bedNumber: bedNumber++,
          status: "AVAILABLE",
          hospitalId,
          categoryId: bedCategory.id,
          scheme: "Private",
        });
      }

      // ✅ Single bulk insert instead of hundreds of queries
      if (bedsToCreate.length > 0) {
        await tx.bed.createMany({
          data: bedsToCreate,
        });
      }


      return await tx.bedCategory.findUnique({
        where: { id: bedCategory.id },
        include: { beds: { orderBy: { bedNumber: "asc" } } },
      });
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error creating bed category:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
