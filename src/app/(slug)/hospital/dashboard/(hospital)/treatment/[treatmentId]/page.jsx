import { db } from "@/lib/db"; // Prisma instance
import TreatmentBookingsList from "../../components/TreatmentBookingsList";
import { getSession } from "@/lib/getsession";
import { redirect } from "next/navigation";

const TreatmentBookingsPage = async ({ params }) => {
  const { treatmentId } = params; // treatmentId from URL

  // 1. Ensure user is logged in (hospital)
  const session = await getSession();
  if (!session || !session.email) {
    redirect("/hospital/login");
  }

  // 2. Get hospital
  const hospital = await db.hospital.findFirst({
    where: { email: session.email },
    select: { id: true },
  });

  if (!hospital) {
    redirect("/hospital/login");
  }

  // 3. Fetch treatment bookings for this hospital + treatment
  const bookings = await db.bookSurgeryTreatment.findMany({
    where: {
      serviceId: treatmentId,
      service: { type: "Treatment" },
    },
    include: {
      patient: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          mobile: true,
        },
      },
      service: {
        select: {
          id: true,
          serviceName: true,
          category: true,
          type: true,
          minPrice: true,
          maxPrice: true,
          hospital: {
            select: {
              id: true,
              email: true,
              hspInfo: {
                select: {
                  regname: true,
                },
              },
            },
          },
        },
      },
      // for showing currently assigned doctors on booking, if needed
      doctors: {
        include: { doctor: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // 4. Get ALL approved HospitalDoctors for this hospital (to offer for assignment)
  const doctors = await db.hospitalDoctor.findMany({
    where: {
      hospitalId: hospital.id,
      status: "APPROVED",
    },
    include: {
      doctor: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });

  // 5. Pass both bookings and doctors to the list component
  return (
    <div>
      <TreatmentBookingsList bookings={bookings} doctors={doctors} />
    </div>
  );
};

export default TreatmentBookingsPage;