import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  const id = params.hospitalid;

  try {
    // Fetch the hospital data
    const hospital = await db.Hospital.findUnique({
      where: { id },
      include: { HospitalPayment: true },
    });

    if (!hospital) {
      return NextResponse.json(
        { error: "Hospital not found." },
        { status: 404 }
      );
    }

    // Check if the payment is successful
    const isPaid = Array.isArray(hospital.HospitalPayment)
      ? hospital.HospitalPayment.some(
          (p) =>
            p.forwhat === "Yearly Subscription Fee" &&
            p.paymentStatus === "SUCCESS"
        )
      : false;

    if (!isPaid) {
      return NextResponse.json(
        { error: "Payment not received." },
        { status: 400 }
      );
    }

    // Update the hospital status to SUBMITTED
    const updatedHospital = await db.Hospital.update({
      where: { id },
      data: { approvalStatus: "SUBMITTED" },
    });

    return NextResponse.json(updatedHospital);
  } catch (error) {
    console.error("Error finalizing hospital submission:", error);
    return NextResponse.json(
      { error: "An error occurred: " + error.message },
      { status: 500 }
    );
  }
}
