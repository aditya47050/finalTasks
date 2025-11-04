import React from "react";
import Bookfreeappointment from "../../components/bookfreeappointment";
import { db } from "@/lib/db";
import { getSession } from "@/lib/getsession";

const PatientBookFreeAppointmentPage = async ({ params, searchParams }) => {
  try {
    const { patientid: patientId } = params; 
    const role = searchParams?.role; 

    if (!patientId) {
      return <div>Patient ID not provided</div>;
    }

    const session = await getSession();

        // ✅ Try to fetch doctor if session email exists
        let doctor = null;
        if (session?.email) {
          doctor = await db.doctor.findUnique({
            where: { email: session.email },
          });
        }

    // ✅ Use PascalCase + ObjectId string
    const patient = await db.Patient.findUnique({
      where: { id: patientId },
    });

    if (!patient) {
      console.warn("Patient not found for ID:", patientId);
      return <div>Patient not found</div>;
    }

    // ✅ Use PascalCase model names
    const Appointmentdata = await db.BookFreeAppointment.findMany({
      where: { patientId: patient.id },
      orderBy: { createdAt: "desc" },
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


    // ✅ Mark doctor-linked appointments if doctor exists
    const AppointmentWithDoctorName = Appointmentdata.map((appointment) => {
      const doc = appointment.doctor;
      const fullDoctorName = doc
        ? `${doc.firstName || ""} ${doc.middleName || ""} ${doc.lastName || ""}`.trim()
        : "Doctor Not Available";

      return {
        ...appointment,
        doctorFullName: fullDoctorName,
        isMyAppointment: doctor ? appointment.doctorId === doctor.id : false, // 👈 only if doctor logged in
      };
    });

    const doctortype = await db.ExpertDoctorsCategory.findMany();

    // ✅ Only fetch templates if doctor logged in
    let templates = [];
    if (doctor) {
      templates = await db.PrescriptionTemplate.findMany({
        where: { doctorId: doctor.id },
        orderBy: { createdAt: "desc" },
      });
    }

    const categorytitle = AppointmentWithDoctorName.map(
      (appointment) => appointment.category?.title
    );

    return (
      <div>
        <Bookfreeappointment
          userdata={AppointmentWithDoctorName}
          categorytitle={categorytitle}
          doctortype={doctortype}
          doctor={doctor} 
          templates={templates}

        />
      </div>
    );
  } catch (error) {
    console.error("Error loading BookFreeAppointment:", error);
    return <div>Something went wrong. Please try again later.</div>;
  }
};

export default PatientBookFreeAppointmentPage;
