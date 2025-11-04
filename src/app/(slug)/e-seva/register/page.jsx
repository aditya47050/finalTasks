import React from "react";
import Mobilenav from "@/app/components/mobilenav";
import MainSidebar from "@/app/components/sidebar";
import { db } from "@/lib/db";
import { getSession } from "@/lib/getsession";
import NavBar from "@/app/components/nav";
import ESevaRegisterClient from "../components/e-sevaregister";

const EsevaRegisterPage = async () => {
  // Fetch logged-in user's session
  const loggedemail = await getSession();
  const hspcategory = await db.HospitalsCategory.findMany({});
  const doctortype = await db.ExpertDoctorsCategory.findMany({});
  const [state, dist, subdist] = await Promise.all([
    db.state.findMany({}),
    db.district.findMany({}),
    db.SubDistrict.findMany({}),
   
  ]);

  // If session data is null, pass null to Mobilenav
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
        <div className="pt-[120px] md:pt-[120px] xlg:pl-12 lg:ml-12 xl:ml-0">
        <ESevaRegisterClient  states={state} dist={dist} subdist={subdist}/>

        </div>
      </>
    );
  }

  // Fetch user-specific data if session exists
  const doctorData = await db.Doctor.findUnique({
    where: { email: loggedemail.email },
  });

  const patientData = await db.Patient.findUnique({
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
    doctorData || patientData || hospitalData || corporateData || null;

  return (
    <>
      <div className="">
        <NavBar hspcategory={hspcategory} doctorcategory={doctortype} userData={userData}  />

        <Mobilenav data={userData} />
      </div>
      <div className="hidden lg:block">
        <MainSidebar />
      </div>
      <div className="pt-[100px] md:pt-[100px] xlg:pl-12 lg:ml-12 xl:ml-0">
        <ESevaRegisterClient  states={state} dist={dist} subdist={subdist}/>
      </div>
    </>
  );
};

export default EsevaRegisterPage;
