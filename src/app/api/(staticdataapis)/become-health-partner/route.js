import { db } from "@/lib/db";
import { sendAarogyaMitraEmails } from "@/lib/nodemailer";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const data = await request.formData();

    const email = data.get("email");
    const mobile = data.get("mobile");
    const category = data.get("category");
    const hspfullname = data.get("hspfullname");
    const govtdocument = data.get("govtdocument");
    const message = data.get("message");
    const address = data.get("address");
    const pincode = data.get("pincode");

    // Create a new entry in the database for the Aarogya mitra registration
    const businessPartnershipEnq = await db.AarogyaMitra.create({
      data: {
        email,
        mobile,
        category,
        hspfullname,
        govtdocument,
        message,
        address,
        pincode,
      },
    });

    // Construct the applicant data to send in the email
    const inquiryData = {
      email,
      mobile,
      category,
      hspfullname,
      govtdocument,
      message,
      address,
      pincode,
    };

    // Send email notifications to the admin
    const adminEmail = "abhishekpuranikpd@gmail.com"; // Replace with your admin email
    await sendAarogyaMitraEmails(email, hspfullname, adminEmail, inquiryData);

    return NextResponse.json(
      {
        success: true,
        message: "Aarogya mitra registration received",
        businessPartnershipEnq,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing Aarogya mitra registration:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Error processing Aarogya mitra registration",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
