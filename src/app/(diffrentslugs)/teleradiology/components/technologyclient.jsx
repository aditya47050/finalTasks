import Image from "next/image";
import React from "react";


const TechnologyTeleradiologyclient = () => {
  return (
    <>
      <div className="font-poppins mt-6  md:mt-0">
      <div className="grid place-items-center text-center">
  <div className="w-full md:mt-5 lg:mt-0 pt-3 lg:py-4 grid grid-cols-1 md:grid-cols-5 items-center justify-center text-center lg:px-3 rounded-[15px] gap-4">
    
    {/* Image Section (2/5 width on medium & larger screens) */}
    <div className="md:col-span-2 hidden  md:flex justify-center items-center w-full">
      <Image
        src="https://res.cloudinary.com/dnckhli5u/image/upload/v1732181740/2_blvyhe.png"
        alt=" "
        width={1250}
        height={938}
        className="responsive-image"
      />
    </div>

    {/* Text Content Section (3/5 width on medium & larger screens) */}
    <div className="font-poppins md:col-span-3 lg:space-y-1 xl:space-y-3 text-[10px] md:text-[12px] lg:text-[12px] xl:text-[14px] text-justify break-words w-full border md:border-none rounded-[7px] border-orange-500 p-2 text-[#243460]">
      <div className="flex justify-center">
        <h1 className="text-[20px] md:text-[20px] lg:text-[25px] font-bold font-poppins">Technology</h1>
      </div>
      <p>
        <b>Aarogya e-RAD</b> boutique radiology interpretation offering enables
        your diagnostic unit to cope with the growing dearth of on-call
        radiologists. Our cutting-edge teleradiology solutions provide a
        cost-effective way for diagnostic imaging centers to leverage our
        radiologists located across the globe to meet the critical standards of
        turnaround time and quality.
      </p>
      <p>
        Our best-in-class tele-PACS solution eRAD, which requires a basic
        technological setup, has enabled even the remotest centers to report
        cases accurately and efficiently within the required time frame. eRAD is
        a global leader in PACS integration, providing a reader-friendly user
        interface, 24x7 support, and efficient storage solutions.
      </p>
      <p>
        Sign up for a free demo! See how our solutions will seamlessly fit into
        your operations protocol, contributing greatly to the efficiency and
        timeliness of reporting.
      </p>
    </div>
  </div>
</div>


        <div>
          {" "}
          {/* trail */}
          <div className="flex md:mt-0 mt-4 flex-wrap justify-center items-center md:flex-nowrap md:py-4 font-poppins">
            <div className="w-full md:w-[85%] flex flex-col  lg:flex-row justify-between items-start lg:space-y-0 space-y-4  lg:space-x-8">
              <div className="w-full rounded-[15px] p-4 shadow-lg lg:h-36 xl:h-36 md:h-auto relative border border-[#243460]">
                <div className="absolute inset-0 rounded-[15px] transform scale-95" />
                <h2 className="lg:text-[16px]  md:text-[14px] text-[12px] font-bold text-orange-500 mb-2">
                  01. Ever Present
                </h2>
                <p className="lg:text-[10px] xl:text-[12px] text-[10px] md:text-[12px] text-[#243460]">
                  Leaning towards outsourcing clinical and Non-clinical aspects
                  of their business to enable them to face the challenges of
                  daily operations.
                </p>
              </div>

              <div className="w-full rounded-[15px] p-4 shadow-lg lg:h-36 xl:h-36 relative border border-[#243460]">
                <div className="absolute inset-0 rounded-[15px] transform scale-90" />
                <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-orange-500 mb-2">
                  02. Report Accuracy
                </h2>
                <p className="lg:text-[10px] xl:text-[12px] text-[10px] md:text-[12px] text-[#243460]">
                  Deep domain expertise and ability to seamlessly integrate into
                  any operational protocol enables our clients to focus on the
                  strategic aspects.
                </p>
              </div>

              <div className="w-full rounded-[15px] p-4 shadow-lg lg:h-36 xl:h-36 relative border border-[#243460]">
                <div className="absolute inset-0 rounded-[15px] transform scale-85" />
                <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-orange-500 mb-2">
                  03. Global Presence
                </h2>
                <p className="lg:text-[10px] xl:text-[12px] md:text-[12px] text-[10px] text-[#243460]">
                  Our strong acquaintance with global quality standards, vast
                  network of clinical and non-clinical experts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className=" mt-4 mb-2 block lg:hidden">
        <img src="https://res.cloudinary.com/dwsc0vedb/image/upload/v1743659673/47_jkzltt.png" alt=""  className=" rounded-[10px]"/>
      </div>
      <div className="bg-[] w-full block md:hidden mt-2 h-auto pt-0 items-center justify-center text-center">
        <marquee className="font-bold text-[16px]  font-sans text-[#243561] text-center" scrollamount="12">
        Aarogya Aadhar Approved & Funded by Government of India | Aarogya
            Aadhar Certified by ISO:27001 Online Healthcare Platform | Your
            Health, Your Choice | Connect with us +91 79-7272-7498 | Mail ID:
            info@aarogyaaadhar.com
        </marquee>
      </div>
    </>
  );
};

export default TechnologyTeleradiologyclient;
