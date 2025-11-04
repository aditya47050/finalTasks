import React from 'react'
import Businesspartnershipclient from '../components/business-partnershipclient'
import { getSession } from '@/lib/getsession';
import { redirect } from 'next/navigation';
async function BusinesspartnershipPage ()  {
  const loggedemail = await getSession();
    if(loggedemail?.data?.email === null){
      redirect("/");
    }
    else{
      return (
        <div className=''> 
        
        <Businesspartnershipclient/>
        </div>
      )
    }
}

export default BusinesspartnershipPage