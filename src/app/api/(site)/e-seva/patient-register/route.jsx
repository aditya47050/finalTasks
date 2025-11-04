// src/app/api/eseva/register-patient-comprehensive/route.js

import { db } from "@/lib/db"; // Ensure your db connection is correctly set up
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs"; // For password hashing

export async function POST(request) {
  const {
    email,
    mobile,
    pincode,
    firstName,
    middleName,
    lastName,
    dateOfBirth,
    gender,
    maritalStatus,
    religion,
    alternateMobile,
    presentAddress,
    city,
    state,
    district,
    taluka,
    bloodgroup,
    aadharCardNumber,
    aadharCardFront,
    aadharCardBack,
    passportPhoto,
    abhacard,
    abhaCardNumber,
    abhaCardFront,
    healthInsurance,
    healthInsuranceNumber,
    healthInsuranceDocument,
    provider,
    coverage,
    copay,
    ayushmancard,
    ayushmanCard,
    ayushmanCardFront,
    rationcard,
    rationCardNumber,
    rationcardtype,
    rationCardFront,
    rationCardBack,
    organDonation,
    bankName,
    accountNumber,
    ifscCode,
    accountType,
    cancelledCheque,
    micrCode,
    income,
    incomeCertificateimg,
    incomeCertificateNo,
    incomerange,
    hasPanCard,
    panCardNumber,
    panCard,
    contactPersonName,
    contactPersonRelation,
    contactmanaadharNumber,
    isCompanyRegistered,
    companyRegistrationNo,
    employeeIdCard,
    password,
    esevaId,
    subAdminId,
    educationlevel,
    occupation,
    ekycdoc,
    caste,
    form,
  } = await request.json();

  // Check if the email is already registered
  const existingPatient = await db.Patient.findUnique({ where: { email } });
  if (existingPatient) {
    return NextResponse.json(
      { success: false, message: "Email already registered" },
      { status: 400 }
    );
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Use a transaction to ensure all operations succeed or fail together
    const patient = await db.$transaction(async (prisma) => {
      // Batch 1: Basic Information
      const basicInfo = await prisma.Patient.create({
        data: {
          email,
          mobile,
          pincode,
          firstName,
          middleName,
          lastName,
          password: hashedPassword,
          dateOfBirth: new Date(dateOfBirth),
          gender,
          maritalStatus,
          religion,
          alternateMobile,
          presentAddress,
          city,
          state,
          district,
          taluka,
          bloodgroup,
          educationlevel,
          occupation,
          caste,
        },
      });

      // Batch 2: Document Information
      const documentInfo = await prisma.Patient.update({
        where: { id: basicInfo.id },
        data: {
          aadharCardNumber,
          aadharCardFront,
          aadharCardBack,
          passportPhoto,
          abhacard,
          abhaCardNumber,
          abhaCardFront,
          healthInsurance,
          healthInsuranceNumber,
          healthInsuranceDocument,
          provider,
          coverage,
          copay,
          ayushmancard,
          ayushmanCard,
          ayushmanCardFront,
          rationcard,
          rationCardNumber,
          rationcardtype,
          rationCardFront,
          rationCardBack,
          ekycdoc,
          form,
        },
      });

      // Batch 3: Other Information
      const otherInfo = await prisma.Patient.update({
        where: { id: basicInfo.id },
        data: {
          organDonation,
          bankName,
          accountNumber,
          ifscCode,
          accountType,
          cancelledCheque,
          micrCode,
          income,
          incomeCertificateimg,
          incomeCertificateNo,
          incomerange: JSON.stringify(incomerange),
          hasPanCard,
          panCardNumber,
          panCard,
          contactPersonName,
          contactPersonRelation,
          contactmanaadharNumber,
          isCompanyRegistered,
          companyRegistrationNo,
          employeeIdCard,
          esevaId: esevaId || null,
          subAdminId: subAdminId || null,
        },
      });

      return otherInfo;
    });

    return NextResponse.json(
      { success: true, message: "Patient registered successfully!", patient },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Registration failed", error: error.message },
      { status: 500 }
    );
  }
}
