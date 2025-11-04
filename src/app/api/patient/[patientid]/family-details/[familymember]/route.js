import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getReciprocalRelationshipWithGender } from "@/lib/relationshipUtils";

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function PUT(request, { params }) {
  const patientid = params.patientid; // Doctor ID from URL parameters
  const familymember = params.familymember; // Branch ID from URL parameters

  try {
    const formData = await request.formData();
    const ageValue = formData.get("age");
const member = {
  firstName: formData.get("firstName"),
  middleName: formData.get("middleName"),
  lastName: formData.get("lastName"),
  email: formData.get("email"),
  aadharCardNumber: formData.get("aadharCardNumber"),
  relation: formData.get("relation"),
  gender: formData.get("gender"),
  mobile: formData.get("mobile"),
  bloodgroup: formData.get("bloodgroup"),
  age: ageValue || null,
  presentAddress: formData.get("presentAddress"),
  state: formData.get("state"),
  district: formData.get("district"),
  taluka: formData.get("taluka"),
  pincode: formData.get("pincode"),
};


    // Get the current family member to check for relationship changes
    const currentMember = await db.FamilyMember.findFirst({
      where: {
        id: familymember,
        patientId: patientid,
      },
    });

    if (!currentMember) {
      return NextResponse.json(
        { error: "Family Member not found." },
        { status: 404 }
      );
    }

    // Update the existing family member with the new data
    const updatemember = await db.familyMember.update({
      where: { id: familymember },
      data: member, // Just spread the member data, don't include patientId directly
    });

    // Handle reciprocal relationship update if the family member is a registered patient
    if (currentMember.registeredPatientId && member.relation && member.relation !== currentMember.relation) {
      try {
        // Get the reciprocal relationship for the registered patient
        const reciprocalRelation = getReciprocalRelationshipWithGender(
          member.relation, 
          member.gender
        );
        
        if (reciprocalRelation) {
          // Find and update the reciprocal family member record
          const reciprocalMember = await db.familyMember.findFirst({
            where: {
              patientId: currentMember.registeredPatientId,
              registeredPatientId: patientid
            }
          });

          if (reciprocalMember) {
            // Update the reciprocal relationship
            await db.familyMember.update({
              where: { id: reciprocalMember.id },
              data: { relation: reciprocalRelation }
            });
          } else {
            // Create new reciprocal relationship if it doesn't exist
            const registeredPatient = await db.Patient.findUnique({
              where: { id: currentMember.registeredPatientId }
            });

            if (registeredPatient) {
              await db.familyMember.create({
                data: {
                  patientId: currentMember.registeredPatientId,
                  registeredPatientId: patientid,
                  relation: reciprocalRelation,
                  approvalStatus: "PENDING",
                  firstName: registeredPatient.firstName,
                  middleName: registeredPatient.middleName,
                  lastName: registeredPatient.lastName,
                  email: registeredPatient.email,
                  mobile: registeredPatient.mobile,
                  gender: registeredPatient.gender,
                  aadharCardNumber: registeredPatient.aadharCardNumber,
                  dateOfBirth: registeredPatient.dateOfBirth,
                  presentAddress: registeredPatient.presentAddress,
                  state: registeredPatient.state,
                  district: registeredPatient.district,
                  taluka: registeredPatient.taluka,
                  pincode: registeredPatient.pincode,
                  bloodgroup: registeredPatient.bloodgroup
                }
              });
            }
          }
        }
      } catch (error) {
        console.error("Error updating reciprocal relationship:", error);
        // Don't fail the main operation if reciprocal update fails
      }
    }



    // Fetch doctor information for email notification
    const patient = await db.Patient.findUnique({
      where: { id: patientid },
    });

    if (!patient) {
      return NextResponse.json(
        { error: "Patient not found." },
        { status: 404 }
      );
    }

    // Prepare email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: patient.email, // Send email to the doctor's hospital email (or the correct hospital email)
      subject: "Family Member Information Updated - Aarogya Aadhar",
      html: `
       

        <p>Best regards,<br/>Aarogya Aadhar Team</p>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log("Update notification email sent successfully.");

    // Return the updated branch information as a response
    return NextResponse.json(updatemember);
  } catch (error) {
    console.error("Error updating branch information:", error);
    return NextResponse.json(
      { error: "An error occurred: " + error.message },
      { status: 500 }
    );
  }
}
