"use client";

import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import { Download, Printer, Shield } from "lucide-react";
import Image from "next/image";
import { FaCertificate } from "react-icons/fa";
import { format } from "date-fns";
export default function Certificate(data) {
  const photographerCertificate = data?.data?.PhotographerCertificate?.[0]; // first certificate
const createdAtRaw = photographerCertificate?.createdAt;
console.log(data);
let registrationDate = "N/A";
let renewalDate = "N/A";

if (createdAtRaw) {
  const createdAt = new Date(createdAtRaw);

  if (!isNaN(createdAt)) {
    registrationDate = format(createdAt, "dd/MM/yyyy");

    // Copy date before adding 1 year
    const renewal = new Date(createdAt);
    renewal.setFullYear(renewal.getFullYear() + 1);
    renewalDate = format(renewal, "dd/MM/yyyy");
  }
}

  const doctorName = data?.data?.fullname 
    ? `${data?.data?.fullname }`
    : data?.data?.firstName || data?.data?.lastName || "Photographer Name";
  const contentRef = useRef(null);
  const handlePrint = useReactToPrint({
    contentRef,
  });

  return (
    <div className="flex flex-col items-center p-4 md:p-8">
      <div className="mb-6 flex gap-4">
        <Button
          onClick={() => handlePrint()}
          variant="outline"
          className="bg-blue-600 text-white"
        >
          <Printer className="mr-2 h-4 w-4" /> Print Certificate
        </Button>
      </div>

      {/* Certificate Container - Fixed dimensions for consistent printing */}
      <div
        ref={contentRef}
        className="h-[210mm] w-[297mm] bg-white shadow-lg overflow-hidden"
        style={{
          pageBreakInside: "avoid",
          printColorAdjust: "exact",
        }}
      >
        {/* Header Section */}
        <div className="flex   bg-[#1e3a8a] pb-6 text-white">
          {/* Logo Section */}
          <div className="w-[30%] border-r border-white p-6 flex border-b  items-center justify-center">
            <div className="flex flex-col  items-center">
              <div className="text-white ">
                <Image
                  src="https://res.cloudinary.com/dnckhli5u/image/upload/v1732897093/logo_with_tm_1_dovble.png"
                  width={180}
                  height={200}
                  alt="Logo"
                  className=" pl-1 w-full"
                />
              </div>
            </div>
          </div>

          {/* Title Section */}
          <div className="w-[70%] flex flex-col">
            <div className="p-4 text-center">
              <div className="text-sm">Certified By ISO: 27001</div>
              <div
                className="text-2xl font-semibold mt-2"
                style={{ letterSpacing: "0.2rem" }}
              >
                APPROVED BY GOVERNMENT OF INDIA
              </div>
            </div>

            {/* Date Table */}
            <div className="flex border-t border-b border-white mt-auto">
              <div className="w-1/2 pt-3 pb-5 text-center border-r border-white">
                <div className="text-lg">Date of Registration</div>
                <div className="text-sm mt-2">{registrationDate}</div>
              </div>
              <div className="w-1/2 pt-3 pb-5 text-center">
                <div className="text-lg">Date of Renewal</div>
                <div className="text-sm mt-2">{renewalDate}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Certificate Body */}
        <div className="bg-[#3b68b5] text-white p-6 flex flex-col items-center min-h-[66%] ">
          <h1 className="text-3xl  text-white font-bold tracking-widest mb-4 mt-1">
            CERTIFICATE OF REGISTRATION
          </h1>

          <div className=" text-2xl font-bold text-white">
            {doctorName}
          </div>

          <p className="text-center italic max-w-4xl mb-0 text-black mt-8 text-[18px]">
            Has been assessed and found to comply with Aarogya Aadhar Healthcare
            Digital Platform by <br /> requirements. This certificate is valid
            for the Scope as specified in the annexure, subject to continued{" "}
            <br /> compliance with the online healthcare services provider and
            support requirements; Aarogya Aadhar <br /> provided an authorised
            HSP tag. The type of certificate is{" "}
            <span className="font-bold">Level First Certification</span>,
            provided based on <br /> terms & conditions.
          </p>

          <div className="flex items-center justify-between w-full mt-8">
            {/* Certified Center */}

            {/* Footer Info */}
            <div>
              <div className="text-xl font-bold mt-16">REGISTRATION NO</div>
              <div className="text-xl font-bold mt-2">{}</div>
            </div>
            <div className="flex flex-col items-center space-y-4">
            <div className="relative flex flex-col items-center">
              <div className="w-32 h-32 bg-white flex items-center justify-center shadow-xl relative transform rotate-45 rounded-xl">
                <div className="transform -rotate-45 flex flex-col items-center">
                  <Shield className="text-blue-500 mt-2" size={40} />
                  <img src={"https://res.cloudinary.com/dorreici1/image/upload/v1757569067/logo-cert_gszjjb.webp"} alt="Logo" className="w-24 h-24 mb-2 -mt-4 object-contain" />
                </div>
              </div>
              <span className="absolute bottom-[-15px] bg-slate-700 text-white px-6 py-2 text-sm font-bold rounded-lg shadow-lg border border-slate-600">
                Certified
              </span>
            </div>
          </div>

            <div className="text-xl font-bold mt-16">HSP STAR RATING</div>
          </div>
        </div>

        {/* Company Info */}
        <div className="bg-[#3b68b5] text-white p-4 text-center border-t border-white/20">
          <p className="text-lg">
            Livo AarogyaAadhar Private Limited (CIN: U86201PN2023PTC219864)
          </p>
        </div>
      </div>
    </div>
  );
}
