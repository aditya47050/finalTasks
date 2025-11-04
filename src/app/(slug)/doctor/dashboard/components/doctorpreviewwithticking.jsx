"use client";

import Docviewer from "@/app/patient/dashboard/components/docviewer";
import { User } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

const DoctorPreViewWithTicking = ({ doctorData , userdata }) => {
  const [showFullDesc, setShowFullDesc] = useState(false);

  // Format text properly
  const formatText = (text) => {
    return text
      ? text
          .toString()
          .replace(/_/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase())
      : "N/A";
  };

  // Mask sensitive numbers (show only last 4 digits)
  const maskNumber = (num) => {
    return num ? `${num}` : "N/A";
  };

  return (
    <div className="min-h-screen font-poppins py-8 px-4 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-500 h-40 relative">
          <div className="absolute inset-0 bg-opacity-50 bg-black"></div>
          <div className="absolute bottom-4 left-4 text-white z-10">
            <h1 className="text-2xl font-semibold">
              Dr. {formatText(doctorData.firstName)}{" "}
              {formatText(doctorData.lastName)}
            </h1>
            <p className="text-sm">Contact: {doctorData.mobile || "N/A"}</p>
          </div>
          {userdata?.doctorinfo?.passportphoto ? (
            <Image
              className="absolute bottom-[-40px] right-4 w-24 h-24 rounded-full border-4 border-white object-cover"
              src={userdata.doctorinfo.passportphoto}
              alt="Doctor Profile"
              width={400}
              height={400}
            />
          ) : (
            <User
              className="absolute bottom-[-40px] right-4 w-24 h-24 rounded-full border-4 border-white object-cover bg-blue-600"
              color="#ffff"
            />
          )}
        </div>

        {/* Profile Information */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Doctor's Personal Info */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Personal Information
              </h2>
              <ul className="mt-4 space-y-3">
                <li>Middle Name: {formatText(doctorData.middleName)}</li>
                <li>
                  Date of Birth:{" "}
                  {doctorData.dateOfBirth
                    ? new Date(doctorData.dateOfBirth).toLocaleDateString(
                        "en-GB"
                      )
                    : "N/A"}
                </li>
                <li>Gender: {formatText(doctorData.gender)}</li>
                <li>Education: {formatText(doctorData.education)}</li>
                <li>
                  Total Experience: {formatText(doctorData.totalexperience)}
                </li>
                <li>
                  Registration Date:{" "}
                  {doctorData.registrationdate
                    ? new Date(doctorData.registrationdate).toLocaleDateString(
                        "en-GB"
                      )
                    : "N/A"}
                </li>
                <li>
                  Registration Renewal Date:{" "}
                  {doctorData.regrenewaldate
                    ? new Date(doctorData.regrenewaldate).toLocaleDateString(
                        "en-GB"
                      )
                    : "N/A"}
                </li>
              </ul>
            </div>

            {/* Contact Details */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Contact Information
              </h2>
              <ul className="mt-4 space-y-3">
                <li>Email: {doctorData.email || "N/A"}</li>
                <li>Mobile: {doctorData.mobile || "N/A"}</li>
                <li>
                  Alternate Mobile: {doctorData.alternatemobileno || "N/A"}
                </li>
                <li>Pincode: {doctorData.pincode || "N/A"}</li>
              </ul>
            </div>
          </div>

          {/* Profile Description */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-800">
              Profile Description
            </h2>
            <p className="mt-2 text-gray-600">
              {showFullDesc
                ? doctorData.profiledescription || "N/A"
                : (doctorData.profiledescription?.slice(0, 200) ||
                    "N/A") + "..."}
              {doctorData.profiledescription?.length > 200 && (
                <button
                  className="text-blue-500 ml-2"
                  onClick={() => setShowFullDesc(!showFullDesc)}
                >
                  {showFullDesc ? "Show Less" : "Show More"}
                </button>
              )}
            </p>
          </div>

          {/* Specializations */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-800">
              Specializations
            </h2>
            <ul className="mt-4 space-y-3">
              {userdata?.specialities?.map((spec, index) => (
                <li key={index}>{spec.speciality?.title}</li>
              )) || "N/A"}
            </ul>
          </div>

          {/* Banking Details */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-800">
              Banking Information
            </h2>
            <ul className="mt-4 space-y-3">
              <li>Bank Name: {doctorData.bankName || "N/A"}</li>
              <li>
                Account Number:{" "}
                {maskNumber(doctorData.accountNumber)}
              </li>
              <li>IFSC Code: {doctorData.ifscCode || "N/A"}</li>
              <li>MICR Code: {doctorData.micrCode || "N/A"}</li>
            </ul>
          </div>

          {/* Documents Section */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-800">
              Uploaded Documents
            </h2>
            <ul className="mt-4 space-y-3">
              <li>
                PAN Number: {maskNumber(doctorData.pancardno)}
              </li>
              <li>
                Aadhar Number: {maskNumber(doctorData.aadharcardno)}
              </li>
            </ul>
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-800">
                Uploaded Documents
              </h2>

              {/* PAN and Aadhar Number */}
              <ul className="mt-4 space-y-3">
                <li>
                  PAN Number: {maskNumber(doctorData.pancardno)}
                </li>
                <li>
                  Aadhar Number:{" "}
                  {maskNumber(doctorData.aadharcardno)}
                </li>
              </ul>

              {/* Documents Grid with Labels */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {/* PAN Card Front */}
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    PAN Card Front
                  </label>
                  <Docviewer
                    userdata={doctorData.pancardfront}
                    title="PAN Card Front"
                  />
                </div>

                {/* Aadhar Card Front */}
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Aadhar Card Front
                  </label>
                  <Docviewer
                    userdata={doctorData.aadharcardfront}
                    title="Aadhar Front"
                  />
                </div>

                {/* Aadhar Card Back */}
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Aadhar Card Back
                  </label>
                  <Docviewer
                    userdata={doctorData.aadharcardback}
                    title="Aadhar Back"
                  />
                </div>

                {/* Degree Certificate */}
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Degree Certificate
                  </label>
                  <Docviewer
                    userdata={doctorData.degreecertificate}
                    title="Degree Certificate"
                  />
                </div>

                {/* Registration Certificate */}
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Registration Certificate
                  </label>
                  <Docviewer
                    userdata={doctorData.registrationcertificate}
                    title="Registration Certificate"
                  />
                </div>

                {/* Speciality Certificate */}
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Speciality Certificate
                  </label>
                  <Docviewer
                    userdata={doctorData.specialitydegreecertificate}
                    title="Speciality Certificate"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorPreViewWithTicking;
