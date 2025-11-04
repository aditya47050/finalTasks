import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { patientId, abhaData, abhacard, abhaCardNumber } = req.body;

    // Update patient with ABHA details
    const updatedPatient = await prisma.patient.update({
      where: { id: patientId },
      data: {
        abhacard: abhacard || true,
        abhaCardNumber: abhaCardNumber || abhaData.abhaNumber,
        profileComplete: true,
        // Update other fields if provided
        ...(abhaData.mobile && { mobile: abhaData.mobile }),
        ...(abhaData.email && { email: abhaData.email }),
        ...(abhaData.firstName && { firstName: abhaData.firstName }),
        ...(abhaData.lastName && { lastName: abhaData.lastName }),
        ...(abhaData.gender && { gender: abhaData.gender }),
        ...(abhaData.dateOfBirth && { dateOfBirth: new Date(abhaData.dateOfBirth) }),
        ...(abhaData.address && { address: abhaData.address })
      }
    });

    res.status(200).json({
      success: true,
      patient: {
        id: updatedPatient.id,
        email: updatedPatient.email,
        mobile: updatedPatient.mobile,
        firstName: updatedPatient.firstName,
        lastName: updatedPatient.lastName,
        abhaCardNumber: updatedPatient.abhaCardNumber
      },
      message: 'Patient updated with ABHA details'
    });

  } catch (error) {
    console.error('Patient update error:', error);
    res.status(500).json({ 
      error: 'Failed to update patient',
      details: error.message 
    });
  }
}