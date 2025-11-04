import SiteNavBar from '@/app/(site)/components/sitenav'
import React from 'react'
import CarehelperLogin from '../components/loginclient'
import Mobilenav from '@/app/components/mobilenav'
import { getSession } from "@/lib/getsession";


const DoctorLoginPage = async () => {
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
<><div className=''><SiteNavBar/><Mobilenav data={userData}/></div>
<div className='pt-[100px] md:pt-[130px]'><CarehelperLogin/></div>
</>
  )
}

export default DoctorLoginPage