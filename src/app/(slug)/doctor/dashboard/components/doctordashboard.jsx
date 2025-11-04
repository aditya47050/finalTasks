"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Phone, Mail,HeartPulse, MapPin, CreditCard, Users, Heart, Calendar, Bed, Ambulance, Upload,IndianRupee, Star, Home, Activity, FileText, Building, Shield, Briefcase, Camera, Stethoscope, Receipt, Award, UserCheck, AlertTriangle, Download, Eye, Plus, CheckCircle, Clock, TrendingUp, Bell, Car, Pill, TestTube, Scissors, HeartHandshake, Banknote, BadgeIcon as IdCard, FileImage, UserPlus, Hospital, Siren, ClipboardList, Wallet, CircleCheck, CircleX, CircleAlert, Info, Grid3X3, List, CheckSquare, Calendar as CalendarIcon, MessageCircle, GraduationCap, BriefcaseMedical, Clock3, DollarSign, TrendingUpIcon, ShieldCheck, Zap, Target, BarChart3, Settings } from 'lucide-react';
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";



const dashboardicons = [
  {
    link:"/doctor/dashboard/visitinghospitals",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725343058/aarogya%20aadhar/SiteImages/Dashboard/wxwninf7d2dsel0mbpkh.png",
    title: "Your Hospitals",
  },
  {
    link:"/doctor/dashboard/appointment",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735119010/Patient_s_Appointment_ttx6ix.png",
    title: "Patient’s Appointment",
  },
  {
    link:"",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735118519/Online_Consultation_zeu60w.png",
    title: "Online Consultation",
  },
  {
    link:"",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735119008/Clinic_Schedules_xqla9x.png",
    title: "Clinic Schedules",
  },
  {
    link:"",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735119008/Hospital_Schedules_on23du.png",
    title: "Hospital Schedules",
  },
  {
    link:"/doctor/dashboard/surgery-schedule",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735119010/Surgery_Schedules_pcvzmr.png",
    title: "Surgery Schedules",
  },
  {
    link:"",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735119011/Treatment_Schedules_eaktpi.png",
    title: "Treatment Schedules",
  },
  {
    link:"",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735118526/Prescription_Formats_connkv.png",
    title: "Prescription Formats",
  },
  {
    link:"",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735119008/Patient_OPD_Invoice_vdcl53.png",
    title: "Patient OPD Invoice",
  },
  {
    link:"",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735119010/Patient_Records_uclxmc.png",
    title: "Patient Records",
  },
  {
    link:"",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735119011/Pharmacy_Products_iaddxu.png",
    title: "Pharmacy Products",
  },
  {
    link:"",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735119010/Profile_Analytics_lzd7fz.png",
    title: "Profile Analytics",
  },
  {
    link:"",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735119007/AA_Portal_Social_Media_hr5ee9.png",
    title: "AA Portal Social Media",
  },
  {
    link:"",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735119007/Documents_Registration_mbtklh.png",
    title: "Documents Registration",
  },
  {
    link:"/doctor/dashboard/associatedhospital",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735119008/Network_Hospital_s_lu5z9m.png",
    title: "Network Hospital’s",
  },
  {
    link:"",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735119006/Doctor_s_Team_lyijof.png",
    title: "Doctor’s Team",
  },
  {
    link:"/doctor/dashboard/view-orders",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735119006/Your_Orders_oqqoc0.png",
    title: "Your Orders",
  },
  {
    link:"",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735119006/Dashboard_Settings_rxvvhp.png",
    title: "Dashboard Settings",
  },
  {
    link:"",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735119006/Your_Feedback_owe2gw.png",
    title: "Your Feedback",
  },
    {
    link:"/doctor/dashboard/ads-section",
    img: "https://res.cloudinary.com/dorreici1/image/upload/v1760424458/46a89694-3064-49e1-8778-b68c62d24fcb.png",
    title: "Ads Section",
  },
];

// Professional Medical Navigation Component for Doctor
const NavigationSidebar = ({ activeSection, onSectionChange }) => {
  const navigationItems = [
    { 
      id: 'overview', 
      icon: Grid3X3, 
      label: 'Overview', 
      color: 'bg-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    { 
      id: 'profile', 
      icon: User, 
      label: 'Profile', 
      color: 'bg-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    { 
      id: 'professional', 
      icon: BriefcaseMedical, 
      label: 'Professional', 
      color: 'bg-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    { 
      id: 'appointments', 
      icon: CalendarIcon, 
      label: 'Appointments', 
      color: 'bg-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
    { 
      id: 'financial', 
      icon: DollarSign, 
      label: 'Financial', 
      color: 'bg-emerald-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600'
    },
    { 
      id: 'documents', 
      icon: FileText, 
      label: 'Documents', 
      color: 'bg-indigo-600',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600'
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 hidden lg:block">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-2">
        <div className="flex flex-col space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`flex items-center justify-center w-12 h-12 rounded-lg transition-colors duration-200 ${
                  isActive 
                    ? `${item.color} text-white shadow-md` 
                    : `text-gray-600 hover:${item.bgColor} hover:${item.textColor}`
                }`}
                title={item.label}
              >
                <Icon className="w-5 h-5" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const Dashboardclient = () => {
  return (
    <div className="md:mt-4 lg:mt-0 lg:mb-20 md:pb-0 px-4 md:container h-auto xl:h-[580px] rounded-xl">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500 p-8 shadow-lg"
      >
        {/* Background Accent */}
        <div className="absolute top-0 right-0 opacity-20 text-white text-[120px] font-extrabold select-none">
          +
        </div>

        <div className="relative z-10 text-center text-white font-poppins">
          <div className="flex justify-center gap-3 mb-4">
            <HeartPulse className="w-8 h-8 text-white drop-shadow-md" />
            <Stethoscope className="w-8 h-8 text-white drop-shadow-md" />
            <Activity className="w-8 h-8 text-white drop-shadow-md" />
          </div>
          <h1 className="text-[28px] md:text-[34px] font-extrabold tracking-wide drop-shadow-sm">
            Healthcare Services
          </h1>
          <p className="mt-2 text-[14px] md:text-[16px] font-medium opacity-90">
            Your Personalized Health Hub
          </p>
        </div>
      </motion.div>

      {/* Grid Section */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 justify-center">
        {dashboardicons.map((item, index) => (
          <motion.div
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            key={index}
            className="flex flex-col items-center text-center"
          >
            <Link href={item.link || "#"}>
              <div className="group flex flex-col items-center">
                {/* Icon Box */}
                <div className="h-20 w-20 xl:h-24 xl:w-24 bg-gradient-to-tr from-[#243460] to-[#2b73f1] p-3 rounded-2xl shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:from-[#2b73f1] group-hover:to-[#243460]">
                  <Image
                    src={item.img}
                    width={80}
                    height={80}
                    alt={item.title}
                    className="object-contain w-full h-full"
                  />
                </div>

                {/* Title */}
                <p className="mt-2 text-[11px] sm:text-[12px] md:text-[13px] font-poppins font-semibold leading-tight">
                  <span className="text-[#2b73ec] block">
                    {item.title.split(" ")[0]}
                  </span>
                  <span className="text-[#243460]">
                    {item.title.split(" ").slice(1).join(" ")}
                  </span>
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};



const DoctorDashboardOverview = ({ userdata }) => {

  console.log("Doctor User Data:", userdata);
  const [activeSection, setActiveSection] = useState('overview');

  // Handle section navigation
  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Handle scroll to update active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['overview', 'profile', 'professional', 'appointments', 'financial', 'documents'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return "₹0";
    return `₹${Number.parseFloat(amount).toLocaleString("en-IN")}`;
  };

  // Calculate doctor statistics
  const stats = {
    totalAppointments: userdata?.BookFreeAppointment?.length || 0,
    upcomingAppointments: userdata?.BookFreeAppointment?.filter(apt => 
      new Date(apt.preferredDate) > new Date()
    ).length || 0,
    completedAppointments: userdata?.BookFreeAppointment?.filter(apt => 
      apt.status === 'COMPLETED'
    ).length || 0,
    totalPatients: new Set(userdata?.BookFreeAppointment?.map(apt => apt.patientId)).size || 0,
    totalHospitals: userdata?.HospitalDoctor?.length || 0,
    totalPrescriptions: userdata?.prescriptions?.length || 0,
    totalReviews: userdata?.DoctorReview?.length || 0,
    averageRating: userdata?.DoctorReview?.length > 0 
      ? (userdata.DoctorReview.reduce((sum, review) => sum + (review.rating || 0), 0) / userdata.DoctorReview.length).toFixed(1)
      : 0,
    totalEarnings: userdata?.DoctorPayment?.reduce((sum, payment) => sum + parseFloat(payment.amount || 0), 0) || 0,
    pendingEarnings: userdata?.DoctorPayment?.filter(payment => payment.status === 'PENDING')
      .reduce((sum, payment) => sum + parseFloat(payment.amount || 0), 0) || 0,
    experienceYears: userdata?.totalexperience || "0",
    specialities: userdata?.specialities?.length || 0
  };

  // Enhanced profile completion calculation for doctor
  const calculateProfileCompletion = () => {
    const sections = {
      basicInfo: {
        fields: [
          userdata?.firstName,
          userdata?.lastName,
          userdata?.dateOfBirth,
          userdata?.gender,
          userdata?.mobile,
          userdata?.email
        ],
        weight: 20
      },
      professionalInfo: {
        fields: [
          userdata?.education,
          userdata?.totalexperience,
          userdata?.specialities?.length > 0,
          userdata?.regno,
          userdata?.registrationdate
        ],
        weight: 30
      },
      medicalDocs: {
        fields: [
          userdata?.degreecertificate,
          userdata?.registrationcertificate,
          userdata?.specialitydegreecertificate
        ],
        weight: 25
      },
      practiceInfo: {
        fields: [
          userdata?.doctorinfo?.about,
          userdata?.HospitalDoctor?.length > 0,
          userdata?.doctorvisitinghospitals?.length > 0
        ],
        weight: 15
      },
      financialInfo: {
        fields: [
          userdata?.bankAccountNumber,
          userdata?.ifscCode
        ],
        weight: 10
      }
    };

    let totalCompletion = 0;
    Object.values(sections).forEach(section => {
      const completedFields = section.fields.filter(
        field => typeof field === "string" ? field.trim() !== "" : !!field
      ).length;
      const sectionCompletion = (completedFields / section.fields.length) * section.weight;
      totalCompletion += sectionCompletion;
    });

    return Math.round(totalCompletion);
  };

  const profileCompletion = calculateProfileCompletion();

  const InfoCard = ({ title, children, icon: Icon, className = "", gradient = "" }) => (
    <Card className={`h-full rounded-xl border-0 shadow-md hover:shadow-lg transition-shadow duration-200 ${gradient} ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-800">
          {Icon && <Icon className="w-5 h-5 text-blue-600" />}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );

  const StatCard = ({ title, value, icon: Icon, color, bgColor, textColor, subtitle }) => (
    <Card className={`rounded-xl border-0 shadow-md hover:shadow-lg transition-shadow duration-200 ${bgColor}`}>
      <CardContent className="xs:p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
            {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          </div>
          <div className={`p-3 rounded-xl ${color}`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const StatusIndicator = ({ label, status, type = "boolean", description }) => {
    const getStatusColor = () => {
      if (type === "boolean") {
        return status ? "bg-green-100 text-green-800 border-green-200" : "bg-red-100 text-red-800 border-red-200";
      }
      switch (status?.toLowerCase()) {
        case "approved":
        case "completed":
        case "active":
        case "success":
        case "verified":
          return "bg-green-100 text-green-800 border-green-200";
        case "pending":
        case "submitted":
        case "under review":
          return "bg-yellow-100 text-yellow-800 border-yellow-200";
        case "rejected":
        case "cancelled":
        case "failed":
        case "expired":
          return "bg-red-100 text-red-800 border-red-200";
        default:
          return "bg-gray-100 text-gray-800 border-gray-200";
      }
    };

    const getStatusText = () => {
      if (type === "boolean") {
        return status ? "Complete" : "Missing";
      }
      return formatText(status);
    };

    const getStatusIcon = () => {
      if (type === "boolean") {
        return status ? <CircleCheck className="w-4 h-4" /> : <CircleX className="w-4 h-4" />;
      }
      switch (status?.toLowerCase()) {
        case "approved":
        case "completed":
        case "active":
        case "success":
        case "verified":
          return <CircleCheck className="w-4 h-4" />;
        case "pending":
        case "submitted":
        case "under review":
          return <CircleAlert className="w-4 h-4" />;
        case "rejected":
        case "cancelled":
        case "failed":
        case "expired":
          return <CircleX className="w-4 h-4" />;
        default:
          return <Info className="w-4 h-4" />;
      }
    };

    return (
      <div className="flex items-center justify-between p-3 bg-white rounded-lg border hover:bg-gray-50 transition-colors duration-200">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">{label}</span>
            {getStatusIcon()}
          </div>
          {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
        </div>
        <Badge className={`rounded-xl ${getStatusColor()}`}>
          {getStatusText()}
        </Badge>
      </div>
    );
  };

  const ProfileCompletionCard = ({ icon: Icon, title, description, iconColorClass }) => (
    <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 cursor-pointer group">
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg bg-gray-50 group-hover:bg-gray-100 transition-colors duration-200 ${iconColorClass}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 text-sm mb-1 group-hover:text-gray-700 transition-colors duration-200">{title}</h3>
          <p className="text-xs text-gray-600 group-hover:text-gray-500 transition-colors duration-200">{description}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen font-sans relative">
      {/* Navigation Sidebar */}
      <NavigationSidebar 
        activeSection={activeSection} 
        onSectionChange={handleSectionChange} 
      />
      
      <div className="w-full max-w-7xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
        {/* Modern Doctor Profile Header */}
        <div className="relative bg-white rounded-2xl mx-2 sm:mx-4 mt-4 overflow-hidden shadow-lg border border-gray-100">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"></div>
          <div className="absolute top-0 right-0 w-32 sm:w-48 lg:w-64 h-32 sm:h-48 lg:h-64 bg-gradient-to-bl from-blue-100/30 to-transparent rounded-full -translate-y-16 sm:-translate-y-24 lg:-translate-y-32 translate-x-16 sm:translate-x-24 lg:translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-24 sm:w-36 lg:w-48 h-24 sm:h-36 lg:h-48 bg-gradient-to-tr from-purple-100/30 to-transparent rounded-full translate-y-12 sm:translate-y-18 lg:translate-y-24 -translate-x-12 sm:-translate-x-18 lg:-translate-x-24"></div>
          
          <div className="relative z-10 p-4 sm:p-6 lg:p-8">
            {/* Profile Header Content */}
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 lg:items-start">
              {/* Profile Photo Section */}
              <div className="flex flex-col items-center lg:items-start">
                <div className="relative">
                  <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-2xl border-4 border-white shadow-xl overflow-hidden">
                    {userdata?.profilePhoto ? (
                      <Image
                        className="w-full h-full object-cover"
                        src={userdata.profilePhoto || "/placeholder.svg"}
                        alt="Doctor Profile"
                        width={128}
                        height={128}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                        <User className="w-12 h-12 lg:w-16 lg:h-16 text-white" />
                      </div>
                    )}
                  </div>
                  {/* Verification Badge */}
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-white" />
                  </div>
                </div>
                
                {/* Profile Completion */}
                <div className="mt-4 text-center lg:text-left">
                  <div className="text-sm text-gray-600 mb-2">Profile Completion</div>
                  <div className="flex items-center gap-2 mb-3">
                    <Progress value={profileCompletion} className="flex-1 h-2" />
                    <span className="text-sm font-semibold text-gray-700">{profileCompletion}%</span>
                  </div>
                  <Link href="/doctor/dashboard/profile">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                      <Plus className="w-4 h-4 mr-1" />
                      Complete Profile
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Doctor Information */}
              <div className="flex-1">
                <div className="mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                      Dr. {formatText(userdata?.firstName)} {formatText(userdata?.lastName)}
                    </h1>
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200 rounded-lg px-3 py-1">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      {stats.averageRating} Rating
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {userdata?.specialities?.slice(0, 3).map((spec, index) => (
                      <Badge key={index} variant="outline" className="rounded-lg">
                        {spec.speciality?.name || 'Speciality'}
                      </Badge>
                    ))}
                    {userdata?.specialities?.length > 3 && (
                      <Badge variant="outline" className="rounded-lg">
                        +{userdata.specialities.length - 3} more
                      </Badge>
                    )}
                  </div>
                  
                  {/* Professional Information */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="flex items-center gap-3 p-3 bg-white/60 rounded-xl border border-white/50">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <GraduationCap className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Education</div>
                        <div className="text-sm font-medium text-gray-900">{userdata?.education || "N/A"}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-white/60 rounded-xl border border-white/50">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <BriefcaseMedical className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Experience</div>
                        <div className="text-sm font-medium text-gray-900">{stats.experienceYears} years</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-white/60 rounded-xl border border-white/50">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Hospital className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Hospitals</div>
                        <div className="text-sm font-medium text-gray-900">{stats.totalHospitals} affiliated</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-white/60 rounded-xl border border-white/50">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <Stethoscope className="w-4 h-4 text-red-600" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Registration</div>
                        <div className="text-sm font-medium text-gray-900">{userdata?.regno || "N/A"}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="flex flex-wrap gap-3">
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200 rounded-lg px-3 py-1">
                    Member since {formatDate(userdata?.createdAt)}
                  </Badge>
                  <Badge className="bg-green-100 text-green-800 border-green-200 rounded-lg px-3 py-1">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {userdata?.verified ? 'Verified Doctor' : 'Verification Pending'}
                  </Badge>
                  <Badge className="bg-purple-100 text-purple-800 border-purple-200 rounded-lg px-3 py-1">
                    {stats.totalPatients} Patients Treated
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Dashboard Content */}
        <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
          {/* Modern Stats Overview */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 sm:p-6 border border-blue-100">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Practice Overview
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white rounded-xl p-4 border border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{stats.totalAppointments}</div>
                    <div className="text-sm text-gray-600">Total Appointments</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 border border-green-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{stats.totalPatients}</div>
                    <div className="text-sm text-gray-600">Total Patients</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 border border-purple-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Star className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{stats.averageRating}</div>
                    <div className="text-sm text-gray-600">Average Rating</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 border border-orange-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <IndianRupee className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalEarnings)}</div>
                    <div className="text-sm text-gray-600">Total Earnings</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modern Information Tabs */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
              <div className="bg-gray-50 px-2 sm:px-4 py-6">
                <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 bg-transparent h-auto p-0 gap-1">
                  <TabsTrigger 
                    value="overview" 
                    className="flex flex-col items-center gap-1 px-1 sm:px-2 py-3 data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-800 rounded-lg text-xs font-medium transition-all duration-200 min-h-[60px] justify-center"
                  >
                    <Grid3X3 className="w-4 h-4 flex-shrink-0" />
                    <span className="text-xs leading-tight text-center">Overview</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="profile" 
                    className="flex flex-col items-center gap-1 px-1 sm:px-2 py-3 data-[state=active]:bg-green-500 data-[state=active]:text-white data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-800 rounded-lg text-xs font-medium transition-all duration-200 min-h-[60px] justify-center"
                  >
                    <User className="w-4 h-4 flex-shrink-0" />
                    <span className="text-xs leading-tight text-center">Profile</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="professional" 
                    className="flex flex-col items-center gap-1 px-1 sm:px-2 py-3 data-[state=active]:bg-purple-500 data-[state=active]:text-white data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-800 rounded-lg text-xs font-medium transition-all duration-200 min-h-[60px] justify-center"
                  >
                    <BriefcaseMedical className="w-4 h-4 flex-shrink-0" />
                    <span className="text-xs leading-tight text-center">Professional</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="appointments" 
                    className="flex flex-col items-center gap-1 px-1 sm:px-2 py-3 data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-800 rounded-lg text-xs font-medium transition-all duration-200 min-h-[60px] justify-center"
                  >
                    <CalendarIcon className="w-4 h-4 flex-shrink-0" />
                    <span className="text-xs leading-tight text-center">Appointments</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="financial" 
                    className="flex flex-col items-center gap-1 px-1 sm:px-2 py-3 data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-800 rounded-lg text-xs font-medium transition-all duration-200 min-h-[60px] justify-center"
                  >
                    <DollarSign className="w-4 h-4 flex-shrink-0" />
                    <span className="text-xs leading-tight text-center">Financial</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="documents" 
                    className="flex flex-col items-center gap-1 px-1 sm:px-2 py-3 data-[state=active]:bg-indigo-500 data-[state=active]:text-white data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-800 rounded-lg text-xs font-medium transition-all duration-200 min-h-[60px] justify-center"
                  >
                    <FileText className="w-4 h-4 flex-shrink-0" />
                    <span className="text-xs leading-tight text-center">Documents</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="overview" id="overview" className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* Upcoming Appointments */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <InfoCard
                    title="Today's Appointments"
                    icon={Calendar}
                    gradient="bg-gradient-to-br from-green-50 to-emerald-50"
                  >
                    {userdata?.BookFreeAppointment?.filter(apt => {
                      const aptDate = new Date(apt.preferredDate);
                      const today = new Date();
                      return aptDate.toDateString() === today.toDateString();
                    }).length > 0 ? (
                      <div className="space-y-4">
                        {userdata.BookFreeAppointment.filter(apt => {
                          const aptDate = new Date(apt.preferredDate);
                          const today = new Date();
                          return aptDate.toDateString() === today.toDateString();
                        }).slice(0, 3).map((appointment, index) => (
                          <div key={index} className="flex items-center justify-between p-4 bg-white rounded-xl border hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-green-100 rounded-lg">
                                <User className="w-5 h-5 text-green-600" />
                              </div>
                              <div>
                                <p className="font-semibold text-gray-800">
                                  {appointment.patient?.firstName || 'Patient'} {appointment.patient?.lastName || ''}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {appointment.category?.title || 'Consultation'}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {new Date(appointment.preferredDate).toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                            <Badge className={`rounded-xl ${appointment.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                              appointment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                              {formatText(appointment.status)}
                            </Badge>
                          </div>
                        ))}
                        <Button variant="outline" className="w-full rounded-xl">
                          <Calendar className="w-4 h-4 mr-2" />
                          View All Today's Appointments
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p className="text-gray-500 mb-4">No appointments today</p>
                        <Button className="rounded-xl">
                          <Plus className="w-4 h-4 mr-2" />
                          Check Schedule
                        </Button>
                      </div>
                    )}
                  </InfoCard>

                  {/* Practice Analytics */}
                  <InfoCard
                    title="Practice Analytics"
                    icon={BarChart3}
                    gradient="bg-gradient-to-br from-purple-50 to-pink-50"
                  >
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-white rounded-xl border">
                          <TrendingUpIcon className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                          <p className="text-2xl font-bold text-blue-600">{stats.upcomingAppointments}</p>
                          <p className="text-sm text-gray-600">Upcoming</p>
                        </div>
                        <div className="text-center p-4 bg-white rounded-xl border">
                          <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
                          <p className="text-2xl font-bold text-green-600">{stats.completedAppointments}</p>
                          <p className="text-sm text-gray-600">Completed</p>
                        </div>
                        <div className="text-center p-4 bg-white rounded-xl border">
                          <FileText className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                          <p className="text-2xl font-bold text-purple-600">{stats.totalPrescriptions}</p>
                          <p className="text-sm text-gray-600">Prescriptions</p>
                        </div>
                        <div className="text-center p-4 bg-white rounded-xl border">
                          <MessageCircle className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                          <p className="text-2xl font-bold text-orange-600">{stats.totalReviews}</p>
                          <p className="text-sm text-gray-600">Reviews</p>
                        </div>
                      </div>
                    </div>
                  </InfoCard>
                </div>

                {/* Quick Actions Grid */}
                {/* <InfoCard
                  title="Quick Actions"
                  icon={Zap}
                  gradient="bg-gradient-to-br from-blue-50 to-cyan-50"
                >
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {dashboardIcons.slice(0, 8).map((item, index) => (
                      <Link key={index} href={item.link}>
                        <div className="text-center p-4 bg-white rounded-xl border hover:shadow-md transition-shadow cursor-pointer">
                          <div className="inline-flex p-3 rounded-xl bg-blue-100 mb-2">
                            <Image
                              src={item.img || "/placeholder.svg"}
                              alt={item.title}
                              width={24}
                              height={24}
                              className="w-6 h-6"
                            />
                          </div>
                          <p className="text-sm font-medium text-gray-800">{item.title}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </InfoCard> */}
              </TabsContent>

              <TabsContent value="profile" id="profile" className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Personal Information */}
                  <InfoCard
                    title="Personal Information"
                    icon={User}
                    gradient="bg-gradient-to-br from-blue-50 to-indigo-50"
                  >
                    <div className="space-y-3">
                      <StatusIndicator
                        label="First Name"
                        status={userdata?.firstName}
                        description="Your professional first name"
                      />
                      <StatusIndicator
                        label="Last Name"
                        status={userdata?.lastName}
                        description="Your professional last name"
                      />
                      <StatusIndicator
                        label="Date of Birth"
                        status={userdata?.dateOfBirth}
                        description="Required for verification"
                      />
                      <StatusIndicator
                        label="Gender"
                        status={userdata?.gender}
                        description="Professional demographic information"
                      />
                      <StatusIndicator
                        label="Mobile Number"
                        status={userdata?.mobile}
                        description="Primary contact for patients"
                      />
                      <StatusIndicator
                        label="Email Address"
                        status={userdata?.email}
                        description="Professional communication"
                      />
                    </div>
                  </InfoCard>

                  {/* Contact Information */}
                  <InfoCard
                    title="Contact Information"
                    icon={Phone}
                    gradient="bg-gradient-to-br from-green-50 to-emerald-50"
                  >
                    <div className="space-y-3">
                      <StatusIndicator
                        label="Alternate Mobile"
                        status={userdata?.alternatemobileno}
                        description="Backup contact number"
                      />
                      <StatusIndicator
                        label="Pincode"
                        status={userdata?.pincode}
                        description="Practice area location"
                      />
                      <StatusIndicator
                        label="Address"
                        status={userdata?.address}
                        description="Clinic or practice address"
                      />
                    </div>
                  </InfoCard>
                </div>
              </TabsContent>

              <TabsContent value="professional" id="professional" className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Professional Details */}
                  <InfoCard
                    title="Professional Details"
                    icon={BriefcaseMedical}
                    gradient="bg-gradient-to-br from-purple-50 to-pink-50"
                  >
                    <div className="space-y-3">
                      <StatusIndicator
                        label="Education"
                        status={userdata?.education}
                        description="Medical degrees and qualifications"
                      />
                      <StatusIndicator
                        label="Total Experience"
                        status={userdata?.totalexperience}
                        description="Years of medical practice"
                      />
                      <StatusIndicator
                        label="Specialities"
                        status={userdata?.specialities?.length > 0}
                        description={`${stats.specialities} specialities listed`}
                      />
                      <StatusIndicator
                        label="Registration Number"
                        status={userdata?.regno}
                        description="Medical council registration"
                      />
                      <StatusIndicator
                        label="Registration Date"
                        status={userdata?.registrationdate}
                        description="Date of medical registration"
                      />
                      <StatusIndicator
                        label="Registration Renewal"
                        status={userdata?.regrenewaldate}
                        description="Next renewal date"
                      />
                    </div>
                  </InfoCard>

                  {/* Practice Information */}
                  <InfoCard
                    title="Practice Information"
                    icon={Hospital}
                    gradient="bg-gradient-to-br from-orange-50 to-red-50"
                  >
                    <div className="space-y-3">
                      <StatusIndicator
                        label="Affiliated Hospitals"
                        status={userdata?.HospitalDoctor?.length > 0}
                        description={`${stats.totalHospitals} hospitals`}
                      />
                      <StatusIndicator
                        label="Visiting Hospitals"
                        status={userdata?.doctorvisitinghospitals?.length > 0}
                        description="Hospitals you regularly visit"
                      />
                      <StatusIndicator
                        label="Doctor Information"
                        status={userdata?.doctorinfo?.about}
                        description="Professional bio and description"
                      />
                      <StatusIndicator
                        label="Consultation Fee"
                        status={userdata?.doctorinfo?.consultationFee}
                        description="Standard consultation charges"
                      />
                    </div>
                  </InfoCard>
                </div>
              </TabsContent>

              <TabsContent value="appointments" id="appointments" className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Appointment Statistics */}
                  <InfoCard
                    title="Appointment Statistics"
                    icon={BarChart3}
                    gradient="bg-gradient-to-br from-blue-50 to-cyan-50"
                  >
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-white rounded-xl border">
                          <Calendar className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                          <p className="text-2xl font-bold text-blue-600">{stats.totalAppointments}</p>
                          <p className="text-sm text-gray-600">Total</p>
                        </div>
                        <div className="text-center p-4 bg-white rounded-xl border">
                          <Clock3 className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                          <p className="text-2xl font-bold text-orange-600">{stats.upcomingAppointments}</p>
                          <p className="text-sm text-gray-600">Upcoming</p>
                        </div>
                        <div className="text-center p-4 bg-white rounded-xl border">
                          <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
                          <p className="text-2xl font-bold text-green-600">{stats.completedAppointments}</p>
                          <p className="text-sm text-gray-600">Completed</p>
                        </div>
                        <div className="text-center p-4 bg-white rounded-xl border">
                          <Users className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                          <p className="text-2xl font-bold text-purple-600">{stats.totalPatients}</p>
                          <p className="text-sm text-gray-600">Patients</p>
                        </div>
                      </div>
                    </div>
                  </InfoCard>

                  {/* Recent Appointments */}
                  <InfoCard
                    title="Recent Appointments"
                    icon={Calendar}
                    gradient="bg-gradient-to-br from-green-50 to-emerald-50"
                  >
                    {userdata?.BookFreeAppointment?.length > 0 ? (
                      <div className="space-y-4">
                        {userdata.BookFreeAppointment.slice(0, 5).map((appointment, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                            <div className="flex items-center gap-3">
                              <User className="w-4 h-4 text-gray-400" />
                              <div>
                                <p className="font-medium text-sm">
                                  {appointment.patient?.firstName || 'Patient'}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {formatDate(appointment.preferredDate)}
                                </p>
                              </div>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {formatText(appointment.status)}
                            </Badge>
                          </div>
                        ))}
                        <Link href="/doctor/dashboard/appointments">
                          <Button variant="outline" className="w-full rounded-xl">
                            View All Appointments
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p className="text-gray-500">No appointments yet</p>
                      </div>
                    )}
                  </InfoCard>
                </div>
              </TabsContent>

              <TabsContent value="financial" id="financial" className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Earnings Overview */}
                  <InfoCard
                    title="Earnings Overview"
                    icon={DollarSign}
                    gradient="bg-gradient-to-br from-emerald-50 to-green-50"
                  >
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-white rounded-xl border">
                          <Wallet className="w-8 h-8 mx-auto mb-2 text-emerald-600" />
                          <p className="text-2xl font-bold text-emerald-600">{formatCurrency(stats.totalEarnings)}</p>
                          <p className="text-sm text-gray-600">Total Earnings</p>
                        </div>
                        <div className="text-center p-4 bg-white rounded-xl border">
                          <Clock className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                          <p className="text-2xl font-bold text-orange-600">{formatCurrency(stats.pendingEarnings)}</p>
                          <p className="text-sm text-gray-600">Pending</p>
                        </div>
                      </div>
                      <div className="bg-white rounded-xl p-4 border">
                        <h4 className="font-semibold mb-2">Recent Payments</h4>
                        {userdata?.DoctorPayment?.slice(0, 3).map((payment, index) => (
                          <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                            <div>
                              <p className="text-sm font-medium">Appointment Fee</p>
                              <p className="text-xs text-gray-500">{formatDate(payment.createdAt)}</p>
                            </div>
                            <Badge variant={payment.status === 'SUCCESS' ? 'default' : 'secondary'}>
                              {formatCurrency(payment.amount)}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </InfoCard>

                  {/* Bank Information */}
                  <InfoCard
                    title="Bank Information"
                    icon={CreditCard}
                    gradient="bg-gradient-to-br from-blue-50 to-indigo-50"
                  >
                    <div className="space-y-3">
                      <StatusIndicator
                        label="Bank Account Number"
                        status={userdata?.bankAccountNumber}
                        description="For earnings transfer"
                      />
                      <StatusIndicator
                        label="IFSC Code"
                        status={userdata?.ifscCode}
                        description="Bank branch code"
                      />
                      <StatusIndicator
                        label="Account Holder Name"
                        status={userdata?.accountHolderName}
                        description="Name as per bank records"
                      />
                      <StatusIndicator
                        label="Bank Name"
                        status={userdata?.bankName}
                        description="Your bank name"
                      />
                    </div>
                  </InfoCard>
                </div>
              </TabsContent>

              <TabsContent value="documents" id="documents" className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Medical Certificates */}
                  <InfoCard
                    title="Medical Certificates"
                    icon={FileText}
                    gradient="bg-gradient-to-br from-indigo-50 to-purple-50"
                  >
                    <div className="space-y-3">
                      <StatusIndicator
                        label="Degree Certificate"
                        status={userdata?.degreecertificate}
                        description="Medical degree verification"
                      />
                      <StatusIndicator
                        label="Registration Certificate"
                        status={userdata?.registrationcertificate}
                        description="Medical council registration"
                      />
                      <StatusIndicator
                        label="Speciality Degree Certificate"
                        status={userdata?.specialitydegreecertificate}
                        description="Specialization certification"
                      />
                      <StatusIndicator
                        label="Practice License"
                        status={userdata?.practiceLicense}
                        description="Current practice license"
                      />
                    </div>
                  </InfoCard>

                  {/* Identity Documents */}
                  <InfoCard
                    title="Identity Documents"
                    icon={IdCard}
                    gradient="bg-gradient-to-br from-orange-50 to-red-50"
                  >
                    <div className="space-y-3">
                      <StatusIndicator
                        label="Aadhar Card"
                        status={userdata?.aadharCard}
                        description="Government identity proof"
                      />
                      <StatusIndicator
                        label="PAN Card"
                        status={userdata?.panCard}
                        description="Tax identification"
                      />
                      <StatusIndicator
                        label="Profile Photo"
                        status={userdata?.profilePhoto}
                        description="Professional photograph"
                      />
                      <StatusIndicator
                        label="Signature"
                        status={userdata?.signature}
                        description="Digital signature for prescriptions"
                      />
                    </div>
                  </InfoCard>
                </div>

                {/* Document Upload Actions */}
                <InfoCard
                  title="Document Upload Center"
                  icon={Upload} 
                  gradient="bg-gradient-to-br from-purple-50 to-pink-50"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Link href="/doctor/dashboard/certificates">
                      <Button variant="outline" className="p-6 h-auto flex-col rounded-xl w-full">
                        <FileText className="w-8 h-8 mb-2 text-blue-600" />
                        <span className="font-semibold">Upload Certificates</span>
                        <span className="text-xs text-gray-500">Degree & Registration</span>
                      </Button>
                    </Link>

                    <Link href="/doctor/dashboard/profile">
                      <Button variant="outline" className="p-6 h-auto flex-col rounded-xl w-full">
                        <IdCard className="w-8 h-8 mb-2 text-green-600" />
                        <span className="font-semibold">Upload ID Proof</span>
                        <span className="text-xs text-gray-500">Aadhar & PAN</span>
                      </Button>
                    </Link>

                    <Link href="/doctor/dashboard/profile">
                      <Button variant="outline" className="p-6 h-auto flex-col rounded-xl w-full">
                        <Camera className="w-8 h-8 mb-2 text-purple-600" />
                        <span className="font-semibold">Update Photo</span>
                        <span className="text-xs text-gray-500">Profile Picture</span>
                      </Button>
                    </Link>
                  </div>
                </InfoCard>
              </TabsContent>
            </Tabs>
          </div>

          {/* Profile Completion Section */}
          {profileCompletion < 100 && (
            <div className="relative">
              <div className="bg-white rounded-xl shadow-lg border border-orange-200 overflow-hidden">
                <div className="p-6 pb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-1.5 w-24 bg-blue-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full transition-all duration-300" style={{ width: `${profileCompletion}%` }} />
                      </div>
                      <h2 className="text-lg font-bold text-gray-900">
                        <span className="text-orange-600">Action Required</span> - Complete Your Profile ({100 - profileCompletion}% remaining)
                      </h2>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 ml-11">Complete your professional profile to attract more patients and access all features.</p>
                </div>

                <div className="px-6 pb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <ProfileCompletionCard
                      icon={GraduationCap}
                      title="Add your education details"
                      description="Medical degrees and qualifications."
                      iconColorClass="text-blue-600"
                    />
                    <ProfileCompletionCard
                      icon={BriefcaseMedical}
                      title="Complete experience information"
                      description="Years of practice and specializations."
                      iconColorClass="text-green-600"
                    />
                    <ProfileCompletionCard
                      icon={FileText}
                      title="Upload medical certificates"
                      description="Degree and registration documents."
                      iconColorClass="text-purple-600"
                    />
                    <ProfileCompletionCard
                      icon={Hospital}
                      title="Add hospital affiliations"
                      description="Hospitals where you practice."
                      iconColorClass="text-red-600"
                    />
                    <ProfileCompletionCard
                      icon={Banknote}
                      title="Set consultation fees"
                      description="Standard charges for patients."
                      iconColorClass="text-orange-600"
                    />
                    <ProfileCompletionCard
                      icon={CreditCard}
                      title="Add bank account details"
                      description="For receiving payments."
                      iconColorClass="text-indigo-600"
                    />
                  </div>
                </div>

                <div className="bg-orange-500 px-4 py-3 flex items-center justify-center">
                  <Link href="/doctor/dashboard/profile" className="flex items-center gap-2 hover:bg-orange-600 px-4 py-2 rounded-lg transition-colors duration-200">
                    <Plus className="w-4 h-4 text-white" />
                    <span className="text-white font-medium text-sm">
                      Complete Profile Now - Get {100 - profileCompletion}% More Visibility
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Dashboardclient/>
    </div>
  );
};

export default DoctorDashboardOverview;