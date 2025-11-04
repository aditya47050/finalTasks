import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getReciprocalRelationshipWithGender } from "@/lib/relationshipUtils";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(request, { params }) {
  const patientid = params.patientid;

  try {
    // Extract form data from the request
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
      age: ageValue ? parseInt(ageValue) : null,
      presentAddress: formData.get("presentAddress"),
      state: formData.get("state"),
      district: formData.get("district"),
      taluka: formData.get("taluka"),
      pincode: formData.get("pincode"),
    };

    // Verify if the patient exists
    const patient = await db.Patient.findUnique({
      where: { id: patientid },
    });

    if (!patient) {
      return NextResponse.json(
        { error: "Patient not found." },
        { status: 404 }
      );
    }

    let existingPatient = null;
    if (member.aadharCardNumber) {
      existingPatient = await db.Patient.findFirst({
        where: { aadharCardNumber: member.aadharCardNumber },
        select: { id: true },
      });
    }

    const newmember = await db.familyMember.create({
      data: {
        ...member,
        Patient: {
          connect: { id: patientid }
        },
        ...(existingPatient && {
          registeredPatient: {
            connect: { id: existingPatient.id }
          },
        }),
        approvalStatus: existingPatient ? "PENDING" : "APPROVED",
      },
    });
    

    // Always create reciprocal relationship for family members
    if (member.relation) {
      try {
        const reciprocalRelation = getReciprocalRelationshipWithGender(
          member.relation, 
          patient.gender
        );
        
        console.log("Creating reciprocal relationship:", {
          originalRelation: member.relation,
          currentUserGender: patient.gender,
          reciprocalRelation: reciprocalRelation,
          familyMemberEmail: member.email,
          existingPatient: existingPatient ? "Yes" : "No"
        });
        
        if (reciprocalRelation && existingPatient) {
          // Check if there's already a family member record for the main patient
          const existingFamilyMember = await db.familyMember.findFirst({
            where: {
              patientId: existingPatient.id,
              registeredPatientId: patientid
            }
          });

          if (!existingFamilyMember) {
            // Create reciprocal family member record
            const reciprocalRecord = await db.familyMember.create({
              data: {
                Patient: {
                  connect: { id: existingPatient.id }
                },
                registeredPatientId: patientid,
                relation: reciprocalRelation,
                approvalStatus: "PENDING",
                // Copy basic info from the main patient
                firstName: patient.firstName,
                middleName: patient.middleName,
                lastName: patient.lastName,
                email: patient.email,
                mobile: patient.mobile,
                gender: patient.gender,
                aadharCardNumber: patient.aadharCardNumber,
                age: patient.age, // Use age instead of dateOfBirth
                presentAddress: patient.presentAddress,
                state: patient.state,
                district: patient.district,
                taluka: patient.taluka,
                pincode: patient.pincode,
                bloodgroup: patient.bloodgroup
              }
            });
            console.log("Created reciprocal relationship for registered patient:", reciprocalRecord.id);
          } else {
            // Update existing reciprocal relationship
            await db.familyMember.update({
              where: { id: existingFamilyMember.id },
              data: { relation: reciprocalRelation }
            });
            console.log("Updated existing reciprocal relationship:", existingFamilyMember.id);
          }
        }
      } catch (error) {
        console.error("Error creating reciprocal relationship:", error);
        // Don't fail the main operation if reciprocal creation fails
      }
    }

    // Send email notification
    if (patient) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: patient.email,
        subject: "New Family Member Created - Aarogya Aadhar",
        html: `<p>Hello,</p>
               <p>A new family member has been added to your record.</p>
               <p>Best regards,<br/>Aarogya Aadhar Team</p>`,
      };

      await transporter.sendMail(mailOptions);
      console.log("Notification email sent successfully to:", patient.email);
    }

    return NextResponse.json(newmember);
  } catch (error) {
    console.error("Error creating new member:", error);
    return NextResponse.json(
      { error: "An error occurred: " + error.message },
      { status: 500 }
    );
  }
}