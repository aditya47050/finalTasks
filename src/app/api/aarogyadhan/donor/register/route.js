import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // Adjust this import based on your project structure
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const {
      email,
      mobile,
      fullName,
      pincode,
      password,
      patientId,
      panno,
      aadharno,
      pancardImage,
      aadharCardImage,
    } = await request.json();

    // Validate required fields
    if (!email || !mobile || !fullName || !pincode || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Please ensure all mandatory fields are provided.",
        },
        { status: 400 }
      );
    }

    // Check if donor already exists
    const existingDonor = await db.donor.findFirst({
      where: { email },
    });

    if (existingDonor) {
      return NextResponse.json(
        {
          success: false,
          message: "A donor with this email already exists. Please use a different email or log in.",
        },
        { status: 409 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new donor record
    const newDonor = await db.donor.create({
      data: {
        email,
        mobile,
        fullname: fullName,
        pincode,
        password: hashedPassword,
        patient: {
          connect: { id: patientId },
        },
        panno,
        aadharno,
        pancardimage: pancardImage,
        aadharcardimage: aadharCardImage,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Donor registered successfully.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred during registration. Please try again later or contact support.",
      },
      { status: 500 }
    );
  }
}
