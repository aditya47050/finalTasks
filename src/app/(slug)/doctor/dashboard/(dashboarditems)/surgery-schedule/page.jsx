import { db } from "@/lib/db"; // your prisma client
import { getSession } from '@/lib/getsession';
import DoctorSurgerySchedulelist from "../../components/DoctorSurgerySchedulelist";

const DoctorSurgeryView = async () => {
  try {
    // Get logged-in doctor
    const session = await getSession();
    if (!session?.email) {
      throw new Error("Session or email not found");
    }

    // Find doctorId from email
    const doctor = await db.doctor.findUnique({
      where: { email: session.email },
    });
    if (!doctor) {
      throw new Error("Doctor not found");
    }

    // Fetch only surgery bookings where this doctor is assigned
    const bookings = await db.bookSurgeryDoctor.findMany({
      where: {
        doctorId: doctor.id,
        booking: {
          service: {
            type: "Surgery" // Ensure we're filtering by type
          }
        }
      },
      include: {
        booking: {
          include: {
            patient: true,
            service: { include: { hospital: true } },
          },
        },
        doctor: true,
      },
    });


    return (
      <DoctorSurgerySchedulelist bookings={bookings} />
    );
  } catch (error) {
    console.error("Error fetching doctor bookings:", error);
  }
}

export default DoctorSurgeryView;