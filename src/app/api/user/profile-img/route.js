import { NextResponse } from "next/server";
import { getSession } from "@/lib/getsession";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getSession();

  if (!session?.email) {
    return NextResponse.json({ passportPhoto: null });
  }

  const email = session.email;

  const [patientData, doctorData, hospitalData, corporateData, receptionistData] = await Promise.all([
    db.Patient.findUnique({
      where: { email },
      select: { passportPhoto: true },
    }),
    db.Doctor.findUnique({
      where: { email },
      select: {
        doctorinfo: { select: { passportphoto: true } },
      },
    }),
    db.Hospital.findUnique({
      where: { email },
      select: {
        hspdetails: { select: { hsplogo: true } },
      },
    }),
    db.Corporate.findUnique({
      where: { email },
      select: { passportPhoto: true },
    }),
    // Add receptionist data fetch
    db.Receptionist.findUnique({
      where: { email },
      select: { 
        name: true,
        // Receptionists don't have passport photo, but we can return their name
      },
    }),
  ]);

  const passportPhoto =
    patientData?.passportPhoto ||
    doctorData?.doctorinfo?.passportphoto ||
    hospitalData?.hspdetails?.hsplogo ||
    corporateData?.passportPhoto ||
    null;

  // If it's a receptionist, return their name instead of null
  const userData = receptionistData || patientData || doctorData || hospitalData || corporateData;

  return NextResponse.json({ 
    passportPhoto,
    userData: userData ? { name: userData.name, role: userData.role || 'receptionist' } : null
  });
}