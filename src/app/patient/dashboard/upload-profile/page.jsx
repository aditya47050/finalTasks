import React from 'react'
import ProfileUploadPage from '../components/profile-upload'
import { getSession } from '@/lib/getsession';
import { db } from '@/lib/db';
import Home from '../components/customprofilepload';
import { redirect } from 'next/navigation';

const page =async () => {
      const patientUser = await getSession();
    
      if (!patientUser) {
        redirect("/patient/login");
      }
      const userdata = await db.Patient.findFirst({
        where: {
          email: patientUser.email,
        },
      });
    
      // Ensure userdata exists before accessing its properties
      if (!userdata) {
        redirect("/patient/login");
      }
      const state = await db.state.findMany({});
      const dist = await db.district.findMany({});
      const subdist = await db.SubDistrict.findMany({}); 
        const data = await db.HealthCard.findFirst({
          where: { patientId: userdata.id },
        
        });
  return (
<>




<ProfileUploadPage        userdata={userdata} />

</>
  )
}

export default page