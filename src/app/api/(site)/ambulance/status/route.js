import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/mailer";
import { generateEmailContent } from "@/lib/bookingmail";

export async function POST(request) {
  try {
    const { vehicleId, newStatus } = await request.json();

    // Validate the new status
    const validStatuses = ["PENDING", "BOOKED", "CONFIRMED", "ADMITTED", "AVAILABLE"];
    if (!validStatuses.includes(newStatus)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Update the status of the ambulance vehicle
    const updatedVehicle = await db.AmbulanceVaichicle.update({
      where: { id: vehicleId },
      data: { status: newStatus },
      include: {
        driver: true, // Ensure driver is included
        ambulance: {
          include: {
            AmbulanceHsp: true,
          },
        },
      },
    });

    if (!updatedVehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    // Fetch the latest booking for this vehicle to get patient details
    const latestBooking = await db.BookAmbulance.findFirst({
      where: { ambulanceVaichicleId: vehicleId },
      orderBy: { createdAt: 'desc' }, // Assuming you have a createdAt field to get the latest booking
      include: {
        patient: true, // Assuming there's a relation to the patient
      },
    });

    if (!latestBooking) {
      return NextResponse.json({ error: "No booking found for this vehicle" }, { status: 404 });
    }

    // Prepare email data using patient details
    const emailData = {
      patientName: latestBooking.patient?.firstName || "Patient",
      bookingDate: new Date().toLocaleDateString(),
      bookingTime: new Date().toLocaleTimeString(),
      ambulanceType: updatedVehicle.ambulancetype,
      hospitalType: updatedVehicle.ambulance?.AmbulanceHsp?.hspregname || "Hospital",
      insuranceDetails: latestBooking.healthInsurance ? "Yes" : "No",
      mobileNumber: latestBooking.patient?.mobile || "N/A",
      hospitalName: updatedVehicle.ambulance?.AmbulanceHsp?.hspregname || "Hospital",
    };

    // Send emails based on the new status
    switch (newStatus) {
      case "BOOKED":
        if (updatedVehicle.ambulance?.email) {
          await sendEmail(updatedVehicle.ambulance.email, `Ambulance Booking Request - ${emailData.hospitalName}`, generateEmailContent("BOOKED", emailData));
        }
        if (updatedVehicle.driver?.email) {
          await sendEmail(updatedVehicle.driver.email, `Ambulance Booking Request - ${emailData.hospitalName}`, generateEmailContent("BOOKED", emailData));
        }
        break;
      case "CONFIRMED":
        if (updatedVehicle.ambulance?.email) {
          await sendEmail(updatedVehicle.ambulance.email, `Confirmed on Your Ambulance Booking Request – ${emailData.patientName}`, generateEmailContent("CONFIRMED", emailData));
        }
        if (updatedVehicle.driver?.email) {
          await sendEmail(updatedVehicle.driver.email, `Confirmed on Your Ambulance Booking Request – ${emailData.patientName}`, generateEmailContent("CONFIRMED", emailData));
        }
        break;
      case "ADMITTED":
        if (updatedVehicle.driver?.email) {
          await sendEmail(updatedVehicle.driver.email, `Admitted on Your Ambulance Booking Request – ${emailData.patientName}`, generateEmailContent("ADMITTED", emailData));
        }
        if (updatedVehicle.ambulance?.email) {
          await sendEmail(updatedVehicle.ambulance.email, `Admitted on Your Ambulance Booking Request – ${emailData.patientName}`, generateEmailContent("ADMITTED", emailData));
        }
        break;
      // Add more cases as needed
    }

    return NextResponse.json({ message: "Status updated successfully", vehicle: updatedVehicle });
  } catch (error) {
    console.error("Error updating vehicle status:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}