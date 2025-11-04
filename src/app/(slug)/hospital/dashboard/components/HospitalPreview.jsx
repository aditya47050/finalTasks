"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Docviewer from "@/app/patient/dashboard/components/docviewer";
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CreditCard,
  FileText,
  Stethoscope,
  Ambulance,
  Shield,
  Banknote,
  ExternalLink,
} from "lucide-react"

const HospitalPreview = ({ hospitalData = {}, onSubmit, onPayment, onReferPatient, isLoading = false }) => {
  // Helper for showing array or comma-separated
  const formatList = (v) => (Array.isArray(v) ? v.join(", ") : v ? v.toString() : "-")

  const InfoItem = ({ icon: Icon, label, value, isLink = false, href = null }) => (
    <div className="flex  items-start gap-3 py-2">
      <Icon className="w-4 h-4 mt-1 text-muted-foreground flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        {isLink && href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            View Document <ExternalLink className="w-3 h-3" />
          </a>
        ) : (
          <p className="text-sm font-medium break-words">{value || "-"}</p>
        )}
      </div>
    </div>
  )
  const formatText = (text) => {
    if (!text) return "N/A"; // Handle undefined or null values
    return text
      .toString() // Convert to string in case it's a number
      .replace(/_/g, " ") // Replace underscores with spaces
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
  };

  const ServiceBadge = ({ service, available }) => (
    <Badge variant={available === "Yes" || available === true ? "default" : "secondary"} className="text-xs">
      {service}: {available === true || available === "Yes" ? "Available" : available || "No"}
    </Badge>
  )

  return (
  <div className="min-h-screen overflow-auto font-poppins xs:py-4 lg:py-8 lg:px-8">
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-500 h-40 relative">
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="absolute lg:bottom-4 left-4 text-white z-10">
          <h1 className="text-2xl font-semibold">
            {formatText(hospitalData?.regname)}
          </h1>
          <p className="text-sm">
            Contact: {hospitalData?.mobile || "N/A"}
          </p>
        </div>
        {hospitalData?.hsplogo ? (
          <Image
            className="absolute -bottom-10 right-4 w-28 h-28 rounded-full border-4 border-white object-cover"
            src={hospitalData?.hsplogo}
            alt="Hospital Logo"
            width={400}
            height={400}
          />
        ) : (
          <Building2
            className="absolute -bottom-10 right-4 w-28 h-28 rounded-full border-4 border-white object-cover bg-blue-600 p-4"
            color="#fff"
          />
        )}
      </div>

      {/* Profile Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Basic Information
            </h2>
            <ul className="mt-4 space-y-3">
              <li className="flex justify-between">
                <span className="font-medium text-gray-600">Registration No:</span>
                <span>{hospitalData?.hspregno || "N/A"}</span>
              </li>
              <li className="flex justify-between">
                <span className="font-medium text-gray-600">Registration Date:</span>
                <span>{new Date(hospitalData?.hspregdate).toLocaleDateString(
                          "en-GB"
                        ) || "N/A"}</span>
              </li>
              <li className="flex justify-between">
                <span className="font-medium text-gray-600">Category:</span>
                <span>{formatList(hospitalData?.hspcategory)}</span>
              </li>
              <li className="flex justify-between">
                <span className="font-medium text-gray-600">Mobile:</span>
                <span>{hospitalData?.mobile || "N/A"}</span>
              </li>
              <li className="flex justify-between">
                <span className="font-medium text-gray-600">Email:</span>
                <span>{hospitalData?.email || "N/A"}</span>
              </li>
            </ul>
          </div>

          {/* Address Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Address Details
            </h2>
            <ul className="mt-4 space-y-3">
              <li className="flex justify-between items-start gap-4">
                <span className="font-medium text-gray-600">Full Address:</span>
                <span className="text-right whitespace-pre-line flex-1">
                  {hospitalData?.address || "N/A"}
                </span>
              </li>
              <li className="flex justify-between">
                <span className="font-medium text-gray-600">City:</span>
                <span>{hospitalData?.city || "N/A"}</span>
              </li>
              <li className="flex justify-between">
                <span className="font-medium text-gray-600">State:</span>
                <span>{hospitalData?.state || "N/A"}</span>
              </li>
              <li className="flex justify-between">
                <span className="font-medium text-gray-600">District:</span>
                <span>{hospitalData?.dist || "N/A"}</span>
              </li>
              <li className="flex justify-between">
                <span className="font-medium text-gray-600">Taluka:</span>
                <span>{hospitalData?.taluka || "N/A"}</span>
              </li>
              <li className="flex justify-between">
                <span className="font-medium text-gray-600">Pincode:</span>
                <span>{hospitalData?.pincode || "N/A"}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Services & Facilities */}
<div className="mt-8">
  <h2 className="text-xl font-semibold text-gray-800">Services & Facilities</h2>

  <div className="mt-4 space-y-1">
    <div className="flex justify-between">
      <span className="font-medium text-gray-600">Home Healthcare</span>
      <span>{hospitalData?.homehealthcare ? "Yes" : "No"}</span>
    </div>
    <div className="flex justify-between">
      <span className="font-medium text-gray-600">Online Consultation</span>
      <span>{hospitalData?.onlineconsultation ? "Yes" : "No"}</span>
    </div>
    <div className="flex justify-between">
      <span className="font-medium text-gray-600">Pharmacy</span>
      <span>{hospitalData?.pharmacy ? "Yes" : "No"}</span>
    </div>
    <div className="flex justify-between">
      <span className="font-medium text-gray-600">Pathology</span>
      <span>{hospitalData?.pathology ? "Yes" : "No"}</span>
    </div>
    <div className="flex justify-between">
      <span className="font-medium text-gray-600">Diagnostic Services</span>
      <span>{hospitalData?.diagnosticservices ? "Yes" : "No"}</span>
    </div>
    <div className="flex justify-between">
      <span className="font-medium text-gray-600">In-House Canteen</span>
      <span>{hospitalData?.inhousecanteen ? "Yes" : "No"}</span>
    </div>
  </div>

  <div className="mt-4 space-y-2">
    <p className="text-sm font-medium text-gray-600">Cashless Services:</p>
    <p className="text-sm">{formatList(hospitalData?.cashlessservices)}</p>

    <p className="text-sm font-medium text-gray-600 mt-3">Government Schemes:</p>
    <p className="text-sm">{formatList(hospitalData?.governmentschemes)}</p>
  </div>
</div>


        {/* Certifications & Banking */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800">Certifications & Banking</h2>
          <ul className="mt-4 space-y-3">
            <li className="flex justify-between">
              <span className="font-medium text-gray-600">NABH/NABL Approved:</span>
              <span>{hospitalData?.nabhnablapproved || "N/A"}</span>
            </li>
            <li className="flex justify-between">
              <span className="font-medium text-gray-600">NABH/NABL Certificate:</span>
              {hospitalData?.nabhnablcertificate && (
                <Docviewer userdata={hospitalData?.nabhnablcertificate} />
              )}
            </li>
            <li className="flex justify-between">
              <span className="font-medium text-gray-600">PAN Card Number:</span>
              <span>{hospitalData?.pancardno || "N/A"}</span>
            </li>
            <li className="flex justify-between">
              <span className="font-medium text-gray-600">PAN Card Document:</span>
              {hospitalData?.pancardimg && <Docviewer userdata={hospitalData?.pancardimg} />}
            </li>
            <li className="flex justify-between">
              <span className="font-medium text-gray-600">Bank Name:</span>
              <span>{hospitalData?.bankname || "N/A"}</span>
            </li>
            <li className="flex justify-between">
              <span className="font-medium text-gray-600">Account Number:</span>
              <span>{hospitalData?.bankaccountno || "N/A"}</span>
            </li>
            <li className="flex justify-between">
              <span className="font-medium text-gray-600">IFSC Code:</span>
              <span>{hospitalData?.ifsccode || "N/A"}</span>
            </li>
            <li className="flex justify-between">
              <span className="font-medium text-gray-600">Account Type:</span>
              <span>{hospitalData?.accounttype || "N/A"}</span>
            </li>
            <li className="flex justify-between">
              <span className="font-medium text-gray-600">Branch Address:</span>
              <span>{hospitalData?.branchaddress || "N/A"}</span>
            </li>
          </ul>
        </div>

        {/* Reception Contact */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800">Reception Contact</h2>
          <ul className="mt-4 space-y-3">
            <li className="flex justify-between">
              <span className="font-medium text-gray-600">Reception Contact 1:</span>
              <span>{hospitalData?.receptioncontact1 || "N/A"}</span>
            </li>
            <li className="flex justify-between">
              <span className="font-medium text-gray-600">Reception Email:</span>
              <span>{hospitalData?.receptionemail || "N/A"}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

}

export default HospitalPreview
