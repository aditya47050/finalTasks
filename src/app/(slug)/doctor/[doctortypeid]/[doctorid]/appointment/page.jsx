
import { db } from "@/lib/db";
import { getSession } from "@/lib/getsession";
import DoctorBooking from "../components/DoctorBooking";

export const dynamic = "force-dynamic";

export default async function Page({ params }) {
  try {
    const { doctorid } = params;
    
    if (!doctorid) {
      throw new Error("Doctor ID is required");
    }

    const session = await getSession();
    
    if (!session?.email) {
      throw new Error("Please login to book an appointment");
    }

    // Get only the fields that exist in your Patient model
    const patient = await db.patient.findUnique({
      where: { email: session.email },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        mobile: true, // Changed from mobileNumber to mobile
        email: true,
        city: true,
        pincode: true, // Changed from pinCode to pincode
        gender: true,
        dateOfBirth: true
      }
    });

    if (!patient) {
      throw new Error("Patient profile not found");
    }

    return (
      <DoctorBooking
        doctorId={doctorid}
        patient={patient}
      />
    );
  } catch (error) {
    console.error("Error loading appointment page:", error);
    return (
      <div className="text-center p-6 text-red-500">
        {error.message || "Something went wrong"}
      </div>
    );
  }
}