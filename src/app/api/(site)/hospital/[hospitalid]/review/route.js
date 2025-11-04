import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
const reviews = await db.hospitalReview.findMany({
  where: { hospitalId: params.hospitalid },
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

// Format patient name before sending response
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
}

export async function POST(req, { params }) {
  const data = await req.json();

  if (!params.hospitalid) {
    return NextResponse.json(
      { error: "Hospital ID is missing" },
      { status: 400 }
    );
  }

  const newReview = await db.hospitalReview.create({
    data: {
      hospital: { connect: { id: params.hospitalid } },
      patient: { connect: { id: data.patientId } },
      rating: data.rating,
      comment: data.comment,
    },
  });

  return NextResponse.json(newReview);
}
