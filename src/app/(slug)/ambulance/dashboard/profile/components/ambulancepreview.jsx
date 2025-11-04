"use client";

import Docviewer from "@/app/patient/dashboard/components/docviewer";
import { User } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

const AmbulancePreview = ({ ambulanceData, hspData ,ownerphoto }) => {
  const [showFullDesc, setShowFullDesc] = useState(false);

  const formatText = (text) =>
    text ? text.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "N/A";

  const maskNumber = (num) =>
    num ? `XXXX-XXXX-${num.slice(-4)}` : "N/A";

  return (
    <div className="min-h-screen font-poppins py-8  lg:px-8">
      <div className="max-w-4xl md:mx-auto bg-white shadow-md rounded-xl overflow-hidden">
        {/* Header */}
           <div className="bg-gradient-to-r from-blue-600 to-indigo-500 h-40 relative">

          <div className="absolute inset-0 bg-opacity-50 bg-black"></div>
          <div className="absolute bottom-4 left-4 text-white z-10">
            <h1 className="text-2xl font-semibold">
              Owner: {formatText(ambulanceData.ownerfirstname)} {formatText(ambulanceData.ownerlastname)}
            </h1>
            <p className="text-sm">Mobile: {ambulanceData.mobile || "N/A"}</p>
          </div>
   
           {hspData.hsplogo ? (
            <Image
              className="absolute bottom-[-40px] right-4 w-24 h-24 rounded-full border-4 border-white object-cover"
              src={hspData.hsplogo}
              alt="Owner Photo"
              width={400}
              height={400}
            />
          ) : (
            <User
              className="absolute bottom-[-40px] right-4 w-24 h-24 rounded-full border-4 border-white object-cover bg-green-600"
              color="#ffff"
            />
          )}
        </div>

        {/* Main Content */}
        <div className="p-6">
          {/* Owner Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Owner Information</h2>
              <ul className="mt-4 space-y-2">
                <li>Middle Name: {formatText(ambulanceData.ownermiddlename)}</li>
                <li>
                    Date of Birth:{" "}
                    {ambulanceData.dateofbirth
                        ? new Date(ambulanceData.dateofbirth).toLocaleDateString("en-IN", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                            })
                        : "N/A"}
                </li>
                <li>Gender: {formatText(ambulanceData.gender)}</li>
                <li>Pincode: {ambulanceData.pincode || "N/A"}</li>
                <li>Owner Profile: <Docviewer  userdata={ownerphoto} /></li>
              </ul>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Contact Info</h2>
              <ul className="mt-4 space-y-2">
                <li>Email: {ambulanceData.email}</li>
                <li>Mobile: {ambulanceData.mobile}</li>
                <li>Alt Mobile: {ambulanceData.alternatemobileno || "N/A"}</li>
                <li>Admin Name: {ambulanceData.adminname || "N/A"}</li>
                <li>Admin Email: {ambulanceData.adminemail || "N/A"}</li>
                <li>Admin Contact: {ambulanceData.admincontact || "N/A"}</li>
              </ul>
            </div>
          </div>

          {/* Hospital Info */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-800">Hospital Association</h2>
            <ul className="mt-4 space-y-2">
              <li>Hospital Name: {hspData?.hspregname || "N/A"}</li>
              <li>Total Ambulances: {hspData?.totalambulance || "N/A"}</li>
              <li>In-house Doctor: {hspData?.inhousedoctor || "N/A"}</li>
              <li>
                Description:{" "}
                {showFullDesc
                  ? hspData?.hspdescription || "N/A"
                  : (hspData?.hspdescription?.slice(0, 200) || "N/A") + "..."}
                {hspData?.hspdescription?.length > 200 && (
                  <button
                    className="text-blue-500 ml-2"
                    onClick={() => setShowFullDesc(!showFullDesc)}
                  >
                    {showFullDesc ? "Show Less" : "Show More"}
                  </button>
                )}
              </li>
            </ul>
          </div>

          {/* Bank Info */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-800">Banking Details</h2>
            <ul className="mt-4 space-y-2">
              <li>Bank Name: {hspData?.bankname || "N/A"}</li>
              <li>Account Type: {hspData?.accounttype || "N/A"}</li>
              <li>Account Number: {hspData?.accountnumber}</li>
              <li>IFSC Code: {hspData?.ifsccode || "N/A"}</li>
              <li>MICR Code: {hspData?.micrcode || "N/A"}</li>
                  
            </ul>
          </div>

          {/* Document Uploads */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-800">Uploaded Documents</h2>
            <ul className="mt-4 space-y-2">
              <li>PAN Number: {ambulanceData.ownerpanno}</li>
              <li>Aadhar Number: {ambulanceData.owneraadharcardno}</li>
            </ul>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {/* PAN */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  PAN Card Front
                </label>
                <Docviewer userdata={ambulanceData.ownerpanfront} title="PAN Front" />
              </div>
              {/* Aadhar */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  Aadhar Card Front
                </label>
                <Docviewer userdata={ambulanceData.owneraadharcardfront} title="Aadhar Front" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  Aadhar Card Back
                </label>
                <Docviewer userdata={ambulanceData.owneraadharcardback} title="Aadhar Back" />
              </div>
              {/* Hospital PAN & Certificate */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  Hospital PAN
                </label>
                <Docviewer userdata={hspData?.hsppancard} title="Hospital PAN" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  Registration Certificate
                </label>
                <Docviewer userdata={hspData?.hspregcertificate} title="Hospital Certificate" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  Cancelled Cheque
                </label>
                <Docviewer userdata={hspData?.cancelledcheque} title="Cancelled Cheque" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AmbulancePreview;
