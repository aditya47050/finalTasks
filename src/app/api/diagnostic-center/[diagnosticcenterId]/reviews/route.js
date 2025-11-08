import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * @route   GET /api/diagnostic-center/[diagnosticcenterId]/reviews
 * @desc    Fetch reviews for a diagnostic center
 */
export async function GET(req, context) {
  try {
    // ✅ Await params
    const { diagnosticcenterId } = await context.params;

    if (!diagnosticcenterId) {
      return NextResponse.json(
        { success: false, message: "Diagnostic Center ID is required." },
        { status: 400 }
      );
    }

    console.log(`💬 Fetching reviews for Diagnostic Center: ${diagnosticcenterId}`);

    // ✅ Fetch all reviews for this diagnostic center
    const reviews = await prisma.hospitalReview.findMany({
      where: { hospitalId: diagnosticcenterId },
      include: {
        patient: {
          select: {
            id: true,
            email: true,
            mobile: true,
            firstName: true,
            middleName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // ✅ Transform data for cleaner frontend
    const formatted = reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt,
      patient: {
        id: r.patient?.id || null,
        name:
          [r.patient?.firstName, r.patient?.middleName, r.patient?.lastName]
            .filter(Boolean)
            .join(" ") || "Anonymous Patient",
        email: r.patient?.email || "N/A",
        mobile: r.patient?.mobile || "N/A",
      },
    }));

    if (!formatted.length) {
      return NextResponse.json({
        success: true,
        message: "No reviews available for this diagnostic center.",
        data: [],
      });
    }

    console.log(`✅ Found ${formatted.length} reviews`);
    return NextResponse.json({
      success: true,
      message: "Reviews fetched successfully.",
      data: formatted,
    });
  } catch (error) {
    console.error("❌ Error fetching reviews:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch reviews.",
        error: error.message,
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
