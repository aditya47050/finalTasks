import React, { Suspense } from 'react';

import HospitalRegisterClient from '../components/hospitalregister';
import Mobilenav from '@/app/components/mobilenav';
import MainSidebar from '@/app/components/sidebar';
import { db } from '@/lib/db';
import { getSession } from '@/lib/getsession';
import NavBar from '@/app/components/nav';

const HospitalRegisterPage = async () => {
  const loggedemail = await getSession();
  const hspcategory = await db.HospitalsCategory.findMany({});
  const doctortype = await db.ExpertDoctorsCategory.findMany({});

  const registerComponent = (
    <Suspense fallback={<div>Loading registration form...</div>}>
      <HospitalRegisterClient />
    </Suspense>
  );

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
        <div className="pt-[160px] xs:pt-[120px] md:pt-[160px] xlg:pl-12 lg:ml-12 xl:ml-0">
          {registerComponent}
        </div>
      </>
    );
  }

  const hospitalData = await db.Hospital.findUnique({
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

  const userData = hospitalData || doctorData || patientData || corporateData || null;

  return (
    <>
      <div className="">
        <NavBar hspcategory={hspcategory} doctorcategory={doctortype} userData={userData} />
        <Mobilenav data={userData} />
      </div>
      <div className="hidden lg:block">
        <MainSidebar />
      </div>
      <div className="pt-[100px] xs:pt-[120px] md:pt-[100px] xlg:pl-12 lg:ml-12 xl:ml-0">
        {registerComponent}
      </div>
    </>
  );
};

export default HospitalRegisterPage;
