import { db } from "@/lib/db"; // Ensure your db connection is correctly set up
import { NextResponse } from "next/server";

export async function POST(request) {
  const {
    email,
    mobile,
    pincode,
    name,
    address,
    district,
    state,
    taluka,
    incharge,
    inchargeaadharno,
    inchargeaadhardoc,
    shopactdoc,
    inchargepanno,
    inchargepandoc,
    addressproofdoc,
    addressproofType,
    regcertificate,
    alternatemobile,
    bankName,
    accountNumber,
    ifscCode,
    accountType,
    cancelledCheque,
    micrCode,
    logo,
    inchargeprofilepic,
    esevaId,
  } = await request.json();

  try {
    // Use a transaction to ensure all operations succeed or fail together
    const esevaProfile = await db.$transaction(async (prisma) => {
      // Batch 1: Basic Information
      const basicInfo = await prisma.Eseva.update({
        where: { id: esevaId },
        data: {
          email,
          mobile,
          pincode,
          name,
          address,
          district,
          state,
          taluka,
          incharge,
          inchargeaadharno,
        },
      });

      // Batch 2: Document Information
      const documentInfo = await prisma.Eseva.update({
        where: { id: esevaId },
        data: {
          inchargeaadhardoc,
          inchargeprofilepic,
          inchargepanno,
          inchargepandoc,
          addressproofdoc,
          addressproofType,
          regcertificate,
        },
      });

      // Batch 3: Bank and Additional Information
      const otherInfo = await prisma.Eseva.update({
        where: { id: esevaId },
        data: {
          alternatemobile,
          bankName,
          accountNumber,
          ifscCode,
          accountType,
          cancelledCheque,
          micrCode,
          logo,
          shopactdoc,
        },
      });

      return otherInfo;
    }, { timeout: 15000 } );

    return NextResponse.json(
      {
        success: true,
        message: "Eseva profile saved successfully!",
        esevaProfile,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Saving failed", error: error.message },
      { status: 500 }
    );
  }
}
