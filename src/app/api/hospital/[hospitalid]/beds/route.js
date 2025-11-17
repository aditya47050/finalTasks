// src/app/api/hospital/[hospitalid]/beds/route.js
import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // your Prisma client

function safeNumber(v) {
  if (v === null || v === undefined) return null;
  // v might be a number-like string (e.g. "1000" or "1,000")
  // Remove commas and whitespace then try parseFloat
  const cleaned = String(v).replace(/,/g, "").trim();
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : null;
}

export async function GET(req, { params }) {
  try {
    const { hospitalid } = params;
    if (!hospitalid) {
      return NextResponse.json({ error: "Hospital ID is required" }, { status: 400 });
    }

    // fetch beds (with category)
    const hospitalBeds = await db.Bed.findMany({
      where: { hospitalId: hospitalid },
      include: {
        category: true, // BedCategory relation
      },
      orderBy: { createdAt: "desc" },
    });

    // fetch hospital top-level relations (hspInfo, hspcontact)
    // Use findUnique if id is unique, else findFirst. Here id is primary so findUnique is fine.
    const hospitalRecord = await db.Hospital.findUnique({
      where: { id: hospitalid },
      include: {
        hspInfo: true,
        hspcontact: true,
        BedCategory: {
          select: {
            minPrice: true,
            maxPrice: true,
            finalPrice: true,
          },
        },
      },
    });

    // compute minPrice / maxPrice from BedCategory (if present), otherwise from bed categories
    let minPrice = null;
    let maxPrice = null;

    const allCategoryNumbers = [];

    // collect from Hospital.BedCategory if present
    if (hospitalRecord?.BedCategory?.length) {
      for (const c of hospitalRecord.BedCategory) {
        const candidates = [c.minPrice, c.maxPrice, c.finalPrice];
        for (const val of candidates) {
          const n = safeNumber(val);
          if (n !== null) allCategoryNumbers.push(n);
        }
      }
    }

    // also collect from fetched bed -> category.finalPrice (in case BedCategory wasn't included)
    for (const b of hospitalBeds) {
      const fp = b?.category?.finalPrice;
      const n = safeNumber(fp);
      if (n !== null) allCategoryNumbers.push(n);
      // also check category.minPrice/maxPrice if available on the nested category
      if (b?.category?.minPrice) {
        const mn = safeNumber(b.category.minPrice);
        if (mn !== null) allCategoryNumbers.push(mn);
      }
      if (b?.category?.maxPrice) {
        const mx = safeNumber(b.category.maxPrice);
        if (mx !== null) allCategoryNumbers.push(mx);
      }
    }

    if (allCategoryNumbers.length) {
      minPrice = Math.min(...allCategoryNumbers);
      maxPrice = Math.max(...allCategoryNumbers);
      // convert to strings to match your existing responses (optional)
      minPrice = String(minPrice);
      maxPrice = String(maxPrice);
    }

    // map beds into clean shape (match your example)
    const beds = hospitalBeds.map((b) => ({
      id: b.id,
      bedNumber: b.bedNumber,
      status: b.status,
      createdAt: b.createdAt,
      hospitalId: b.hospitalId,
      category: b.category
        ? {
            id: b.category.id,
            name: b.category.name,
            chargeType: b.category.chargeType,
            // finalPrice/minPrice/maxPrice in DB are strings in your schema, so forward as-is
            finalPrice: b.category.finalPrice ?? null,
            minPrice: b.category.minPrice ?? null,
            maxPrice: b.category.maxPrice ?? null,
            discount: b.category.discount ?? null,
            image: b.category.image ?? null,
          }
        : null,
    }));

    // prepare hospital summary
    const hospital = {
      id: hospitalRecord?.id ?? hospitalid,
      name: hospitalRecord?.hspInfo?.regname ?? null,
      city: hospitalRecord?.hspcontact?.city ?? null,
      address: hospitalRecord?.hspcontact?.address ?? null,
      minPrice: minPrice,
      maxPrice: maxPrice,
    };

    return NextResponse.json({
      success: true,
      hospital,
      beds,
      count: beds.length,
    });
  } catch (error) {
    console.error("❌ Error fetching hospital beds:", error);
    // prefer not to leak stack to client; include message for debugging
    return NextResponse.json(
      { error: "Failed to fetch beds", details: error?.message ?? String(error) },
      { status: 500 }
    );
  }
}
