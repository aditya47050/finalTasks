"use client";
import React, { useState, useEffect } from "react";
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
  ArrowRight,
  CheckSquare,
  BusFront,
  Plane,
  Train,
  Landmark,
  Route,
  Briefcase,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

import { FaHospital, FaAmbulance } from "react-icons/fa";
import HospitalDoctorsList from "./HospitalDoctorsList";
import HospitalSpecialtiesList from "./HospitalSpecialtiesList";
import HospitalBranchesList from "./HospitalBranchesList";
import GovtSchemesList from "./GovtSchemesList";
import HospitalAmbulancesList from "./HospitalAmbulancesList";
import HospitalWellnessPackagesList from "./HospitalWellnessPackagesList";
import HospitalHomeHealthcareList from "./HospitalHomeHealthcareList";
import HospitalBedsList from "./HospitalBedsList";
import HospitalSurgeryList from "./HospitalSurgeryList";
import HospitalWellnessList from "./HospitalWellnessList";
import HospitalTreatmentList from './HospitalTreatmentList';
import HospitalDiagnosticList from './HospitalDiagnosticList';
import HospitalReviewList from "./HospitalReviewList";
import HospitalFacilitiesList from "./HospitalFacilitiesList";
import HospitalPharmacyList from "./PharmacyList";
import HospitalNablPathologyList from "./HospitalNablList";
import AccreditationList from "./AccreditationList";
import InhouseCanteenList from "./InhouseCanteenList";


const HospitalSingleView = ({ hospitalData, patientId, allHospitals }) => {
  console.log("🚀 ~ Hospital Data:", hospitalData)
  console.log("🚀 ~ Hospital Specialities:", JSON.stringify(hospitalData.HospitalSpeciality, null, 2))
  
  const [activeTab, setActiveTab] = useState('overview');
  const [showDoctorsList, setShowDoctorsList] = useState(false);
  const [showSpecialtiesList, setShowSpecialtiesList] = useState(false);
  const [showBranchesList, setShowBranchesList] = useState(false);
  const [govtSchemesDialogOpen, setGovtSchemesDialogOpen] = useState(false);
  const [showAmbulances, setShowAmbulances] = useState(false);
  const [showWellnessPackages, setShowWellnessPackages] = useState(false);
  const [showHomeHealthcare, setShowHomeHealthcare] = useState(false);
  const [showBeds, setShowBeds] = useState(false);
  const [showSurgery, setShowSurgery] = useState(false);
  const [showWellnessList, setShowWellnessList] = useState(false);
  const [showTreatment, setShowTreatment] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
const [showReviewsModal, setShowReviewsModal] = useState(false);
const [showFacilities, setShowFacilities] = useState(false);
const [showNablPathology, setShowNablPathology] = useState(false);
const [showPharmacy, setShowPharmacy] = useState(false);
const [showAccreditation, setShowAccreditation] = useState(false);
const [showCanteen, setShowCanteen] = useState(false);
// added these states
const [doctorCount, setDoctorCount] = useState(null);
const [bedCount, setBedCount] = useState(null);
const [ambulanceCount, setAmbulanceCount] = useState(null);
const [specialtyCount, setSpecialtyCount] = useState(null);
const [showOnlineConsultation, setShowOnlineConsultation] = useState(false);
const [showCashless, setShowCashless] = useState(false);
const [showModernFacilities, setShowModernFacilities] = useState(false);
const roomFacilities = hospitalData?.facilitiesJson?.roomFacilities || [];
const [bedsData, setBedsData] = useState(null);
const [selectedCategory, setSelectedCategory] = useState(null);



const modernFacilitiesServices = [
  { 
    label: "Online Consultation", 
    value: hospitalData?.hspInfo?.onlineconsultation, 
    icon: <Video className="w-5 h-5" />, 
    desc: "Consult with doctors remotely" 
  },
  { 
    label: "Home Healthcare", 
    value: hospitalData?.hspInfo?.homehealthcare, 
    icon: <User className="w-5 h-5" />, 
    desc: "Medical care at your home" 
  },
  { 
    label: "24/7 Pharmacy", 
    value: hospitalData?.hspInfo?.pharmacy, 
    icon: <TestTube className="w-5 h-5" />, 
    desc: "Round-the-clock pharmacy services" 
  },
  { 
    label: "Pathology Lab", 
    value: hospitalData?.hspInfo?.pathology, 
    icon: <TestTube className="w-5 h-5" />, 
    desc: "Comprehensive lab testing" 
  },
  { 
    label: "Radiology", 
    value: hospitalData?.hspInfo?.diagnosticservices, 
    icon: <Shield className="w-5 h-5" />, 
    desc: "X-Ray, CT, MRI services" 
  },
  { 
    label: "Blood Bank", 
    value: "Yes", 
    icon: <Shield className="w-5 h-5" />, 
    desc: "24/7 blood availability" 
  },
];


const validCenters = hospitalData?.linkedDiagnosticCenters?.filter(
  (c) => c.diagnosticCenter !== null
);

const diagnosticCenterId = validCenters?.[0]?.diagnosticCenterId;


    console.log("🐛 FULL HOSPITAL DATA:", hospitalData);

console.log("🐛 LINKED CENTERS RAW:", hospitalData?.linkedDiagnosticCenters);




useEffect(() => {
  if (!hospitalData?.id) return;

  const fetchCounts = async () => {
    try {
      const [doctorsRes, bedsRes, ambulanceRes, specialtiesRes] = await Promise.all([
        fetch(`/api/hospital/${hospitalData.id}/doctors`),
        fetch(`/api/hospital/${hospitalData.id}/beds`),
        fetch(`/api/hospital/${hospitalData.id}/ambulances`),
        fetch(`/api/hospital/${hospitalData.id}/specialties`),
      ]);

      const [doctorsData, bedsJson, ambulancesData, specialtiesData] = await Promise.all([
        doctorsRes.json(),
        bedsRes.json(),
        ambulanceRes.json(),
        specialtiesRes.json(),
      ]);

      // Counts set kar rahe hain
      setDoctorCount(doctorsData?.doctors?.length || 0);
      setBedCount(bedsJson?.beds?.length || 0);
      setBedsData(bedsJson);                    // ← YE NAZAR ANDAZ MAT KARNA (Important!)
      setAmbulanceCount(ambulancesData?.ambulances?.length || 0);
      setSpecialtyCount(specialtiesData?.specialties?.length || 0);

    } catch (error) {
      console.error("Error fetching hospital data:", error);
    }
  };

  fetchCounts();
}, [hospitalData?.id]);


const bedCategoryMapping = {
  "MALE_WARD": "Male Ward",
  "FEMALE_WARD": "Female Ward",
  "NON_AC_SEMI_PRIVATE_SHARING_ROOM": "Non AC Semi Private Bed",
  "AC_SEMI_PRIVATE_SHARING_ROOM": "AC Semi Private Bed",
  "GENERAL_WARD": "General Ward",
  "DELUXE": "Deluxe Bed",
  "SUITE": "Suite Bed",
  "ICU_WITHOUT_VENTILATOR": "ICU Bed Without Ventilator",
  "ICU_WITH_VENTILATOR": "ICU Ventilator Bed",
  "NICU": "NICU Bed",
  "PICU": "PICU Bed",
  "HDU": "HDU Bed",
};


  // Get reviews from hospital data
  const reviews = hospitalData?.HosptalReview || hospitalData?.reviews || [];
  console.log("🚀 ~ Hospital Reviews:", JSON.stringify(reviews, null, 2))
  
  // Calculate average rating from actual reviews
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length).toFixed(1) 
    : "0.0";
  const totalReviews = reviews.length || 127;

  const hospitalImages = [
    hospitalData?.hspdetails?.hsplogo,
    hospitalData?.hspdetails?.hspregcertificate,
    hospitalData?.hspdetails?.nabhnablcertificate,
    hospitalData?.hspdetails?.pancardimg,
    hospitalData?.hspdetails?.cancelledcheque,
  ].filter(Boolean);

  const images = hospitalImages.length > 0
    ? hospitalImages.length >= 6
      ? hospitalImages.slice(0, 6)
      : [...hospitalImages, ...hospitalImages, ...hospitalImages].slice(0, 6)
    : [];

  const mainImage = images[0];

  // Helper to format year from date string
  const getYear = (dateStr) => {
    if (!dateStr) return "N/A";
    const year = new Date(dateStr).getFullYear();
    return isNaN(year) ? "N/A" : year;
  };

  return (
    <div key={hospitalData?.id || 'no-hospital'} className="w-full bg-gray-50 relative min-h-screen">
      {/* Desktop View - Show on large screens only */}
      <div className="hidden lg:block">
{/* =================== HOSPITAL HEADER (Exact Screenshot + Exact Layout) =================== */}
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
      {hospitalData?.hspInfo?.regname || "Hospital Name"}
    </h1>

    <div className="flex items-center gap-2 text-[#243460] text-[15px] leading-none">
      <Building2 className="w-4 h-4" />
      {hospitalData?.hspdetails?.category || "Gynac Hospital"}
    </div>
  </div>

{/* RIGHT SECTION */}
<div className="flex flex-col items-end gap-2">

  {/* BUTTONS */}
  <div className="flex items-center gap-3">
    <button
      onClick={() => {
        const phone =
          hospitalData?.hspcontact?.receptioncontact1 ||
          hospitalData?.mobile;
        if (phone) window.open(`tel:${phone}`, "_self");
      }}
      className="px-6 py-2 rounded-[12px] text-white text-[15px] font-semibold"
      style={{ background: "#5868F2" }}
    >
      Call Now
    </button>

    <button
      onClick={() => setShowBooking(true)}
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
  alt="Hospital Main View"
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
                        alt={`Hospital Image ${index + 2}`}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    </div>
                  ))}
                  {images.length === 0 && (
                    <div className="col-span-4 row-span-2 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                      <div className="text-center p-6">
                        <FaHospital className="w-20 h-20 text-gray-400 mx-auto mb-4" />
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
          { id: 'facilities', label: 'Facilities' },
          { id: 'services', label: 'Services' },
          { id: 'doctors', label: 'Doctors' },
          { id: 'reviews', label: 'Reviews' },
          { id: 'contact', label: 'Contact' },
          { id: 'info', label: 'Hospital Info' },
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
  onClick={() => alert("Booking appointment feature coming soon!")}
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

{/* --- CARD 1: ABOUT HOSPITAL --- */}
<Card
  className="w-[806px] h-[187px] border border-[#00000033] rounded-[12px] shadow-sm mt-5"
>
  <CardContent className="p-5">
    <h3 className="text-xl md:text-2xl font-bold mb-3"
      style={{ color: "#243460" }}
    >
      About {hospitalData?.hspInfo?.regname}
    </h3>

    <p
      className="text-sm md:text-base leading-relaxed"
      style={{ color: "#666666" }}
    >
      {hospitalData?.hspInfo?.regname} is a leading healthcare institution with{" "}
      {hospitalData?.hspInfo?.experience || "N/A"} years of experience in
      providing quality medical care. Located in{" "}
      {hospitalData?.hspcontact?.city}, {hospitalData?.hspcontact?.state}, we
      are committed to excellence in healthcare delivery with state-of-the-art
      facilities and {hospitalData?.hspInfo?.totaldoctor || "N/A"} experienced
      medical professionals across{" "}
      {hospitalData?.hspInfo?.totalspeciality || "N/A"} specialities.
    </p>
  </CardContent>
</Card>


{/* --- CARD 2: HOSPITAL STATUS (Exact Figma Design) --- */}
<Card
  className="w-[806px] h-[121px] border border-[#00000033] rounded-[12px] shadow-sm"
>
  <CardContent className="p-5">

    {/* Title */}
    <h3
      className="text-xl font-bold mb-3"
      style={{ color: "#243460" }}
    >
      Hospital Status
    </h3>

    {/* Registration / Established / Status Row */}
    <div className="text-sm flex flex-wrap gap-2">
      <span style={{ color: "#407BFF" }}>Registration:</span>
      <span style={{ color: "#E68B67" }}>
        {hospitalData?.hspdetails?.hspregno || "N/A"}
      </span>

      <span style={{ color: "#407BFF" }}>| Established:</span>
      <span style={{ color: "#E68B67" }}>
        {getYear(hospitalData?.hspdetails?.hspregdate)}
      </span>

      <span style={{ color: "#407BFF" }}>| Status:</span>
      <span
        style={{
          color:
            hospitalData?.approvalStatus === "APPROVED"
              ? "#28A745" // green-like approved
              : "#E68B67", // pending or N/A
        }}
      >
        {hospitalData?.approvalStatus || "PENDING"}
      </span>
    </div>

    {/* NABH */}
    {hospitalData?.hspdetails?.nabhnablapproved === "Yes" && (
      <p className="mt-2 text-sm flex items-center gap-1" style={{ color: "#407BFF" }}>
        <Award className="w-4 h-4" style={{ color: "#407BFF" }} />
        NABH Accredited –{" "}
        <span style={{ color: "#E68B67" }}>
          {hospitalData?.hspdetails?.nabhnabllevel}
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
          icon: "/icons/bed.png",
          title: "Total Bed",
          value: bedCount || "N/A",
          rows: [
            { color: "bg-green-500", text: "08 Available Bed" },
            { color: "bg-orange-500", text: "03 Booked Bed" },
            { color: "bg-red-500", text: "05 Admitted Bed" },
          ]
        },
        {
          icon: "/icons/doctor.png",
          title: "Doctors",
          value: doctorCount || "N/A",
          rows: [
            { color: "bg-blue-500", text: "12 Available Doctor" },
            { color: "bg-green-500", text: "10 Online Doctor" },
            { color: "bg-red-500", text: "02 Offline Doctor" },
          ]
        },
        {
          icon: "/icons/ambulance.png",
          title: "Ambulance",
          value: ambulanceCount || "N/A",
          rows: [
            { color: "bg-green-500", text: "08 Online Ambulance" },
            { color: "bg-gray-500", text: "04 Offline Ambulance" },
          ]
        },
        {
          icon: "/icons/speciality.png",
          title: "Specialities",
          value: specialtyCount || "N/A",
          rows: [
            { color: "bg-green-500", text: "30 Available" },
            { color: "bg-red-500", text: "10 Unavailable" },
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
            <Image src={item.icon} width={60} height={60} alt="icon" />

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


              {/* FACILITIES TAB */}
{activeTab === 'facilities' && (
  <Card className="border border-gray-200 shadow-sm rounded-xl">
    <CardContent className="p-5">

      {/* Title */}
      <h3 className="text-xl font-bold text-gray-900 mb-4">Facilities</h3>

      {/* Agoda Style Facility Grid */}
{/* Agoda Style Facility Grid (Dynamic Room Facilities from API) */}
<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
  {roomFacilities.map((facility, idx) => (
    <div key={idx} className="flex items-center gap-2">
      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
      <span className="text-sm text-gray-800">{facility}</span>
    </div>
  ))}
</div>


      {/* ---- ABOUT HOSPITAL (Agoda Style) ---- */}
<div className="mt-8 p-5 border rounded-xl bg-white">
  <h3 className="text-xl font-bold text-gray-900 mb-2">About hospital</h3>
  <p className="text-gray-700 text-sm leading-relaxed">
    This hospital offers modern medical facilities, experienced doctors, 24/7
    emergency care, pathology and diagnostic services, and patient-friendly
    infrastructure designed for safety and comfort.
  </p>
  <button className="text-blue-600 font-semibold text-sm mt-2 hover:underline">
    Read more
  </button>
</div>


{/* ---- HIGHLIGHT BANNER ---- */}
<div className="mt-6 p-4 border rounded-xl bg-orange-50 flex gap-4 items-center">
  <div className="w-12 h-12 bg-orange-400 rounded-full flex items-center justify-center">
    <Clock className="text-white w-6 h-6" />
  </div>

  <div>
    <p className="text-orange-800 font-semibold text-sm">
      Many patients visit this hospital daily
    </p>
    <p className="text-orange-700 text-xs">
      Popular healthcare facility — trusted by thousands.
    </p>
  </div>
</div>


{/* ---- GOOD TO KNOW ---- */}
<div className="mt-8">
  <h3 className="text-lg font-bold text-gray-900 mb-4">Good to know</h3>

  <div className="grid grid-cols-2 gap-4 text-sm border rounded-xl p-4 bg-white">

    <div className="flex justify-between border-b pb-2">
      <span className="text-gray-600">Years of experience</span>
      <span className="font-semibold text-gray-900">15+ years</span>
    </div>

    <div className="flex justify-between border-b pb-2">
      <span className="text-gray-600">Total doctors</span>
      <span className="font-semibold text-gray-900">{doctorCount || "—"}</span>
    </div>

    <div className="flex justify-between border-b pb-2">
      <span className="text-gray-600">ICU beds</span>
      <span className="font-semibold text-gray-900">
        {hospitalData?.hspInfo?.totalnoofbed || "—"}
      </span>
    </div>

    <div className="flex justify-between border-b pb-2">
      <span className="text-gray-600">Ambulances</span>
      <span className="font-semibold text-gray-900">
        {hospitalData?.hspInfo?.totalambulance || "—"}
      </span>
    </div>

  </div>
</div>

{/* ---- IMPORTANT INFORMATION (Hospital Relevant) ---- */}
<div className="mt-8">
  <h3 className="text-lg font-bold text-gray-900 mb-4">Important Information</h3>

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm border rounded-xl p-4 bg-white">

    {/* Visiting Hours */}
    <div className="flex justify-between border-b pb-2">
      <span className="text-gray-600">Visiting hours</span>
      <span className="font-semibold text-gray-900">10:00 AM – 6:00 PM</span>
    </div>

    {/* OPD Timings */}
    <div className="flex justify-between border-b pb-2">
      <span className="text-gray-600">OPD timings</span>
      <span className="font-semibold text-gray-900">9:00 AM – 8:00 PM</span>
    </div>

    {/* Emergency */}
    <div className="flex justify-between border-b pb-2">
      <span className="text-gray-600">Emergency services</span>
      <span className="font-semibold text-gray-900">24/7 Available</span>
    </div>

    {/* Payment Modes */}
    <div className="flex justify-between border-b pb-2">
      <span className="text-gray-600">Payment methods</span>
      <span className="font-semibold text-gray-900">Cash, Card, UPI</span>
    </div>

    {/* Insurance */}
    <div className="flex justify-between border-b pb-2">
      <span className="text-gray-600">Insurance accepted</span>
      <span className="font-semibold text-gray-900">Yes (Cashless)</span>
    </div>

    {/* Admission Requirement */}
    <div className="flex justify-between border-b pb-2">
      <span className="text-gray-600">ID proof required</span>
      <span className="font-semibold text-gray-900">Aadhaar / PAN</span>
    </div>

  </div>
</div>


    </CardContent>
  </Card>
)}


              {/* SERVICES TAB */}
              {activeTab === 'services' && (
                <Card className="border border-gray-200 shadow-md rounded-xl">
                  <CardContent className="p-4 md:p-6">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Available Services</h3>
                    <div className="space-y-3">
                      {[
                        { label: "Online Consultation", value: hospitalData?.hspInfo?.onlineconsultation, icon: <Video className="w-5 h-5" />, desc: "Consult with doctors remotely" },
                        { label: "Home Healthcare", value: hospitalData?.hspInfo?.homehealthcare, icon: <User className="w-5 h-5" />, desc: "Medical care at your home" },
                        { label: "24/7 Pharmacy", value: hospitalData?.hspInfo?.pharmacy, icon: <TestTube className="w-5 h-5" />, desc: "Round-the-clock pharmacy services" },
                        { label: "Pathology Lab", value: hospitalData?.hspInfo?.pathology, icon: <TestTube className="w-5 h-5" />, desc: "Comprehensive lab testing" },
                        { label: "Radiology", value: hospitalData?.hspInfo?.diagnosticservices, icon: <Shield className="w-5 h-5" />, desc: "X-Ray, CT, MRI services" },
                        { label: "Blood Bank", value: "Yes", icon: <Shield className="w-5 h-5" />, desc: "24/7 blood availability" },
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

              {/* DOCTORS TAB */}
              {activeTab === 'doctors' && (
                <>
                  {hospitalData?.HospitalSpeciality && hospitalData.HospitalSpeciality.length > 0 ? (
                    <Card className="border border-gray-200 shadow-md rounded-xl">
                      <CardContent className="p-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Medical Specialities & Doctors</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          {hospitalData.HospitalSpeciality.map((spec, index) => (
                            <div key={spec.id} className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200 hover:shadow-md transition-shadow">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <Users className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="text-gray-900 font-semibold">
                                    {spec.speciality?.title || spec.speciality?.name || `Speciality ${index + 1}`}
                                  </h4>
                                  <p className="text-gray-600 text-sm">Expert medical care</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="flex items-center gap-3">
                            <Award className="w-6 h-6 text-blue-600" />
                            <div>
                              <p className="text-blue-900 font-semibold">
                                {hospitalData.HospitalSpeciality.length} Specialities Available
                              </p>
                              <p className="text-blue-700 text-sm">
                                {hospitalData?.hspInfo?.totaldoctor || "N/A"} Experienced Doctors
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="border border-gray-200 shadow-md rounded-xl">
                      <CardContent className="p-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Doctors</h3>
                        <div className="text-center py-8">
                          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600">
                            Total Doctors: {hospitalData?.hspInfo?.totaldoctor || "N/A"}
                          </p>
                          <p className="text-gray-500 text-sm mt-2">Doctor details will be available soon</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
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
                                  {review.comment || "Great hospital with excellent facilities and staff."}
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
                        <p className="text-gray-400 text-sm mt-2">Be the first to review this hospital</p>
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
                          <p className="text-gray-900 font-medium">{hospitalData?.hspcontact?.receptioncontact1 || hospitalData?.mobile || "Not available"}</p>
                          {hospitalData?.hspcontact?.receptioncontact2 && (
                            <p className="text-gray-700 text-sm mt-1">Reception 2: {hospitalData.hspcontact.receptioncontact2}</p>
                          )}
                          {hospitalData?.hspcontact?.alternateno && (
                            <p className="text-gray-700 text-sm mt-1">Alternate: {hospitalData.hspcontact.alternateno}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                        <Mail className="w-6 h-6 text-green-600 mt-1" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-green-900 mb-1">Email Addresses</h4>
                          <p className="text-gray-900 font-medium text-sm break-words">{hospitalData?.hspcontact?.receptionemail || "Not available"}</p>
                          {hospitalData?.email && hospitalData.email !== hospitalData?.hspcontact?.receptionemail && (
                            <p className="text-gray-700 text-sm mt-1 break-words">Official: {hospitalData.email}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <MapPin className="w-6 h-6 text-purple-600 mt-1" />
                        <div>
                          <h4 className="font-semibold text-purple-900 mb-1">Hospital Address</h4>
                          <p className="text-gray-900 font-medium leading-relaxed">
                            {hospitalData?.hspcontact?.address || "Address not available"}
                          </p>
                          <p className="text-gray-700 mt-2">
                            {hospitalData?.hspcontact?.city}, {hospitalData?.hspcontact?.taluka}, {hospitalData?.hspcontact?.dist}
                          </p>
                          <p className="text-gray-700">
                            {hospitalData?.hspcontact?.state} - {hospitalData?.hspcontact?.pincode}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                        <Clock className="w-6 h-6 text-orange-600 mt-1" />
                        <div>
                          <h4 className="font-semibold text-orange-900 mb-1">Working Hours</h4>
                          <p className="text-gray-900 font-medium">24/7 Emergency Services</p>
                          <p className="text-gray-700 text-sm mt-1">OPD: Mon-Sat, 9:00 AM - 6:00 PM</p>
                        </div>
                      </div>
                      {hospitalData?.hspcontact?.escalationmatrixsheet && (
                        <div className="flex items-start gap-4 p-4 bg-red-50 rounded-lg border border-red-200">
                          <FileText className="w-6 h-6 text-red-600 mt-1" />
                          <div className="flex-1">
                            <h4 className="font-semibold text-red-900 mb-1">Escalation Matrix</h4>
                            <a
                              href={hospitalData.hspcontact.escalationmatrixsheet}
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

              {/* HOSPITAL INFO TAB (NEW) */}
              {activeTab === 'info' && (
                <div className="space-y-4">
                  {/* Hospital Information Card */}
                  <Card className="border border-gray-200 shadow-md rounded-xl">
                    <CardContent className="p-4">
                      <h3 className="text-base font-bold text-gray-900 mb-3">Hospital Information</h3>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-gray-50 p-2 rounded">
                          <span className="text-gray-600">Registration No:</span>
                          <p className="font-semibold text-gray-900 text-xs">{hospitalData?.hspdetails?.hspregno || "N/A"}</p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <span className="text-gray-600">Established:</span>
                          <p className="font-semibold text-gray-900 text-xs">{getYear(hospitalData?.hspdetails?.hspregdate)}</p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <span className="text-gray-600">Experience:</span>
                          <p className="font-semibold text-gray-900 text-xs">{hospitalData?.hspInfo?.experience || "N/A"} years</p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <span className="text-gray-600">Status:</span>
                          <p className={`font-semibold text-xs ${hospitalData?.approvalStatus === 'APPROVED' ? 'text-green-600' : 'text-yellow-600'}`}>
                            {hospitalData?.approvalStatus || "PENDING"}
                          </p>
                        </div>
                      </div>
                      {hospitalData?.hspdetails?.nabhnablapproved === "Yes" && (
                        <div className="mt-3 p-2 bg-green-50 rounded-lg border border-green-200">
                          <div className="flex items-center gap-2">
                            <Award className="w-4 h-4 text-green-600" />
                            <span className="font-semibold text-green-900 text-sm">NABH Accredited</span>
                          </div>
                          <p className="text-green-700 text-xs mt-1">{hospitalData.hspdetails.nabhnabllevel}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Management Team Card */}
                  {(hospitalData?.hspcontact?.managername || hospitalData?.hspcontact?.adminname) && (
                    <Card className="border border-gray-200 shadow-md rounded-xl">
                      <CardContent className="p-4">
                        <h3 className="text-base font-bold text-gray-900 mb-3">Management Team</h3>
                        <div className="space-y-2">
                          {hospitalData?.hspcontact?.managername && (
                            <div className="p-2 bg-blue-50 rounded-lg">
                              <div className="flex items-center gap-2 mb-1">
                                <User className="w-4 h-4 text-blue-600" />
                                <span className="font-semibold text-blue-900 text-sm">Manager</span>
                              </div>
                              <p className="font-medium text-gray-900 text-sm">{hospitalData.hspcontact.managername}</p>
                              <p className="text-xs text-blue-700">{hospitalData.hspcontact.managercontact || "N/A"}</p>
                            </div>
                          )}
                          {hospitalData?.hspcontact?.adminname && (
                            <div className="p-2 bg-green-50 rounded-lg">
                              <div className="flex items-center gap-2 mb-1">
                                <User className="w-4 h-4 text-green-600" />
                                <span className="font-semibold text-green-900 text-sm">Administrator</span>
                              </div>
                              <p className="font-medium text-gray-900 text-sm">{hospitalData.hspcontact.adminname}</p>
                              <p className="text-xs text-green-700">{hospitalData.hspcontact.admincontact || "N/A"}</p>
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
          {hospitalData?.hspcontact?.receptioncontact1 || "N/A"}
        </p>
      </div>

      {/* Email */}
      <div>
        <div className="flex items-center gap-2 text-[#243460]">
          <Mail className="w-4 h-4 text-[#666666]" />
          <span className="text-[14px] text-[#666666]">Email</span>
        </div>
        <p className="text-[15px] font-semibold text-[#243460] mt-1 truncate">
          {hospitalData?.hspcontact?.receptionemail || "N/A"}
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
          onClick={() => setShowReviewsModal(true)}
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
          hospitalData?.hspcontact?.address
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
        {hospitalData?.hspcontact?.city}, {hospitalData?.hspcontact?.state} - {hospitalData?.hspcontact?.pincode}
      </p>

      <p className="text-[15px] text-[#243460] font-medium mt-1 leading-5">
        {hospitalData?.hspcontact?.address}
      </p>
    </div>

  </div>

  {/* ---------------------- NEARBY TRANSPORT ---------------------- */}
  {hospitalData?.facilitiesJson?.transportation?.length > 0 && (
    <div className="mt-5">
      <h3 className="text-[16px] font-semibold text-[#C47C52] mb-2">
        Nearby Transportation
      </h3>

      <div className="space-y-3">
        {hospitalData.facilitiesJson.transportation.map((item, i) => (
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
  {hospitalData?.facilitiesJson?.landmarks?.length > 0 && (
    <div className="mt-6">
      <h3 className="text-[16px] font-semibold text-[#C47C52] mb-2">
        Nearby Landmarks
      </h3>

      <div className="space-y-3">
        {hospitalData.facilitiesJson.landmarks.map((place, i) => (
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
            { icon: <Users className="w-5 h-5 text-[#243460]" />, label: "Doctors", value: doctorCount ?? "—", clickable: true, action: "doctors" },
            { icon: <Heart className="w-5 h-5 text-[#243460]" />, label: "Speciality", value: specialtyCount ?? "—", clickable: true, action: "specialties" },
            { icon: <FaAmbulance className="w-5 h-5 text-[#243460]" />, label: "Ambulance", value: "24/7", clickable: true, action: "ambulances" },
            { icon: <Bed className="w-5 h-5 text-[#243460]" />, label: "Hospital Beds", value: bedCount ?? "—", clickable: true, action: "beds" },
            { icon: <Building2 className="w-5 h-5 text-[#243460]" />, label: "Govt Schemes", value: "Available", clickable: true, action: "govtSchemes" },
            { icon: <TestTube className="w-5 h-5 text-[#243460]" />, label: "Surgery Packages", value: "Available", clickable: true, action: "surgery" },
            { icon: <FileText className="w-5 h-5 text-[#243460]" />, label: "Treatment Packages", value: "Available", clickable: true, action: "treatment" },
            { icon: <Shield className="w-5 h-5 text-[#243460]" />, label: "Hospital Facilities", value: "Available", clickable: true, action: "modernFacilities" },
            { icon: <Building2 className="w-5 h-5 text-[#243460]" />, label: "Hospital Branches", value: hospitalData?.hspbranches?.length || "1+", clickable: true, action: "branches" },
            { icon: <TestTube className="w-5 h-5 text-[#243460]" />, label: "Pharmacy", value: "24/7", clickable: true, action: "pharmacy" },
            { icon: <TestTube className="w-5 h-5 text-[#243460]" />, label: "NABL Pathology", value: "Certified", clickable: true, action: "nablPathology" },
            { icon: <Heart className="w-5 h-5 text-[#243460]" />, label: "Wellness Packages", value: "Available", clickable: true, action: "wellness" },
            { icon: <Video className="w-5 h-5 text-[#243460]" />, label: "Online Consultation", value: "Available", clickable: true, action: "onlineConsultation" },
            { icon: <Shield className="w-5 h-5 text-[#243460]" />, label: "Diagnostic Service", value: "Available", clickable: true, action: "diagnostic" },

            {
              icon: <CreditCard className="w-5 h-5 text-[#243460]" />,
              label: "Cashless Services",
              value: (() => {
                const v = hospitalData?.hspInfo?.cashlessservices;
                if (!v || v.trim() === "" || v.toLowerCase() === "no") return "Not Available";
                return "Available";
              })(),
              clickable: true,
              action: "cashless",
            },

            { icon: <User className="w-5 h-5 text-[#243460]" />, label: "Home Healthcare", value: "Available", clickable: true, action: "homeHealthcare" },

            ...(hospitalData?.hspdetails?.nabhnablapproved === "Yes"
              ? [{
                  icon: <Award className="w-5 h-5 text-[#243460]" />,
                  label: "NABH Accredited",
                  value: hospitalData.hspdetails.nabhnabllevel,
                  clickable: true,
                  action: "accreditation",
                }]
              : []),

            { icon: <Building2 className="w-5 h-5 text-[#243460]" />, label: "Inhouse Canteen", value: "Available", clickable: true, action: "canteen" },

            // Room Facility Items
            { icon: <User className="w-5 h-5 text-[#243460]" />, label: "MSW", value: roomFacilities.includes("MSW") ? "Available" : "Not Available", clickable: false },
            { icon: <Building2 className="w-5 h-5 text-[#243460]" />, label: "Parking", value: roomFacilities.includes("Parking") ? "Available" : "Not Available", clickable: false },
            { icon: <Users className="w-5 h-5 text-[#243460]" />, label: "Relative Stay", value: roomFacilities.includes("Relative Stay") ? "Available" : "Not Available", clickable: false },
            { icon: <Building2 className="w-5 h-5 text-[#243460]" />, label: "Lift", value: roomFacilities.includes("Lift") ? "Available" : "Not Available", clickable: false },
            { icon: <Building2 className="w-5 h-5 text-[#243460]" />, label: "Floor", value: roomFacilities.includes("Floor") ? "Available" : "Not Available", clickable: false },
            { icon: <Shield className="w-5 h-5 text-[#243460]" />, label: "Emergency Staircase", value: roomFacilities.includes("Emergency Staircase") ? "Available" : "Not Available", clickable: false },

            { icon: <Star className="w-5 h-5 text-[#243460]" />, label: "HSP Reviews", value: `${avgRating} ★`, clickable: true, action: "reviews" },

          ].map((item, idx) => (
            <div
              key={idx}
              onClick={
                item.clickable
                  ? () => {
                      if (item.action === "doctors") setShowDoctorsList(true);
                      else if (item.action === "specialties") setShowSpecialtiesList(true);
                      else if (item.action === "branches") setShowBranchesList(true);
                      else if (item.action === "govtSchemes") setGovtSchemesDialogOpen(true);
                      else if (item.action === "ambulances") setShowAmbulances(true);
                      else if (item.action === "wellness") setShowWellnessList(true);
                      else if (item.action === "beds") setShowBeds(true);
                      else if (item.action === "homeHealthcare") setShowHomeHealthcare(true);
                      else if (item.action === "surgery") setShowSurgery(true);
                      else if (item.action === "treatment") setShowTreatment(true);
                      else if (item.action === "diagnostic") setShowDiagnostics(true);
                      else if (item.action === "reviews") setShowReviewsModal(true);
                      else if (item.action === "modernFacilities") setShowModernFacilities(true);
                      else if (item.action === "pharmacy") setShowPharmacy(true);
                      else if (item.action === "nablPathology") setShowNablPathology(true);
                      else if (item.action === "accreditation") setShowAccreditation(true);
                      else if (item.action === "canteen") setShowCanteen(true);
                      else if (item.action === "onlineConsultation") setShowOnlineConsultation(true);
                      else if (item.action === "cashless") setShowCashless(true);
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



{bedsData && (
  <div className="mx-auto mt-10 mb-8" style={{ maxWidth: "1270px", width: "100%" }}>
    
    {/* ========================== CATEGORY BUTTONS ========================== */}
    <div className="bg-white rounded-[12px] border border-[#0000001A] p-6 shadow-sm">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
        {[
          "ICU Bed Without Ventilator",
          "ICU Ventilator Bed",
          "NICU Bed",
          "PICU Bed",
          "HDU Bed",
          "Male Ward",
          "Female Ward",
          "General Ward",
          "Non AC Semi Private Bed",
          "AC Semi Private Bed",
          "Non AC Private Bed",
          "AC Private Bed",
          "Deluxe Bed",
          "Suite Bed",
          "Govt Scheme Bed",
          "Oxygen Bed",
          "Isolation Bed",
        ].map((displayName) => {
          const backendName = Object.keys(bedCategoryMapping).find(
            (key) => bedCategoryMapping[key] === displayName
          );

          const bedsInCategory = bedsData?.beds?.filter(
            (bed) => bed?.category?.name === backendName
          ) || [];

          const hasBeds = bedsInCategory.length > 0;

          return (
            <button
              key={displayName}
              onClick={() =>
                hasBeds &&
                setSelectedCategory({
                  displayName,
                  backendName,
                  beds: bedsInCategory,
                })
              }
              disabled={!hasBeds}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap
                ${hasBeds
                  ? "bg-[#EDF3FF] text-[#091B47] hover:bg-[#D9E7FF]"
                  : "bg-transparent text-[#A0A0A0] cursor-not-allowed border border-[#A0A0A0] border-dashed"
                }`}
            >
              {displayName}
            </button>
          );
        })}
      </div>
    </div>

    {/* ========================== SELECTED CATEGORY DETAIL PANEL ========================== */}
    {selectedCategory && (
      <div className="mt-8 flex gap-8">

        {/* LEFT IMAGE GRID */}
        <div className="w-[55%] relative">

          <div className="grid grid-cols-3 gap-4">

            {/* BIG LEFT IMAGE */}
            <img
              src={selectedCategory?.beds[0]?.category?.image || "/placeholder.jpg"}
              className="col-span-2 row-span-2 h-[380px] w-full object-cover rounded-[14px]"
            />

            {/* TOP RIGHT SMALL IMAGE */}
            <img
              src={selectedCategory?.beds[0]?.category?.image1 || "/placeholder.jpg"}
              className="col-span-1 h-[180px] w-full object-cover rounded-[14px]"
            />

            {/* BOTTOM RIGHT SMALL IMAGE */}
            <img
              src={selectedCategory?.beds[0]?.category?.image2 || "/placeholder.jpg"}
              className="col-span-1 h-[180px] w-full object-cover rounded-[14px]"
            />

          </div>

          {/* All Photos Button */}
          <button className="absolute bottom-6 left-6 bg-black/50 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-xs font-medium backdrop-blur-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            All Photos
          </button>

        </div>

        {/* RIGHT DETAILS */}
        <div className="w-[45%] flex flex-col gap-4 pt-2">

          {/* Title */}
          <h2 className="text-[24px] font-bold text-[#091B47] leading-tight">
            {selectedCategory.displayName}
          </h2>

          {/* Description */}
          <p className="text-[#4A4A4A] text-[14px] leading-[1.45] max-w-[90%]">
            It Is Equipped With Advanced Monitoring Systems And Staffed By 
            Specially Trained Healthcare Professionals Available 24/7
          </p>

          {/* Rating */}
          <div className="mt-1">
            <div className="flex items-center gap-1 text-[#091B47] font-semibold text-[18px] leading-none">
              ⭐ 4.5 Excellent
            </div>

            <div className="flex items-center gap-2 mt-1 text-[#6B6B6B] text-[13px] leading-none">
              <span className="text-black text-[16px]">☆</span>
              789 Reviews & Comments
            </div>

            <button className="mt-3 bg-[#6779FF] text-white px-4 py-1.5 rounded-full text-[12px] font-medium hover:bg-[#5b6cf7] transition">
              Read All Reviews
            </button>
          </div>

          {/* Availability */}
          <div className="mt-4 flex items-start justify-between w-full">

            <div className="flex flex-col gap-2 text-[14px] leading-none">

              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                <span className="font-semibold text-[#091B47]">
                  {String(selectedCategory.beds.filter(b => b.status === "AVAILABLE").length).padStart(2,"0")} Available Bed
                </span>
              </div>

              <div className="flex items-center gap-2 opacity-60">
                <span className="w-3 h-3 rounded-full bg-[#C5C5C5]"></span>
                {String(selectedCategory.beds.filter(b => b.status === "BOOKED").length).padStart(2,"0")} Booked Bed
              </div>

              <div className="flex items-center gap-2 opacity-60">
                <span className="w-3 h-3 rounded-full bg-[#F28C8C]"></span>
                {String(selectedCategory.beds.filter(b => b.status === "ADMITTED").length).padStart(2,"0")} Admitted Bed
              </div>

            </div>

            {/* Total Beds Box */}
            <div className="flex flex-col items-center bg-[#EEF2FF] px-4 py-2.5 rounded-2xl text-center shadow-sm">
              <div className="text-[#6371C4] text-[12px] font-medium">Total Bed</div>
              <div className="text-[#091B47] text-[24px] font-bold leading-none mt-1">
                {selectedCategory.beds.length}
              </div>
            </div>

          </div>

          {/* Price (SMALLER) */}
<div className="bg-[#6A7CFF] text-white rounded-[8px] text-[16px] font-semibold shadow flex items-center justify-center" style={{ width: 350, height: 48.83 }}>₹ {selectedCategory?.beds[0]?.category?.finalPrice || "2700"} / Daily</div>



          {/* Book Now (SMALLER) */}
<button className="bg-[#61A85B] text-white rounded-[8px] text-[16px] font-semibold shadow-md hover:bg-[#589c53] transition" style={{ width: 350, height: 48.83 }}>Book Now</button>



        </div>
      </div>
    )}
  </div>
)}




{/* ================= ROOM FACILITIES Below Bed categories================= */}
<div className="w-full mx-auto mt-6">
  <div className="bg-white border border-[#00000033] rounded-[12px] p-6">

    {/* Title */}
    <h2 className="text-[20px] font-semibold text-[#243460] mb-4">
      Room Facilities
    </h2>

    {/* Facility Grid */}
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-y-3 gap-x-4">

      {roomFacilities.map((facility, idx) => (
        <div key={idx} className="flex items-center gap-2">

          {/* EXACT ICON LIKE IMAGE */}
          <CheckSquare className="w-4 h-4 text-[#6E6E6E]" />

          <span className="text-[14px] text-[#444444]">{facility}</span>
        </div>
      ))}

    </div>
  </div>
</div>

{/* ================= TOP BED BOOKING HOSPITALS ================= */}
{allHospitals && (
  <div className="w-full mx-auto mt-10" style={{ maxWidth: "1270px" }}>
    <div className="bg-white border border-[#00000033] rounded-[12px] p-6 shadow-xl">

      <h2 className="text-[26px] font-bold text-[#243460] mb-6">
        Top Bed Booking Hospitals
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {allHospitals
          .sort((a, b) => b._count.BedBooking - a._count.BedBooking)
          .slice(0, 3) // ⭐ show only 3 hospitals
          .map((hosp) => (
            <div
              key={hosp.id}
              onClick={() => window.location.href = `/hospital/${hosp.id}`}
              className="cursor-pointer h-full min-h-[320px] flex flex-col overflow-hidden border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 bg-white rounded-2xl hover:translate-y-[-4px] group"
            >
              {/* TOP GRADIENT HEADER */}
              <div className="bg-gradient-to-br from-[#1E3B90]/10 to-[#3D85EF]/10 p-6 rounded-t-2xl">
                <div className="flex items-center gap-4">

                  {/* LOGO */}
                  {hosp.hspdetails?.hsplogo ? (
                    <div className="relative">
                      <img
                        src={hosp.hspdetails.hsplogo}
                        className="rounded-full h-20 w-20 object-cover border-4 border-white shadow-lg"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 border-2 border-white">
                        <div className="w-3 h-3 rounded-full bg-white"></div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-br from-[#1E3B90]/20 to-[#3D85EF]/30 border-4 border-white rounded-full flex items-center justify-center text-white shadow-lg">
                      <Briefcase className="w-8 h-8" />
                    </div>
                  )}

                  {/* NAME + RATINGS */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-gray-800 mb-1 truncate">
                      {hosp?.hspInfo?.regname}
                    </h3>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-full shadow-sm">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                          />
                        ))}
                        <span className="text-xs font-medium text-gray-700 ml-1">4.0</span>
                      </div>
                      <span className="text-xs text-gray-600">
                        ({hosp?._count?.reviews || 0} Reviews)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* MID SECTION */}
              <div className="p-6 space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Briefcase className="h-4 w-4 text-[#1E3B90]" />
                    <span>{hosp?._count?.BedBooking || 0} Beds Booked</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-700">
                    <Star className="h-4 w-4 text-[#1E3B90]" />
                    <span>{hosp?._count?.reviews || 0} Reviews</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin className="h-4 w-4 text-[#1E3B90]" />
                  <span className="text-sm line-clamp-2">
                    {hosp?.hspcontact?.city}, {hosp?.hspcontact?.state}
                  </span>
                </div>
              </div>

              {/* FOOTER BUTTONS */}
              <div className="px-6 pb-6 pt-2">
                <div className="flex gap-3">
                  <button className="flex-1 bg-gradient-to-r from-[#1e40af] to-[#3b82f6] text-white font-medium py-2.5 px-3 rounded-xl shadow-md transition-all transform hover:scale-105 flex items-center justify-center gap-2 text-sm">
                    <Star className="h-3 w-3" />
                    Book Now
                  </button>
                  <button className="flex-1 bg-gradient-to-r from-[#059669] to-[#10b981] text-white font-medium py-2.5 px-3 rounded-xl shadow-sm transition-all transform hover:scale-105 flex items-center justify-center gap-2 text-sm">
                    <Briefcase className="h-3 w-3" />
                    View More
                  </button>
                </div>
              </div>
            </div>
          ))}

      </div>

    </div>
  </div>
)}

{/* ================== DOCTORS IMAGE SLIDER ================== */}
<div className="w-full mx-auto mt-10" style={{ maxWidth: "1270px" }}>
  <h2 className="text-[26px] font-bold text-[#243460] mb-4">
    Meet Our Expert Doctors
  </h2>

  <div className="relative">

    {/* Scrollable Slider */}
    <div
      id="doctorSlider"
      className="flex gap-5 overflow-x-scroll no-scrollbar scroll-smooth py-2"
    >
      {[
        "/images/doc1.jpg",
        "/images/doc2.jpg",
        "/images/doc3.jpg",
        "/images/doc4.jpg",
        "/images/doc1.jpg",
        "/images/doc2.jpg",
      ].map((img, index) => (
        <div key={index} className="min-w-[260px]">
          <img
            src={img}
            className="rounded-xl w-[260px] h-[200px] object-cover shadow-md"
          />
        </div>
      ))}
    </div>

    {/* Right Arrow */}
    <button
      onClick={() => {
        const slider = document.getElementById("doctorSlider");
        slider.scrollBy({ left: 300, behavior: "smooth" });
      }}
      className="absolute right-3 top-1/2 -translate-y-1/2 bg-white rounded-full shadow-lg p-3 hover:scale-110 transition"
    >
      <ChevronRight className="text-gray-700 w-6 h-6" />
    </button>

    {/* Left Arrow */}
    <button
      onClick={() => {
        const slider = document.getElementById("doctorSlider");
        slider.scrollBy({ left: -300, behavior: "smooth" });
      }}
      className="absolute left-3 top-1/2 -translate-y-1/2 bg-white rounded-full shadow-lg p-3 hover:scale-110 transition"
    >
      <ChevronLeft className="text-gray-700 w-6 h-6" />
    </button>
  </div>

  {/* Bottom progress bar */}
  <div className="mt-5 w-full bg-gray-200 h-[6px] rounded-full">
    <div className="h-[6px] bg-[#5868F2] rounded-full w-[40%]"></div>
  </div>
</div>





{/* ================= END ================= */}


        </div>
      </div>

      {/* Mobile & Tablet View - Show on small and medium screens */}
      <div className="block lg:hidden">
        {/* Clean Mobile Header */}
        <div className="px-4 py-5 sticky top-0 z-30 shadow-lg" style={{ background: '#3D85EF' }}>
          <div className="flex items-center gap-3 mb-3">
            {hospitalData?.hspdetails?.hsplogo && (
              <div className="w-14 h-14 rounded-lg overflow-hidden border-2 border-white/40 shadow-md bg-white flex-shrink-0">
                <Image
                  src={hospitalData.hspdetails.hsplogo}
                  width={56}
                  height={56}
                  alt="Hospital Logo"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-white line-clamp-2 mb-1">
                {hospitalData?.hspInfo?.regname || "Hospital Name"}
              </h1>
              <div className="flex items-center gap-1.5 text-white/90 text-xs">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">
                  {hospitalData?.hspcontact?.city}, {hospitalData?.hspcontact?.state}
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
            <div className="relative h-56 md:h-64 w-full rounded-xl overflow-hidden shadow-lg">
              <Image
                src={mainImage}
                fill
                priority
                quality={90}
                className="object-cover"
                alt="Hospital Main View"
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
                      alt={`Hospital Image ${index + 2}`}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => alert("Booking appointment feature coming soon!")}
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-md text-sm md:text-base flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4 md:w-5 md:h-5" />
              BOOK NOW
            </button>
            <button
              onClick={() => {
                const phone = hospitalData?.hspcontact?.receptioncontact1 || hospitalData?.mobile;
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
                { id: 'facilities', label: 'Facilities' },
                { id: 'services', label: 'Services' },
                { id: 'doctors', label: 'Doctors' },
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
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3">About {hospitalData?.hspInfo?.regname}</h3>
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">
                    {hospitalData?.hspInfo?.regname} is a leading healthcare institution with{' '}
                    {hospitalData?.hspInfo?.experience || "N/A"} years of experience in providing quality medical care.
                    Located in {hospitalData?.hspcontact?.city}, {hospitalData?.hspcontact?.state}, we are committed to
                    excellence in healthcare delivery with state-of-the-art facilities and{' '}
                    {hospitalData?.hspInfo?.totaldoctor || "N/A"} experienced medical professionals across{' '}
                    {hospitalData?.hspInfo?.totalspeciality || "N/A"} specialities.
                  </p>
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-blue-900 text-sm">Hospital Status</h4>
                        <p className="text-blue-700 text-xs break-words">
                          Reg: {hospitalData?.hspdetails?.hspregno} | 
                          Est: {getYear(hospitalData?.hspdetails?.hspregdate)} | 
                          <span className={`font-semibold ${hospitalData?.approvalStatus === 'APPROVED' ? 'text-green-600' : 'text-yellow-600'}`}>
                            {hospitalData?.approvalStatus || "PENDING"}
                          </span>
                        </p>
                        {hospitalData?.hspdetails?.nabhnablapproved === "Yes" && (
                          <p className="text-blue-700 text-xs mt-1 flex items-center gap-1">
                            <Award className="w-3 h-3" />
                            NABH Accredited - {hospitalData?.hspdetails?.nabhnabllevel}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { icon: <Bed className="w-4 h-4" />, label: "Total Beds", value: hospitalData?.hspInfo?.totalnoofbed || "N/A" },
                      { icon: <Users className="w-4 h-4" />, label: "Doctors", value: hospitalData?.hspInfo?.totaldoctor || "N/A" },
                      { icon: <Building2 className="w-4 h-4" />, label: "Specialities", value: specialtyCount !== null ? `${specialtyCount}` : "—" },
                      { icon: <FaAmbulance className="w-4 h-4" />, label: "Ambulances", value: hospitalData?.hspInfo?.totalambulance || "N/A" },
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

            {/* FACILITIES TAB */}
            {activeTab === 'facilities' && (
              <Card className="border border-gray-200 shadow-sm rounded-xl">
                <CardContent className="p-4">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Hospital Facilities</h3>
                  <div className="space-y-2">
                    {[
                      { label: "Diagnostic Services", value: hospitalData?.hspInfo?.diagnosticservices, icon: <Shield className="w-4 h-4" /> },
                      { label: "Cashless Services", value: hospitalData?.hspInfo?.cashlessservices, icon: <CreditCard className="w-4 h-4" /> },
                      { label: "Government Schemes", value: hospitalData?.hspInfo?.governmentschemes, icon: <FileText className="w-4 h-4" /> },
                      { label: "In-house Canteen", value: hospitalData?.hspInfo?.inhousecanteen, icon: <Building2 className="w-4 h-4" /> },
                      { label: "24/7 Emergency", value: "Yes", icon: <Shield className="w-4 h-4" /> },
                      { label: "ICU", value: hospitalData?.hspInfo?.totalnoofbed ? "Yes" : "No", icon: <Bed className="w-4 h-4" /> },
                      { label: "Ambulance Service", value: hospitalData?.hspInfo?.totalambulance ? "Yes" : "No", icon: <FaAmbulance className="w-4 h-4" /> },
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

            {/* SERVICES TAB */}
            {activeTab === 'services' && (
              <Card className="border border-gray-200 shadow-sm rounded-xl">
                <CardContent className="p-4">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Available Services</h3>
                  <div className="space-y-2">
                    {[
                      { label: "Online Consultation", value: hospitalData?.hspInfo?.onlineconsultation, icon: <Video className="w-4 h-4" />, desc: "Consult with doctors remotely" },
                      { label: "Home Healthcare", value: hospitalData?.hspInfo?.homehealthcare, icon: <User className="w-4 h-4" />, desc: "Medical care at your home" },
                      { label: "24/7 Pharmacy", value: hospitalData?.hspInfo?.pharmacy, icon: <TestTube className="w-4 h-4" />, desc: "Round-the-clock pharmacy" },
                      { label: "Pathology Lab", value: hospitalData?.hspInfo?.pathology, icon: <TestTube className="w-4 h-4" />, desc: "Comprehensive lab testing" },
                      { label: "Radiology", value: hospitalData?.hspInfo?.diagnosticservices, icon: <Shield className="w-4 h-4" />, desc: "X-Ray, CT, MRI services" },
                      { label: "Blood Bank", value: "Yes", icon: <Shield className="w-4 h-4" />, desc: "24/7 blood availability" },
                    ].map((service, index) => {
                      const isAvailable = service.value === "yes" || service.value === "Yes";
                      return (
                        <div
                          key={index}
                          className={`flex items-center gap-3 p-3 rounded-lg ${
                            isAvailable ? "bg-blue-50 border border-blue-200" : "bg-gray-50 border border-gray-200"
                          }`}
                        >
                          <div className={`p-2 rounded-lg flex-shrink-0 ${isAvailable ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"}`}>
                            {service.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-semibold text-gray-900 block">{service.label}</span>
                            <p className="text-xs text-gray-600">{service.desc}</p>
                          </div>
                          {isAvailable && <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* DOCTORS TAB */}
            {activeTab === 'doctors' && (
              <>
                {hospitalData?.HospitalSpeciality && hospitalData.HospitalSpeciality.length > 0 ? (
                  <Card className="border border-gray-200 shadow-sm rounded-xl">
                    <CardContent className="p-4">
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Medical Specialities & Doctors</h3>
                      <div className="grid grid-cols-1 gap-2 mb-4">
                        {hospitalData.HospitalSpeciality.map((spec, index) => (
                          <div key={spec.id} className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-200">
                            <div className="flex items-center gap-2">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Users className="w-5 h-5 text-blue-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-gray-900 font-semibold text-sm">
                                  {spec.speciality?.title || spec.speciality?.name || `Speciality ${index + 1}`}
                                </h4>
                                <p className="text-gray-600 text-xs">Expert medical care</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2">
                          <Award className="w-5 h-5 text-blue-600 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-blue-900 font-semibold text-sm">
                              {hospitalData.HospitalSpeciality.length} Specialities Available
                            </p>
                            <p className="text-blue-700 text-xs">
                              {hospitalData?.hspInfo?.totaldoctor || "N/A"} Experienced Doctors
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="border border-gray-200 shadow-sm rounded-xl">
                    <CardContent className="p-4">
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Doctors</h3>
                      <div className="text-center py-6">
                        <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600 text-sm">
                          Total Doctors: {hospitalData?.hspInfo?.totaldoctor || "N/A"}
                        </p>
                        <p className="text-gray-500 text-xs mt-1">Doctor details will be available soon</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
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
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm flex-shrink-0">
                                    {patientInitial}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-900 text-sm truncate">{patientName}</p>
                                    <p className="text-xs text-gray-600">
                                      {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : "Recently"}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex flex-shrink-0 ml-2">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-3 h-3 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-gray-700 text-sm">
                                {review.comment || "Great hospital with excellent facilities and staff."}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-6">
                      <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No reviews yet</p>
                      <p className="text-gray-400 text-xs mt-1">Be the first to review this hospital</p>
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
                        <p className="text-gray-900 font-medium text-sm">{hospitalData?.hspcontact?.receptioncontact1 || hospitalData?.mobile || "Not available"}</p>
                        {hospitalData?.hspcontact?.receptioncontact2 && (
                          <p className="text-gray-700 text-xs mt-1">Reception 2: {hospitalData.hspcontact.receptioncontact2}</p>
                        )}
                        {hospitalData?.hspcontact?.alternateno && (
                          <p className="text-gray-700 text-xs mt-1">Alternate: {hospitalData.hspcontact.alternateno}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <Mail className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-green-900 mb-1 text-sm">Email Addresses</h4>
                        <p className="text-gray-900 font-medium text-xs break-words">{hospitalData?.hspcontact?.receptionemail || "Not available"}</p>
                        {hospitalData?.email && hospitalData.email !== hospitalData?.hspcontact?.receptionemail && (
                          <p className="text-gray-700 text-xs mt-1 break-words">Official: {hospitalData.email}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <MapPin className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-purple-900 mb-1 text-sm">Hospital Address</h4>
                        <p className="text-gray-900 font-medium leading-relaxed text-sm">
                          {hospitalData?.hspcontact?.address || "Address not available"}
                        </p>
                        <p className="text-gray-700 mt-1 text-xs">
                          {hospitalData?.hspcontact?.city}, {hospitalData?.hspcontact?.taluka}, {hospitalData?.hspcontact?.dist}
                        </p>
                        <p className="text-gray-700 text-xs">
                          {hospitalData?.hspcontact?.state} - {hospitalData?.hspcontact?.pincode}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <Clock className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-orange-900 mb-1 text-sm">Working Hours</h4>
                        <p className="text-gray-900 font-medium text-sm">24/7 Emergency Services</p>
                        <p className="text-gray-700 text-xs mt-1">OPD: Mon-Sat, 9:00 AM - 6:00 PM</p>
                      </div>
                    </div>
                    {hospitalData?.hspcontact?.escalationmatrixsheet && (
                      <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                        <FileText className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-red-900 mb-1 text-sm">Escalation Matrix</h4>
                          <a
                            href={hospitalData.hspcontact.escalationmatrixsheet}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-red-600 hover:text-red-700 font-medium text-xs hover:underline break-words"
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

            {/* INFO TAB */}
            {activeTab === 'info' && (
              <div className="space-y-3">
                <Card className="border border-gray-200 shadow-sm rounded-xl">
                  <CardContent className="p-4">
                    <h3 className="text-base font-bold text-gray-900 mb-3">Hospital Information</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-gray-50 p-2 rounded">
                        <span className="text-gray-600 text-xs block mb-0.5">Registration No:</span>
                        <p className="font-semibold text-gray-900 text-xs break-words">{hospitalData?.hspdetails?.hspregno || "N/A"}</p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <span className="text-gray-600 text-xs block mb-0.5">Established:</span>
                        <p className="font-semibold text-gray-900 text-xs">{getYear(hospitalData?.hspdetails?.hspregdate)}</p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <span className="text-gray-600 text-xs block mb-0.5">Experience:</span>
                        <p className="font-semibold text-gray-900 text-xs">{hospitalData?.hspInfo?.experience || "N/A"} years</p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <span className="text-gray-600 text-xs block mb-0.5">Status:</span>
                        <p className={`font-semibold text-xs ${hospitalData?.approvalStatus === 'APPROVED' ? 'text-green-600' : 'text-yellow-600'}`}>
                          {hospitalData?.approvalStatus || "PENDING"}
                        </p>
                      </div>
                    </div>
                    {hospitalData?.hspdetails?.nabhnablapproved === "Yes" && (
                      <div className="mt-3 p-2 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <span className="font-semibold text-green-900 text-sm block">NABH Accredited</span>
                            <p className="text-green-700 text-xs">{hospitalData.hspdetails.nabhnabllevel}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {(hospitalData?.hspcontact?.managername || hospitalData?.hspcontact?.adminname) && (
                  <Card className="border border-gray-200 shadow-sm rounded-xl">
                    <CardContent className="p-4">
                      <h3 className="text-base font-bold text-gray-900 mb-3">Management Team</h3>
                      <div className="space-y-2">
                        {hospitalData?.hspcontact?.managername && (
                          <div className="p-2 bg-blue-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <User className="w-4 h-4 text-blue-600 flex-shrink-0" />
                              <span className="font-semibold text-blue-900 text-sm">Manager</span>
                            </div>
                            <p className="font-medium text-gray-900 text-sm">{hospitalData.hspcontact.managername}</p>
                            <p className="text-xs text-blue-700">{hospitalData.hspcontact.managercontact || "N/A"}</p>
                          </div>
                        )}
                        {hospitalData?.hspcontact?.adminname && (
                          <div className="p-2 bg-green-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <User className="w-4 h-4 text-green-600 flex-shrink-0" />
                              <span className="font-semibold text-green-900 text-sm">Administrator</span>
                            </div>
                            <p className="font-medium text-gray-900 text-sm">{hospitalData.hspcontact.adminname}</p>
                            <p className="text-xs text-green-700">{hospitalData.hspcontact.admincontact || "N/A"}</p>
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
               <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3">
                 <h2 className="text-lg font-bold text-white text-center">Our Services</h2>
                 <p className="text-blue-100 text-center text-xs mt-0.5">
                   Comprehensive healthcare solutions
                 </p>
               </div>
               <div className="p-3">
                 <div className="grid grid-cols-3 gap-2">
                   {[
                     { icon: <Users className="w-4 h-4 text-blue-600" />, label: "Doctors", value: doctorCount !== null ? doctorCount : "—", clickable: true, action: "doctors" },
                     { icon: <Heart className="w-4 h-4 text-red-600" />, label: "Speciality", value: specialtyCount !== null ? `${specialtyCount}` : "—", clickable: true, action: "specialties" },
                     { icon: <FaAmbulance className="w-4 h-4 text-orange-600" />, label: "Ambulance", value: "24/7", clickable: true, action: "ambulances" },
                     { icon: <Bed className="w-4 h-4 text-green-600" />, label: "Hospital Beds", value: hospitalData?.hspInfo?.totalnoofbed || "100+" },
                     { icon: <Building2 className="w-4 h-4 text-purple-600" />, label: "Govt Schemes", value: "Available" },
                     { icon: <TestTube className="w-4 h-4 text-red-600" />, label: "Surgery", value: "Available" },
                     { icon: <FileText className="w-4 h-4 text-blue-600" />, label: "Treatments", value: "Available" },
                     { icon: <Shield className="w-4 h-4 text-indigo-600" />, label: "Facilities", value: "Modern" },
                     { icon: <Building2 className="w-4 h-4 text-cyan-600" />, label: "Branches", value: hospitalData?.hspbranches?.length || "1+", clickable: true, action: "branches" },
                     { icon: <TestTube className="w-4 h-4 text-pink-600" />, label: "Pharmacy", value: "24/7" },
                     { icon: <TestTube className="w-4 h-4 text-teal-600" />, label: "Pathology", value: "NABL" },
                     { icon: <Heart className="w-4 h-4 text-green-600" />, label: "Wellness", value: "Available", clickable: true, action: "wellness" },
                     { icon: <Video className="w-4 h-4 text-blue-600" />, label: "Online Consult", value: "Available" },
                     { icon: <Shield className="w-4 h-4 text-yellow-600" />, label: "Diagnostics", value: "Advanced" },
                     { icon: <CreditCard className="w-4 h-4 text-orange-600" />, label: "Cashless", value: "Available" },
                     { icon: <User className="w-4 h-4 text-emerald-600" />, label: "Home Care", value: "Available", clickable: true, action: "homeHealthcare" },
                     ...(hospitalData?.hspdetails?.nabhnablapproved === "Yes"
                       ? [{ icon: <Award className="w-4 h-4 text-green-600" />, label: "NABH", value: hospitalData.hspdetails.nabhnabllevel }]
                       : []),
                     { icon: <Building2 className="w-4 h-4 text-amber-600" />, label: "Canteen", value: "Available" },
                     { icon: <Star className="w-4 h-4 text-yellow-600" />, label: "Rating", value: `${avgRating} ★` },
                   ].map((item, idx) => (
                     <div
                       key={idx}
                       onClick={item.clickable ? () => {
                         if (item.action === "doctors") setShowDoctorsList(true);
                         else if (item.action === "specialties") setShowSpecialtiesList(true);
                         else if (item.action === "branches") setShowBranchesList(true);
                         else if (item.action === "ambulances") setShowAmbulances(true);
                         else if (item.action === "wellness") setShowWellnessPackages(true);
                         else if (item.action === "homeHealthcare") setShowHomeHealthcare(true);
                       } : undefined}
                       className={`bg-white p-2 rounded-lg border border-gray-200 shadow-sm text-center min-h-[70px] flex flex-col justify-center items-center ${
                         item.clickable ? 'cursor-pointer active:scale-95' : ''
                       }`}
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
                    <h3 className="text-lg font-bold">24/7 Emergency</h3>
                    <p className="text-red-100 text-xs">Always here for urgent needs</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <a
                    href={`tel:${hospitalData?.hspcontact?.receptioncontact1 || hospitalData?.mobile}`}
                    className="bg-white text-red-600 hover:bg-red-50 font-bold py-3 px-4 rounded-lg transition-all shadow-md text-center text-sm"
                  >
                    📞 Call: {hospitalData?.hspcontact?.receptioncontact1 || hospitalData?.mobile || "Call Now"}
                  </a>
                  <button
                    onClick={() => alert("Emergency form feature coming soon!")}
                    className="bg-white/20 border-2 border-white text-white hover:bg-white/30 font-semibold py-3 px-4 rounded-lg transition-all text-center text-sm"
                  >
                    Request Ambulance
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Doctors List Modal */}
      {showDoctorsList && (
        <HospitalDoctorsList
          hospitalId={hospitalData?.id}
          onClose={() => setShowDoctorsList(false)}
        />
      )}

      {/* Specialties List Modal */}
      {showSpecialtiesList && (
        <HospitalSpecialtiesList
          hospitalId={hospitalData?.id}
          onClose={() => setShowSpecialtiesList(false)}
        />
      )}

      {/* Branches List Modal */}
      {showBranchesList && (
        <HospitalBranchesList
          hospitalId={hospitalData?.id}
          onClose={() => setShowBranchesList(false)}
        />
      )}

      {/* Government Schemes Modal */}
      <GovtSchemesList
        isOpen={govtSchemesDialogOpen}
        onClose={() => setGovtSchemesDialogOpen(false)}
        govtSchemesData={hospitalData?.hspInfo?.governmentschemes}
        hospitalName={hospitalData?.hspInfo?.regname || "this hospital"}
      />

      {/* Hospital Ambulances Modal */}
      {showAmbulances && (
        <HospitalAmbulancesList
          onClose={() => setShowAmbulances(false)}
          hospitalService={hospitalData}
          serviceName={hospitalData?.hspInfo?.regname}
        />
      )}

      {/* Hospital Wellness Packages Modal */}
      {showWellnessList && (
        <HospitalWellnessList
          onClose={() => setShowWellnessList(false)}
          hospitalService={hospitalData}
          serviceName={hospitalData?.hspInfo?.regname}
        />
      )}

      {/* Hospital Home Healthcare Modal */}
      {showHomeHealthcare && (
        <HospitalHomeHealthcareList
          onClose={() => setShowHomeHealthcare(false)}
          hospitalService={hospitalData}
          serviceName={hospitalData?.hspInfo?.regname}
        />
      )}

      {/* Hospital Beds Modal */}
{showBeds && (
  <HospitalBedsList
    onClose={() => setShowBeds(false)}
    hospitalService={hospitalData}
  />
)}

{/* Hospital Surgery Modal */}
{showSurgery && (
  <HospitalSurgeryList
    onClose={() => setShowSurgery(false)}
    hospitalService={hospitalData}
  />
)}

{/* Hospital Treatment Packages Modal */}
{showTreatment && (
  <HospitalTreatmentList
    onClose={() => setShowTreatment(false)}
    hospitalService={hospitalData}
  />
)}

{showDiagnostics && (
  <HospitalDiagnosticList
    hospitalId={hospitalData?.id}
    diagnosticCenterId={diagnosticCenterId}
    onClose={() => setShowDiagnostics(false)}
  />
)}





{showReviewsModal && (
  <HospitalReviewList
    hospitalId={hospitalData?.id}
    onClose={() => setShowReviewsModal(false)}
  />
)}

{showFacilities && (
  <HospitalFacilitiesList
    hospitalId={hospitalData?.id}
    onClose={() => setShowFacilities(false)}
  />
)}

{showPharmacy && (
  <HospitalPharmacyList
    hospitalId={hospitalData?.id}
    onClose={() => setShowPharmacy(false)}
  />
)}

{showNablPathology && (
  <HospitalNablPathologyList
    hospitalId={hospitalData?.id}
    onClose={() => setShowNablPathology(false)}
  />
)}

{showAccreditation && (
  <AccreditationList
    hospitalId={hospitalData?.id}
    onClose={() => setShowAccreditation(false)}
  />
)}

{showCanteen && (
  <InhouseCanteenList
    hospitalId={hospitalData?.id}
    onClose={() => setShowCanteen(false)}
  />
)}

{showModernFacilities && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
    onClick={() => setShowModernFacilities(false)}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-5 rounded-t-2xl sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold">Modern Hospital Facilities</h3>
          </div>
          <button
            onClick={() => setShowModernFacilities(false)}
            className="text-white hover:bg-white/20 rounded-full p-1 transition"
          >
            ×
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 space-y-4">
        <p className="text-gray-600 text-center mb-4">
          We provide state-of-the-art healthcare services with modern infrastructure and 24/7 support.
        </p>

        <div className="space-y-3">
          {modernFacilitiesServices.map((service, index) => {
            const isAvailable = service.value === "yes" || service.value === "Yes" || service.value === true;
            return (
              <div
                key={index}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                  isAvailable 
                    ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300 shadow-md" 
                    : "bg-gray-50 border-gray-200 opacity-75"
                }`}
              >
                <div className={`p-3 rounded-xl flex-shrink-0 ${
                  isAvailable ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"
                }`}>
                  {service.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 text-lg">{service.label}</h4>
                  <p className="text-gray-600 text-sm">{service.desc}</p>
                </div>
                {isAvailable ? (
                  <CheckCircle className="w-7 h-7 text-blue-600 flex-shrink-0" />
                ) : (
                  <div className="w-7 h-7 rounded-full border-2 border-gray-300 flex-shrink-0" />
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <p className="text-blue-900 font-semibold text-center">
            All services are backed by NABH standards and 24/7 emergency support.
          </p>
        </div>
      </div>
    </div>
  </div>
)}

{showOnlineConsultation && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    onClick={() => setShowOnlineConsultation(false)}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      className="relative bg-white text-gray-900 rounded-2xl w-[92%] max-w-xl shadow-2xl overflow-hidden border border-gray-100"
    >
      {/* HEADER */}
      <div className="bg-[#3D85EF] text-white py-5 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/20 rounded-xl">
            <Video className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-semibold tracking-wide">
            Online Consultation
          </h3>
        </div>
        <button
          onClick={() => setShowOnlineConsultation(false)}
          className="text-white/80 hover:text-white text-2xl leading-none"
        >
          ×
        </button>
      </div>

      {/* BODY */}
      <div className="p-8 bg-white space-y-6">
        {/* Hero Section */}
        <div className="flex items-center justify-center">
          <div className="p-4 bg-blue-50 rounded-full border border-blue-200">
            <Video className="w-12 h-12 text-[#3D85EF]" />
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Connect with Expert Doctors Instantly
          </h2>
          <p className="text-gray-600 text-base leading-relaxed max-w-md mx-auto">
            Consult with certified specialists through secure video sessions — from the
            comfort of your home. Get real-time advice and prescriptions digitally.
          </p>
        </div>

        {/* Highlights Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 text-center">
          <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
            <Clock className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <h4 className="font-semibold text-gray-900 text-base">Quick Access</h4>
            <p className="text-gray-600 text-sm mt-1">
              Book and consult within minutes
            </p>
          </div>
          <div className="p-4 rounded-lg bg-green-50 border border-green-200">
            <ShieldCheck className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <h4 className="font-semibold text-gray-900 text-base">Secure Platform</h4>
            <p className="text-gray-600 text-sm mt-1">
              100% private and encrypted video calls
            </p>
          </div>
          <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
            <User className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
            <h4 className="font-semibold text-gray-900 text-base">Expert Doctors</h4>
            <p className="text-gray-600 text-sm mt-1">
              Certified specialists across all departments
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 mt-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4">
          <div>
            <p className="text-sm text-gray-500">Consultation Hours</p>
            <p className="text-lg font-semibold text-[#3D85EF]">
              Monday – Saturday, 9:00 AM – 6:00 PM
            </p>
          </div>
          <button
            onClick={() => alert("Online consultation booking feature coming soon!")}
            className="bg-[#3D85EF] hover:bg-blue-700 text-white font-semibold text-base px-6 py-3 rounded-xl shadow-md transition-all hover:scale-[1.03]"
          >
            Book Consultation
          </button>
        </div>
      </div>
    </div>
  </div>
)}

{showCashless && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    onClick={() => setShowCashless(false)}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      className="relative bg-white text-gray-900 rounded-2xl w-[92%] max-w-xl shadow-2xl overflow-hidden border border-gray-100"
    >
      {/* HEADER */}
      <div className="bg-[#3D85EF] text-white py-5 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/20 rounded-xl">
            <CreditCard className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-semibold tracking-wide">
            Cashless Services
          </h3>
        </div>
        <button
          onClick={() => setShowCashless(false)}
          className="text-white/80 hover:text-white text-2xl leading-none"
        >
          ×
        </button>
      </div>

      {/* BODY */}
      <div className="p-4 bg-white space-y-2">

        {/* Icon */}
        <div className="flex items-center justify-center">
          <div className="p-4 bg-blue-50 rounded-full border border-blue-200">
            <CreditCard className="w-12 h-12 text-[#3D85EF]" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Cashless Health Insurance Facility
          </h2>
          <p className="text-gray-600 text-base leading-relaxed max-w-md mx-auto">
            Avail treatments without paying upfront. We provide seamless cashless
            hospitalization through major insurance providers and government health schemes.
          </p>
        </div>

        {/* Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 text-center">
          <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
            <Building2 className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <h4 className="font-semibold text-gray-900 text-base">Partnered Hospitals</h4>
            <p className="text-gray-600 text-sm mt-1">Wide network of empanelled hospitals</p>
          </div>

          <div className="p-4 rounded-lg bg-green-50 border border-green-200">
            <ShieldCheck className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <h4 className="font-semibold text-gray-900 text-base">Hassle-Free Claims</h4>
            <p className="text-gray-600 text-sm mt-1">Quick approval & direct settlement</p>
          </div>

          <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
            <CreditCard className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
            <h4 className="font-semibold text-gray-900 text-base">Multiple Insurers</h4>
            <p className="text-gray-600 text-sm mt-1">Accepted across top insurance providers</p>
          </div>
        </div>

      {/* Premium Insurance List */}
{(() => {
  const cashless = hospitalData?.hspInfo?.cashlessservices;

  if (!cashless || cashless.trim() === "" || cashless.toLowerCase() === "no") {
    return null;
  }

  if (cashless.toLowerCase() === "yes") {
    return null;
  }

  const insurers = cashless.split(",").map(i => i.trim());

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold text-gray-900 mb-4 text-center tracking-wide">
        Insurance Partners
      </h3>

      <div className="space-y-3">
        {insurers.map((name, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 shadow-sm
                       hover:shadow-md transition-all duration-200 bg-white"
          >
            <span className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0"></span>

            <p className="text-[15px] font-semibold text-gray-900">
              {name}
            </p>

            <div className="ml-auto px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700 font-medium">
              Partner
            </div>
          </div>
        ))}
      </div>
    </div>
  );
})()}
        <div className="border-t border-gray-200 mt-8"></div>

        {/* Status */}
        <div className="pt-4">
          <p className="text-sm text-gray-500">Status</p>
          <p className="text-lg font-semibold text-[#3D85EF]">
            {(() => {
              const cashless = hospitalData?.hspInfo?.cashlessservices;

              if (!cashless || cashless.trim() === "")
                return "Cashless Facility Not Available";

              if (cashless.toLowerCase() === "yes")
                return "Cashless Facility Available";

              if (cashless.toLowerCase() === "no")
                return "Cashless Facility Not Available";

              return "Cashless Facility Available";
            })()}
          </p>
        </div>

      </div>
    </div>
  </div>
)}



    </div>
  );
};

export default HospitalSingleView;