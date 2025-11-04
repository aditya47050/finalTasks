import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from "@/lib/db"


export async function POST(request) {
  try {
    const body = await request.json();
    const { patientData, password } = body;

    if (!patientData) {
      return NextResponse.json({ success: false, error: 'Patient data is required' }, { status: 400 });
    }

    if (!password) {
      return NextResponse.json({ success: false, error: 'Password is required' }, { status: 400 });
    }

    console.log('🔗 Starting patient integration...');

    // Destructure and match field names to your Prisma model
    const {
      email,
      mobile,
      firstName,
      lastName,
      abhaCardNumber,       // ✅ renamed to match schema
      presentAddress,       // ✅ renamed to match schema
      gender,
      dateOfBirth,
      state,
      district,
      pincode
    } = patientData;

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required for patient integration' }, { status: 400 });
    }

    // ✅ Check if a patient already exists
    const existingPatient = await db.patient.findUnique({
      where: { email }
    });

    if (existingPatient) {
      return NextResponse.json({
        success: false,
        error: 'Patient with this email already exists',
        patient: {
          id: existingPatient.id,
          email: existingPatient.email,
          firstName: existingPatient.firstName,
          lastName: existingPatient.lastName
        }
      }, { status: 409 });
    }

    // ✅ Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('🆕 Creating new patient with ABHA details...');

    // ✅ Create new patient in DB
    const newPatient = await db.patient.create({
      data: {
        email,
        mobile,
        password: hashedPassword,
        firstName: firstName || '',        // ✅ added
        lastName: lastName || '',
        gender: gender || '',
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        presentAddress: presentAddress || '',
        state: state || '',
        district: district || '',
        pincode: pincode || '',
        abhaCardNumber: abhaCardNumber || '',
        abhacard: true,                    // marks ABHA-linked patient
        profileComplete: true,
        role: 'Patient'
      }
    });

    console.log('✅ New patient created successfully:', newPatient.id);

    return NextResponse.json({
      success: true,
      patient: {
        id: newPatient.id,
        email: newPatient.email,
        mobile: newPatient.mobile,
        lastName: newPatient.lastName,
        abhaCardNumber: newPatient.abhaCardNumber,
        profileComplete: newPatient.profileComplete
      },
      message: 'Patient profile created successfully'
    });

  } catch (error) {
    console.error('❌ Patient integration error:', error);

    if (error.code === 'P2002') {
      return NextResponse.json({
        success: false,
        error: 'Patient with this email already exists'
      }, { status: 409 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to create patient profile',
      details: error.message
    }, { status: 500 });
  }
}
