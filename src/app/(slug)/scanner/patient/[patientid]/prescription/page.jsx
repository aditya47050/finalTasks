import { db } from "@/lib/db";
import { getSession } from "@/lib/getsession";
import PrescriptionList from "../../components/PrescriptionList";

export const dynamic = "force-dynamic";

const PatientPrescriptionsPage = async ({ params }) => {
    try {
        const { patientid: patientId } = params; // Get patientId from URL
    
        if (!patientId) {
          return <div className="text-center p-6">Patient ID not provided</div>;
        }

    // 1️⃣ Find patient by ID
    const patient = await db.patient.findUnique({
        where: { id: patientId },
      });
  

      if (!patient) {
        return <div className="text-center p-6">Patient not found</div>;
      }

    const prescriptions = await db.prescription.findMany({
      where: { patientId: patient.id, },
      include: {
        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            mobile: true,
          },
        },
        appointment: {
          select: {
            id: true,
            preferredDate: true,
            preferredTime: true,
          },
        },
        template: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return (
      <div className="container mx-auto p-6">
        <PrescriptionList prescriptions={prescriptions} patientId={patientId} />
      </div>
    );
  } catch (error) {
    console.error("Error loading prescriptions:", error);
    return <div className="text-center p-6">Error loading prescriptions</div>;
  }
};

export default PatientPrescriptionsPage;