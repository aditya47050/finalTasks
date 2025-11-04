import React from "react";
import SiteNavBar from "@/app/(site)/components/sitenav";
import Mobilenav from "@/app/components/mobilenav";
import TeleRadiologyLoginClient from "../components/login";
import TeleRadiologyPageNav from "@/app/(diffrentslugs)/teleradiology/components/nav";
import { db } from "@/lib/db";
import { getSession } from "@/lib/getsession";

const TeleRadiologyLogin = async () => {
  // Fetch logged-in user's session
  const loggedemail = await getSession();

  // If session data is null, pass null to Mobilenav
  if (!loggedemail) {
    return (
      <>
        <div className="">
          <TeleRadiologyPageNav />
          <Mobilenav data={null} />
        </div>
        <div className="pt-[100px] md:pt-[130px] pb-28">
          <TeleRadiologyLoginClient />
        </div>
      </>
    );
  }

  // Fetch user-specific data if session exists
  const teleradiologyData = await db.Teleradiology.findUnique({
    where: { email: loggedemail.email },
  });

  const doctorData = await db.Doctor.findUnique({
    where: { email: loggedemail.email },
  });

  const patientData = await db.Patient.findUnique({
    where: { email: loggedemail.email },
  });

  const corporateData = await db.Corporate.findUnique({
    where: { email: loggedemail.email },
  });

  // Determine which data to send to Mobilenav
  const userData = teleradiologyData || doctorData || patientData || corporateData || null;

  return (
    <>
      <div className="">
        <TeleRadiologyPageNav />
        <Mobilenav data={userData} />
      </div>
      <div className="pt-[100px] md:pt-[130px]">
        <TeleRadiologyLoginClient />
      </div>
    </>
  );
};

export default TeleRadiologyLogin;
