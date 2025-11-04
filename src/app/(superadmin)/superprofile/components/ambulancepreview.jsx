"use client"

import Docviewer from "@/app/patient/dashboard/components/docviewer"
import { User } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

const AmbulancePreview = ({ ambulanceData, hspData, ownerphoto }) => {
  const [showFullDesc, setShowFullDesc] = useState(false)
  const formatText = (text) =>
    text
      ? text
          .toString()
          .replace(/_/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase())
      : "N/A"

  return (
    <div className="min-h-screen font-poppins py-6 px-4 lg:px-8 bg-blue-50">
      <div className="group max-w-4xl md:mx-auto bg-white border border-blue-100 rounded-2xl shadow-sm hover:shadow-md transition-all">
        {/* Header */}
        <div className="relative h-36 bg-blue-500 rounded-t-2xl overflow-hidden">
          <div className="absolute bottom-4 left-4 text-white z-10">
            <h1 className="text-2xl font-semibold">
              Owner: {formatText(ambulanceData.ownerfirstname)} {formatText(ambulanceData.ownerlastname)}
            </h1>
            <p className="text-sm opacity-90">Mobile: {ambulanceData.mobile || "N/A"}</p>
          </div>
          {ambulanceData?.AmbulanceHsp?.hsplogo ? (
            <Image
              className="absolute -bottom-8 right-4 w-24 h-24 rounded-full border-4 border-white object-cover transition-transform duration-300 group-hover:scale-105"
              src={ambulanceData.AmbulanceHsp.hsplogo || "/placeholder.svg"}
              alt="Hospital Logo"
              width={96}
              height={96}
            />
          ) : (
            <User className="absolute -bottom-8 right-4 w-24 h-24 rounded-full border-4 border-white bg-blue-600 p-3 text-white transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105" />
          )}
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-8">
          {/* Owner Info + Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl bg-white border border-blue-100 p-4 hover:shadow-sm transition">
              <h2 className="text-base font-semibold text-blue-700">Owner Information</h2>
              <ul className="mt-3 space-y-2 text-sm text-gray-700">
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
                <li>
                  Owner Profile:{" "}
                  <span className="inline-block align-middle">
                    <Docviewer userdata={ambulanceData.passportphoto} />
                  </span>
                </li>
              </ul>
            </div>
            <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 hover:shadow-sm transition">
              <h2 className="text-base font-semibold text-blue-700">Contact Info</h2>
              <ul className="mt-3 space-y-2 text-sm text-gray-700">
                <li>Email: {ambulanceData.email || "N/A"}</li>
                <li>Mobile: {ambulanceData.mobile || "N/A"}</li>
                <li>Alt Mobile: {ambulanceData.alternatemobileno || "N/A"}</li>
                <li>Admin Name: {ambulanceData.adminname || "N/A"}</li>
                <li>Admin Email: {ambulanceData.adminemail || "N/A"}</li>
                <li>Admin Contact: {ambulanceData.admincontact || "N/A"}</li>
              </ul>
            </div>
          </div>

          {/* Hospital Info */}
          <div className="rounded-xl bg-white border border-blue-100 p-4 hover:shadow-sm transition">
            <h2 className="text-base font-semibold text-blue-700">Hospital Association</h2>
            <ul className="mt-3 space-y-2 text-sm text-gray-700">
              <li>Hospital Name: {ambulanceData.AmbulanceHsp?.hspregname || "N/A"}</li>
              <li>Total Ambulances: {ambulanceData.AmbulanceHsp?.totalambulance || "N/A"}</li>
              <li>In-house Doctor: {ambulanceData.AmbulanceHsp?.inhousedoctor || "N/A"}</li>
              <li>
                Description:{" "}
                {showFullDesc
                  ? ambulanceData.AmbulanceHsp?.hspdescription || "N/A"
                  : (ambulanceData.AmbulanceHsp?.hspdescription?.slice(0, 200) || "N/A") + "..."}
                {ambulanceData.AmbulanceHsp?.hspdescription?.length > 200 && (
                  <button
                    className="text-blue-600 ml-2 underline underline-offset-2 hover:text-blue-700 transition"
                    onClick={() => setShowFullDesc(!showFullDesc)}
                  >
                    {showFullDesc ? "Show Less" : "Show More"}
                  </button>
                )}
              </li>
            </ul>
          </div>

          {/* Banking */}
          <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 hover:shadow-sm transition">
            <h2 className="text-base font-semibold text-blue-700">Banking Details</h2>
            <ul className="mt-3 space-y-2 text-sm text-gray-700">
              <li>Bank Name: {ambulanceData.AmbulanceHsp?.bankname || "N/A"}</li>
              <li>Account Type: {ambulanceData.AmbulanceHsp?.accounttype || "N/A"}</li>
              <li>Account Number: {ambulanceData.AmbulanceHsp?.accountnumber || "N/A"}</li>
              <li>IFSC Code: {ambulanceData.AmbulanceHsp?.ifsccode || "N/A"}</li>
              <li>MICR Code: {ambulanceData.AmbulanceHsp?.micrcode || "N/A"}</li>
            </ul>
          </div>

          {/* Documents */}
          <div className="rounded-xl bg-white border border-blue-100 p-4 hover:shadow-sm transition">
            <h2 className="text-base font-semibold text-blue-700">Uploaded Documents</h2>
            <ul className="mt-3 space-y-2 text-sm text-gray-700">
              <li>PAN Number: {ambulanceData.ownerpanno || "N/A"}</li>
              <li>Aadhar Number: {ambulanceData.owneraadharcardno || "N/A"}</li>
            </ul>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-blue-700 mb-2">PAN Card Front</label>
                <Docviewer userdata={ambulanceData.ownerpanfront} title="PAN Front" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-blue-700 mb-2">Aadhar Card Front</label>
                <Docviewer userdata={ambulanceData.owneraadharcardfront} title="Aadhar Front" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-blue-700 mb-2">Aadhar Card Back</label>
                <Docviewer userdata={ambulanceData.owneraadharcardback} title="Aadhar Back" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-blue-700 mb-2">Hospital PAN</label>
                <Docviewer userdata={ambulanceData.AmbulanceHsp?.hsppancard} title="Hospital PAN" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-blue-700 mb-2">Registration Certificate</label>
                <Docviewer userdata={ambulanceData.AmbulanceHsp?.hspregcertificate} title="Hospital Certificate" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-blue-700 mb-2">Cancelled Cheque</label>
                <Docviewer userdata={ambulanceData.AmbulanceHsp?.cancelledcheque} title="Cancelled Cheque" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AmbulancePreview
