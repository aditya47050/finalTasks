import React from 'react';
import TeleRadiologyPageNav from '@/app/(diffrentslugs)/teleradiology/components/nav';
import Mobilenav from '@/app/components/mobilenav';
import TeleRadiologyRegisterClient from '../components/register';
import { db } from '@/lib/db';
import { getSession } from '@/lib/getsession';

const TeleRadiologyRegister = async () => {
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
        <div className="pt-[90px] pb-28">
          <TeleRadiologyRegisterClient />
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
      <div className="pt-[90px]">
        <TeleRadiologyRegisterClient />
      </div>
    </>
  );
};

export default TeleRadiologyRegister;
