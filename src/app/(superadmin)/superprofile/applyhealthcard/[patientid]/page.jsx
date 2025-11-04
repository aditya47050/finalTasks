import React from 'react'
import { db } from '@/lib/db'
import UserProfile from './components/patientdetailsclient'

const PatientSingleViewPage = async ({ params }) => {
  try {
    // Fetch patient data from the database based on the patientid parameter
    const userData = await db.Patient.findFirst({
      where: {
        id: params.patientid,
      },
      include: { healthcard: true }, // Ensures healthcard data is included with patient info
    })

    // If no data is found for the given patientid, return a "not found" message or similar handling
    if (!userData) {
      return <div>Patient not found.</div>
    }



    return (
      <>
        {/* Pass the fetched user data to the UserProfile component */}
        <UserProfile userdata={userData} />
      </>
    )
  } catch (error) {
    // Error handling in case of database errors
    console.error("Error fetching patient data:", error);
    return <div>There was an error fetching the data.</div>
  }
}

export default PatientSingleViewPage
