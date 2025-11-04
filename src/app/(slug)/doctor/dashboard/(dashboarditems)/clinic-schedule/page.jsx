import { db } from "@/lib/db";
import { getSession } from "@/lib/getsession";
import DoctorSchedules from "../../components/DoctorSchedules";

export const dynamic = "force-dynamic";

const DoctorSchedulesPage = async () => {
  try {
    const session = await getSession();

    if (!session?.email) {
      throw new Error("Session or email not found");
    }

    // Fetch doctor by session email
    const doctor = await db.doctor.findUnique({
      where: { email: session.email },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        specialities: { select: { speciality: true } },
        doctorvisitinghospitals: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            hospitalname: true,
            hospitalconsultationfee: true,
            hospitalinouttime: true,
            hospitalconsultationdays: true,
            hospitalcontactno: true,
            presentAddress: true,
            city: true,
            state: true,
            pincode: true,
            district: true,
            taluka: true,
          },
        },
      },
    });

    if (!doctor) {
      throw new Error("Doctor not found");
    }
    console.log(doctor.doctorvisitinghospitals)

    return (
      <DoctorSchedules
        doctor={doctor}
        schedules={doctor.doctorvisitinghospitals}
      />
    );
  } catch (error) {
    console.error("Error loading doctor schedules:", error);
    return <div className="text-center p-6">Error loading schedules</div>;
  }
};

export default DoctorSchedulesPage;