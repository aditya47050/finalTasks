import bcrypt from "bcryptjs";
import { db } from "@/lib/db"; // Ensure your db connection is correctly set up
import { NextResponse } from "next/server";

export async function POST(request) {
  const { mobile, email, password, pincode } = await request.json();

  // Check if the email is already registered
  const existingUser = await db.Doctor.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json({ success: false, message: "Email already registered" }, { status: 400 });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create the new doctor with default values for all fields
  const user = await db.Doctor.create({
    data: {
      mobile: mobile || "",
      email: email || "",
      password: hashedPassword,
      pincode: pincode || "",

  
      doctorinfo: {
        create: {
          passportphoto: "",
          profiledescription: "",
          consultationfee: "",
          onlineappointment: "",
          homehealthcarevisit: "",
          pancardno: "",
          pancardfront: "",
          aadharcardno: "",
          aadharcardfront: "",
          aadharcardback: "",
          presentaddress: "",
          city: "",
          state: "",
          district: "",
          taluka: "",
          bankName: "",
          accountNumber: "",
          ifscCode: "",
          accountType: "",
          cancelledCheque: "",
          micrCode: "",
          personalclinic: "",
          clinicinouttime: "",
          clinicconsultationfee: "",
        },
      },
    },
  });

  return NextResponse.json(
    { success: true, message: "New Doctor created", user },
    { status: 201 }
  );
}
