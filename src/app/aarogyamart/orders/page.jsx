import React from 'react'
import AllOrdersMainPage from './../components/AllOrderPage';
import { Footer } from '../components/footer';
import { getSession } from '@/lib/getsession';
import { db } from '@/lib/db';

const OrdersPage = async () => {
  const session = await getSession();
    let loggeduserId = null;
  let role = null;
  if(session){
    const isId = session.id ? session.id : session.email;
    if (isId === session.id) {
      const patientData = await db.Patient.findUnique({
        where: { id: isId },
      });
  
      const doctorData = await db.Doctor.findUnique({
        where: { id: isId },
      });
      if (patientData || doctorData ) {
        loggeduserId = patientData ? patientData.id : doctorData.id;
        role = patientData ? patientData.role : doctorData.role;
      }
    }
    else{
      const hospitalData = await db.Hospital.findUnique({
        where: { email: isId },
      });
      if (hospitalData) {
        loggeduserId = hospitalData.id;
        role = hospitalData.role;
      }
    }
  }
  return (
    <div>
      <AllOrdersMainPage id={loggeduserId}/>
      <Footer/>
    </div>
  )
}

export default OrdersPage