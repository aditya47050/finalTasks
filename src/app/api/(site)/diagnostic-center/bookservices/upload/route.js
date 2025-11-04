import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(request) {
  const { bookingId, report, receipt } = await request.json();

  try {
    const updatedBooking = await db.bookDiagnosticService.update({
      where: { id: bookingId },
      data: {
        report: report || undefined,
        receipt: receipt || undefined,
      },
    });

    return NextResponse.json({ success: true, updatedBooking });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
