import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 🏠 GET: Fetch all Home Healthcare Services for a given Hospital
export async function GET(req) {
  try {
    // Extract hospitalId from URL query
    const { searchParams } = new URL(req.url);
    const hospitalId = searchParams.get("hospitalId");

    if (!hospitalId) {
      return NextResponse.json(
        { success: false, message: "Hospital ID is required" },
        { status: 400 }
      );
    }

    // Fetch services from DB
    const services = await prisma.homeHealthcare.findMany({
      where: { hospitalId },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        serviceName: true,
        startingPrice: true,
        minPrice: true,
        maxPrice: true,
        finalprice: true,
        discount: true,
        isAvailable: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!services || services.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No home healthcare services found for this hospital.",
        data: [],
      });
    }

    return NextResponse.json({
      success: true,
      message: "Home healthcare services fetched successfully.",
      data: services,
    });
  } catch (error) {
    console.error("🔥 Error fetching Home Healthcare Services:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching Home Healthcare Services",
        error: error.message,
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
