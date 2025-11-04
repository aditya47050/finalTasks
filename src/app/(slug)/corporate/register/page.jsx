export const dynamic = "force-dynamic"
import SiteNavBar from '@/app/(site)/components/sitenav'
import React from 'react'
import CorporateRegisterClient from '../components/corporateregister'
import Mobilenav from '@/app/components/mobilenav'
import { db } from '@/lib/db';
import MainSidebar from '@/app/components/sidebar'
import NavBar from '@/app/components/nav';
import { getSession } from "@/lib/getsession";

const DoctorRegisterPage = async() => {
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
{/* <div className=''><SiteNavBar/><Mobilenav/></div>
<div><MainSidebar/></div> */}
 <div className="">
        <NavBar hspcategory={hspcategory} doctorcategory={doctortype} userData={userData} />

          <Mobilenav data={userData} />
        </div>
        <div className="hidden lg:block">
          <MainSidebar />
        </div>
<div className='xs:pt-[120px] md:pt-[160px] lg:ml-12'><CorporateRegisterClient/></div>
</>
  )
}

export default DoctorRegisterPage