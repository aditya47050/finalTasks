import { db } from "@/lib/db";
import { getSession } from "@/lib/getsession";
import HospitalDoctorSchedules from "../../components/HospitalDoctorSchedules";

export const dynamic = "force-dynamic";

const HospitalDoctorSchedulesPage = async () => {
  try {
    const session = await getSession();
    if (!session?.email) throw new Error("Session or email not found");

    // Only include APPROVED associations
    const doctor = await db.doctor.findUnique({
      where: { email: session.email },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        HospitalDoctor: {
          where: { status: "APPROVED" },
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            consultationDays: true,
            consultationTime: true,
            hospital: {
              select: {
                id: true,
                email: true,
                mobile: true,
                hspInfo: { select: { regname: true } }, // hospital name
              },
            },
          },
        },
      },
    });

    if (!doctor) throw new Error("Doctor not found");
    if (!doctor.HospitalDoctor || doctor.HospitalDoctor.length === 0)
      throw new Error("No approved schedules found");

    const schedules = doctor.HospitalDoctor.map(hd => ({
      id: hd.id,
      consultationDays: hd.consultationDays,
      consultationTime: hd.consultationTime,
      hospital: {
        id: hd.hospital.id,
        regname: hd.hospital.hspInfo?.regname || "Unnamed Hospital",
        email: hd.hospital.email,
        mobile: hd.hospital.mobile,
      },
    }));

    return (
      <HospitalDoctorSchedules
        doctor={doctor}
        schedules={schedules}
      />
    );
  } catch (error) {
    console.error("Error loading schedules:", error);
    return (
      <div className="text-center p-6">Error loading schedules: {error.message}</div>
    );
  }
};

export default HospitalDoctorSchedulesPage;