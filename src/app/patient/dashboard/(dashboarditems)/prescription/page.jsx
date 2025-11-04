import { db } from "@/lib/db";
import { getSession } from "@/lib/getsession";
import PrescriptionList from "../../components/PrescriptionList";

export const dynamic = "force-dynamic";

const PatientPrescriptionsPage = async () => {
  try {
    const session = await getSession();

    if (!session?.email) {
      throw new Error("Session or email not found");
    }

    const patient = await db.patient.findUnique({
      where: { email: session.email },
    });

    if (!patient) {
      throw new Error("Patient not found");
    }

    const prescriptions = await db.prescription.findMany({
      where: { patientId: patient.id },
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
        <PrescriptionList prescriptions={prescriptions} />
      </div>
    );
  } catch (error) {
    console.error("Error loading prescriptions:", error);
    return <div className="text-center p-6">Error loading prescriptions</div>;
  }
};

export default PatientPrescriptionsPage;