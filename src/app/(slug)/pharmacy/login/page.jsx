import React, { Suspense } from 'react';
import Pharmacylogin from '../components/login';
import SiteNavBar from '@/app/(site)/components/sitenav';
import Mobilenav from '@/app/components/mobilenav';
import NavBar from '@/app/components/nav';
import MainSidebar from '@/app/components/sidebar';
import { db } from '@/lib/db';
import { getSession } from '@/lib/getsession';

const PharmacyLoginPage = async () => {
  // Fetch logged-in user's session
  const loggedemail = await getSession();
    const hspcategory = await db.HospitalsCategory.findMany({});
    const doctortype = await db.ExpertDoctorsCategory.findMany({});


    const loginComponent = (
      <Suspense fallback={<div>Loading login form...</div>}>
        <Pharmacylogin />
      </Suspense>
    );

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
        <div className="pt-[100px] xs:pt-[120px] md:pt-[160px] xlg:pl-12 lg:ml-12 xl:ml-0">
          {loginComponent}
        </div>
      </>
    );
  }

  // Fetch user-specific data for different roles
  const pharmacyData = await db.Pharmacy.findUnique({
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
    const userData = pharmacyData || doctorData || hospitalData || corporateData || null;

  return (
    <>
      <div className="">
        <NavBar hspcategory={hspcategory} doctorcategory={doctortype} />
        <Mobilenav data={userData} />
      </div>
      <div className="hidden lg:block">
        <MainSidebar />
      </div>
      <div className="pt-[100px] xs:pt-[120px] md:pt-[160px] xlg:pl-12 lg:ml-12 xl:ml-0">
        <Pharmacylogin />
      </div>
    </>
  );
};

export default PharmacyLoginPage;
