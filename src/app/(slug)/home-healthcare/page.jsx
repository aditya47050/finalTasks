import React from 'react'
import HomeHealthcare from './component/HomeHealthcare'

const HomeHealthcareMainpage = () => {
 const specilitytype={
        title:"Home Healthcare",
        id:"35467"
    }
  return (
    <div className=''>
      <HomeHealthcare specilitytype={specilitytype}/>
    </div>
  )
}

export default HomeHealthcareMainpage
