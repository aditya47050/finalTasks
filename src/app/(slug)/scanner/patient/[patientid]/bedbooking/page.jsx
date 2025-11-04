import React from "react";
import { db } from "@/lib/db";
import BedBooking from "../../components/bedbooking";

export const dynamic = "force-dynamic";

const PatientBedBookingPage = async ({ params }) => {
  try {
    const { patientid: patientId } = params; // Get patientId from URL

    if (!patientId) {
      return <div className="text-center p-6">Patient ID not provided</div>;
    }

    // Fetch patient by ID
    const patient = await db.patient.findUnique({
      where: { id: patientId },
    });

    if (!patient) {
      return <div className="text-center p-6">Patient not found</div>;
    }

    // Fetch bed bookings for this patient
    const bedBookings = await db.bedBooking.findMany({
      where: { patientId: patient.id },
      orderBy: { createdAt: "desc" },
      include: {
        bed: {
          include: {
            hospital: {
              include: {
                hspInfo: true,
              },
            },
            category: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    // Format bed booking data
    const formattedData = bedBookings.map((booking) => ({
      id: booking.id,
      bedCategory: booking.bedCategory,
      documents: [
        booking.medicaldoc1 ? { name: "Medical Document 1", url: booking.medicaldoc1, type: "Medical" } : null,
        booking.medicaldoc2 ? { name: "Medical Document 2", url: booking.medicaldoc2, type: "Medical" } : null,
        booking.medicaldoc3 ? { name: "Medical Document 3", url: booking.medicaldoc3, type: "Medical" } : null,
        booking.medicaldoc4 ? { name: "Medical Document 4", url: booking.medicaldoc4, type: "Medical" } : null,
        booking.medicaldoc5 ? { name: "Medical Document 5", url: booking.medicaldoc5, type: "Medical" } : null,
        booking.aadharCardImage ? { name: "Aadhar Card", url: booking.aadharCardImage, type: "ID Proof" } : null,
        booking.healthInsuranceDocument ? { name: "Health Insurance", url: booking.healthInsuranceDocument, type: "Insurance" } : null,
        booking.ayushmanCardFront ? { name: "Ayushman Card", url: booking.ayushmanCardFront, type: "Insurance" } : null,
      ].filter(Boolean),
      bedCategoryId: booking.bed?.category?.id,
      bedCategoryName: booking.bed?.category?.name,
      bedCategoryImage: booking.bed?.category?.image,
      hospitalType: booking.hospitalType,
      diseaseDetails: booking.diseaseDetails,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
      bookingDate: booking.Bookingdate,
      bedId: booking.bedId,
      hospitalId: booking.bed?.hospital?.id,
      bedDetails: {
        bedNumber: booking.bed?.bedNumber,
        bedType: booking.bed?.bedType,
        bedStatus: booking.bed?.bedStatus,
      },
      hospitalDetails: {
        name: booking.bed?.hospital?.hspInfo?.regname,
        address: booking.bed?.hospital?.address,
        contact: booking.bed?.hospital?.contact,
      },
    }));

    return <BedBooking userdata={formattedData} />;
  } catch (error) {
    console.error("Error loading BedBookingPage:", error);
    return <div className="text-center p-6">Something went wrong.</div>;
  }
};

export default PatientBedBookingPage;
