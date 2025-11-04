import React from 'react'
import TREnqForm from '../components/trenquiryform'
import { getSession } from '@/lib/getsession';
import { redirect } from 'next/navigation';
async function TRJoinWithUSPage  ()  {
  const loggedemail = await getSession();
    if(loggedemail?.data?.email === null){
      redirect("/teleradiology");
    }
    else{
      return (
      <><div className='mx-auto md:px-4 md:container'> <TREnqForm/> </div></>
      )
    }
}

export default TRJoinWithUSPage