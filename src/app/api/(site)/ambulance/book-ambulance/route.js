import { NextResponse } from "next/server";
import { getSession } from "@/lib/getsession";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/mailer";
import { generateEmailContent } from "@/lib/bookingmail";
import { getLoggedInUser } from "@/lib/getLoggedInUser";

export async function POST(req) {
  const session = await getSession();

  if (!session || !session.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const {
    ambulancetype,
    ambulancecategory,
    hospitaltype,
    ambulanceVaichicleId,
    diseaseDetails,
    medicaldoc1,
    medicaldoc2,
    medicaldoc3, // selected ambulance
    email: payloadEmail,
  } = body;

  const loggedIn = await getLoggedInUser();

  try {
    let patient = null;

    // 1. Try session email
    if (session?.email) {
      patient = await db.patient.findUnique({
        where: { email: session.email },
      });
    }

        // 2. If not found, try payload email
    if (!patient && payloadEmail) {
      patient = await db.patient.findUnique({
        where: { email: payloadEmail },
      });
    }

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    // Create a new booking
    const newBooking = await db.bookAmbulance.create({
      data: {
        firstName: patient.firstName ?? "",
        middleName: patient.middleName,
        lastName: patient.lastName ?? "",
        dateOfBirth: patient.dateOfBirth ?? "",
        gender: patient.gender ?? "",
        aadharCardNumber: patient.aadharCardNumber ?? "",
        mobileNumber: patient.mobile,
        email: patient.email,
        ambulancetype,
        ambulancecategory,
        hospitaltype,
        patientId: patient.id, // ✅ Direct link to patient
        ambulanceVaichicleId,
        diseaseDetails,
        medicaldoc1,
        medicaldoc2,
        medicaldoc3,
        bookedByType: loggedIn.bookedByType,
        bookedById: loggedIn.id,
        hospitalId: loggedIn.hospitalId,
        hspRole: loggedIn.hspRole,
      },
    });

    // Update the status of the selected ambulance vehicle to "BOOKED"
    const updatedVehicle = await db.AmbulanceVaichicle.update({
      where: { id: ambulanceVaichicleId },
      data: { status: "BOOKED" },
      include: {
        driver: true,
        ambulance: {
          include: {
            AmbulanceHsp: true,
          },
        },
      },
    });

    // Prepare email data
    const emailData = {
      patientName: patient.firstName,
      bookingDate: new Date().toLocaleDateString(),
      bookingTime: new Date().toLocaleTimeString(),
      ambulanceType: ambulancetype,
      hospitalType: hospitaltype,
      insuranceDetails: false, // Assuming no insurance details provided
      mobileNumber: patient.mobile,
      hospitalName: updatedVehicle.ambulance?.AmbulanceHsp?.hspregname || "Aarogya Aadhar",
    };

    // Send booked email to patient
    await sendEmail(patient.email, `Ambulance Booking Confirmation – ${patient.firstName}`, generateEmailContent("BOOKED", emailData));

    // Send booking request email to ambulance owner and driver
    if (updatedVehicle.ambulance?.email) {
      await sendEmail(updatedVehicle.ambulance.email, `Ambulance Booking Request - ${emailData.hospitalName}`, generateEmailContent("BOOKED", emailData));
    }
    if (updatedVehicle.driver?.email) {
      await sendEmail(updatedVehicle.driver.email, `Ambulance Booking Request - ${emailData.hospitalName}`, generateEmailContent("BOOKED", emailData));
    }

    return NextResponse.json(
      { message: "Ambulance booked successfully", booking: newBooking },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error booking ambulance:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}