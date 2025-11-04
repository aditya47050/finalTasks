import { db } from "@/lib/db";
import nodemailer from "nodemailer";

async function sendEnquiryEmail(data) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <p style="font-size: 14px; color: #555;">This is an Automatic Mail, Don’t Reply</p>
      <h3>Dear ${data.name},</h3>
      <p>Thank you for submitting your HSP Portal enquiry. Our team will connect you shortly.</p>
      <p><strong>Your Submitted Details:</strong></p>
      <ul>
        <li>Category: ${data.category}</li>
        <li>Name: ${data.name}</li>
        <li>Email: ${data.email}</li>
        <li>Mobile: ${data.mobile}</li>
        <li>Designation: ${data.designation}</li>
        <li>Gender: ${data.gender}</li>
      </ul>

      <p>Best Regards,<br/>Aarogya Rakshak Team</p>
      <img src="https://res.cloudinary.com/dnckhli5u/image/upload/v1728891425/Picture1_c31red.png" alt="Aarogya Aadhar Logo" style="width: full; height: 400px;" />

      <h3 style="color: #243460;">Connect</h3>
      <p>Follow Aarogya Aadhar on:</p>
      <div style="display: flex; align-items: center; gap: 10px; padding-top: 10px;">
        <a href="https://www.instagram.com/bharat_aarogya_aadhar" style="padding: 10px; border-radius: 50%; text-decoration: none;"><p>Instagram |</p></a>
        <a href="https://www.facebook.com/profile.php?id=61554162329099" style="padding: 10px; border-radius: 50%; text-decoration: none;"><p>Facebook |</p></a>
        <a href="#" style="padding: 10px; border-radius: 50%; text-decoration: none;"><p>Twitter |</p></a>
        <a href="https://www.linkedin.com/company/aarogya-aadhar" style="padding: 10px; border-radius: 50%; text-decoration: none;"><p>LinkedIn |</p></a>
        <a href="https://youtu.be/T5BCaTuZUpY" style="padding: 10px; border-radius: 50%; text-decoration: none;"><p>YouTube</p></a>
      </div>
      <p><a href="https://aarogyaaadhar.com/" target="_blank">Website</a></p>
      <hr/>   
      <p style="font-size: 12px; color: #999;">This E-Mail may contain confidential information. Please do not share.</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: data.email,
      subject: "HSP Portal Enquiry Received - Aarogya Aadhar",
      html: htmlContent,
    });
    console.log("Enquiry email sent successfully");
  } catch (err) {
    console.error("Error sending email:", err);
  }
}

export async function POST(req) {
  try {
    const data = await req.json();

    // Validate all fields
    const requiredFields = ["category", "name", "email", "mobile", "designation", "gender"];
    const errors = {};
    requiredFields.forEach((field) => {
      if (!data[field] || !data[field].toString().trim()) {
        errors[field] = `${field} is required`;
      }
    });

    if (data.email && !/^\S+@\S+\.\S+$/.test(data.email)) {
      errors.email = "Invalid email format";
    }

    if (data.mobile && !/^\d{10}$/.test(data.mobile)) {
      errors.mobile = "Invalid mobile number (10 digits required)";
    }

    if (Object.keys(errors).length > 0) {
      return new Response(JSON.stringify({ errors }), { status: 400 });
    }

    // Save to MongoDB
    const saved = await db.HspPortalEnq.create({ data });

    // Send email
    await sendEnquiryEmail(data);

    return new Response(JSON.stringify({ message: "Enquiry submitted successfully" }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Something went wrong" }), { status: 500 });
  }
}
