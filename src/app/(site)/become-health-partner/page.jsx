import React from 'react'
import BecomeHealthPartnerClient from '../components/become-health-partner'
import { getSession } from '@/lib/getsession';
import { redirect } from 'next/navigation';
async function BecomeAHealthPartner  ()  {
  const loggedemail = await getSession();
  if(loggedemail?.data?.email === null){
    redirect("/");
  }
  else{
    return (
      <div className=''> 
        <BecomeHealthPartnerClient/>
      </div>
    )
  }
}

export default BecomeAHealthPartner