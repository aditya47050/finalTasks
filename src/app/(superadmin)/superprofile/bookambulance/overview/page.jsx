import React from 'react'
import { db } from '@/lib/db'
import BookAmbulanceClient from './client';



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