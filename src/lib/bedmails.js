export const generateEmailContent = (type, data) => {
    const {
      patientName,
      bookingDate,
      bookingTime,
      bedType,
      insuranceDetails,
      mobileNumber,
      hospitalName,
    } = data;
  
    const footer = `
      <hr/>
      <p style="font-size: 13px;">Best Regards,<br/>Aarogya Rakshak Team</p>
      <a href="https://aarogyaaadhar.com/" target="_blank">
        <img src="https://res.cloudinary.com/dnckhli5u/image/upload/v1728891425/Picture1_c31red.png" alt="Aarogya Aadhar Logo" style="width: 100%; max-width: 400px;" />
      </a>
      <p style="font-size: 11px; color: #888;">
        (Note: When you click on the image, it will open our website homepage.)<br/>
        This E-Mail may contain Confidential and/or legally privileged Information and is meant for the intended recipient(s) only. 
        If you have received this e-mail in error, kindly delete it from your system. Unauthorized use or disclosure is prohibited. 
        Aarogya Aadhar is not liable for any security issues arising from this communication.
      </p>
    `;
  
    const baseWrapper = (content) => `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #555;">
        ${content}
        ${footer}
      </div>
    `;
  
    switch (type) {
      case "BOOKED":
        return baseWrapper(`
          <h3 style="color: #243460;">Dear ${patientName},</h3>
          <p>Greetings from Aarogya Aadhar.</p>
          <p>We are writing to confirm that we have received your request for a bed booking at our facility. Below are the preliminary details as recorded:</p>
          <ul>
            <li>Patient Name: ${patientName}</li>
            <li>Booking Date: ${bookingDate}</li>
            <li>Booking Time: ${bookingTime}</li>
            <li>Bed Type: ${bedType}</li>
            <li>Insurance Details: ${insuranceDetails ? "Yes" : "No"}</li>
            <li>Mobile No.: ${mobileNumber}</li>
          </ul>
          <p>Our service provider and their admissions team is currently reviewing your request and will contact you shortly to confirm availability and complete the necessary procedures.</p>
          <p>For any urgent queries, please feel free to contact the Patient or connect to Aarogya Aadhar Team.</p>
        `);
  
      case "CONFIRMED":
        return baseWrapper(`
          <h3 style="color: #243460;">Dear ${patientName},</h3>
          <p>Greetings from ${hospitalName}.</p>
          <p>We are writing to inform you about the current status of your hospital bed booking request submitted on ${bookingDate}.</p>
          <ul>
            <li>Patient Name: ${patientName}</li>
            <li>Booking Date: ${bookingDate}</li>
            <li>Booking Time: ${bookingTime}</li>
            <li>Bed Type: ${bedType}</li>
            <li>Insurance Details: ${insuranceDetails ? "Yes" : "No"}</li>
            <li>Mobile No.: ${mobileNumber}</li>
          </ul>
          <p><strong>Current Status: ✅ Confirmed</strong></p>
          <p>We are pleased to confirm that your bed has been successfully reserved. Please report to the hospital by <strong>[Time]</strong> on <strong>[Date]</strong> for admission. Kindly carry all necessary documents and medical reports.</p>
          <p>If you have any questions or need further assistance, please do not hesitate to contact our admissions team at <strong>[Hospital Number and Mail ID]</strong> or reply to this email.</p>
          <p>We appreciate your trust in ${hospitalName} and are committed to supporting you with compassionate and professional care.</p>
        `);
  
      case "REJECTED":
        return baseWrapper(`
          <h3 style="color: #243460;">Dear ${patientName},</h3>
          <p>Greetings from ${hospitalName}.</p>
          <p>We are writing to inform you about the current status of your hospital bed booking request submitted on ${bookingDate}.</p>
          <ul>
            <li>Patient Name: ${patientName}</li>
            <li>Booking Date: ${bookingDate}</li>
            <li>Booking Time: ${bookingTime}</li>
            <li>Bed Type: ${bedType}</li>
            <li>Insurance Details: ${insuranceDetails ? "Yes" : "No"}</li>
            <li>Mobile No.: ${mobileNumber}</li>
          </ul>
          <p><strong>Current Status: ❌ Rejected / Unavailable</strong></p>
          <p>We regret to inform you that, due to unavailability of beds in the requested category, we are currently unable to accommodate your request. We will notify you immediately if availability changes. You may also contact us to explore alternate options.</p>
          <p>If you have any questions or need further assistance, please do not hesitate to contact our admissions team at <strong>[Hospital Phone Number and Mail ID]</strong> or reply to this email.</p>
          <p>We appreciate your trust in ${hospitalName} and are committed to supporting you with compassionate and professional care.</p>
        `);
  
      default:
        return "";
    }
  };