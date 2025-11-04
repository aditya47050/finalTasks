"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Clock,
  MapPin, 
  Phone, 
  Shield,
  Star, 
  TestTube,
  Video,
  Mail, 
  Globe,
  StarHalf,
  ShieldCheck,
  Building2, 
  Users,
  Bed,
  Award,
  CreditCard,
  FileText,
  User,
  Calendar,
  CheckCircle,
  Camera,
  Heart,
  Stethoscope,
  IndianRupee
} from "lucide-react";
import { FaHospitalAlt } from "react-icons/fa";
import BookDiagnosticDialog from "./bookdiagnosticservice";
import DiagnosticTestsList from "./DiagnosticTestsList";
import DiagnosticServicesList from "./DiagnosticServicesList";
import ServiceHoursList from "./ServiceHoursList";
import NABLCertifiedList from "./NABLCertifiedList";
import GovtSchemesList from "./GovtSchemesList";
import PathologyList from "./PathologyList";
import OnlineConsultationList from "./OnlineConsultationList";
import ExperienceList from "./ExperienceList";
import CashlessServicesList from "./CashlessServicesList";
import InhouseCanteenList from "./InhouseCanteenList";
import ReviewsList from "./ReviewsList";
import { useSearchParams } from "next/navigation";

const DiagnosticCenterSingleView = ({ diagnosticcenterdata, diagnosticCenter, patientId }) => {
  console.log("🚀 ~ Diagnostic Center Data:", diagnosticcenterdata)
  
  const [activeTab, setActiveTab] = useState('overview');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [testsDialogOpen, setTestsDialogOpen] = useState(false);
  const [servicesDialogOpen, setServicesDialogOpen] = useState(false);
  const [serviceHoursDialogOpen, setServiceHoursDialogOpen] = useState(false);
  const [nablDialogOpen, setNablDialogOpen] = useState(false);
  const [govtSchemesDialogOpen, setGovtSchemesDialogOpen] = useState(false);
  const [pathologyDialogOpen, setPathologyDialogOpen] = useState(false);
  const [onlineConsultationDialogOpen, setOnlineConsultationDialogOpen] = useState(false);
  const [experienceDialogOpen, setExperienceDialogOpen] = useState(false);
  const [cashlessDialogOpen, setCashlessDialogOpen] = useState(false);
  const [canteenDialogOpen, setCanteenDialogOpen] = useState(false);
  const [reviewsDialogOpen, setReviewsDialogOpen] = useState(false);
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("serviceId");

  // Get reviews from diagnostic center data
  const reviews = diagnosticcenterdata?.DiagnosticReview || diagnosticcenterdata?.reviews || [];
  console.log("🚀 ~ Diagnostic Reviews:", JSON.stringify(reviews, null, 2))
  
  // Calculate average rating from actual reviews
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length).toFixed(1) 
    : "4.9";
  const totalReviews = reviews.length || 129;

  const diagnosticImages = [
    diagnosticcenterdata?.hspdetails?.hsplogo,
    diagnosticcenterdata?.hspdetails?.hspregcertificate,
    diagnosticcenterdata?.hspdetails?.nabhnablcertificate,
    diagnosticcenterdata?.hspdetails?.pancardimg,
    diagnosticcenterdata?.hspdetails?.cancelledcheque,
  ].filter(Boolean);

  const images = diagnosticImages.length > 0
    ? diagnosticImages.length >= 6
      ? diagnosticImages.slice(0, 6)
      : [...diagnosticImages, ...diagnosticImages, ...diagnosticImages].slice(0, 6)
    : [];

  const mainImage = images[0] || null;

  // Helper to format year from date string
  const getYear = (dateStr) => {
    if (!dateStr) return "N/A";
    const year = new Date(dateStr).getFullYear();
    return isNaN(year) ? "N/A" : year;
  };

  // Helper to safely display text or fallback
  const safeDisplay = (value, fallback = "Not available") => {
    return value && value !== "null" ? value : fallback;
  };

  // Helper to get city from hospital or branches
  const getCity = () => {
    if (diagnosticcenterdata?.hspcontact?.city) {
      return diagnosticcenterdata.hspcontact.city;
    }
    if (diagnosticcenterdata?.hspbranches && diagnosticcenterdata.hspbranches.length > 0) {
      return diagnosticcenterdata.hspbranches[0]?.branchcity;
    }
    return null;
  };

  // Helper to get state from hospital or branches
  const getState = () => {
    if (diagnosticcenterdata?.hspcontact?.state) {
      return diagnosticcenterdata.hspcontact.state;
    }
    if (diagnosticcenterdata?.hspbranches && diagnosticcenterdata.hspbranches.length > 0) {
      return diagnosticcenterdata.hspbranches[0]?.state;
    }
    return null;
  };

  // Helper to get full address
  const getAddress = () => {
    // Try main contact first
    if (diagnosticcenterdata?.hspcontact?.address) {
      return diagnosticcenterdata.hspcontact.address;
    }
    // Try branches
    if (diagnosticcenterdata?.hspbranches && diagnosticcenterdata.hspbranches.length > 0) {
      return diagnosticcenterdata.hspbranches[0]?.branchaddress;
    }
    return null;
  };

  const displayCity = getCity();
  const displayState = getState();
  const displayAddress = getAddress();

  return (
    <div key={diagnosticcenterdata?.id || 'no-diagnostic'} className="w-full bg-gray-50 relative min-h-screen">
      {/* Desktop View - Show on large screens only */}
      <div className="hidden lg:block">
        {/* Clean Simple Header */}
        <div className="shadow-lg" style={{ background: '#3D85EF' }}>
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between gap-8">
              {/* Left Section - Logo & Basic Info */}
              <div className="flex items-center gap-5 flex-1">
                {diagnosticcenterdata?.hspdetails?.hsplogo && (
                  <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-white/40 shadow-lg bg-white flex-shrink-0">
                    <Image
                      src={diagnosticcenterdata.hspdetails.hsplogo}
                      width={80}
                      height={80}
                      alt="Diagnostic Center Logo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-white mb-2">
                    {diagnosticcenterdata?.hspInfo?.regname || "Diagnostic Center"}
                  </h1>
                  <div className="flex items-center gap-2 text-white/90 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {safeDisplay(displayCity, "City")}, {safeDisplay(displayState, "State")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Section - Rating & Actions */}
              <div className="flex items-center gap-6">
                {/* Rating */}
                <div className="bg-white/20 backdrop-blur-md rounded-xl px-5 py-3 border border-white/30">
                  <div className="flex items-center gap-2 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(avgRating)
                            ? "text-yellow-300 fill-yellow-300"
                            : "text-white/30"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-white text-center">
                    <span className="text-xl font-bold">{avgRating}</span>
                    <span className="text-sm ml-1">({totalReviews})</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      const phone = diagnosticcenterdata?.hspcontact?.receptioncontact1 || diagnosticcenterdata?.mobile;
                      if (phone) window.open(`tel:${phone}`, '_self');
                    }}
                    className="px-5 py-2.5 bg-white hover:bg-gray-100 text-blue-600 rounded-lg font-semibold text-sm flex items-center gap-2 shadow-lg transition-all"
                  >
                    <Phone className="w-4 h-4" />
                    Call Now
                  </button>
                  <button
                    onClick={() => setDialogOpen(true)}
                    className="px-5 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-lg font-semibold text-sm flex items-center gap-2 border border-white/40 transition-all"
                  >
                    <Calendar className="w-4 h-4" />
                    Book Test
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
                  
        {/* Main Content Layout */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* FULL WIDTH HD PHOTO GALLERY SECTION */}
          <div className="w-full mb-6">
            <Card className="overflow-hidden border border-gray-200 shadow-lg rounded-xl">
              <CardContent className="p-0">
                {images.length > 0 ? (
                  <div className="grid grid-cols-4 gap-2 h-[400px] bg-gray-50">
                    <div className="col-span-2 row-span-2 relative group cursor-pointer overflow-hidden rounded-lg">
                      <Image
                        src={mainImage}
                        fill
                        priority
                        quality={90}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        alt="Diagnostic Center Main View"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                      {images.length > 1 && (
                        <div className="absolute bottom-4 left-4 bg-black/70 text-white px-4 py-2 rounded-full text-sm flex items-center gap-2 font-medium">
                          <Camera className="w-4 h-4" />
                          See all photos ({images.length})
                        </div>
                      )}
                    </div>
                    {images.slice(1, 5).map((image, index) => (
                      <div key={index} className="relative group cursor-pointer overflow-hidden rounded-lg">
                        <Image
                          src={image}
                          fill
                          quality={85}
                          sizes="(max-width: 768px) 25vw, (max-width: 1200px) 12.5vw, 8vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                          alt={`Diagnostic Center Image ${index + 2}`}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-[400px] bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
                    <div className="text-center p-8">
                      <TestTube className="w-24 h-24 text-blue-400 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-gray-700 mb-2">Diagnostic Center</h3>
                      <p className="text-gray-500 font-medium">Images will be available soon</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* FULL WIDTH TABS */}
          <div className="w-full mb-6">
            <div className="bg-white border-b border-gray-200 shadow-sm rounded-t-xl">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between px-4 lg:px-6">
                <nav className="flex space-x-4 lg:space-x-6 overflow-x-auto scrollbar-hide">
                  {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'services', label: 'Services' },
                    { id: 'facilities', label: 'Facilities' },
                    { id: 'reviews', label: 'Reviews' },
                    { id: 'contact', label: 'Contact' },
                    { id: 'info', label: 'Center Info' },
                  ].map((tab) => (
                <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-3 lg:py-4 px-3 lg:px-4 border-b-2 font-medium text-xs lg:text-sm whitespace-nowrap transition-all duration-300 ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600 bg-blue-50 rounded-t-md'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.label}
                </button>
                  ))}
                </nav>
                <button
                  onClick={() => setDialogOpen(true)}
                  className="w-full lg:w-auto mt-3 lg:mt-0 lg:ml-4 mb-3 lg:mb-0 lg:my-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 px-6 lg:px-8 rounded-lg transition-all transform hover:scale-110 shadow-xl border-2 border-orange-400 flex items-center justify-center gap-2 whitespace-nowrap text-sm animate-pulse"
                >
                  <Calendar className="w-5 h-5" />
                  Book Test Now
                </button>
          </div>
        </div>
      </div>

          {/* Content Grid with Sidebar - Responsive */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Tab Content */}
            <div className="lg:col-span-2 space-y-4 order-2 lg:order-1">
              {/* OVERVIEW TAB */}
              {activeTab === 'overview' && (
                <Card className="border border-gray-200 shadow-md rounded-xl">
                  <CardContent className="p-4 md:p-6">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                      About {diagnosticcenterdata?.hspInfo?.regname}
                    </h3>
                    <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-6">
                      {diagnosticcenterdata?.hspInfo?.regname} is a leading diagnostic center{diagnosticcenterdata?.hspInfo?.experience ? ` with ${diagnosticcenterdata.hspInfo.experience} years of experience` : ''} in providing quality diagnostic services.
                      Located in {safeDisplay(displayCity, "your area")}, {safeDisplay(displayState, "")}, we are committed to
                      excellence in healthcare delivery with state-of-the-art equipment{diagnosticcenterdata?.diagnosticServices?.length > 0 ? ` and ${diagnosticcenterdata.diagnosticServices.length} specialized diagnostic services` : ''}.
                    </p>
                    <div className="mb-6 p-3 md:p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                          <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                  </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-blue-900 text-sm md:text-base">Center Status</h4>
                          <p className="text-blue-700 text-xs md:text-sm break-words">
                            Registration: {diagnosticcenterdata?.hspdetails?.hspregno} | 
                            Established: {getYear(diagnosticcenterdata?.hspdetails?.hspregdate)} | 
                            Status: <span className={`font-semibold ${diagnosticcenterdata?.approvalStatus === 'APPROVED' ? 'text-green-600' : 'text-yellow-600'}`}>
                              {diagnosticcenterdata?.approvalStatus || "PENDING"}
                            </span>
                          </p>
                          {diagnosticcenterdata?.hspdetails?.nabhnablapproved === "Yes" && (
                            <p className="text-blue-700 text-xs md:text-sm mt-1">
                              <Award className="w-3 h-3 md:w-4 md:h-4 inline mr-1" />
                              NABL Accredited - {diagnosticcenterdata?.hspdetails?.nabhnabllevel}
                            </p>
                          )}
                      </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                      {[
                        { icon: <TestTube className="w-4 h-4 md:w-5 md:h-5" />, label: "Total Tests", value: diagnosticcenterdata?.diagnosticServices?.length || "N/A", color: "blue" },
                        { icon: <Clock className="w-4 h-4 md:w-5 md:h-5" />, label: "Service Hours", value: "24/7", color: "green" },
                        { icon: <Award className="w-4 h-4 md:w-5 md:h-5" />, label: "Certification", value: "NABL", color: "purple" },
                        { icon: <Users className="w-4 h-4 md:w-5 md:h-5" />, label: "Experience", value: diagnosticcenterdata?.hspInfo?.experience ? `${diagnosticcenterdata.hspInfo.experience}+ Years` : "N/A", color: "orange" },
                      ].map((stat, index) => (
                        <div key={index} className="bg-white p-3 md:p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-2 md:gap-3">
                            <div className="p-1.5 md:p-2 bg-blue-100 rounded-lg flex-shrink-0">
                              <div className="text-blue-600">{stat.icon}</div>
                      </div>
                            <div className="min-w-0">
                              <p className="text-lg md:text-2xl font-bold text-gray-900">{stat.value}</p>
                              <p className="text-xs md:text-sm text-gray-600">{stat.label}</p>
                    </div>
                      </div>
                        </div>
                      ))}
              </div>
                </CardContent>
              </Card>
              )}

              {/* SERVICES TAB */}
              {activeTab === 'services' && (
                <Card className="border border-gray-200 shadow-md rounded-xl">
                  <CardContent className="p-4 md:p-6">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Diagnostic Services & Pricing</h3>

                    {/* Diagnostic Categories */}
                    {diagnosticcenterdata?.hspInfo?.hspcategory && (
                      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 md:p-6 border border-indigo-200 mb-6">
                        <h4 className="text-lg md:text-xl font-bold text-indigo-900 mb-3 flex items-center gap-2">
                          <TestTube className="h-4 w-4 md:h-5 md:w-5" />
                          Available Categories
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {diagnosticcenterdata.hspInfo.hspcategory.map((cat, idx) => (
                            <Badge key={idx} className="bg-indigo-100 text-indigo-800 border border-indigo-300 hover:bg-indigo-200 transition-colors text-xs md:text-sm">
                              {cat.diagnosticcategory?.title || `Category ${idx + 1}`}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Diagnostic Services with Pricing */}
                    {diagnosticcenterdata?.diagnosticServices?.length > 0 ? (
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
              {diagnosticcenterdata.diagnosticServices.map((service, idx) => (
                <div
                  key={idx}
                              className="bg-white border border-gray-200 rounded-xl p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-3">
                                <div className="flex-1">
                                  <h5 className="font-bold text-gray-900 text-base md:text-lg">{service.facility}</h5>
                                  <p className="text-blue-600 font-medium text-sm md:text-base">{service.category}</p>
                                  <p className="text-xs md:text-sm text-gray-600">{service.subCategory}</p>
                                </div>
                                <Badge className={`${service.available ? 'bg-green-100 text-green-800 border-green-300' : 'bg-red-100 text-red-800 border-red-300'} text-xs whitespace-nowrap`}>
                                  {service.available ? 'Available' : 'Unavailable'}
                                </Badge>
                              </div>
                              
                              <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="bg-blue-50 rounded-lg p-3">
                                    <p className="text-xs text-blue-600 font-medium">Min Price</p>
                                    <p className="text-lg md:text-xl font-bold text-blue-900">₹{service.minPrice}</p>
                                  </div>
                                  <div className="bg-purple-50 rounded-lg p-3">
                                    <p className="text-xs text-purple-600 font-medium">Max Price</p>
                                    <p className="text-lg md:text-xl font-bold text-purple-900">₹{service.maxPrice}</p>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="bg-green-50 rounded-lg p-3">
                                    <p className="text-xs text-green-600 font-medium">Final Price</p>
                                    <p className="text-lg md:text-xl font-bold text-green-900">
                                      {service.finalPrice ? `₹${service.finalPrice}` : "Call for Price"}
                                    </p>
                                  </div>
                                  <div className="bg-orange-50 rounded-lg p-3">
                                    <p className="text-xs text-orange-600 font-medium">Discount</p>
                                    <p className="text-lg md:text-xl font-bold text-orange-900">
                      {service.discount ? `${service.discount}%` : "No discount"}
                                    </p>
                                  </div>
                                </div>
                                
                                {service.machinemodel && (
                                  <div className="bg-gray-50 rounded-lg p-3">
                                    <p className="text-xs text-gray-600 font-medium">Equipment</p>
                                    <p className="text-sm md:text-base font-semibold text-gray-800">{service.machinemodel}</p>
                                  </div>
                                )}
                              </div>
                </div>
              ))}
            </div>
                    ) : (
                      <div className="text-center py-8">
                        <TestTube className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No services available</p>
          </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* FACILITIES TAB */}
              {activeTab === 'facilities' && (
                <Card className="border border-gray-200 shadow-md rounded-xl">
                  <CardContent className="p-4 md:p-6">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Center Facilities</h3>
                    <div className="space-y-3">
                      {[
                        { label: "Diagnostic Services", value: diagnosticcenterdata?.hspInfo?.diagnosticservices, icon: <Shield className="w-5 h-5" /> },
                        { label: "Cashless Services", value: diagnosticcenterdata?.hspInfo?.cashlessservices, icon: <CreditCard className="w-5 h-5" /> },
                        { label: "Government Schemes", value: diagnosticcenterdata?.hspInfo?.governmentschemes, icon: <FileText className="w-5 h-5" /> },
                        { label: "In-house Canteen", value: diagnosticcenterdata?.hspInfo?.inhousecanteen, icon: <Building2 className="w-5 h-5" /> },
                        { label: "24/7 Service", value: "Yes", icon: <Clock className="w-5 h-5" /> },
                        { label: "Pathology Lab", value: diagnosticcenterdata?.hspInfo?.pathology, icon: <TestTube className="w-5 h-5" /> },
                        { label: "Online Consultation", value: diagnosticcenterdata?.hspInfo?.onlineconsultation, icon: <Video className="w-5 h-5" /> },
                      ].map((facility, index) => {
                        const isAvailable = facility.value === "yes" || facility.value === "Yes";
                        return (
                          <div
                            key={index}
                            className={`flex items-center gap-4 p-4 rounded-lg ${
                              isAvailable ? "bg-green-50 border border-green-200" : "bg-gray-50 border border-gray-200"
                            } hover:shadow-md transition-shadow`}
                          >
                            <div className={`p-3 rounded-lg ${isAvailable ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                              {facility.icon}
          </div>
                            <div className="flex-1">
                              <span className="text-base font-semibold text-gray-900">{facility.label}</span>
                              <p className="text-sm text-gray-600">{isAvailable ? "Available" : "Not Available"}</p>
                            </div>
                            {isAvailable && <CheckCircle className="w-6 h-6 text-green-600" />}
                          </div>
                        );
                      })}
    </div>
  </CardContent>
</Card>
              )}

              {/* REVIEWS TAB */}
              {activeTab === 'reviews' && (
                <Card className="border border-gray-200 shadow-md rounded-xl">
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Patient Reviews</h3>
                    {reviews.length > 0 ? (
                      <>
                        <div className="text-center mb-8">
                          <div className="flex justify-center mb-4">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-8 h-8 ${
                                  i < Math.floor(avgRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                                }`}
                              />
                            ))}
            </div>
                          <p className="text-4xl font-bold text-gray-900 mb-2">{avgRating}</p>
                          <p className="text-gray-600 mb-2">
                            {avgRating >= 4.5 ? "Excellent" : avgRating >= 3.5 ? "Very Good" : "Good"}
                          </p>
                          <p className="text-gray-500 text-sm mb-2">{totalReviews} verified reviews</p>
                  </div>
                        <div className="max-w-2xl mx-auto space-y-4">
                          {reviews.slice(0, 5).map((review, index) => {
                            const patientName = review.patient?.firstName 
                              ? `${review.patient.firstName} ${review.patient.lastName || ''}`.trim()
                              : review.patientName || "Anonymous Patient";
                            const patientInitial = patientName.charAt(0).toUpperCase();
                            
                            const bgColors = [
                              "from-blue-50 to-indigo-50 border-blue-200",
                              "from-green-50 to-emerald-50 border-green-200",
                              "from-purple-50 to-pink-50 border-purple-200",
                              "from-orange-50 to-amber-50 border-orange-200",
                              "from-cyan-50 to-teal-50 border-cyan-200"
                            ];
                            
                            return (
                              <div key={review.id || index} className={`bg-gradient-to-r ${bgColors[index % 5]} p-6 rounded-lg border text-left`}>
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                                      {patientInitial}
                        </div>
                                    <div>
                                      <p className="font-semibold text-gray-900">{patientName}</p>
                                      <p className="text-sm text-gray-600">
                                        {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : "Recently"}
                                      </p>
                      </div>
                          </div>
                                  <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-4 h-4 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                                      />
                                    ))}
                        </div>
                          </div>
                                <p className="text-gray-700">
                                  {review.comment || "Great diagnostic center with excellent facilities and staff."}
                                </p>
                        </div>
                            );
                          })}
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No reviews yet</p>
                        <p className="text-gray-400 text-sm mt-2">Be the first to review this center</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* CONTACT TAB */}
              {activeTab === 'contact' && (
                <Card className="border border-gray-200 shadow-md rounded-xl">
                  <CardContent className="p-4 md:p-6">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Contact Information</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <Phone className="w-6 h-6 text-blue-600 mt-1" />
                        <div>
                          <h4 className="font-semibold text-blue-900 mb-1">Phone Numbers</h4>
                          <p className="text-gray-900 font-medium">{safeDisplay(diagnosticcenterdata?.hspcontact?.receptioncontact1 || diagnosticcenterdata?.mobile)}</p>
                          {diagnosticcenterdata?.hspcontact?.receptioncontact2 && (
                            <p className="text-gray-700 text-sm mt-1">Reception 2: {diagnosticcenterdata.hspcontact.receptioncontact2}</p>
                          )}
                          {diagnosticcenterdata?.hspcontact?.alternateno && (
                            <p className="text-gray-700 text-sm mt-1">Alternate: {diagnosticcenterdata.hspcontact.alternateno}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                        <Mail className="w-6 h-6 text-green-600 mt-1" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-green-900 mb-1">Email Addresses</h4>
                          <p className="text-gray-900 font-medium text-sm break-words">{safeDisplay(diagnosticcenterdata?.hspcontact?.receptionemail || diagnosticcenterdata?.email)}</p>
                          {diagnosticcenterdata?.email && diagnosticcenterdata.email !== diagnosticcenterdata?.hspcontact?.receptionemail && (
                            <p className="text-gray-700 text-sm mt-1 break-words">Official: {diagnosticcenterdata.email}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <MapPin className="w-6 h-6 text-purple-600 mt-1" />
                        <div>
                          <h4 className="font-semibold text-purple-900 mb-1">Center Address</h4>
                          <p className="text-gray-900 font-medium leading-relaxed">
                            {safeDisplay(displayAddress)}
                          </p>
                          {(displayCity || diagnosticcenterdata?.hspcontact?.taluka || diagnosticcenterdata?.hspcontact?.dist) && (
                            <p className="text-gray-700 mt-2">
                              {displayCity || ""}{diagnosticcenterdata?.hspcontact?.taluka ? `, ${diagnosticcenterdata.hspcontact.taluka}` : ""}{diagnosticcenterdata?.hspcontact?.dist ? `, ${diagnosticcenterdata.hspcontact.dist}` : ""}
                            </p>
                          )}
                          {(displayState || diagnosticcenterdata?.hspcontact?.pincode || diagnosticcenterdata?.pincode) && (
                            <p className="text-gray-700">
                              {displayState || ""} {diagnosticcenterdata?.hspcontact?.pincode || diagnosticcenterdata?.pincode ? `- ${diagnosticcenterdata.hspcontact.pincode || diagnosticcenterdata.pincode}` : ""}
                            </p>
                          )}
                          {diagnosticcenterdata?.hspbranches && diagnosticcenterdata.hspbranches.length > 0 && (
                            <p className="text-blue-600 text-sm mt-2 font-medium">
                              {diagnosticcenterdata.hspbranches.length} branch{diagnosticcenterdata.hspbranches.length > 1 ? 'es' : ''} available
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                        <Clock className="w-6 h-6 text-orange-600 mt-1" />
                        <div>
                          <h4 className="font-semibold text-orange-900 mb-1">Service Hours</h4>
                          <p className="text-gray-900 font-medium">24/7 Diagnostic Services</p>
                          <p className="text-gray-700 text-sm mt-1">Collection Center: Mon-Sat, 8:00 AM - 8:00 PM</p>
                      </div>
                    </div>
                      {diagnosticcenterdata?.hspcontact?.escalationmatrixsheet && (
                        <div className="flex items-start gap-4 p-4 bg-red-50 rounded-lg border border-red-200">
                          <FileText className="w-6 h-6 text-red-600 mt-1" />
                          <div className="flex-1">
                            <h4 className="font-semibold text-red-900 mb-1">Escalation Matrix</h4>
                            <a
                              href={diagnosticcenterdata.hspcontact.escalationmatrixsheet}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-red-600 hover:text-red-700 font-medium text-sm hover:underline"
                            >
                              Download Escalation Matrix
                            </a>
                          </div>
                        </div>
                      )}
                              </div>
                  </CardContent>
                </Card>
              )}

              {/* CENTER INFO TAB */}
              {activeTab === 'info' && (
                <div className="space-y-4">
                  {/* Center Information Card */}
                  <Card className="border border-gray-200 shadow-md rounded-xl">
                    <CardContent className="p-4">
                      <h3 className="text-base font-bold text-gray-900 mb-3">Center Information</h3>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-gray-50 p-2 rounded">
                          <span className="text-gray-600">Registration No:</span>
                          <p className="font-semibold text-gray-900 text-xs">{diagnosticcenterdata?.hspdetails?.hspregno || "N/A"}</p>
                              </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <span className="text-gray-600">Established:</span>
                          <p className="font-semibold text-gray-900 text-xs">{getYear(diagnosticcenterdata?.hspdetails?.hspregdate)}</p>
                            </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <span className="text-gray-600">Experience:</span>
                          <p className="font-semibold text-gray-900 text-xs">{diagnosticcenterdata?.hspInfo?.experience || "N/A"} years</p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <span className="text-gray-600">Status:</span>
                          <p className={`font-semibold text-xs ${diagnosticcenterdata?.approvalStatus === 'APPROVED' ? 'text-green-600' : 'text-yellow-600'}`}>
                            {diagnosticcenterdata?.approvalStatus || "PENDING"}
                          </p>
                        </div>
                      </div>
                      {diagnosticcenterdata?.hspdetails?.nabhnablapproved === "Yes" && (
                        <div className="mt-3 p-2 bg-green-50 rounded-lg border border-green-200">
                          <div className="flex items-center gap-2">
                            <Award className="w-4 h-4 text-green-600" />
                            <span className="font-semibold text-green-900 text-sm">NABL Accredited</span>
                          </div>
                          <p className="text-green-700 text-xs mt-1">{diagnosticcenterdata.hspdetails.nabhnabllevel}</p>
                      </div>
                    )}
                    </CardContent>
                  </Card>

                  {/* Management Team Card */}
                    {(diagnosticcenterdata?.hspcontact?.managername || diagnosticcenterdata?.hspcontact?.adminname) && (
                    <Card className="border border-gray-200 shadow-md rounded-xl">
                      <CardContent className="p-4">
                        <h3 className="text-base font-bold text-gray-900 mb-3">Management Team</h3>
                        <div className="space-y-2">
                          {diagnosticcenterdata?.hspcontact?.managername && (
                            <div className="p-2 bg-blue-50 rounded-lg">
                              <div className="flex items-center gap-2 mb-1">
                                <User className="w-4 h-4 text-blue-600" />
                                <span className="font-semibold text-blue-900 text-sm">Manager</span>
                              </div>
                              <p className="font-medium text-gray-900 text-sm">{diagnosticcenterdata.hspcontact.managername}</p>
                              <p className="text-xs text-blue-700">{diagnosticcenterdata.hspcontact.managercontact || "N/A"}</p>
                                </div>
                              )}
                          {diagnosticcenterdata?.hspcontact?.adminname && (
                            <div className="p-2 bg-green-50 rounded-lg">
                              <div className="flex items-center gap-2 mb-1">
                                <User className="w-4 h-4 text-green-600" />
                                <span className="font-semibold text-green-900 text-sm">Administrator</span>
                              </div>
                              <p className="font-medium text-gray-900 text-sm">{diagnosticcenterdata.hspcontact.adminname}</p>
                              <p className="text-xs text-green-700">{diagnosticcenterdata.hspcontact.admincontact || "N/A"}</p>
                                </div>
                              )}
                            </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Bank Details Card */}
                  {diagnosticcenterdata?.hspdetails?.bankname && (
                    <Card className="border border-gray-200 shadow-md rounded-xl">
                      <CardContent className="p-4">
                        <h3 className="text-base font-bold text-gray-900 mb-3">Bank Details</h3>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-gray-50 p-2 rounded">
                            <span className="text-gray-600">Bank:</span>
                            <p className="font-semibold text-gray-900 text-xs">{diagnosticcenterdata.hspdetails.bankname}</p>
                              </div>
                          {diagnosticcenterdata.hspdetails.bankaccountno && (
                            <div className="bg-gray-50 p-2 rounded">
                              <span className="text-gray-600">Account No:</span>
                              <p className="font-semibold text-gray-900 text-xs">****{diagnosticcenterdata.hspdetails.bankaccountno.slice(-4)}</p>
                                </div>
                              )}
                          <div className="bg-gray-50 p-2 rounded">
                            <span className="text-gray-600">Account Type:</span>
                            <p className="font-semibold text-gray-900 text-xs">{diagnosticcenterdata.hspdetails.accounttype}</p>
                                </div>
                          <div className="bg-gray-50 p-2 rounded">
                            <span className="text-gray-600">IFSC:</span>
                            <p className="font-semibold text-blue-600 text-xs">{diagnosticcenterdata.hspdetails.ifsccode}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                              )}
                            </div>
                          )}
                        </div>

            {/* Right Column - Only 2 Essential Cards */}
            <div className="space-y-4 order-1 lg:order-2">
              {/* Center Information Card */}
              <Card className="border border-gray-200 shadow-md rounded-xl">
                <CardContent className="p-4">
                  <h3 className="text-base font-bold text-gray-900 mb-3">Center Information</h3>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="text-gray-600">Registration No:</span>
                      <p className="font-semibold text-gray-900 text-xs">{diagnosticcenterdata?.hspdetails?.hspregno || "N/A"}</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="text-gray-600">Established:</span>
                      <p className="font-semibold text-gray-900 text-xs">{getYear(diagnosticcenterdata?.hspdetails?.hspregdate)}</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="text-gray-600">Experience:</span>
                      <p className="font-semibold text-gray-900 text-xs">{diagnosticcenterdata?.hspInfo?.experience || "N/A"} years</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="text-gray-600">Status:</span>
                      <p className={`font-semibold text-xs ${diagnosticcenterdata?.approvalStatus === 'APPROVED' ? 'text-green-600' : 'text-yellow-600'}`}>
                        {diagnosticcenterdata?.approvalStatus || "PENDING"}
                      </p>
                    </div>
                  </div>
                  {diagnosticcenterdata?.hspdetails?.nabhnablapproved === "Yes" && (
                    <div className="mt-3 p-2 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-green-600" />
                        <span className="font-semibold text-green-900 text-sm">NABL Accredited</span>
                      </div>
                      <p className="text-green-700 text-xs mt-1">{diagnosticcenterdata.hspdetails.nabhnabllevel}</p>
                      </div>
                    )}
                </CardContent>
              </Card>

              {/* Quick Contact Card */}
              <Card className="border border-gray-200 shadow-md rounded-xl">
                <CardContent className="p-4">
                  <h3 className="text-base font-bold text-gray-900 mb-3">Quick Contact</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                      <Phone className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">{safeDisplay(diagnosticcenterdata?.hspcontact?.receptioncontact1 || diagnosticcenterdata?.mobile)}</p>
                        <p className="text-xs text-gray-600">Reception</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                      <Mail className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 text-xs truncate">{safeDisplay(diagnosticcenterdata?.hspcontact?.receptionemail || diagnosticcenterdata?.email)}</p>
                        <p className="text-xs text-gray-600">Email</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 p-2 bg-purple-50 rounded-lg">
                      <MapPin className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 text-xs line-clamp-2">
                          {safeDisplay(displayAddress)}
                        </p>
                        <p className="text-xs text-gray-600 truncate">{safeDisplay(displayCity, "City")}, {safeDisplay(displayState, "State")}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

           {/* Our Services Section - Professional & Enhanced */}
           <div className="max-w-6xl mx-auto my-6">
            {/* Main Card */}
            <Card className="border border-gray-100 shadow-xl rounded-2xl overflow-hidden transition-all hover:shadow-2xl">
                <CardContent className="p-0">
                 {/* Header Section */}
                 <div className="bg-gradient-to-r from-blue-700 to-indigo-700 py-4 px-4 text-center">
                   <h2 className="text-2xl font-bold text-white tracking-tight">
                     Our Services
                   </h2>
                   <p className="text-blue-100 mt-1 text-xs sm:text-sm">
                     Comprehensive diagnostic solutions for all your needs
                   </p>
                  </div>

                 {/* Service Grid */}
                 <div className="p-4 sm:p-6 bg-gray-50">
                   <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
                     {[
                       { icon: <TestTube className="w-5 h-5 text-blue-600" />, label: "Diagnostic Tests", value: diagnosticcenterdata?.diagnosticServices?.length || "50+", clickable: true },
                       { icon: <Award className="w-5 h-5 text-green-600" />, label: "NABL Certified", value: "Certified", clickable: true },
                       { icon: <Clock className="w-5 h-5 text-orange-600" />, label: "Service Hours", value: "24/7", clickable: true },
                       { icon: <Shield className="w-5 h-5 text-indigo-600" />, label: "Diagnostic Services", value: "Advanced", clickable: true },
                      { icon: <Building2 className="w-5 h-5 text-purple-600" />, label: "Govt Schemes", value: "Available", clickable: true },
                      { icon: <Stethoscope className="w-5 h-5 text-red-600" />, label: "Pathology", value: "NABL", clickable: true },
                      { icon: <Video className="w-5 h-5 text-blue-600" />, label: "Online Consultation", value: "Available", clickable: true },
                      { icon: <Users className="w-5 h-5 text-cyan-600" />, label: "Experience", value: diagnosticcenterdata?.hspInfo?.experience ? `${diagnosticcenterdata.hspInfo.experience}+ Years` : "10+", clickable: true },
                      { icon: <CreditCard className="w-5 h-5 text-orange-600" />, label: "Cashless Services", value: "Available", clickable: true },
                      { icon: <User className="w-5 h-5 text-emerald-600" />, label: "Home Collection", value: "Available" },
                      ...(diagnosticcenterdata?.hspdetails?.nabhnablapproved === "Yes"
                        ? [{ icon: <Award className="w-5 h-5 text-green-600" />, label: "NABL Accredited", value: diagnosticcenterdata.hspdetails.nabhnabllevel }]
                        : []),
                      { icon: <Building2 className="w-5 h-5 text-amber-600" />, label: "Inhouse Canteen", value: "Available", clickable: true },
                       { icon: <Star className="w-5 h-5 text-yellow-600" />, label: "Reviews", value: `${avgRating} ★`, clickable: true },
                     ].map((item, idx) => (
                       <div
                         key={idx}
                         onClick={item.clickable ? () => {
                           if (item.label === "Diagnostic Tests") {
                             setTestsDialogOpen(true);
                           } else if (item.label === "Service Hours") {
                             setServiceHoursDialogOpen(true);
                           } else if (item.label === "NABL Certified") {
                             setNablDialogOpen(true);
                           } else if (item.label === "Diagnostic Services") {
                             setServicesDialogOpen(true);
                           } else if (item.label === "Govt Schemes") {
                             setGovtSchemesDialogOpen(true);
                           } else if (item.label === "Pathology") {
                             setPathologyDialogOpen(true);
                           } else if (item.label === "Online Consultation") {
                             setOnlineConsultationDialogOpen(true);
                           } else if (item.label === "Experience") {
                             setExperienceDialogOpen(true);
                           } else if (item.label === "Cashless Services") {
                             setCashlessDialogOpen(true);
                           } else if (item.label === "Inhouse Canteen") {
                             setCanteenDialogOpen(true);
                           } else if (item.label === "Reviews") {
                             setReviewsDialogOpen(true);
                           }
                         } : undefined}
                         className={`bg-white p-2 sm:p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all text-center flex flex-col items-center justify-center min-h-[85px] sm:min-h-[95px] ${item.clickable ? 'cursor-pointer hover:border-blue-400 hover:scale-105' : ''}`}
                       >
                         <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-50 mb-1.5 sm:mb-2">
                           {item.icon}
                         </div>
                         <h3 className="font-semibold text-gray-900 text-[10px] sm:text-xs mb-0.5 leading-tight line-clamp-2">
                           {item.label}
                         </h3>
                         <p className="font-bold text-blue-700 text-[10px] sm:text-xs">
                           {item.value}
                         </p>
                       </div>
                     ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>

      {/* Mobile & Tablet View - Show on small and medium screens */}
      <div className="block lg:hidden">
        {/* Clean Mobile Header */}
        <div className="px-4 py-5 shadow-lg" style={{ background: '#3D85EF' }}>
          <div className="flex items-center gap-3 mb-3">
            {diagnosticcenterdata?.hspdetails?.hsplogo && (
              <div className="w-14 h-14 rounded-lg overflow-hidden border-2 border-white/40 shadow-md bg-white flex-shrink-0">
                <Image
                  src={diagnosticcenterdata.hspdetails.hsplogo}
                  width={56}
                  height={56}
                  alt="Diagnostic Center Logo"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-white line-clamp-2 mb-1">
                {diagnosticcenterdata?.hspInfo?.regname || "Diagnostic Center"}
              </h1>
              <div className="flex items-center gap-1.5 text-white/90 text-xs">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">
                  {safeDisplay(displayCity, "City")}, {safeDisplay(displayState, "State")}
                </span>
              </div>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center justify-between bg-white/20 backdrop-blur-md rounded-lg px-4 py-2.5 border border-white/30">
            <div className="flex items-center gap-1.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(avgRating) ? "text-yellow-300 fill-yellow-300" : "text-white/30"
                  }`}
                />
              ))}
            </div>
            <div className="flex items-center gap-2 text-white">
              <span className="font-bold text-lg">{avgRating}</span>
              <span className="text-sm">({totalReviews})</span>
            </div>
          </div>
        </div>

        {/* Mobile & Tablet Content */}
        <div className="px-3 py-4 space-y-4 bg-gray-50">
          {/* Mobile Photo Gallery */}
          <div className="space-y-2">
            {images.length > 0 ? (
              <>
                <div className="relative h-56 md:h-64 w-full rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src={mainImage}
                    fill
                    priority
                    quality={90}
                    className="object-cover"
                    alt="Diagnostic Center Main View"
                  />
                  {images.length > 1 && (
                    <div className="absolute bottom-3 left-3 bg-black/70 text-white px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5 font-medium">
                      <Camera className="w-3 h-3" />
                      {images.length} photos
                    </div>
                  )}
                </div>
                {images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {images.slice(1, 5).map((image, index) => (
                      <div key={index} className="relative h-16 md:h-20 w-full rounded-lg overflow-hidden shadow-sm">
                        <Image
                          src={image}
                          fill
                          quality={85}
                          className="object-cover"
                          alt={`Diagnostic Center Image ${index + 2}`}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="relative h-56 md:h-64 w-full rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
                <div className="text-center p-6">
                  <TestTube className="w-16 h-16 text-blue-400 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-gray-700 mb-1">Diagnostic Center</h3>
                  <p className="text-gray-500 text-sm">Images will be available soon</p>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setDialogOpen(true)}
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-md text-sm md:text-base flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4 md:w-5 md:h-5" />
              BOOK NOW
            </button>
            <button
              onClick={() => {
                const phone = diagnosticcenterdata?.hspcontact?.receptioncontact1 || diagnosticcenterdata?.mobile;
                if (phone) {
                  window.open(`tel:${phone}`, '_self');
                } else {
                  alert('Phone number not available');
                }
              }}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-md text-sm md:text-base flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 md:w-5 md:h-5" />
              CALL NOW
            </button>
                  </div>
                  
          {/* Mobile Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex overflow-x-auto scrollbar-hide">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'services', label: 'Services' },
                { id: 'facilities', label: 'Facilities' },
                { id: 'reviews', label: 'Reviews' },
                { id: 'contact', label: 'Contact' },
                { id: 'info', label: 'Info' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 py-3 px-4 font-medium text-xs md:text-sm whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-500'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
                          </div>
          </div>

          {/* Mobile Tab Content - Similar to desktop but with mobile styling */}
          <div className="space-y-4">
            {/* OVERVIEW TAB - Mobile */}
            {activeTab === 'overview' && (
              <Card className="border border-gray-200 shadow-sm rounded-xl">
                <CardContent className="p-4">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3">About {diagnosticcenterdata?.hspInfo?.regname}</h3>
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">
                    {diagnosticcenterdata?.hspInfo?.regname} is a leading diagnostic center{diagnosticcenterdata?.hspInfo?.experience ? ` with ${diagnosticcenterdata.hspInfo.experience} years of experience` : ''} in providing quality diagnostic services.
                    Located in {safeDisplay(displayCity, "your area")}, {safeDisplay(displayState, "")}, we are committed to
                    excellence in healthcare delivery with state-of-the-art equipment{diagnosticcenterdata?.diagnosticServices?.length > 0 ? ` and ${diagnosticcenterdata.diagnosticServices.length} specialized diagnostic services` : ''}.
                  </p>
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-blue-900 text-sm">Center Status</h4>
                        <p className="text-blue-700 text-xs break-words">
                          Reg: {diagnosticcenterdata?.hspdetails?.hspregno} | 
                          Est: {getYear(diagnosticcenterdata?.hspdetails?.hspregdate)} | 
                          <span className={`font-semibold ${diagnosticcenterdata?.approvalStatus === 'APPROVED' ? 'text-green-600' : 'text-yellow-600'}`}>
                            {diagnosticcenterdata?.approvalStatus || "PENDING"}
                          </span>
                        </p>
                        {diagnosticcenterdata?.hspdetails?.nabhnablapproved === "Yes" && (
                          <p className="text-blue-700 text-xs mt-1 flex items-center gap-1">
                            <Award className="w-3 h-3" />
                            NABL Accredited - {diagnosticcenterdata?.hspdetails?.nabhnabllevel}
                          </p>
                        )}
                          </div>
                        </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { icon: <TestTube className="w-4 h-4" />, label: "Total Tests", value: diagnosticcenterdata?.diagnosticServices?.length || "N/A" },
                      { icon: <Clock className="w-4 h-4" />, label: "Service Hours", value: "24/7" },
                      { icon: <Award className="w-4 h-4" />, label: "Certification", value: "NABL" },
                      { icon: <Users className="w-4 h-4" />, label: "Experience", value: diagnosticcenterdata?.hspInfo?.experience ? `${diagnosticcenterdata.hspInfo.experience}+ Years` : "N/A" },
                    ].map((stat, index) => (
                      <div key={index} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="p-1.5 bg-blue-100 rounded-lg flex-shrink-0">
                            <div className="text-blue-600">{stat.icon}</div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-base font-bold text-gray-900">{stat.value}</p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600">{stat.label}</p>
                      </div>
                    ))}
                      </div>
                    </CardContent>
                  </Card>
            )}

            {/* SERVICES TAB - Mobile */}
            {activeTab === 'services' && (
              <Card className="border border-gray-200 shadow-sm rounded-xl">
                <CardContent className="p-4">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Diagnostic Services & Pricing</h3>

                  {/* Diagnostic Categories */}
                  {diagnosticcenterdata?.hspInfo?.hspcategory && (
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-3 border border-indigo-200 mb-4">
                      <h4 className="text-base font-bold text-indigo-900 mb-2 flex items-center gap-2">
                        <TestTube className="h-4 w-4" />
                        Available Categories
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {diagnosticcenterdata.hspInfo.hspcategory.map((cat, idx) => (
                          <Badge key={idx} className="bg-indigo-100 text-indigo-800 border border-indigo-300 text-xs">
                            {cat.diagnosticcategory?.title || `Category ${idx + 1}`}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Diagnostic Services with Pricing */}
                  {diagnosticcenterdata?.diagnosticServices?.length > 0 ? (
                    <div className="space-y-3">
                      {diagnosticcenterdata.diagnosticServices.map((service, idx) => (
                        <div
                          key={idx}
                          className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm"
                        >
                          <div className="flex items-start justify-between mb-3 gap-2">
                            <div className="flex-1 min-w-0">
                              <h5 className="font-bold text-gray-900 text-sm">{service.facility}</h5>
                              <p className="text-blue-600 font-medium text-xs">{service.category}</p>
                              <p className="text-xs text-gray-600">{service.subCategory}</p>
                            </div>
                            <Badge className={`${service.available ? 'bg-green-100 text-green-800 border-green-300' : 'bg-red-100 text-red-800 border-red-300'} text-xs whitespace-nowrap flex-shrink-0`}>
                              {service.available ? 'Available' : 'Unavailable'}
                            </Badge>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="bg-blue-50 rounded-lg p-2">
                                <p className="text-xs text-blue-600 font-medium">Min Price</p>
                                <p className="text-base font-bold text-blue-900">₹{service.minPrice}</p>
                              </div>
                              <div className="bg-purple-50 rounded-lg p-2">
                                <p className="text-xs text-purple-600 font-medium">Max Price</p>
                                <p className="text-base font-bold text-purple-900">₹{service.maxPrice}</p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2">
                              <div className="bg-green-50 rounded-lg p-2">
                                <p className="text-xs text-green-600 font-medium">Final Price</p>
                                <p className="text-base font-bold text-green-900">
                                  {service.finalPrice ? `₹${service.finalPrice}` : "Call for Price"}
                                </p>
                              </div>
                              <div className="bg-orange-50 rounded-lg p-2">
                                <p className="text-xs text-orange-600 font-medium">Discount</p>
                                <p className="text-base font-bold text-orange-900">
                                  {service.discount ? `${service.discount}%` : "No discount"}
                                </p>
                              </div>
                            </div>
                            
                            {service.machinemodel && (
                              <div className="bg-gray-50 rounded-lg p-2">
                                <p className="text-xs text-gray-600 font-medium">Equipment</p>
                                <p className="text-sm font-semibold text-gray-800">{service.machinemodel}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <TestTube className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 text-sm">No services available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* FACILITIES TAB - Mobile */}
            {activeTab === 'facilities' && (
              <Card className="border border-gray-200 shadow-sm rounded-xl">
                <CardContent className="p-4">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Center Facilities</h3>
                  <div className="space-y-2">
                    {[
                      { label: "Diagnostic Services", value: diagnosticcenterdata?.hspInfo?.diagnosticservices, icon: <Shield className="w-4 h-4" /> },
                      { label: "Cashless Services", value: diagnosticcenterdata?.hspInfo?.cashlessservices, icon: <CreditCard className="w-4 h-4" /> },
                      { label: "Government Schemes", value: diagnosticcenterdata?.hspInfo?.governmentschemes, icon: <FileText className="w-4 h-4" /> },
                      { label: "In-house Canteen", value: diagnosticcenterdata?.hspInfo?.inhousecanteen, icon: <Building2 className="w-4 h-4" /> },
                      { label: "24/7 Service", value: "Yes", icon: <Clock className="w-4 h-4" /> },
                      { label: "Pathology Lab", value: diagnosticcenterdata?.hspInfo?.pathology, icon: <TestTube className="w-4 h-4" /> },
                      { label: "Online Consultation", value: diagnosticcenterdata?.hspInfo?.onlineconsultation, icon: <Video className="w-4 h-4" /> },
                    ].map((facility, index) => {
                      const isAvailable = facility.value === "yes" || facility.value === "Yes";
                      return (
                        <div
                          key={index}
                          className={`flex items-center gap-3 p-3 rounded-lg ${
                            isAvailable ? "bg-green-50 border border-green-200" : "bg-gray-50 border border-gray-200"
                          }`}
                        >
                          <div className={`p-2 rounded-lg flex-shrink-0 ${isAvailable ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                            {facility.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-semibold text-gray-900 block">{facility.label}</span>
                            <p className="text-xs text-gray-600">{isAvailable ? "Available" : "Not Available"}</p>
                          </div>
                          {isAvailable && <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* REVIEWS TAB - Mobile */}
            {activeTab === 'reviews' && (
              <Card className="border border-gray-200 shadow-sm rounded-xl">
                <CardContent className="p-4">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Patient Reviews</h3>
                  {reviews.length > 0 ? (
                    <>
                      <div className="text-center mb-6">
                        <div className="flex justify-center mb-3">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-6 h-6 ${
                                i < Math.floor(avgRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-3xl font-bold text-gray-900 mb-1">{avgRating}</p>
                        <p className="text-gray-600 text-sm mb-1">
                          {avgRating >= 4.5 ? "Excellent" : avgRating >= 3.5 ? "Very Good" : "Good"}
                        </p>
                        <p className="text-gray-500 text-xs">{totalReviews} verified reviews</p>
                      </div>
                      <div className="space-y-3">
                        {reviews.slice(0, 5).map((review, index) => {
                          const patientName = review.patient?.firstName 
                            ? `${review.patient.firstName} ${review.patient.lastName || ''}`.trim()
                            : review.patientName || "Anonymous Patient";
                          const patientInitial = patientName.charAt(0).toUpperCase();
                          
                          const bgColors = [
                            "from-blue-50 to-indigo-50 border-blue-200",
                            "from-green-50 to-emerald-50 border-green-200",
                            "from-purple-50 to-pink-50 border-purple-200",
                            "from-orange-50 to-amber-50 border-orange-200",
                            "from-cyan-50 to-teal-50 border-cyan-200"
                          ];
                          
                          return (
                            <div key={review.id || index} className={`bg-gradient-to-r ${bgColors[index % 5]} p-4 rounded-lg border`}>
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm flex-shrink-0">
                                    {patientInitial}
                                  </div>
                                  <div>
                                    <p className="font-semibold text-gray-900 text-sm">{patientName}</p>
                                    <p className="text-xs text-gray-600">
                                      {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : "Recently"}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex flex-shrink-0">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-3 h-3 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-gray-700 text-sm">
                                {review.comment || "Great diagnostic center with excellent facilities and staff."}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-base">No reviews yet</p>
                      <p className="text-gray-400 text-xs mt-1">Be the first to review this center</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* CONTACT TAB - Mobile */}
            {activeTab === 'contact' && (
              <Card className="border border-gray-200 shadow-sm rounded-xl">
                <CardContent className="p-4">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <Phone className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-blue-900 mb-1 text-sm">Phone Numbers</h4>
                        <p className="text-gray-900 font-medium text-sm">{safeDisplay(diagnosticcenterdata?.hspcontact?.receptioncontact1 || diagnosticcenterdata?.mobile)}</p>
                        {diagnosticcenterdata?.hspcontact?.receptioncontact2 && (
                          <p className="text-gray-700 text-xs mt-1">Reception 2: {diagnosticcenterdata.hspcontact.receptioncontact2}</p>
                        )}
                        {diagnosticcenterdata?.hspcontact?.alternateno && (
                          <p className="text-gray-700 text-xs mt-1">Alternate: {diagnosticcenterdata.hspcontact.alternateno}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <Mail className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-green-900 mb-1 text-sm">Email Addresses</h4>
                        <p className="text-gray-900 font-medium text-xs break-words">{safeDisplay(diagnosticcenterdata?.hspcontact?.receptionemail || diagnosticcenterdata?.email)}</p>
                        {diagnosticcenterdata?.email && diagnosticcenterdata.email !== diagnosticcenterdata?.hspcontact?.receptionemail && (
                          <p className="text-gray-700 text-xs mt-1 break-words">Official: {diagnosticcenterdata.email}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <MapPin className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-purple-900 mb-1 text-sm">Center Address</h4>
                        <p className="text-gray-900 font-medium leading-relaxed text-sm">
                          {safeDisplay(displayAddress)}
                        </p>
                        {(displayCity || diagnosticcenterdata?.hspcontact?.taluka || diagnosticcenterdata?.hspcontact?.dist) && (
                          <p className="text-gray-700 mt-1 text-xs">
                            {displayCity || ""}{diagnosticcenterdata?.hspcontact?.taluka ? `, ${diagnosticcenterdata.hspcontact.taluka}` : ""}{diagnosticcenterdata?.hspcontact?.dist ? `, ${diagnosticcenterdata.hspcontact.dist}` : ""}
                          </p>
                        )}
                        {(displayState || diagnosticcenterdata?.hspcontact?.pincode || diagnosticcenterdata?.pincode) && (
                          <p className="text-gray-700 text-xs">
                            {displayState || ""} {diagnosticcenterdata?.hspcontact?.pincode || diagnosticcenterdata?.pincode ? `- ${diagnosticcenterdata.hspcontact.pincode || diagnosticcenterdata.pincode}` : ""}
                          </p>
                        )}
                        {diagnosticcenterdata?.hspbranches && diagnosticcenterdata.hspbranches.length > 0 && (
                          <p className="text-blue-600 text-xs mt-1 font-medium">
                            {diagnosticcenterdata.hspbranches.length} branch{diagnosticcenterdata.hspbranches.length > 1 ? 'es' : ''} available
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <Clock className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-orange-900 mb-1 text-sm">Service Hours</h4>
                        <p className="text-gray-900 font-medium text-sm">24/7 Diagnostic Services</p>
                        <p className="text-gray-700 text-xs mt-1">Collection Center: Mon-Sat, 8:00 AM - 8:00 PM</p>
                      </div>
                    </div>
                    {diagnosticcenterdata?.hspcontact?.escalationmatrixsheet && (
                      <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                        <FileText className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-red-900 mb-1 text-sm">Escalation Matrix</h4>
                          <a
                            href={diagnosticcenterdata.hspcontact.escalationmatrixsheet}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-red-600 hover:text-red-700 font-medium text-xs hover:underline"
                          >
                            Download Escalation Matrix
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* INFO TAB - Mobile */}
            {activeTab === 'info' && (
              <div className="space-y-3">
                {/* Center Information Card */}
                <Card className="border border-gray-200 shadow-sm rounded-xl">
                  <CardContent className="p-4">
                    <h3 className="text-base font-bold text-gray-900 mb-3">Center Information</h3>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-gray-50 p-2 rounded">
                        <span className="text-gray-600">Registration No:</span>
                        <p className="font-semibold text-gray-900 text-xs">{diagnosticcenterdata?.hspdetails?.hspregno || "N/A"}</p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <span className="text-gray-600">Established:</span>
                        <p className="font-semibold text-gray-900 text-xs">{getYear(diagnosticcenterdata?.hspdetails?.hspregdate)}</p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <span className="text-gray-600">Experience:</span>
                        <p className="font-semibold text-gray-900 text-xs">{diagnosticcenterdata?.hspInfo?.experience || "N/A"} years</p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <span className="text-gray-600">Status:</span>
                        <p className={`font-semibold text-xs ${diagnosticcenterdata?.approvalStatus === 'APPROVED' ? 'text-green-600' : 'text-yellow-600'}`}>
                          {diagnosticcenterdata?.approvalStatus || "PENDING"}
                        </p>
                      </div>
                    </div>
                    {diagnosticcenterdata?.hspdetails?.nabhnablapproved === "Yes" && (
                      <div className="mt-3 p-2 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-green-600" />
                          <span className="font-semibold text-green-900 text-sm">NABL Accredited</span>
                        </div>
                        <p className="text-green-700 text-xs mt-1">{diagnosticcenterdata.hspdetails.nabhnabllevel}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Management Team Card */}
                {(diagnosticcenterdata?.hspcontact?.managername || diagnosticcenterdata?.hspcontact?.adminname) && (
                  <Card className="border border-gray-200 shadow-sm rounded-xl">
                    <CardContent className="p-4">
                      <h3 className="text-base font-bold text-gray-900 mb-3">Management Team</h3>
                      <div className="space-y-2">
                        {diagnosticcenterdata?.hspcontact?.managername && (
                          <div className="p-2 bg-blue-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <User className="w-4 h-4 text-blue-600" />
                              <span className="font-semibold text-blue-900 text-sm">Manager</span>
                            </div>
                            <p className="font-medium text-gray-900 text-sm">{diagnosticcenterdata.hspcontact.managername}</p>
                            <p className="text-xs text-blue-700">{diagnosticcenterdata.hspcontact.managercontact || "N/A"}</p>
                          </div>
                        )}
                        {diagnosticcenterdata?.hspcontact?.adminname && (
                          <div className="p-2 bg-green-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <User className="w-4 h-4 text-green-600" />
                              <span className="font-semibold text-green-900 text-sm">Administrator</span>
                            </div>
                            <p className="font-medium text-gray-900 text-sm">{diagnosticcenterdata.hspcontact.adminname}</p>
                            <p className="text-xs text-green-700">{diagnosticcenterdata.hspcontact.admincontact || "N/A"}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Bank Details Card */}
                {diagnosticcenterdata?.hspdetails?.bankname && (
                  <Card className="border border-gray-200 shadow-sm rounded-xl">
                    <CardContent className="p-4">
                      <h3 className="text-base font-bold text-gray-900 mb-3">Bank Details</h3>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-gray-50 p-2 rounded">
                          <span className="text-gray-600">Bank:</span>
                          <p className="font-semibold text-gray-900 text-xs">{diagnosticcenterdata.hspdetails.bankname}</p>
                        </div>
                        {diagnosticcenterdata.hspdetails.bankaccountno && (
                          <div className="bg-gray-50 p-2 rounded">
                            <span className="text-gray-600">Account No:</span>
                            <p className="font-semibold text-gray-900 text-xs">****{diagnosticcenterdata.hspdetails.bankaccountno.slice(-4)}</p>
                          </div>
                        )}
                        <div className="bg-gray-50 p-2 rounded">
                          <span className="text-gray-600">Account Type:</span>
                          <p className="font-semibold text-gray-900 text-xs">{diagnosticcenterdata.hspdetails.accounttype}</p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <span className="text-gray-600">IFSC:</span>
                          <p className="font-semibold text-blue-600 text-xs">{diagnosticcenterdata.hspdetails.ifsccode}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>

           {/* Mobile Services Grid */}
           <Card className="border border-gray-200 shadow-md rounded-xl overflow-hidden">
             <CardContent className="p-0">
               <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3">
                 <h2 className="text-lg font-bold text-white text-center">Our Services</h2>
                 <p className="text-blue-100 text-center text-xs mt-0.5">
                   Comprehensive diagnostic solutions
                 </p>
               </div>
               <div className="p-3">
                 <div className="grid grid-cols-3 gap-2">
                   {[
                     { icon: <TestTube className="w-4 h-4 text-blue-600" />, label: "Tests", value: diagnosticcenterdata?.diagnosticServices?.length || "50+", clickable: true },
                     { icon: <Award className="w-4 h-4 text-green-600" />, label: "NABL", value: "Certified", clickable: true },
                     { icon: <Clock className="w-4 h-4 text-orange-600" />, label: "Service", value: "24/7", clickable: true },
                     { icon: <Shield className="w-4 h-4 text-indigo-600" />, label: "Diagnostics", value: "Advanced", clickable: true },
                     { icon: <Building2 className="w-4 h-4 text-purple-600" />, label: "Schemes", value: "Available", clickable: true },
                     { icon: <Stethoscope className="w-4 h-4 text-red-600" />, label: "Pathology", value: "NABL", clickable: true },
                     { icon: <Video className="w-4 h-4 text-blue-600" />, label: "Online", value: "Available", clickable: true },
                     { icon: <Users className="w-4 h-4 text-cyan-600" />, label: "Experience", value: diagnosticcenterdata?.hspInfo?.experience ? `${diagnosticcenterdata.hspInfo.experience}+ Yrs` : "10+", clickable: true },
                     { icon: <CreditCard className="w-4 h-4 text-orange-600" />, label: "Cashless", value: "Available", clickable: true },
                     { icon: <User className="w-4 h-4 text-emerald-600" />, label: "Home", value: "Available" },
                     ...(diagnosticcenterdata?.hspdetails?.nabhnablapproved === "Yes"
                       ? [{ icon: <Award className="w-4 h-4 text-green-600" />, label: "NABL", value: diagnosticcenterdata.hspdetails.nabhnabllevel }]
                       : []),
                     { icon: <Building2 className="w-4 h-4 text-amber-600" />, label: "Canteen", value: "Available", clickable: true },
                     { icon: <Star className="w-4 h-4 text-yellow-600" />, label: "Rating", value: `${avgRating} ★`, clickable: true },
                   ].map((item, idx) => (
                     <div
                       key={idx}
                       onClick={item.clickable ? () => {
                         if (item.label === "Tests") {
                           setTestsDialogOpen(true);
                         } else if (item.label === "Service") {
                           setServiceHoursDialogOpen(true);
                         } else if (item.label === "NABL") {
                           setNablDialogOpen(true);
                         } else if (item.label === "Diagnostics") {
                           setServicesDialogOpen(true);
                         } else if (item.label === "Schemes") {
                           setGovtSchemesDialogOpen(true);
                         } else if (item.label === "Pathology") {
                           setPathologyDialogOpen(true);
                         } else if (item.label === "Online") {
                           setOnlineConsultationDialogOpen(true);
                         } else if (item.label === "Experience") {
                           setExperienceDialogOpen(true);
                         } else if (item.label === "Cashless") {
                           setCashlessDialogOpen(true);
                         } else if (item.label === "Canteen") {
                           setCanteenDialogOpen(true);
                         } else if (item.label === "Rating") {
                           setReviewsDialogOpen(true);
                         }
                       } : undefined}
                       className={`bg-white p-2 rounded-lg border border-gray-200 shadow-sm text-center min-h-[70px] flex flex-col justify-center items-center ${item.clickable ? 'cursor-pointer hover:border-blue-400 hover:shadow-md active:scale-95 transition-all' : ''}`}
                     >
                       <div className="mb-1">{item.icon}</div>
                       <h3 className="font-bold text-gray-900 text-[9px] leading-tight line-clamp-2 mb-0.5">{item.label}</h3>
                       <p className="font-semibold text-[9px] text-blue-700">{item.value}</p>
                     </div>
                   ))}
                </div>
              </div>
                </CardContent>
              </Card>

          {/* Mobile Emergency Section */}
          <Card className="border-2 border-red-500 shadow-lg rounded-xl bg-gradient-to-r from-red-600 to-orange-600 overflow-hidden">
            <CardContent className="p-4">
              <div className="flex flex-col gap-4 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center animate-pulse flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
            </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold">24/7 Service</h3>
                    <p className="text-red-100 text-xs">Always here for urgent needs</p>
          </div>
        </div>
                <div className="flex flex-col gap-2">
                  <a
                    href={`tel:${diagnosticcenterdata?.hspcontact?.receptioncontact1 || diagnosticcenterdata?.mobile || ''}`}
                    className="bg-white text-red-600 hover:bg-red-50 font-bold py-3 px-4 rounded-lg transition-all shadow-md text-center text-sm"
                  >
                    📞 Call: {safeDisplay(diagnosticcenterdata?.hspcontact?.receptioncontact1 || diagnosticcenterdata?.mobile, "Not Available")}
                  </a>
                  <button
                    onClick={() => setDialogOpen(true)}
                    className="bg-white/20 border-2 border-white text-white hover:bg-white/30 font-semibold py-3 px-4 rounded-lg transition-all text-center text-sm"
                  >
                    Book Test Now
                  </button>
      </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Diagnostic Tests Dialog */}
      <DiagnosticTestsList
        open={testsDialogOpen}
        onOpenChange={setTestsDialogOpen}
        diagnosticServices={diagnosticcenterdata?.diagnosticServices || []}
      />

      {/* Diagnostic Services Dialog */}
      <DiagnosticServicesList
        open={servicesDialogOpen}
        onOpenChange={setServicesDialogOpen}
        diagnosticServices={diagnosticcenterdata?.diagnosticServices || []}
      />

      {/* Service Hours Dialog */}
      <ServiceHoursList
        open={serviceHoursDialogOpen}
        onOpenChange={setServiceHoursDialogOpen}
        diagnosticCenterData={diagnosticcenterdata}
      />

      {/* NABL Certified Dialog */}
      <NABLCertifiedList
        open={nablDialogOpen}
        onOpenChange={setNablDialogOpen}
        diagnosticCenterData={diagnosticcenterdata}
      />

      {/* Government Schemes Dialog */}
      <GovtSchemesList
        isOpen={govtSchemesDialogOpen}
        onClose={() => setGovtSchemesDialogOpen(false)}
        govtSchemesData={diagnosticcenterdata?.hspInfo?.governmentschemes}
        centerName={diagnosticcenterdata?.hspInfo?.regname || "this center"}
      />

      {/* Pathology Dialog */}
      <PathologyList
        isOpen={pathologyDialogOpen}
        onClose={() => setPathologyDialogOpen(false)}
        pathologyData={diagnosticcenterdata?.hspInfo?.pathology}
        centerName={diagnosticcenterdata?.hspInfo?.regname || "this center"}
      />

      {/* Online Consultation Dialog */}
      <OnlineConsultationList
        isOpen={onlineConsultationDialogOpen}
        onClose={() => setOnlineConsultationDialogOpen(false)}
        consultationData={diagnosticcenterdata?.onlineConsultation || []}
        centerName={diagnosticcenterdata?.hspInfo?.regname || "this center"}
      />

      {/* Experience Dialog */}
      <ExperienceList
        isOpen={experienceDialogOpen}
        onClose={() => setExperienceDialogOpen(false)}
        experienceData={diagnosticcenterdata?.experience || []}
        centerName={diagnosticcenterdata?.hspInfo?.regname || "this center"}
      />

      {/* Cashless Services Dialog */}
      <CashlessServicesList
        isOpen={cashlessDialogOpen}
        onClose={() => setCashlessDialogOpen(false)}
        cashlessData={diagnosticcenterdata?.cashlessServices || []}
        centerName={diagnosticcenterdata?.hspInfo?.regname || "this center"}
      />

      {/* Inhouse Canteen Dialog */}
      <InhouseCanteenList
        isOpen={canteenDialogOpen}
        onClose={() => setCanteenDialogOpen(false)}
        canteenData={diagnosticcenterdata?.inhouseCanteen || []}
        centerName={diagnosticcenterdata?.hspInfo?.regname || "this center"}
      />

      {/* Reviews Dialog */}
      <ReviewsList
        isOpen={reviewsDialogOpen}
        onClose={() => setReviewsDialogOpen(false)}
        reviewsData={reviews}
        centerName={diagnosticcenterdata?.hspInfo?.regname || "this center"}
      />

      {/* Book Diagnostic Service Dialog */}
      <BookDiagnosticDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        diagnosticServices={diagnosticcenterdata?.diagnosticServices || []}
        diagnosticCenterId={diagnosticcenterdata?.id}
        patientId={patientId}
        serviceId={serviceId}
      />
    </div>
  );
};

export default DiagnosticCenterSingleView;
