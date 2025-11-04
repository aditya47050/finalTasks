// app/patient/dashboard/payment/page.jsx
import React from "react";
import { db } from "@/lib/db";
import PatientPayment from "../../../components/paymenthistory";

export const dynamic = "force-dynamic";

const PatientPaymentPage = async () => {
  try {
    // ✅ Fetch payments with patient details and health cards
    const payments = await db.patientPayment.findMany({
      include: {
        patient: {
          include: {
            healthcard: { select: { cardNo: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // ✅ Fetch state, district, and taluka master data
    const [states, districts, talukas] = await Promise.all([
      db.state.findMany({ select: { id: true, stateName: true } }),
      db.district.findMany({ select: { id: true, district: true, stateId: true } }),
      db.subDistrict.findMany({ select: { id: true, subDistrict: true, districtId: true } }),
    ]);

    if (!payments.length) {
      return <div className="text-center p-6">No payment history found.</div>;
    }

    // ✅ Format payments data
    const formattedData = payments.map((payment) => ({
      id: payment.id,
      amount: payment.amount,
      status: payment.paymentStatus,
      transactionId: payment.transactionId,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
      patient: {
        id: payment.patient.id,
        firstName: payment.patient.firstName,
        middleName: payment.patient.middleName,
        lastName: payment.patient.lastName,
        email: payment.patient.email,
        mobile: payment.patient.mobile,
        gender: payment.patient.gender,
        city: payment.patient.city,
        state: payment.patient.state,
        district: payment.patient.district,
        taluka: payment.patient.taluka,
        bloodgroup: payment.patient.bloodgroup,
        aadharCardNumber: payment.patient.aadharCardNumber,
        abhaCardNumber: payment.patient.abhaCardNumber,
        healthCardNo:
          payment.patient.healthcard?.[0]?.cardNo || null,
      },
    }));

    return (
      <PatientPayment
        userdata={formattedData}
        state={states}
        district={districts}
        taluka={talukas}
      />
    );
  } catch (error) {
    console.error("Error loading PatientPaymentPage:", error);
    return <div className="text-center p-6 text-red-500">Something went wrong.</div>;
  }
};

export default PatientPaymentPage;
