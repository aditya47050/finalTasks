// src/app/api/photographer/register/route.js

import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // Adjust this import based on your project structure
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const {
      email,
      fullname,
      mobile,
      pincode,
      city,
      taluka,
      district,
      state,
      password,
      passportphoto,
      aadharcardno,
      aadharcardimage,
      companyname,
      pancardno,
      pancardimage,
      companyaddress,
      alternateno,
      bankName,
      accountNumber,
      ifscCode,
      accountType,
      cancelledCheque,
    } = await request.json();

    // Validate required fields
    if (!email || !fullname || !mobile || !pincode || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Please ensure all mandatory fields are provided.",
        },
        { status: 400 }
      );
    }

    // Check if photographer already exists
    const existingPhotographer = await db.photographer.findFirst({
      where: { email },
    });

    if (existingPhotographer) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A photographer with this email already exists. Please use a different email or log in.",
        },
        { status: 409 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new photographer record
    const newPhotographer = await db.photographer.create({
      data: {
        email,
        fullname,
        mobile,
        pincode,
        city,
        taluka,
        district,
        state,
        password: hashedPassword,
        passportphoto,
        aadharcardno,
        aadharcardimage,
        companyname,
        pancardno,
        pancardimage,
        companyaddress,
        alternateno,
        bankName,
        accountNumber,
        ifscCode,
        accountType,
        cancelledCheque,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Photographer registered successfully.",
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Registration failed. Please try again.",
      },
      { status: 500 }
    );
  }
}
