export const revalidate = 0;
import { db } from "@/lib/db"; // Adjust the path if needed

export async function GET(req) {
  try {
    const [
      patientCount,
      bookfreeappointmentCount,
      bedbookingCount,
      emergencyambulanceCount,
      ambulancebookingCount,
      healthcarddataCount,
      doctordataCount,
      hospitaldataCount,
      clinicCount,
      homehealthcareCount,
      pathologyCount,
      diagnosticCenterCount,
    ] = await Promise.all([
      db.Patient.count(),
      db.BookFreeAppointment.count(),
      db.BedBooking.count(),
      db.EmergencyAmbulance.count(),
      db.BookAmbulance.count(),
      db.HealthCard.count(),
      db.Doctor.count(),
      db.Hospital.count({ where: { role: "Hospital" } }),
      db.Hospital.count({ where: { role: "Clinic" } }),
      db.Hospital.count({ where: { role: "homehealthcare" } }),
      db.Hospital.count({ where: { role: "Pathology" } }),
      db.Hospital.count({ where: { role: "DiagnosticCenter" } }),
    ]);

    return new Response(
      JSON.stringify({
        patientCount,
        bookfreeappointmentCount,
        bedbookingCount,
        emergencyambulanceCount,
        ambulancebookingCount,
        healthcarddataCount,
        doctordataCount,
        hospitaldataCount,
        clinicCount,
        homehealthcareCount,
        pathologyCount,
        diagnosticCenterCount,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, must-revalidate",
        },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
