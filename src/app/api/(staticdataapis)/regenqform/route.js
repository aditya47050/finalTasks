import { db } from '@/lib/db';
import { sendRegenqmail } from '@/lib/nodemailer';
import { NextResponse } from 'next/server'; // Ensure you import this if you're using Next.js

export async function POST(request) {
  try {
    // Parse FormData from the request
    const formData = await request.formData();

    // Extract fields from the FormData
    const enqperson = formData.get("enqperson");
    const mobile = formData.get("mobile");
    const email = formData.get("email");
    const category = formData.get("category");
    const company = formData.get("company");
    const pincode = formData.get("pincode");
    const address = formData.get("address");
    const idproof = formData.get("idproof");

    // Validate required fields
    const requiredFields = [enqperson, mobile, email, category, company, pincode, address, idproof];
    for (const field of requiredFields) {
      if (!field) {
        return NextResponse.json(
          { success: false, message: "All fields are required." },
          { status: 400 } // Bad Request
        );
      }
    }

    // Save the career application to the database
    const savedData = await db.RegEnqForm.create({
      data: { enqperson, email, mobile, category, company, pincode, address, idproof },
    });

    // Construct the applicant data to send in the email
    const applicantData = { enqperson, email, mobile, category, company, pincode, address, idproof };

    // Send email notifications to the applicant and the admin
    const adminEmail = "abhishekpuranikpd@gmail.com"; // Replace with your admin email
    await sendRegenqmail(email, enqperson, adminEmail, applicantData);

    // Return success response
    return NextResponse.json(
      { success: true, message: "Application received", data: savedData },
      { status: 201 } // Created
    );
  } catch (error) {
    console.error("Error processing application:", error);

    // Return error response
    return NextResponse.json(
      {
        success: false,
        message: "Error processing application",
        error: error.message,
      },
      { status: 500 } // Internal Server Error
    );
  }
}
