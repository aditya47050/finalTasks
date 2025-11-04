import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// GET reviews for a specific health insurance
export async function GET(req, { params }) {
  try {
    const reviews = await db.HealthInsuranceReview.findMany({
      where: { healthInsuranceId: params.healthInsuranceId },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Format patient full name
    const formattedReviews = reviews.map((review) => ({
      ...review,
      patient: {
        ...review.patient,
        name: [review.patient.firstName, review.patient.middleName, review.patient.lastName]
          .filter(Boolean)
          .join(" "),
      },
    }));

    return NextResponse.json(formattedReviews);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

// POST a new review
export async function POST(req, { params }) {
  try {
    const data = await req.json();
    if (!params.healthinsuranceid) {
      return NextResponse.json({ error: "Health Insurance ID is missing" }, { status: 400 });
    }

    const newReview = await db.HealthInsuranceReview.create({
      data: {
        healthInsurance: { connect: { id: params.healthinsuranceid } },
        patient: { connect: { id: data.patientId } },
        rating: data.rating,
        comment: data.comment,
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true,
          },
        },
      },
    });

    // Format patient name
    const formattedReview = {
      ...newReview,
      patient: {
        ...newReview.patient,
        name: [newReview.patient.firstName, newReview.patient.middleName, newReview.patient.lastName]
          .filter(Boolean)
          .join(" "),
      },
    };

    return NextResponse.json(formattedReview);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
  }
}
