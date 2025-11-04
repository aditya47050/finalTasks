import React from 'react'
import Bookfreeappointment from '../../components/bookfreeappointment'
import { db } from '@/lib/db'
import Emergencyambulanceclient from '../../components/emergambulance';
import BookAmbulanceClient from '../../components/bookambulance';



const BookAmbulancePage = async  () => {
  const bookAmbulances = await db.BookAmbulance.findMany({
    include: {
      patient: true, // This will include the patient details
    },
  });
  
  

  return (
    <div><BookAmbulanceClient userdata={bookAmbulances}/></div>
  )
}

export default BookAmbulancePage