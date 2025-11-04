import React from 'react'
import CoreFeaturesClient from './client'
import { getSession } from '@/lib/getsession';

async function page  () {
  const loggedemail = await getSession();
  return (
    <div>
      <CoreFeaturesClient
        data={loggedemail}  
      />
    </div>
  )
}

export default page