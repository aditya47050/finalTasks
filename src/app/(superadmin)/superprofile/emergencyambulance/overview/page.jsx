import React from 'react'
import { db } from '@/lib/db'
import EmergencyAmbulanceClientGraph from './client';



const EmergencyambulancepageGraph = async  () => {

  const Emergencydata = await db.EmergencyAmbulance.findMany({
    include : {patient : true}
  });
  

  return (
    <div><EmergencyAmbulanceClientGraph userdata={Emergencydata}/></div>
  )
}

export default EmergencyambulancepageGraph