import React from 'react'
import { Footer } from './../components/footer';
import AccountDetails from '../components/AccountDetails';
import { getSession } from '@/lib/getsession';
import { db } from '@/lib/db';

const page = async () => {
  const session = await getSession();
      let userData = null;
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
          if (patientData || doctorData || hospitalData) {
            userData = patientData !== null ? patientData : doctorData;
            role = patientData !== null ? patientData.role : doctorData.role;
          }
        }
        else{
          const hospitalData = await db.Hospital.findUnique({
            where: { email: isId },
          });
          if (hospitalData) {
            userData = hospitalData;
            role = hospitalData.role;
          }
        }
      }
      let orders = [];
       if (userData) {
    orders = await db.Order.findMany({
      where: { userId: userData.id },
      orderBy: { orderDate: 'desc' },
      include: {
        address: true,
        items: true,
        timeline: true,
      },
    });
  }
  return (
    <div>
      <AccountDetails userData={userData} orders={orders}/>
      <Footer/>
    </div>
  )
}

export default page
