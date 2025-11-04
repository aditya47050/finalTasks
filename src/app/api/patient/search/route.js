// app/api/patient/search/route.js
import { db } from "@/lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");

    if (!query) {
      return new Response(JSON.stringify({ error: "Query parameter is required" }), { status: 400 });
    }

    // Search by email or aadhar card number
    const patient = await db.Patient.findFirst({
      where: {
        OR: [
          { email: query },
          { aadharCardNumber: query }
        ]
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        middleName: true,
        lastName: true,
        aadharCardNumber: true,
        gender: true,         
        mobile: true,
        bloodgroup: true,
        dateOfBirth: true,
        presentAddress: true,
        state: true,
        district: true,
        taluka: true,
        pincode: true,
      }
    });

    if (!patient) {
      return new Response(JSON.stringify({ error: "Patient not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ patient }));
  } catch (error) {
    console.error("Error searching patient:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
