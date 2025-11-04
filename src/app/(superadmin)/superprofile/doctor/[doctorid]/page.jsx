import React from "react";
import { db } from "@/lib/db";
import DoctorSingleView from "../components/doctorsingleview";

const PatientSingleViewPage = async ({ params }) => {
  const userdata = await db.Doctor.findFirst({
    where: {
      id: params.doctorid,
    },
    include: {
      doctorinfo: true,
      DoctorCertificate: true,
      specialities: {
        include: {
          speciality: true,
          // Fetch associated specialty details
        },
      },
    },
  });

  const specialitytype = await db.ExpertDoctorsCategory.findMany({});

  return (
    <>
      <DoctorSingleView userdata={userdata} />
    </>
  );
};

export default PatientSingleViewPage;
