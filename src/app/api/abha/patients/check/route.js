import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, mobile } = req.body;

    // Check for existing patients with same email or mobile
    const existingPatients = await prisma.patient.findMany({
      where: {
        OR: [
          { email: email || '' },
          { mobile: mobile || '' }
        ]
      },
      select: {
        id: true,
        email: true,
        mobile: true,
        firstName: true,
        lastName: true,
        abhacard: true
      }
    });

    res.status(200).json({
      patients: existingPatients,
      count: existingPatients.length
    });

  } catch (error) {
    console.error('Patient check error:', error);
    res.status(500).json({ 
      error: 'Failed to check existing patients',
      details: error.message 
    });
  }
}