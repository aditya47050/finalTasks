import React from 'react'
import { db } from '@/lib/db'
import HealthCardClientdata from './client';




const ApplyhealthcardPage = async  () => {
  const healthcardapplicationsdata = await db.HealthCard.findMany({
    include: {
      patient: true, // This will include the patient details
    },
  });
  
  

  return (
    <div><HealthCardClientdata userdata={healthcardapplicationsdata}/></div>
  )
}

export default ApplyhealthcardPage