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
  Video,
  Mail,
  Award,
  Building2,
  Users,
  CreditCard,
  FileText,
  User,
  Calendar,
  CheckCircle,
  Camera,
  Heart,
  Home,
  Activity,
  IndianRupee,
  Stethoscope,
  ArrowRight,
  BusFront,
  Plane,
  Train,
  Landmark,
  Route
} from "lucide-react";
import { FaAmbulance } from "react-icons/fa";
import BookHomeHealthcareDialog from "./bookhomehealthcare";
import HomeServicesList from "./HomeServicesList";
import TwentyFourSevenCareList from "./TwentyFourSevenCareList";
import PatientServicesList from "./PatientServicesList";
import InsuranceServicesList from "./InsuranceServicesList";
import ProfessionalsServicesList from "./ProfessionalsServicesList";
import CareServicesList from "./CareServicesList";
import PricingServicesList from "./PricingServicesList";
import ExperienceServicesList from "./ExperienceServicesList";
import MonitoringServicesList from "./MonitoringServicesList";
import EmergencyServicesList from "./EmergencyServicesList";
import RatingServicesList from "./RatingServicesList";
import VerifiedServicesList from "./VerifiedServicesList";


const HomeHealthcareSingleView = ({
  homeHealthcareService,
  serviceName,
  patientId
}) => {
  console.log("🚀 ~ Home Healthcare Data:", homeHealthcareService)
  
  const [activeTab, setActiveTab] = useState('overview');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showHomeServices, setShowHomeServices] = useState(false);
  const [show24x7Care, setShow24x7Care] = useState(false);
  const [showPatientServices, setShowPatientServices] = useState(false);
  const [showInsuranceServices, setShowInsuranceServices] = useState(false);
  const [showProfessionalsServices, setShowProfessionalsServices] = useState(false);
  const [showCareServices, setShowCareServices] = useState(false);
  const [showPricingServices, setShowPricingServices] = useState(false);
  const [showExperience, setShowExperience] = useState(false);
  const [showMonitoring, setShowMonitoring] = useState(false);
const [showEmergency, setShowEmergency] = useState(false);
const [showRating, setShowRating] = useState(false);
const [showVerified, setShowVerified] = useState(false);





  // Get reviews from service data
  const reviews = homeHealthcareService?.hospital?.reviews || [];
  const totalReviews = reviews.length;
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviews.length).toFixed(1)
    : "0.0";
  
  // Calculate total patients from bookings
  const totalPatients = homeHealthcareService?._count?.BookHomeHealthcare || 0;

  const serviceImages = [
    homeHealthcareService?.hospital?.hspdetails?.hsplogo,
    homeHealthcareService?.hospital?.hspdetails?.hspregcertificate,
    homeHealthcareService?.hospital?.hspdetails?.nabhnablcertificate,
    homeHealthcareService?.hospital?.hspdetails?.pancardimg,
    homeHealthcareService?.hospital?.hspdetails?.cancelledcheque,
  ].filter(Boolean);

  const images = serviceImages.length > 0
    ? serviceImages.length >= 6
      ? serviceImages.slice(0, 6)
      : [...serviceImages, ...serviceImages, ...serviceImages].slice(0, 6)
    : [];

  const mainImage = images[0];

  // Helper to format year from date string
  const getYear = (dateStr) => {
    if (!dateStr) return "N/A";
    const year = new Date(dateStr).getFullYear();
    return isNaN(year) ? "N/A" : year;
  };

  return (
    <div key={homeHealthcareService?.id || 'no-service'} className="w-full bg-gray-50 relative min-h-screen">
      {/* Desktop View - Show on large screens only */}
      <div className="hidden lg:block">
{/* =================== HOME HEALTHCARE HEADER (Exact Screenshot + Exact Layout) =================== */}
<div
  className="bg-transparent rounded-[12px] mx-auto mt-5"
  style={{
    width: "1270px",
    height: "88px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0px 24px",
  }}
>

  {/* LEFT SECTION */}
  <div className="flex flex-col justify-center gap-[2px]">
    <h1 className="text-[28px] font-bold text-[#243460] leading-none mb-2">
      {serviceName || "Home Healthcare Service"}
    </h1>

    <div className="flex items-center gap-2 text-[#243460] text-[15px] leading-none">
      <Building2 className="w-4 h-4" />
      {homeHealthcareService?.hospital?.hspdetails?.category || "Home Healthcare"}
    </div>
  </div>

{/* RIGHT SECTION */}
<div className="flex flex-col items-end gap-2">

  {/* BUTTONS */}
  <div className="flex items-center gap-3">
    <button
      onClick={() => {
        const phone = homeHealthcareService?.hospital?.mobile;
        if (phone) window.open(`tel:${phone}`, "_self");
      }}
      className="px-6 py-2 rounded-[12px] text-white text-[15px] font-semibold"
      style={{ background: "#5868F2" }}
    >
      Call Now
    </button>

    <button
      onClick={() => setDialogOpen(true)}
      className="px-6 py-2 rounded-[12px] text-white text-[15px] font-semibold"
      style={{ background: "#4CAF50" }}
    >
      Book Now
    </button>
  </div>

  {/* RATING BELOW BUTTONS */}
  <div className="flex items-center gap-2 mt-[2px]">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(avgRating)
            ? "text-[#243460] fill-[#243460]"
            : "text-[#243460]"
        }`}
      />
    ))}

    <span className="text-[#243460] text-[15px] font-semibold leading-none">
      {avgRating} ({totalReviews})
    </span>
  </div>

</div>

</div>

        {/* Main Content Layout */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* FULL WIDTH HD PHOTO GALLERY SECTION */}
          <div className="w-full mb-6">
            <Card className="overflow-hidden border border-gray-200 shadow-lg rounded-xl">
              <CardContent className="p-0">
                <div className="grid grid-cols-4 gap-2 h-[400px] bg-gray-50">
                  <div className="col-span-2 row-span-2 relative group cursor-pointer overflow-hidden rounded-lg">
                    <Image
                      src={mainImage && mainImage.trim() !== "" ? mainImage : "/no-image.png"}
                      fill
                      priority
                      quality={90}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      alt="Service Main View"
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
                        alt={`Service Image ${index + 2}`}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    </div>
                  ))}
                  {images.length === 0 && (
                    <div className="col-span-4 row-span-2 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                      <div className="text-center p-6">
                        <Home className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium text-lg">No images available</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

{/* FULL WIDTH TABS */}
<div className="flex justify-center mt-6">
  <div className="w-[1270px] h-[75px] bg-white border border-[#00000033] rounded-[12px] shadow-sm flex items-center px-4">
    <div className="flex w-full justify-between items-center">
      
      {/* Tabs */}
      <nav className="flex space-x-6 overflow-x-auto scrollbar-hide">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'services', label: 'Services' },
          { id: 'pricing', label: 'Pricing' },
          { id: 'reviews', label: 'Reviews' },
          { id: 'contact', label: 'Contact' },
          { id: 'info', label: 'Provider Info' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-3 px-4 border-b-2 font-medium text-sm whitespace-nowrap transition-all duration-300 ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600 bg-blue-50 rounded-t-md'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

<button
  onClick={() => setDialogOpen(true)}
  className="w-[236px] h-[44px] bg-[#E68B67] text-white font-semibold 
  rounded-[12px] flex items-center justify-center gap-[10px]
  px-[20px] py-[10px] text-sm shadow-md"
>
  <Calendar className="w-5 h-5" />
  Book Appointment Now
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
  <div className="space-y-6">

{/* --- CARD 1: ABOUT HOME HEALTHCARE --- */}
<Card
  className="w-[806px] h-[187px] border border-[#00000033] rounded-[12px] shadow-sm mt-5"
>
  <CardContent className="p-5">
    <h3 className="text-xl md:text-2xl font-bold mb-3"
      style={{ color: "#243460" }}
    >
      About {serviceName}
    </h3>

    <p
      className="text-sm md:text-base leading-relaxed"
      style={{ color: "#666666" }}
    >
      {serviceName} provided by {homeHealthcareService?.hospital?.hspInfo?.regname || "our healthcare provider"} offers professional healthcare services in the comfort of your home.
      With {homeHealthcareService?.hospital?.hspInfo?.experience || "5+"} years of experience in providing quality medical care,
      we are committed to excellence in home healthcare delivery with experienced medical professionals.
    </p>
  </CardContent>
</Card>


{/* --- CARD 2: SERVICE STATUS (Exact Figma Design) --- */}
<Card
  className="w-[806px] h-[121px] border border-[#00000033] rounded-[12px] shadow-sm"
>
  <CardContent className="p-5">

    {/* Title */}
    <h3
      className="text-xl font-bold mb-3"
      style={{ color: "#243460" }}
    >
      Service Status
    </h3>

    {/* Provider / Location / Status Row */}
    <div className="text-sm flex flex-wrap gap-2">
      <span style={{ color: "#407BFF" }}>Provider:</span>
      <span style={{ color: "#E68B67" }}>
        {homeHealthcareService?.hospital?.hspInfo?.regname || "N/A"}
      </span>

      <span style={{ color: "#407BFF" }}>| Location:</span>
      <span style={{ color: "#E68B67" }}>
        {homeHealthcareService?.hospital?.hspcontact?.city}, {homeHealthcareService?.hospital?.hspcontact?.state}
      </span>

      <span style={{ color: "#407BFF" }}>| Availability:</span>
      <span
        style={{
          color: "#28A745"
        }}
      >
        24/7
      </span>
    </div>
  </CardContent>
</Card>


{/* --- CARD 3: INFO GRID (Premium Figma Style) --- */}
<Card className="w-[806px] border border-[#00000033] rounded-[12px] shadow-md">
  <CardContent className="p-5">

    <div className="grid grid-cols-2 gap-6">

      {[
        {
          icon: <Home className="w-12 h-12 text-[#243460]" />,
          title: "At Home",
          value: "Service",
          rows: [
            { color: "bg-green-500", text: "Home Visit" },
            { color: "bg-blue-500", text: "Comfort Care" },
          ]
        },
        {
          icon: <Clock className="w-12 h-12 text-[#243460]" />,
          title: "Available",
          value: "24/7",
          rows: [
            { color: "bg-green-500", text: "Round Clock" },
            { color: "bg-blue-500", text: "Always Ready" },
          ]
        },
        {
          icon: <Award className="w-12 h-12 text-[#243460]" />,
          title: "Experience",
          value: homeHealthcareService?.hospital?.hspInfo?.experience ? `${homeHealthcareService.hospital.hspInfo.experience}+ Years` : "5+ Years",
          rows: [
            { color: "bg-green-500", text: "Expert Team" },
            { color: "bg-blue-500", text: "Reliable Service" },
          ]
        },
        {
          icon: <Users className="w-12 h-12 text-[#243460]" />,
          title: "Patients",
          value: totalPatients > 0 ? `${totalPatients}+` : "Available",
          rows: [
            { color: "bg-green-500", text: "Served Patients" },
            { color: "bg-blue-500", text: "Trusted Care" },
          ]
        }
      ].map((item, i) => (
        
        <div
          key={i}
          className="bg-[#FAF5E05C] p-5 rounded-[14px] border border-[#00000033] shadow-lg flex flex-col justify-between"
        >

          {/* TOP PART */}
          <div className="flex gap-4 items-center">

            {/* ICON */}
            <div className="w-15 h-15 flex items-center justify-center">
              {item.icon}
            </div>

            {/* TEXT LIST */}
            <div className="space-y-1 text-sm">
              {item.rows.map((row, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${row.color}`}></span>
                  {row.text}
                </div>
              ))}
            </div>

          </div>

          {/* BOTTOM WITH BUTTON RIGHT */}
          <div className="mt-6 flex items-center justify-between">

            {/* TEXT SIDE */}
            <div>
              <p className="text-[#C47C52] font-semibold text-sm">{item.title}</p>
              <p className="text-[#091B47] font-bold text-2xl mt-1 text-center">{item.value}</p>
            </div>

            {/* BUTTON */}
            <button className="bg-[#E68B67] text-white rounded-[10px] px-5 py-2 text-sm font-semibold flex items-center gap-2">
              View More <ArrowRight className="w-4 h-4" />
            </button>

          </div>

        </div>

      ))}

    </div>
  </CardContent>
</Card>



  </div>
)}

              {/* SERVICES TAB */}
              {activeTab === 'services' && (
                <Card className="border border-gray-200 shadow-md rounded-xl">
                  <CardContent className="p-4 md:p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 md:mb-6">Available Services</h3>
                    <div className="space-y-3">
                      {[
                        { label: "Home Visit Service", value: "Yes", icon: <Home className="w-5 h-5" />, desc: "Professional care at your doorstep" },
                        { label: "24/7 Availability", value: "Yes", icon: <Clock className="w-5 h-5" />, desc: "Round-the-clock services" },
                        { label: "Qualified Professionals", value: "Yes", icon: <Award className="w-5 h-5" />, desc: "Experienced medical staff" },
                        { label: "Emergency Support", value: "Yes", icon: <Phone className="w-5 h-5" />, desc: "Immediate assistance" },
                        { label: "Follow-up Care", value: "Yes", icon: <Activity className="w-5 h-5" />, desc: "Continuous monitoring" },
                        { label: "Insurance Accepted", value: homeHealthcareService?.hospital?.hspInfo?.cashlessservices || "No", icon: <Shield className="w-5 h-5" />, desc: "Cashless services available" },
                      ].map((service, index) => {
                        const isAvailable = service.value === "yes" || service.value === "Yes";
                        return (
                          <div
                            key={index}
                            className={`flex items-center gap-4 p-4 rounded-lg ${
                              isAvailable ? "bg-blue-50 border border-blue-200" : "bg-gray-50 border border-gray-200"
                            } hover:shadow-md transition-shadow`}
                          >
                            <div className={`p-3 rounded-lg ${isAvailable ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"}`}>
                              {service.icon}
                            </div>
                            <div className="flex-1">
                              <span className="text-base font-semibold text-gray-900">{service.label}</span>
                              <p className="text-sm text-gray-600">{service.desc}</p>
                            </div>
                            {isAvailable && <CheckCircle className="w-6 h-6 text-blue-600" />}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* PRICING TAB */}
              {activeTab === 'pricing' && (
                <Card className="border border-gray-200 shadow-md rounded-xl">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Pricing Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                        <div className="flex items-center gap-3 mb-3">
                          <IndianRupee className="w-6 h-6 text-blue-600" />
                          <h4 className="font-bold text-blue-900">Starting Price</h4>
                        </div>
                        <p className="text-4xl font-bold text-blue-900">₹{homeHealthcareService?.minPrice || homeHealthcareService?.startingPrice || "999"}</p>
                        <p className="text-sm text-blue-700 mt-2">Base service fee</p>
                      </div>
                      {homeHealthcareService?.maxPrice && (
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                          <div className="flex items-center gap-3 mb-3">
                            <IndianRupee className="w-6 h-6 text-purple-600" />
                            <h4 className="font-bold text-purple-900">Maximum Price</h4>
                          </div>
                          <p className="text-4xl font-bold text-purple-900">₹{homeHealthcareService.maxPrice}</p>
                          <p className="text-sm text-purple-700 mt-2">Premium services</p>
                        </div>
                      )}
                    </div>
                    {homeHealthcareService?.finalprice && (
                      <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <IndianRupee className="w-6 h-6 text-green-600" />
                            <h4 className="font-bold text-green-900">Final Price</h4>
                          </div>
                          {homeHealthcareService?.discount && (
                            <Badge className="bg-green-600 text-white">
                              {homeHealthcareService.discount}% OFF
                            </Badge>
                          )}
                        </div>
                        <p className="text-4xl font-bold text-green-900">₹{homeHealthcareService.finalprice}</p>
                        <p className="text-sm text-green-700 mt-2">Special discounted rate</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* REVIEWS TAB */}
              {activeTab === 'reviews' && (
                <Card className="border border-gray-200 shadow-md rounded-xl">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Patient Reviews</h3>
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
                          <p className="text-gray-600 mb-2">Excellent Service</p>
                          <p className="text-gray-500 text-sm mb-2">{totalReviews} verified reviews</p>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No reviews yet</p>
                        <p className="text-gray-400 text-sm mt-2">Be the first to review this service</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* CONTACT TAB */}
              {activeTab === 'contact' && (
                <Card className="border border-gray-200 shadow-md rounded-xl">
                  <CardContent className="p-4 md:p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 md:mb-6">Contact Information</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <Phone className="w-6 h-6 text-blue-600 mt-1" />
                        <div>
                          <h4 className="font-semibold text-blue-900 mb-1 text-base">Phone Numbers</h4>
                          <p className="text-gray-900 font-medium text-base">{homeHealthcareService?.hospital?.mobile || "Not available"}</p>
                          {homeHealthcareService?.hospital?.hspcontact?.receptioncontact1 && (
                            <p className="text-gray-700 text-sm mt-1">Reception: {homeHealthcareService.hospital.hspcontact.receptioncontact1}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                        <Mail className="w-6 h-6 text-green-600 mt-1" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-green-900 mb-1 text-base">Email Address</h4>
                          <p className="text-gray-900 font-medium text-base break-words">{homeHealthcareService?.hospital?.email || "Not available"}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <MapPin className="w-6 h-6 text-purple-600 mt-1" />
                        <div>
                          <h4 className="font-semibold text-purple-900 mb-1 text-base">Service Address</h4>
                          <p className="text-gray-900 font-medium leading-relaxed text-base">
                            {homeHealthcareService?.hospital?.hspcontact?.address || "Address not available"}
                          </p>
                          <p className="text-gray-700 mt-2 text-sm">
                            {homeHealthcareService?.hospital?.hspcontact?.city}, {homeHealthcareService?.hospital?.hspcontact?.state} - {homeHealthcareService?.hospital?.hspcontact?.pincode}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                        <Clock className="w-6 h-6 text-orange-600 mt-1" />
                        <div>
                          <h4 className="font-semibold text-orange-900 mb-1 text-base">Working Hours</h4>
                          <p className="text-gray-900 font-medium text-base">24/7 Home Healthcare Services</p>
                          <p className="text-gray-700 text-sm mt-1">Available all days</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* PROVIDER INFO TAB */}
              {activeTab === 'info' && (
                <div className="space-y-4">
                  <Card className="border border-gray-200 shadow-md rounded-xl">
                    <CardContent className="p-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-3">Provider Information</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-gray-50 p-2 rounded">
                          <span className="text-gray-600 text-sm">Provider Name:</span>
                          <p className="font-semibold text-gray-900 text-base">{homeHealthcareService?.hospital?.hspInfo?.regname || "N/A"}</p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <span className="text-gray-600 text-sm">Experience:</span>
                          <p className="font-semibold text-gray-900 text-base">{homeHealthcareService?.hospital?.hspInfo?.experience || "5+"} years</p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <span className="text-gray-600 text-sm">Service Type:</span>
                          <p className="font-semibold text-gray-900 text-base">{serviceName}</p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <span className="text-gray-600 text-sm">Availability:</span>
                          <p className="font-semibold text-green-600 text-base">24/7</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {homeHealthcareService?.hospital?.hspdetails?.hspdescription && (
                    <Card className="border border-gray-200 shadow-md rounded-xl">
                      <CardContent className="p-4">
                        <h3 className="text-lg font-bold text-gray-900 mb-3">About Provider</h3>
                        <p className="text-base text-gray-700 leading-relaxed">
                          {homeHealthcareService.hospital.hspdetails.hspdescription}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>

            {/* Right Column - Only 2 Essential Cards */}
            <div className="space-y-4 order-1 lg:order-2">

{/* ================= QUICK CONTACT ================= */}
<Card className="border border-[#00000033] rounded-xl shadow-sm mt-5">
  <CardContent className="p-5">

    {/* Title */}
    <h3 className="text-[20px] font-semibold text-[#243460] mb-4">
      Quick Contact
    </h3>

    <div className="space-y-4">

      {/* Phone */}
      <div>
        <div className="flex items-center gap-2 text-[#243460]">
          <Phone className="w-4 h-4 text-[#666666]" />
          <span className="text-[14px] text-[#666666]">Phone</span>
        </div>
        <p className="text-[15px] font-semibold text-[#243460] mt-1">
          {homeHealthcareService?.hospital?.mobile || homeHealthcareService?.hospital?.hspcontact?.receptioncontact1 || "N/A"}
        </p>
      </div>

      {/* Email */}
      <div>
        <div className="flex items-center gap-2 text-[#243460]">
          <Mail className="w-4 h-4 text-[#666666]" />
          <span className="text-[14px] text-[#666666]">Email</span>
        </div>
        <p className="text-[15px] font-semibold text-[#243460] mt-1 truncate">
          {homeHealthcareService?.hospital?.email || homeHealthcareService?.hospital?.hspcontact?.receptionemail || "N/A"}
        </p>
      </div>

      {/* Rating */}
      <div>
        <p className="text-[22px] font-bold text-[#243460]">
          {avgRating || "N/A"} <span className="font-semibold">Excellent</span>
        </p>

        <div className="flex items-center gap-2 text-[#666666] mt-1">
          <Star className="w-4 h-4 text-[#243460]" />
          <span className="text-[14px]">
            {totalReviews || 0} Reviews & Comments
          </span>
        </div>

        {/* Read All Reviews Button */}
        <button
          onClick={() => setShowRating(true)}
          className="mt-3 bg-[#5868F2] text-white px-4 py-1 text-sm rounded-lg hover:bg-[#4352d9] transition rounded-xl"
        >
          Read All Reviews
        </button>
      </div>

    </div>
  </CardContent>
</Card>

{/* ================= ADDRESS CARD (Exact Screenshot Style) ================= */}
<div className="bg-white border border-[#00000033] rounded-2xl p-5 shadow-sm">

  {/* TOP ROW */}
  <div className="flex gap-4">

        {/* Left – LIVE GOOGLE MAP */}
    <div className="w-32 h-32 rounded-xl overflow-hidden shadow">
      <iframe
        width="100%"
        height="100%"
        loading="lazy"
        className="rounded-xl"
        src={`https://www.google.com/maps?q=${encodeURIComponent(
          homeHealthcareService?.hospital?.hspcontact?.address || ""
        )}&output=embed`}
      />
    </div>



    {/* Right – Address Info */}
    <div className="flex-1">
      <div className="flex items-center gap-2">
        <MapPin className="w-5 h-5 text-[#243460]" />
        <h2 className="text-xl font-bold text-[#243460]">Address</h2>
      </div>

      <p className="text-sm text-gray-600 mt-1">
        {homeHealthcareService?.hospital?.hspcontact?.city}, {homeHealthcareService?.hospital?.hspcontact?.state} {homeHealthcareService?.hospital?.hspcontact?.pincode ? `- ${homeHealthcareService.hospital.hspcontact.pincode}` : ""}
      </p>

      <p className="text-[15px] text-[#243460] font-medium mt-1 leading-5">
        {homeHealthcareService?.hospital?.hspcontact?.address || "Address not available"}
      </p>
    </div>

  </div>

  {/* ---------------------- NEARBY TRANSPORT ---------------------- */}
  {homeHealthcareService?.hospital?.facilitiesJson?.transportation?.length > 0 && (
    <div className="mt-5">
      <h3 className="text-[16px] font-semibold text-[#C47C52] mb-2">
        Nearby Transportation
      </h3>

      <div className="space-y-3">
        {homeHealthcareService.hospital.facilitiesJson.transportation.map((item, i) => (
          <div key={i} className="flex justify-between items-center">

            <div className="flex items-center gap-2">
              {/* ICONS EXACT STYLE */}
              {i === 0 && <BusFront className="w-4 h-4 text-[#243460]" />}
              {i === 1 && <Plane className="w-4 h-4 text-[#243460]" />}
              {i === 2 && <Train className="w-4 h-4 text-[#243460]" />}

              <span className="text-[15px] text-[#243460]">{item.name}</span>
            </div>

            <span className="text-[14px] font-semibold text-[#243460]">
              {item.distance}
            </span>
          </div>
        ))}
      </div>
    </div>
  )}

  {/* ---------------------- NEARBY LANDMARKS ---------------------- */}
  {homeHealthcareService?.hospital?.facilitiesJson?.landmarks?.length > 0 && (
    <div className="mt-6">
      <h3 className="text-[16px] font-semibold text-[#C47C52] mb-2">
        Nearby Landmarks
      </h3>

      <div className="space-y-3">
        {homeHealthcareService.hospital.facilitiesJson.landmarks.map((place, i) => (
          <div key={i} className="flex justify-between items-center">

            <div className="flex items-center gap-2">
              {/* Landmark Icons */}
              {i === 0 && <Landmark className="w-4 h-4 text-[#243460]" />}
              {i === 1 && <Route className="w-4 h-4 text-[#243460]" />}
              {i === 2 && <Building2 className="w-4 h-4 text-[#243460]" />}

              <span className="text-[15px] text-[#243460]">{place.name}</span>
            </div>

            <span className="text-[14px] font-semibold text-[#243460]">
              {place.distance}
            </span>
          </div>
        ))}
      </div>
    </div>
  )}

</div>



            </div>
          </div>

{/* --- OUR SERVICES (Figma Exact Style + Full Functionality) --- */}
<div className="mx-auto my-6" style={{ width: "1270px" }}>

  <Card className="border border-[#00000033] shadow-md rounded-[12px] overflow-hidden">
    <CardContent className="p-0">

      {/* Header */}
      <div className="bg-[#E68B67] py-5 px-6">
        <h2 className="text-xl font-semibold text-white tracking-tight">
          Our Services
        </h2>
      </div>

      {/* Grid */}
      <div className="p-6 bg-white">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">

          {[
            { icon: <Home className="w-5 h-5 text-[#243460]" />, label: "Home Service", value: "Available", clickable: true, action: "home" },
            { icon: <Clock className="w-5 h-5 text-[#243460]" />, label: "24/7 Care", value: "Always", clickable: true, action: "24x7" },
            { icon: <Award className="w-5 h-5 text-[#243460]" />, label: "Experience", value: homeHealthcareService?.hospital?.hspInfo?.experience ? `${homeHealthcareService.hospital.hspInfo.experience}+ yrs` : "5+ yrs", clickable: true, action: "experience" },
            { icon: <Users className="w-5 h-5 text-[#243460]" />, label: "Patients", value: totalPatients > 0 ? `${totalPatients}+` : "Available", clickable: true, action: "patients" },
            { icon: <Activity className="w-5 h-5 text-[#243460]" />, label: "Monitoring", value: "Live", clickable: true, action: "monitoring" },
            { icon: <Shield className="w-5 h-5 text-[#243460]" />, label: "Insurance", value: "Accepted", clickable: true, action: "insurance" },
            { icon: <Phone className="w-5 h-5 text-[#243460]" />, label: "Emergency", value: "24/7", clickable: true, action: "emergency" },
            { icon: <Stethoscope className="w-5 h-5 text-[#243460]" />, label: "Professionals", value: "Qualified", clickable: true, action: "professionals" },
            { icon: <Heart className="w-5 h-5 text-[#243460]" />, label: "Care", value: "Personal", clickable: true, action: "care" },
            { icon: <IndianRupee className="w-5 h-5 text-[#243460]" />, label: "Starting", value: `₹${homeHealthcareService?.minPrice || homeHealthcareService?.startingPrice || "999"}`, clickable: true, action: "pricing" },
            { icon: <Star className="w-5 h-5 text-[#243460]" />, label: "Rating", value: `${avgRating} ★`, clickable: true, action: "rating" },
            { icon: <CheckCircle className="w-5 h-5 text-[#243460]" />, label: "Verified", value: "Provider", clickable: true, action: "verified" },
          ].map((item, idx) => (
            <div
              key={idx}
              onClick={
                item.clickable
                  ? () => {
                      if (item.action === "home") setShowHomeServices(true);
                      else if (item.action === "24x7") setShow24x7Care(true);
                      else if (item.action === "patients") setShowPatientServices(true);
                      else if (item.action === "insurance") setShowInsuranceServices(true);
                      else if (item.action === "professionals") setShowProfessionalsServices(true);
                      else if (item.action === "care") setShowCareServices(true);
                      else if (item.action === "pricing") setShowPricingServices(true);
                      else if (item.action === "experience") setShowExperience(true);
                      else if (item.action === "monitoring") setShowMonitoring(true);
                      else if (item.action === "emergency") setShowEmergency(true);
                      else if (item.action === "rating") setShowRating(true);
                      else if (item.action === "verified") setShowVerified(true);
                    }
                  : undefined
              }
              className={`bg-[#FAF5E05C] p-4 rounded-xl border border-[#F1E9E2] shadow-sm hover:shadow-md transition-all text-center flex flex-col items-center justify-center ${
                item.clickable ? "cursor-pointer hover:scale-105" : ""
              }`}
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#EFE9E1] mb-2">
                {item.icon}
              </div>

              <h3 className="font-semibold text-[#243460] text-sm">
                {item.label}
              </h3>

              <p className="font-bold text-[#E68B67] text-sm mt-1">
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
            {homeHealthcareService?.hospital?.hspdetails?.hsplogo && (
              <div className="w-14 h-14 rounded-lg overflow-hidden border-2 border-white/40 shadow-md bg-white flex-shrink-0">
                <Image
                  src={homeHealthcareService.hospital.hspdetails.hsplogo}
                  width={56}
                  height={56}
                  alt="Service Logo"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-white line-clamp-2 mb-1">
                {serviceName || "Home Healthcare Service"}
              </h1>
              <div className="flex items-center gap-1.5 text-white/90 text-xs">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">
                  {homeHealthcareService?.hospital?.hspcontact?.city}, {homeHealthcareService?.hospital?.hspcontact?.state}
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

        {/* Mobile Content */}
        <div className="px-3 py-4 space-y-4 bg-gray-50">
          {/* Mobile Photo Gallery */}
          <div className="space-y-2">
            <div className="relative h-56 md:h-64 w-full rounded-xl overflow-hidden shadow-lg">
              <Image
                src={mainImage}
                fill
                priority
                quality={90}
                className="object-cover"
                alt="Service Main View"
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
                      alt={`Service Image ${index + 2}`}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setDialogOpen(true)}
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-md text-base md:text-lg flex items-center justify-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              BOOK NOW
            </button>
            <button
              onClick={() => {
                const phone = homeHealthcareService?.hospital?.mobile;
                if (phone) {
                  window.open(`tel:${phone}`, '_self');
                } else {
                  alert('Phone number not available');
                }
              }}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-md text-base md:text-lg flex items-center justify-center gap-2"
            >
              <Phone className="w-5 h-5" />
              CALL NOW
            </button>
          </div>

          {/* Mobile Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex overflow-x-auto scrollbar-hide">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'services', label: 'Services' },
                { id: 'pricing', label: 'Pricing' },
                { id: 'reviews', label: 'Reviews' },
                { id: 'contact', label: 'Contact' },
                { id: 'info', label: 'Info' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 py-3 px-4 font-medium text-sm md:text-base whitespace-nowrap transition-all ${
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

          {/* Mobile Tab Content */}
          <div className="space-y-4">
            {activeTab === 'overview' && (
              <Card className="border border-gray-200 shadow-sm rounded-xl">
                <CardContent className="p-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">About {serviceName}</h3>
                  <p className="text-base text-gray-700 leading-relaxed mb-4">
                    {serviceName} provided by {homeHealthcareService?.hospital?.hspInfo?.regname || "our healthcare provider"} offers professional healthcare services in the comfort of your home.
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { icon: <Home className="w-4 h-4" />, label: "At Home", value: "Service" },
                        { icon: <Clock className="w-4 h-4" />, label: "Available", value: "24/7" },
                        { icon: <Award className="w-4 h-4" />, label: "Experience", value: homeHealthcareService?.hospital?.hspInfo?.experience ? `${homeHealthcareService.hospital.hspInfo.experience}+ yrs` : "5+ yrs" },
                        { icon: <Users className="w-4 h-4" />, label: "Patients", value: totalPatients > 0 ? `${totalPatients}+` : "Available" },
                    ].map((stat, index) => (
                      <div key={index} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="p-1.5 bg-blue-100 rounded-lg flex-shrink-0">
                            <div className="text-blue-600">{stat.icon}</div>
                          </div>
                          <p className="text-base font-bold text-gray-900">{stat.value}</p>
                        </div>
                        <p className="text-xs text-gray-600">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'services' && (
              <Card className="border border-gray-200 shadow-sm rounded-xl">
                <CardContent className="p-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Available Services</h3>
                  <div className="space-y-2">
                    {[
                      { label: "Home Visit Service", value: "Yes", icon: <Home className="w-4 h-4" /> },
                      { label: "24/7 Availability", value: "Yes", icon: <Clock className="w-4 h-4" /> },
                      { label: "Qualified Professionals", value: "Yes", icon: <Award className="w-4 h-4" /> },
                      { label: "Emergency Support", value: "Yes", icon: <Phone className="w-4 h-4" /> },
                      { label: "Follow-up Care", value: "Yes", icon: <Activity className="w-4 h-4" /> },
                    ].map((service, index) => {
                      const isAvailable = service.value === "yes" || service.value === "Yes";
                      return (
                        <div key={index} className={`flex items-center gap-3 p-3 rounded-lg ${isAvailable ? "bg-blue-50 border border-blue-200" : "bg-gray-50 border border-gray-200"}`}>
                          <div className={`p-2 rounded-lg flex-shrink-0 ${isAvailable ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"}`}>
                            {service.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-semibold text-gray-900 block">{service.label}</span>
                            <p className="text-xs text-gray-600">{isAvailable ? "Available" : "Not Available"}</p>
                          </div>
                          {isAvailable && <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'pricing' && (
              <Card className="border border-gray-200 shadow-sm rounded-xl">
                <CardContent className="p-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Pricing Details</h3>
                  <div className="space-y-3">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                      <p className="text-xs text-blue-700 mb-1">Starting Price</p>
                      <p className="text-3xl font-bold text-blue-900">₹{homeHealthcareService?.minPrice || homeHealthcareService?.startingPrice || "999"}</p>
                    </div>
                    {homeHealthcareService?.maxPrice && (
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                        <p className="text-xs text-purple-700 mb-1">Maximum Price</p>
                        <p className="text-3xl font-bold text-purple-900">₹{homeHealthcareService.maxPrice}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'reviews' && (
              <Card className="border border-gray-200 shadow-sm rounded-xl">
                <CardContent className="p-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Patient Reviews</h3>
                  <div className="text-center py-6">
                    <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No reviews yet</p>
                    <p className="text-gray-400 text-xs mt-1">Be the first to review this service</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'contact' && (
              <Card className="border border-gray-200 shadow-sm rounded-xl">
                <CardContent className="p-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <Phone className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-blue-900 mb-1 text-base">Phone Number</h4>
                        <p className="text-gray-900 font-medium text-base">{homeHealthcareService?.hospital?.mobile || "Not available"}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <Mail className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-green-900 mb-1 text-base">Email Address</h4>
                        <p className="text-gray-900 font-medium text-base break-words">{homeHealthcareService?.hospital?.email || "Not available"}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <MapPin className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-purple-900 mb-1 text-base">Service Address</h4>
                        <p className="text-gray-900 font-medium leading-relaxed text-base">
                          {homeHealthcareService?.hospital?.hspcontact?.address || "Address not available"}
                        </p>
                        <p className="text-gray-700 mt-1 text-sm">
                          {homeHealthcareService?.hospital?.hspcontact?.city}, {homeHealthcareService?.hospital?.hspcontact?.state} - {homeHealthcareService?.hospital?.hspcontact?.pincode}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'info' && (
              <Card className="border border-gray-200 shadow-sm rounded-xl">
                <CardContent className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Provider Information</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="text-gray-600 text-sm block mb-0.5">Provider:</span>
                      <p className="font-semibold text-gray-900 text-base break-words">{homeHealthcareService?.hospital?.hspInfo?.regname || "N/A"}</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="text-gray-600 text-sm block mb-0.5">Service:</span>
                      <p className="font-semibold text-gray-900 text-base">{serviceName}</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="text-gray-600 text-sm block mb-0.5">Experience:</span>
                      <p className="font-semibold text-gray-900 text-base">{homeHealthcareService?.hospital?.hspInfo?.experience || "5+"} years</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="text-gray-600 text-sm block mb-0.5">Availability:</span>
                      <p className="font-semibold text-green-600 text-base">24/7</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Mobile Services Grid */}
          <Card className="border border-gray-200 shadow-md rounded-xl overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3">
                <h2 className="text-xl font-bold text-white text-center">Our Services</h2>
                <p className="text-blue-100 text-center text-sm mt-0.5">
                  Comprehensive home healthcare solutions
                </p>
              </div>
              <div className="p-3">
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { icon: <Home className="w-4 h-4 text-blue-600" />, label: "Home Service", value: "Available", clickable: true, action: "home" },
                    { icon: <Clock className="w-4 h-4 text-green-600" />, label: "24/7 Care", value: "Always", clickable: true, action: "24x7" },
                    { icon: <Award className="w-4 h-4 text-purple-600" />, label: "Experience", value: homeHealthcareService?.hospital?.hspInfo?.experience ? `${homeHealthcareService.hospital.hspInfo.experience}+ yrs` : "5+ yrs" },
                    { icon: <Users className="w-4 h-4 text-blue-600" />, label: "Patients", value: totalPatients > 0 ? `${totalPatients}+` : "Available", clickable: true, action: "patients" },
                    { icon: <Activity className="w-4 h-4 text-red-600" />, label: "Monitoring", value: "Live" },
                    { icon: <Shield className="w-4 h-4 text-indigo-600" />, label: "Insurance", value: "Accepted", clickable: true, action: "insurance" },
                    { icon: <Phone className="w-4 h-4 text-orange-600" />, label: "Emergency", value: "24/7" },
                    { icon: <Stethoscope className="w-4 h-4 text-cyan-600" />, label: "Professionals", value: "Qualified", clickable: true, action: "professionals" },
                    { icon: <Star className="w-4 h-4 text-yellow-600" />, label: "Rating", value: `${avgRating} ★`,clickable:true, action:"rating" },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        if (item.clickable) {
                          if (item.action === "home") {
                            setShowHomeServices(true);
                          } else if (item.action === "24x7") {
                            setShow24x7Care(true);
                          } else if (item.action === "patients") {
                            setShowPatientServices(true);
                          } else if (item.action === "insurance") {
                            setShowInsuranceServices(true);
                          } else if (item.action === "professionals") {
                            setShowProfessionalsServices(true);
                          } else if (item.action === "care") {
                            setShowCareServices(true);
                          } else if (item.action === "pricing") {
                            setShowPricingServices(true);
                          }
                        }
                      }}
                      className={`bg-white p-2 rounded-lg border border-gray-200 shadow-sm text-center min-h-[70px] flex flex-col justify-center items-center ${
                        item.clickable ? 'cursor-pointer hover:border-blue-400 hover:bg-blue-50 active:bg-blue-100' : ''
                      }`}
                    >
                      <div className="mb-1">{item.icon}</div>
                      <h3 className="font-bold text-gray-900 text-xs leading-tight line-clamp-2 mb-0.5">{item.label}</h3>
                      <p className="font-semibold text-xs text-blue-700">{item.value}</p>
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
                    <h3 className="text-xl font-bold">24/7 Emergency</h3>
                    <p className="text-red-100 text-sm">Always here for urgent needs</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <a
                    href={`tel:${homeHealthcareService?.hospital?.mobile}`}
                    className="bg-white text-red-600 hover:bg-red-50 font-bold py-3 px-4 rounded-lg transition-all shadow-md text-center text-base"
                  >
                    📞 Call: {homeHealthcareService?.hospital?.mobile || "Call Now"}
                  </a>
                  <button
                    onClick={() => alert("Emergency ambulance service!")}
                    className="bg-white/20 border-2 border-white text-white hover:bg-white/30 font-semibold py-3 px-4 rounded-lg transition-all text-center text-base"
                  >
                    Request Emergency Support
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Home Services List Modal */}
      {showHomeServices && (
        <HomeServicesList
          onClose={() => setShowHomeServices(false)}
          homeHealthcareService={homeHealthcareService}
          serviceName={serviceName}
        />
      )}
      
      {/* 24/7 Care Services Modal */}
      {show24x7Care && (
        <TwentyFourSevenCareList
          onClose={() => setShow24x7Care(false)}
          homeHealthcareService={homeHealthcareService}
          serviceName={serviceName}
        />
      )}
      
      {/* Patient Services Modal */}
      {showPatientServices && (
        <PatientServicesList
          onClose={() => setShowPatientServices(false)}
          homeHealthcareService={homeHealthcareService}
          serviceName={serviceName}
        />
      )}
      
      {/* Insurance Services Modal */}
      {showInsuranceServices && (
        <InsuranceServicesList
          onClose={() => setShowInsuranceServices(false)}
          homeHealthcareService={homeHealthcareService}
          serviceName={serviceName}
        />
      )}
      
      {/* Professionals Services Modal */}
      {showProfessionalsServices && (
        <ProfessionalsServicesList
          onClose={() => setShowProfessionalsServices(false)}
          homeHealthcareService={homeHealthcareService}
          serviceName={serviceName}
        />
      )}
      
      {/* Care Services Modal */}
      {showCareServices && (
        <CareServicesList
          onClose={() => setShowCareServices(false)}
          homeHealthcareService={homeHealthcareService}
          serviceName={serviceName}
        />
      )}
      
      {/* Pricing Services Modal */}
      {showPricingServices && (
        <PricingServicesList
          onClose={() => setShowPricingServices(false)}
          homeHealthcareService={homeHealthcareService}
          serviceName={serviceName}
        />
      )}

      {showExperience && (
  <ExperienceServicesList
    onClose={() => setShowExperience(false)}
    homeHealthcareService={homeHealthcareService}
  />
)}

{showMonitoring && (
  <MonitoringServicesList
    onClose={() => setShowMonitoring(false)}
    homeHealthcareService={homeHealthcareService}
  />
)}

{showEmergency && (
  <EmergencyServicesList
    onClose={() => setShowEmergency(false)}
    homeHealthcareService={homeHealthcareService}
  />
)}

{showRating && (
  <RatingServicesList
    onClose={() => setShowRating(false)}
    homeHealthcareService={homeHealthcareService}
  />
)}

{showVerified && (
  <VerifiedServicesList
    onClose={() => setShowVerified(false)}
    homeHealthcareService={homeHealthcareService}
  />
)}





      
      <BookHomeHealthcareDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        patientId={patientId}
        homeHealthcareId={homeHealthcareService.id}
        serviceName={serviceName}
      />
    </div>
  );
};

export default HomeHealthcareSingleView;
