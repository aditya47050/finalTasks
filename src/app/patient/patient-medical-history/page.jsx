import React from "react";
import PatientMedicalHistorylogin from "./components/login";
import SiteNavBar from "@/app/(site)/components/sitenav";
import Mobilenav from "@/app/components/mobilenav";
import { getSession } from "@/lib/getsession";

const PatientMedicalHistoryPage = async ({params}) => {
 const session = await getSession();

  let userData = null;
  if (session?.email) {
    const [patientData, doctorData, hospitalData, corporateData] = await Promise.all([
       db.Patient.findUnique({
        where: { email: session.email },
        select: { passportPhoto: true }, 
      }),
       db.Doctor.findUnique({
        where: { email: session.email },
        select: {
          doctorinfo: {
            select: { passportphoto: true },
          },
        },
      }),
       db.Hospital.findUnique({
        where: { email: session.email },
        select: {
          hspdetails: {
            select: { hsplogo: true },
          },
        },
      }),
      db.Corporate.findUnique({
        where: { email: session.email },
        select: { passportPhoto: true }, 
      }),
    ]);

    const profileImage =
      patientData?.passportPhoto ||
      doctorData?.doctorinfo?.passportphoto ||
      hospitalData?.hspdetails?.hsplogo ||
      corporateData?.passportPhoto ||
      null;

       userData = {
      profileImage,
    };
  }
  return (
    <>
      {" "}
      <div className="mt-40">
        <div className="">
          <SiteNavBar /><Mobilenav data={userData}/>
        </div>
        <PatientMedicalHistorylogin params={params} />
      </div>
    </>
  );
};

export default PatientMedicalHistoryPage;
