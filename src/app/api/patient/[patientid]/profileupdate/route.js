// app/api/patient/profileupdate/route.js
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/getsession';

export async function POST(request) {
  return handleProfileUpdate(request);
}

export async function PATCH(request) {
  return handleProfileUpdate(request);
}

async function handleProfileUpdate(request) {
  try {
    // 1. Authentication Check
    const session = await getSession();
    if (!session?.email) {
      return NextResponse.json(
        { error: "Unauthorized: No valid session" },
        { status: 401 }
      );
    }

    // 2. Parse Request Body (JSON or FormData)
    let updateData = {};
    const contentType = request.headers.get("content-type");

    if (contentType?.includes("multipart/form-data")) {
      const formData = await request.formData();
      updateData = Object.fromEntries(formData.entries());

      if (updateData.incomerange) {
        try {
          updateData.incomerange = JSON.parse(updateData.incomerange);
        } catch (e) {
          console.warn("Failed to parse incomerange:", updateData.incomerange);
          updateData.incomerange = null;
        }
      }
    } else {
      try {
        updateData = await request.json();
        if (
          !updateData ||
          typeof updateData !== "object" ||
          Array.isArray(updateData)
        ) {
          throw new Error("Invalid request body structure");
        }
      } catch (error) {
        return NextResponse.json(
          { error: "Bad Request: Malformed payload" },
          { status: 400 }
        );
      }
    }

    // 3. Decide which email to use (body.email takes priority)
    const targetEmail = updateData.email || session.email;

    if (!targetEmail) {
      return NextResponse.json(
        { error: "Bad Request: No email provided to identify patient" },
        { status: 400 }
      );
    }

    // 4. Fetch Patient
    const patient = await db.patient.findUnique({
      where: { email: targetEmail },
      select: { id: true },
    });

    if (!patient) {
      return NextResponse.json(
        { error: `Not Found: Patient record not found for ${targetEmail}` },
        { status: 404 }
      );
    }

    // 4. Data Transformation and Validation
    const prismaData = {
      // Personal Info
      firstName: updateData.firstName,
      middleName: updateData.middleName,
      lastName: updateData.lastName,
      dateOfBirth: updateData.dateOfBirth ? new Date(updateData.dateOfBirth) : null,
      gender: updateData.gender,
      maritalStatus: updateData.maritalStatus,
      religion: updateData.religion,
      alternateMobile: updateData.alternateMobile,
      presentAddress: updateData.presentAddress,
      city: updateData.city,
      state: updateData.state,
      district: updateData.district,
      taluka: updateData.taluka,
      pincode: updateData.pincode,
      bloodgroup: updateData.bloodgroup,
      
      // Documents
      aadharCardNumber: updateData.aadharCardNumber,
      abhacard: updateData.abhacard === 'true',
      abhaCardNumber: updateData.abhaCardNumber,
      healthInsurance: updateData.healthInsurance === 'true',
      healthInsuranceNumber: updateData.healthInsuranceNumber,
      ayushmancard: updateData.ayushmancard === 'true',
      ayushmanCard: updateData.ayushmanCard,
      rationcard: updateData.rationcard === 'true',
      rationCardNumber: updateData.rationCardNumber,
      rationcardtype: updateData.rationcardtype,
      organDonation: updateData.organDonation === 'true',
      
      // Bank & Contact
      bankName: updateData.bankName,
      accountNumber: updateData.accountNumber,
      ifscCode: updateData.ifscCode,
      accountType: updateData.accountType,
      micrCode: updateData.micrCode,
      income: updateData.income === 'true',
      incomeCertificateNo: updateData.incomeCertificateNo,
      incomerange: updateData.incomerange 
        ? JSON.stringify(updateData.incomerange)
        : null,
      contactPersonName: updateData.contactPersonName,
      contactPersonRelation: updateData.contactPersonRelation,
      contactmanaadharNumber: updateData.contactmanaadharNumber,
      hasPanCard: updateData.hasPanCard === 'true',
      panCardNumber: updateData.panCardNumber,
      isCompanyRegistered: updateData.isCompanyRegistered === 'true',
      companyRegistrationNo: updateData.companyRegistrationNo,
      
      // System fields
      updatedAt: new Date()
    };

    // 5. Handle file uploads (if any)
    const fileFields = [
      "aadharCardFront", "aadharCardBack", "abhaCardFront",
      "healthInsuranceDocument", "ayushmanCardFront", "rationCardFront",
      "rationCardBack", "cancelledCheque", "incomeCertificateimg",
      "panCard", "employeeIdCard"
    ];

    fileFields.forEach(field => {
      if (updateData[field]) {
        prismaData[field] = updateData[field];
      }
    });

    // 6. Update Patient Profile
    const updatedPatient = await db.patient.update({
      where: { id: patient.id },
      data: prismaData
    });

    // 7. Update HealthCard Status Only After Successful Patient Update
    if (updatedPatient) {
      await db.healthCard.updateMany({
        where: { 
          patientId: patient.id,
          approvalStatus: { not: "UPDATED" } // Skip if already UPDATED
        },
        data: { approvalStatus: "UPDATED" }
      });
    }

    // 8. Success Response
    return NextResponse.json({
      success: true,
      data: updatedPatient,
      message: "Profile updated successfully. Health card marked for re-review."
    });

  } catch (error) {
    console.error('Profile Update Error:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: "Not Found: Patient record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        error: error.message || "Internal Server Error",
        ...(process.env.NODE_ENV === 'development' && {
          details: error.message,
          stack: error.stack
        })
      },
      { status: 500 }
    );
  }
}

function safeJsonParse(str) {
  try {
    return JSON.parse(str);
  } catch (e) {
    console.warn('Failed to parse JSON:', str);
    return null;
  }
}