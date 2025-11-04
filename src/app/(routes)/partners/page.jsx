import React from "react";
import PartnersClient from "./components/partners";


const ServicePartnerspage = () => {
  return (
    <>
      <div>
        <PartnersClient />
      </div>
      <div className="bg-[#243561] w-full h-auto pt-2 items-center justify-center text-center">
        <marquee className="font-bold text-[16px]  font-sans text-white text-center" scrollamount="12">
        Aarogya Aadhar Approved & Funded by Government of India | Aarogya
            Aadhar Certified by ISO:27001 Online Healthcare Platform | Your
            Health, Your Choice | Connect with us +91 79-7272-7498 | Mail ID:
            info@aarogyaaadhar.com
        </marquee>
      </div>
    </>
  );
};

export default ServicePartnerspage;
