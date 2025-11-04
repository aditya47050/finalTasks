import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      email,
      mobile,
      firstName,
      lastName,
      abhaNumber,
      abhaAddress,
      gender,
      dateOfBirth,
      address,
      stateName,
      districtName,
      pinCode,
      abhacard,
      profileComplete
    } = req.body;

    // Create new patient
    const newPatient = await prisma.patient.create({
      data: {
        email: email || `${abhaNumber}@temp.abha`,
        mobile: mobile || '0000000000',
        password: 'temp-password', // Should be set by user later
        firstName: firstName || '',
        lastName: lastName || '',
        gender: gender || '',
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        address: address || '',
        state: stateName || '',
        district: districtName || '',
        pincode: pinCode || '',
        abhacard: abhacard || true,
        abhaCardNumber: abhaNumber || '',
        profileComplete: profileComplete || true,
        // Set other required fields with defaults
        maritalStatus: null,
        religion: null,
        bloodgroup: null,
        role: 'Patient'
      }
    });

    res.status(201).json({
      success: true,
      patient: {
        id: newPatient.id,
        email: newPatient.email,
        mobile: newPatient.mobile,
        firstName: newPatient.firstName,
        lastName: newPatient.lastName,
        abhaCardNumber: newPatient.abhaCardNumber
      },
      message: 'Patient created successfully'
    });

  } catch (error) {
    console.error('Patient creation error:', error);
    
    if (error.code === 'P2002') {
      return res.status(409).json({ 
        error: 'Patient with this email already exists' 
      });
    }

    res.status(500).json({ 
      error: 'Failed to create patient',
      details: error.message 
    });
  }
}