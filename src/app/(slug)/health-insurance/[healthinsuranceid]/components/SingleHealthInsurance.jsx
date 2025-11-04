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
  DollarSign,
  Info,
  MessageCircle,
  HelpCircle,
  Download,
  Eye,
  Globe
} from "lucide-react";
import { FaHospitalAlt } from "react-icons/fa";
import ReviewsDialog from "./reviews-dialog";
import CoverageList from "./CoverageList";

const HealthInsuranceSingleViewClient = ({ insurance, category, loggeduserId }) => {
  console.log("🚀 ~ Insurance Data:", insurance)
  
  const [activeTab, setActiveTab] = useState('overview');
  const [showCoverage, setShowCoverage] = useState(false);

  // Get reviews from insurance data
  const reviews = insurance?.reviews || [];
  console.log("🚀 ~ Insurance Reviews:", JSON.stringify(reviews, null, 2))
  
  // Calculate average rating from actual reviews
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length).toFixed(1) 
    : "4.2";
  const totalReviews = reviews.length || 129;

  const insuranceImages = [
    insurance?.logo,
    insurance?.image1,
    insurance?.image2,
    insurance?.image3,
  ].filter(Boolean);

  const images = insuranceImages.length > 0
    ? insuranceImages.length >= 6
      ? insuranceImages.slice(0, 6)
      : [...insuranceImages, ...insuranceImages, ...insuranceImages].slice(0, 6)
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

  return (
    <div key={insurance?.id || 'no-insurance'} className="w-full bg-gray-50 relative min-h-screen">
      {/* Desktop View - Show on large screens only */}
      <div className="hidden lg:block">
        {/* Clean Simple Header */}
        <div className="shadow-lg" style={{ background: '#3D85EF' }}>
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between gap-8">
              {/* Left Section - Logo & Basic Info */}
              <div className="flex items-center gap-5 flex-1">
                {insurance?.logo && (
                  <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-white/40 shadow-lg bg-white flex-shrink-0">
                    <Image
                      src={insurance.logo}
                      width={80}
                      height={80}
                      alt="Insurance Logo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-white mb-2">
                    {insurance?.companyName || "Health Insurance"}
                  </h1>
                  <div className="flex items-center gap-2 text-white/90 text-sm">
                    <Shield className="w-4 h-4" />
                    <span>
                      {insurance?.category === 'government' ? 'Government Insurance' : 
                       insurance?.category === 'private' ? 'Private Insurance' : 
                       insurance?.category === 'tpa' ? 'TPA Insurance' : 'Health Insurance'}
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
                    onClick={() => window.open(`tel:${insurance?.contactNumber || '108'}`, '_self')}
                    className="px-5 py-2.5 bg-white hover:bg-gray-100 text-blue-600 rounded-lg font-semibold text-sm flex items-center gap-2 shadow-lg transition-all"
                  >
                    <Phone className="w-4 h-4" />
                    Call Now
                  </button>
                  <button
                    onClick={() => alert("Request Quote feature coming soon!")}
                    className="px-5 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-lg font-semibold text-sm flex items-center gap-2 border border-white/40 transition-all"
                  >
                    <Shield className="w-4 h-4" />
                    Get Quote
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
                        alt="Insurance Main View"
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
                          alt={`Insurance Image ${index + 2}`}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-[400px] bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
                    <div className="text-center p-8">
                      <Shield className="w-24 h-24 text-blue-400 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-gray-700 mb-2">Health Insurance</h3>
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
                    { id: 'coverage', label: 'Coverage' },
                    { id: 'financial', label: 'Financial Details' },
                    { id: 'reviews', label: 'Reviews' },
                    { id: 'documents', label: 'Documents' },
                    { id: 'info', label: 'Info' },
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
                  onClick={() => alert("Request Quote feature coming soon!")}
                  className="w-full lg:w-auto mt-3 lg:mt-0 lg:ml-4 mb-3 lg:mb-0 lg:my-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold py-3 px-6 lg:px-8 rounded-lg transition-all transform hover:scale-110 shadow-xl border-2 border-blue-400 flex items-center justify-center gap-2 whitespace-nowrap text-sm animate-pulse"
                >
                  <Shield className="w-5 h-5" />
                  Get Quote Now
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
                      About {insurance?.companyName}
                    </h3>
                    <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-6">
                      {insurance?.companyName} offers comprehensive health insurance coverage with excellent benefits and customer service.
                      {insurance?.description && ` ${insurance.description}`}
                    </p>
                    <div className="mb-6 p-3 md:p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                          <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-blue-900 text-sm md:text-base">Policy Status</h4>
                          <p className="text-blue-700 text-xs md:text-sm break-words">
                            Policy: {insurance?.policyNumber || "Available"} | 
                            Type: {insurance?.category ? insurance.category.toUpperCase() : "ACTIVE"} | 
                            Status: <span className="font-semibold text-green-600">Active</span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                      {[
                        { icon: <Shield className="w-4 h-4 md:w-5 md:h-5" />, label: "Coverage", value: insurance?.coverage || "Available", color: "blue" },
                        { icon: <DollarSign className="w-4 h-4 md:w-5 md:h-5" />, label: "Copay", value: insurance?.copay ? `${insurance.copay}%` : "N/A", color: "green" },
                        { icon: <Building2 className="w-4 h-4 md:w-5 md:h-5" />, label: "Type", value: insurance?.category || "Insurance", color: "purple" },
                        { icon: <Calendar className="w-4 h-4 md:w-5 md:h-5" />, label: "Since", value: insurance?.createdAt ? getYear(insurance.createdAt) : "Active", color: "orange" },
                      ].map((stat, index) => (
                        <div key={index} className="bg-white p-3 md:p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-2 md:gap-3">
                            <div className="p-1.5 md:p-2 bg-blue-100 rounded-lg flex-shrink-0">
                              <div className="text-blue-600">{stat.icon}</div>
                            </div>
                            <div className="min-w-0">
                              <p className="text-lg md:text-2xl font-bold text-gray-900 truncate">{stat.value}</p>
                              <p className="text-xs md:text-sm text-gray-600">{stat.label}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* COVERAGE TAB */}
              {activeTab === 'coverage' && (
                <Card className="border border-gray-200 shadow-md rounded-xl">
                  <CardContent className="p-4 md:p-6">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Insurance Coverage</h3>
                    
                    {insurance?.coverage && (
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 md:p-6 border border-blue-200 mb-6">
                        <h4 className="text-lg md:text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <Shield className="h-5 w-5 text-blue-600" />
                          Coverage Details
                        </h4>
                        <p className="text-gray-700 text-sm md:text-base">{insurance.coverage}</p>
                      </div>
                    )}

                    {insurance?.facilities && (
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 md:p-6 border border-green-200 mb-6">
                        <h4 className="text-lg md:text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <Building2 className="h-5 w-5 text-green-600" />
                          Facilities Covered
                        </h4>
                        <p className="text-gray-700 text-sm md:text-base">{insurance.facilities}</p>
                      </div>
                    )}

                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                        <span className="text-gray-700">Comprehensive Medical Coverage</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-gray-700">Cashless Hospital Network</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-purple-600" />
                        <span className="text-gray-700">24/7 Customer Support</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* FINANCIAL TAB */}
              {activeTab === 'financial' && (
                <Card className="border border-gray-200 shadow-md rounded-xl">
                  <CardContent className="p-4 md:p-6">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Financial Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {insurance?.coverage && (
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <label className="text-sm font-medium text-gray-600">Coverage Amount</label>
                          <p className="text-green-700 font-bold text-lg">{insurance.coverage}</p>
                        </div>
                      )}
                      {insurance?.coverAmount && (
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <label className="text-sm font-medium text-gray-600">Cover Amount</label>
                          <p className="text-green-700 font-bold text-lg">₹{insurance.coverAmount}</p>
                        </div>
                      )}
                      {insurance?.startingAmount && (
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <label className="text-sm font-medium text-gray-600">Starting Premium</label>
                          <p className="text-blue-700 font-bold text-lg">₹{insurance.startingAmount}</p>
                        </div>
                      )}
                      {insurance?.copay && (
                        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                          <label className="text-sm font-medium text-gray-600">Copay</label>
                          <p className="text-orange-700 font-bold text-lg">{insurance.copay}%</p>
                        </div>
                      )}
                      {insurance?.discount && (
                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                          <label className="text-sm font-medium text-gray-600">Discount</label>
                          <p className="text-purple-700 font-bold text-lg">{insurance.discount}%</p>
                        </div>
                      )}
                      {insurance?.budgetRange && (
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <label className="text-sm font-medium text-gray-600">Budget Range</label>
                          <p className="text-gray-900 font-semibold">{insurance.budgetRange}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* REVIEWS TAB */}
              {activeTab === 'reviews' && (
                <Card className="border border-gray-200 shadow-md rounded-xl">
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h3>
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
                            const customerName = review.customerName || "Anonymous Customer";
                            const customerInitial = customerName.charAt(0).toUpperCase();
                            
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
                                      {customerInitial}
                                    </div>
                                    <div>
                                      <p className="font-semibold text-gray-900">{customerName}</p>
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
                                  {review.comment || "Great insurance coverage with excellent benefits."}
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
                        <p className="text-gray-400 text-sm mt-2">Be the first to review this insurance</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* DOCUMENTS TAB */}
              {activeTab === 'documents' && (
                <Card className="border border-gray-200 shadow-md rounded-xl">
                  <CardContent className="p-4 md:p-6">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Required Documents</h3>
                    
                    {insurance?.requiredDocs ? (
                      <div className="bg-orange-50 p-4 rounded-lg border border-orange-200 mb-6">
                        <h4 className="font-semibold text-orange-900 mb-2 flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          Document List
                        </h4>
                        <p className="text-gray-700">{insurance.requiredDocs}</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <span className="text-gray-700">Identity Proof (Aadhar/PAN)</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                          <FileText className="w-5 h-5 text-green-600" />
                          <span className="text-gray-700">Address Proof</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                          <FileText className="w-5 h-5 text-purple-600" />
                          <span className="text-gray-700">Medical Records (if applicable)</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                          <FileText className="w-5 h-5 text-orange-600" />
                          <span className="text-gray-700">Income Proof</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* INFO TAB */}
              {activeTab === 'info' && (
                <div className="space-y-4">
                  {/* Policy Information Card */}
                  <Card className="border border-gray-200 shadow-md rounded-xl">
                    <CardContent className="p-4">
                      <h3 className="text-base font-bold text-gray-900 mb-3">Policy Information</h3>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {insurance?.policyNumber && (
                          <div className="bg-gray-50 p-2 rounded">
                            <span className="text-gray-600">Policy Number:</span>
                            <p className="font-semibold text-gray-900 text-xs">{insurance.policyNumber}</p>
                          </div>
                        )}
                        {insurance?.insuranceType && (
                          <div className="bg-gray-50 p-2 rounded">
                            <span className="text-gray-600">Insurance Type:</span>
                            <p className="font-semibold text-gray-900 text-xs">{insurance.insuranceType}</p>
                          </div>
                        )}
                        {insurance?.insurancePackage && (
                          <div className="bg-gray-50 p-2 rounded">
                            <span className="text-gray-600">Package:</span>
                            <p className="font-semibold text-gray-900 text-xs">{insurance.insurancePackage}</p>
                          </div>
                        )}
                        <div className="bg-gray-50 p-2 rounded">
                          <span className="text-gray-600">Category:</span>
                          <p className="font-semibold text-gray-900 text-xs capitalize">{insurance?.category || "N/A"}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Complaints Card */}
                  {insurance?.complaints && (
                    <Card className="border border-gray-200 shadow-md rounded-xl">
                      <CardContent className="p-4">
                        <h3 className="text-base font-bold text-gray-900 mb-3">Complaints</h3>
                        <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                          <p className="text-gray-800 text-sm">{insurance.complaints}</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>

            {/* Right Column - Only 2 Essential Cards */}
            <div className="space-y-4 order-1 lg:order-2">
              {/* Policy Information Card */}
              <Card className="border border-gray-200 shadow-md rounded-xl">
                <CardContent className="p-4">
                  <h3 className="text-base font-bold text-gray-900 mb-3">Policy Information</h3>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {insurance?.policyNumber && (
                      <div className="bg-gray-50 p-2 rounded col-span-2">
                        <span className="text-gray-600">Policy Number:</span>
                        <p className="font-semibold text-gray-900 text-xs">{insurance.policyNumber}</p>
                      </div>
                    )}
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="text-gray-600">Type:</span>
                      <p className="font-semibold text-gray-900 text-xs capitalize">{insurance?.category || "N/A"}</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="text-gray-600">Status:</span>
                      <p className="font-semibold text-green-600 text-xs">Active</p>
                    </div>
                  </div>
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
                        <p className="font-semibold text-gray-900 text-sm truncate">{safeDisplay(insurance?.contactNumber)}</p>
                        <p className="text-xs text-gray-600">Customer Care</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                      <Mail className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 text-xs truncate">{safeDisplay(insurance?.email)}</p>
                        <p className="text-xs text-gray-600">Email</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Get Quote Card */}
              <Card className="border border-blue-200 shadow-md rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardContent className="p-4">
                  <h3 className="text-base font-bold text-gray-900 mb-3 text-center">Get Insurance Quote</h3>
                  
                  <button
                    onClick={() => alert("Request Quote feature coming soon!")}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold py-3 rounded-lg transition-all shadow-md text-sm flex items-center justify-center gap-2 mb-2"
                  >
                    <Shield className="w-4 h-4" />
                    Get Quote
                  </button>

                  <button
                    onClick={() => window.open(`tel:${insurance?.contactNumber || '108'}`, '_self')}
                    className="w-full border-2 border-blue-500 text-blue-600 hover:bg-blue-50 font-bold py-3 rounded-lg transition-all text-sm flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    Call Now
                  </button>
                </CardContent>
              </Card>

              {/* Additional Actions Card */}
              <Card className="border border-gray-200 shadow-md rounded-xl">
                <CardContent className="p-4">
                  <h3 className="text-base font-bold text-gray-900 mb-3">Quick Actions</h3>
                  <div className="space-y-2">
                    <button className="w-full flex items-center gap-2 p-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                      <Globe className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-700">Visit Website</span>
                    </button>
                    <button className="w-full flex items-center gap-2 p-2 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                      <Download className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-700">Download Brochure</span>
                    </button>
                    <button className="w-full flex items-center gap-2 p-2 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                      <Eye className="w-4 h-4 text-purple-600" />
                      <span className="text-sm text-gray-700">View Policy</span>
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

           {/* Our Services Section */}
           <div className="max-w-6xl mx-auto my-6">
            <Card className="border border-gray-100 shadow-xl rounded-2xl overflow-hidden transition-all hover:shadow-2xl">
              <CardContent className="p-0">
                 <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-4 px-4 text-center">
                   <h2 className="text-2xl font-bold text-white tracking-tight">
                     Insurance Benefits
                   </h2>
                   <p className="text-blue-100 mt-1 text-xs sm:text-sm">
                     Comprehensive health insurance coverage
                   </p>
                 </div>

                 <div className="p-4 sm:p-6 bg-gray-50">
                   <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
                     {[
                       { icon: <Shield className="w-5 h-5 text-blue-600" />, label: "Coverage", value: insurance?.coverage ? "Available" : "Yes", clickable: true, action: "coverage" },
                       { icon: <DollarSign className="w-5 h-5 text-green-600" />, label: "Cashless", value: "Available" },
                       { icon: <Building2 className="w-5 h-5 text-purple-600" />, label: "Network", value: "Pan India" },
                       { icon: <Heart className="w-5 h-5 text-red-600" />, label: "Health Check", value: "Free" },
                       { icon: <Award className="w-5 h-5 text-orange-600" />, label: "No Claim Bonus", value: "Yes" },
                       { icon: <Users className="w-5 h-5 text-cyan-600" />, label: "Family Cover", value: "Available" },
                       { icon: <FileText className="w-5 h-5 text-indigo-600" />, label: "Claims", value: "24/7" },
                       { icon: <Phone className="w-5 h-5 text-green-600" />, label: "Support", value: "24/7" },
                       { icon: <CheckCircle className="w-5 h-5 text-emerald-600" />, label: "Pre-existing", value: "Covered" },
                       { icon: <Star className="w-5 h-5 text-yellow-600" />, label: "Rating", value: `${avgRating} ★` },
                       { icon: <Calendar className="w-5 h-5 text-blue-600" />, label: "Renewal", value: "Lifetime" },
                       { icon: <Globe className="w-5 h-5 text-purple-600" />, label: "Coverage", value: "Worldwide" },
                     ].map((item, idx) => (
                       <div
                         key={idx}
                         onClick={() => {
                           if (item.clickable && item.action === "coverage") {
                             setShowCoverage(true);
                           }
                         }}
                         className={`bg-white p-2 sm:p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all text-center flex flex-col items-center justify-center min-h-[85px] sm:min-h-[95px] ${
                           item.clickable ? 'cursor-pointer hover:border-blue-400 hover:bg-blue-50' : ''
                         }`}
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
            {insurance?.logo && (
              <div className="w-14 h-14 rounded-lg overflow-hidden border-2 border-white/40 shadow-md bg-white flex-shrink-0">
                <Image
                  src={insurance.logo}
                  width={56}
                  height={56}
                  alt="Insurance Logo"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-white line-clamp-2 mb-1">
                {insurance?.companyName || "Health Insurance"}
              </h1>
              <div className="flex items-center gap-1.5 text-white/90 text-xs">
                <Shield className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">
                  {insurance?.category === 'government' ? 'Government' : 
                   insurance?.category === 'private' ? 'Private' : 
                   insurance?.category === 'tpa' ? 'TPA' : 'Insurance'}
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
                    alt="Insurance Main View"
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
                          alt={`Insurance Image ${index + 2}`}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="h-48 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center rounded-xl">
                <div className="text-center p-6">
                  <Shield className="w-16 h-16 text-blue-400 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-gray-700 mb-1">Health Insurance</h3>
                  <p className="text-gray-500 text-sm">Images will be available soon</p>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => alert("Request Quote feature coming soon!")}
              className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-md text-sm md:text-base flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4 md:w-5 md:h-5" />
              GET QUOTE
            </button>
            <button
              onClick={() => {
                const phone = insurance?.contactNumber;
                if (phone) {
                  window.open(`tel:${phone}`, '_self');
                } else {
                  alert('Contact number not available');
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
                { id: 'coverage', label: 'Coverage' },
                { id: 'financial', label: 'Financial' },
                { id: 'reviews', label: 'Reviews' },
                { id: 'documents', label: 'Docs' },
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
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3">About {insurance?.companyName}</h3>
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">
                    {insurance?.companyName} offers comprehensive health insurance coverage with excellent benefits and customer service.
                    {insurance?.description && ` ${insurance.description}`}
                  </p>
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-blue-900 text-sm">Policy Status</h4>
                        <p className="text-blue-700 text-xs break-words">
                          Policy: {insurance?.policyNumber || "Available"} | 
                          Type: {insurance?.category ? insurance.category.toUpperCase() : "ACTIVE"} | 
                          Status: <span className="font-semibold text-green-600">Active</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { icon: <Shield className="w-4 h-4" />, label: "Coverage", value: insurance?.coverage || "Available" },
                      { icon: <DollarSign className="w-4 h-4" />, label: "Copay", value: insurance?.copay ? `${insurance.copay}%` : "N/A" },
                      { icon: <Building2 className="w-4 h-4" />, label: "Type", value: insurance?.category || "Insurance" },
                      { icon: <Calendar className="w-4 h-4" />, label: "Since", value: insurance?.createdAt ? getYear(insurance.createdAt) : "Active" },
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

            {/* COVERAGE TAB */}
            {activeTab === 'coverage' && (
              <Card className="border border-gray-200 shadow-sm rounded-xl">
                <CardContent className="p-4">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Insurance Coverage</h3>
                  
                  {insurance?.coverage && (
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200 mb-4">
                      <h4 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <Shield className="h-4 w-4 text-blue-600" />
                        Coverage Details
                      </h4>
                      <p className="text-gray-700 text-sm">{insurance.coverage}</p>
                    </div>
                  )}

                  {insurance?.facilities && (
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200 mb-4">
                      <h4 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-green-600" />
                        Facilities Covered
                      </h4>
                      <p className="text-gray-700 text-sm">{insurance.facilities}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-700 text-sm">Comprehensive Medical Coverage</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-gray-700 text-sm">Cashless Hospital Network</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-purple-600" />
                      <span className="text-gray-700 text-sm">24/7 Customer Support</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* FINANCIAL TAB */}
            {activeTab === 'financial' && (
              <Card className="border border-gray-200 shadow-sm rounded-xl">
                <CardContent className="p-4">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Financial Details</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {insurance?.coverage && (
                      <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                        <label className="text-xs font-medium text-gray-600">Coverage Amount</label>
                        <p className="text-green-700 font-bold text-sm">{insurance.coverage}</p>
                      </div>
                    )}
                    {insurance?.coverAmount && (
                      <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                        <label className="text-xs font-medium text-gray-600">Cover Amount</label>
                        <p className="text-green-700 font-bold text-sm">₹{insurance.coverAmount}</p>
                      </div>
                    )}
                    {insurance?.startingAmount && (
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <label className="text-xs font-medium text-gray-600">Starting Premium</label>
                        <p className="text-blue-700 font-bold text-sm">₹{insurance.startingAmount}</p>
                      </div>
                    )}
                    {insurance?.copay && (
                      <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                        <label className="text-xs font-medium text-gray-600">Copay</label>
                        <p className="text-orange-700 font-bold text-sm">{insurance.copay}%</p>
                      </div>
                    )}
                    {insurance?.discount && (
                      <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                        <label className="text-xs font-medium text-gray-600">Discount</label>
                        <p className="text-purple-700 font-bold text-sm">{insurance.discount}%</p>
                      </div>
                    )}
                    {insurance?.budgetRange && (
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 col-span-2">
                        <label className="text-xs font-medium text-gray-600">Budget Range</label>
                        <p className="text-gray-900 font-semibold text-sm">{insurance.budgetRange}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* REVIEWS TAB */}
            {activeTab === 'reviews' && (
              <Card className="border border-gray-200 shadow-sm rounded-xl">
                <CardContent className="p-4">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Customer Reviews</h3>
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
                          const customerName = review.customerName || "Anonymous Customer";
                          const customerInitial = customerName.charAt(0).toUpperCase();
                          
                          const bgColors = [
                            "from-blue-50 to-indigo-50 border-blue-200",
                            "from-green-50 to-emerald-50 border-green-200",
                            "from-purple-50 to-pink-50 border-purple-200"
                          ];
                          
                          return (
                            <div key={review.id || index} className={`bg-gradient-to-r ${bgColors[index % 3]} p-4 rounded-lg border`}>
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-xs">
                                    {customerInitial}
                                  </div>
                                  <div>
                                    <p className="font-semibold text-gray-900 text-sm">{customerName}</p>
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
                                {review.comment || "Great insurance coverage with excellent benefits."}
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
                      <p className="text-gray-400 text-xs mt-1">Be the first to review this insurance</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* DOCUMENTS TAB */}
            {activeTab === 'documents' && (
              <Card className="border border-gray-200 shadow-sm rounded-xl">
                <CardContent className="p-4">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Required Documents</h3>
                  
                  {insurance?.requiredDocs ? (
                    <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 mb-4">
                      <h4 className="font-semibold text-orange-900 mb-2 flex items-center gap-2 text-sm">
                        <FileText className="h-4 w-4" />
                        Document List
                      </h4>
                      <p className="text-gray-700 text-sm">{insurance.requiredDocs}</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span className="text-gray-700 text-sm">Identity Proof (Aadhar/PAN)</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                        <FileText className="w-4 h-4 text-green-600" />
                        <span className="text-gray-700 text-sm">Address Proof</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                        <FileText className="w-4 h-4 text-purple-600" />
                        <span className="text-gray-700 text-sm">Medical Records (if applicable)</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                        <FileText className="w-4 h-4 text-orange-600" />
                        <span className="text-gray-700 text-sm">Income Proof</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* INFO TAB */}
            {activeTab === 'info' && (
              <div className="space-y-3">
                {/* Policy Information Card */}
                <Card className="border border-gray-200 shadow-sm rounded-xl">
                  <CardContent className="p-4">
                    <h3 className="text-base font-bold text-gray-900 mb-3">Policy Information</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {insurance?.policyNumber && (
                        <div className="bg-gray-50 p-2 rounded col-span-2">
                          <span className="text-gray-600 text-xs block mb-0.5">Policy Number:</span>
                          <p className="font-semibold text-gray-900 text-xs break-words">{insurance.policyNumber}</p>
                        </div>
                      )}
                      {insurance?.insuranceType && (
                        <div className="bg-gray-50 p-2 rounded">
                          <span className="text-gray-600 text-xs block mb-0.5">Insurance Type:</span>
                          <p className="font-semibold text-gray-900 text-xs">{insurance.insuranceType}</p>
                        </div>
                      )}
                      {insurance?.insurancePackage && (
                        <div className="bg-gray-50 p-2 rounded">
                          <span className="text-gray-600 text-xs block mb-0.5">Package:</span>
                          <p className="font-semibold text-gray-900 text-xs">{insurance.insurancePackage}</p>
                        </div>
                      )}
                      <div className="bg-gray-50 p-2 rounded">
                        <span className="text-gray-600 text-xs block mb-0.5">Category:</span>
                        <p className="font-semibold text-gray-900 text-xs capitalize">{insurance?.category || "N/A"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Complaints Card */}
                {insurance?.complaints && (
                  <Card className="border border-gray-200 shadow-sm rounded-xl">
                    <CardContent className="p-4">
                      <h3 className="text-base font-bold text-gray-900 mb-3">Complaints</h3>
                      <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                        <p className="text-gray-800 text-sm">{insurance.complaints}</p>
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
                <h2 className="text-lg font-bold text-white text-center">Insurance Benefits</h2>
                <p className="text-blue-100 text-center text-xs mt-0.5">
                  Comprehensive health insurance coverage
                </p>
              </div>
              <div className="p-3">
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { icon: <Shield className="w-4 h-4 text-blue-600" />, label: "Coverage", value: insurance?.coverage ? "Available" : "Yes", clickable: true, action: "coverage" },
                    { icon: <DollarSign className="w-4 h-4 text-green-600" />, label: "Cashless", value: "Available" },
                    { icon: <Building2 className="w-4 h-4 text-purple-600" />, label: "Network", value: "Pan India" },
                    { icon: <Heart className="w-4 h-4 text-red-600" />, label: "Health Check", value: "Free" },
                    { icon: <Award className="w-4 h-4 text-orange-600" />, label: "No Claim Bonus", value: "Yes" },
                    { icon: <Users className="w-4 h-4 text-cyan-600" />, label: "Family Cover", value: "Available" },
                    { icon: <FileText className="w-4 h-4 text-indigo-600" />, label: "Claims", value: "24/7" },
                    { icon: <Phone className="w-4 h-4 text-green-600" />, label: "Support", value: "24/7" },
                    { icon: <CheckCircle className="w-4 h-4 text-emerald-600" />, label: "Pre-existing", value: "Covered" },
                    { icon: <Star className="w-4 h-4 text-yellow-600" />, label: "Rating", value: `${avgRating} ★` },
                    { icon: <Calendar className="w-4 h-4 text-blue-600" />, label: "Renewal", value: "Lifetime" },
                    { icon: <Globe className="w-4 h-4 text-purple-600" />, label: "Coverage", value: "Worldwide" },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        if (item.clickable && item.action === "coverage") {
                          setShowCoverage(true);
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

          {/* Mobile Quick Actions */}
          <Card className="border border-gray-200 shadow-md rounded-xl">
            <CardContent className="p-4">
              <h3 className="text-base font-bold text-gray-900 mb-3">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                <button className="flex items-center gap-2 p-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                  <Globe className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-700">Website</span>
                </button>
                <button className="flex items-center gap-2 p-2 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                  <Download className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-700">Brochure</span>
                </button>
                <button className="flex items-center gap-2 p-2 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                  <Eye className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-gray-700">Policy</span>
                </button>
                <button className="flex items-center gap-2 p-2 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
                  <Mail className="w-4 h-4 text-orange-600" />
                  <span className="text-sm text-gray-700">Email</span>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Coverage List Modal */}
      {showCoverage && (
        <CoverageList
          onClose={() => setShowCoverage(false)}
          insuranceService={insurance}
          serviceName={insurance?.companyName}
        />
      )}
    </div>
  );
};

export default HealthInsuranceSingleViewClient;