import Image from "next/image";
import React from "react";
import { GiArrowScope } from "react-icons/gi";
import { MdVisibility } from "react-icons/md";
import { FaBalanceScale } from "react-icons/fa";

const About2 = () => {
  return (
    <div className="font-poppins md:mx-auto md:px-0 px-2 md:container xl:mt-4">
      {/* Vision & Mission */}
      <div className="md:mx-auto md:container py-5 px-4 md:px-8 lg:pl-3">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Mission Card */}
          <div className="flex-1 rounded-xl bg-gradient-to-r from-[#f8d443] to-[#ff914d] border-2 py-2 pb-5 px-8 text-center shadow-xl hover:shadow-2xl transition-shadow duration-300 relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex h-16 w-16 items-center justify-center rounded-full bg-teal-400 ">
              <GiArrowScope className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-white mb-2 text-lg md:text-2xl font-semibold mt-8">Mission</h1>
            <hr />
            <ul className="text-white mt-2 text-left text-xs max-[1200px]:text-[12px] min-[1200px]:text-[14px] space-y-3 font-normal">
              <li>• Quality healthcare with affordable cost to every individual</li>
              <li>• Prevention of mortality due to cost of treatment & time spent on medical care</li>
              <li>• Paperless & Digital Medical Record System</li>
              <li>• Help through PPP model to Govt HSP to improve health services</li>
            </ul>
          </div>

          {/* Vision Card */}
          <div className="flex-1 rounded-xl bg-gradient-to-r from-[#004aad] to-[#004aad] border-2 py-2 pb-5 px-8 text-center shadow-xl hover:shadow-2xl transition-shadow duration-300 relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500">
              <MdVisibility className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-white mb-2 text-lg md:text-2xl font-semibold mt-8">Vision</h1>
            <hr />
            <ul className="text-white text-left mt-2 text-xs max-[1200px]:text-[12px] min-[1200px]:text-[14px] space-y-3 font-normal">
              <li>• Integrated healthcare with a multidisciplinary approach under one umbrella</li>
              <li>• Free access and support in healthcare to all - supplies & beneficiaries</li>
              <li>• Transparency in healthcare services</li>
            </ul>
          </div>

          {/* Values Card */}
          <div className="flex-1 rounded-xl bg-gradient-to-br from-[#53e418] to-[#79b50c] border-2 py-2 pb-5 px-8 text-center shadow-xl hover:shadow-2xl transition-shadow duration-300 relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex h-16 w-16 items-center justify-center rounded-full bg-sky-500">
              <FaBalanceScale className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-white mb-2 text-lg md:text-2xl font-semibold mt-8">Values</h1>
            <hr />
            <ul className="text-white text-left mt-2 text-xs max-[1200px]:text-[12px] min-[1200px]:text-[14px] space-y-3 font-normal">
              <li>• Treat Equal, Treat Better</li>
              <li>• 24/7 assistance to address healthcare needs anytime, anywhere</li>
              <li>• Drive change through digital transformation and smart solutions</li>
              <li>• Deliver compassionate care while being accountable for outcomes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About2;
