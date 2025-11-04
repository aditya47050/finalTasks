import SiteNavBar from '@/app/(site)/components/sitenav'
import React from 'react'
import CorporateLoginClient from '../components/corporatelogin'
import Mobilenav from '@/app/components/mobilenav'
import MainSidebar from '@/app/components/sidebar'
import NavBar from '@/app/components/nav';
import { db } from '@/lib/db';
import { getSession } from "@/lib/getsession";


const DoctorLoginPage = async() => {
   const hspcategory = await db.HospitalsCategory.findMany({});
    const doctortype = await db.ExpertDoctorsCategory.findMany({});
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

    const passportPhoto =
      patientData?.passportPhoto ||
      doctorData?.doctorinfo?.passportphoto ||
      hospitalData?.hspdetails?.hsplogo ||
      corporateData?.passportPhoto ||
      null;

       userData = {
      passportPhoto,
    };
  }
  return (
<>
{/* <div className='lg:ml-12'><SiteNavBar/><Mobilenav/> </div>
<div className=''><MainSidebar/></div> */}
 <div className="">
          <NavBar hspcategory={hspcategory} doctorcategory={doctortype} userData={userData} />
          <Mobilenav  data={userData} />
        </div>
        <div className="hidden lg:block">
          <MainSidebar />
        </div>
<div className='xs:pt-[120px] lg:pt-[160px] lg:pl-[48px] md:pt-[130px]'><CorporateLoginClient/></div>
</>
  )
}

export default DoctorLoginPage