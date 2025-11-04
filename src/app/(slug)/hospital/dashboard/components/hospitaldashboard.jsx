'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";  
import { 
  Bed, 
  Users, 
  Ambulance, 
  Calendar, 
  Star, 
  HeartPulse,
  Activity,
  TrendingUp,
  ClipboardList,
  Hospital,
  Stethoscope,
  FileText,
  Settings,
  Phone,
  Mail,
  MapPin,
  Shield,
  Plus,
  Eye,
  Edit,
  UserPlus,
  Building,
  CheckCircle,
  Clock,
  AlertTriangle,
  Grid3X3,
  BarChart3,
  PieChart,
  DollarSign,
  Heart,
  Award,
  Bell,
  Search,
  Filter,
  Download,
  Upload,
  Printer,
  Share2,
  RefreshCw,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

// Professional Medical Navigation Component
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
      id: 'analytics', 
      icon: BarChart3, 
      label: 'Analytics', 
      color: 'bg-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    { 
      id: 'patients', 
      icon: Users, 
      label: 'Patients', 
      color: 'bg-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    { 
      id: 'staff', 
      icon: Stethoscope, 
      label: 'Staff', 
      color: 'bg-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
    { 
      id: 'services', 
      icon: Hospital, 
      label: 'Services', 
      color: 'bg-indigo-600',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600'
    },
    { 
      id: 'settings', 
      icon: Settings, 
      label: 'Settings', 
      color: 'bg-gray-600',
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-600'
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

const HospitalDashboard = ({ hospitaldata }) => {
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
      const sections = ['overview', 'analytics', 'patients', 'staff', 'services', 'settings'];
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

  // Calculate stats from hospital data
  const totalBeds = parseInt(hospitaldata.hspInfo?.totalnoofbed) || 0;
  const occupiedBeds = hospitaldata.Bed?.filter(bed => bed.status === 'ADMITTED' || bed.status === 'BOOKED').length || 0;
  const availableBeds = totalBeds - occupiedBeds;
  const totalDoctors = parseInt(hospitaldata.hspInfo?.totaldoctor) || 0;
  const pendingDoctors = hospitaldata.HospitalDoctor?.filter(hd => hd.status === 'PENDING').length || 0;
  const totalReviews = hospitaldata.reviews?.length || 0;
  const averageRating = totalReviews > 0 ? 
    (hospitaldata.reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1) : 0;
  
  const stats = {
    totalBeds,
    availableBeds,
    totalDoctors,
    pendingDoctors,
    activeBookings: hospitaldata.BedBooking?.length || 0,
    averageRating: parseFloat(averageRating),
    totalReviews,
    totalStaff: hospitaldata.staff?.length || 0,
    occupiedBeds,
    growthPercentage: totalReviews > 0 ? `+${Math.round((totalReviews / 10) * 100)}%` : "+0%" // Based on reviews growth
  };

  // Generate recent activities from hospital data
  const recentActivities = [];
  
  // Add recent bed bookings
  if (hospitaldata.BedBooking?.length > 0) {
    hospitaldata.BedBooking.slice(0, 3).forEach(booking => {
      recentActivities.push({
        type: "Bed Booking",
        patientName: `${booking.firstName || ''} ${booking.lastName || ''}`.trim() || "Patient",
        date: booking.Bookingdate || booking.createdAt,
        status: booking.status?.toLowerCase() || "pending"
      });
    });
  }
  
  // Add recent doctor registrations
  if (hospitaldata.HospitalDoctor?.length > 0) {
    hospitaldata.HospitalDoctor.slice(0, 2).forEach(hospitalDoctor => {
      recentActivities.push({
        type: "Doctor Registration",
        doctorName: hospitalDoctor.doctor ? 
          `Dr ${hospitalDoctor.doctor?.firstName || ''} ${hospitalDoctor.doctor?.lastName || ''}`.trim() : 
          "Doctor",
        date: hospitalDoctor.createdAt,
        status: hospitalDoctor.status?.toLowerCase() || "pending"
      });
    });
  }
  
  // Add recent reviews
  if (hospitaldata.reviews?.length > 0) {
    hospitaldata.reviews.slice(0, 2).forEach(review => {
      recentActivities.push({
        type: "Hospital Review",
        patientName: review.patient ? 
          `${review.patient.firstName || ''} ${review.patient.lastName || ''}`.trim() || "Patient" : 
          "Patient",
        date: review.createdAt,
        status: "completed",
        rating: review.rating
      });
    });
  }
  
  // Sort by date (most recent first) and limit to 5
  recentActivities.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  // Utility functions
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

  // Enhanced Components
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

  const StatCard = ({ title, value, icon: Icon, color, bgColor, textColor, subtitle, action }) => (
    <Card className={`rounded-xl border-0 shadow-md hover:shadow-lg transition-all duration-200 ${bgColor} group cursor-pointer`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className={`text-3xl font-bold ${textColor} mb-1`}>{value}</p>
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          </div>
          <div className={`p-3 rounded-xl ${color} group-hover:scale-105 transition-transform duration-200`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
        </div>
        {action && (
          <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {action}
          </div>
        )}
      </CardContent>
    </Card>
  );

  console.log("Hospital Data:", hospitaldata);
  console.log("Stats Data:", stats);
  console.log("Recent Activities Data:", recentActivities);

  return (
    <div className="bg-gray-50 min-h-screen font-sans relative">
      {/* Navigation Sidebar */}
      <NavigationSidebar 
        activeSection={activeSection} 
        onSectionChange={handleSectionChange} 
      />
      
      <div className="w-full max-w-7xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
        {/* Modern Hospital Header */}
        <div className="relative bg-white rounded-2xl mx-2 sm:mx-4 mt-4 overflow-hidden shadow-lg border border-gray-100">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"></div>
          <div className="absolute top-0 right-0 w-32 sm:w-48 lg:w-64 h-32 sm:h-48 lg:h-64 bg-gradient-to-bl from-blue-100/30 to-transparent rounded-full -translate-y-16 sm:-translate-y-24 lg:-translate-y-32 translate-x-16 sm:translate-x-24 lg:translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-24 sm:w-36 lg:w-48 h-24 sm:h-36 lg:h-48 bg-gradient-to-tr from-purple-100/30 to-transparent rounded-full translate-y-12 sm:translate-y-18 lg:translate-y-24 -translate-x-12 sm:-translate-x-18 lg:-translate-x-24"></div>
          
          <div className="relative z-10 p-4 sm:p-6 lg:p-8">
            {/* Hospital Header Content */}
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 lg:items-start">
              {/* Hospital Logo Section */}
              <div className="flex flex-col items-center lg:items-start flex-shrink-0">
                <div className="relative">
                  <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-2xl border-4 border-white shadow-xl overflow-hidden">
                    {hospitaldata.hspdetails?.hsplogo ? (
                      <img
                        className="w-full h-full object-cover"
                        src={hospitaldata.hspdetails.hsplogo}
                        alt="Hospital Logo"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                        <Hospital className="w-12 h-12 lg:w-16 lg:h-16 text-white" />
                      </div>
                    )}
                  </div>
                  {/* Status Indicator */}
                  <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center ${
                    hospitaldata.approvalStatus === 'APPROVED' ? 'bg-green-500' : 
                    hospitaldata.approvalStatus === 'PENDING' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}>
                    {hospitaldata.approvalStatus === 'APPROVED' ? 
                      <CheckCircle className="w-4 h-4 text-white" /> :
                      <Clock className="w-4 h-4 text-white" />
                    }
                  </div>
                </div>
                
                {/* Approval Status */}
                <div className="mt-4 text-center lg:text-left w-full lg:w-48">
                  <div className="text-sm text-gray-600 mb-2">Hospital Status</div>
                  <div className="space-y-3">
                    <div className="flex justify-center lg:justify-start">
                      <Badge className={`rounded-xl px-3 py-1 ${
                        hospitaldata.approvalStatus === 'APPROVED' ? 'bg-green-100 text-green-800' :
                        hospitaldata.approvalStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {formatText(hospitaldata.approvalStatus)}
                      </Badge>
                    </div>
                    {hospitaldata.approvalStatus !== 'APPROVED' && (
                      <div className="w-full">
                        <Link href="/hospital/dashboard/profile" className="block">
                          <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs px-3 py-2">
                            <Edit className="w-3 h-3 mr-1" />
                            Complete Registration
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Hospital Information */}
              <div className="flex-1">
                <div className="mb-6">
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                    {hospitaldata.hspInfo?.regname || 'Hospital Dashboard'}
                  </h1>
                  <p className="text-lg text-gray-600 mb-4">Hospital Management System</p>
                  
                  {/* Contact Information */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="flex items-center gap-3 p-3 bg-white/60 rounded-xl border border-white/50">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Phone className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Phone</div>
                        <div className="text-sm font-medium text-gray-900">{hospitaldata.mobile || "N/A"}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-white/60 rounded-xl border border-white/50">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Mail className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Email</div>
                        <div className="text-sm font-medium text-gray-900 truncate">{hospitaldata.email || "N/A"}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-white/60 rounded-xl border border-white/50">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <MapPin className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Location</div>
                        <div className="text-sm font-medium text-gray-900">{hospitaldata.hspcontact?.city || "N/A"}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-white/60 rounded-xl border border-white/50">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <Building className="w-4 h-4 text-red-600" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Type</div>
                        <div className="text-sm font-medium text-gray-900">{hospitaldata.role || "Hospital"}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="flex flex-wrap gap-3">
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200 rounded-lg px-3 py-1">
                    Registered {formatDate(hospitaldata.createdAt)}
                  </Badge>
                  {hospitaldata.hspInfo?.hspcategory?.length > 0 && (
                    <Badge className="bg-green-100 text-green-800 border-green-200 rounded-lg px-3py-1">
                      {hospitaldata.hspInfo.hspcategory[0]?.hspcategory?.title || 'Hospital'}
                    </Badge>
                  )}
                  {hospitaldata.hspInfo?.experience && (
                    <Badge className="bg-purple-100 text-purple-800 border-purple-200 rounded-lg px-3 py-1">
                      {hospitaldata.hspInfo.experience} Years Experience
                    </Badge>
                  )}
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
              Hospital Overview
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <StatCard
                title="Total Beds"
                value={stats.totalBeds}
                subtitle={`${stats.availableBeds} available`}
                icon={Bed}
                color="bg-blue-600"
                bgColor="bg-blue-50"
                textColor="text-blue-600"
                action={
                  <Link href="/hospital/dashboard/beds">
                    <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                      <Eye className="w-4 h-4 mr-1" />
                      Manage Beds
                    </Button>
                  </Link>
                }
              />
              <StatCard
                title="Doctors"
                value={stats.totalDoctors}
                subtitle={`${stats.pendingDoctors} pending approval`}
                icon={Stethoscope}
                color="bg-green-600"
                bgColor="bg-green-50"
                textColor="text-green-600"
                action={
                  <Link href="/hospital/dashboard/doctors">
                    <Button size="sm" className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg">
                      <UserPlus className="w-4 h-4 mr-1" />
                      Add Doctor
                    </Button>
                  </Link>
                }
              />
              <StatCard
                title="Active Bookings"
                value={stats.activeBookings}
                subtitle={`${hospitaldata.Bed?.filter(bed => bed.status === 'ADMITTED')?.length || 0} currently occupied`}
                icon={Calendar}
                color="bg-purple-600"
                bgColor="bg-purple-50"
                textColor="text-purple-600"
                action={
                  <Link href="/hospital/dashboard/bookings">
                    <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg">
                      <Eye className="w-4 h-4 mr-1" />
                      View Bookings
                    </Button>
                  </Link>
                }
              />
              <StatCard
                title="Average Rating"
                value={stats.averageRating || 0}
                subtitle={`${stats.totalReviews} reviews`}
                icon={Star}
                color="bg-yellow-600"
                bgColor="bg-yellow-50"
                textColor="text-yellow-600"
                action={
                  <Link href="/hospital/dashboard/reviews">
                    <Button size="sm" className="w-full bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg">
                      <Star className="w-4 h-4 mr-1" />
                      View Reviews
                    </Button>
                  </Link>
                }
              />
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
                    value="analytics" 
                    className="flex flex-col items-center gap-1 px-1 sm:px-2 py-3 data-[state=active]:bg-green-500 data-[state=active]:text-white data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-800 rounded-lg text-xs font-medium transition-all duration-200 min-h-[60px] justify-center"
                  >
                    <BarChart3 className="w-4 h-4 flex-shrink-0" />
                    <span className="text-xs leading-tight text-center">Analytics</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="patients" 
                    className="flex flex-col items-center gap-1 px-1 sm:px-2 py-3 data-[state=active]:bg-purple-500 data-[state=active]:text-white data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-800 rounded-lg text-xs font-medium transition-all duration-200 min-h-[60px] justify-center"
                  >
                    <Users className="w-4 h-4 flex-shrink-0" />
                    <span className="text-xs leading-tight text-center">Patients</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="staff" 
                    className="flex flex-col items-center gap-1 px-1 sm:px-2 py-3 data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-800 rounded-lg text-xs font-medium transition-all duration-200 min-h-[60px] justify-center"
                  >
                    <Stethoscope className="w-4 h-4 flex-shrink-0" />
                    <span className="text-xs leading-tight text-center">Staff</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="services" 
                    className="flex flex-col items-center gap-1 px-1 sm:px-2 py-3 data-[state=active]:bg-indigo-500 data-[state=active]:text-white data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-800 rounded-lg text-xs font-medium transition-all duration-200 min-h-[60px] justify-center"
                  >
                    <Hospital className="w-4 h-4 flex-shrink-0" />
                    <span className="text-xs leading-tight text-center">Services</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="settings" 
                    className="flex flex-col items-center gap-1 px-1 sm:px-2 py-3 data-[state=active]:bg-gray-500 data-[state=active]:text-white data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-800 rounded-lg text-xs font-medium transition-all duration-200 min-h-[60px] justify-center"
                  >
                    <Settings className="w-4 h-4 flex-shrink-0" />
                    <span className="text-xs leading-tight text-center">Settings</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="overview" id="overview" className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* Hospital Overview Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Activities */}
                  <InfoCard
                    title="Recent Activities"
                    icon={ClipboardList}
                    gradient="bg-gradient-to-br from-blue-50 to-indigo-50"
                  >
                    <div className="space-y-3">
                      {recentActivities.length > 0 ? (
                        recentActivities.slice(0, 4).map((activity, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-gray-100 rounded-lg">
                                {activity.type === 'Bed Booking' && <Bed className="w-4 h-4 text-blue-600" />}
                                {activity.type === 'Doctor Registration' && <Stethoscope className="w-4 h-4 text-green-600" />}
                                {activity.type === 'Hospital Review' && <Star className="w-4 h-4 text-yellow-600" />}
                              </div>
                              <div>
                                <p className="font-medium text-gray-800 text-sm">
                                  {activity.type}
                                  {activity.rating && (
                                    <span className="ml-2 text-yellow-500 text-xs">
                                      ⭐ {activity.rating}/5
                                    </span>
                                  )}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {activity.patientName || activity.doctorName} • {new Date(activity.date).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </p>
                              </div>
                            </div>
                            <Badge className={`rounded-lg text-xs ${
                              activity.status === 'approved' || activity.status === 'active' || activity.status === 'completed' ? 'bg-green-100 text-green-700' :
                              activity.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {formatText(activity.status)}
                            </Badge>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-6">
                          <ClipboardList className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                          <p className="text-sm text-gray-500">No recent activities</p>
                        </div>
                      )}
                      {recentActivities.length > 4 && (
                        <div className="text-center pt-2">
                          <Button variant="outline" size="sm" className="text-xs rounded-lg">
                            View All Activities
                          </Button>
                        </div>
                      )}
                    </div>
                  </InfoCard>

                  {/* Hospital Statistics */}
                  <InfoCard
                    title="Hospital Statistics"
                    icon={BarChart3}
                    gradient="bg-gradient-to-br from-green-50 to-emerald-50"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-white rounded-lg border">
                        <div className="text-2xl font-bold text-blue-600">{hospitaldata.HospitalDepartment?.length || 0}</div>
                        <div className="text-xs text-gray-600 mt-1">Departments</div>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg border">
                        <div className="text-2xl font-bold text-green-600">{hospitaldata.HospitalSpeciality?.length || 0}</div>
                        <div className="text-xs text-gray-600 mt-1">Specialities</div>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg border">
                        <div className="text-2xl font-bold text-purple-600">{hospitaldata.staff?.length || 0}</div>
                        <div className="text-xs text-gray-600 mt-1">Staff Members</div>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg border">
                        <div className="text-2xl font-bold text-red-600">{hospitaldata.HospitalAmbulance?.length || 0}</div>
                        <div className="text-xs text-gray-600 mt-1">Ambulances</div>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg border">
                        <div className="text-2xl font-bold text-orange-600">{hospitaldata.diagnosticServices?.length || 0}</div>
                        <div className="text-xs text-gray-600 mt-1">Diagnostic Services</div>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg border">
                        <div className="text-2xl font-bold text-indigo-600">{hospitaldata.Surgeytreatment?.length || 0}</div>
                        <div className="text-xs text-gray-600 mt-1">Surgery Treatments</div>
                      </div>
                    </div>
                  </InfoCard>
                </div>

                {/* Hospital Services */}
                <InfoCard
                  title="Available Services"
                  icon={Shield}
                  gradient="bg-gradient-to-br from-purple-50 to-pink-50"
                >
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {hospitaldata.hspInfo?.onlineconsultation === 'yes' && (
                      <div className="bg-white p-4 rounded-xl text-center border-2 border-blue-100 hover:border-blue-300 transition-colors group">
                        <div className="p-3 bg-blue-50 rounded-full w-fit mx-auto mb-3 group-hover:bg-blue-100 transition-colors">
                          <Users className="h-6 w-6 text-blue-600" />
                        </div>
                        <p className="text-sm font-semibold text-gray-800 mb-1">Online</p>
                        <p className="text-xs text-gray-600">Consultation</p>
                      </div>
                    )}
                    {hospitaldata.hspInfo?.homehealthcare === 'yes' && (
                      <div className="bg-white p-4 rounded-xl text-center border-2 border-green-100 hover:border-green-300 transition-colors group">
                        <div className="p-3 bg-green-50 rounded-full w-fit mx-auto mb-3 group-hover:bg-green-100 transition-colors">
                          <Activity className="h-6 w-6 text-green-600" />
                        </div>
                        <p className="text-sm font-semibold text-gray-800 mb-1">Home</p>
                        <p className="text-xs text-gray-600">Healthcare</p>
                      </div>
                    )}
                    {hospitaldata.hspInfo?.pharmacy === 'yes' && (
                      <div className="bg-white p-4 rounded-xl text-center border-2 border-purple-100 hover:border-purple-300 transition-colors group">
                        <div className="p-3 bg-purple-50 rounded-full w-fit mx-auto mb-3 group-hover:bg-purple-100 transition-colors">
                          <span className="text-2xl">💊</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-800 mb-1">Pharmacy</p>
                        <p className="text-xs text-gray-600">Services</p>
                      </div>
                    )}
                    {hospitaldata.hspInfo?.pathology === 'yes' && (
                      <div className="bg-white p-4 rounded-xl text-center border-2 border-red-100 hover:border-red-300 transition-colors group">
                        <div className="p-3 bg-red-50 rounded-full w-fit mx-auto mb-3 group-hover:bg-red-100 transition-colors">
                          <span className="text-2xl">🔬</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-800 mb-1">Pathology</p>
                        <p className="text-xs text-gray-600">Lab Tests</p>
                      </div>
                    )}
                    {hospitaldata.hspInfo?.diagnosticservices === 'yes' && (
                      <div className="bg-white p-4 rounded-xl text-center border-2 border-orange-100 hover:border-orange-300 transition-colors group">
                        <div className="p-3 bg-orange-50 rounded-full w-fit mx-auto mb-3 group-hover:bg-orange-100 transition-colors">
                          <span className="text-2xl">📊</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-800 mb-1">Diagnostic</p>
                        <p className="text-xs text-gray-600">Services</p>
                      </div>
                    )}
                    {hospitaldata.hspInfo?.inhousecanteen === 'yes' && (
                      <div className="bg-white p-4 rounded-xl text-center border-2 border-indigo-100 hover:border-indigo-300 transition-colors group">
                        <div className="p-3 bg-indigo-50 rounded-full w-fit mx-auto mb-3 group-hover:bg-indigo-100 transition-colors">
                          <span className="text-2xl">🍽️</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-800 mb-1">In-house</p>
                        <p className="text-xs text-gray-600">Canteen</p>
                      </div>
                    )}
                  </div>
                  {(!hospitaldata.hspInfo?.onlineconsultation && !hospitaldata.hspInfo?.homehealthcare && 
                    !hospitaldata.hspInfo?.pharmacy && !hospitaldata.hspInfo?.pathology && 
                    !hospitaldata.hspInfo?.diagnosticservices && !hospitaldata.hspInfo?.inhousecanteen) && (
                    <div className="text-center py-8">
                      <Shield className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-gray-500 text-sm">No services configured yet</p>
                    </div>
                  )}
                </InfoCard>

                {/* Hospital Status Summary */}
                <InfoCard
                  title="Hospital Status Summary"
                  icon={Hospital}
                  gradient="bg-gradient-to-br from-gray-50 to-slate-50"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Bed Management */}
                    <div className="bg-white p-4 rounded-xl border">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Bed className="w-5 h-5 text-blue-600" />
                        </div>
                        <h4 className="font-semibold text-gray-800">Bed Management</h4>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Total Beds</span>
                          <span className="font-semibold text-blue-600">{stats.totalBeds}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Available</span>
                          <span className="font-semibold text-green-600">{stats.availableBeds}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Occupied</span>
                          <span className="font-semibold text-orange-600">{stats.occupiedBeds}</span>
                        </div>
                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Occupancy Rate</span>
                            <span>{stats.totalBeds > 0 ? ((stats.occupiedBeds / stats.totalBeds) * 100).toFixed(1) : 0}%</span>
                          </div>
                          <Progress 
                            value={stats.totalBeds > 0 ? (stats.occupiedBeds / stats.totalBeds) * 100 : 0} 
                            className="h-2" 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Staff Overview */}
                    <div className="bg-white p-4 rounded-xl border">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Stethoscope className="w-5 h-5 text-green-600" />
                        </div>
                        <h4 className="font-semibold text-gray-800">Medical Staff</h4>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Total Doctors</span>
                          <span className="font-semibold text-green-600">{stats.totalDoctors}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Pending Approval</span>
                          <span className="font-semibold text-yellow-600">{stats.pendingDoctors}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Staff Members</span>
                          <span className="font-semibold text-purple-600">{stats.totalStaff}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Receptionists</span>
                          <span className="font-semibold text-indigo-600">{hospitaldata.Receptionist?.length || 0}</span>
                        </div>
                      </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className="bg-white p-4 rounded-xl border">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                          <Star className="w-5 h-5 text-yellow-600" />
                        </div>
                        <h4 className="font-semibold text-gray-800">Performance</h4>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Average Rating</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="font-semibold text-yellow-600">{stats.averageRating || 'N/A'}</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Total Reviews</span>
                          <span className="font-semibold text-blue-600">{stats.totalReviews}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Active Bookings</span>
                          <span className="font-semibold text-green-600">{stats.activeBookings}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Growth</span>
                          <span className="font-semibold text-purple-600">{stats.growthPercentage}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </InfoCard>
              </TabsContent>

              {/* Additional Tab Contents */}
              <TabsContent value="analytics" id="analytics" className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div className="text-center py-12">
                  <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">Analytics Dashboard</h3>
                  <p className="text-gray-500 mb-6">Detailed analytics and reporting features coming soon</p>
                  <Button className="rounded-xl">
                    <Download className="w-4 h-4 mr-2" />
                    Generate Basic Report
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="patients" id="patients" className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div className="text-center py-12">
                  <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">Patient Management</h3>
                  <p className="text-gray-500 mb-6">Patient records and management system</p>
                  <div className="flex gap-3 justify-center">
                    <Button className="rounded-xl">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Patient
                    </Button>
                    <Button variant="outline" className="rounded-xl">
                      <Search className="w-4 h-4 mr-2" />
                      Search Patients
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="staff" id="staff" className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div className="text-center py-12">
                  <Stethoscope className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">Staff Management</h3>
                  <p className="text-gray-500 mb-6">Manage doctors, nurses, and hospital staff</p>
                  <div className="flex gap-3 justify-center">
                    <Button className="rounded-xl">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add Staff Member
                    </Button>
                    <Button variant="outline" className="rounded-xl">
                      <Eye className="w-4 h-4 mr-2" />
                      View All Staff
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="services" id="services" className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div className="text-center py-12">
                  <Hospital className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">Hospital Services</h3>
                  <p className="text-gray-500 mb-6">Manage hospital services and facilities</p>
                  <div className="flex gap-3 justify-center">
                    <Button className="rounded-xl">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Service
                    </Button>
                    <Button variant="outline" className="rounded-xl">
                      <Settings className="w-4 h-4 mr-2" />
                      Service Settings
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="settings" id="settings" className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div className="text-center py-12">
                  <Settings className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">Hospital Settings</h3>
                  <p className="text-gray-500 mb-6">Configure hospital settings and preferences</p>
                  <div className="flex gap-3 justify-center">
                    <Button className="rounded-xl">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button variant="outline" className="rounded-xl">
                      <Settings className="w-4 h-4 mr-2" />
                      System Settings
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Government Schemes & Additional Info */}
          {hospitaldata.hspInfo?.governmentschemes && (
            <InfoCard
              title="Government Schemes"
              icon={Shield}
              gradient="bg-gradient-to-br from-green-50 to-emerald-50"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {hospitaldata.hspInfo.governmentschemes.split(',').map((scheme, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                    <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
                    <span className="text-sm text-gray-700 font-medium">{scheme.trim()}</span>
                  </div>
                ))}
              </div>
            </InfoCard>
          )}

          {/* Cashless Services */}
          {hospitaldata.hspInfo?.cashlessservices && (
            <InfoCard
              title="Cashless Services"
              icon={DollarSign}
              gradient="bg-gradient-to-br from-blue-50 to-cyan-50"
            >
              <div className="flex items-center gap-4 p-4 bg-white rounded-xl border">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <span className="text-2xl">💳</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Insurance Partner</h3>
                  <p className="text-gray-600">{hospitaldata.hspInfo.cashlessservices}</p>
                </div>
              </div>
            </InfoCard>
          )}
        </div>
      </div>
    </div>
  );
};

export default HospitalDashboard;