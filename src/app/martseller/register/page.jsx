import React from 'react'
import MartSellerRegisterStepwise from '../components/MartRegister'
import { MartsellerHeader } from '../components/martseller-header'

const MartRegister = () => {
  return (
    <div>
      <MartsellerHeader />
      <MartSellerRegisterStepwise/>
    </div>
  )
}

export default MartRegister
