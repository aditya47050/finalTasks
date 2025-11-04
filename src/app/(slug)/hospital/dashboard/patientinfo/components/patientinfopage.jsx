"use client";

import Docviewer from "@/app/patient/dashboard/components/docviewer";
import { User } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const Patientinfopage = ({ userdata }) => {
  const [data, setData] = useState(userdata);
  const [loading, setLoading] = useState(false);
  const healthCardId = userdata.healthcard[0]?.id;
  const [currentAction, setCurrentAction] = useState(null);
  const [currentHealthCardId, setCurrentHealthCardId] = useState(healthCardId);
  const patientModelFields = [
    "email",
    "mobile",
    "password",
    "pincode",
    "firstName",
    "middleName",
    "lastName",
    "dateOfBirth",
    "gender",
    "maritalStatus",
    "religion",
    "alternateMobile",
    "presentAddress",
    "city",
    "state",
    "district",
    "taluka",
    "bloodgroup",
    "passportPhoto",
    "aadharCardNumber",
    "aadharCardFront",
    "aadharCardBack",
    "abhacard",
    "abhaCardNumber",
    "abhaCardFront",
    "healthInsurance",
    "healthInsuranceNumber",
    "healthInsuranceDocument",
    "ayushmancard",
    "ayushmanCard",
    "ayushmanCardFront",
    "rationCardNumber",
    "rationCardFront",
    "rationCardBack",
    "organDonation",
    "bankName",
    "accountNumber",
    "ifscCode",
    "accountType",
    "cancelledCheque",
    "micrCode",
    "income",
    "incomeCertificateimg",
    "incomeCertificateNo",
    "panCard",
    "contactPersonName",
    "contactPersonRelation",
    "contactManaadharFront",
    "contactmanaadharBack",
    "contactmanaadharNumber",
    "isCompanyRegistered",
    "companyRegistrationNo",
    "employeeIdCard",
  ];

  const issues = [
    ...patientModelFields.map(
      (field) => `Incorrect ${field.charAt(0).toUpperCase() + field.slice(1)}`
    ),
    "Missing Documents",
    "Other",
  ];



  // Function to format text
  const formatText = (text) => {
    if (!text) return "N/A"; // Handle undefined or null values
    return text
      .toString() // Convert to string in case it's a number
      .replace(/_/g, " ") // Replace underscores with spaces
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
  };

  return (


    <div className="bg-gray-50 min-h-screen font-poppins py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-500 h-40 relative">
          <div className="absolute inset-0 bg-opacity-50 bg-black"></div>
          <div className="absolute bottom-6 md:bottom-4 left-4 text-white z-10">
            <h1 className="text-2xl font-semibold">
              {formatText(userdata.firstName)} {formatText(userdata.lastName)}
            </h1>
            <p className="text-sm">Contact: {userdata.mobile || "N/A"}</p>
          </div>
          {userdata.passportPhoto ? (
            <Image
              className="absolute bottom-[-40px] right-4 w-28 h-28 rounded-full border-4 border-white object-cover"
              src={userdata.passportPhoto}
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
                    {userdata.dateOfBirth
                      ? new Date(userdata.dateOfBirth).toLocaleDateString("en-GB")
                      : "N/A"}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium text-gray-600">Gender:</span>
                  <span>{formatText(userdata.gender)}</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium text-gray-600">
                    Blood Group:
                  </span>
                  <span>{formatText(userdata.bloodgroup)}</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium text-gray-600">
                    Marital Status:
                  </span>
                  <span>{formatText(userdata.maritalStatus)}</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium text-gray-600">Religion:</span>
                  <span>{formatText(userdata.religion)}</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium text-gray-600">
                    Organ Donation:
                  </span>
                  <span>{userdata.organDonation ? "Yes" : "No"}</span>
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
                  <span>{userdata.alternateMobile || "N/A"}</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium text-gray-600">
                    Present Address:
                  </span>
                  <span>{userdata.presentAddress || "N/A"}</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium text-gray-600">City:</span>
                  <span>{formatText(userdata.city)}</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium text-gray-600">State:</span>
                  <span>{formatText(userdata.state)}</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium text-gray-600">District:</span>
                  <span>{formatText(userdata.district)}</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium text-gray-600">Taluka:</span>
                  <span>{formatText(userdata.taluka)}</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium text-gray-600">Pincode:</span>
                  <span>{userdata.pincode || "N/A"}</span>
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
                <span>{formatText(userdata.bankName)}</span>
              </li>
              <li className="flex justify-between">
                <span className="font-medium text-gray-600">
                  Account Number:
                </span>
                <span>{userdata.accountNumber || "N/A"}</span>
              </li>
              <li className="flex justify-between">
                <span className="font-medium text-gray-600">IFSC Code:</span>
                <span>{userdata.ifscCode || "N/A"}</span>
              </li>
              <li className="flex justify-between">
                <span className="font-medium text-gray-600">MICR Code:</span>
                <span>{userdata.micrCode || "N/A"}</span>
              </li>
              <li className="flex justify-between">
                <span className="font-medium text-gray-600">Account Type:</span>
                <span>{formatText(userdata.accountType)}</span>
              </li>
              <li className="flex justify-between">
                <span className="font-medium text-gray-600">
                  Cancelled Cheque:
                </span>
                {userdata.cancelledCheque ? (
                  <Docviewer userdata={userdata.cancelledCheque} />
                ) : "NO"}
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
                  Number: {userdata.aadharCardNumber || "N/A"}
                </p>
                <div className="mt-2">
                  <Docviewer userdata={userdata.aadharCardFront} />
                  <Docviewer userdata={userdata.aadharCardBack} />
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-600">Health Insurance</h3>
                <p className="text-[12px]">
                  Health Insurance: {userdata.healthInsurance ? "Yes" : "No"}
                </p>
                <p className="text-[12px]">
                  Number: {userdata.healthInsuranceNumber || "N/A"}
                </p>
                <div className="mt-2">
                  <Docviewer userdata={userdata.healthInsuranceDocument} />
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-600">ABHA Card</h3>
                <p className="text-[12px]">
                  Number: {userdata.abhaCardNumber || "N/A"}
                </p>
                <div className="mt-2">
                  <Docviewer userdata={userdata.abhaCardFront} />
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-600">Ayushman Card</h3>
                <p className="text-[12px]">
                  Number: {userdata.ayushmanCard || "N/A"}
                </p>
                <div className="mt-2">
                  <Docviewer userdata={userdata.ayushmanCardFront} />
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-600">Ration Card</h3>
                <p className="text-[12px]">
                  Number: {userdata.rationCardNumber || "N/A"}
                </p>
                <div className="mt-2">
                  <Docviewer userdata={userdata.rationCardFront} />
                  <Docviewer userdata={userdata.rationCardBack} />
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
                <span>{userdata.hasPanCard ? "Yes" : "No"}</span>
              </li>
              <li className="flex justify-between">
                <span className="font-medium text-gray-600">
                  Pan Card Number:
                </span>
                <span>{userdata.panCardNumber || "N/A"}</span>
              </li>
              <li className="flex justify-between">
                <span className="font-medium text-gray-600">
                  Pan Card Document:
                </span>
                {userdata.panCard ? <Docviewer userdata={userdata.panCard} /> : "No"}
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
                <span>{userdata.income ? "Yes" : "No"}</span>
              </li>
              <li className="flex justify-between">
                <span className="font-medium text-gray-600">
                  Income Certificate Number:
                </span>
                <span>{userdata.incomeCertificateNo || "N/A"}</span>
              </li>
              <li className="flex justify-between">
                <span className="font-medium text-gray-600">
                  Income Certificate Document:
                </span>
                {userdata.incomeCertificateimg && (
                  <Docviewer userdata={userdata.incomeCertificateimg} />
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
                <span>{formatText(userdata.contactPersonName)}</span>
              </li>
              <li className="flex justify-between">
                <span className="font-medium text-gray-600">Relation:</span>
                <span>{formatText(userdata.contactPersonRelation)}</span>
              </li>
              <li className="flex justify-between">
                <span className="font-medium text-gray-600">
                  Contact Person Mobile Number:
                </span>
                <span>{userdata.contactmanaadharNumber || "N/A"}</span>
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
                <span>{userdata.isCompanyRegistered ? "Yes" : "No"}</span>
              </li>
              <li className="flex justify-between">
                <span className="font-medium text-gray-600">
                  Company Registration Number:
                </span>
                <span>{userdata.companyRegistrationNo || "N/A"}</span>
              </li>
              <li className="flex justify-between">
                <span className="font-medium text-gray-600">
                  Employee ID Card:
                </span>
                {userdata.employeeIdCard && (
                  <Docviewer userdata={userdata.employeeIdCard} />
                )}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Patientinfopage;
