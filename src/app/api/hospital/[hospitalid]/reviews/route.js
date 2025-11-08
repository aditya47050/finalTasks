import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req, { params }) {
  try {
    // ✅ Match folder name — lowercase!
    const { hospitalid } = params;

    console.log("🧩 Extracted hospitalid:", hospitalid);

    // 🧠 Validate hospital ID
    if (!hospitalid) {
      return NextResponse.json(
        { success: false, message: "Hospital ID is required." },
        { status: 400 }
      );
    }

    // 🏥 Fetch reviews for this hospital
    const reviews = await db.hospitalReview.findMany({
      where: { hospitalId: hospitalid },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // 💡 No reviews found
    if (!reviews.length) {
      return NextResponse.json({
        success: true,
        message: "No reviews found for this hospital.",
        reviews: [],
        count: 0,
        averageRating: 0,
      });
    }

    // 📊 Calculate average rating
    const avgRating =
      reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length;

    // ✅ Respond with results
    return NextResponse.json({
      success: true,
      message: "Hospital reviews fetched successfully.",
      count: reviews.length,
      averageRating: parseFloat(avgRating.toFixed(1)),
      reviews,
    });
  } catch (error) {
    console.error("🔥 Error fetching hospital reviews:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch hospital reviews.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
