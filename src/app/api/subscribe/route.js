import { db } from "@/lib/db"; // Prisma client
import nodemailer from "nodemailer";

async function sendSubscribeEmail(email) {
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
      <h3>Dear User,</h3>
      <p>Thank you for subscribing to Aarogya Aadhar updates! Your subscription is successful.</p>
      <p>Registration is now live. Create your Aarogya Aadhar account to access healthcare services and benefits after verification and approval:</p>
      <p><a href="https://www.aarogyaaadhar.com/patient/register" target="_blank">Register Now</a></p>
      <p>Visit our website: <a href="https://www.aarogyaaadhar.com/" target="_blank">https://www.aarogyaaadhar.com/</a></p>
      
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
      <p style="font-size: 12px; color: #999;">
        This E-Mail may contain Confidential and/or legally privileged Information and is meant for the intended recipient(s) only. If you have received this e-mail in error and are not the intended recipient/s, kindly delete this e-mail immediately from your system. You are also hereby notified that any use, any form of reproduction, dissemination, copying, disclosure, modification, distribution and/or publication of this e-mail, its contents or its attachment/s other than by its intended recipient/s is strictly prohibited and may be construed unlawful. Internet Communications cannot be guaranteed to be secure or error-free as information could be delayed, intercepted, corrupted, lost, or may contain viruses. Aarogya Aadhar does not accept any liability for any errors, omissions, viruses or computer shutdown (s) or any kind of disruption/denial of services if any experienced by any recipient as a result of this e-mail.
      </p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Thank You for Subscribing - Aarogya Aadhar",
      html: htmlContent,
    });
    console.log("Subscription email sent successfully");
  } catch (err) {
    console.error("Error sending subscription email:", err);
  }
}

export async function POST(req) {
  try {
    const { email } = await req.json();
    
    if (!email) return new Response(JSON.stringify({ error: "Email is required" }), { status: 400 });

    const exist = await db.subscribe.findUnique({
        where : {
            email : email,
        }
    })
    if(exist) return new Response(JSON.stringify({error : "Email Already Present" }), {status: 403})

    // Save to MongoDB using Prisma
    const subscriber = await db.subscribe.create({
      data: { email, status: "pending" },
    });

    // Send subscription email
    await sendSubscribeEmail(email);

    return new Response(JSON.stringify({ message: "Subscription successful" }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Something went wrong" }), { status: 500 });
  }
}
