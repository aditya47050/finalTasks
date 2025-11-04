import { db } from '@/lib/db'
import React from 'react'
import ContactUsEnqdata from '../components/contactus-enq'

const ContactUsenq = async() => {

const data = await db.ContactUs.findMany({})

  return (
    <ContactUsEnqdata enquiries={data}/>
  )
}

export default ContactUsenq