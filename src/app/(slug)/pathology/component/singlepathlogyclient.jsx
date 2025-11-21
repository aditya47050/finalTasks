"use client";
import React, { useState,useEffect } from "react";
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
  ShieldCheck,
  Building2,
  Users,
  Award,
  CreditCard,
  FileText,
  User,
  Calendar,
  CheckCircle,
  Camera,
  Heart,
  IndianRupee,
  ArrowRight,
  BusFront,
  Plane,
  Train,
  Landmark,
  Route
} from "lucide-react";
import { FaHospitalAlt } from "react-icons/fa";
import BookLabTestDialog from './BookLabTestDialog';
import BookWellnessPackageDialog from './bookwellnesspackage';
import BookBloodBankDialog from './bookbloodbank';
import LabTestsList from './LabTestsList';
import HomeCollectionList from './HomeCollectionList';
import BranchesList from './BranchesList';
import GovtSchemesList from './GovtSchemesList';
import CashlessList from './CashlessList';
import OnlineReportsList from './OnlineReportsList';
import NablCertifiedList from './NablCertifiedList';
import RatingList from './RatingList';


const PathologySinglePageClient = ({ hospital, service, serviceType = 'labtest', patientId }) => {
  console.log("🚀 ~ Pathology Lab Data:", hospital)
  
  const [activeTab, setActiveTab] = useState('overview');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showLabTests, setShowLabTests] = useState(false);
  const [showHomeCollection, setShowHomeCollection] = useState(false);
  const [showBranches, setShowBranches] = useState(false);
  const [showGovtSchemes, setShowGovtSchemes] = useState(false);
  const [showCashless, setShowCashless] = useState(false);
  const [showOnlineReports, setShowOnlineReports] = useState(false);
  const [showNablCertified, setShowNablCertified] = useState(false);
  const [showRatingList, setShowRatingList] = useState(false);
  const [showServiceHours, setShowServiceHours] = useState(false);
const [showQualityAssured, setShowQualityAssured] = useState(false);
const [showExperience, setShowExperience] = useState(false);
const [showNablLevel, setShowNablLevel] = useState(false);
const [branchData, setBranchData] = useState([]);
const [labTestsCount, setLabTestsCount] = useState(0);

//branches count
useEffect(() => {
  if (!hospital?.id) return;
  const fetchBranches = async () => {
    try {
      const res = await fetch(`/api/pathology/branches?hospitalId=${hospital.id}`);
      const data = await res.json();
      if (data.success && data.data?.branches) {
        setBranchData(data.data.branches);
      }
    } catch (err) {
      console.error("❌ Error fetching branch data:", err);
    }
  };
  fetchBranches();
}, [hospital?.id]);

//labtests count
useEffect(() => {
  console.log("🧬 Fetching lab tests for hospital:", hospital?.id);
  if (!hospital?.id && !("685e7365e4636b3c5cd02d53")) return;

  const fetchLabTests = async () => {
    try {
      const res = await fetch(`/api/pathology/lab-tests?hospitalId=${hospital?.id || "685e7365e4636b3c5cd02d53"}`);
      const data = await res.json();
      console.log("🧪 Lab Tests API Response:", data);

      if (data.success && Array.isArray(data.data)) {
        setLabTestsCount(data.data.length);
        console.log("✅ Set lab test count:", data.data.length);
      } else {
        console.warn("⚠️ Unexpected lab tests response:", data);
      }
    } catch (err) {
      console.error("❌ Error fetching lab tests:", err);
    }
  };
  fetchLabTests();
}, [hospital?.id]);




  // Get reviews from hospital data
  const reviews = hospital?.HospitalReview || hospital?.reviews || [];
  console.log("🚀 ~ Lab Reviews:", JSON.stringify(reviews, null, 2))
  
  // Calculate average rating from actual reviews
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length).toFixed(1) 
    : "4.2";
  const totalReviews = reviews.length || 87;

  // 🕒 Dynamic Service Hours (fetch from hospital data)
const serviceHours =
  hospital?.hspInfo?.servicehours ||
  hospital?.hspcontact?.servicehours ||
  hospital?.hspdetails?.servicehours ||
  "24/7"; // fallback


  const labImages = [
    hospital?.hspdetails?.hsplogo,
    hospital?.hspdetails?.hspregcertificate,
    hospital?.hspdetails?.nabhnablcertificate,
    hospital?.hspdetails?.pancardimg,
    hospital?.hspdetails?.cancelledcheque,
  ].filter(Boolean);

  const images = labImages.length > 0
    ? labImages.length >= 6
      ? labImages.slice(0, 6)
      : [...labImages, ...labImages, ...labImages].slice(0, 6)
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

  // Calculate discount
  const discountPercentage = service?.discount ? parseInt(service.discount) : 0;
  const originalPrice = service?.aaprice || service?.price || 0;
  const finalPrice = service?.finalprice || service?.price || 0;

  // Get service name
  const getServiceName = () => {
    switch (serviceType) {
      case 'labtest':
        return service.testname;
      case 'wellnesspackage':
        return service.aapackagename || service.labpackagename;
      case 'bloodbank':
        return service.bloodname;
      default:
        return "Service";
    }
  };

  return (
    <div key={hospital?.id || 'no-lab'} className="w-full bg-gray-50 relative min-h-screen">
      {/* Desktop View - Show on large screens only */}
      <div className="hidden lg:block">
{/* =================== PATHOLOGY LAB HEADER (Exact Screenshot + Exact Layout) =================== */}
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
      {hospital?.hspInfo?.regname || "Pathology Lab"}
    </h1>

    <div className="flex items-center gap-2 text-[#243460] text-[15px] leading-none">
      <Building2 className="w-4 h-4" />
      {hospital?.hspdetails?.category || "Pathology Lab"}
    </div>
  </div>

{/* RIGHT SECTION */}
<div className="flex flex-col items-end gap-2">

  {/* BUTTONS */}
  <div className="flex items-center gap-3">
    <button
      onClick={() => {
        const phone =
          hospital?.hspcontact?.receptioncontact1 ||
          hospital?.mobile;
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
  alt="Lab Main View"
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
                        alt={`Lab Image ${index + 2}`}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    </div>
                  ))}
                  {images.length === 0 && (
                    <div className="col-span-4 row-span-2 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                      <div className="text-center p-6">
                        <FaHospitalAlt className="w-20 h-20 text-gray-400 mx-auto mb-4" />
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
          { id: 'test-details', label: 'Test Details' },
          { id: 'facilities', label: 'Facilities' },
          { id: 'reviews', label: 'Reviews' },
          { id: 'contact', label: 'Contact' },
          { id: 'info', label: 'Lab Info' },
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

{/* --- CARD 1: ABOUT PATHOLOGY LAB --- */}
<Card
  className="w-[806px] h-[187px] border border-[#00000033] rounded-[12px] shadow-sm mt-5"
>
  <CardContent className="p-5">
    <h3 className="text-xl md:text-2xl font-bold mb-3"
      style={{ color: "#243460" }}
    >
      About {hospital?.hspInfo?.regname}
    </h3>

    <p
      className="text-sm md:text-base leading-relaxed"
      style={{ color: "#666666" }}
    >
      {hospital?.hspInfo?.regname} is a leading pathology lab{hospital?.hspInfo?.experience ? ` with ${hospital.hspInfo.experience} years of experience` : ''} in providing quality diagnostic services.
      Located in {safeDisplay(hospital?.hspcontact?.city, "your area")}, {safeDisplay(hospital?.hspcontact?.state, "")}, we are committed to
      excellence in healthcare delivery with state-of-the-art equipment and NABL certified facilities.
    </p>
  </CardContent>
</Card>


{/* --- CARD 2: LAB STATUS (Exact Figma Design) --- */}
<Card
  className="w-[806px] h-[121px] border border-[#00000033] rounded-[12px] shadow-sm"
>
  <CardContent className="p-5">

    {/* Title */}
    <h3
      className="text-xl font-bold mb-3"
      style={{ color: "#243460" }}
    >
      Lab Status
    </h3>

    {/* Registration / Established / Status Row */}
    <div className="text-sm flex flex-wrap gap-2">
      <span style={{ color: "#407BFF" }}>Registration:</span>
      <span style={{ color: "#E68B67" }}>
        {hospital?.hspdetails?.hspregno || "N/A"}
      </span>

      <span style={{ color: "#407BFF" }}>| Established:</span>
      <span style={{ color: "#E68B67" }}>
        {getYear(hospital?.hspdetails?.hspregdate)}
      </span>

      <span style={{ color: "#407BFF" }}>| Status:</span>
      <span
        style={{
          color:
            hospital?.approvalStatus === "APPROVED"
              ? "#28A745"
              : "#E68B67",
        }}
      >
        {hospital?.approvalStatus || "APPROVED"}
      </span>
    </div>

    {/* NABL */}
    {hospital?.hspdetails?.nabhnablapproved === "Yes" && (
      <p className="mt-2 text-sm flex items-center gap-1" style={{ color: "#407BFF" }}>
        <Award className="w-4 h-4" style={{ color: "#407BFF" }} />
        NABL Accredited –{" "}
        <span style={{ color: "#E68B67" }}>
          {hospital?.hspdetails?.nabhnabllevel}
        </span>
      </p>
    )}
  </CardContent>
</Card>


{/* --- CARD 3: INFO GRID (Premium Figma Style) --- */}
<Card className="w-[806px] border border-[#00000033] rounded-[12px] shadow-md">
  <CardContent className="p-5">

    <div className="grid grid-cols-2 gap-6">

      {[
        {
          icon: <TestTube className="w-12 h-12 text-[#243460]" />,
          title: "Total Tests",
          value: labTestsCount > 0 ? `${labTestsCount}` : "0",
          rows: [
            { color: "bg-green-500", text: "Available Tests" },
            { color: "bg-blue-500", text: "Quick Results" },
          ]
        },
        {
          icon: <Clock className="w-12 h-12 text-[#243460]" />,
          title: "Report Time",
          value: "24-48 hrs",
          rows: [
            { color: "bg-green-500", text: "Fast Delivery" },
            { color: "bg-blue-500", text: "Online Reports" },
          ]
        },
        {
          icon: <Award className="w-12 h-12 text-[#243460]" />,
          title: "Certification",
          value: "NABL",
          rows: [
            { color: "bg-green-500", text: "NABL Certified" },
            { color: "bg-blue-500", text: "Quality Assured" },
          ]
        },
        {
          icon: <Users className="w-12 h-12 text-[#243460]" />,
          title: "Experience",
          value: hospital?.hspInfo?.experience ? `${hospital.hspInfo.experience}+ Years` : "N/A",
          rows: [
            { color: "bg-green-500", text: "Expert Team" },
            { color: "bg-blue-500", text: "Reliable Service" },
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

              {/* TEST DETAILS TAB */}
              {activeTab === 'test-details' && (
                <Card className="border border-gray-200 shadow-md rounded-xl">
                  <CardContent className="p-4 md:p-6">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Test Details</h3>
                    
                    <div className="bg-gradient-to-br from-blue-50 blue-50 rounded-xl p-4 md:p-6 border border-blue-200 mb-6">
                      <h4 className="text-lg md:text-xl font-bold text-gray-900 mb-3">{getServiceName()}</h4>
                      <p className="text-gray-700 text-sm md:text-base mb-4">
                        {serviceType === 'wellnesspackage' 
                          ? service.includestest || "Comprehensive wellness package"
                          : `Laboratory test for ${service.testname}`}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-white rounded-lg p-3">
                          <p className="text-xs text-gray-600 font-medium">Original Price</p>
                          <p className="text-lg md:text-xl font-bold text-gray-400 line-through">₹{originalPrice}</p>
                        </div>
                        <div className="bg-blue-100 rounded-lg p-3">
                          <p className="text-xs text-blue-600 font-medium">Final Price</p>
                          <p className="text-lg md:text-xl font-bold text-blue-900">₹{finalPrice}</p>
                        </div>
                      </div>

                      {discountPercentage > 0 && (
                        <div className="flex items-center justify-center gap-2 bg-red-100 text-red-700 rounded-lg px-4 py-2">
                          <Award className="w-4 h-4" />
                          <span className="font-bold">Special Discount: {discountPercentage}% OFF</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                        <span className="text-gray-700">NABL Certified Lab</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <Clock className="w-5 h-5 text-blue-600" />
                        <span className="text-gray-700">Report Time: 24-48 hours</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                        <Shield className="w-5 h-5 text-purple-600" />
                        <span className="text-gray-700">Quality Assured Results</span>
                      </div>
                      {serviceType === 'wellnesspackage' && service.homevisit && (
                        <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                          <Users className="w-5 h-5 text-orange-600" />
                          <span className="text-gray-700">Home Visit Available</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* FACILITIES TAB */}
              {activeTab === 'facilities' && (
                <Card className="border border-gray-200 shadow-md rounded-xl">
                  <CardContent className="p-4 md:p-6">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Lab Facilities</h3>
                    <div className="space-y-3">
                      {[
                        { label: "Pathology Services", value: hospital?.hspInfo?.pathology, icon: <TestTube className="w-5 h-5" /> },
                        { label: "Diagnostic Services", value: hospital?.hspInfo?.diagnosticservices, icon: <Shield className="w-5 h-5" /> },
                        { label: "Cashless Services", value: hospital?.hspInfo?.cashlessservices, icon: <CreditCard className="w-5 h-5" /> },
                        { label: "Government Schemes", value: hospital?.hspInfo?.governmentschemes, icon: <FileText className="w-5 h-5" /> },
                        { label: "24/7 Service", value: "Yes", icon: <Clock className="w-5 h-5" /> },
                        { label: "Online Consultation", value: hospital?.hspInfo?.onlineconsultation, icon: <Video className="w-5 h-5" /> },
                        { label: "Home Healthcare", value: hospital?.hspInfo?.homehealthcare, icon: <Users className="w-5 h-5" /> },
                      ].map((facility, index) => {
                        const isAvailable = facility.value === "yes" || facility.value === "Yes";
                        return (
                          <div
                            key={index}
                            className={`flex items-center gap-4 p-4 rounded-lg ${
                              isAvailable ? "bg-blue-50 border border-blue-200" : "bg-gray-50 border border-gray-200"
                            } hover:shadow-md transition-shadow`}
                          >
                            <div className={`p-3 rounded-lg ${isAvailable ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"}`}>
                              {facility.icon}
                            </div>
                            <div className="flex-1">
                              <span className="text-base font-semibold text-gray-900">{facility.label}</span>
                              <p className="text-sm text-gray-600">{isAvailable ? "Available" : "Not Available"}</p>
                            </div>
                            {isAvailable && <CheckCircle className="w-6 h-6 text-blue-600" />}
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
                              "from-blue-50 blue-50 border-blue-200",
                              "from-blue-50 to-cyan-50 border-blue-200",
                              "from-purple-50 to-pink-50 border-purple-200",
                              "from-orange-50 to-amber-50 border-orange-200",
                              "from-teal-50 to-cyan-50 border-teal-200"
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
                                  {review.comment || "Great pathology lab with excellent facilities and staff."}
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
                        <p className="text-gray-400 text-sm mt-2">Be the first to review this lab</p>
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
                          <p className="text-gray-900 font-medium">{safeDisplay(hospital?.hspcontact?.receptioncontact1 || hospital?.mobile)}</p>
                          {hospital?.hspcontact?.receptioncontact2 && (
                            <p className="text-gray-700 text-sm mt-1">Reception 2: {hospital.hspcontact.receptioncontact2}</p>
                          )}
                          {hospital?.hspcontact?.alternateno && (
                            <p className="text-gray-700 text-sm mt-1">Alternate: {hospital.hspcontact.alternateno}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <Mail className="w-6 h-6 text-blue-600 mt-1" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-blue-900 mb-1">Email Addresses</h4>
                          <p className="text-gray-900 font-medium text-sm break-words">{safeDisplay(hospital?.hspcontact?.receptionemail || hospital?.email)}</p>
                          {hospital?.email && hospital.email !== hospital?.hspcontact?.receptionemail && (
                            <p className="text-gray-700 text-sm mt-1 break-words">Official: {hospital.email}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <MapPin className="w-6 h-6 text-purple-600 mt-1" />
                        <div>
                          <h4 className="font-semibold text-purple-900 mb-1">Lab Address</h4>
                          <p className="text-gray-900 font-medium leading-relaxed">
                            {safeDisplay(hospital?.hspcontact?.address)}
                          </p>
                          {hospital?.hspcontact?.city && (
                            <p className="text-gray-700 mt-2">
                              {hospital.hspcontact.city}, {hospital?.hspcontact?.taluka ? `${hospital.hspcontact.taluka}, ` : ""}{hospital?.hspcontact?.dist || ""}
                            </p>
                          )}
                          {hospital?.hspcontact?.state && (
                            <p className="text-gray-700">
                              {hospital.hspcontact.state} - {hospital?.hspcontact?.pincode || hospital?.pincode || ""}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                        <Clock className="w-6 h-6 text-orange-600 mt-1" />
                        <div>
                          <h4 className="font-semibold text-orange-900 mb-1">Service Hours</h4>
                          <p className="text-gray-900 font-medium">24/7 Sample Collection</p>
                          <p className="text-gray-700 text-sm mt-1">Lab: Mon-Sat, 8:00 AM - 8:00 PM</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* LAB INFO TAB */}
              {activeTab === 'info' && (
                <div className="space-y-4">
                  {/* Lab Information Card */}
                  <Card className="border border-gray-200 shadow-md rounded-xl">
                    <CardContent className="p-4">
                      <h3 className="text-base font-bold text-gray-900 mb-3">Lab Information</h3>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-gray-50 p-2 rounded">
                          <span className="text-gray-600">Registration No:</span>
                          <p className="font-semibold text-gray-900 text-xs">{hospital?.hspdetails?.hspregno || "N/A"}</p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <span className="text-gray-600">Established:</span>
                          <p className="font-semibold text-gray-900 text-xs">{getYear(hospital?.hspdetails?.hspregdate)}</p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <span className="text-gray-600">Experience:</span>
                          <p className="font-semibold text-gray-900 text-xs">{hospital?.hspInfo?.experience || "N/A"} years</p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <span className="text-gray-600">Status:</span>
                          <p className={`font-semibold text-xs ${hospital?.approvalStatus === 'APPROVED' ? 'text-blue-600' : 'text-yellow-600'}`}>
                            {hospital?.approvalStatus || "APPROVED"}
                          </p>
                        </div>
                      </div>
                      {hospital?.hspdetails?.nabhnablapproved === "Yes" && (
                        <div className="mt-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="flex items-center gap-2">
                            <Award className="w-4 h-4 text-blue-600" />
                            <span className="font-semibold text-blue-900 text-sm">NABL Accredited</span>
                          </div>
                          <p className="text-blue-700 text-xs mt-1">{hospital.hspdetails.nabhnabllevel}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Management Team Card */}
                  {(hospital?.hspcontact?.managername || hospital?.hspcontact?.adminname) && (
                    <Card className="border border-gray-200 shadow-md rounded-xl">
                      <CardContent className="p-4">
                        <h3 className="text-base font-bold text-gray-900 mb-3">Management Team</h3>
                        <div className="space-y-2">
                          {hospital?.hspcontact?.managername && (
                            <div className="p-2 bg-blue-50 rounded-lg">
                              <div className="flex items-center gap-2 mb-1">
                                <User className="w-4 h-4 text-blue-600" />
                                <span className="font-semibold text-blue-900 text-sm">Manager</span>
                              </div>
                              <p className="font-medium text-gray-900 text-sm">{hospital.hspcontact.managername}</p>
                              <p className="text-xs text-blue-700">{hospital.hspcontact.managercontact || "N/A"}</p>
                            </div>
                          )}
                          {hospital?.hspcontact?.adminname && (
                            <div className="p-2 bg-blue-50 rounded-lg">
                              <div className="flex items-center gap-2 mb-1">
                                <User className="w-4 h-4 text-blue-600" />
                                <span className="font-semibold text-blue-900 text-sm">Administrator</span>
                              </div>
                              <p className="font-medium text-gray-900 text-sm">{hospital.hspcontact.adminname}</p>
                              <p className="text-xs text-blue-700">{hospital.hspcontact.admincontact || "N/A"}</p>
                            </div>
                          )}
                        </div>
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
          <span className="text-[14px] text-[#666666]">Reception</span>
        </div>
        <p className="text-[15px] font-semibold text-[#243460] mt-1">
          {safeDisplay(hospital?.hspcontact?.receptioncontact1 || hospital?.mobile, "N/A")}
        </p>
      </div>

      {/* Email */}
      <div>
        <div className="flex items-center gap-2 text-[#243460]">
          <Mail className="w-4 h-4 text-[#666666]" />
          <span className="text-[14px] text-[#666666]">Email</span>
        </div>
        <p className="text-[15px] font-semibold text-[#243460] mt-1 truncate">
          {safeDisplay(hospital?.hspcontact?.receptionemail || hospital?.email, "N/A")}
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
          onClick={() => setShowRatingList(true)}
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
          safeDisplay(hospital?.hspcontact?.address, "")
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
        {safeDisplay(hospital?.hspcontact?.city, "City")}, {safeDisplay(hospital?.hspcontact?.state, "State")} {hospital?.hspcontact?.pincode || hospital?.pincode ? `- ${hospital.hspcontact.pincode || hospital.pincode}` : ""}
      </p>

      <p className="text-[15px] text-[#243460] font-medium mt-1 leading-5">
        {safeDisplay(hospital?.hspcontact?.address, "Address not available")}
      </p>
    </div>

  </div>

  {/* ---------------------- NEARBY TRANSPORT ---------------------- */}
  {hospital?.facilitiesJson?.transportation?.length > 0 && (
    <div className="mt-5">
      <h3 className="text-[16px] font-semibold text-[#C47C52] mb-2">
        Nearby Transportation
      </h3>

      <div className="space-y-3">
        {hospital.facilitiesJson.transportation.map((item, i) => (
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
  {hospital?.facilitiesJson?.landmarks?.length > 0 && (
    <div className="mt-6">
      <h3 className="text-[16px] font-semibold text-[#C47C52] mb-2">
        Nearby Landmarks
      </h3>

      <div className="space-y-3">
        {hospital.facilitiesJson.landmarks.map((place, i) => (
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
            { icon: <TestTube className="w-5 h-5 text-[#243460]" />, label: "Lab Tests", value: labTestsCount > 0 ? `${labTestsCount}` : "—", clickable: true, action: "labTests" },
            { icon: <Award className="w-5 h-5 text-[#243460]" />, label: "NABL Certified", value: "Certified", clickable: true, action: "nablCertified" },
            { icon: <Clock className="w-5 h-5 text-[#243460]" />, label: "Service Hours", value: "24/7", clickable: true, action: "serviceHours" },
            { icon: <Shield className="w-5 h-5 text-[#243460]" />, label: "Quality Assured", value: "100%", clickable: true, action: "qualityAssured" },
            { icon: <Users className="w-5 h-5 text-[#243460]" />, label: "Experience", value: hospital?.hspInfo?.experience ? `${hospital.hspInfo.experience}+ Years` : "—", clickable: true, action: "experience" },
            { icon: <Heart className="w-5 h-5 text-[#243460]" />, label: "Home Collection", value: "Available", clickable: true, action: "homeCollection" },
            { icon: <Video className="w-5 h-5 text-[#243460]" />, label: "Online Reports", value: "Available", clickable: true, action: "onlineReports" },
            { icon: <CreditCard className="w-5 h-5 text-[#243460]" />, label: "Cashless", value: "Available", clickable: true, action: "cashless" },
            { icon: <FileText className="w-5 h-5 text-[#243460]" />, label: "Govt Schemes", value: "Available", clickable: true, action: "govtSchemes" },
            ...(hospital?.hspdetails?.nabhnablapproved === "Yes"
              ? [{
                  icon: <Award className="w-5 h-5 text-[#243460]" />,
                  label: "NABL Level",
                  value: hospital.hspdetails.nabhnabllevel || "Level 8",
                  clickable: true,
                  action: "nablLevel",
                }]
              : []),
            { icon: <Star className="w-5 h-5 text-[#243460]" />, label: "Rating", value: `${avgRating} ★`, clickable: true, action: "rating" },
            { icon: <Building2 className="w-5 h-5 text-[#243460]" />, label: "Branches", value: branchData?.length > 0 ? branchData.length : "0", clickable: true, action: "branches" },
          ].map((item, idx) => (
            <div
              key={idx}
              onClick={
                item.clickable
                  ? () => {
                      if (item.action === "labTests") setShowLabTests(true);
                      else if (item.action === "homeCollection") setShowHomeCollection(true);
                      else if (item.action === "branches") setShowBranches(true);
                      else if (item.action === "govtSchemes") setShowGovtSchemes(true);
                      else if (item.action === "cashless") setShowCashless(true);
                      else if (item.action === "onlineReports") setShowOnlineReports(true);
                      else if (item.action === "nablCertified") setShowNablCertified(true);
                      else if (item.action === "rating") setShowRatingList(true);
                      else if (item.action === "serviceHours") setShowServiceHours(true);
                      else if (item.action === "qualityAssured") setShowQualityAssured(true);
                      else if (item.action === "experience") setShowExperience(true);
                      else if (item.action === "nablLevel") setShowNablLevel(true);
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
            {hospital?.hspdetails?.hsplogo && (
              <div className="w-14 h-14 rounded-lg overflow-hidden border-2 border-white/40 shadow-md bg-white flex-shrink-0">
                <Image
                  src={hospital.hspdetails.hsplogo}
                  width={56}
                  height={56}
                  alt="Lab Logo"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-white line-clamp-2 mb-1">
                {hospital?.hspInfo?.regname || "Pathology Lab"}
              </h1>
              <div className="flex items-center gap-1.5 text-white/90 text-xs">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">
                  {safeDisplay(hospital?.hspcontact?.city, "City")}, {safeDisplay(hospital?.hspcontact?.state, "State")}
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
                    alt="Lab Main View"
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
                          alt={`Lab Image ${index + 2}`}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="h-48 bg-gradient-to-br from-blue-50 via-emerald-50 to-teal-50 flex items-center justify-center rounded-xl">
                <div className="text-center p-6">
                  <TestTube className="w-16 h-16 text-blue-400 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-gray-700 mb-1">Pathology Lab</h3>
                  <p className="text-gray-500 text-sm">Images will be available soon</p>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setDialogOpen(true)}
              className="flex-1 bg-gradient-to-r from-blue-500 blue-500 hover:from-blue-600 hover:blue-600 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-md text-sm md:text-base flex items-center justify-center gap-2"
            >
              <TestTube className="w-4 h-4 md:w-5 md:h-5" />
              BOOK TEST
            </button>
            <button
              onClick={() => {
                const phone = hospital?.hspcontact?.receptioncontact1 || hospital?.mobile;
                if (phone) {
                  window.open(`tel:${phone}`, '_self');
                } else {
                  alert('Phone number not available');
                }
              }}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-md text-sm md:text-base flex items-center justify-center gap-2"
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
                { id: 'test-details', label: 'Test Details' },
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

          {/* Mobile Tab Content */}
          <div className="space-y-4">
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <Card className="border border-gray-200 shadow-sm rounded-xl">
                <CardContent className="p-4">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3">About {hospital?.hspInfo?.regname}</h3>
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">
                    {hospital?.hspInfo?.regname} is a leading pathology lab{hospital?.hspInfo?.experience ? ` with ${hospital.hspInfo.experience} years of experience` : ''} in providing quality diagnostic services.
                    Located in {safeDisplay(hospital?.hspcontact?.city, "your area")}, {safeDisplay(hospital?.hspcontact?.state, "")}, we are committed to
                    excellence in healthcare delivery with state-of-the-art equipment and NABL certified facilities.
                  </p>
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-blue-900 text-sm">Lab Status</h4>
                        <p className="text-blue-700 text-xs break-words">
                          Reg: {hospital?.hspdetails?.hspregno || "N/A"} | 
                          Est: {getYear(hospital?.hspdetails?.hspregdate)} | 
                          Status: <span className={`font-semibold ${hospital?.approvalStatus === 'APPROVED' ? 'text-blue-600' : 'text-yellow-600'}`}>
                            {hospital?.approvalStatus || "APPROVED"}
                          </span>
                        </p>
                        {hospital?.hspdetails?.nabhnablapproved === "Yes" && (
                          <p className="text-blue-700 text-xs mt-1 flex items-center gap-1">
                            <Award className="w-3 h-3" />
                            NABL Accredited - {hospital?.hspdetails?.nabhnabllevel}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { icon: <TestTube className="w-4 h-4" />, label: "Total Tests", value: "500+" },
                      { icon: <Clock className="w-4 h-4" />, label: "Report Time", value: "24-48 hrs" },
                      { icon: <Award className="w-4 h-4" />, label: "Certification", value: "NABL" },
                      { icon: <Users className="w-4 h-4" />, label: "Experience", value: hospital?.hspInfo?.experience ? `${hospital.hspInfo.experience}+ Years` : "N/A" },
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

            {/* TEST DETAILS TAB */}
            {activeTab === 'test-details' && (
              <Card className="border border-gray-200 shadow-sm rounded-xl">
                <CardContent className="p-4">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Test Details</h3>
                  
                  <div className="bg-gradient-to-br from-blue-50 blue-50 rounded-lg p-4 border border-blue-200 mb-4">
                    <h4 className="text-base font-bold text-gray-900 mb-2">{getServiceName()}</h4>
                    <p className="text-gray-700 text-sm mb-3">
                      {serviceType === 'wellnesspackage' 
                        ? service.includestest || "Comprehensive wellness package"
                        : `Laboratory test for ${service.testname}`}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="bg-white rounded-lg p-2">
                        <p className="text-xs text-gray-600 font-medium">Original Price</p>
                        <p className="text-sm font-bold text-gray-400 line-through">₹{originalPrice}</p>
                      </div>
                      <div className="bg-blue-100 rounded-lg p-2">
                        <p className="text-xs text-blue-600 font-medium">Final Price</p>
                        <p className="text-sm font-bold text-blue-900">₹{finalPrice}</p>
                      </div>
                    </div>

                    {discountPercentage > 0 && (
                      <div className="flex items-center justify-center gap-2 bg-red-100 text-red-700 rounded-lg px-3 py-1">
                        <Award className="w-3 h-3" />
                        <span className="font-bold text-xs">Special Discount: {discountPercentage}% OFF</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-700 text-sm">NABL Certified Lab</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-700 text-sm">Report Time: 24-48 hours</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                      <Shield className="w-4 h-4 text-purple-600" />
                      <span className="text-gray-700 text-sm">Quality Assured Results</span>
                    </div>
                    {serviceType === 'wellnesspackage' && service.homevisit && (
                      <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                        <Users className="w-4 h-4 text-orange-600" />
                        <span className="text-gray-700 text-sm">Home Visit Available</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* FACILITIES TAB */}
            {activeTab === 'facilities' && (
              <Card className="border border-gray-200 shadow-sm rounded-xl">
                <CardContent className="p-4">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Lab Facilities</h3>
                  <div className="space-y-2">
                    {[
                      { label: "Pathology Services", value: hospital?.hspInfo?.pathology, icon: <TestTube className="w-4 h-4" /> },
                      { label: "Diagnostic Services", value: hospital?.hspInfo?.diagnosticservices, icon: <Shield className="w-4 h-4" /> },
                      { label: "Cashless Services", value: hospital?.hspInfo?.cashlessservices, icon: <CreditCard className="w-4 h-4" /> },
                      { label: "Government Schemes", value: hospital?.hspInfo?.governmentschemes, icon: <FileText className="w-4 h-4" /> },
                      { label: "24/7 Service", value: "Yes", icon: <Clock className="w-4 h-4" /> },
                      { label: "Online Consultation", value: hospital?.hspInfo?.onlineconsultation, icon: <Video className="w-4 h-4" /> },
                      { label: "Home Healthcare", value: hospital?.hspInfo?.homehealthcare, icon: <Users className="w-4 h-4" /> },
                    ].map((facility, index) => {
                      const isAvailable = facility.value === "yes" || facility.value === "Yes";
                      return (
                        <div
                          key={index}
                          className={`flex items-center gap-3 p-3 rounded-lg ${
                            isAvailable ? "bg-blue-50 border border-blue-200" : "bg-gray-50 border border-gray-200"
                          }`}
                        >
                          <div className={`p-2 rounded-lg flex-shrink-0 ${isAvailable ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"}`}>
                            {facility.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-semibold text-gray-900 block">{facility.label}</span>
                            <p className="text-xs text-gray-600">{isAvailable ? "Available" : "Not Available"}</p>
                          </div>
                          {isAvailable && <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* REVIEWS TAB */}
            {activeTab === 'reviews' && (
              <Card className="border border-gray-200 shadow-sm rounded-xl">
                <CardContent className="p-4">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Patient Reviews</h3>
                  {reviews.length > 0 ? (
                    <>
                      <div className="text-center mb-4">
                        <div className="flex justify-center mb-2">
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
                        <p className="text-gray-500 text-xs mb-4">{totalReviews} verified reviews</p>
                      </div>
                      <div className="space-y-3">
                        {reviews.slice(0, 3).map((review, index) => {
                          const patientName = review.patient?.firstName 
                            ? `${review.patient.firstName} ${review.patient.lastName || ''}`.trim()
                            : review.patientName || "Anonymous Patient";
                          const patientInitial = patientName.charAt(0).toUpperCase();
                          
                          const bgColors = [
                            "from-blue-50 blue-50 border-blue-200",
                            "from-blue-50 to-cyan-50 border-blue-200",
                            "from-purple-50 to-pink-50 border-purple-200"
                          ];
                          
                          return (
                            <div key={review.id || index} className={`bg-gradient-to-r ${bgColors[index % 3]} p-4 rounded-lg border`}>
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-xs">
                                    {patientInitial}
                                  </div>
                                  <div>
                                    <p className="font-semibold text-gray-900 text-sm">{patientName}</p>
                                    <p className="text-xs text-gray-600">
                                      {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : "Recently"}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-3 h-3 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-gray-700 text-sm">
                                {review.comment || "Great pathology lab with excellent facilities and staff."}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-6">
                      <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">No reviews yet</p>
                      <p className="text-gray-400 text-xs mt-1">Be the first to review this lab</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* CONTACT TAB */}
            {activeTab === 'contact' && (
              <Card className="border border-gray-200 shadow-sm rounded-xl">
                <CardContent className="p-4">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <Phone className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-blue-900 mb-1 text-sm">Phone Numbers</h4>
                        <p className="text-gray-900 font-medium text-sm">{safeDisplay(hospital?.hspcontact?.receptioncontact1 || hospital?.mobile)}</p>
                        {hospital?.hspcontact?.receptioncontact2 && (
                          <p className="text-gray-700 text-xs mt-1">Reception 2: {hospital.hspcontact.receptioncontact2}</p>
                        )}
                        {hospital?.hspcontact?.alternateno && (
                          <p className="text-gray-700 text-xs mt-1">Alternate: {hospital.hspcontact.alternateno}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <Mail className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-blue-900 mb-1 text-sm">Email Addresses</h4>
                        <p className="text-gray-900 font-medium text-xs break-words">{safeDisplay(hospital?.hspcontact?.receptionemail || hospital?.email)}</p>
                        {hospital?.email && hospital.email !== hospital?.hspcontact?.receptionemail && (
                          <p className="text-gray-700 text-xs mt-1 break-words">Official: {hospital.email}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <MapPin className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-purple-900 mb-1 text-sm">Lab Address</h4>
                        <p className="text-gray-900 font-medium leading-relaxed text-sm">
                          {safeDisplay(hospital?.hspcontact?.address)}
                        </p>
                        {hospital?.hspcontact?.city && (
                          <p className="text-gray-700 mt-1 text-xs">
                            {hospital.hspcontact.city}, {hospital?.hspcontact?.taluka ? `${hospital.hspcontact.taluka}, ` : ""}{hospital?.hspcontact?.dist || ""}
                          </p>
                        )}
                        {hospital?.hspcontact?.state && (
                          <p className="text-gray-700 text-xs">
                            {hospital.hspcontact.state} - {hospital?.hspcontact?.pincode || hospital?.pincode || ""}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <Clock className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-orange-900 mb-1 text-sm">Service Hours</h4>
                        <p className="text-gray-900 font-medium text-sm">24/7 Sample Collection</p>
                        <p className="text-gray-700 text-xs mt-1">Lab: Mon-Sat, 8:00 AM - 8:00 PM</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* INFO TAB */}
            {activeTab === 'info' && (
              <div className="space-y-3">
                {/* Lab Information Card */}
                <Card className="border border-gray-200 shadow-sm rounded-xl">
                  <CardContent className="p-4">
                    <h3 className="text-base font-bold text-gray-900 mb-3">Lab Information</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-gray-50 p-2 rounded">
                        <span className="text-gray-600 text-xs block mb-0.5">Registration No:</span>
                        <p className="font-semibold text-gray-900 text-xs break-words">{hospital?.hspdetails?.hspregno || "N/A"}</p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <span className="text-gray-600 text-xs block mb-0.5">Established:</span>
                        <p className="font-semibold text-gray-900 text-xs">{getYear(hospital?.hspdetails?.hspregdate)}</p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <span className="text-gray-600 text-xs block mb-0.5">Experience:</span>
                        <p className="font-semibold text-gray-900 text-xs">{hospital?.hspInfo?.experience || "N/A"} years</p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <span className="text-gray-600 text-xs block mb-0.5">Status:</span>
                        <p className={`font-semibold text-xs ${hospital?.approvalStatus === 'APPROVED' ? 'text-blue-600' : 'text-yellow-600'}`}>
                          {hospital?.approvalStatus || "APPROVED"}
                        </p>
                      </div>
                    </div>
                    {hospital?.hspdetails?.nabhnablapproved === "Yes" && (
                      <div className="mt-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-blue-600 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <span className="font-semibold text-blue-900 text-sm block">NABL Accredited</span>
                            <p className="text-blue-700 text-xs">{hospital.hspdetails.nabhnabllevel}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {(hospital?.hspcontact?.managername || hospital?.hspcontact?.adminname) && (
                  <Card className="border border-gray-200 shadow-sm rounded-xl">
                    <CardContent className="p-4">
                      <h3 className="text-base font-bold text-gray-900 mb-3">Management Team</h3>
                      <div className="space-y-2">
                        {hospital?.hspcontact?.managername && (
                          <div className="p-2 bg-blue-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <User className="w-4 h-4 text-blue-600 flex-shrink-0" />
                              <span className="font-semibold text-blue-900 text-sm">Manager</span>
                            </div>
                            <p className="font-medium text-gray-900 text-sm">{hospital.hspcontact.managername}</p>
                            <p className="text-xs text-blue-700">{hospital.hspcontact.managercontact || "N/A"}</p>
                          </div>
                        )}
                        {hospital?.hspcontact?.adminname && (
                          <div className="p-2 bg-blue-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <User className="w-4 h-4 text-blue-600 flex-shrink-0" />
                              <span className="font-semibold text-blue-900 text-sm">Administrator</span>
                            </div>
                            <p className="font-medium text-gray-900 text-sm">{hospital.hspcontact.adminname}</p>
                            <p className="text-xs text-blue-700">{hospital.hspcontact.admincontact || "N/A"}</p>
                          </div>
                        )}
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
              <div className="bg-gradient-to-r from-blue-600 blue-600 p-3">
                <h2 className="text-lg font-bold text-white text-center">Our Services</h2>
                <p className="text-blue-100 text-center text-xs mt-0.5">
                  Comprehensive pathology services
                </p>
              </div>
              <div className="p-3">
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { icon: <TestTube className="w-4 h-4 text-blue-600" />, label: "Lab Tests", value: "500+",  action: "labTests" },
                    { icon: <Award className="w-4 h-4 text-purple-600" />, label: "NABL", value: "Certified" },
                    { icon: <Clock className="w-4 h-4 text-orange-600" />, label: "Service", value: "24/7" },
                    { icon: <Shield className="w-4 h-4 text-indigo-600" />, label: "Quality", value: "100%" },
                    { icon: <Users className="w-4 h-4 text-cyan-600" />, label: "Experience", value: hospital?.hspInfo?.experience ? `${hospital.hspInfo.experience}+` : "10+" },
                    { icon: <Heart className="w-4 h-4 text-red-600" />, label: "Home", value: "Available",  action: "homeCollection" },
                    { icon: <Video className="w-4 h-4 text-blue-600" />, label: "Reports", value: "Online",  action: "onlineReports" },
                    { icon: <CreditCard className="w-4 h-4 text-orange-600" />, label: "Cashless", value: "Yes",  action: "cashless" },
                    { icon: <FileText className="w-4 h-4 text-blue-600" />, label: "Govt", value: "Schemes",  action: "govtSchemes" },
                    ...(hospital?.hspdetails?.nabhnablapproved === "Yes"
                      ? [{ icon: <Award className="w-4 h-4 text-blue-600" />, label: "NABL", value: hospital.hspdetails.nabhnabllevel }]
                      : []),
                    { icon: <Star className="w-4 h-4 text-yellow-600" />, label: "Rating", value: `${avgRating} ★` },
                    { icon: <Building2 className="w-4 h-4 text-purple-600" />, label: "Branches",   value: branchData.length > 0 ? branchData.length : "0",   action: "branches" },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        if (item.clickable) {
                          if (item.action === "labTests") {
                            setShowLabTests(true);
                          } else if (item.action === "homeCollection") {
                            setShowHomeCollection(true);
                          } else if (item.action === "branches") {
                            setShowBranches(true);
                          } else if (item.action === "govtSchemes") {
                            setShowGovtSchemes(true);
                          } else if (item.action === "cashless") {
                            setShowCashless(true);
                          } else if (item.action === "onlineReports") {
                            setShowOnlineReports(true);
                          }
                        }
                      }}
                      className={`bg-white p-2 rounded-lg border border-gray-200 shadow-sm text-center flex flex-col items-center justify-center min-h-[75px] ${
                        item.clickable ? 'cursor-pointer hover:border-blue-400 hover:bg-blue-50 active:bg-blue-100' : ''
                      }`}
                    >
                      <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-50 mb-1">
                        {item.icon}
                      </div>
                      <h3 className="font-semibold text-gray-900 text-[10px] mb-0.5 leading-tight line-clamp-2">
                        {item.label}
                      </h3>
                      <p className="font-bold text-blue-700 text-[10px]">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mobile Test Booking Card */}
          <Card className="border border-blue-200 shadow-md rounded-xl bg-gradient-to-br from-blue-50 blue-50">
            <CardContent className="p-4">
              <h3 className="text-base font-bold text-gray-900 mb-3 text-center">Book Your Test</h3>
              
              <div className="bg-white rounded-lg p-3 mb-3 text-center">
                <p className="text-xs text-gray-600 mb-1">Test Price</p>
                {discountPercentage > 0 && (
                  <p className="text-sm text-gray-400 line-through">₹{originalPrice}</p>
                )}
                <p className="text-xl font-bold text-blue-600">₹{finalPrice}</p>
                {discountPercentage > 0 && (
                  <Badge className="bg-red-500 text-white mt-1 text-xs">
                    {discountPercentage}% OFF
                  </Badge>
                )}
              </div>

              <button
                onClick={() => setDialogOpen(true)}
                className="w-full bg-gradient-to-r from-blue-500 blue-500 hover:from-blue-600 hover:blue-600 text-white font-bold py-3 rounded-lg transition-all shadow-md text-sm flex items-center justify-center gap-2"
              >
                <TestTube className="w-4 h-4" />
                Book Now
              </button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Booking Dialogs */}
      {serviceType === 'labtest' && (
        <BookLabTestDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          patientId={patientId}
          serviceId={service?.id}
          hospitalId={hospital?.id}
        />
      )}
      
      {serviceType === 'wellnesspackage' && (
        <BookWellnessPackageDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          patientId={patientId}
          serviceId={service?.id}
          hospitalId={hospital?.id}
        />
      )}
      
      {serviceType === 'bloodbank' && (
        <BookBloodBankDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          patientId={patientId}
          serviceId={service?.id}
          hospitalId={hospital?.id}
        />
      )}

      {/* Lab Tests List Modal */}
      {showLabTests && (
  <LabTestsList
    onClose={() => setShowLabTests(false)}
    hospitalId={hospital?.id || "685e7365e4636b3c5cd02d53"}
  />
)}


      {/* Home Collection List Modal */}
      {showHomeCollection && (
  <HomeCollectionList
    onClose={() => setShowHomeCollection(false)}
    hospitalId={hospital?.id || "685e7365e4636b3c5cd02d53"}
  />
)}


      {/* Branches List Modal */}
      {showBranches && (
  <BranchesList
    onClose={() => setShowBranches(false)}
    hospitalId={hospital?.id || "685e7365e4636b3c5cd02d53"}
  />
)}


      {/* Government Schemes List Modal */}
      {showGovtSchemes && (
  <GovtSchemesList
    onClose={() => setShowGovtSchemes(false)}
    hospitalId={hospital?.id || "685e7365e4636b3c5cd02d53"}
  />
)}


      {/* Cashless Services List Modal */}
{showCashless && (
  <CashlessList
    onClose={() => setShowCashless(false)}
    hospitalId={hospital?.id || "685e7365e4636b3c5cd02d53"}
  />
)}



      {/* NABL Certified List Modal */}
{showNablCertified && (
  <NablCertifiedList
    onClose={() => setShowNablCertified(false)}
    hospitalId={hospital?.id || "685e7365e4636b3c5cd02d53"}
  />
)}


      {/* Online Reports List Modal */}
      {showOnlineReports && (
  <OnlineReportsList
    onClose={() => setShowOnlineReports(false)}
    hospitalId={hospital?.id || "685e7365e4636b3c5cd02d53"}
  />
)}

{showRatingList && (
  <RatingList
    onClose={() => setShowRatingList(false)}
    hospitalId={hospital?.id || "685e7365e4636b3c5cd02d53"}
  />
)}

{showServiceHours && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    onClick={() => setShowServiceHours(false)}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      className="relative bg-white text-gray-800 rounded-2xl w-[90%] max-w-sm shadow-2xl overflow-hidden border border-gray-200"
    >
      {/* Header Bar — same blue as main header */}
      <div className="bg-[#3D85EF] text-white py-3 px-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-white" />
          <h3 className="text-base font-semibold tracking-wide">
            Service Hours
          </h3>
        </div>
        <button
          onClick={() => setShowServiceHours(false)}
          className="text-white/80 hover:text-white"
        >
          ✕
        </button>
      </div>

      {/* Body */}
      <div className="p-5 bg-white">
        <p className="text-sm font-medium leading-relaxed text-gray-800">
          <strong>Lab Hours:</strong>{" "}
          {serviceHours === "24/7" ? "Open 24 Hours" : serviceHours}
        </p>
        <p className="text-sm font-medium leading-relaxed mt-2 text-gray-800">
          <strong>Home Collection:</strong> 24/7 Available
        </p>
      </div>
    </div>
  </div>
)}

{showQualityAssured && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    onClick={() => setShowQualityAssured(false)}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      className="relative bg-white text-gray-900 rounded-2xl w-[90%] max-w-md shadow-2xl overflow-hidden border border-gray-200"
    >
      {/* Header */}
      <div className="bg-[#3D85EF] text-white py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-white" />
          <h3 className="text-lg font-semibold tracking-wide">
            Quality Assured
          </h3>
        </div>
        <button
          onClick={() => setShowQualityAssured(false)}
          className="text-white/80 hover:text-white text-lg"
        >
          ✕
        </button>
      </div>

      {/* Body */}
      <div className="p-6 bg-white space-y-5">
        {/* Tags */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="inline-flex items-center justify-center bg-blue-50 text-blue-700 font-medium px-3 py-1 rounded-full text-xs border border-blue-200 uppercase tracking-wide">
            NABL Certified
          </span>
          <span className="inline-flex items-center justify-center bg-green-50 text-green-700 font-medium px-3 py-1 rounded-full text-xs border border-green-200 uppercase tracking-wide">
            100% Quality
          </span>
        </div>

        {/* Description */}
        <div className="text-[15px] leading-relaxed text-gray-800 space-y-3">
          <p>
            Our laboratories strictly adhere to{" "}
            <span className="font-semibold text-gray-900">
              NABL-accredited standards
            </span>
            , ensuring the highest level of{" "}
            <span className="text-blue-600 font-medium">precision</span> and{" "}
            <span className="text-blue-600 font-medium">accuracy</span> in
            every diagnostic test.
          </p>
          <p>
            All samples are processed using{" "}
            <span className="font-semibold">advanced automation</span> and
            verified by certified professionals to deliver{" "}
            <span className="text-blue-600 font-medium">consistent, reliable</span>{" "}
            results trusted by healthcare providers and patients nationwide.
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200"></div>

        {/* Footer */}
        <div className="flex items-center justify-center text-blue-700 font-semibold text-sm tracking-wide">
          <Shield className="w-4 h-4 mr-2" />
          Quality You Can Trust
        </div>
      </div>
    </div>
  </div>
)}

{showExperience && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    onClick={() => setShowExperience(false)}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      className="relative bg-white text-gray-900 rounded-2xl w-[90%] max-w-md shadow-2xl overflow-hidden border border-gray-200"
    >
      {/* Header */}
      <div className="bg-[#3D85EF] text-white py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-white" />
          <h3 className="text-lg font-semibold tracking-wide">
            Experience
          </h3>
        </div>
        <button
          onClick={() => setShowExperience(false)}
          className="text-white/80 hover:text-white text-lg"
        >
          ✕
        </button>
      </div>

      {/* Body */}
      <div className="p-6 bg-white space-y-5">
        {/* Tags */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="inline-flex items-center justify-center bg-blue-50 text-blue-700 font-medium px-3 py-1 rounded-full text-xs border border-blue-200 uppercase tracking-wide">
            {hospital?.hspInfo?.experience
              ? `${hospital.hspInfo.experience}+ Years`
              : "0 Years"}{" "}
            of Excellence
          </span>
          <span className="inline-flex items-center justify-center bg-gray-50 text-gray-700 font-medium px-3 py-1 rounded-full text-xs border border-gray-200 uppercase tracking-wide">
            Trusted Expertise
          </span>
        </div>

        {/* Description */}
        <div className="text-[15px] leading-relaxed text-gray-800 space-y-3">
          <p>
            With over{" "}
            <span className="font-semibold text-gray-900">
              {hospital?.hspInfo?.experience || "11"} years
            </span>{" "}
            of experience in diagnostics and pathology, our experts have built a legacy of{" "}
            <span className="text-blue-600 font-medium">trust</span>,{" "}
            <span className="text-blue-600 font-medium">accuracy</span>, and{" "}
            <span className="text-blue-600 font-medium">excellence</span>.
          </p>
          <p>
            We ensure every diagnostic process meets professional standards and leverages
            modern medical technology to deliver{" "}
            <span className="font-semibold">consistent and reliable</span> results for patients and healthcare providers.
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200"></div>

        {/* Footer */}
        <div className="flex items-center justify-center text-blue-700 font-semibold text-sm tracking-wide">
          <Users className="w-4 h-4 mr-2" />
          Over {hospital?.hspInfo?.experience || "a Decade"} of Trusted Care
        </div>
      </div>
    </div>
  </div>
)}

{showNablLevel && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    onClick={() => setShowNablLevel(false)}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      className="relative bg-white text-gray-900 rounded-2xl w-[90%] max-w-md shadow-2xl overflow-hidden border border-gray-200"
    >
      {/* Header */}
      <div className="bg-[#3D85EF] text-white py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-white" />
          <h3 className="text-lg font-semibold tracking-wide">
            NABL Accreditation
          </h3>
        </div>
        <button
          onClick={() => setShowNablLevel(false)}
          className="text-white/80 hover:text-white text-lg"
        >
          ✕
        </button>
      </div>

      {/* Body */}
      <div className="p-6 bg-white space-y-5">
        {/* Tags */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="inline-flex items-center justify-center bg-blue-50 text-blue-700 font-medium px-3 py-1 rounded-full text-xs border border-blue-200 uppercase tracking-wide">
            NABL Level {hospital?.hspdetails?.nabhnabllevel || "3"}
          </span>
          <span className="inline-flex items-center justify-center bg-gray-50 text-gray-700 font-medium px-3 py-1 rounded-full text-xs border border-gray-200 uppercase tracking-wide">
            National Accreditation Board
          </span>
        </div>

        {/* Description */}
        <div className="text-[15px] leading-relaxed text-gray-800 space-y-3">
          <p>
            This laboratory is accredited by the{" "}
            <span className="font-semibold text-gray-900">
              National Accreditation Board for Testing and Calibration Laboratories (NABL)
            </span>, ensuring compliance with international quality standards.
          </p>
          <p>
            <span className="font-semibold">Level {hospital?.hspdetails?.nabhnabllevel || "3"}</span> indicates adherence to rigorous testing protocols, documentation,
            and precision benchmarks that maintain the lab’s{" "}
            <span className="text-blue-600 font-medium">technical competence</span> and{" "}
            <span className="text-blue-600 font-medium">data reliability</span>.
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200"></div>

        {/* Footer */}
        <div className="flex items-center justify-center text-blue-700 font-semibold text-sm tracking-wide">
          <Award className="w-4 h-4 mr-2" />
          Certified NABL Level {hospital?.hspdetails?.nabhnabllevel || "0"} Laboratory
        </div>
      </div>
    </div>
  </div>
)}






    </div>
  );
};

export default PathologySinglePageClient;
