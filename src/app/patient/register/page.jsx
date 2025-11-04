import React from "react";
import PatientRegister from "../components/patientregister";
import Mobilenav from "@/app/components/mobilenav";
import { db } from "@/lib/db";
import { getSession } from "@/lib/getsession";
import NavBar from "@/app/components/nav";
import MainSidebar from "@/app/components/sidebar";

const PatientRegisterPage = async () => {
  // Fetch logged-in user's session
  const loggedemail = await getSession();
  const hspcategory = await db.HospitalsCategory.findMany({});
  const doctortype = await db.ExpertDoctorsCategory.findMany({});
  // If session data is null, pass null to Mobilenav
  if (!loggedemail) {
    return (
      <>
        <div className="">
          <NavBar hspcategory={hspcategory} doctorcategory={doctortype} userData={null} />

          <Mobilenav data={null} />
        </div>
        <div className="hidden lg:block">
          <MainSidebar />
        </div>
        <div className="lg:pt-[160px] md:pt-[160px] sm:pt-[120px] xs:pt-[120px] xlg:pl-12 lg:ml-12 xl:ml-0">
          <PatientRegister />
        </div>
      </>
    );
  }

  // Fetch user-specific data if session exists
  const patientData = await db.Patient.findUnique({
    where: { email: loggedemail.email },
  });

  const doctorData = await db.Doctor.findUnique({
    where: { email: loggedemail.email },
  });

  const hospitalData = await db.Hospital.findUnique({
    where: { email: loggedemail.email },
  });

  const corporateData = await db.Corporate.findUnique({
    where: { email: loggedemail.email },
  });

  // Determine which data to send to Mobilenav
  const userData =
    patientData || doctorData || hospitalData || corporateData || null;

  return (
    <>
      <div className="">
        <NavBar hspcategory={hspcategory} doctorcategory={doctortype} data={userData}/>
        <Mobilenav data={userData} />
      </div>
      <div className="hidden lg:block">
        <MainSidebar />
      </div>
      <div className="pt-[90px]">
        <PatientRegister />
      </div>
    </>
  );
};

export default PatientRegisterPage;
