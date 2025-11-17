import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const {
      email,
      phone,
      password,
      pincode,
      address,
      gstNumber,
      panNumber,
      panCardUrl,
      aadharNumber,
      aadharCardUrl,
      brandName,
      brandLogoUrl
    } = await request.json();

    // Check duplicate
    const existingSeller = await db.MartSeller.findUnique({ where: { email } });
    if (existingSeller) {
      return NextResponse.json({ message: "Email already registered" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save documents JSON object
    const documents = {
      gstNumber: gstNumber || null,
      pan: {
        number: panNumber || null,
        fileUrl: panCardUrl || null,
      },
      aadhar: {
        number: aadharNumber || null,
        fileUrl: aadharCardUrl || null,
      },
    };

    // Create seller with brand
    const seller = await db.MartSeller.create({
      data: {
        email,
        mobile: phone,
        password: hashedPassword,
        pincode,
        address,
        documents,
        status: "PENDING",
        brands: {
          create: {
            name: brandName,
            image: brandLogoUrl || null,
          },
        },
      },
      include: { brands: true }, // include created brand
    });

    return NextResponse.json(
      {
        message: "Registration successful. Awaiting superadmin approval.",
        seller,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Mart Seller Register Error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

