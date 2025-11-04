import React from "react";
import { db } from "@/lib/db";
import { getSession } from "@/lib/getsession";
import HospitalSpecialtiesList from "../components/doctor-specialitytable";
import HospitalDoctorForm from "../components/add-inhouse-doctors";
import HospitalDoctorsList from "../components/all-inhouse-doctors";

const Doctorspage = async () => {
  const session = await getSession();

  if (!session || !session.email) {
    console.error("Session or email is undefined.");
    return <div>Error: Unauthorized</div>;
  }
  const hospital = await db.Hospital.findFirst({
    where: { email: session.email },
    select: { id: true },
  });

  if (!hospital) {
    return <div>Hospital not found</div>;
  }

  // Fetch specialties associated with the hospital
  const specialties = await db.HospitalSpeciality.findMany({
    where: { hospitalId: hospital.id },
    include: {
      speciality: true, // Include specialty details
    },
  });

  // Fetch all doctors
  const doctors = await db.Doctor.findMany({
    include: {
      specialities: {
        include: {
          speciality: true, // Get the actual specialty details
        },
      },
      doctorinfo: true,
      DoctorCertificate: true,
    },
  });

  // Fetch doctors assigned to this hospital
  const hospitalDoctors = await db.HospitalDoctor.findMany({
    where: { hospitalId: hospital.id },
    include: {
      doctor: {
        include: {
          specialities: {
            include: { speciality: true },
          },
          doctorinfo: true,
          DoctorCertificate: true,
        },
      },
    },
  });

  return (
    <div className="md:container">
      <HospitalDoctorsList
        hospitalId={hospital.id}
        hospitalDoctors={hospitalDoctors}
        specialties={specialties}
        doctors={doctors}
      />
    </div>
  );
};

export default Doctorspage;
