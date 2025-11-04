import React from "react";
import Mobilenav from "@/app/components/mobilenav";
import NavBar from "@/app/components/nav";
import MainSidebar from "@/app/components/sidebar";
import { db } from "@/lib/db";
import { getSession } from "@/lib/getsession";
import EsevaLoginClient from "../components/e-sevalogin";

const EsevaLoginPage = async () => {
  // Fetch logged-in user's session (using getSession())
  const loggedemail = await getSession();
  const hspcategory = await db.HospitalsCategory.findMany({});
  const doctortype = await db.ExpertDoctorsCategory.findMany({});
  // If session data is null, return null or handle it appropriately
  if (!loggedemail) {
    return (
      <>
        <div className="">
          <NavBar hspcategory={hspcategory} doctorcategory={doctortype} />
          <Mobilenav data={null} />
        </div>
        <div className="hidden lg:block">
          <MainSidebar />
        </div>
        <div className="pt-[100px] xs:pt-[120px] md:pt-[160px]  xlg:pl-12 lg:ml-12 xl:ml-0">
          <EsevaLoginClient />
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
        <NavBar hspcategory={hspcategory} doctorcategory={doctortype} userData={userData}  />
        <Mobilenav data={userData} />
      </div>
      <div className="hidden lg:block">
        <MainSidebar />
      </div>
      <div className="pt-[100px] md:pt-[160px] xlg:pl-12 lg:ml-12 xl:ml-0">
        <EsevaLoginClient />
      </div>
    </>
  );
};

export default EsevaLoginPage;
