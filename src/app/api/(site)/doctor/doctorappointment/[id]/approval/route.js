import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(request, context) {
  try {
    const { params } = context;
    const { id } = params;
    const { doctorNotes, status } = await request.json();

    const updatedAppointment = await db.bookFreeAppointment.update({
      where: { id },
      data: {
        ...(doctorNotes !== undefined && { doctorNotes }),
        ...(status !== undefined && { status }),
      },
    });

    return NextResponse.json(updatedAppointment);
  } catch (error) {
    console.error("Error updating appointment:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
