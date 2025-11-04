import React from "react";
import { getSession } from "@/lib/getsession";
import { db } from "@/lib/db";
import HospitalAppointments from "../components/HospitaldoctorAppointments";

const HospitalAppointmentsPage = async () => {
  // Get current hospital session
  const session = await getSession();

  if (!session || !session.email) {
    return <div>Unauthorized</div>;
  }

  // Fetch hospital info
  const hospital = await db.Hospital.findFirst({
    where: { email: session.email },
    select: { id: true },
  });

  if (!hospital) return <div>Hospital not found</div>;

  // Fetch all doctors of the hospital
  const hospitalDoctors = await db.HospitalDoctor.findMany({
    where: { hospitalId: hospital.id },
    include: {
      doctor: true,
    },
  });

  const doctorIds = hospitalDoctors.map((hd) => hd.doctor.id);

  // Fetch all appointments for hospital doctors with patient info
  const appointments = await db.BookFreeAppointment.findMany({
    where: { doctorId: { in: doctorIds } },
    include: {
      patient: true,
      doctor: true,
      category: true,
    },
    orderBy: { createdAt: "desc" }, // Latest appointment first
  });

  return (
    <HospitalAppointments
      appointments={appointments}
      hospitalId={hospital.id}
    />
  );
};

export default HospitalAppointmentsPage;
