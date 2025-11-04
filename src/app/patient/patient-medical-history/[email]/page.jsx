import React from 'react'
import PatientMedicalHistorylogin from '../components/login'
import SiteNavBar from '@/app/(site)/components/sitenav'

const ScannedEmailPage = async ({params}) => {
const { email } = params;
console.log("Scanned Email:", email);

  return (
    <>
    {" "}
    <div className="mt-40">
      <div className="">
        <SiteNavBar />
      </div>
      <PatientMedicalHistorylogin emaildata={email}/>
    </div>
  </>
  )
}

export default ScannedEmailPage