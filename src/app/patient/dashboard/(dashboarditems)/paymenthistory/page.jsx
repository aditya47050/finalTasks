// app/patient/dashboard/payment/page.jsx

import React from "react";
import { db } from "@/lib/db";
import { getSession } from "@/lib/getsession";
import PatientPayment from "@/app/patient/dashboard/components/paymenthistory";

export const dynamic = "force-dynamic";

const PatientPaymentPage = async () => {
  try {
    // 1️⃣ Get session email
    const session = await getSession();

    if (!session?.email) {
      throw new Error("Session or email not found");
    }

    // 2️⃣ Find patient and get their ID along with health card info
    const patient = await db.patient.findUnique({
      where: { email: session.email },
      select: { 
        id: true,
        healthcard: {
          select: {
            cardNo: true
          }
        }
      },
    });

    if (!patient) {
      throw new Error("Patient not found");
    }

    // 3️⃣ Fetch patient payments (if any)
    const payments = await db.patientPayment.findMany({
      where: { patientId: patient.id },
      orderBy: { createdAt: "desc" },
    });

    if (!payments || payments.length === 0) {
      return (
        <div className="text-center p-6">
          No payment history found.
        </div>
      );
    }

    // Format data including health card number
    const formattedData = payments.map((payment) => ({
      id: payment.id,
      amount: payment.amount,
      status: payment.paymentStatus,
      transactionId: payment.transactionId,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
      healthCardNo: patient.healthcard[0]?.cardNo || null // Get the first health card's number if exists
    }));

    // 4️⃣ Pass data to component
    return <PatientPayment userdata={formattedData} />;
  } catch (error) {
    console.error("Error loading PatientPaymentPage:", error);
    return <div className="text-center p-6">Something went wrong.</div>;
  }
};

export default PatientPaymentPage;