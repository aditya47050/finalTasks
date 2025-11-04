import React from "react";
import Mobilenav from "@/app/components/mobilenav";
import { db } from "@/lib/db";
import { getSession } from "@/lib/getsession";
import NavBar from "@/app/components/nav";
import MainSidebar from "@/app/components/sidebar";
import PharmacyRegister from "../components/register";

const PharmacyRegisterPage = async () => {
  // Fetch logged-in user's session
  const loggedemail = await getSession();

  const hspcategory = await db.HospitalsCategory.findMany({});
  const doctortype = await db.ExpertDoctorsCategory.findMany({});

  // If session data is null
  if (!loggedemail) {
    return (
      <>
        <div className="">
          <NavBar hspcategory={hspcategory} doctorcategory={doctortype} userData={null}  />
          <Mobilenav data={null} />
        </div>
        <div className="hidden lg:block">
          <MainSidebar />
        </div>
       <div className="pt-[160px] xs:pt-[120px] md:pt-[160px] xlg:pl-12 lg:ml-12 xl:ml-0">
          <PharmacyRegister />
        </div>
      </>
    );
  }

  // Fetch user-specific data
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
  const pharmacyData = await db.Pharmacy.findUnique({
    where: { email: loggedemail.email },
  });

  const userData =
    patientData ||
    doctorData ||
    hospitalData ||
    corporateData ||
    pharmacyData ||
    null;

  return (
    <>
      <div className="">
        <NavBar hspcategory={hspcategory} doctorcategory={doctortype} />
        <Mobilenav data={userData} />
      </div>
      <div className="hidden lg:block">
        <MainSidebar />
      </div>
     <div className="pt-[100px] xs:pt-[120px] md:pt-[100px] xlg:pl-12 lg:ml-12 xl:ml-0">
        <PharmacyRegister />
      </div>
    </>
  );
};

export default PharmacyRegisterPage;
