import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // Use another service if necessary, e.g., SendGrid, AWS SES
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your email password or app password
  },
});

// Send mail function to send emails with dynamic content
export const sendMail = async (to, subject, text, htmlContent = null) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    ...(htmlContent && { html: htmlContent }), // Add HTML content if provided
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent to:", to);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// Send emails to both applicant and admin with data
export const sendCareerEmails = async (
  applicantEmail,
  applicantName,
  adminEmail,
  applicantData
) => {
  // Email content for the applicant
  const applicantSubject = "Thank You for Your Application!";
  const applicantHtml = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #555;">
      <p style="font-size: 14px;">This is an Automatic Mail, Don’t Reply</p>
      <h3 style="color: #243460;">Dear ${applicantName},</h3>
      <p>Thank you for your interest in joining Aarogya Aadhar! We’ve received your application request and appreciate the time you took to complete our career form.</p>
      <p>Our team is currently reviewing applications, and we will be in touch if your background and experience match the qualifications for this role. You can expect to hear back from us within <strong>07 Working Days</strong>.</p>
      <p>In the meantime, if you have any questions, please don’t hesitate to reach out by replying to this email.</p>
      <p>Thank you again for considering a career with us. We look forward to the possibility of working together!</p>
      <hr/>
      <a href="https://aarogyaaadhar.com/" target="_blank">
        <p>Best Regards,<br/>Aarogya Aadhar Team</p>
        <img src="https://res.cloudinary.com/dnckhli5u/image/upload/v1728891425/Picture1_c31red.png" alt="Aarogya Aadhar Logo" style="width: 100%; max-width: 400px;" />
      </a>
      <h3 style="color: #243460;">Connect</h3>
      <p>Follow Aarogya Aadhar on:</p>
      <div style="display: flex; gap: 10px; padding-top: 10px;">
        <a href="https://www.instagram.com/bharat_aarogya_aadhar" style="text-decoration: none; color: #555;">Instagram</a> |
        <a href="https://www.facebook.com/profile.php?id=61554162329099" style="text-decoration: none; color: #555;">Facebook</a> |
        <a href="#" style="text-decoration: none; color: #555;">Twitter</a> |
        <a href="https://www.linkedin.com/company/aarogya-aadhar" style="text-decoration: none; color: #555;">LinkedIn</a> |
        <a href="https://youtu.be/T5BCaTuZUpY" style="text-decoration: none; color: #555;">YouTube</a>
      </div>
      <p><a href="https://aarogyaaadhar.com/" target="_blank" style="text-decoration: none; color: #243460;">Visit Our Website</a></p>
      <hr/>
      <p style="font-size: 12px; color: #999;">
        This email may contain confidential and/or legally privileged information and is meant for the intended recipient(s) only. If you have received this email in error, please delete it immediately. Internet communications cannot be guaranteed to be secure or error-free as information could be delayed, intercepted, corrupted, or lost. Aarogya Aadhar does not accept any liability for errors, omissions, or disruptions caused by this email.
      </p>
    </div>
  `;

  // Email content for the admin
  const adminSubject = `New Career Application from ${applicantName}`;
  const adminText = `
    Admin,
    
    You have received a new application from ${applicantName}.
    
    Details:
    - Full Name: ${applicantData.fullname}
    - Email: ${applicantData.email}
    - Mobile: ${applicantData.mobile}
    - Category: ${applicantData.category}
    
    Please review the application in the admin dashboard.
    
    Best regards,
    System
  `;

  // Send email to the applicant
  await sendMail(applicantEmail, applicantSubject, applicantHtml); // Pass `true` for HTML format

  // Send email to the admin with applicant details
  await sendMail(adminEmail, adminSubject, adminText);
};

export default async function sendTempPasswordEmail(email,  tempPassword) {
  // Configure your email transport
  const transporter = nodemailer.createTransport({
    service: "gmail", // Use your email service (e.g., Gmail)
    auth: {
      user: process.env.EMAIL_USER, // Your email address from environment variables
      pass: process.env.EMAIL_PASS, // Your email password or app password from environment variables
    },
  });

  // Define the email options
  const mailOptions = {
    from: process.env.EMAIL_USER, // Your email address
    to: email,
    subject: "Your Temporary Password for Account Access",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #555;">
        <p style="font-size: 14px;">This is an Automatic Mail, Don’t Reply</p>
        <h3 style="color: #243460;">Dear User,</h3>
        <p>We have received a request to reset the password associated with your account. As a security measure, we have generated a temporary password for you to access your account.</p>
        <p style="font-size: 20px; font-weight: bold; color: #4CAF50;">Temporary Password: ${tempPassword}</p>
        <h4 style="color: #243460;">Please Note:</h4>
        <ol>
          <li>This temporary password is only valid for <strong>24 hours</strong>. If you do not log in and reset your password within this timeframe, you may need to request another reset.</li>
          <li>We strongly recommend changing your password immediately upon login to secure your account.</li>
        </ol>
        <h4 style="color: #243460;">To Change Your Password:</h4>
        <ol>
          <li>Log in to your account with the temporary password.</li>
          <li>Go to the “Account Settings” or “Security Settings” section.</li>
          <li>Choose “Change Password” and follow the prompts to set a new password of your choice.</li>
        </ol>
        <p>If you did not request a password reset, please contact our support team immediately at 
          <a href="mailto:info@aarogyaaadhar.com" style="text-decoration: none; color: #243460;">info@aarogyaaadhar.com</a> 
          or call us at +91 79-72-72-7498 & +91 91-45-07-8001 to secure your account.</p>
        <hr/>
        <a href="https://aarogyaaadhar.com/" target="_blank">
          <p>Best Regards,<br/>Aarogya Aadhar Team</p>
          <img src="https://res.cloudinary.com/dnckhli5u/image/upload/v1728891425/Picture1_c31red.png" alt="Aarogya Aadhar Logo" style="width: 100%; max-width: 400px;" />
        </a>
        <h3 style="color: #243460;">Connect</h3>
        <p>Follow Aarogya Aadhar on:</p>
        <div style="display: flex; gap: 10px; padding-top: 10px;">
          <a href="https://www.instagram.com/bharat_aarogya_aadhar" style="text-decoration: none; color: #555;">Instagram</a> |
          <a href="https://www.facebook.com/profile.php?id=61554162329099" style="text-decoration: none; color: #555;">Facebook</a> |
          <a href="#" style="text-decoration: none; color: #555;">Twitter</a> |
          <a href="https://www.linkedin.com/company/aarogya-aadhar" style="text-decoration: none; color: #555;">LinkedIn</a> |
          <a href="https://youtu.be/T5BCaTuZUpY" style="text-decoration: none; color: #555;">YouTube</a>
        </div>
        <p><a href="https://aarogyaaadhar.com/" target="_blank" style="text-decoration: none; color: #243460;">Visit Our Website</a></p>
        <hr/>
        <p style="font-size: 12px; color: #999;">
          This email may contain confidential and/or legally privileged information and is intended for the designated recipient(s) only. If you have received this email in error, please delete it immediately. Internet communications cannot be guaranteed to be secure or error-free as information could be delayed, intercepted, corrupted, or lost. Aarogya Aadhar does not accept any liability for errors, omissions, or disruptions caused by this email.
        </p>
      </div>
    `,
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    console.log("Temporary password email sent successfully");
  } catch (error) {
    console.error("Error sending temporary password email:", error);
  }
}
// Send emails to both applicant and admin with data
// Function to send "Contact Us" emails to both applicant and admin
export const sendContactUsEmails = async (
  applicantEmail,
  applicantName,
  adminEmail,
  contactData
) => {
  // Email content for the applicant
  const applicantSubject = "Thank You for Reaching Out!";
  const applicantHtml = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #555;">
      <p style="font-size: 14px;">This is an Automatic Mail, Don’t Reply</p>
      <h3 style="color: #243460;">Dear ${applicantName},</h3>
      <p>Thank you for contacting us through our website! We’ve received your inquiry and will get back to you as soon as possible. Our Aarogya Aadhar team is committed to providing timely support, and you can expect a response within <strong>48 Working Hours</strong> or <strong>Two Business Days</strong>.</p>
      <p>If your matter is urgent, please feel free to reach out to our support team at:</p>
      <ul style="list-style-type: none; padding: 0;">
        <li><strong>Phone:</strong> +91 79-72-72-7498, +91 91-45-07-8001</li>
        <li><strong>Email:</strong> <a href="mailto:patient@aarogyaaadhar.com">patient@aarogyaaadhar.com</a></li>
      </ul>
      <p>Thank you for choosing Aarogya Aadhar. We look forward to assisting you!</p>
      <hr/>
      <a href="https://aarogyaaadhar.com/" target="_blank">
        <p>Best Regards,<br/>Aarogya Rakshak Team</p>
        <img src="https://res.cloudinary.com/dnckhli5u/image/upload/v1728891425/Picture1_c31red.png" alt="Aarogya Aadhar Logo" style="width: 100%; max-width: 400px;" />
      </a>
      <h3 style="color: #243460;">Connect</h3>
      <p>Follow Aarogya Aadhar on:</p>
      <div style="display: flex; gap: 10px; padding-top: 10px;">
        <a href="https://www.instagram.com/bharat_aarogya_aadhar" style="text-decoration: none; color: #555;">Instagram</a> |
        <a href="https://www.facebook.com/profile.php?id=61554162329099" style="text-decoration: none; color: #555;">Facebook</a> |
        <a href="#" style="text-decoration: none; color: #555;">Twitter</a> |
        <a href="https://www.linkedin.com/company/aarogya-aadhar" style="text-decoration: none; color: #555;">LinkedIn</a> |
        <a href="https://youtu.be/T5BCaTuZUpY" style="text-decoration: none; color: #555;">YouTube</a>
      </div>
      <p><a href="https://aarogyaaadhar.com/" target="_blank" style="text-decoration: none; color: #243460;">Visit Our Website</a></p>
      <hr/>
      <p style="font-size: 12px; color: #999;">
        This email may contain confidential and/or legally privileged information and is meant for the intended recipient(s) only. If you have received this email in error, please delete it immediately. Internet communications cannot be guaranteed to be secure or error-free as information could be delayed, intercepted, corrupted, or lost. Aarogya Aadhar does not accept any liability for errors, omissions, or disruptions caused by this email.
      </p>
    </div>
  `;

  // Email content for the admin
  const adminSubject = `New Contact Us Message from ${applicantName}`;
  const adminText =
    `Admin,\n\nYou have received a new contact form submission from ${applicantName}.\n\nDetails:\n` +
    `- Full Name: ${contactData.fullname}\n` +
    `- Email: ${contactData.email}\n` +
    `- Message: ${contactData.message}\n` +
    `- Mobile: ${contactData.mobile}\n\n` +
    `Please review the message in the admin dashboard.\n\nBest regards,\nSystem`;

  // Send email to the applicant
  await sendMail(applicantEmail, applicantSubject, applicantHtml, true); // Pass `true` for HTML format

  // Send email to the admin with contact details
  await sendMail(adminEmail, adminSubject, adminText);
};


export const sendRegenqmail = async (
  applicantEmail,
  applicantName,
  adminEmail,
  applicantData
) => {
  // Email content for the applicant
  const applicantSubject = "Thank you for your inquiry";
  const applicantText =
    `Dear ${applicantName},\n\nThank you for your inquiry. We have received your details and will get back to you shortly.\n\nHere is the information we received:\n` +
    `- Full Name: ${applicantData.enqperson}\n` +
    `- Email: ${applicantData.email}\n` +
    `- Mobile: ${applicantData.mobile}\n` +
    `- Category: ${applicantData.category}\n` +
    `- Company: ${applicantData.company}\n` +
    `- Pincode: ${applicantData.pincode}\n` +
    `- Address: ${applicantData.address}\n` +
    `- ID Proof: ${applicantData.idproof}\n\n` +
    `We will be in touch soon.\n\nBest regards,\nCompany Team`;

  // Email content for the admin
  const adminSubject = `New Inquiry Received from ${applicantName}`;
  const adminText =
    `Admin,\n\nA new inquiry has been submitted by ${applicantName}.\n\nHere are the details:\n` +
    `- Full Name: ${applicantData.enqperson}\n` +
    `- Email: ${applicantData.email}\n` +
    `- Mobile: ${applicantData.mobile}\n` +
    `- Category: ${applicantData.category}\n` +
    `- Company: ${applicantData.company}\n` +
    `- Pincode: ${applicantData.pincode}\n` +
    `- Address: ${applicantData.address}\n` +
    `- ID Proof: ${applicantData.idproof}\n\n` +
    `Please review the submission in the admin dashboard.\n\nBest regards,\nSystem`;

  // Send email to the applicant
  await sendMail(applicantEmail, applicantSubject, applicantText);

  // Send email to the admin with the details of the inquiry
  await sendMail(adminEmail, adminSubject, adminText);
};

export const sendBusinessPartnershipEmails = async (
  applicantEmail,
  applicantName,
  adminEmail,
  applicantData
) => {
  // Email content for the applicant
  const applicantSubject = "Thank you for your Business Partnership Inquiry";
  const applicantText =
    `Dear ${applicantName},\n\n` +
    `Thank you for reaching out with your interest in a business partnership. We have received your details and will review them shortly.\n\n` +
    `Here is the information we received:\n` +
    `- Full Name: ${applicantData.hspfullname}\n` +
    `- Email: ${applicantData.email}\n` +
    `- Mobile: ${applicantData.mobile}\n` +
    `- Category: ${applicantData.category}\n` +
    `- Government Document: ${applicantData.govtdocument}\n` +
    `- Message: ${applicantData.message}\n` +
    `- Address: ${applicantData.address}\n` +
    `- Pincode: ${applicantData.pincode}\n\n` +
    `We appreciate your interest and will be in touch soon.\n\n` +
    `Best regards,\nCompany Team`;

  // Email content for the admin
  const adminSubject = `New Business Partnership Inquiry from ${applicantName}`;
  const adminText =
    `Admin,\n\nA new business partnership inquiry has been submitted by ${applicantName}.\n\n` +
    `Here are the details:\n` +
    `- Full Name: ${applicantData.hspfullname}\n` +
    `- Email: ${applicantData.email}\n` +
    `- Mobile: ${applicantData.mobile}\n` +
    `- Category: ${applicantData.category}\n` +
    `- Government Document: ${applicantData.govtdocument}\n` +
    `- Message: ${applicantData.message}\n` +
    `- Address: ${applicantData.address}\n` +
    `- Pincode: ${applicantData.pincode}\n\n` +
    `Please review the submission in the admin dashboard.\n\n` +
    `Best regards,\nSystem`;

  // Send email to the applicant
  await sendMail(applicantEmail, applicantSubject, applicantText);

  // Send email to the admin with the details of the inquiry
  await sendMail(adminEmail, adminSubject, adminText);
};
export const sendAarogyaMitraEmails = async (
  applicantEmail,
  applicantName,
  adminEmail,
  applicantData
) => {
  // Email content for the applicant
  const applicantSubject = "Thank you for your Registration";
  const applicantText =
    `Dear ${applicantName},\n\n` +
    `Thank you for reaching out with your interest in a Aarogya Mitra. We have received your details and will review them shortly.\n\n` +
    `Here is the information we received:\n` +
    `- Full Name: ${applicantData.hspfullname}\n` +
    `- Email: ${applicantData.email}\n` +
    `- Mobile: ${applicantData.mobile}\n` +
    `- Category: ${applicantData.category}\n` +
    `- Government Document: ${applicantData.govtdocument}\n` +
    `- Message: ${applicantData.message}\n` +
    `- Address: ${applicantData.address}\n` +
    `- Pincode: ${applicantData.pincode}\n\n` +
    `We appreciate your interest and will be in touch soon.\n\n` +
    `Best regards,\nCompany Team`;

  // Email content for the admin
  const adminSubject = `New Aarogya Mitra from ${applicantName}`;
  const adminText =
    `Admin,\n\nA new Aarogya Mitra Registration has been submitted by ${applicantName}.\n\n` +
    `Here are the details:\n` +
    `- Full Name: ${applicantData.hspfullname}\n` +
    `- Email: ${applicantData.email}\n` +
    `- Mobile: ${applicantData.mobile}\n` +
    `- Category: ${applicantData.category}\n` +
    `- Government Document: ${applicantData.govtdocument}\n` +
    `- Message: ${applicantData.message}\n` +
    `- Address: ${applicantData.address}\n` +
    `- Pincode: ${applicantData.pincode}\n\n` +
    `Please review the submission in the admin dashboard.\n\n` +
    `Best regards,\nSystem`;

  // Send email to the applicant
  await sendMail(applicantEmail, applicantSubject, applicantText);

  // Send email to the admin with the details of the inquiry
  await sendMail(adminEmail, adminSubject, adminText);
};



export const sendCorporateGovernanceEmails = async (
  applicantEmail,
  applicantName,
  adminEmail,
  applicantData
) => {
  // Email content for the applicant
  const applicantSubject = "Thank you for your submission";
  const applicantText =
    `Dear ${applicantName},\n\n` +
    `Thank you for reaching out with your interest in a Corporate Governance. We have received your details and will review them shortly.\n\n` +
    `Here is the information we received:\n` +
    `- Full Name: ${applicantData.fullname}\n` +
    `- Email: ${applicantData.email}\n` +
    `- Mobile: ${applicantData.mobile}\n` +
    `- Corporate Year: ${applicantData.corporateyear}\n` +
    `- Government Document: ${applicantData.govtdocument}\n` +
    `- Message: ${applicantData.message}\n` +

    `We appreciate your interest and will be in touch soon.\n\n` +
    `Best regards,\nCompany Team`;

  // Email content for the admin
  const adminSubject = `New Aarogya Mitra from ${applicantName}`;
  const adminText =
    `Admin,\n\nA new Aarogya Mitra Registration has been submitted by ${applicantName}.\n\n` +
    `Here are the details:\n` +
    `- Full Name: ${applicantData.fullname}\n` +
    `- Email: ${applicantData.email}\n` +
    `- Mobile: ${applicantData.mobile}\n` +
    `- Corporate Year: ${applicantData.corporateyear}\n` +
    `- Government Document: ${applicantData.govtdocument}\n` +
    `- Message: ${applicantData.message}\n` +
    `Please review the submission in the admin dashboard.\n\n` +
    `Best regards,\nSystem`;

  // Send email to the applicant
  await sendMail(applicantEmail, applicantSubject, applicantText);

  // Send email to the admin with the details of the inquiry
  await sendMail(adminEmail, adminSubject, adminText);
};

export const sendWelcomeEmailtoPatient = async (
  email,
  mobile,
  accountType = "Basic"
) => {
  const subject = "Welcome to Aarogya Aadhar – Your Account Successfully Created!";
  const htmlContent = `
   <html> <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <p style="font-size: 14px; color: #555;">This is an Automatic Mail, Don’t Reply</p>
      <h3>Dear ${email},</h3>
      <p>Welcome to the Aarogya Aadhar Family!</p>
      <p>We are excited to inform you that your account has been successfully created. You can now log in to our portal, complete your profile information, and start exploring all the features and benefits we offer.</p>
      
      <h4>Your Account Details:</h4>
      <ul>
        <li><strong>Phone No:</strong> ${mobile}</li>
        <li><strong>Email Address:</strong> ${email}</li>
        <li><strong>Account Type:</strong> ${accountType}</li>
      </ul>
      
      <h4>To Get Started:</h4>
      <ol>
        <li>Login Here: <a href="https://aarogyaaadhar.com/patient/login" target="_blank">Login Page</a></li>
        <li>Explore Features: <a href="https://www.youtube.com/watch?v=BN7mtt8dZVk&t=12s" target="_blank">Aarogya Aadhar Health Card Overview</a></li>
      </ol>

      <p>If you didn’t initiate this registration or have any questions, feel free to contact our support team at <a href="mailto:patient@aarogyaaadhar.com">patient@aarogyaaadhar.com</a> or call us at +91 79-72-72-7498 & +91 91-45-07-8001.</p>
      
      <p>Thank you for choosing Aarogya Aadhar. We look forward to serving you!</p>
      
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
    </div></html>
  `;

  // Send email to the user
  await sendMail(email, subject, htmlContent);
};
