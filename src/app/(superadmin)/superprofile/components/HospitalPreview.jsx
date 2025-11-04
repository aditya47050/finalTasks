"use client"
import Image from "next/image"
import Docviewer from "@/app/patient/dashboard/components/docviewer"
import { Building2 } from "lucide-react"

const HospitalPreview = ({ hospitalData = {}, onSubmit, onPayment, onReferPatient, isLoading = false }) => {
  // Helper for showing array or comma-separated
  const formatList = (v) => (Array.isArray(v) ? v.join(", ") : v ? v.toString() : "-")
  const formatText = (text) => {
    if (!text) return "N/A" // Handle undefined or null values
    return text
      .toString() // Convert to string in case it's a number
      .replace(/_/g, " ") // Replace underscores with spaces
      .replace(/\b\w/g, (char) => char.toUpperCase()) // Capitalize first letter of each word
  }
  return (
    <div className="min-h-screen overflow-auto font-poppins xs:py-4 lg:py-8 lg:px-8 bg-blue-50">
      <div className="group max-w-4xl mx-auto bg-white border border-blue-100 rounded-2xl shadow-sm hover:shadow-md transition-all">
        {/* Header */}
        <div className="relative h-36 bg-blue-500 rounded-t-2xl overflow-hidden">
          <div className="absolute lg:bottom-4 left-4 text-white z-10">
            <h1 className="text-2xl font-semibold">{formatText(hospitalData?.hspInfo.regname)}</h1>
            <p className="text-sm opacity-90">Contact: {hospitalData?.mobile || "N/A"}</p>
          </div>
          {hospitalData?.hspdetails?.hsplogo ? (
            <Image
              className="absolute -bottom-8 right-4 w-24 h-24 rounded-full border-4 border-white object-cover transition-transform duration-300 group-hover:scale-105"
              src={hospitalData?.hspdetails?.hsplogo || "/placeholder.svg"}
              alt="Hospital Logo"
              width={96}
              height={96}
            />
          ) : (
            <Building2 className="absolute -bottom-8 right-4 w-24 h-24 rounded-full border-4 border-white bg-blue-600 p-3 text-white transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105" />
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Basic Information */}
            <div className="rounded-xl bg-white border border-blue-100 p-4 hover:shadow-sm transition">
              <h2 className="text-base font-semibold text-blue-700">Basic Information</h2>
              <ul className="mt-3 space-y-2 text-sm text-gray-700">
                <li className="flex justify-between">
                  <span className="font-medium">Registration No:</span>
                  <span>{hospitalData?.hspInfo.hspregno || "N/A"}</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium">Registration Date:</span>
                  <span>{new Date(hospitalData?.hspdetails.hspregdate).toLocaleDateString("en-GB") || "N/A"}</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium">Category:</span>
                  <span>{formatList(hospitalData?.hspInfo?.hspcategory[0]?.hspcategory.title)}</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium">Mobile:</span>
                  <span>{hospitalData?.mobile || "N/A"}</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium">Email:</span>
                  <span>{hospitalData?.email || "N/A"}</span>
                </li>
              </ul>
            </div>

            {/* Address Information */}
            <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 hover:shadow-sm transition">
              <h2 className="text-base font-semibold text-blue-700">Address Details</h2>
              <ul className="mt-3 space-y-2 text-sm text-gray-700">
                <li className="flex justify-between items-start gap-4">
                  <span className="font-medium">Full Address:</span>
                  <span className="text-right whitespace-pre-line flex-1">
                    {hospitalData?.hspcontact.address || "N/A"}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium">City:</span>
                  <span>{hospitalData?.hspcontact.city || "N/A"}</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium">State:</span>
                  <span>{hospitalData?.hspcontact.state || "N/A"}</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium">District:</span>
                  <span>{hospitalData?.hspcontact.dist || "N/A"}</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium">Taluka:</span>
                  <span>{hospitalData?.hspcontact.taluka || "N/A"}</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium">Pincode:</span>
                  <span>{hospitalData?.hspcontact.pincode || "N/A"}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Services & Facilities */}
          <div className="rounded-xl bg-white border border-blue-100 p-4 hover:shadow-sm transition">
            <h2 className="text-base font-semibold text-blue-700">Services & Facilities</h2>
            <div className="mt-3 space-y-2 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Home Healthcare</span>
                <span>{hospitalData?.hspInfo.homehealthcare ? "Yes" : "No"}</span>
              </div>
              <div className="flex justify-between">
                <span>Online Consultation</span>
                <span>{hospitalData?.hspInfo.onlineconsultation ? "Yes" : "No"}</span>
              </div>
              <div className="flex justify-between">
                <span>Pharmacy</span>
                <span>{hospitalData?.hspInfo.pharmacy ? "Yes" : "No"}</span>
              </div>
              <div className="flex justify-between">
                <span>Pathology</span>
                <span>{hospitalData?.hspInfo.pathology ? "Yes" : "No"}</span>
              </div>
              <div className="flex justify-between">
                <span>Diagnostic Services</span>
                <span>{hospitalData?.hspInfo.diagnosticservices ? "Yes" : "No"}</span>
              </div>
              <div className="flex justify-between">
                <span>In-House Canteen</span>
                <span>{hospitalData?.hspInfo.inhousecanteen ? "Yes" : "No"}</span>
              </div>
            </div>
            <div className="mt-3 space-y-2 text-sm text-gray-700">
              <p className="font-medium text-blue-700">Cashless Services:</p>
              <p>{formatList(hospitalData?.hspInfo.cashlessservices)}</p>
              <p className="font-medium text-blue-700 mt-3">Government Schemes:</p>
              <p>{formatList(hospitalData?.hspInfo.governmentschemes)}</p>
            </div>
          </div>

          {/* Certifications & Banking */}
          <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 hover:shadow-sm transition">
            <h2 className="text-base font-semibold text-blue-700">Certifications & Banking</h2>
            <ul className="mt-3 space-y-2 text-sm text-gray-700">
              <li className="flex justify-between">
                <span>NABH/NABL Approved:</span>
                <span>{hospitalData?.hspdetails.nabhnablapproved || "N/A"}</span>
              </li>
              <li className="flex justify-between">
                <span>NABH/NABL Certificate:</span>
                {hospitalData?.hspdetails.nabhnablcertificate && (
                  <Docviewer userdata={hospitalData?.hspdetails.nabhnablcertificate} />
                )}
              </li>
              <li className="flex justify-between">
                <span>PAN Card Number:</span>
                <span>{hospitalData?.hspdetails.pancardno || "N/A"}</span>
              </li>
              <li className="flex justify-between">
                <span>PAN Card Document:</span>
                {hospitalData?.hspdetails.pancardimg && <Docviewer userdata={hospitalData?.hspdetails.pancardimg} />}
              </li>
              <li className="flex justify-between">
                <span>Bank Name:</span>
                <span>{hospitalData?.hspdetails.bankname || "N/A"}</span>
              </li>
              <li className="flex justify-between">
                <span>Account Number:</span>
                <span>{hospitalData?.hspdetails.bankaccountno || "N/A"}</span>
              </li>
              <li className="flex justify-between">
                <span>IFSC Code:</span>
                <span>{hospitalData?.hspdetails.ifsccode || "N/A"}</span>
              </li>
              <li className="flex justify-between">
                <span>Account Type:</span>
                <span>{hospitalData?.hspdetails.accounttype || "N/A"}</span>
              </li>
              <li className="flex justify-between">
                <span>Branch Address:</span>
                <span>{hospitalData?.hspdetails.branchaddress || "N/A"}</span>
              </li>
            </ul>
          </div>

          {/* Reception Contact */}
          <div className="rounded-xl bg-white border border-blue-100 p-4 hover:shadow-sm transition">
            <h2 className="text-base font-semibold text-blue-700">Reception Contact</h2>
            <ul className="mt-3 space-y-2 text-sm text-gray-700">
              <li className="flex justify-between">
                <span>Reception Contact 1:</span>
                <span>{hospitalData?.hspcontact.receptioncontact1 || "N/A"}</span>
              </li>
              <li className="flex justify-between">
                <span>Reception Email:</span>
                <span>{hospitalData?.hspcontact.receptionemail || "N/A"}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HospitalPreview
