import React from 'react'
import AppointmentClient from '../components/appointment'
import { db } from '@/lib/db'
import { getSession } from '@/lib/getsession';
const page =async () => {
   const doctortype = await db.ExpertDoctorsCategory.findMany({})
  const loggedemail = await getSession();
  return (
    <div><AppointmentClient doctorcategory={doctortype}
    data={loggedemail}/></div>
  )
}

export default page