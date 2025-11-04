import { db } from "@/lib/db";

export async function POST(request) {
  try {
    const body = await request.json();
    const { category, name, email, mobile, city, pincode } = body;

    // Collect validation errors
    const errors = {};

    if (!category) errors.category = "Category is required";
    if (!name) errors.name = "Full Name is required";
    if (!email) errors.email = "Email is required";
    if (!mobile) errors.mobile = "Mobile number is required";
    if (!city) errors.city = "City is required";
    if (!pincode) errors.pincode = "Pincode is required";

    // Validate email format
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      errors.email = "Invalid email format";
    }

    // Validate mobile number (10 digits)
    if (mobile && !/^\d{10}$/.test(mobile)) {
      errors.mobile = "Invalid mobile number (should be 10 digits)";
    }

    // Validate pincode (6 digits)
    if (pincode && !/^\d{6}$/.test(pincode)) {
      errors.pincode = "Invalid pincode (should be 6 digits)";
    }

    // If there are validation errors, return them
    if (Object.keys(errors).length > 0) {
      return new Response(JSON.stringify({ success: false, errors }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Store data in the database
    const newEnquiry = await db.AarogyaMitraEnq.create({
      data: { category, name, email, mobile, city, pincode },
    });

    return new Response(
      JSON.stringify({ success: true, message: "Enquiry submitted successfully", data: newEnquiry }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("API Error:", error);

    // Handle unique constraint errors (e.g., duplicate email)
    if (error.code === "P2002") {
      return new Response(JSON.stringify({ success: false, message: "Email already exists" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Handle general server errors
    return new Response(JSON.stringify({ success: false, message: "Internal Server Error", error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
