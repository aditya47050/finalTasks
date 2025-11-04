import React from 'react'
import { db } from '@/lib/db';
import { getSession } from "@/lib/getsession";
import PharmacyViewOrder from '../../components/pharmacy-order';
const PatientPharmacyOrderPage = async () => {
    try {
        const session = await getSession();
        if (!session?.email) {
            throw new Error("Session or email not found");
        }

        const patient = await db.patient.findUnique({
          where: { email: session.email },
          include: {
            PharmacyOrder: {
              orderBy: { createdAt: "desc" },  // ✅ move it here
              include: {
                pharmacy: true,
                items: { include: { product: true } },
              },
            },
          },
        });
        

        if (!patient) {
            throw new Error("Patient not found");
        }
        return (
          <PharmacyViewOrder order={patient} />
        )
    } catch (error) {
        console.error("Error loading WellnessServicesPage:", {
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });
        return <div className="text-center p-6">Something went wrong. Check console for details.</div>;
    }
}

export default PatientPharmacyOrderPage
