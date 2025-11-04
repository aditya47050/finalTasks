"use client"

import Docviewer from "@/app/patient/dashboard/components/docviewer"
import { User } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

const DoctorPreViewWithTicking = ({ doctorData }) => {
  const [showFullDesc, setShowFullDesc] = useState(false)

  const formatText = (text) =>
    text
      ? text
          .toString()
          .replace(/_/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase())
      : "N/A"
  const maskNumber = (num) => (num ? `${num}` : "N/A")

  return (
    <div className="min-h-screen font-poppins py-6 px-4 lg:px-8 bg-blue-50">
      <div className="group max-w-4xl mx-auto bg-white border border-blue-100 rounded-2xl shadow-sm hover:shadow-md transition-all">
        {/* Header */}
        <div className="relative h-36 bg-blue-500 rounded-t-2xl overflow-hidden">
          <div className="absolute bottom-4 left-4 text-white z-10">
            <h1 className="text-2xl font-semibold">
              Dr. {formatText(doctorData.firstName)} {formatText(doctorData.lastName)}
            </h1>
            <p className="text-sm opacity-90">Contact: {doctorData.mobile || "N/A"}</p>
          </div>
          {doctorData?.doctorinfo?.passportphoto ? (
            <Image
              className="absolute -bottom-1 right-4 w-24 h-24 rounded-full border-4 border-white object-cover transition-transform duration-300 group-hover:scale-105"
              src={doctorData.doctorinfo.passportphoto || "/placeholder.svg"}
              alt="Doctor Profile"
              width={96}
              height={96}
            />
          ) : (
            <User className="absolute -bottom-8 right-4 w-24 h-24 rounded-full border-4 border-white bg-blue-600 p-3 text-white transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105" />
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl bg-white border border-blue-100 p-4 hover:shadow-sm transition">
              <h2 className="text-base font-semibold text-blue-700">Personal Information</h2>
              <ul className="mt-3 space-y-2 text-sm text-gray-700">
                <li>Middle Name: {formatText(doctorData.middleName)}</li>
                <li>
                  Date of Birth:{" "}
                  {doctorData.dateOfBirth ? new Date(doctorData.dateOfBirth).toLocaleDateString("en-GB") : "N/A"}
                </li>
                <li>Gender: {formatText(doctorData.gender)}</li>
                <li>Education: {formatText(doctorData.education)}</li>
                <li>Total Experience: {formatText(doctorData.totalexperience)}</li>
                <li>
                  Registration Date:{" "}
                  {doctorData.registrationdate
                    ? new Date(doctorData.registrationdate).toLocaleDateString("en-GB")
                    : "N/A"}
                </li>
                <li>
                  Registration Renewal Date:{" "}
                  {doctorData.regrenewaldate ? new Date(doctorData.regrenewaldate).toLocaleDateString("en-GB") : "N/A"}
                </li>
              </ul>
            </div>
            <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 hover:shadow-sm transition">
              <h2 className="text-base font-semibold text-blue-700">Contact Information</h2>
              <ul className="mt-3 space-y-2 text-sm text-gray-700">
                <li>Email: {doctorData.email || "N/A"}</li>
                <li>Mobile: {doctorData.mobile || "N/A"}</li>
                <li>Alternate Mobile: {doctorData.alternatemobileno || "N/A"}</li>
                <li>Pincode: {doctorData.pincode || "N/A"}</li>
              </ul>
            </div>
          </div>

          {/* Description */}
          <div className="rounded-xl bg-white border border-blue-100 p-4 hover:shadow-sm transition">
            <h2 className="text-base font-semibold text-blue-700">Profile Description</h2>
            <p className="mt-2 text-sm text-gray-700">
              {showFullDesc
                ? doctorData.profiledescription || "N/A"
                : (doctorData.profiledescription?.slice(0, 200) || "N/A") + "..."}
              {doctorData.profiledescription?.length > 200 && (
                <button
                  className="text-blue-600 ml-2 underline underline-offset-2 hover:text-blue-700 transition"
                  onClick={() => setShowFullDesc(!showFullDesc)}
                >
                  {showFullDesc ? "Show Less" : "Show More"}
                </button>
              )}
            </p>
          </div>

          {/* Specializations */}
          <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 hover:shadow-sm transition">
            <h2 className="text-base font-semibold text-blue-700">Specializations</h2>
            <ul className="mt-3 space-y-2 text-sm text-gray-700">
              {doctorData?.specialities?.length
                ? doctorData.specialities.map((spec, i) => <li key={i}>{spec.speciality?.title}</li>)
                : "N/A"}
            </ul>
          </div>

          {/* Banking */}
          <div className="rounded-xl bg-white border border-blue-100 p-4 hover:shadow-sm transition">
            <h2 className="text-base font-semibold text-blue-700">Banking Information</h2>
            <ul className="mt-3 space-y-2 text-sm text-gray-700">
              <li>Bank Name: {doctorData.bankName || "N/A"}</li>
              <li>Account Number: {maskNumber(doctorData.accountNumber)}</li>
              <li>IFSC Code: {doctorData.ifscCode || "N/A"}</li>
              <li>MICR Code: {doctorData.micrCode || "N/A"}</li>
            </ul>
          </div>

          {/* Documents */}
          <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 hover:shadow-sm transition">
            <h2 className="text-base font-semibold text-blue-700">Uploaded Documents</h2>
            <ul className="mt-3 space-y-2 text-sm text-gray-700">
              <li>PAN Number: {maskNumber(doctorData.pancardno)}</li>
              <li>Aadhar Number: {maskNumber(doctorData.aadharcardno)}</li>
            </ul>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-blue-700 mb-2">PAN Card Front</label>
                <Docviewer userdata={doctorData.pancardfront} title="PAN Card Front" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-blue-700 mb-2">Aadhar Card Front</label>
                <Docviewer userdata={doctorData.aadharcardfront} title="Aadhar Front" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-blue-700 mb-2">Aadhar Card Back</label>
                <Docviewer userdata={doctorData.aadharcardback} title="Aadhar Back" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-blue-700 mb-2">Degree Certificate</label>
                <Docviewer userdata={doctorData.degreecertificate} title="Degree Certificate" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-blue-700 mb-2">Registration Certificate</label>
                <Docviewer userdata={doctorData.registrationcertificate} title="Registration Certificate" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-blue-700 mb-2">Speciality Certificate</label>
                <Docviewer userdata={doctorData.specialitydegreecertificate} title="Speciality Certificate" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorPreViewWithTicking
