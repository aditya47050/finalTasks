import React from 'react'
import Bookfreeappointment from '../../components/bookfreeappointment'
import { db } from '@/lib/db'
import Emergencyambulanceclient from '../../components/emergambulance';



const Emergencyambulancepage = async  () => {

  const Emergencydata = await db.EmergencyAmbulance.findMany({
include : {patient : true}
  });
  

  return (
    <div><Emergencyambulanceclient userdata={Emergencydata}/></div>
  )
}

export default Emergencyambulancepage