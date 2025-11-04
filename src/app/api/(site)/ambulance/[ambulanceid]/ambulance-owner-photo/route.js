import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  const id = params.ambulanceid;

  try {
    const data = await request.formData();
    const passportphoto = data.get("passportphoto");

    const ambulance = await db.Ambulance.findUnique({
      where: { id },
    });

    if (!ambulance) {
      return NextResponse.json(
        { error: "Ambulance not found." },
        { status: 404 }
      );
    }

    let updatedlogo;

    if (ambulance) {
      updatedlogo = await db.Ambulance.update({
        where: { id },
        data: { passportphoto },
      });
    } else {
      updatedlogo = await db.Ambulance.create({
        data: {
          passportphoto,
        },
      });
    }

    return NextResponse.json(updatedlogo);
  } catch (error) {
    console.error("Error updating Hsp logo:", error);
    return NextResponse.json(
      { error: "An error occurred: " + error.message },
      { status: 500 }
    );
  }
}
