import React from "react";
import { db } from "@/lib/db";
import { getSession } from "@/lib/getsession";
import HospitalSpecialtiesList from "../components/doctor-specialitytable";

const Page = async () => {
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
    console.error("Hospital not found for email:", session.email);
    return <div>Error: Hospital not found</div>;
  }

  // Get hospital specialties with assigned doctors
  const specialties = await db.hospitalSpeciality.findMany({
    where: { hospitalId: hospital.id },
    include: { 
      speciality: true,
      hospitalDoctors: {
        where: { status: "APPROVED" },
        include: {
          doctor: {
            include: {
              specialities: {
                include: { speciality: true }
              },
              doctorinfo: true,
            }
          }
        }
      }
    },
  });

  // Get all approved doctors for this hospital
  const hospitalDoctors = await db.HospitalDoctor.findMany({
    where: {
      hospitalId: hospital.id,
      status: "APPROVED",
    },
    include: {
      doctor: {
        include: {
          specialities: {
            include: { speciality: true },
          },
          doctorinfo: true,
        },
      },
    },
  });

    // Get all available specialties from ExpertDoctorsCategory
    const allExpertSpecialties = await db.ExpertDoctorsCategory.findMany({});

    // Filter out specialties that are already added to this hospital
    const addedSpecialtyIds = specialties.map(s => s.specialityId);
    const allSpecialties = allExpertSpecialties.filter(
      specialty => !addedSpecialtyIds.includes(specialty.id)
    );


  // Transform specialties data to include assigned doctors and counts
  const specialtiesWithDoctors = specialties.map(specialty => {
    const assignedDoctors = specialty.hospitalDoctors.map(hd => hd.doctor);
    
    return {
      ...specialty,
      assignedDoctors,
      doctorCount: assignedDoctors.length
    };
  });

  // Get ALL doctors that are approved for this hospital
  const allDoctors = await db.Doctor.findMany({
    where: {
      id: {
        in: hospitalDoctors.map(hd => hd.doctorId)
      }
    },
    include: {
      specialities: {
        include: { speciality: true }
      },
      doctorinfo: true,
    },
  });


  return (
    <div>
      <HospitalSpecialtiesList
        hospitalId={hospital.id}
        specialties={specialtiesWithDoctors}
        alldoctors={allDoctors}
        allSpecialties={allSpecialties}
        expertsdoctors={hospitalDoctors}
      />
    </div>
  );
};

export default Page;