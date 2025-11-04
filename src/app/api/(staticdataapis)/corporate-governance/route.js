import { db } from "@/lib/db";
import { sendCorporateGovernanceEmails } from "@/lib/nodemailer";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const data = await request.formData();

    const email = data.get("email");
    const mobile = data.get("mobile");
    const corporateyear = data.get("corporateyear");
    const fullname = data.get("fullname");
    const govtdocument = data.get("govtdocument");
    const message = data.get("message");

    // Create a new entry in the database for the Business Partnership Inquiry
    const CorporateGovernance = await db.CorporateGovernance.create({
      data: {
        email,
        mobile,
        corporateyear,
        fullname,
        govtdocument,
        message,
      },
    });

    // Construct the applicant data to send in the email
    const inquiryData = {
      email,
      mobile,
      corporateyear,
      fullname,
      govtdocument,
      message,
    };

    // Send email notifications to the admin
    const adminEmail = "abhishekpuranikpd@gmail.com"; // Replace with your admin email
    await sendCorporateGovernanceEmails(
      email,
      fullname,
      adminEmail,
      inquiryData
    );

    return NextResponse.json(
      {
        success: true,
        message: "Corporate Governance inquiry received",
        CorporateGovernance,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing Corporate Governance inquiry:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Error processing Corporate Governance inquiry",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
