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
  Stethoscope
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

  const mainImage = images[0] || "/placeholder-hospital.jpg";

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
        {/* Clean Simple Header */}
        <div className="shadow-lg" style={{ background: '#3D85EF' }}>
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between gap-8">
              {/* Left Section - Logo & Basic Info */}
              <div className="flex items-center gap-5 flex-1">
                {homeHealthcareService?.hospital?.hspdetails?.hsplogo && (
                  <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-white/40 shadow-lg bg-white flex-shrink-0">
                    <Image
                      src={homeHealthcareService.hospital.hspdetails.hsplogo}
                      width={80}
                      height={80}
                      alt="Service Provider Logo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-white mb-2">
                    {serviceName || "Home Healthcare Service"}
                  </h1>
                  <div className="flex items-center gap-2 text-white/90 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {homeHealthcareService?.hospital?.hspcontact?.city}, {homeHealthcareService?.hospital?.hspcontact?.state}
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
                      const phone = homeHealthcareService?.hospital?.mobile;
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
                    Book Now
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
                <div className="grid grid-cols-4 gap-2 h-[400px] bg-gray-50">
                  <div className="col-span-2 row-span-2 relative group cursor-pointer overflow-hidden rounded-lg">
                    <Image
                      src={mainImage}
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
                        <Heart className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium text-lg">No images available</p>
                      </div>
                    </div>
                  )}
                </div>
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
                    { id: 'pricing', label: 'Pricing' },
                    { id: 'reviews', label: 'Reviews' },
                    { id: 'contact', label: 'Contact' },
                    { id: 'info', label: 'Provider Info' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-3 lg:py-4 px-3 lg:px-4 border-b-2 font-medium text-sm lg:text-base whitespace-nowrap transition-all duration-300 ${
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
                  className="w-full lg:w-auto mt-3 lg:mt-0 lg:ml-4 mb-3 lg:mb-0 lg:my-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 px-6 lg:px-8 rounded-lg transition-all transform hover:scale-110 shadow-xl border-2 border-orange-400 flex items-center justify-center gap-2 whitespace-nowrap text-base lg:text-lg animate-pulse"
                >
                  <Calendar className="w-5 h-5" />
                  Book Service Now
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
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      About {serviceName}
                    </h3>
                    <p className="text-base text-gray-700 leading-relaxed mb-6">
                      {serviceName} provided by {homeHealthcareService?.hospital?.hspInfo?.regname || "our healthcare provider"} offers professional healthcare services in the comfort of your home.
                      With {homeHealthcareService?.hospital?.hspInfo?.experience || "5+"} years of experience in providing quality medical care,
                      we are committed to excellence in home healthcare delivery with experienced medical professionals.
                    </p>
                    <div className="mb-6 p-3 md:p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                          <Shield className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-blue-900 text-base">Service Status</h4>
                          <p className="text-blue-700 text-sm break-words">
                            Provider: {homeHealthcareService?.hospital?.hspInfo?.regname} | 
                            Location: {homeHealthcareService?.hospital?.hspcontact?.city}, {homeHealthcareService?.hospital?.hspcontact?.state}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                      {[
                        { icon: <Home className="w-4 h-4 md:w-5 md:h-5" />, label: "At Home", value: "Service", color: "blue" },
                      { icon: <Clock className="w-4 h-4 md:w-5 md:h-5" />, label: "Available", value: "24/7", color: "green" },
                      { icon: <Award className="w-4 h-4 md:w-5 md:h-5" />, label: "Experience", value: homeHealthcareService?.hospital?.hspInfo?.experience ? `${homeHealthcareService.hospital.hspInfo.experience}+ yrs` : "5+ yrs", color: "purple" },
                      { icon: <Users className="w-4 h-4 md:w-5 md:h-5" />, label: "Patients", value: totalPatients > 0 ? `${totalPatients}+` : "Available", color: "orange" },
                      ].map((stat, index) => (
                        <div key={index} className="bg-white p-3 md:p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-2 md:gap-3">
                            <div className="p-1.5 md:p-2 bg-blue-100 rounded-lg flex-shrink-0">
                              <div className="text-blue-600">{stat.icon}</div>
                            </div>
                            <div className="min-w-0">
                              <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                              <p className="text-sm text-gray-600">{stat.label}</p>
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

            {/* Right Column - Essential Cards */}
            <div className="space-y-4 order-1 lg:order-2">
              {/* Provider Information Card */}
              <Card className="border border-gray-200 shadow-md rounded-xl">
                <CardContent className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Provider Information</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="text-gray-600 text-sm">Provider:</span>
                      <p className="font-semibold text-gray-900 text-base">{homeHealthcareService?.hospital?.hspInfo?.regname || "N/A"}</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="text-gray-600 text-sm">Service:</span>
                      <p className="font-semibold text-gray-900 text-base">{serviceName}</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="text-gray-600 text-sm">Experience:</span>
                      <p className="font-semibold text-gray-900 text-base">{homeHealthcareService?.hospital?.hspInfo?.experience || "5+"} years</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="text-gray-600 text-sm">Availability:</span>
                      <p className="font-semibold text-green-600 text-base">24/7</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Contact Card */}
              <Card className="border border-gray-200 shadow-md rounded-xl">
                <CardContent className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Quick Contact</h3>
                    <div className="space-y-2">
                    <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                      <Phone className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 text-base truncate">{homeHealthcareService?.hospital?.mobile || "N/A"}</p>
                        <p className="text-sm text-gray-600">Phone</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                      <Mail className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 text-base truncate">{homeHealthcareService?.hospital?.email || "N/A"}</p>
                        <p className="text-sm text-gray-600">Email</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 p-2 bg-purple-50 rounded-lg">
                      <MapPin className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 text-base line-clamp-2">
                          {homeHealthcareService?.hospital?.hspcontact?.address || "Address not available"}
                        </p>
                        <p className="text-sm text-gray-600 truncate">{homeHealthcareService?.hospital?.hspcontact?.city}, {homeHealthcareService?.hospital?.hspcontact?.state}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Our Services Section */}
          <div className="max-w-6xl mx-auto my-6">
            <Card className="border border-gray-100 shadow-xl rounded-2xl overflow-hidden transition-all hover:shadow-2xl">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-blue-700 to-indigo-700 py-4 px-4 text-center">
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    Our Services
                  </h2>
                  <p className="text-blue-100 mt-1 text-sm">
                    Comprehensive home healthcare solutions for all your needs
                  </p>
                </div>

                <div className="p-4 sm:p-6 bg-gray-50">
                  <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
                    {[
                      { icon: <Home className="w-5 h-5 text-blue-600" />, label: "Home Service", value: "Available", clickable: true, action: "home" },
                      { icon: <Clock className="w-5 h-5 text-green-600" />, label: "24/7 Care", value: "Always", clickable: true, action: "24x7" },
                      { icon: <Award className="w-5 h-5 text-purple-600" />, label: "Experience", value: homeHealthcareService?.hospital?.hspInfo?.experience ? `${homeHealthcareService.hospital.hspInfo.experience}+ yrs` : "5+ yrs", clickable:true, action:"experience" },
                      { icon: <Users className="w-5 h-5 text-blue-600" />, label: "Patients", value: totalPatients > 0 ? `${totalPatients}+` : "Available", clickable: true, action: "patients" },
                      { icon: <Activity className="w-5 h-5 text-red-600" />, label: "Monitoring", value: "Live", action:"monitoring", clickable:true },
                      { icon: <Shield className="w-5 h-5 text-indigo-600" />, label: "Insurance", value: "Accepted", clickable: true, action: "insurance" },
                      { icon: <Phone className="w-5 h-5 text-orange-600" />, label: "Emergency", value: "24/7", action:"emergency", clickable:true },
                      { icon: <Stethoscope className="w-5 h-5 text-cyan-600" />, label: "Professionals", value: "Qualified", clickable: true, action: "professionals" },
                      { icon: <Heart className="w-5 h-5 text-red-600" />, label: "Care", value: "Personal", clickable: true, action: "care" },
                      { icon: <IndianRupee className="w-5 h-5 text-green-600" />, label: "Starting", value: `₹${homeHealthcareService?.minPrice || homeHealthcareService?.startingPrice || "999"}`, clickable: true, action: "pricing" },
                      { icon: <Star className="w-5 h-5 text-yellow-600" />, label: "Rating", value: `${avgRating} ★`, action:"rating", clickable:true },
                      { icon: <CheckCircle className="w-5 h-5 text-green-600" />, label: "Verified", value: "Provider", action:"verified", clickable:true },
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
                            else if (item.action === "experience") {
  setShowExperience(true);
}
else if (item.action === "monitoring") {
  setShowMonitoring(true);
}
else if (item.action === "emergency") {
  setShowEmergency(true);
}
else if (item.action === "rating") {
  setShowRating(true);
}
else if (item.action === "verified") {
  setShowVerified(true);
}





                          }
                        }}
                        className={`bg-white p-2 sm:p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all text-center flex flex-col items-center justify-center min-h-[85px] sm:min-h-[95px] ${
                          item.clickable ? 'cursor-pointer hover:border-blue-400 hover:bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-50 mb-1.5 sm:mb-2">
                          {item.icon}
                        </div>
                        <h3 className="font-semibold text-gray-900 text-xs sm:text-sm mb-0.5 leading-tight line-clamp-2">
                          {item.label}
                        </h3>
                        <p className="font-bold text-blue-700 text-xs sm:text-sm">
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
