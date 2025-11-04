import React from 'react'
import SingleSurgeryDetails from './component/SingleSurgeryDetails'

const SurgeryDetailspage = () => {
    const surgeryname={
        title:'Surgery Name',
        id:"8765465"
      }
  return (
    <div>
      <SingleSurgeryDetails surgeryname={surgeryname}/>
    </div>
  )
}

export default SurgeryDetailspage
