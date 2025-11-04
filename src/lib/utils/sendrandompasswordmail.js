import nodemailer from 'nodemailer';

export async function sendPasswordEmail(email, password,Actype) {
const transporter = nodemailer.createTransport({
  service: "gmail", // Use another service if necessary, e.g., SendGrid, AWS SES
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your email password or app password
  },
});

  const mailOptions = {
    from: process.env.SMTP_FROM, // sender address
    to: email,
    subject: 'Your Account Password',
    text: `Your account has been created.  Your password is: ${password}`,
    html: `<p>Your account has been created.</p><p><strong>Password:</strong> ${password} Please go and Login to your ${Actype} Account </p>`,
  };

  await transporter.sendMail(mailOptions);
}
