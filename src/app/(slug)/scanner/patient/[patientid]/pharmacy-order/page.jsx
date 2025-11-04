import React from "react";
import { db } from "@/lib/db";
import PharmacyViewOrder from "../../components/pharmacy-order";
import { getSession } from "@/lib/getsession";

export const dynamic = "force-dynamic";

const PatientPharmacyOrderPage = async ({ params }) => {
  try {
    const { patientid: patientId } = params;

    if (!patientId) {
      return <div className="text-center p-6">Patient ID not provided</div>;
    }

    // ✅ Get logged-in pharmacy from session
    const session = await getSession();

    let loggedInPharmacy = null;
    if (session?.email) {
      loggedInPharmacy = await db.Pharmacy.findFirst({
        where: { email: session.email },
        select: { id: true, regname: true, email: true },
      });
    }

    // Fetch patient with pharmacy orders
    const patient = await db.patient.findUnique({
      where: { id: patientId },
      include: {
        PharmacyOrder: {
          orderBy: { createdAt: "desc" },
          include: {
            pharmacy: true,
            items: { include: { product: true } },
          },
        },
      },
    });

    if (!patient) {
      return <div className="text-center p-6">Patient not found</div>;
    }

    // ✅ Flag orders belonging to logged-in pharmacy
    const formattedOrders = patient.PharmacyOrder.map((order) => {
      const canUpload = loggedInPharmacy ? order.pharmacyId === loggedInPharmacy.id : false;
      return {
        ...order,
        canUpload,
      };
    });


    return <PharmacyViewOrder order={{ ...patient, PharmacyOrder: formattedOrders }} />;
  } catch (error) {
    console.error("Error loading PharmacyOrderPage:", {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });
    return (
      <div className="text-center p-6">
        Something went wrong. Check console for details.
      </div>
    );
  }
};

export default PatientPharmacyOrderPage;
