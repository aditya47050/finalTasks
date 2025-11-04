import React from "react";
import { db } from "@/lib/db";
import HospitalSingleView from "../components/hospitalsingleview";

const HospitalPage = async ({ params }) => {
  const { hospitalid: id, role } = await params;
  const data = await db.Hospital.findFirst({
    where: { id },
    include: {
      hspInfo: { include: { hspcategory: { include: { hspcategory: true } } } },
      hspdetails: true,
      hspcontact: true,
      HospitalCertificate:true,
      hspbranches: true,
      Bed: {
        include: {
          category: true, // Ensure category is included
        },
      },
      staff: true,
      HospitalDepartment: true,
      HospitalSpeciality: {
        include: {
          speciality: true, // Ensure speciality is included
        },
      },
      HospitalDoctor: { include: { doctor: true } },
      HospitalAmbulance: {
        include: {
          ambulance: { include: { AmbulanceVaichicle: true } }, // Ensure ambulance is included
        },
      },
      BedCategory: true,
      BedBooking: true,
      diagnosticServices: {
        include: {
          BookDiagnosticService: true, // if you need booked records as well
        },
      },
      Surgeytreatment: {
        include: {
          BookSurgeryTreatment: true, // if you need booked records too
        },
      },
    },
  });

  return (
    <div className="">
      <HospitalSingleView hospitalData={data} role={role} />
    </div>
  );
};

export default HospitalPage;