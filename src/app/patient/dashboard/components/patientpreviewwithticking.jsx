"use client";

import Docviewer from "@/app/patient/dashboard/components/docviewer";
import { User } from "lucide-react";
import Image from "next/image";
import React from "react";

const PatientPreViewWithTicking = ({ formdata, userdata }) => {
  // Function to format text
  const formatText = (text) => {
    if (!text) return "N/A"; // Handle undefined or null values
    return text
      .toString() // Convert to string in case it's a number
      .replace(/_/g, " ") // Replace underscores with spaces
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
  };
  return (
    <div className=" min-h-screen overflow-auto font-poppins xs:py-4 lg:py-8  lg:px-8">
      <div className="max-w-4xl mx-auto ">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-500 h-40 relative">
          <div className="absolute inset-0 bg-opacity-50 bg-black"></div>
          <div className="absolute  lg:bottom-4 left-4 text-white z-10">
            <h1 className="text-2xl font-semibold">
              {formatText(formdata?.firstName)} {formatText(formdata?.lastName)}
            </h1>
            <p className="text-sm">Contact: {formdata?.mobile || "N/A"}</p>
          </div>
          {formdata?.passportPhoto ? (
            <Image
              className="absolute bottom-0 md:bottom-[-40px] right-4 w-28 h-28 rounded-full border-4 border-white object-cover"
              src={formdata?.passportPhoto}
              alt="User Profile"
              width={400}
              height={400}
            />
          ) : (
            <User
              className="absolute bottom-[-40px] right-4 w-28 h-28 rounded-full border-4 border-white object-cover bg-blue-600"
              color="#ffff"
            />
          )}
        </div>

        {/* Profile Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Personal Information
              </h2>
              <ul className="mt-4 space-y-3">
                <li className="flex justify-between">
                  <span className="font-medium text-gray-600">
                    Date of Birth:
                  </span>
                  <span>
                    {formdata?.dateOfBirth
                      ? new Date(formdata?.dateOfBirth).toLocaleDateString(
                          "en-GB"
                        )
                      : "N/A"}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium text-gray-600">Gender:</span>
                  <span>{formatText(formdata?.gender)}</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium text-gray-600">
                    Blood Group:
                  </span>
                  <span>{formatText(formdata?.bloodgroup)}</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium text-gray-600">
                    Marital Status:
                  </span>
                  <span>{formatText(formdata?.maritalStatus)}</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium text-gray-600">Religion:</span>
                  <span>{formatText(formdata?.religion)}</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium text-gray-600">Religion:</span>
                  <span>{formatText(formdata?.caste)}</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium text-gray-600">
                    Organ Donation:
                  </span>
                  <span>{formdata?.organDonation ? "Yes" : "No"}</span>
                </li>
              </ul>
            </div>

            {/* Contact Details */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Contact Details
              </h2>
              <ul className="mt-4 space-y-3">
                <li className="flex justify-between">
                  <span className="font-medium text-gray-600">
                    Alternate Mobile:
                  </span>
                  <span>{formdata?.alternateMobile || "N/A"}</span>
                </li>
                <li className="flex justify-between items-start gap-4">
                  <span className="font-medium text-gray-600 flex-2">
                    Present Address:
                  </span>
                  <span className="text-right whitespace-pre-line flex-1">
                    {formdata?.presentAddress || "N/A"}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium text-gray-600">City:</span>
                  <span>{formatText(formdata?.city)}</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium text-gray-600">State:</span>
                  <span>{formatText(formdata?.state)}</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium text-gray-600">District:</span>
                  <span>{formatText(formdata?.district)}</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium text-gray-600">Taluka:</span>
                  <span>{formatText(formdata?.taluka)}</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium text-gray-600">Pincode:</span>
                  <span>{formdata?.pincode || "N/A"}</span>
                </li>
              </ul>
            </div>
          </div>
          {/* Bank Information */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800">
              Bank Information
            </h2>
            <ul className="mt-4 space-y-3">
              <li className="flex justify-between">
                <span className="font-medium text-gray-600">Bank Name:</span>
                <span>{formatText(formdata?.bankName)}</span>
              </li>
              <li className="flex justify-between">
                <span className="font-medium text-gray-600">
                  Account Number:
                </span>
                <span>{formdata?.accountNumber || "N/A"}</span>
              </li>
              <li className="flex justify-between">
                <span className="font-medium text-gray-600">IFSC Code:</span>
                <span>{formdata?.ifscCode || "N/A"}</span>
              </li>
              <li className="flex justify-between">
                <span className="font-medium text-gray-600">MICR Code:</span>
                <span>{formdata?.micrCode || "N/A"}</span>
              </li>
              <li className="flex justify-between">
                <span className="font-medium text-gray-600">Account Type:</span>
                <span>{formatText(formdata?.accountType)}</span>
              </li>
              <li className="flex justify-between">
                <span className="font-medium text-gray-600">
                  Cancelled Cheque:
                </span>
                {formdata?.cancelledCheque && (
                  <Docviewer userdata={formdata?.cancelledCheque} />
                )}
              </li>
            </ul>
          </div>

          {/* Document Section */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800">Documents</h2>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-600">Aadhar Card</h3>
                <p className="text-[12px]">
                  Number: {formdata?.aadharCardNumber || "N/A"}
                </p>
                <div className="mt-2">
                  <Docviewer userdata={formdata?.aadharCardFront} />
                  <Docviewer userdata={formdata?.aadharCardBack} />
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-600">Health Insurance</h3>
                <p className="text-[12px]">
                  Health Insurance: {formdata?.healthInsurance ? "Yes" : "No"}
                </p>
                <p className="text-[12px]">
                  Number: {formdata?.healthInsuranceNumber || "N/A"}
                </p>
                <div className="mt-2">
                  <Docviewer userdata={formdata?.healthInsuranceDocument} />
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-600">ABHA Card</h3>
                <p className="text-[12px]">
                  Number: {formdata?.abhaCardNumber || "N/A"}
                </p>
                <div className="mt-2">
                  <Docviewer userdata={formdata?.abhaCardFront} />
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-600">Ayushman Card</h3>
                <p className="text-[12px]">
                  Number: {formdata?.ayushmanCard || "N/A"}
                </p>
                <div className="mt-2">
                  <Docviewer userdata={formdata?.ayushmanCardFront} />
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-600">Ration Card</h3>
                <p className="text-[12px]">
                  Number: {formdata?.rationCardNumber || "N/A"}
                </p>
                <div className="mt-2">
                  <Docviewer userdata={formdata?.rationCardFront} />
                  <Docviewer userdata={formdata?.rationCardBack} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800">
              Pancard Information
            </h2>
            <ul className="mt-4 space-y-3">
              <li className="flex justify-between">
                <span className="font-medium text-gray-600">Pan Card:</span>
                <span>{formdata?.hasPanCard ? "Yes" : "No"}</span>
              </li>
              <li className="flex justify-between">
                <span className="font-medium text-gray-600">
                  Pan Card Number:
                </span>
                <span>{formdata?.panCardNumber || "N/A"}</span>
              </li>
              <li className="flex justify-between">
                <span className="font-medium text-gray-600">
                  Pan Card Document:
                </span>
                {formdata?.panCard && (
                  <Docviewer userdata={formdata?.panCard} />
                )}
              </li>
            </ul>
          </div>

          {/* Income Information */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800">
              Income Information
            </h2>
            <ul className="mt-4 space-y-3">
              <li className="flex justify-between">
                <span className="font-medium text-gray-600">
                  Income Certificate:
                </span>
                <span>{formdata?.income ? "Yes" : "No"}</span>
              </li>
              <li className="flex justify-between">
                <span className="font-medium text-gray-600">
                  Income Certificate Number:
                </span>
                <span>{formdata?.incomeCertificateNo || "N/A"}</span>
              </li>
              <li className="flex justify-between">
                <span className="font-medium text-gray-600">
                  Income Certificate Document:
                </span>
                {formdata?.incomeCertificateimg && (
                  <Docviewer userdata={formdata?.incomeCertificateimg} />
                )}
              </li>
              <li className="flex justify-between">
                <span className="font-medium text-gray-600">
                  eKYC Document:
                </span>
                {formdata?.ekycdoc && (
                  <Docviewer userdata={formdata?.ekycdoc} />
                )}
              </li>
            </ul>
          </div>

          {/* Contact Person Information */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800">
              Contact Person Information
            </h2>
            <ul className="mt-4 space-y-3">
              <li className="flex justify-between">
                <span className="font-medium text-gray-600">
                  Contact Person Name:
                </span>
                <span>{formatText(formdata?.contactPersonName)}</span>
              </li>
              <li className="flex justify-between">
                <span className="font-medium text-gray-600">Relation:</span>
                <span>{formatText(formdata?.contactPersonRelation)}</span>
              </li>
              <li className="flex justify-between">
                <span className="font-medium text-gray-600">
                  Contact Person Mobile Number:
                </span>
                <span>{formdata?.contactmanaadharNumber || "N/A"}</span>
              </li>
            </ul>
          </div>

          {/* Company Information */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800">
              Company Information
            </h2>
            <ul className="mt-4 space-y-3">
              <li className="flex justify-between">
                <span className="font-medium text-gray-600">
                  Company Registered:
                </span>
                <span>{formdata?.isCompanyRegistered ? "Yes" : "No"}</span>
              </li>
              <li className="flex justify-between">
                <span className="font-medium text-gray-600">
                  Company Registration Number:
                </span>
                <span>{formdata?.companyRegistrationNo || "N/A"}</span>
              </li>
              <li className="flex justify-between">
                <span className="font-medium text-gray-600">
                  Employee ID Card:
                </span>
                {formdata?.employeeIdCard && (
                  <Docviewer userdata={formdata?.employeeIdCard} />
                )}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientPreViewWithTicking;
