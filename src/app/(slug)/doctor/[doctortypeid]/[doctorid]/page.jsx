import React from "react";
import Doctorsingleview from "./components/doctorsingleview";
import { db } from "@/lib/db";
import { getSession } from "@/lib/getsession";
import AccessErrorDisplay from "@/app/components/accesserror";

const DoctorSingleView = async ({ params }) => {
  const { doctorid } = await params;  
  const { doctortypeid } = await params;

   const session = await getSession();

  if (!session || !session.email) {
    return <AccessErrorDisplay />;
  }

const patient = await db.patient.findFirst({
  where: { email: session.email },
  select: { 
    id: true,
    firstName: true,
    lastName: true,
    mobile: true,
    email: true,
    city: true,
    pincode: true,
    gender: true,
    dateOfBirth: true
  },
});

  if (!patient) {
    return <AccessErrorDisplay />;
  }
  

  // Fetch all specialties
  const specialitytype = await db.ExpertDoctorsCategory.findMany({});

  // Fetch doctor data along with specialties
  const doctordata = await db.Doctor.findFirst({
    where: { id: doctorid },
    include: {
      doctorinfo: true,
      DoctorReview: {     // ✅ correct field
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true,
          },
        },
      },
    },
      specialities: {
        include: {
          speciality: true, // Fetch associated specialty details
        },
      },
      doctorvisitinghospitals :true,
      
    },
  });

    if (!doctordata) {
    return <AccessErrorDisplay />;
  }

  // Extract the selected specialties for this doctor
  const selectedSpecialityTitles = doctordata?.specialities.map(
    (speciality) => speciality.speciality.title
  );

  const doctordataWithReviews = {
  ...doctordata,
  reviews: doctordata.DoctorReview || [],
};

  return (
    <>
      <Doctorsingleview
        doctordata={doctordataWithReviews}
        specialitytype={specialitytype}
        selectedSpecialityTitles={selectedSpecialityTitles} 
        patient={patient}
      />
    </>
  );
};

export default DoctorSingleView;
