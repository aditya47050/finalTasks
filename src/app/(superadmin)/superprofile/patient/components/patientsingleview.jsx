"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Users,
  Heart,
  Calendar,
  Bed,
  Ambulance,
  DollarSign,
  Star,
  Home,
  Activity,
  FileText,
  Building,
  Shield,
  Briefcase,
  Camera,
  Stethoscope,
  Receipt,
  Award,
  UserCheck,
  AlertTriangle,
  Download,
  Eye,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const PatientSingleView = ({ userdata }) => {
  const formatText = (text) => {
    if (!text) return "N/A";
    return text
      .toString()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return "N/A";
    return `₹${Number.parseFloat(amount).toLocaleString("en-IN")}`;
  };

  const DocumentViewer = ({ src, alt = "Document" }) => {
    if (!src)
      return <span className="text-gray-400 text-sm">Not provided</span>;

    return (
      <div className="relative group">
        <Image
          src={src || "/placeholder.svg"}
          alt={alt}
          width={120}
          height={120}
          className="rounded-xl border-2 border-gray-200 cursor-pointer hover:border-blue-400 transition-all duration-300 shadow-sm hover:shadow-lg object-cover"
          onClick={() => window.open(src, "_blank")}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-xl transition-all duration-300 flex items-center justify-center">
          <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>
    );
  };

  const InfoCard = ({ title, children, icon: Icon, className = "" }) => (
    <Card
      className={`h-full rounded-xl border-0 shadow-md hover:shadow-lg transition-all duration-300 ${className}`}
    >
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-800">
          {Icon && <Icon className="w-5 h-5 text-blue-600" />}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );

  const DataRow = ({ label, value, type = "text" }) => {
    const renderValue = () => {
      if (label.toLowerCase() === "age" && typeof value === "string") {
        return (
          <span className="ml-auto text-sm font-medium text-gray-700">
            {value}
          </span>
        )
      }
      switch (type) {
        case "boolean":
          return (
            <Badge
              variant={value ? "default" : "secondary"}
              className={`ml-auto rounded-xl ${value
                  ? "bg-green-100 text-green-800 hover:bg-green-200"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
            >
              {value ? "Yes" : "No"}
            </Badge>
          );
        case "date":
          return (
            <span className="ml-auto text-sm font-medium text-gray-700">
              {formatDate(value)}
            </span>
          );
        case "currency":
          return (
            <span className="ml-auto font-semibold text-green-600">
              {formatCurrency(value)}
            </span>
          );
        case "badge":
          return (
            <Badge
              variant="outline"
              className="ml-auto rounded-xl border-blue-200 text-blue-700 bg-blue-50"
            >
              {formatText(value)}
            </Badge>
          );
        default:
          return (
            <span className="ml-auto text-sm font-medium text-gray-700">
              {formatText(value)}
            </span>
          );
      }
    };

    return (
      <div className="flex justify-between items-center py-2 px-1 hover:bg-gray-50 rounded-lg transition-colors duration-200">
        <span className="font-medium text-gray-600 text-sm">{label}:</span>
        {renderValue()}
      </div>
    );
  };

  const StatusBadge = ({ status }) => {
    const getStatusColor = (status) => {
      switch (status?.toLowerCase()) {
        case "approved":
        case "success":
        case "completed":
          return "bg-green-100 text-green-800 border-green-200";
        case "pending":
          return "bg-yellow-100 text-yellow-800 border-yellow-200";
        case "rejected":
        case "cancelled":
        case "failed":
          return "bg-red-100 text-red-800 border-red-200";
        default:
          return "bg-gray-100 text-gray-800 border-gray-200";
      }
    };

    return (
      <Badge className={`rounded-xl ${getStatusColor(status)}`}>
        {formatText(status)}
      </Badge>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
        {/* Enhanced Profile Header */}
<div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-xl mx-4 mt-4 overflow-hidden shadow-xl">
  <div className="absolute inset-0 bg-black/20"></div>

  {/* Header Content */}
  <div className="relative z-10 p-8 pb-20">
    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
      <div className="text-white flex-1">
        {/* Row 1: Name */}
        <h1 className="text-3xl lg:text-4xl font-bold mb-3">
          {formatText(userdata.firstName)}{" "}
          {formatText(userdata.lastName)}
        </h1>

        {/* Row 2: Contact Info */}
        <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
          <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-xl">
            <Phone className="w-4 h-4" />
            <span>{userdata.mobile || "N/A"}</span>
          </div>
          <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-xl">
            <Mail className="w-4 h-4" />
            <span>{userdata.email || "N/A"}</span>
          </div>
          <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-xl">
            <MapPin className="w-4 h-4" />
            <span>
              {userdata.city || "N/A"}, {userdata.state || "N/A"}
            </span>
          </div>
        </div>

        {/* Row 3: Badges */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Badge className="bg-white/20 text-white border-white/30 rounded-xl">
            ID: {userdata.id}
          </Badge>
          <Badge className="bg-white/20 text-white border-white/30 rounded-xl">
            Profile {userdata.profileComplete ? "Complete" : "Incomplete"}
          </Badge>
          <Badge className="bg-white/20 text-white border-white/30 rounded-xl">
            Role: {userdata.role}
          </Badge>
        </div>

        {/* Row 4: Member Since + Buttons */}
        <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3">
          <Badge className="bg-white/20 text-white border-white/30 rounded-xl">
            Member since{" "}
            {new Date(userdata?.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric"
            })}
          </Badge>

          <Link href={`/superprofile/patient/${userdata.id}/healthcard`} className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-white text-blue-600 hover:bg-gray-100 rounded-xl shadow-lg">
              <Award className="w-4 h-4 mr-2" />
              Health Card
            </Button>
          </Link>

          <Button className="w-full sm:w-auto bg-white/20 text-white hover:bg-white/30 border border-white/30 rounded-xl">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

{/* Profile Photo */}
<div className="flex-shrink-0 flex items-center justify-center lg:mt-6 mt-6">
  {userdata.passportPhoto ? (
    <Image
      className="w-32 h-32 lg:w-36 lg:h-36 rounded-xl border-4 border-white object-cover shadow-xl"
      src={userdata.passportPhoto || "/placeholder.svg"}
      alt="User Profile"
      width={144}
      height={144}
    />
  ) : (
    <div className="w-32 h-32 lg:w-36 lg:h-36 rounded-xl border-4 border-white bg-blue-600 flex items-center justify-center shadow-xl">
      <User className="w-16 h-16 lg:w-18 lg:h-18 text-white" />
    </div>
  )}
</div>

    </div>
  </div>
</div>


            {/* Main Content */}
            <div className="p-4 pt-20">
              <Tabs defaultValue="personal" className="w-full">
                <div className="mb-6 overflow-x-auto">
                  <TabsList className="grid w-full grid-cols-6 lg:grid-cols-12 min-w-max rounded-xl bg-white shadow-md p-1">
                    <TabsTrigger
                      value="personal"
                      className="rounded-xl text-xs lg:text-sm"
                    >
                      Personal
                    </TabsTrigger>
                    <TabsTrigger
                      value="contact"
                      className="rounded-xl text-xs lg:text-sm"
                    >
                      Contact
                    </TabsTrigger>
                    <TabsTrigger
                      value="documents"
                      className="rounded-xl text-xs lg:text-sm"
                    >
                      Documents
                    </TabsTrigger>
                    <TabsTrigger
                      value="medical"
                      className="rounded-xl text-xs lg:text-sm"
                    >
                      Medical
                    </TabsTrigger>
                    <TabsTrigger
                      value="family"
                      className="rounded-xl text-xs lg:text-sm"
                    >
                      Family
                    </TabsTrigger>
                    <TabsTrigger
                      value="financial"
                      className="rounded-xl text-xs lg:text-sm"
                    >
                      Financial
                    </TabsTrigger>
                    <TabsTrigger
                      value="appointments"
                      className="rounded-xl text-xs lg:text-sm"
                    >
                      Appointments
                    </TabsTrigger>
                    <TabsTrigger
                      value="bookings"
                      className="rounded-xl text-xs lg:text-sm"
                    >
                      Bookings
                    </TabsTrigger>
                    <TabsTrigger
                      value="payments"
                      className="rounded-xl text-xs lg:text-sm"
                    >
                      Payments
                    </TabsTrigger>
                    <TabsTrigger
                      value="reviews"
                      className="rounded-xl text-xs lg:text-sm"
                    >
                      Reviews
                    </TabsTrigger>
                    <TabsTrigger
                      value="fundraising"
                      className="rounded-xl text-xs lg:text-sm"
                    >
                      Fundraising
                    </TabsTrigger>
                    <TabsTrigger
                      value="eseva"
                      className="rounded-xl text-xs lg:text-sm"
                    >
                      E-Seva
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Personal Information Tab */}
                <TabsContent value="personal" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <InfoCard
                      title="Basic Information"
                      icon={User}
                      className="bg-gradient-to-br from-blue-50 to-indigo-50"
                    >
                      <DataRow label="First Name" value={userdata.firstName} />
                      <DataRow label="Middle Name" value={userdata.middleName} />
                      <DataRow label="Last Name" value={userdata.lastName} />
                      <DataRow
                        label="Date of Birth"
                        value={userdata.dateOfBirth}
                        type="date"
                      />
                      <DataRow
                        label="Gender"
                        value={userdata.gender}
                        type="badge"
                      />
                      <DataRow
                        label="Blood Group"
                        value={userdata.bloodgroup}
                        type="badge"
                      />
                      <DataRow
                        label="Marital Status"
                        value={userdata.maritalStatus}
                        type="badge"
                      />
                      <DataRow
                        label="Religion"
                        value={userdata.religion}
                        type="badge"
                      />
                      <DataRow
                        label="Education Level"
                        value={userdata.educationlevel}
                        type="badge"
                      />
                      <DataRow label="Occupation" value={userdata.occupation} />
                    </InfoCard>

                    <InfoCard
                      title="Personal Preferences"
                      icon={Heart}
                      className="bg-gradient-to-br from-green-50 to-emerald-50"
                    >
                      <DataRow
                        label="Organ Donation"
                        value={userdata.organDonation}
                        type="boolean"
                      />
                      <DataRow
                        label="Profile Complete"
                        value={userdata.profileComplete}
                        type="boolean"
                      />
                      <DataRow label="Role" value={userdata.role} type="badge" />
                      <DataRow
                        label="Created At"
                        value={userdata.createdAt}
                        type="date"
                      />
                      <DataRow
                        label="Updated At"
                        value={userdata.updatedAt}
                        type="date"
                      />
                    </InfoCard>

                    <InfoCard
                      title="Security Information"
                      icon={Shield}
                      className="bg-gradient-to-br from-purple-50 to-pink-50"
                    >
                      <DataRow
                        label="Reset Token"
                        value={userdata.resetToken ? "Set" : "Not Set"}
                        type="boolean"
                      />
                      <DataRow
                        label="Reset Token Expiry"
                        value={userdata.resetTokenExpiration}
                        type="date"
                      />
                      <DataRow label="Provider" value={userdata.provider} />
                      <DataRow label="Coverage" value={userdata.coverage} />
                      <DataRow label="Copay" value={userdata.copay} />
                    </InfoCard>
                  </div>
                </TabsContent>

                {/* Contact Information Tab */}
                <TabsContent value="contact" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <InfoCard
                      title="Primary Contact"
                      icon={Phone}
                      className="bg-gradient-to-br from-blue-50 to-cyan-50"
                    >
                      <DataRow label="Email" value={userdata.email} />
                      <DataRow label="Mobile" value={userdata.mobile} />
                      <DataRow
                        label="Alternate Mobile"
                        value={userdata.alternateMobile}
                      />
                    </InfoCard>

                    <InfoCard
                      title="Address Information"
                      icon={MapPin}
                      className="bg-gradient-to-br from-green-50 to-teal-50"
                    >
                      <DataRow
                        label="Present Address"
                        value={userdata.presentAddress}
                      />
                      <DataRow label="Permanent Address" value={userdata.permanentAddress} />
                      <DataRow label="City" value={userdata.city} />
                      <DataRow label="State" value={userdata.state} />
                      <DataRow label="District" value={userdata.district} />
                      <DataRow label="Taluka" value={userdata.taluka} />
                      <DataRow label="Pincode" value={userdata.pincode} />
                    </InfoCard>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <InfoCard
                      title="Emergency Contact"
                      icon={UserCheck}
                      className="bg-gradient-to-br from-orange-50 to-red-50"
                    >
                      <DataRow
                        label="Contact Person Name"
                        value={userdata.contactPersonName}
                      />
                      <DataRow
                        label="Contact Person Relation"
                        value={userdata.contactPersonRelation}
                      />
                      <DataRow
                        label="Contact Person Mobile"
                        value={userdata.contactmanaadharNumber}
                      />
                    </InfoCard>

                    <InfoCard
                      title="Company Information"
                      icon={Building}
                      className="bg-gradient-to-br from-purple-50 to-indigo-50"
                    >
                      <DataRow
                        label="Company Registered"
                        value={userdata.isCompanyRegistered}
                        type="boolean"
                      />
                      <DataRow
                        label="Company Registration No"
                        value={userdata.companyRegistrationNo}
                      />
                      <DataRow
                        label="Employee ID Card"
                        value={
                          userdata.employeeIdCard ? "Uploaded" : "Not Uploaded"
                        }
                        type="boolean"
                      />
                    </InfoCard>
                  </div>
                </TabsContent>

                {/* Documents Tab */}
                <TabsContent value="documents" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <InfoCard
                      title="Passport Photo"
                      icon={Camera}
                      className="bg-gradient-to-br from-blue-50 to-indigo-50"
                    >
                      <div className="text-center">
                        <DocumentViewer
                          src={userdata.passportPhoto}
                          alt="Passport Photo"
                        />
                      </div>
                    </InfoCard>

                    <InfoCard
                      title="Aadhar Card"
                      icon={FileText}
                      className="bg-gradient-to-br from-green-50 to-emerald-50"
                    >
                      <DataRow
                        label="Aadhar Number"
                        value={userdata.aadharCardNumber}
                      />
                      <div className="space-y-3 mt-4">
                        <div>
                          <span className="text-sm font-medium text-gray-600 block mb-2">
                            Front:
                          </span>
                          <DocumentViewer
                            src={userdata.aadharCardFront}
                            alt="Aadhar Front"
                          />
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-600 block mb-2">
                            Back:
                          </span>
                          <DocumentViewer
                            src={userdata.aadharCardBack}
                            alt="Aadhar Back"
                          />
                        </div>
                      </div>
                    </InfoCard>

                    <InfoCard
                      title="ABHA Card"
                      icon={Activity}
                      className="bg-gradient-to-br from-purple-50 to-pink-50"
                    >
                      <DataRow
                        label="ABHA Card"
                        value={userdata.abhacard}
                        type="boolean"
                      />
                      <DataRow
                        label="ABHA Number"
                        value={userdata.abhaCardNumber}
                      />
                      <div className="mt-4">
                        <span className="text-sm font-medium text-gray-600 block mb-2">
                          Document:
                        </span>
                        <DocumentViewer
                          src={userdata.abhaCardFront}
                          alt="ABHA Card"
                        />
                      </div>
                    </InfoCard>

                    <InfoCard
                      title="PAN Card"
                      icon={Receipt}
                      className="bg-gradient-to-br from-yellow-50 to-orange-50"
                    >
                      <DataRow
                        label="Has PAN Card"
                        value={userdata.hasPanCard}
                        type="boolean"
                      />
                      <DataRow label="PAN Number" value={userdata.panCardNumber} />
                      <div className="mt-4">
                        <span className="text-sm font-medium text-gray-600 block mb-2">
                          Document:
                        </span>
                        <DocumentViewer src={userdata.panCard} alt="PAN Card" />
                      </div>
                    </InfoCard>

                    <InfoCard
                      title="Ayushman Card"
                      icon={Shield}
                      className="bg-gradient-to-br from-teal-50 to-cyan-50"
                    >
                      <DataRow
                        label="Ayushman Card"
                        value={userdata.ayushmancard}
                        type="boolean"
                      />
                      <DataRow
                        label="Ayushman Number"
                        value={userdata.ayushmanCard}
                      />
                      <div className="mt-4">
                        <span className="text-sm font-medium text-gray-600 block mb-2">
                          Document:
                        </span>
                        <DocumentViewer
                          src={userdata.ayushmanCardFront}
                          alt="Ayushman Card"
                        />
                      </div>
                    </InfoCard>

                    <InfoCard
                      title="Ration Card"
                      icon={FileText}
                      className="bg-gradient-to-br from-red-50 to-pink-50"
                    >
                      <DataRow
                        label="Ration Card"
                        value={userdata.rationcard}
                        type="boolean"
                      />
                      <DataRow
                        label="Ration Number"
                        value={userdata.rationCardNumber}
                      />
                      <DataRow
                        label="Ration Type"
                        value={userdata.rationcardtype}
                      />
                      <div className="space-y-3 mt-4">
                        <div>
                          <span className="text-sm font-medium text-gray-600 block mb-2">
                            Front:
                          </span>
                          <DocumentViewer
                            src={userdata.rationCardFront}
                            alt="Ration Front"
                          />
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-600 block mb-2">
                            Back:
                          </span>
                          <DocumentViewer
                            src={userdata.rationCardBack}
                            alt="Ration Back"
                          />
                        </div>
                      </div>
                    </InfoCard>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoCard
                      title="Income Certificate"
                      icon={DollarSign}
                      className="bg-gradient-to-br from-green-50 to-emerald-50"
                    >
                      <DataRow
                        label="Has Income Certificate"
                        value={userdata.income}
                        type="boolean"
                      />
                      <DataRow
                        label="Income Certificate No"
                        value={userdata.incomeCertificateNo}
                      />
                      <DataRow label="Income Range" value={userdata.incomerange} />
                      <div className="mt-4">
                        <span className="text-sm font-medium text-gray-600 block mb-2">
                          Document:
                        </span>
                        <DocumentViewer
                          src={userdata.incomeCertificateimg}
                          alt="Income Certificate"
                        />
                      </div>
                    </InfoCard>

                    <InfoCard
                      title="Employee ID"
                      icon={Briefcase}
                      className="bg-gradient-to-br from-blue-50 to-indigo-50"
                    >
                      <div>
                        <span className="text-sm font-medium text-gray-600 block mb-2">
                          Employee ID Card:
                        </span>
                        <DocumentViewer
                          src={userdata.employeeIdCard}
                          alt="Employee ID"
                        />
                      </div>
                    </InfoCard>
                  </div>
                </TabsContent>

                {/* Medical Information Tab */}
                <TabsContent value="medical" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <InfoCard
                      title="Health Insurance"
                      icon={Shield}
                      className="bg-gradient-to-br from-blue-50 to-indigo-50"
                    >
                      <DataRow
                        label="Health Insurance"
                        value={userdata.healthInsurance}
                        type="boolean"
                      />
                      <DataRow
                        label="Insurance Number"
                        value={userdata.healthInsuranceNumber}
                      />
                      <div className="mt-4">
                        <span className="text-sm font-medium text-gray-600 block mb-2">
                          Document:
                        </span>
                        <DocumentViewer
                          src={userdata.healthInsuranceDocument}
                          alt="Health Insurance"
                        />
                      </div>
                    </InfoCard>

                    <InfoCard
                      title="Medical History Summary"
                      icon={Stethoscope}
                      className="bg-gradient-to-br from-green-50 to-emerald-50"
                    >
                      <DataRow
                        label="Total Medical Records"
                        value={userdata.medicalhistory?.length || 0}
                      />
                      <DataRow
                        label="Total Health Insurance"
                        value={userdata.HealthInsurance?.length || 0}
                      />
                      <DataRow
                        label="Medical History Records"
                        value={userdata.patientMedicalHistory?.length || 0}
                      />
                    </InfoCard>
                  </div>

                  {/* Detailed Medical History */}
                  {userdata.medicalhistory &&
                    userdata.medicalhistory.length > 0 && (
                      <Card className="rounded-xl border-0 shadow-md">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-xl">
                            <Heart className="w-6 h-6 text-red-500" />
                            Detailed Medical History
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {userdata.medicalhistory.map((history, index) => (
                            <div
                              key={index}
                              className="p-6 border rounded-xl mb-6 bg-gradient-to-br from-red-50 to-pink-50"
                            >
                              <div className="mb-6">
                                <h4 className="font-semibold text-xl mb-4 text-red-700 flex items-center gap-2">
                                  <Activity className="w-5 h-5" />
                                  Medical Record #{index + 1}
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                                  <DataRow
                                    label="Created At"
                                    value={history.createdAt}
                                    type="date"
                                  />
                                  <DataRow
                                    label="Updated At"
                                    value={history.updatedAt}
                                    type="date"
                                  />
                                  <DataRow
                                    label="Weight"
                                    value={
                                      history.weight
                                        ? `${history.weight} kg`
                                        : "N/A"
                                    }
                                  />
                                  <DataRow
                                    label="Pulse Rate"
                                    value={
                                      history.pulseRate
                                        ? `${history.pulseRate} bpm`
                                        : "N/A"
                                    }
                                  />
                                  <DataRow
                                    label="BP Value"
                                    value={history.bpvalue || "N/A"}
                                  />
                                  <DataRow
                                    label="Diabetes Value"
                                    value={history.diabetesvalue || "N/A"}
                                  />
                                  <DataRow
                                    label="Tuberculosis Value"
                                    value={history.tuberculosisvalue || "N/A"}
                                  />
                                  <DataRow
                                    label="Cancer Value"
                                    value={history.cancervalue || "N/A"}
                                  />
                                  <DataRow
                                    label="Thyroid Value"
                                    value={history.thyroidvalue || "N/A"}
                                  />
                                  <DataRow
                                    label="Cholesterol Value"
                                    value={history.cholesterolvalue || "N/A"}
                                  />
                                </div>
                              </div>

                              {/* Medical Conditions Grid */}
                              <div className="mb-6">
                                <h5 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                  <AlertTriangle className="w-4 h-4" />
                                  Medical Conditions:
                                </h5>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                                  {Object.entries(history).map(([key, value]) => {
                                    if (
                                      [
                                        "id",
                                        "patientId",
                                        "createdAt",
                                        "updatedAt",
                                        "diseaseDetails",
                                        "weight",
                                        "pulseRate",
                                        "bpvalue",
                                        "diabetesvalue",
                                        "tuberculosisvalue",
                                        "cancervalue",
                                        "thyroidvalue",
                                        "cholesterolvalue",
                                      ].includes(key) ||
                                      key.endsWith("value")
                                    )
                                      return null;

                                    return (
                                      <div
                                        key={key}
                                        className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm border"
                                      >
                                        <span className="text-xs font-medium text-gray-700 capitalize">
                                          {formatText(key)}
                                        </span>
                                        <Badge
                                          variant={value ? "default" : "secondary"}
                                          className={`ml-2 text-xs rounded-xl ${value
                                              ? "bg-red-100 text-red-800 hover:bg-red-200"
                                              : "bg-green-100 text-green-800 hover:bg-green-200"
                                            }`}
                                        >
                                          {value ? "Yes" : "No"}
                                        </Badge>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Disease Details */}
                              {history.diseaseDetails && (
                                <div className="mt-6">
                                  <h5 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    Disease Details:
                                  </h5>
                                  <div className="space-y-4">
                                    {Object.entries(history.diseaseDetails).map(
                                      ([conditionKey, conditionDetails]) => (
                                        <div
                                          key={conditionKey}
                                          className="p-4 bg-blue-50 rounded-xl border border-blue-200"
                                        >
                                          <h6 className="font-semibold text-blue-800 mb-3 capitalize flex items-center gap-2">
                                            <Heart className="w-4 h-4" />
                                            {formatText(conditionKey)}
                                          </h6>
                                          {typeof conditionDetails === "object" &&
                                            conditionDetails !== null ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                              {Object.entries(conditionDetails).map(
                                                ([detailKey, detailValue]) => (
                                                  <div
                                                    key={detailKey}
                                                    className="flex justify-between items-center p-2 bg-white rounded-lg"
                                                  >
                                                    <span className="font-medium text-gray-600 capitalize text-sm">
                                                      {formatText(detailKey)}:
                                                    </span>
                                                    <span className="text-gray-800 text-sm font-medium">
                                                      {typeof detailValue ===
                                                        "boolean"
                                                        ? detailValue
                                                          ? "Yes"
                                                          : "No"
                                                        : detailValue || "N/A"}
                                                    </span>
                                                  </div>
                                                )
                                              )}
                                            </div>
                                          ) : (
                                            <p className="text-sm text-gray-600 bg-white p-3 rounded-lg">
                                              {conditionDetails ||
                                                "No additional details available"}
                                            </p>
                                          )}
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    )}

                  {/* Health Insurance Details */}
                  {userdata.HealthInsurance &&
                    userdata.HealthInsurance.length > 0 && (
                      <Card className="rounded-xl border-0 shadow-md">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-xl">
                            <Shield className="w-6 h-6 text-blue-500" />
                            Health Insurance Policies
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {userdata.HealthInsurance.map((insurance, index) => (
                              <div
                                key={index}
                                className="p-6 border rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50"
                              >
                                <h5 className="font-semibold text-blue-800 mb-4">
                                  Policy #{index + 1}
                                </h5>
                                <div className="space-y-3">
                                  <DataRow
                                    label="Provider"
                                    value={insurance.provider}
                                  />
                                  <DataRow
                                    label="Policy Number"
                                    value={insurance.policyNumber}
                                  />
                                  <DataRow
                                    label="Coverage"
                                    value={insurance.coverage}
                                  />
                                  <DataRow label="Copay" value={insurance.copay} />
                                  <DataRow
                                    label="Created At"
                                    value={insurance.createdAt}
                                    type="date"
                                  />
                                  <DataRow
                                    label="Updated At"
                                    value={insurance.updatedAt}
                                    type="date"
                                  />
                                </div>
                                {insurance.document && (
                                  <div className="mt-4">
                                    <span className="text-sm font-medium text-gray-600 block mb-2">
                                      Document:
                                    </span>
                                    <DocumentViewer
                                      src={insurance.document}
                                      alt="Insurance Document"
                                    />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                </TabsContent>

                {/* Family Members Tab */}
                <TabsContent value="family" className="space-y-6">
                  <Card className="rounded-xl border-0 shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Users className="w-6 h-6 text-green-500" />
                        Family Members ({userdata.familymembers?.length || 0})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {userdata.familymembers &&
                        userdata.familymembers.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {userdata.familymembers.map((member, index) => (
                            <div
                              key={index}
                              className="p-6 border rounded-xl bg-gradient-to-br from-green-50 to-emerald-50"
                            >
                              <h4 className="font-semibold text-xl mb-4 text-green-700 flex items-center gap-2">
                                  <User className="w-5 h-5" />
  {[
    member.firstName,
    member.middleName,
    member.lastName
  ].filter(Boolean).join(" ") || "Family Member"}
                              </h4>
                              <div className="space-y-3">
                               <DataRow
  label="Full Name"
  value={[
    member.firstName,
    member.middleName,
    member.lastName
  ].filter(Boolean).join(" ") || "Family Member"}
/>

                                <DataRow
                                  label="Relation"
                                  value={member.relation}
                                  type="badge"
                                />
                                <DataRow
                                  label="Gender"
                                  value={member.gender}
                                  type="badge"
                                />
                                <DataRow label="Date of Birth" value={member.dateOfBirth} />
                                <DataRow
                                  label="Blood Group"
                                  value={member.bloodgroup}
                                  type="badge"
                                />
                                <DataRow label="Mobile" value={member.mobile} />
                                <DataRow
                                  label="Email"
                                  value={member.email}
                                  type="badge"
                                />
                                <DataRow
                                  label="Aadhar Card"
                                  value={member.aadharCardNumber}
                                />
                                <DataRow label="Address" value={member.presentAddress} />
                                <DataRow label="Pincode" value={member.pincode} />
                                <DataRow label="State" value={member.state} />
                                <DataRow label="District" value={member.district} />
                                <DataRow label="Taluka" value={member.taluka} />
                                <DataRow
                                  label="Created At"
                                  value={member.createdAt}
                                  type="date"
                                />
                                <DataRow
                                  label="Updated At"
                                  value={member.updatedAt}
                                  type="date"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                          <p className="text-gray-500 text-lg">
                            No family members added
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Financial Information Tab */}
                <TabsContent value="financial" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <InfoCard
                      title="Bank Details"
                      icon={CreditCard}
                      className="bg-gradient-to-br from-blue-50 to-indigo-50"
                    >
                      <DataRow label="Bank Name" value={userdata.bankName} />
                      <DataRow
                        label="Account Number"
                        value={userdata.accountNumber}
                      />
                      <DataRow label="IFSC Code" value={userdata.ifscCode} />
                      <DataRow label="MICR Code" value={userdata.micrCode} />
                      <DataRow
                        label="Account Type"
                        value={userdata.accountType}
                        type="badge"
                      />
                      <div className="mt-4">
                        <span className="text-sm font-medium text-gray-600 block mb-2">
                          Cancelled Cheque:
                        </span>
                        <DocumentViewer
                          src={userdata.cancelledCheque}
                          alt="Cancelled Cheque"
                        />
                      </div>
                    </InfoCard>

                    <InfoCard
                      title="Financial Summary"
                      icon={DollarSign}
                      className="bg-gradient-to-br from-green-50 to-emerald-50"
                    >
                      <DataRow
                        label="Total Payments"
                        value={userdata.Payment?.length || 0}
                      />
                      <DataRow
                        label="Total Donations Made"
                        value={userdata.donar?.length || 0}
                      />
                      <DataRow
                        label="Active Fundraisers"
                        value={userdata.fundraiser?.length || 0}
                      />
                      {userdata.Payment && userdata.Payment.length > 0 && (
                        <DataRow
                          label="Total Amount Paid"
                          value={userdata.Payment.reduce(
                            (sum, payment) =>
                              sum + Number.parseFloat(payment.amount || 0),
                            0
                          )}
                          type="currency"
                        />
                      )}
                    </InfoCard>
                  </div>
                </TabsContent>

                {/* Appointments Tab */}
                <TabsContent value="appointments" className="space-y-6">
                  <Card className="rounded-xl border-0 shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Calendar className="w-6 h-6 text-blue-500" />
                        Free Appointments (
                        {userdata.bookFreeAppointment?.length || 0})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {userdata.bookFreeAppointment &&
                        userdata.bookFreeAppointment.length > 0 ? (
                        <div className="space-y-6">
                          {userdata.bookFreeAppointment.map(
                            (appointment, index) => (
                              <div
                                key={index}
                                className="p-6 border rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50"
                              >
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-4">
                                  <h4 className="font-semibold text-xl text-blue-800">
                                    {appointment.firstName} {appointment.middleName}{" "}
                                    {appointment.lastName}
                                  </h4>
                                  <StatusBadge status={appointment.status} />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                                  <DataRow
                                    label="Mobile Number"
                                    value={appointment.mobileNumber}
                                  />
                                  <DataRow
                                    label="Email"
                                    value={appointment.email}
                                  />
                                  <DataRow
                                    label="Aadhar Number"
                                    value={appointment.aadharCardNumber}
                                  />
                                  <DataRow label="City" value={appointment.city} />
                                  <DataRow
                                    label="Pin Code"
                                    value={appointment.pinCode}
                                  />
                                  <DataRow
                                    label="Gender"
                                    value={appointment.gender}
                                    type="badge"
                                  />
                                  <DataRow
                                    label="Date of Birth"
                                    value={appointment.dateOfBirth}
                                    type="date"
                                  />
                                  <DataRow
                                    label="Preferred Date"
                                    value={appointment.preferredDate}
                                    type="date"
                                  />
                                  <DataRow
                                    label="Preferred Time"
                                    value={appointment.preferredTime}
                                  />
                                  <DataRow
                                    label="Created At"
                                    value={appointment.createdAt}
                                    type="date"
                                  />
                                  <DataRow
                                    label="Updated At"
                                    value={appointment.updatedAt}
                                    type="date"
                                  />
                                </div>

                                {appointment.category && (
                                  <div className="mb-4 p-4 bg-white rounded-xl border">
                                    <h5 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                      <FileText className="w-4 h-4" />
                                      Category:
                                    </h5>
                                    <DataRow
                                      label="Title"
                                      value={appointment.category.title}
                                    />
                                  </div>
                                )}

                                {appointment.doctor && (
                                  <div className="mb-4 p-4 bg-green-50 rounded-xl border border-green-200">
                                    <h5 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                                      <Stethoscope className="w-4 h-4" />
                                      Assigned Doctor:
                                    </h5>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                      <DataRow
                                        label="Name"
                                        value={`${appointment.doctor.firstName} ${appointment.doctor.lastName}`}
                                      />
                                      <DataRow
                                        label="Email"
                                        value={appointment.doctor.email}
                                      />
                                      <DataRow
                                        label="Mobile"
                                        value={appointment.doctor.mobile}
                                      />
                                      <DataRow
                                        label="Experience"
                                        value={appointment.doctor.totalexperience}
                                      />
                                    </div>
                                  </div>
                                )}

                                {appointment.notes && (
                                  <div className="mb-4">
                                    <span className="font-semibold text-gray-800 block mb-2">
                                      Notes:
                                    </span>
                                    <p className="text-sm p-3 bg-white rounded-xl border">
                                      {appointment.notes}
                                    </p>
                                  </div>
                                )}

                                {appointment.doctorNotes && (
                                  <div>
                                    <span className="font-semibold text-gray-800 block mb-2">
                                      Doctor Notes:
                                    </span>
                                    <p className="text-sm p-3 bg-green-50 rounded-xl border border-green-200">
                                      {appointment.doctorNotes}
                                    </p>
                                  </div>
                                )}
                              </div>
                            )
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                          <p className="text-gray-500 text-lg">
                            No appointments found
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Bookings Tab */}
                <TabsContent value="bookings" className="space-y-6">
                  {/* Bed Bookings */}
                  <Card className="rounded-xl border-0 shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Bed className="w-6 h-6 text-purple-500" />
                        Bed Bookings ({userdata.bedbooking?.length || 0})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {userdata.bedbooking && userdata.bedbooking.length > 0 ? (
                        <div className="space-y-6">
                          {userdata.bedbooking.map((booking, index) => (
                            <div
                              key={index}
                              className="p-6 border rounded-xl bg-gradient-to-br from-purple-50 to-pink-50"
                            >
                              <h4 className="font-semibold text-xl mb-4 text-purple-800">
                                Bed Booking #{index + 1}
                              </h4>

                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                                <DataRow
                                  label="First Name"
                                  value={booking.firstName}
                                />
                                <DataRow
                                  label="Middle Name"
                                  value={booking.middleName}
                                />
                                <DataRow
                                  label="Last Name"
                                  value={booking.lastName}
                                />
                                <DataRow
                                  label="Date of Birth"
                                  value={booking.dateOfBirth}
                                  type="date"
                                />
                                <DataRow
                                  label="Gender"
                                  value={booking.gender}
                                  type="badge"
                                />
                                <DataRow
                                  label="Mobile Number"
                                  value={booking.mobileNumber}
                                />
                                <DataRow label="Email" value={booking.email} />
                                <DataRow
                                  label="Aadhar Number"
                                  value={booking.aadharCardNumber}
                                />
                                <DataRow
                                  label="Hospital Type"
                                  value={booking.hospitalType}
                                  type="badge"
                                />
                                <DataRow
                                  label="Bed Category"
                                  value={booking.bedCategory}
                                  type="badge"
                                />
                                <DataRow
                                  label="Hospital Name"
                                  value={booking.hospitalName}
                                />
                                <DataRow label="City" value={booking.city} />
                                <DataRow label="Pin Code" value={booking.pinCode} />
                                <DataRow
                                  label="Blood Group"
                                  value={booking.bloodgroup}
                                  type="badge"
                                />
                                <DataRow
                                  label="Booking Date"
                                  value={booking.Bookingdate}
                                  type="date"
                                />
                                <DataRow
                                  label="Health Insurance"
                                  value={booking.healthInsurance}
                                  type="boolean"
                                />
                                <DataRow
                                  label="Insurance Number"
                                  value={booking.healthInsuranceNumber}
                                />
                                <DataRow
                                  label="Ayushman Card"
                                  value={booking.ayushmancard}
                                  type="boolean"
                                />
                                <DataRow
                                  label="Ayushman Number"
                                  value={booking.ayushmanCardNumber}
                                />
                                <DataRow
                                  label="Received From"
                                  value={booking.recievedfrom}
                                  type="badge"
                                />
                                <DataRow
                                  label="Created At"
                                  value={booking.createdAt}
                                  type="date"
                                />
                                <DataRow
                                  label="Updated At"
                                  value={booking.updatedAt}
                                  type="date"
                                />
                              </div>

                              {booking.diseaseDetails && (
                                <div className="mb-4">
                                  <span className="font-semibold text-gray-800 block mb-2">
                                    Disease Details:
                                  </span>
                                  <p className="text-sm p-3 bg-white rounded-xl border">
                                    {booking.diseaseDetails}
                                  </p>
                                </div>
                              )}

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                {booking.aadharCardImage && (
                                  <div>
                                    <span className="text-sm font-medium text-gray-600 block mb-2">
                                      Aadhar Card:
                                    </span>
                                    <DocumentViewer
                                      src={booking.aadharCardImage}
                                      alt="Aadhar Card"
                                    />
                                  </div>
                                )}
                                {booking.healthInsuranceDocument && (
                                  <div>
                                    <span className="text-sm font-medium text-gray-600 block mb-2">
                                      Health Insurance:
                                    </span>
                                    <DocumentViewer
                                      src={booking.healthInsuranceDocument}
                                      alt="Health Insurance"
                                    />
                                  </div>
                                )}
                                {booking.ayushmanCardFront && (
                                  <div>
                                    <span className="text-sm font-medium text-gray-600 block mb-2">
                                      Ayushman Card:
                                    </span>
                                    <DocumentViewer
                                      src={booking.ayushmanCardFront}
                                      alt="Ayushman Card"
                                    />
                                  </div>
                                )}
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                                {[1, 2, 3, 4, 5].map((num) => {
                                  const docField = `medicaldoc${num}`;
                                  return booking[docField] ? (
                                    <div key={num}>
                                      <span className="text-xs font-medium text-gray-600 block mb-1">
                                        Medical Doc {num}:
                                      </span>
                                      <DocumentViewer
                                        src={booking[docField]}
                                        alt={`Medical Document ${num}`}
                                      />
                                    </div>
                                  ) : null;
                                })}
                              </div>

                              {booking.hospital && (
                                <div className="mb-4 p-4 bg-green-50 rounded-xl border border-green-200">
                                  <h5 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                                    <Building className="w-4 h-4" />
                                    Hospital Details:
                                  </h5>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <DataRow
                                      label="Email"
                                      value={booking.hospital.email}
                                    />
                                    <DataRow
                                      label="Mobile"
                                      value={booking.hospital.mobile}
                                    />
                                    <DataRow
                                      label="Role"
                                      value={booking.hospital.role}
                                      type="badge"
                                    />
                                    <DataRow
                                      label="Pincode"
                                      value={booking.hospital.pincode}
                                    />
                                  </div>
                                </div>
                              )}

                              {booking.bed && (
                                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                                  <h5 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                                    <Bed className="w-4 h-4" />
                                    Bed Details:
                                  </h5>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <DataRow
                                      label="Bed Number"
                                      value={booking.bed.bedNumber}
                                    />
                                    <DataRow
                                      label="Status"
                                      value={booking.bed.status}
                                      type="badge"
                                    />
                                    <DataRow
                                      label="Scheme"
                                      value={booking.bed.scheme}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <Bed className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                          <p className="text-gray-500 text-lg">
                            No bed bookings found
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Ambulance Bookings */}
                  <Card className="rounded-xl border-0 shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Ambulance className="w-6 h-6 text-red-500" />
                        Ambulance Bookings ({userdata.bookambulance?.length || 0})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {userdata.bookambulance &&
                        userdata.bookambulance.length > 0 ? (
                        <div className="space-y-6">
                          {userdata.bookambulance.map((booking, index) => (
                            <div
                              key={index}
                              className="p-6 border rounded-xl bg-gradient-to-br from-red-50 to-orange-50"
                            >
                              <h4 className="font-semibold text-xl mb-4 text-red-800">
                                Ambulance Booking #{index + 1}
                              </h4>

                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                                <DataRow
                                  label="First Name"
                                  value={booking.firstName}
                                />
                                <DataRow
                                  label="Middle Name"
                                  value={booking.middleName}
                                />
                                <DataRow
                                  label="Last Name"
                                  value={booking.lastName}
                                />
                                <DataRow
                                  label="Date of Birth"
                                  value={booking.dateOfBirth}
                                  type="date"
                                />
                                <DataRow
                                  label="Gender"
                                  value={booking.gender}
                                  type="badge"
                                />
                                <DataRow
                                  label="Mobile Number"
                                  value={booking.mobileNumber}
                                />
                                <DataRow label="Email" value={booking.email} />
                                <DataRow
                                  label="Aadhar Number"
                                  value={booking.aadharCardNumber}
                                />
                                <DataRow
                                  label="Ambulance Type"
                                  value={booking.ambulancetype}
                                  type="badge"
                                />
                                <DataRow
                                  label="Ambulance Category"
                                  value={booking.ambulancecategory}
                                  type="badge"
                                />
                                <DataRow
                                  label="Hospital Type"
                                  value={booking.hospitaltype}
                                  type="badge"
                                />
                                <DataRow
                                  label="Blood Group"
                                  value={booking.bloodgroup}
                                  type="badge"
                                />
                                <DataRow
                                  label="Health Insurance"
                                  value={booking.healthInsurance}
                                  type="boolean"
                                />
                                <DataRow
                                  label="Insurance Number"
                                  value={booking.healthInsuranceNumber}
                                />
                                <DataRow
                                  label="Ayushman Card"
                                  value={booking.ayushmancard}
                                  type="boolean"
                                />
                                <DataRow
                                  label="Ayushman Number"
                                  value={booking.ayushmanCardNumber}
                                />
                                <DataRow
                                  label="Created At"
                                  value={booking.createdAt}
                                  type="date"
                                />
                                <DataRow
                                  label="Updated At"
                                  value={booking.updatedAt}
                                  type="date"
                                />
                              </div>

                              {booking.diseaseDetails && (
                                <div className="mb-4">
                                  <span className="font-semibold text-gray-800 block mb-2">
                                    Disease Details:
                                  </span>
                                  <p className="text-sm p-3 bg-white rounded-xl border">
                                    {booking.diseaseDetails}
                                  </p>
                                </div>
                              )}

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                {booking.aadharCardImage && (
                                  <div>
                                    <span className="text-sm font-medium text-gray-600 block mb-2">
                                      Aadhar Card:
                                    </span>
                                    <DocumentViewer
                                      src={booking.aadharCardImage}
                                      alt="Aadhar Card"
                                    />
                                  </div>
                                )}
                                {booking.healthInsuranceDocument && (
                                  <div>
                                    <span className="text-sm font-medium text-gray-600 block mb-2">
                                      Health Insurance:
                                    </span>
                                    <DocumentViewer
                                      src={booking.healthInsuranceDocument}
                                      alt="Health Insurance"
                                    />
                                  </div>
                                )}
                                {booking.ayushmanCardFront && (
                                  <div>
                                    <span className="text-sm font-medium text-gray-600 block mb-2">
                                      Ayushman Card:
                                    </span>
                                    <DocumentViewer
                                      src={booking.ayushmanCardFront}
                                      alt="Ayushman Card"
                                    />
                                  </div>
                                )}
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                                {[1, 2, 3].map((num) => {
                                  const docField = `medicaldoc${num}`;
                                  return booking[docField] ? (
                                    <div key={num}>
                                      <span className="text-xs font-medium text-gray-600 block mb-1">
                                        Medical Doc {num}:
                                      </span>
                                      <DocumentViewer
                                        src={booking[docField]}
                                        alt={`Medical Document ${num}`}
                                      />
                                    </div>
                                  ) : null;
                                })}
                              </div>

                              {booking.ambulanceVaichicle && (
                                <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                                  <h5 className="font-semibold text-yellow-800 mb-3 flex items-center gap-2">
                                    <Ambulance className="w-4 h-4" />
                                    Ambulance Vehicle Details:
                                  </h5>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <DataRow
                                      label="Model"
                                      value={
                                        booking.ambulanceVaichicle.ambulancemodel
                                      }
                                    />
                                    <DataRow
                                      label="Charges"
                                      value={
                                        booking.ambulanceVaichicle.ambulancecharges
                                      }
                                      type="currency"
                                    />
                                    <DataRow
                                      label="Type"
                                      value={
                                        booking.ambulanceVaichicle.ambulancetype
                                      }
                                      type="badge"
                                    />
                                    <DataRow
                                      label="Category"
                                      value={
                                        booking.ambulanceVaichicle.ambulancecategory
                                      }
                                      type="badge"
                                    />
                                    <DataRow
                                      label="Status"
                                      value={booking.ambulanceVaichicle.status}
                                      type="badge"
                                    />
                                    <DataRow
                                      label="Online"
                                      value={booking.ambulanceVaichicle.isOnline}
                                      type="boolean"
                                    />
                                    <DataRow
                                      label="RC Number"
                                      value={
                                        booking.ambulanceVaichicle.ambulancercno
                                      }
                                    />
                                    <DataRow
                                      label="Registration Date"
                                      value={
                                        booking.ambulanceVaichicle.ambulanceregdate
                                      }
                                    />
                                    <DataRow
                                      label="Area Pincode"
                                      value={
                                        booking.ambulanceVaichicle
                                          .ambulanceareapincode
                                      }
                                    />
                                    <DataRow
                                      label="Facilities"
                                      value={booking.ambulanceVaichicle.facilities}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <Ambulance className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                          <p className="text-gray-500 text-lg">
                            No ambulance bookings found
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Diagnostic Services */}
                  <Card className="rounded-xl border-0 shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Activity className="w-6 h-6 text-green-500" />
                        Diagnostic Services (
                        {userdata.BookDiagnosticService?.length || 0})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {userdata.BookDiagnosticService &&
                        userdata.BookDiagnosticService.length > 0 ? (
                        <div className="space-y-6">
                          {userdata.BookDiagnosticService.map((service, index) => (
                            <div
                              key={index}
                              className="p-6 border rounded-xl bg-gradient-to-br from-green-50 to-emerald-50"
                            >
                              <h4 className="font-semibold text-xl mb-4 text-green-800">
                                Diagnostic Service #{index + 1}
                              </h4>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <DataRow
                                  label="Booking Date"
                                  value={service.bookingDate}
                                  type="date"
                                />
                                <DataRow
                                  label="Preferred Date"
                                  value={service.preferredDate}
                                  type="date"
                                />
                                <DataRow
                                  label="Time Slot"
                                  value={service.preferredTimeSlot}
                                />
                                <StatusBadge status={service.status} />
                                <DataRow
                                  label="Created At"
                                  value={service.createdAt}
                                  type="date"
                                />
                                <DataRow
                                  label="Updated At"
                                  value={service.updatedAt}
                                  type="date"
                                />
                              </div>

                              {service.notes && (
                                <div className="mb-4">
                                  <span className="font-semibold text-gray-800 block mb-2">
                                    Notes:
                                  </span>
                                  <p className="text-sm p-3 bg-white rounded-xl border">
                                    {service.notes}
                                  </p>
                                </div>
                              )}

                              {service.service && (
                                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                                  <h5 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                                    <Activity className="w-4 h-4" />
                                    Service Details:
                                  </h5>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <DataRow
                                      label="Facility"
                                      value={service.service.facility}
                                    />
                                    <DataRow
                                      label="Category"
                                      value={service.service.category}
                                      type="badge"
                                    />
                                    <DataRow
                                      label="Sub Category"
                                      value={service.service.subCategory}
                                      type="badge"
                                    />
                                    <DataRow
                                      label="Available"
                                      value={service.service.available}
                                      type="boolean"
                                    />
                                    <DataRow
                                      label="Min Price"
                                      value={service.service.minPrice}
                                      type="currency"
                                    />
                                    <DataRow
                                      label="Max Price"
                                      value={service.service.maxPrice}
                                      type="currency"
                                    />
                                    <DataRow
                                      label="Machine Model"
                                      value={service.service.machinemodel}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <Activity className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                          <p className="text-gray-500 text-lg">
                            No diagnostic services booked
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Surgery Treatment */}
                  <Card className="rounded-xl border-0 shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Stethoscope className="w-6 h-6 text-purple-500" />
                        Surgery Treatments (
                        {userdata.BookSurgeryTreatment?.length || 0})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {userdata.BookSurgeryTreatment &&
                        userdata.BookSurgeryTreatment.length > 0 ? (
                        <div className="space-y-6">
                          {userdata.BookSurgeryTreatment.map((treatment, index) => (
                            <div
                              key={index}
                              className="p-6 border rounded-xl bg-gradient-to-br from-purple-50 to-pink-50"
                            >
                              <h4 className="font-semibold text-xl mb-4 text-purple-800">
                                Surgery Treatment #{index + 1}
                              </h4>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <DataRow
                                  label="Booking Date"
                                  value={treatment.bookingDate}
                                  type="date"
                                />
                                <DataRow
                                  label="Preferred Date"
                                  value={treatment.preferredDate}
                                  type="date"
                                />
                                <DataRow
                                  label="Time Slot"
                                  value={treatment.preferredTimeSlot}
                                />
                                <StatusBadge status={treatment.status} />
                                <DataRow
                                  label="Created At"
                                  value={treatment.createdAt}
                                  type="date"
                                />
                                <DataRow
                                  label="Updated At"
                                  value={treatment.updatedAt}
                                  type="date"
                                />
                              </div>

                              {treatment.notes && (
                                <div className="mb-4">
                                  <span className="font-semibold text-gray-800 block mb-2">
                                    Notes:
                                  </span>
                                  <p className="text-sm p-3 bg-white rounded-xl border">
                                    {treatment.notes}
                                  </p>
                                </div>
                              )}

                              {treatment.service && (
                                <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                                  <h5 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                                    <Stethoscope className="w-4 h-4" />
                                    Treatment Details:
                                  </h5>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <DataRow
                                      label="Service Name"
                                      value={treatment.service.serviceName}
                                    />
                                    <DataRow
                                      label="Category"
                                      value={treatment.service.category}
                                      type="badge"
                                    />
                                    <DataRow
                                      label="Type"
                                      value={treatment.service.type}
                                      type="badge"
                                    />
                                    <DataRow
                                      label="Available"
                                      value={treatment.service.isAvailable}
                                      type="boolean"
                                    />
                                    <DataRow
                                      label="Min Price"
                                      value={treatment.service.minPrice}
                                      type="currency"
                                    />
                                    <DataRow
                                      label="Max Price"
                                      value={treatment.service.maxPrice}
                                      type="currency"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <Stethoscope className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                          <p className="text-gray-500 text-lg">
                            No surgery treatments booked
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Home Healthcare */}
                  <Card className="rounded-xl border-0 shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Home className="w-6 h-6 text-teal-500" />
                        Home Healthcare ({userdata.BookHomeHealthcare?.length || 0})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {userdata.BookHomeHealthcare &&
                        userdata.BookHomeHealthcare.length > 0 ? (
                        <div className="space-y-6">
                          {userdata.BookHomeHealthcare.map((healthcare, index) => (
                            <div
                              key={index}
                              className="p-6 border rounded-xl bg-gradient-to-br from-teal-50 to-cyan-50"
                            >
                              <h4 className="font-semibold text-xl mb-4 text-teal-800">
                                Home Healthcare #{index + 1}
                              </h4>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <DataRow
                                  label="Booking Date"
                                  value={healthcare.bookingDate}
                                  type="date"
                                />
                                <DataRow
                                  label="Preferred Date"
                                  value={healthcare.preferredDate}
                                  type="date"
                                />
                                <DataRow
                                  label="Time Slot"
                                  value={healthcare.preferredTimeSlot}
                                />
                                <StatusBadge status={healthcare.status} />
                                <DataRow
                                  label="Created At"
                                  value={healthcare.createdAt}
                                  type="date"
                                />
                                <DataRow
                                  label="Updated At"
                                  value={healthcare.updatedAt}
                                  type="date"
                                />
                              </div>

                              {healthcare.notes && (
                                <div className="mb-4">
                                  <span className="font-semibold text-gray-800 block mb-2">
                                    Notes:
                                  </span>
                                  <p className="text-sm p-3 bg-white rounded-xl border">
                                    {healthcare.notes}
                                  </p>
                                </div>
                              )}

                              {healthcare.HomeHealthcare && (
                                <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                                  <h5 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                                    <Home className="w-4 h-4" />
                                    Healthcare Service:
                                  </h5>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <DataRow
                                      label="Service Name"
                                      value={healthcare.HomeHealthcare.serviceName}
                                    />
                                    <DataRow
                                      label="Starting Price"
                                      value={
                                        healthcare.HomeHealthcare.startingPrice
                                      }
                                      type="currency"
                                    />
                                    <DataRow
                                      label="Min Price"
                                      value={healthcare.HomeHealthcare.minPrice}
                                      type="currency"
                                    />
                                    <DataRow
                                      label="Max Price"
                                      value={healthcare.HomeHealthcare.maxPrice}
                                      type="currency"
                                    />
                                    <DataRow
                                      label="Available"
                                      value={healthcare.HomeHealthcare.isAvailable}
                                      type="boolean"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <Home className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                          <p className="text-gray-500 text-lg">
                            No home healthcare services booked
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Health Cards */}
                  <Card className="rounded-xl border-0 shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Award className="w-6 h-6 text-yellow-500" />
                        Health Cards ({userdata.healthcard?.length || 0})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {userdata.healthcard && userdata.healthcard.length > 0 ? (
                        <div className="space-y-6">
                          {userdata.healthcard.map((card, index) => (
                            <div
                              key={index}
                              className="p-6 border rounded-xl bg-gradient-to-br from-yellow-50 to-orange-50"
                            >
                              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-4">
                                <h4 className="font-semibold text-xl text-yellow-800">
                                  {card.firstName} {card.middleName} {card.lastName}
                                </h4>
                                <StatusBadge status={card.approvalStatus} />
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                                <DataRow label="Card Number" value={card.cardNo} />
                                <DataRow
                                  label="Date of Birth"
                                  value={card.dateOfBirth}
                                  type="date"
                                />
                                <DataRow
                                  label="Gender"
                                  value={card.gender}
                                  type="badge"
                                />
                                <DataRow
                                  label="Mobile Number"
                                  value={card.mobileNumber}
                                />
                                <DataRow label="Email" value={card.email} />
                                <DataRow
                                  label="Aadhar Number"
                                  value={card.aadharCardNumber}
                                />
                                <DataRow label="PAN Card" value={card.pancard} />
                                <DataRow label="City" value={card.city} />
                                <DataRow label="Pin Code" value={card.pinCode} />
                                <DataRow
                                  label="Request From"
                                  value={card.requestfrom}
                                  type="badge"
                                />
                                <DataRow
                                  label="Approved By"
                                  value={card.approvedBy}
                                />
                                <DataRow
                                  label="Created At"
                                  value={card.createdAt}
                                  type="date"
                                />
                                <DataRow
                                  label="Updated At"
                                  value={card.updatedAt}
                                  type="date"
                                />
                              </div>

                              {card.remarks && (
                                <div>
                                  <span className="font-semibold text-gray-800 block mb-2">
                                    Remarks:
                                  </span>
                                  <p className="text-sm p-3 bg-white rounded-xl border">
                                    {card.remarks}
                                  </p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <Award className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                          <p className="text-gray-500 text-lg">
                            No health cards found
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Payments Tab */}
                <TabsContent value="payments" className="space-y-6">
                  <Card className="rounded-xl border-0 shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <DollarSign className="w-6 h-6 text-green-500" />
                        Payment History ({userdata.Payment?.length || 0})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {userdata.Payment && userdata.Payment.length > 0 ? (
                        <div className="space-y-6">
                          {userdata.Payment.map((payment, index) => (
                            <div
                              key={index}
                              className="p-6 border rounded-xl bg-gradient-to-br from-green-50 to-emerald-50"
                            >
                              <h4 className="font-semibold text-xl mb-4 text-green-800">
                                Payment #{index + 1}
                              </h4>

                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <DataRow
                                  label="Amount"
                                  value={payment.amount}
                                  type="currency"
                                />
                                <StatusBadge status={payment.paymentStatus} />
                                <DataRow
                                  label="Transaction ID"
                                  value={payment.transactionId}
                                />
                                <DataRow
                                  label="For What"
                                  value={payment.forwhat}
                                  type="badge"
                                />
                                <DataRow
                                  label="Created At"
                                  value={payment.createdAt}
                                  type="date"
                                />
                                <DataRow
                                  label="Updated At"
                                  value={payment.updatedAt}
                                  type="date"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <DollarSign className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                          <p className="text-gray-500 text-lg">
                            No payment history found
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Reviews Tab */}
                <TabsContent value="reviews" className="space-y-6">
                  <Card className="rounded-xl border-0 shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Star className="w-6 h-6 text-yellow-500" />
                        Hospital Reviews ({userdata.reviews?.length || 0})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {userdata.reviews && userdata.reviews.length > 0 ? (
                        <div className="space-y-6">
                          {userdata.reviews.map((review, index) => (
                            <div
                              key={index}
                              className="p-6 border rounded-xl bg-gradient-to-br from-yellow-50 to-orange-50"
                            >
                              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-4">
                                <h4 className="font-semibold text-xl text-yellow-800">
                                  {review.hospital?.hspInfo?.regname || "Hospital"}
                                </h4>
                                <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-xl border">
                                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                  <span className="font-semibold text-lg">
                                    {review.rating}/5
                                  </span>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <DataRow
                                  label="Rating"
                                  value={`${review.rating}/5`}
                                />
                                <DataRow
                                  label="Created At"
                                  value={review.createdAt}
                                  type="date"
                                />
                              </div>

                              <div className="mb-4">
                                <span className="font-semibold text-gray-800 block mb-2">
                                  Comment:
                                </span>
                                <p className="text-sm p-3 bg-white rounded-xl border">
                                  {review.comment || "No comment provided"}
                                </p>
                              </div>

                              {review.hospital && (
                                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                                  <h5 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                                    <Building className="w-4 h-4" />
                                    Hospital Details:
                                  </h5>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <DataRow
                                      label="Email"
                                      value={review.hospital.email}
                                    />
                                    <DataRow
                                      label="Mobile"
                                      value={review.hospital.mobile}
                                    />
                                    <DataRow
                                      label="Role"
                                      value={review.hospital.role}
                                      type="badge"
                                    />
                                    <DataRow
                                      label="Pincode"
                                      value={review.hospital.pincode}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <Star className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                          <p className="text-gray-500 text-lg">No reviews found</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Fundraising Tab */}
                <TabsContent value="fundraising" className="space-y-6">
                  {/* Fundraiser Information */}
                  <Card className="rounded-xl border-0 shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Heart className="w-6 h-6 text-pink-500" />
                        Fundraisers ({userdata.fundraiser?.length || 0})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {userdata.fundraiser && userdata.fundraiser.length > 0 ? (
                        <div className="space-y-6">
                          {userdata.fundraiser.map((fundraiser, index) => (
                            <div
                              key={index}
                              className="p-6 border rounded-xl bg-gradient-to-br from-pink-50 to-rose-50"
                            >
                              <h4 className="font-semibold text-xl mb-4 text-pink-800">
                                Fundraiser #{index + 1}
                              </h4>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <DataRow
                                  label="Created At"
                                  value={fundraiser.createdAt}
                                  type="date"
                                />
                                <DataRow
                                  label="Updated At"
                                  value={fundraiser.updatedAt}
                                  type="date"
                                />
                              </div>

                              {fundraiser.fundraisingCampaign &&
                                fundraiser.fundraisingCampaign.length > 0 && (
                                  <div>
                                    <h5 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                      <Heart className="w-5 h-5" />
                                      Campaigns (
                                      {fundraiser.fundraisingCampaign.length}):
                                    </h5>
                                    {fundraiser.fundraisingCampaign.map(
                                      (campaign, campaignIndex) => (
                                        <div
                                          key={campaignIndex}
                                          className="p-4 bg-white rounded-xl border mb-4"
                                        >
                                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-4">
                                            <h6 className="font-semibold text-lg text-pink-700">
                                              {campaign.fundraisertitle}
                                            </h6>
                                            <StatusBadge status={campaign.status} />
                                          </div>

                                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                                            <DataRow
                                              label="Campaign ID"
                                              value={campaign.campaignid}
                                            />
                                            <DataRow
                                              label="Goal Amount"
                                              value={campaign.goalamount}
                                              type="currency"
                                            />
                                            <DataRow
                                              label="Received Amount"
                                              value={campaign.recievedamount}
                                              type="currency"
                                            />
                                            <DataRow
                                              label="Health Issue"
                                              value={campaign.healthissue}
                                              type="badge"
                                            />
                                            <DataRow
                                              label="Photographer Decision"
                                              value={campaign.photographerDecision}
                                              type="badge"
                                            />
                                            <DataRow
                                              label="Assignment Status"
                                              value={campaign.assignmentStatus}
                                              type="badge"
                                            />
                                            <DataRow
                                              label="Created At"
                                              value={campaign.createdAt}
                                              type="date"
                                            />
                                            <DataRow
                                              label="Updated At"
                                              value={campaign.updatedAt}
                                              type="date"
                                            />
                                          </div>

                                          {campaign.description && (
                                            <div className="mb-4">
                                              <span className="font-semibold text-gray-800 block mb-2">
                                                Description:
                                              </span>
                                              <p className="text-sm p-3 bg-gray-50 rounded-xl border">
                                                {campaign.description}
                                              </p>
                                            </div>
                                          )}

                                          {campaign.story && (
                                            <div className="mb-4">
                                              <span className="font-semibold text-gray-800 block mb-2">
                                                Story:
                                              </span>
                                              <p className="text-sm p-3 bg-gray-50 rounded-xl border">
                                                {campaign.story}
                                              </p>
                                            </div>
                                          )}

                                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                                            {campaign.frontimage && (
                                              <div>
                                                <span className="text-xs font-medium text-gray-600 block mb-1">
                                                  Front Image:
                                                </span>
                                                <DocumentViewer
                                                  src={campaign.frontimage}
                                                  alt="Front Image"
                                                />
                                              </div>
                                            )}
                                            {[1, 2, 3].map((num) => {
                                              const imageField = `image${num}`;
                                              return campaign[imageField] ? (
                                                <div key={num}>
                                                  <span className="text-xs font-medium text-gray-600 block mb-1">
                                                    Image {num}:
                                                  </span>
                                                  <DocumentViewer
                                                    src={campaign[imageField]}
                                                    alt={`Image ${num}`}
                                                  />
                                                </div>
                                              ) : null;
                                            })}
                                          </div>

                                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                                            {[1, 2, 3].map((num) => {
                                              const docField = `medicaldoc${num}`;
                                              return campaign[docField] ? (
                                                <div key={num}>
                                                  <span className="text-xs font-medium text-gray-600 block mb-1">
                                                    Medical Doc {num}:
                                                  </span>
                                                  <DocumentViewer
                                                    src={campaign[docField]}
                                                    alt={`Medical Document ${num}`}
                                                  />
                                                </div>
                                              ) : null;
                                            })}
                                          </div>

                                          {campaign.photographer && (
                                            <div className="mb-4 p-4 bg-purple-50 rounded-xl border border-purple-200">
                                              <h6 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                                                <Camera className="w-4 h-4" />
                                                Photographer:
                                              </h6>
                                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <DataRow
                                                  label="Name"
                                                  value={
                                                    campaign.photographer.fullname
                                                  }
                                                />
                                                <DataRow
                                                  label="Email"
                                                  value={
                                                    campaign.photographer.email
                                                  }
                                                />
                                                <DataRow
                                                  label="Mobile"
                                                  value={
                                                    campaign.photographer.mobile
                                                  }
                                                />
                                                <DataRow
                                                  label="Company"
                                                  value={
                                                    campaign.photographer
                                                      .companyname
                                                  }
                                                />
                                                <DataRow
                                                  label="Status"
                                                  value={
                                                    campaign.photographer.status
                                                  }
                                                  type="badge"
                                                />
                                              </div>
                                            </div>
                                          )}

                                          {campaign.Donation &&
                                            campaign.Donation.length > 0 && (
                                              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                                                <h6 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                                                  <DollarSign className="w-4 h-4" />
                                                  Donations (
                                                  {campaign.Donation.length}):
                                                </h6>
                                                <div className="space-y-3">
                                                  {campaign.Donation.map(
                                                    (donation, donationIndex) => (
                                                      <div
                                                        key={donationIndex}
                                                        className="p-3 bg-white rounded-xl border"
                                                      >
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                          <DataRow
                                                            label="Amount"
                                                            value={donation.amount}
                                                            type="currency"
                                                          />
                                                          <DataRow
                                                            label="Donor"
                                                            value={
                                                              donation.donorName
                                                            }
                                                          />
                                                          <StatusBadge
                                                            status={
                                                              donation.paymentStatus
                                                            }
                                                          />
                                                          <DataRow
                                                            label="Transaction ID"
                                                            value={
                                                              donation.transactionId
                                                            }
                                                          />
                                                          <DataRow
                                                            label="Tax Benefit"
                                                            value={
                                                              donation.wantsTaxBenefit
                                                            }
                                                            type="boolean"
                                                          />
                                                          <DataRow
                                                            label="Date"
                                                            value={
                                                              donation.createdAt
                                                            }
                                                            type="date"
                                                          />
                                                        </div>
                                                      </div>
                                                    )
                                                  )}
                                                </div>
                                              </div>
                                            )}
                                        </div>
                                      )
                                    )}
                                  </div>
                                )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                          <p className="text-gray-500 text-lg">
                            No fundraisers found
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Donor Information */}
                  <Card className="rounded-xl border-0 shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <DollarSign className="w-6 h-6 text-green-500" />
                        Donor Information ({userdata.donar?.length || 0})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {userdata.donar && userdata.donar.length > 0 ? (
                        <div className="space-y-6">
                          {userdata.donar.map((donor, index) => (
                            <div
                              key={index}
                              className="p-6 border rounded-xl bg-gradient-to-br from-green-50 to-emerald-50"
                            >
                              <h4 className="font-semibold text-xl mb-4 text-green-800">
                                Donor #{index + 1}
                              </h4>

                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                                <DataRow label="Email" value={donor.email} />
                                <DataRow label="Full Name" value={donor.fullname} />
                                <DataRow label="Mobile" value={donor.mobile} />
                                <DataRow label="City" value={donor.city} />
                                <DataRow label="Pincode" value={donor.pincode} />
                                <DataRow
                                  label="PAN Number"
                                  value={donor.pancardno}
                                />
                                <DataRow
                                  label="Aadhar Number"
                                  value={donor.aadharcardno}
                                />
                                <DataRow
                                  label="Created At"
                                  value={donor.createdAt}
                                  type="date"
                                />
                                <DataRow
                                  label="Updated At"
                                  value={donor.updatedAt}
                                  type="date"
                                />
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                {donor.pancardimage && (
                                  <div>
                                    <span className="text-sm font-medium text-gray-600 block mb-2">
                                      PAN Card:
                                    </span>
                                    <DocumentViewer
                                      src={donor.pancardimage}
                                      alt="PAN Card"
                                    />
                                  </div>
                                )}
                                {donor.aadharcardimage && (
                                  <div>
                                    <span className="text-sm font-medium text-gray-600 block mb-2">
                                      Aadhar Card:
                                    </span>
                                    <DocumentViewer
                                      src={donor.aadharcardimage}
                                      alt="Aadhar Card"
                                    />
                                  </div>
                                )}
                              </div>

                              {donor.Donation && donor.Donation.length > 0 && (
                                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                                  <h6 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                                    <Heart className="w-4 h-4" />
                                    Donations Made ({donor.Donation.length}):
                                  </h6>
                                  <div className="space-y-3">
                                    {donor.Donation.map(
                                      (donation, donationIndex) => (
                                        <div
                                          key={donationIndex}
                                          className="p-3 bg-white rounded-xl border"
                                        >
                                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            <DataRow
                                              label="Amount"
                                              value={donation.amount}
                                              type="currency"
                                            />
                                            <StatusBadge
                                              status={donation.paymentStatus}
                                            />
                                            <DataRow
                                              label="Date"
                                              value={donation.createdAt}
                                              type="date"
                                            />
                                          </div>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <DollarSign className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                          <p className="text-gray-500 text-lg">
                            No donor information found
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* E-Seva Tab */}
                <TabsContent value="eseva" className="space-y-6">
                  <Card className="rounded-xl border-0 shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Building className="w-6 h-6 text-indigo-500" />
                        E-Seva Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {userdata.Eseva ? (
                        <div className="p-6 border rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6 gap-4">
                            <h4 className="font-semibold text-2xl text-indigo-800">
                              {userdata.Eseva.name}
                            </h4>
                            <StatusBadge status={userdata.Eseva.status} />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                            <DataRow
                              label="E-Seva Code"
                              value={userdata.Eseva.esevacode}
                            />
                            <DataRow label="Email" value={userdata.Eseva.email} />
                            <DataRow label="Mobile" value={userdata.Eseva.mobile} />
                            <DataRow
                              label="Alternate Mobile"
                              value={userdata.Eseva.alternatemobile}
                            />
                            <DataRow
                              label="Address"
                              value={userdata.Eseva.address}
                            />
                            <DataRow
                              label="District"
                              value={userdata.Eseva.district}
                            />
                            <DataRow label="State" value={userdata.Eseva.state} />
                            <DataRow label="Taluka" value={userdata.Eseva.taluka} />
                            <DataRow
                              label="Pincode"
                              value={userdata.Eseva.pincode}
                            />
                            <DataRow
                              label="Incharge"
                              value={userdata.Eseva.incharge}
                            />
                            <DataRow
                              label="Incharge Aadhar"
                              value={userdata.Eseva.inchargeaadharno}
                            />
                            <DataRow
                              label="Incharge PAN"
                              value={userdata.Eseva.inchargepanno}
                            />
                            <DataRow
                              label="Bank Name"
                              value={userdata.Eseva.bankName}
                            />
                            <DataRow
                              label="Account Number"
                              value={userdata.Eseva.accountNumber}
                            />
                            <DataRow
                              label="IFSC Code"
                              value={userdata.Eseva.ifscCode}
                            />
                            <DataRow
                              label="Account Type"
                              value={userdata.Eseva.accountType}
                              type="badge"
                            />
                            <DataRow
                              label="MICR Code"
                              value={userdata.Eseva.micrCode}
                            />
                            <DataRow
                              label="Created At"
                              value={userdata.Eseva.createdAt}
                              type="date"
                            />
                            <DataRow
                              label="Updated At"
                              value={userdata.Eseva.updatedAt}
                              type="date"
                            />
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
                            {userdata.Eseva.logo && (
                              <div>
                                <span className="text-sm font-medium text-gray-600 block mb-2">
                                  Logo:
                                </span>
                                <DocumentViewer
                                  src={userdata.Eseva.logo}
                                  alt="E-Seva Logo"
                                />
                              </div>
                            )}
                            {userdata.Eseva.inchargeprofilepic && (
                              <div>
                                <span className="text-sm font-medium text-gray-600 block mb-2">
                                  Incharge Photo:
                                </span>
                                <DocumentViewer
                                  src={userdata.Eseva.inchargeprofilepic}
                                  alt="Incharge Photo"
                                />
                              </div>
                            )}
                            {userdata.Eseva.inchargeaadhardoc && (
                              <div>
                                <span className="text-sm font-medium text-gray-600 block mb-2">
                                  Incharge Aadhar:
                                </span>
                                <DocumentViewer
                                  src={userdata.Eseva.inchargeaadhardoc}
                                  alt="Incharge Aadhar"
                                />
                              </div>
                            )}
                            {userdata.Eseva.inchargepandoc && (
                              <div>
                                <span className="text-sm font-medium text-gray-600 block mb-2">
                                  Incharge PAN:
                                </span>
                                <DocumentViewer
                                  src={userdata.Eseva.inchargepandoc}
                                  alt="Incharge PAN"
                                />
                              </div>
                            )}
                            {userdata.Eseva.shopactdoc && (
                              <div>
                                <span className="text-sm font-medium text-gray-600 block mb-2">
                                  Shop Act:
                                </span>
                                <DocumentViewer
                                  src={userdata.Eseva.shopactdoc}
                                  alt="Shop Act Document"
                                />
                              </div>
                            )}
                            {userdata.Eseva.addressproofdoc && (
                              <div>
                                <span className="text-sm font-medium text-gray-600 block mb-2">
                                  Address Proof:
                                </span>
                                <DocumentViewer
                                  src={userdata.Eseva.addressproofdoc}
                                  alt="Address Proof"
                                />
                              </div>
                            )}
                            {userdata.Eseva.regcertificate && (
                              <div>
                                <span className="text-sm font-medium text-gray-600 block mb-2">
                                  Registration Certificate:
                                </span>
                                <DocumentViewer
                                  src={userdata.Eseva.regcertificate}
                                  alt="Registration Certificate"
                                />
                              </div>
                            )}
                            {userdata.Eseva.cancelledCheque && (
                              <div>
                                <span className="text-sm font-medium text-gray-600 block mb-2">
                                  Cancelled Cheque:
                                </span>
                                <DocumentViewer
                                  src={userdata.Eseva.cancelledCheque}
                                  alt="Cancelled Cheque"
                                />
                              </div>
                            )}
                          </div>

                          {userdata.Eseva.payment &&
                            userdata.Eseva.payment.length > 0 && (
                              <div className="p-4 bg-white rounded-xl border">
                                <h6 className="font-semibold text-indigo-800 mb-4 flex items-center gap-2">
                                  <DollarSign className="w-5 h-5" />
                                  E-Seva Payments ({userdata.Eseva.payment.length}):
                                </h6>
                                <div className="space-y-3">
                                  {userdata.Eseva.payment.map(
                                    (payment, paymentIndex) => (
                                      <div
                                        key={paymentIndex}
                                        className="p-3 bg-gray-50 rounded-xl border"
                                      >
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                          <DataRow
                                            label="Amount"
                                            value={payment.amount}
                                            type="currency"
                                          />
                                          <StatusBadge
                                            status={payment.paymentStatus}
                                          />
                                          <DataRow
                                            label="Transaction ID"
                                            value={payment.transactionId}
                                          />
                                          <DataRow
                                            label="For What"
                                            value={payment.forwhat}
                                            type="badge"
                                          />
                                          <DataRow
                                            label="Date"
                                            value={payment.createdAt}
                                            type="date"
                                          />
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            )}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <Building className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                          <p className="text-gray-500 text-lg">
                            No E-Seva information found
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
        );
};

        export default PatientSingleView;
