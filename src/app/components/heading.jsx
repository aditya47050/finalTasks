import React from 'react'

const HeadingClientMain = ({main ,sub}) => {
  return (
    <div className="text-center font-poppins pt-4 ">
    <h1 className="text-xl md:text-[25px] text-[#5271FF] font-extrabold">
      <span className="">{main}</span>
    </h1>
    <p className="text-[#5271FF] xs:text-[15px] md:text-[20px] text-[15px] ">
   {sub}
    </p>
  </div>
  )
}

export default HeadingClientMain