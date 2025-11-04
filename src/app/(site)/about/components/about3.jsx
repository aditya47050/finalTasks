import Image from "next/image";
import React from "react";

const About3 = () => {

  const data = [
    {
      title: "Lack of Information",
      description:
        "This can lead to patients having to visit multiple hospitals for a single ailment due to lack information about facilities available.",
    },
    {
      title: "Uncertainty",
      description:
        "Multiple hospital visits can result in financial loss and health uncertainty due to unclear treatment costs, procedures, bed availability, and other factors.",
    },
    {
      title: "Reliablity",
      description:
        "Most patients rely solely on the recommendations and information provided by their physician to evaluate treatment options",
    },
   
  ];

  return (
    <>
      <div className="">
        {/* soloution */}
        <div className="md:mx-auto md:container px-2 md:px-0 pb-5 lg:mb-4">
          <div className="lg:my-5 mb-3 lg:mb-0">
            <Image
              src="https://res.cloudinary.com/dnckhli5u/image/upload/v1731744165/32_zjj8vk.png"
              width={4000}
              height={844}
              alt=""
              className="lg:w-full hidden lg:block rounded-[15px] lg:h-72"
            />
             <Image
              src="https://res.cloudinary.com/dwsc0vedb/image/upload/v1743956190/Home_Page_eg5iql.png"
              width={4000}
              height={844}
              alt=""
              className="lg:w-full block lg:hidden rounded-[15px] lg:h-72"
            />
          </div>

          <div className=" block lg:hidden mt-2 mb-4">
            <h3 className=" text-[#5271ff] text-center font-extrabold lg:text-[25px] text-[20px] ">Problems</h3>
          <div className="grid md:py-10  font-poppins grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xs:py-4 xs:px-0 md:p-4">
          {data.map((item, index) => (
            <div
              key={index}
              className="relative border border-[#5271ff] rounded-[15px] p-4 lg:p-2"
            >
              {/* First Button */}
              <button className="absolute text-[10px] whitespace-nowrap md:text-[12px]   lg:text-[14px] rounded-[15px] top-[-12px] left-1/2 transform -translate-x-1/2 bg-[#5271ff] text-white px-3 py-2 w-32 md:w-36 items-center">
                {item.title}
              </button>

              {/* Content */}
              <p className="md:mt-8 mt-4 text-[10px] text-[#243460]  md:text-[12px]   lg:text-[14px]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
        <h3 className=" text-[#5271ff] text-center font-extrabold lg:text-[25px] text-[20px]"> How big is the Problems</h3>
        <img src="https://res.cloudinary.com/dwsc0vedb/image/upload/v1743956162/About_Us_Image_thhdjt.png" alt="" className=" rounded-[15px]"/>
        </div>

          <div className="relative w-full flex-wrap md:flex-nowrap flex items-center justify-center lg:mt-4">
            <div className="bg-gradient-to-r block from-[#ffde59] to-[#ff914d] py-2 relative md:mr-[-40px] lg:mr-[-40px]  px-8 lg:text-[19px] text-[12px] rounded-xl font-bold font-poppins mb-2 lg:mb-0">
              Current Solutions
            </div>
            
            <div className="bg-[#4671b8] py-4   md:mt-0 text-center px-2 md:px-14 md:space-y-0 space-y-1 lg:text-[15px] text-[10px] rounded-xl text-white font-poppins">
              Existing healthcare digital solutions are <br />
              <strong>
                unable to provide comprehensive information needs {""}
              </strong>
              based on patient
            </div>
          </div>

          <div className="grid grid-cols-2 mt-6 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-4 justify-center mx-auto md:mx-5 lg:ml-0 lg:mr-5 sm:mt-2 md:mt-8 ">
            {reasons.map((reason, index) => (
              <div
                className="relative flex flex-col pb-4  mb-4 bg-[#93c2ee] bg-opacity-30 p-1 md:p-2 border-[#4671b8] rounded-2xl border"
                key={index}
              >
                <span className="bg-[#4671b8] items-start mt-6 ml-[-6px] md:ml-[-8px] px-2 w-24 py-1  rounded-r-full lg:text-[13px] text-[11px]  font-semibold text-white  font-poppins">
                  Reason {reason.no}
                </span>
                <div className="relative z-10">
                  <p className="text-[#243561] font-poppins text-start max-[1200px]:text-[12px] min-[1200px]:text-[16px] text-[10px] mt-4 pl-2">
                    {reason.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default About3;
const reasons = [
  {
    title: "They do not provide a comprehensive view of the HSP",
    no: "01",
  },
  {
    title: "They are not integrated with other healthcare systems.",
    no: "02",
  },
  {
    title:
      "Govt healthcare scheme & other schemes available but these facilities not integrated with each other",
    no: "03",
  },
  {
    title:
      "No 24/7 365 days free advise Govt, Doctor’s and HSP service platform for everyone",
    no: "04",
  },
];
