import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const serviceId = searchParams.get("serviceId");
    const hospitalId = searchParams.get("hospitalId");

    const where = {};
    if (serviceId) where.homeHealthcareId = serviceId;
    if (hospitalId) where.hospitalId = hospitalId;

    // ✅ Filter out reviews that may have invalid null productId
    const reviews = await db.review.findMany({
      where: {
        ...where,
        OR: [
          { productId: { equals: undefined } },
          { productId: { equals: "" } },
        ],
      },
      orderBy: { date: "desc" },
    });

    const totalReviews = reviews.length;
    const avgRating =
      totalReviews > 0
        ? (
            reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / totalReviews
          ).toFixed(1)
        : 0;

    return NextResponse.json({
      success: true,
      total: totalReviews,
      averageRating: avgRating,
      data: reviews,
    });
  } catch (error) {
    console.error("❌ Error fetching reviews:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      serviceId,
      hospitalId,
      rating,
      comment,
      userId,
      userEmail,
      userType,
    } = body;

    if (!hospitalId && !serviceId) {
      return NextResponse.json(
        { success: false, error: "hospitalId or serviceId required" },
        { status: 400 }
      );
    }

    if (!rating) {
      return NextResponse.json(
        { success: false, error: "rating is required" },
        { status: 400 }
      );
    }

    const newReview = await db.review.create({
      data: {
        hospitalId: hospitalId || null,
        homeHealthcareId: serviceId || null,
        rating: parseInt(rating),
        comment: comment || "",
        verified: true,
        userId: userId || "anonymous",
        userEmail: userEmail || "unknown@gmail.com",
        userType: userType || "guest",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Review submitted successfully",
      data: newReview,
    });
  } catch (error) {
    console.error("❌ Error creating review:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit review" },
      { status: 500 }
    );
  }
}
