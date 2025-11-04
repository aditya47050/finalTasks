import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  const id = params.doctorid;

  try {
    const data = await request.formData();
    const profiledescription = data.get("profiledescription");
    const consultationfee = data.get("consultationfee");
    const onlineappointment = data.get("onlineappointment");
    const homehealthcarevisit = data.get("homehealthcarevisit");
    const pancardno = data.get("pancardno");
    const pancardfront = data.get("pancardfront");
    const aadharcardno = data.get("aadharcardno");
    const aadharcardfront = data.get("aadharcardfront");
    const aadharcardback = data.get("aadharcardback");
    const presentaddress = data.get("presentaddress");
    const city = data.get("city");
    const state = data.get("state");
    const district = data.get("district");
    const taluka = data.get("taluka");
    const bankName = data.get("bankName");
    const accountNumber = data.get("accountNumber");
    const ifscCode = data.get("ifscCode");
    const accountType = data.get("accountType");
    const cancelledCheque = data.get("cancelledCheque");
    const micrCode = data.get("micrCode");
    const pincode = data.get("pincode");

    // ✅ new fields
    const finalPrice = data.get("finalPrice");
    const discount = data.get("discount");

    const doctor = await db.Doctor.findUnique({
      where: { id },
      include: { doctorinfo: true },
    });

    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found." }, { status: 404 });
    }

    let updateddoctorinfo;
    if (doctor.doctorinfo) {
      // ✅ Update existing Doctorinfo record
      updateddoctorinfo = await db.Doctorinfo.update({
        where: { id: doctor.doctorinfo.id },
        data: {
          profiledescription,
          consultationfee,
          onlineappointment,
          homehealthcarevisit,
          pancardno,
          pancardfront,
          aadharcardno,
          aadharcardfront,
          aadharcardback,
          presentaddress,
          city,
          state,
          district,
          taluka,
          bankName,
          accountNumber,
          ifscCode,
          accountType,
          cancelledCheque,
          micrCode,
          pincode,

          // ✅ new fields
          finalPrice,
          discount,
        },
      });
    } else {
      // ✅ Create a new Doctorinfo record and link it
      const newDoctorinfo = await db.Doctorinfo.create({
        data: {
          profiledescription,
          consultationfee,
          onlineappointment,
          homehealthcarevisit,
          pancardno,
          pancardfront,
          aadharcardno,
          aadharcardfront,
          aadharcardback,
          presentaddress,
          city,
          state,
          district,
          taluka,
          bankName,
          accountNumber,
          ifscCode,
          accountType,
          cancelledCheque,
          micrCode,
          pincode,

          // ✅ new fields
          finalPrice,
          discount,
        },
      });

      // Link the new doctorinfo record
      await db.Doctor.update({
        where: { id },
        data: { doctorinfoId: newDoctorinfo.id },
      });

      updateddoctorinfo = newDoctorinfo;
    }

    return NextResponse.json(updateddoctorinfo);
  } catch (error) {
    console.error("Error updating doctor info:", error);
    return NextResponse.json(
      { error: "An error occurred: " + error.message },
      { status: 500 }
    );
  }
}
