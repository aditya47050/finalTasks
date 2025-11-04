// src/app/api/abha/patients/check/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, mobile } = body;

    if (!email && !mobile) {
      return NextResponse.json({
        success: false,
        error: 'Email or mobile is required'
      }, { status: 400 });
    }

    console.log('🔍 Checking existing patient...', { email, mobile });

    // Check for existing patients with same email or mobile
    const existingPatients = await prisma.patient.findMany({
      where: {
        OR: [
          { email: email || '' },
        ]
      },
      select: {
        id: true,
        email: true,
        mobile: true,
        firstName: true,
        lastName: true,
        abhaCardNumber: true,
        profileComplete: true
      }
    });

    console.log('✅ Patient check completed:', {
      found: existingPatients.length,
      patients: existingPatients
    });

    return NextResponse.json({
      success: true,
      patients: existingPatients,
      count: existingPatients.length,
      exists: existingPatients.length > 0
    });

  } catch (error) {
    console.error('❌ Patient check error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to check existing patients',
      details: error.message 
    }, { status: 500 });
  }
}