// app/patient/dashboard/upcoming-bookings/page.jsx
import React from "react";
import { db } from "@/lib/db";
import { getSession } from "@/lib/getsession";
import UpcomingSchedule from "@/app/patient/dashboard/components/upcomingschedule";

export const dynamic = "force-dynamic";

const PatientUpcomingSchedulePage = async () => {
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

    // Today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

// Only surgery and treatment use preferredDate
const [
  appointments,
  bedBookings,
  ambulanceBookings,
  diagnosticBookings,
  surgeryBookings,
  treatmentBookings
] = await Promise.all([
  // Appointments → only createdAt
  db.bookFreeAppointment.findMany({
    where: {
      patientId: patient.id,
      createdAt: { gte: today },
    },
    include: {
      category: { select: { title: true } },
      doctor: { select: { firstName: true, middleName: true, lastName: true } },
    },
    orderBy: { createdAt: "asc" },
  }),

  // Bed bookings → only Bookingdate
  db.bedBooking.findMany({
    where: {
      patientId: patient.id,
      Bookingdate: { gte: today },
    },
    include: {
      bed: {
        include: {
          hospital: { include: { hspInfo: true } },
          category: { select: { name: true } },
        },
      },
    },
    orderBy: { Bookingdate: "asc" },
  }),

  // Ambulance bookings → only createdAt
  db.bookAmbulance.findMany({
    where: {
      patientId: patient.id,
      createdAt: { gte: today },
    },
    include: {
      ambulanceVaichicle: {
        include: {
          ambulance: {
            include: {
              AmbulanceHsp: { select: { hspregname: true } },
            },
          },
        },
      },
    },
    orderBy: { createdAt: "asc" },
  }),

  // Diagnostic bookings → only bookingDate
  db.bookDiagnosticService.findMany({
    where: {
      patientId: patient.id,
      bookingDate: { gte: today },
    },
    include: {
      service: {
        include: {
          Hospital: { include: { hspInfo: true } },
        },
      },
    },
    orderBy: { bookingDate: "asc" },
  }),

  // Surgery bookings → preferredDate + bookingDate
  db.bookSurgeryTreatment.findMany({
    where: {
      patientId: patient.id,
      OR: [
        { preferredDate: { gte: today } },
        { bookingDate: { gte: today } },
      ],
      service: { type: "Surgery" },
    },
    include: {
      service: { select: { serviceName: true, category: true } },
      patient: { select: { firstName: true, lastName: true } },
    },
    orderBy: [{ preferredDate: "asc" }, { bookingDate: "asc" }],
  }),

  // Treatment bookings → preferredDate + bookingDate
  db.bookSurgeryTreatment.findMany({
    where: {
      patientId: patient.id,
      OR: [
        { preferredDate: { gte: today } },
        { bookingDate: { gte: today } },
      ],
      service: { type: "Treatment" },
    },
    include: {
      service: { select: { serviceName: true, category: true } },
      patient: { select: { firstName: true, lastName: true } },
    },
    orderBy: [{ preferredDate: "asc" }, { bookingDate: "asc" }],
  }),
]);


    const formattedData = {
      appointments: appointments.map(appt => ({
        id: appt.id,
        category: appt.category?.title || "N/A",
        date: appt.preferredDate || appt.createdAt,
        status: appt.status || "N/A",
        doctorName: appt.doctor
          ? `${appt.doctor.firstName || ""} ${appt.doctor.middleName || ""} ${appt.doctor.lastName || ""}`.trim()
          : "N/A",
      })),
      bedBookings: bedBookings.map(booking => ({
        id: booking.id,
        bedCategory: booking.bedCategory || booking.bed?.category?.name || "N/A",
        hospitalType: booking.hospitalType || "N/A",
        hospitalName: booking.bed?.hospital?.hspInfo?.regname || booking.hospitalName || "N/A",
        date: booking.preferredDate || booking.Bookingdate,
      })),
      ambulanceBookings: ambulanceBookings.map(booking => ({
        id: booking.id,
        ambulanceType: booking.ambulancetype || "N/A",
        ambulanceCategory: booking.ambulancecategory || "N/A",
        hospitalName: booking.ambulanceVaichicle?.ambulance?.AmbulanceHsp?.hspregname || "N/A",
        date: booking.preferredDate || booking.createdAt,
      })),
      diagnosticBookings: diagnosticBookings.map(booking => ({
        id: booking.id,
        category: booking.service?.category || "N/A",
        subCategory: booking.service?.subCategory || "N/A",
        facility: booking.service?.facility || "N/A",
        hospitalName: booking.service?.Hospital?.hspInfo?.regname || "N/A",
        date: booking.preferredDate || booking.bookingDate,
      })),
      surgeryBookings: surgeryBookings.map(booking => ({
        id: booking.id,
        surgeryName: booking.service?.serviceName || "N/A",
        category: booking.service?.category || "N/A",
        status: booking.status || "N/A",
        preferredDate: booking.preferredDate,
        date: booking.preferredDate || booking.bookingDate,
      })),
      treatmentBookings: treatmentBookings.map(booking => ({
        id: booking.id,
        treatmentName: booking.service?.serviceName || "N/A",
        category: booking.service?.category || "N/A",
        status: booking.status || "N/A",
        preferredDate: booking.preferredDate,
        date: booking.preferredDate || booking.bookingDate,
      })),
    };

    return <UpcomingSchedule bookings={formattedData} />;
  } catch (error) {
    console.error("Error loading upcoming bookings:", error);
    return (
      <div className="text-center p-6">
        Something went wrong. Please try again later.
      </div>
    );
  }
};

export default PatientUpcomingSchedulePage;
