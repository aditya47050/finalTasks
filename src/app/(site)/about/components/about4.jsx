import Image from "next/image";
import React from "react";

const About4 = () => {
  return (
    <>
      <div>
        {/* Comparison to Current Solutions */}
        <div className="md:mx-auto md:container  px-2 md:px-0 mb-5">
          <div className=" justify-center text-center  ">
            <h1 className="lg:text-[25px] text-[20px] md:mb-0 mb-4 font-poppins text-[#5271ff] font-extrabold ">
              <span className="shadow-inherit ">
                Comparison to Current Solutions
              </span>
            </h1>
          </div>

          <div className="hidden lg:block  mx-auto lg:ml-1 lg:mr-5 lg:px-0">
            <div className="relative mt-4 mb-4 text-justify justify-center items-center  font-sans text-[16px] pt-2  font-semibold text-[#243460] border-2 border-[#6271ff] rounded-xl">
              <div className="w-full flex  p-4">
                <div className="w-full  lg:w-1/3 ">
                  <div className="border-dotted border-b md:border-r lg:h- pr-6 xl:h-44 border-[#5271ff] p-3">
                    <h1 className="font-bold text-[#002e6e] text-start lg:text-lg text-[14px] ">
                      A comprehensive database <br className="hidden md:block" /> of healthcare providers
                    </h1>
                    <p className="lg:text-[16px] text-[10px]">
                      Aarogya Aadhar has a comprehensive database of healthcare
                      providers across India. This means that patients can
                      easily find the right hospital or healthcare provider for
                      their needs.
                    </p>
                  </div>
                  <div className="border-dotted md:border-r border-b pr-6 md:border-b-0 lg:h-36 border-[#5271ff] p-3 ">
                    <h1 className="font-bold text-[#002e6e] lg:text-lg text-[14px]">
                      Easy to use
                    </h1>
                    <p className="lg:text-[16px] text-[10px]">
                      Aarogya Aadhar is easy to use. Patients can easily find
                      the information they need and compare different hospitals
                      or healthcare providers.
                    </p>
                  </div>
                </div>

                <div className="w-full sm:w-1/2 lg:w-1/3 ">
                  <div className="border-dotted lg:h-60 lg:mt-2 xl:mt-0 xl:h-44 pl-6 border-[#5271ff] p-3">
                    <h1 className="font-bold text-[#002e6e] lg:text-lg text-[14px]">
                      Real-time <br className="hidden md:block" /> information
                    </h1>
                    <p className="lg:text-[16px] text-[10px]">
                      Aarogya Aadhar provides real-time information about
                      healthcare providers. This means that patients can be sure
                      that the information they are getting is up-to-date.
                    </p>
                  </div>
                  <div className="border-dotted border-t pl-6   lg:h-36 border-[#5271ff] p-3 ">
                    <h1 className="font-bold text-[#002e6e] lg:text-lg text-[14px]">
                      Free to use
                    </h1>
                    <p className="lg:text-[16px] text-[10px]">
                      Aarogya Aadhar is free to use. This means that patients
                      can access the app without having to pay any fees.
                    </p>
                  </div>
                </div>

                <div className="lg:block hidden lg:w-1/3 "> <div className="w-full flex items-center  justify-center ">
                  <Image
                    src="https://res.cloudinary.com/dnckhli5u/image/upload/v1725257001/aarogya%20aadhar/SiteImages/vg0chxz4vrttiq8l9vmt.png"
                    width={1200}
                    height={400}
                    alt=""
                    className="lg:w-[80%] lg:h-80 lg:ml-6 h-64 w-64 border-[#5271ff]"
                  />
                </div></div>
              </div>
            </div>

            <div className=" justify-center text-center md:pt-4 pt-4  ">
              <h1 className="lg:text-[25px] text-[20px] text-[#5271ff] font-poppins font-extrabold ">
                <span className="shadow-inheri ">
                  Additional Benefits of Aarogya Aadhar
                </span>
              </h1>
            </div>
            <div className="grid grid-cols-1 mt-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-4 justify-center mx-auto sm:mt-2 md:mt-4 px-4">
              {reasons.map((reason, index) => (
                <div
                  className="relative flex flex-col pb-4  mb-4 bg-[#93c2ee] bg-opacity-30 md:p-2 p-1 border-[#4671b8] rounded-2xl border"
                  key={index}
                >
                  <span className="bg-[#4671b8] items-start mt-6 ml-[-8px] px-4 w-24 py-1 lg:text-[13px] text-[11px]  font-semibold  rounded-r-full  text-white  font-poppins">
                    {reason.no}
                  </span>
                  <div className="relative z-10">
                    <p className="text-[#243561] font-poppins  max-[1200px]:text-[12px] min-[1200px]:text-[16px] pl-2 pr-0 text-start mt-4 ">
                      {reason.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:hidden block">
            <div className="relative mt-4 mb-4 text-justify justify-center items-center font-sans text-[16px] md:mx-5 pt-0 font-semibold text-[#243460] border-2 border-[#6271ff] rounded-xl">
              {/* <div className="w-full grid grid-cols-1  md:flex p-2">
                <div className="w-full lg:w-1/3 flex flex-col">
                  <div className="border-dotted border-b md:border-r h-28 md:h-28 border-[#5271ff] p-3 flex-grow">
                    <h1 className="font-bold text-[#002e6e] text-start h-8 lg:text-lg text-[11px]">
                      A comprehensive database{" "}
                      <br className="hidden md:block" /> of healthcare providers
                    </h1>
                    <p className="lg:text-[16px] text-[10px]">
                      Aarogya Aadhar has a comprehensive database of healthcare
                      providers across India. This means that patients can
                      easily find the right hospital or healthcare provider for
                      their needs.
                    </p>
                  </div>
                  <div className="border-dotted border-b md:border-r  md:border-b-0 h-28 border-[#5271ff] p-3 flex-grow">
                    <h1 className="font-bold text-[#002e6e] lg:text-lg h-8 text-[11px]">
                      Easy to use
                    </h1>
                    <p className="lg:text-[16px] text-[10px]">
                      Aarogya Aadhar is easy to use. Patients can easily find
                      the information they need and compare different hospitals
                      or healthcare providers.
                    </p>
                  </div>
                </div>

                <div className="w-full  lg:w-1/3 flex flex-col">
                  <div className="border-dotted border-b md:border-b-0 h-28 md:h-28 border-[#5271ff] p-3 flex-grow">
                    <h1 className="font-bold text-[#002e6e] h-8 lg:text-lg text-[11px]">
                      Real-time <br className="hidden md:block" /> information
                    </h1>
                    <p className="lg:text-[16px] text-[10px]">
                      Aarogya Aadhar provides real-time information about
                      healthcare providers. This means that patients can be sure
                      that the information they are getting is up-to-date.
                    </p>
                  </div>
                  <div className="border-dotted border-t border-[#5271ff] p-3 h-28 flex-grow">
                    <h1 className="font-bold text-[#002e6e] h-8 lg:text-lg text-[11px]">
                      Free to use
                    </h1>
                    <p className="lg:text-[16px] text-[10px]">
                      Aarogya Aadhar is free to use. This means that patients
                      can access the app without having to pay any fees.
                    </p>
                  </div>
                </div>
              </div> */}
              <img src="https://res.cloudinary.com/dwsc0vedb/image/upload/v1743956741/Home_Page_1_ukdmbr.png" alt="" className="rounded-xl" />
            </div>

            <div className="justify-center text-center md:pt-4 pt-4">
              <h1 className="lg:text-[25px] text-[20px] text-[#5271ff] font-poppins font-extrabold">
                <span className="shadow-inheri">
                  Additional Benefits of Aarogya Aadhar
                </span>
              </h1>
            </div>
            <div className="grid grid-cols-2 mt-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-4 justify-center mx-auto sm:mt-2 md:mt-4 xs:px-0 md:px-4">
              {reasons.map((reason, index) => (
                <div
                  className="relative flex flex-col h-full pb-4 mb-4 bg-[#93c2ee] bg-opacity-30 md:p-2 p-1 border-[#4671b8] rounded-2xl border"
                  key={index}
                >
                  <span className="bg-[#4671b8] items-start mt-6 ml-[-6px] md:ml-[-8px] px-4 w-24 py-1 lg:text-[13px] text-[11px] font-semibold rounded-r-full text-white font-poppins">
                    {reason.no}
                  </span>
                  <div className="relative z-10 flex-grow">
                    <p className="text-[#243561] font-poppins lg:text-[16px] text-[10px] text-start mt-4">
                      {reason.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About4;
const reasons = [
  {
    title: "Power to choose where to receive treatment & healthcare services",
    no: "POWER",
  },
  {
    title:
      "Enabling exercise of more choice & access to essential information about care options",
    no: "ENABLE",
  },
  {
    title: "Wider accessibility across different area’s & multiples languages",
    no: "ACCESS",
  },
  {
    title: "Constant updating for access to the latest information",
    no: "UPDATED",
  },
];




