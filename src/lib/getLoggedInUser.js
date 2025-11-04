import { db } from "@/lib/db";
import { getSession } from "@/lib/getsession";

export async function getLoggedInUser() {
  const session = await getSession();

  if (!session || !session.email) {
    throw new Error("Unauthorized: No session found");
  }

  const email = session.email;

  // Patient
  const patient = await db.patient.findUnique({ where: { email } });
  if (patient) {
    return { bookedByType: "PATIENT", id: patient.id, hospitalId: null, hspRole: null };
  }

  // Receptionist
  const receptionist = await db.receptionist.findUnique({
    where: { email },
    include: { hospital: { select: { id: true, role: true } } }, 
  });

  if (receptionist) {
    return {
      bookedByType: "RECEPTIONIST",
      id: receptionist.id,
      hospitalId: receptionist.hospitalId,
      hspRole: receptionist.hospital?.role ?? null,
    };
  }

  // Hospital
  const hospital = await db.hospital.findUnique({
    where: { email },
    select: { id: true, role: true },
  });
  if (hospital) {
    return {
      bookedByType: "HOSPITAL",
      id: hospital.id,
      hospitalId: hospital.id,
      hspRole: hospital.role,
    };
  }

  throw new Error("No matching user found");
}
