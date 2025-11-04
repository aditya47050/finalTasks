import { NextResponse } from "next/server";
import { db } from "@/lib/db"; 

// Generate paginated & searchable list
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") || "1");
    const pageSize = Number(searchParams.get("pageSize") || "10");
    const search = (searchParams.get("search") || "").toLowerCase();
    const status = searchParams.get("status") || "ALL";

    // Build Prisma query
    const where = {};
    if (status !== "ALL") {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { cityTargets: { contains: search, mode: "insensitive" } },
        { userEmail: { contains: search, mode: "insensitive" } },
        { role: { contains: search, mode: "insensitive" } },
      ];
    }

    const total = await db.adRequest.count({ where });
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const data = await db.adRequest.findMany({
      where:{
        role:"Ambulance"
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return NextResponse.json({ data, total, page, pageSize, totalPages });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch ad requests" }, { status: 500 });
  }
}

// Create new ad request
export async function POST(req) {
  try {
    const body = await req.json();
    if (!body.cityTargets || !body.startDate || !body.endDate) {
      return NextResponse.json({ error: "cityTargets, startDate, endDate are required" }, { status: 400 });
    }
    console.log(body);
    const now = new Date();
    const newAd = await db.adRequest.create({
      data: {
        userId: body.userId,
        userEmail: body.userEmail,
        role: body.role,
        cityTargets: body.cityTargets,
        radiusKm: body.radiusKm ? Number(body.radiusKm) : null,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        status: body.status || "PENDING",
        adminRemarks: body.adminRemarks || null,
        createdAt: now,
        updatedAt: now,
      },
    });

    return NextResponse.json(newAd);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create ad request" }, { status: 500 });
  }
}
