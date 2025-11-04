import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  const id = params.doctorid;

  try {
    const data = await request.formData();
    const passportphoto = data.get("passportphoto");

    const doctor = await db.Doctor.findUnique({
      where: { id },
      include: { doctorinfo: true },
    });

    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found." }, { status: 404 });
    }

    let updateddoctorinfo;
    if (doctor.doctorinfo) {
      // Update existing HspInfo record
      updateddoctorinfo = await db.Doctorinfo.update({
        where: { id: doctor.doctorinfo.id },
        data: {
          passportphoto,
        },
      });
    } else {
      // Create a new HspInfo record and link it to the Hospital
      const newDoctorinfo = await db.Doctorinfo.create({
        data: {
          passportphoto,
        },
      });

      // Update the Hospital record to link to this new HspInfo record
      await db.Doctor.update({
        where: { id },
        data: { doctorinfoId: newDoctorinfo.id },
      });

      updateddoctorinfo = newDoctorinfo;
    }

    return NextResponse.json(updateddoctorinfo);
  } catch (error) {
    console.error("Error updating  info:", error);
    return NextResponse.json(
      { error: "An error occurred: " + error.message },
      { status: 500 }
    );
  }
}
