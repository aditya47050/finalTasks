import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // Replace with your email service
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password or app password
  },
});

export async function PUT(req, { params }) {
  const healthCardId = params.healthcard;

  if (!healthCardId) {
    return NextResponse.json(
      { error: "Health card ID is required." },
      { status: 400 }
    );
  }

  try {
    const { action, remark } = await req.json();

    let approvalStatus;
    if (action === "approve") {
      approvalStatus = "APPROVED";
    } else if (action === "reject") {
      approvalStatus = "REJECTED";
    } else {
      return NextResponse.json(
        { error: 'Invalid action provided. Must be "approve" or "reject".' },
        { status: 400 }
      );
    }

    const updatedHealthCard = await db.HealthCard.update({
      where: { id: healthCardId },
      data: {
        approvalStatus,
        remarks: remark,
      },
    });

    const healthcardpatient = await db.HealthCard.findUnique({
      where: { id: healthCardId },
      include: { patient: true },
    });

    if (!healthcardpatient || !healthcardpatient.patient) {
      return NextResponse.json(
        { error: "Patient information not found." },
        { status: 404 }
      );
    }

    // Prepare and send email
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: healthcardpatient.patient.email,
        subject:
          approvalStatus === "APPROVED"
            ? "Your Aarogya Aadhar Digital Health Card is Ready for Download"
            : "Your Aarogya Aadhar Health Card Application",
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <p style="font-size: 14px; color: #555;">This is an Automatic Mail, Don’t Reply</p>
            <h3>Dear ${healthcardpatient.patient.firstName},</h3>
            ${
              approvalStatus === "APPROVED"
                ? `
              <p>Congratulations! Your profile has been successfully verified, and you have now been issued your “Aarogya Aadhar Digital Health Card”.</p>
              <h4>What You Can Do:</h4>
              <ul>
                <li><a href="https://aarogyaaadhar.com/patient/login" style="text-decoration: none; color: #007BFF;">Download Your Digital Health Card</a></li>
                <li>Access all healthcare services linked to your Aarogya Aadhar Dashboard.</li>
                <li>Use your card for seamless healthcare benefits across supported platforms and facilities.</li>
                <li>Download Aarogya Aadhar App (<a href="https://play.google.com/store/apps/details?id=com.aarogyaaadhar" style="text-decoration: none; color: #007BFF;">Google Play Store</a> | <a href="https://apps.apple.com/app/aarogyaaadhar" style="text-decoration: none; color: #007BFF;">Apple Play Store</a>)</li>
              </ul>
              <h4>Next Steps:</h4>
              <ol>
                <li>Click on the link above to download your digital health card.</li>
                <li>Visit your Aarogya Aadhar portal account, click on "Digital Health Card," and download your “Aarogya Aadhar Digital Health Card.”</li>
                <li>Save it on your phone or print a hard copy for easy access at healthcare facilities.</li>
              </ol>
              <p>Remark: ${remark || "No remarks provided."}</p>
              <p>If you have any questions or face issues, contact us at <a href="mailto:patient@aarogyaaadhar.com">patient@aarogyaaadhar.com</a> or call us at +91 79-72-72-7498 & +91 91-45-07-8001.</p>
         
           <a href="https://aarogyaaadhar.com/" target="_blank">
        <p>Best Regards,<br/>Aarogya Rakshak Team</p>
        <img src="https://res.cloudinary.com/dnckhli5u/image/upload/v1728891425/Picture1_c31red.png" alt="Aarogya Aadhar Logo" style="width: 100%; max-height: 400px;" />
      </a>
      
      <hr/>
      <h3 style="color: #243460;">Connect</h3>
      <p>Follow Aarogya Aadhar on:</p>
      <div style="display: flex; align-items: center; gap: 10px; padding-top: 10px;">
        <a href="https://www.instagram.com/bharat_aarogya_aadhar" target="_blank" style="text-decoration: none; color: inherit;">Instagram |</a>
        <a href="https://www.facebook.com/profile.php?id=61554162329099" target="_blank" style="text-decoration: none; color: inherit;">Facebook |</a>
        <a href="#" target="_blank" style="text-decoration: none; color: inherit;">Twitter |</a>
        <a href="https://www.linkedin.com/company/aarogya-aadhar" target="_blank" style="text-decoration: none; color: inherit;">LinkedIn |</a>
        <a href="https://youtu.be/T5BCaTuZUpY" target="_blank" style="text-decoration: none; color: inherit;">YouTube</a>
      </div>
      <p><a href="https://aarogyaaadhar.com/" target="_blank">Website</a></p>
      
      <hr/>
      <p style="font-size: 12px; color: #999;">
        This E-Mail may contain Confidential and/or legally privileged Information and is meant for the intended recipient(s) only. If you have received this e-mail in error and are not the intended recipient, kindly delete this e-mail immediately from your system. Any use, reproduction, dissemination, copying, disclosure, modification, distribution, or publication of this e-mail, its contents, or its attachments other than by the intended recipient is strictly prohibited and may be unlawful. Internet communications cannot be guaranteed to be secure or error-free, as information could be delayed, intercepted, corrupted, lost, or may contain viruses. Aarogya Aadhar does not accept liability for any errors, omissions, viruses, or any disruption if any experienced by the recipient due to this e-mail.
      </p>
    </div>
              `
                : `
              <p>Unfortunately, your application has been rejected.</p>
              <p>Remark: ${remark || "No remarks provided."}</p>
              <p>If you have any questions, please contact us at <a href="mailto:patient@aarogyaaadhar.com">patient@aarogyaaadhar.com</a> or call us at +91 79-72-72-7498 & +91 91-45-07-8001.</p>
            `
            }
            <hr/>
            <p style="font-size: 12px; color: #999;">
              This E-Mail may contain Confidential and/or legally privileged Information and is meant for the intended recipient(s) only. If you have received this e-mail in error, kindly delete this e-mail immediately.
            </p>
              <a href="https://aarogyaaadhar.com/" target="_blank">
        <p>Best Regards,<br/>Aarogya Rakshak Team</p>
        <img src="https://res.cloudinary.com/dnckhli5u/image/upload/v1728891425/Picture1_c31red.png" alt="Aarogya Aadhar Logo" style="width: 100%; max-height: 400px;" />
      </a>
      
      <hr/>
      <h3 style="color: #243460;">Connect</h3>
      <p>Follow Aarogya Aadhar on:</p>
      <div style="display: flex; align-items: center; gap: 10px; padding-top: 10px;">
        <a href="https://www.instagram.com/bharat_aarogya_aadhar" target="_blank" style="text-decoration: none; color: inherit;">Instagram |</a>
        <a href="https://www.facebook.com/profile.php?id=61554162329099" target="_blank" style="text-decoration: none; color: inherit;">Facebook |</a>
        <a href="#" target="_blank" style="text-decoration: none; color: inherit;">Twitter |</a>
        <a href="https://www.linkedin.com/company/aarogya-aadhar" target="_blank" style="text-decoration: none; color: inherit;">LinkedIn |</a>
        <a href="https://youtu.be/T5BCaTuZUpY" target="_blank" style="text-decoration: none; color: inherit;">YouTube</a>
      </div>
      <p><a href="https://aarogyaaadhar.com/" target="_blank">Website</a></p>
      
      <hr/>
      <p style="font-size: 12px; color: #999;">
        This E-Mail may contain Confidential and/or legally privileged Information and is meant for the intended recipient(s) only. If you have received this e-mail in error and are not the intended recipient, kindly delete this e-mail immediately from your system. Any use, reproduction, dissemination, copying, disclosure, modification, distribution, or publication of this e-mail, its contents, or its attachments other than by the intended recipient is strictly prohibited and may be unlawful. Internet communications cannot be guaranteed to be secure or error-free, as information could be delayed, intercepted, corrupted, lost, or may contain viruses. Aarogya Aadhar does not accept liability for any errors, omissions, viruses, or any disruption if any experienced by the recipient due to this e-mail.
      </p>
    </div>
          </div>
        `,
      };
      await transporter.sendMail(mailOptions);
      console.log(
        "Email sent successfully to:",
        healthcardpatient.patient.email
      );
    } catch (emailError) {
      console.error(
        "Failed to send email to:",
        healthcardpatient.patient.email,
        "Error:",
        emailError
      );
    }

    return NextResponse.json(updatedHealthCard);
  } catch (error) {
    console.error("Error updating health card:", error);
    return NextResponse.json(
      { error: "Failed to update health card." },
      { status: 500 }
    );
  }
}
