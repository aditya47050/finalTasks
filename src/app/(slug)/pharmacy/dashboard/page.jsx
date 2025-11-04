import React from 'react'
import Dashboardclient from '../components/dashboardclient'
import { getSession } from '@/lib/getsession'
import { db } from '@/lib/db'

const page = async () => { 
  const session = await getSession()
  if (!session) {
    return (
      <div className='flex flex-col items-center justify-center h-screen'>
        <h1 className='text-2xl font-bold'>Please login to access this page</h1>
      </div>
    )
  } 


  return (
    <><Dashboardclient /></>
  )
}

export default page