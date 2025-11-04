import React from "react";
import Bookfreeappointment from "@/app/patient/dashboard/components/bookfreeappointment";
import { db } from "@/lib/db";
import { getSession } from "@/lib/getsession";
import { redirect } from "next/navigation";

const PatientBookFreeAppointmentPage = async () => {
  try {
    const session = await getSession();

    if (!session?.email) {
      redirect("/patient/login");
    }

    // Find patient by email
    const patient = await db.patient.findUnique({
      where: { email: session.email },
    });

    if (!patient) {
      redirect("/patient/login");
    }

    // Fetch appointments for this patient
    const Appointmentdata = await db.bookFreeAppointment.findMany({
      where: { patientId: patient.id },
      orderBy: { createdAt: 'desc' },
      include: {
        patient: true,
        category: { select: { title: true } },
        doctor: {
          select: {
            firstName: true,
            middleName: true,
            lastName: true,
          },
        },
      },
    });

    const doctortype = await db.expertDoctorsCategory.findMany();

    // Add full doctor name for UI
    const AppointmentWithDoctorName = Appointmentdata.map((appointment) => {
      const doctor = appointment.doctor;
      const fullDoctorName = doctor
        ? `${doctor.firstName || ""} ${doctor.middleName || ""} ${doctor.lastName || ""}`.trim()
        : "Doctor Not Available";

      return {
        ...appointment,
        doctorFullName: fullDoctorName,
        preferredDate: appointment.preferredDate,
        preferredTime: appointment.preferredTime,
      };
    });

    // Extract category titles
    const categorytitle = AppointmentWithDoctorName.map(
      (appointment) => appointment.category?.title
    );

    return (
      <div>
        <Bookfreeappointment
          userdata={AppointmentWithDoctorName}
          categorytitle={categorytitle}
          doctortype={doctortype}
        />
      </div>
    );
  } catch (error) {
    console.error("Error loading BookFreeAppointment:", error);
    return <div>Something went wrong. Please try again later.</div>;
  }
};

export default PatientBookFreeAppointmentPage;
