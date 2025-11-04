import { db } from "@/lib/db"
import { getSession } from "@/lib/getsession"
import DoctorAppointments from "../../components/DoctorAppointments"

export const dynamic = "force-dynamic"

const DoctorAppointmentsPage = async () => {
  try {
    const session = await getSession()

    if (!session?.email) {
      throw new Error("Session or email not found")
    }

    // Fetch doctor data
    const doctor = await db.doctor.findUnique({
      where: { email: session.email },
      include: { doctorinfo: true },
    })

    if (!doctor) {
      throw new Error("Doctor not found")
    }

    // Fetch appointments for this doctor with patient, medical history & health card
    const appointments = await db.bookFreeAppointment.findMany({
      where: { doctorId: doctor.id },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            gender: true,
            dateOfBirth: true,
            mobile: true,
            email: true,
            presentAddress: true,
            // ✅ Include relations
            medicalhistory: true,
            healthcard: true,
          },
        },
        category: {
          select: { id: true, title: true },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    

    // Map patient details to flat fields for easier UI usage
    const formattedAppointments = appointments.map((appointment) => {
      const mh = appointment.patient?.medicalhistory?.[0] || {} // take first record
      const dd = mh.diseaseDetails || {} // JSON fallback

      return {
        ...appointment,
        patientName: `${appointment.patient?.firstName || ""} ${appointment.patient?.lastName || ""}`.trim(),
        patientGender: appointment.patient?.gender || "",
        patientDOB: appointment.patient?.dateOfBirth || null,
        patientMobile: appointment.patient?.mobile || "",
        patientEmail: appointment.patient?.email || "",
        patientAddress: appointment.patient?.presentAddress || "",
        preferredDate: appointment.preferredDate ? new Date(appointment.preferredDate) : null,
        preferredTime: appointment.preferredTime || null,

        // ✅ Flattened medical history values
        bpvalue: mh.bpvalue || dd.bpvalue || null,
        weight: mh.weight || dd.weight || null,
        pulseRate: mh.pulseRate || dd.pulseRate || null,
        allergies: mh.allergies ?? dd.allergies ?? null,

        // ✅ Keep full relations too
        medicalHistory: appointment.patient?.medicalhistory || [],
        healthCards: appointment.patient?.healthcard || [],
      }
    })

    // 🔹 Fetch templates for doctor
    const templates = await db.prescriptionTemplate.findMany({
      where: { doctorId: doctor.id },
      orderBy: { createdAt: "desc" },
    })

    const doctorProducts = await db.product.findMany({
      where: { 
        doctorId: doctor.id
      },
      include: {
        pharmacy: {
          select: {
            regname: true,
            email: true,
          },
        },
      },
      orderBy: { name: "asc" }
    })

    return (
      <div className="container mx-auto p-4">
        <DoctorAppointments
          appointments={formattedAppointments}
          doctor={doctor}
          templates={templates}
          doctorProducts={doctorProducts}
        />
      </div>
    )
  } catch (error) {
    console.error("Error loading doctor appointments:", error)
    return <div className="text-center p-6">Error loading appointments</div>
  }
}

export default DoctorAppointmentsPage
