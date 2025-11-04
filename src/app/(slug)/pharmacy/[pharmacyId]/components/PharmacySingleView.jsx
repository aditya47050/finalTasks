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
  Pill,
  Truck,
  Package,
  ShoppingCart
} from "lucide-react";
import { FaHospitalAlt } from "react-icons/fa";
import { MdLocalPharmacy } from "react-icons/md";
import { useRouter } from "next/navigation";

const PharmacySingleView = ({ pharmacyData, customerId }) => {
  console.log("🚀 ~ Pharmacy Data:", pharmacyData)
  
  const [activeTab, setActiveTab] = useState('overview');
  const router = useRouter();

  // Get reviews from pharmacy data
  const reviews = pharmacyData?.PharmacyReview || pharmacyData?.reviews || [];
  console.log("🚀 ~ Pharmacy Reviews:", JSON.stringify(reviews, null, 2))
  
  // Calculate average rating from actual reviews
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length).toFixed(1) 
    : "4.8";
  const totalReviews = reviews.length || 1200;

  const pharmacyImages = [
    pharmacyData?.pharmacylogo,
    pharmacyData?.regcertificate,
    pharmacyData?.cancelledCheque,
    pharmacyData?.pharmacypancarddoc,
  ].filter(Boolean);

  const images = pharmacyImages.length > 0
    ? pharmacyImages.length >= 6
      ? pharmacyImages.slice(0, 6)
      : [...pharmacyImages, ...pharmacyImages, ...pharmacyImages].slice(0, 6)
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
    <div key={pharmacyData?.id || 'no-pharmacy'} className="w-full bg-gray-50 relative min-h-screen">
      {/* Desktop View - Show on large screens only */}
      <div className="hidden lg:block">
        {/* Clean Simple Header */}
        <div className="shadow-lg" style={{ background: '#3D85EF' }}>
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between gap-8">
              {/* Left Section - Logo & Basic Info */}
              <div className="flex items-center gap-5 flex-1">
                {pharmacyData?.pharmacylogo && (
                  <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-white/40 shadow-lg bg-white flex-shrink-0">
                    <Image
                      src={pharmacyData.pharmacylogo}
                      width={80}
                      height={80}
                      alt="Pharmacy Logo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-white mb-2">
                    {pharmacyData?.regname || "Pharmacy"}
                  </h1>
                  <div className="flex items-center gap-2 text-white/90 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {safeDisplay(pharmacyData?.city, "City")}, {safeDisplay(pharmacyData?.state, "State")}
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
                    onClick={() => window.open(`tel:${pharmacyData?.mobile || ''}`, '_self')}
                    className="px-5 py-2.5 bg-white hover:bg-gray-100 text-blue-600 rounded-lg font-semibold text-sm flex items-center gap-2 shadow-lg transition-all"
                  >
                    <Phone className="w-4 h-4" />
                    Call Now
                  </button>
                  <button
                    onClick={() => router.push(`/pharmacy/${pharmacyData?.id}/products`)}
                    className="px-5 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-lg font-semibold text-sm flex items-center gap-2 border border-white/40 transition-all"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Order Now
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
                        alt="Pharmacy Main View"
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
                          alt={`Pharmacy Image ${index + 2}`}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-[400px] bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
                    <div className="text-center p-8">
                      <MdLocalPharmacy className="w-24 h-24 text-blue-400 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-gray-700 mb-2">Pharmacy</h3>
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
                    { id: 'products', label: 'Products' },
                    { id: 'services', label: 'Services' },
                    { id: 'pharmacists', label: 'Pharmacists' },
                    { id: 'reviews', label: 'Reviews' },
                    { id: 'contact', label: 'Contact' },
                    { id: 'info', label: 'Pharmacy Info' },
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
                  onClick={() => router.push(`/pharmacy/${pharmacyData?.id}/products`)}
                  className="w-full lg:w-auto mt-3 lg:mt-0 lg:ml-4 mb-3 lg:mb-0 lg:my-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold py-3 px-6 lg:px-8 rounded-lg transition-all transform hover:scale-110 shadow-xl border-2 border-blue-400 flex items-center justify-center gap-2 whitespace-nowrap text-sm animate-pulse"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Order Medicines
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
                      About {pharmacyData?.regname}
                    </h3>
                    <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-6">
                      {pharmacyData?.aboutus || `${pharmacyData?.regname} is a trusted pharmacy providing quality medicines and healthcare products. 
                      Located in ${safeDisplay(pharmacyData?.city, "your area")}, ${safeDisplay(pharmacyData?.state, "")}, we are committed to
                      your health and wellness with ${pharmacyData?.TotalregPharmacist || "expert"} registered pharmacists and wide range of medicines.`}
                    </p>
                    <div className="mb-6 p-3 md:p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                          <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-blue-900 text-sm md:text-base">Pharmacy Status</h4>
                          <p className="text-blue-700 text-xs md:text-sm break-words">
                            Registration: {pharmacyData?.regno || "N/A"} | 
                            Type: {pharmacyData?.pharmacytype || "Retail Pharmacy"} | 
                            Status: <span className="font-semibold text-green-600">Active & Verified</span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                      {[
                        { icon: <Pill className="w-4 h-4 md:w-5 md:h-5" />, label: "Products", value: pharmacyData?.Product?.length || "500+", color: "blue" },
                        { icon: <Users className="w-4 h-4 md:w-5 md:h-5" />, label: "Pharmacists", value: pharmacyData?.TotalregPharmacist || "N/A", color: "green" },
                        { icon: <Truck className="w-4 h-4 md:w-5 md:h-5" />, label: "Home Delivery", value: pharmacyData?.homedelivery ? "Yes" : "No", color: "purple" },
                        { icon: <Clock className="w-4 h-4 md:w-5 md:h-5" />, label: "Service Time", value: pharmacyData?.servicetimeinday || "24/7", color: "orange" },
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

              {/* PRODUCTS TAB */}
              {activeTab === 'products' && (
                <Card className="border border-gray-200 shadow-md rounded-xl">
                  <CardContent className="p-4 md:p-6">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Featured Products</h3>
                    
                    {pharmacyData?.Product && pharmacyData.Product.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {pharmacyData.Product.slice(0, 6).map((product) => (
                          <div key={product.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex gap-4">
                              {product.productImage ? (
                                <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                                  <Image
                                    src={product.productImage}
                                    fill
                                    alt={product.name}
                                    className="object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="w-20 h-20 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <Pill className="w-8 h-8 text-blue-400" />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">{product.name}</h4>
                                {product.brand && (
                                  <p className="text-xs text-blue-600 mb-2">{product.brand}</p>
                                )}
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-lg font-bold text-blue-600">₹{product.discountedPrice || product.price}</p>
                                    {product.discountedPrice && product.discountedPrice < product.price && (
                                      <p className="text-xs text-gray-500 line-through">₹{product.price}</p>
                                    )}
                                  </div>
                                  <Badge className={product.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                                    {product.stock > 0 ? "In Stock" : "Out of Stock"}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Pill className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No products available</p>
                        <p className="text-gray-500 text-sm mt-2">Products will be listed soon</p>
                      </div>
                    )}
                    
                    {pharmacyData?.Product && pharmacyData.Product.length > 0 && (
                      <button
                        onClick={() => router.push(`/pharmacy/${pharmacyData.id}/products`)}
                        className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
                      >
                        View All Products
                      </button>
                    )}
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
                        { label: "24/7 Pharmacy", value: "Yes", icon: <Clock className="w-5 h-5" />, desc: "Round-the-clock medicine availability" },
                        { label: "Home Delivery", value: pharmacyData?.homedelivery ? "yes" : "no", icon: <Truck className="w-5 h-5" />, desc: "Free home delivery service" },
                        { label: "Online Ordering", value: pharmacyData?.onlineplotformservice ? "yes" : "no", icon: <ShoppingCart className="w-5 h-5" />, desc: "Order medicines online" },
                        { label: "Prescription Service", value: "yes", icon: <FileText className="w-5 h-5" />, desc: "Expert prescription consultation" },
                        { label: "Generic Medicines", value: "yes", icon: <Pill className="w-5 h-5" />, desc: "Affordable generic options" },
                        { label: "Medical Supplies", value: "yes", icon: <Package className="w-5 h-5" />, desc: "Healthcare equipment & supplies" },
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

              {/* PHARMACISTS TAB */}
              {activeTab === 'pharmacists' && (
                <>
                  {pharmacyData?.Pharmacist && pharmacyData.Pharmacist.length > 0 ? (
                    <Card className="border border-gray-200 shadow-md rounded-xl">
                      <CardContent className="p-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Pharmacists</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          {pharmacyData.Pharmacist.map((pharmacist) => (
                            <div key={pharmacist.id} className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200 hover:shadow-md transition-shadow">
                              <div className="flex items-center gap-3">
                                {pharmacist.profilepic ? (
                                  <Image
                                    src={pharmacist.profilepic}
                                    width={60}
                                    height={60}
                                    alt={pharmacist.fullname}
                                    className="rounded-full w-15 h-15 object-cover"
                                  />
                                ) : (
                                  <div className="w-15 h-15 bg-blue-100 rounded-full flex items-center justify-center">
                                    <Users className="w-8 h-8 text-blue-600" />
                                  </div>
                                )}
                                <div className="flex-1">
                                  <h4 className="text-gray-900 font-semibold">
                                    {pharmacist.fullname}
                                  </h4>
                                  <p className="text-gray-600 text-sm">Registered Pharmacist</p>
                                  <p className="text-blue-600 text-xs">{pharmacist.regno}</p>
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
                                {pharmacyData.Pharmacist.length} Registered Pharmacist{pharmacyData.Pharmacist.length > 1 ? 's' : ''}
                              </p>
                              <p className="text-blue-700 text-sm">
                                Professional consultation available
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="border border-gray-200 shadow-md rounded-xl">
                      <CardContent className="p-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Pharmacists</h3>
                        <div className="text-center py-8">
                          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600">
                            Total Pharmacists: {pharmacyData?.TotalregPharmacist || "N/A"}
                          </p>
                          <p className="text-gray-500 text-sm mt-2">Pharmacist details will be available soon</p>
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
                            const customerName = review.customer?.firstName 
                              ? `${review.customer.firstName} ${review.customer.lastName || ''}`.trim()
                              : review.customerName || "Anonymous Customer";
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
                                  {review.comment || "Great pharmacy with excellent service and quality medicines."}
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
                        <p className="text-gray-400 text-sm mt-2">Be the first to review this pharmacy</p>
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
                          <p className="text-gray-900 font-medium">{safeDisplay(pharmacyData?.mobile)}</p>
                          {pharmacyData?.alternatemobile && (
                            <p className="text-gray-700 text-sm mt-1">Alternate: {pharmacyData.alternatemobile}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                        <Mail className="w-6 h-6 text-green-600 mt-1" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-green-900 mb-1">Email Addresses</h4>
                          <p className="text-gray-900 font-medium text-sm break-words">{safeDisplay(pharmacyData?.email)}</p>
                          {pharmacyData?.secondaryemail && (
                            <p className="text-gray-700 text-sm mt-1 break-words">Secondary: {pharmacyData.secondaryemail}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <MapPin className="w-6 h-6 text-purple-600 mt-1" />
                        <div>
                          <h4 className="font-semibold text-purple-900 mb-1">Pharmacy Address</h4>
                          <p className="text-gray-900 font-medium leading-relaxed">
                            {safeDisplay(pharmacyData?.fulladdress)}
                          </p>
                          <p className="text-gray-700 mt-2">
                            {pharmacyData?.city}, {pharmacyData?.state}
                          </p>
                          <p className="text-gray-700">
                            Pincode: {pharmacyData?.pincode}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                        <Clock className="w-6 h-6 text-orange-600 mt-1" />
                        <div>
                          <h4 className="font-semibold text-orange-900 mb-1">Working Hours</h4>
                          <p className="text-gray-900 font-medium">{pharmacyData?.servicetimeinday || "24/7 Service"}</p>
                          <p className="text-gray-700 text-sm mt-1">{pharmacyData?.servicetimeinweek || "Monday - Sunday"}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* PHARMACY INFO TAB */}
              {activeTab === 'info' && (
                <div className="space-y-4">
                  {/* Pharmacy Information Card */}
                  <Card className="border border-gray-200 shadow-md rounded-xl">
                    <CardContent className="p-4">
                      <h3 className="text-base font-bold text-gray-900 mb-3">Pharmacy Information</h3>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-gray-50 p-2 rounded">
                          <span className="text-gray-600">Registration No:</span>
                          <p className="font-semibold text-gray-900 text-xs">{pharmacyData?.regno || "N/A"}</p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <span className="text-gray-600">Type:</span>
                          <p className="font-semibold text-gray-900 text-xs">{pharmacyData?.pharmacytype || "N/A"}</p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <span className="text-gray-600">PAN Card:</span>
                          <p className="font-semibold text-gray-900 text-xs">{pharmacyData?.pharmacypancardno || "N/A"}</p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <span className="text-gray-600">Status:</span>
                          <p className="font-semibold text-green-600 text-xs">Active</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Branches Card */}
                  {pharmacyData?.pharmacybranch && pharmacyData.pharmacybranch.length > 0 && (
                    <Card className="border border-gray-200 shadow-md rounded-xl">
                      <CardContent className="p-4">
                        <h3 className="text-base font-bold text-gray-900 mb-3">Branch Locations</h3>
                        <div className="space-y-2">
                          {pharmacyData.pharmacybranch.map((branch, index) => (
                            <div key={branch.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                              <h4 className="font-semibold text-gray-900 text-sm mb-1">{branch.regname || `Branch ${index + 1}`}</h4>
                              <p className="text-xs text-gray-600">{branch.address}, {branch.city}</p>
                              <p className="text-xs text-blue-600">{branch.receptionno1}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>

            {/* Right Column - Only 2 Essential Cards */}
            <div className="space-y-4 order-1 lg:order-2">
              {/* Pharmacy Information Card */}
              <Card className="border border-gray-200 shadow-md rounded-xl">
                <CardContent className="p-4">
                  <h3 className="text-base font-bold text-gray-900 mb-3">Pharmacy Information</h3>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="text-gray-600">Registration No:</span>
                      <p className="font-semibold text-gray-900 text-xs">{pharmacyData?.regno || "N/A"}</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="text-gray-600">Type:</span>
                      <p className="font-semibold text-gray-900 text-xs">{pharmacyData?.pharmacytype || "N/A"}</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="text-gray-600">Pharmacists:</span>
                      <p className="font-semibold text-gray-900 text-xs">{pharmacyData?.TotalregPharmacist || "N/A"}</p>
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
                        <p className="font-semibold text-gray-900 text-sm truncate">{safeDisplay(pharmacyData?.mobile)}</p>
                        <p className="text-xs text-gray-600">Primary</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                      <Mail className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 text-xs truncate">{safeDisplay(pharmacyData?.email)}</p>
                        <p className="text-xs text-gray-600">Email</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 p-2 bg-purple-50 rounded-lg">
                      <MapPin className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 text-xs line-clamp-2">
                          {safeDisplay(pharmacyData?.fulladdress)}
                        </p>
                        <p className="text-xs text-gray-600 truncate">{safeDisplay(pharmacyData?.city, "City")}, {safeDisplay(pharmacyData?.state, "State")}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

           {/* Our Services Section - Professional & Enhanced */}
           <div className="max-w-6xl mx-auto my-6">
            <Card className="border border-gray-100 shadow-xl rounded-2xl overflow-hidden transition-all hover:shadow-2xl">
              <CardContent className="p-0">
                 <div className="bg-gradient-to-r from-blue-700 to-indigo-700 py-4 px-4 text-center">
                   <h2 className="text-2xl font-bold text-white tracking-tight">
                     Our Services
                   </h2>
                   <p className="text-blue-100 mt-1 text-xs sm:text-sm">
                     Comprehensive pharmacy services for all your needs
                   </p>
                 </div>

                 <div className="p-4 sm:p-6 bg-gray-50">
                   <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
                     {[
                       { icon: <MdLocalPharmacy className="w-5 h-5 text-blue-600" />, label: "24/7 Pharmacy", value: "Available" },
                       { icon: <Pill className="w-5 h-5 text-green-600" />, label: "Medicines", value: pharmacyData?.Product?.length || "500+" },
                       { icon: <Truck className="w-5 h-5 text-orange-600" />, label: "Home Delivery", value: pharmacyData?.homedelivery ? "Yes" : "No" },
                       { icon: <ShoppingCart className="w-5 h-5 text-purple-600" />, label: "Online Order", value: pharmacyData?.onlineplotformservice ? "Yes" : "Available" },
                       { icon: <Users className="w-5 h-5 text-cyan-600" />, label: "Pharmacists", value: pharmacyData?.TotalregPharmacist || "Expert" },
                       { icon: <Shield className="w-5 h-5 text-indigo-600" />, label: "Quality", value: "Assured" },
                       { icon: <FileText className="w-5 h-5 text-red-600" />, label: "Prescription", value: "Service" },
                       { icon: <Package className="w-5 h-5 text-teal-600" />, label: "Medical Supplies", value: "Available" },
                       { icon: <Clock className="w-5 h-5 text-orange-600" />, label: "Service Time", value: pharmacyData?.servicetimeinday || "24/7" },
                       { icon: <Heart className="w-5 h-5 text-red-600" />, label: "Health Care", value: "Products" },
                       { icon: <Star className="w-5 h-5 text-yellow-600" />, label: "Rating", value: `${avgRating} ★` },
                       { icon: <Building2 className="w-5 h-5 text-purple-600" />, label: "Branches", value: pharmacyData?.pharmacybranch?.length || "1+" },
                     ].map((item, idx) => (
                       <div
                         key={idx}
                         className="bg-white p-2 sm:p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all text-center flex flex-col items-center justify-center min-h-[85px] sm:min-h-[95px]"
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
            {pharmacyData?.pharmacylogo && (
              <div className="w-14 h-14 rounded-lg overflow-hidden border-2 border-white/40 shadow-md bg-white flex-shrink-0">
                <Image
                  src={pharmacyData.pharmacylogo}
                  width={56}
                  height={56}
                  alt="Pharmacy Logo"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-white line-clamp-2 mb-1">
                {pharmacyData?.regname || "Pharmacy"}
              </h1>
              <div className="flex items-center gap-1.5 text-white/90 text-xs">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">
                  {safeDisplay(pharmacyData?.city, "City")}, {safeDisplay(pharmacyData?.state, "State")}
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
                    alt="Pharmacy Main View"
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
                          alt={`Pharmacy Image ${index + 2}`}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="relative h-56 md:h-64 w-full rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
                <div className="text-center p-6">
                  <MdLocalPharmacy className="w-16 h-16 text-blue-400 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-gray-700 mb-1">Pharmacy</h3>
                  <p className="text-gray-500 text-sm">Images will be available soon</p>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => router.push(`/pharmacy/${pharmacyData?.id}/products`)}
              className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-md text-sm md:text-base flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
              ORDER NOW
            </button>
            <button
              onClick={() => {
                const phone = pharmacyData?.mobile;
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
                { id: 'products', label: 'Products' },
                { id: 'services', label: 'Services' },
                { id: 'pharmacists', label: 'Pharmacists' },
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
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3">About {pharmacyData?.regname}</h3>
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">
                    {pharmacyData?.aboutus || `${pharmacyData?.regname} is a trusted pharmacy providing quality medicines and healthcare products.`}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { icon: <Pill className="w-4 h-4" />, label: "Products", value: pharmacyData?.Product?.length || "500+" },
                      { icon: <Users className="w-4 h-4" />, label: "Pharmacists", value: pharmacyData?.TotalregPharmacist || "N/A" },
                      { icon: <Truck className="w-4 h-4" />, label: "Delivery", value: pharmacyData?.homedelivery ? "Yes" : "No" },
                      { icon: <Clock className="w-4 h-4" />, label: "Service", value: "24/7" },
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

            {/* PRODUCTS TAB */}
            {activeTab === 'products' && (
              <Card className="border border-gray-200 shadow-sm rounded-xl">
                <CardContent className="p-4">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Featured Products</h3>
                  
                  {pharmacyData?.Product && pharmacyData.Product.length > 0 ? (
                    <div className="space-y-3">
                      {pharmacyData.Product.slice(0, 4).map((product) => (
                        <div key={product.id} className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                          <div className="flex gap-3">
                            {product.productImage ? (
                              <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                <Image
                                  src={product.productImage}
                                  fill
                                  alt={product.name}
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Pill className="w-6 h-6 text-blue-400" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">{product.name}</h4>
                              {product.brand && (
                                <p className="text-xs text-blue-600 mb-2">{product.brand}</p>
                              )}
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-base font-bold text-blue-600">₹{product.discountedPrice || product.price}</p>
                                  {product.discountedPrice && product.discountedPrice < product.price && (
                                    <p className="text-xs text-gray-500 line-through">₹{product.price}</p>
                                  )}
                                </div>
                                <Badge className={`text-xs ${product.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                  {product.stock > 0 ? "In Stock" : "Out of Stock"}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Pill className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 text-sm">No products available</p>
                      <p className="text-gray-500 text-xs mt-1">Products will be listed soon</p>
                    </div>
                  )}
                  
                  {pharmacyData?.Product && pharmacyData.Product.length > 0 && (
                    <button
                      onClick={() => router.push(`/pharmacy/${pharmacyData.id}/products`)}
                      className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors text-sm"
                    >
                      View All Products
                    </button>
                  )}
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
                      { label: "24/7 Pharmacy", value: "Yes", icon: <Clock className="w-4 h-4" />, desc: "Round-the-clock medicine availability" },
                      { label: "Home Delivery", value: pharmacyData?.homedelivery ? "yes" : "no", icon: <Truck className="w-4 h-4" />, desc: "Free home delivery service" },
                      { label: "Online Ordering", value: pharmacyData?.onlineplotformservice ? "yes" : "no", icon: <ShoppingCart className="w-4 h-4" />, desc: "Order medicines online" },
                      { label: "Prescription Service", value: "yes", icon: <FileText className="w-4 h-4" />, desc: "Expert prescription consultation" },
                      { label: "Generic Medicines", value: "yes", icon: <Pill className="w-4 h-4" />, desc: "Affordable generic options" },
                      { label: "Medical Supplies", value: "yes", icon: <Package className="w-4 h-4" />, desc: "Healthcare equipment & supplies" },
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

            {/* PHARMACISTS TAB */}
            {activeTab === 'pharmacists' && (
              <>
                {pharmacyData?.Pharmacist && pharmacyData.Pharmacist.length > 0 ? (
                  <Card className="border border-gray-200 shadow-sm rounded-xl">
                    <CardContent className="p-4">
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Our Pharmacists</h3>
                      <div className="space-y-3 mb-4">
                        {pharmacyData.Pharmacist.map((pharmacist) => (
                          <div key={pharmacist.id} className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-200">
                            <div className="flex items-center gap-3">
                              {pharmacist.profilepic ? (
                                <Image
                                  src={pharmacist.profilepic}
                                  width={50}
                                  height={50}
                                  alt={pharmacist.fullname}
                                  className="rounded-full w-12 h-12 object-cover"
                                />
                              ) : (
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                  <Users className="w-6 h-6 text-blue-600" />
                                </div>
                              )}
                              <div className="flex-1">
                                <h4 className="text-gray-900 font-semibold text-sm">
                                  {pharmacist.fullname}
                                </h4>
                                <p className="text-gray-600 text-xs">Registered Pharmacist</p>
                                <p className="text-blue-600 text-xs">{pharmacist.regno}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2">
                          <Award className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="text-blue-900 font-semibold text-sm">
                              {pharmacyData.Pharmacist.length} Registered Pharmacist{pharmacyData.Pharmacist.length > 1 ? 's' : ''}
                            </p>
                            <p className="text-blue-700 text-xs">
                              Professional consultation available
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="border border-gray-200 shadow-sm rounded-xl">
                    <CardContent className="p-4">
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Pharmacists</h3>
                      <div className="text-center py-6">
                        <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600 text-sm">
                          Total Pharmacists: {pharmacyData?.TotalregPharmacist || "N/A"}
                        </p>
                        <p className="text-gray-500 text-xs mt-1">Pharmacist details will be available soon</p>
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
                          const customerName = review.customer?.firstName 
                            ? `${review.customer.firstName} ${review.customer.lastName || ''}`.trim()
                            : review.customerName || "Anonymous Customer";
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
                                {review.comment || "Great pharmacy with excellent service and quality medicines."}
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
                      <p className="text-gray-400 text-xs mt-1">Be the first to review this pharmacy</p>
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
                        <p className="text-gray-900 font-medium text-sm">{safeDisplay(pharmacyData?.mobile)}</p>
                        {pharmacyData?.alternatemobile && (
                          <p className="text-gray-700 text-xs mt-1">Alternate: {pharmacyData.alternatemobile}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <Mail className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-green-900 mb-1 text-sm">Email Addresses</h4>
                        <p className="text-gray-900 font-medium text-xs break-words">{safeDisplay(pharmacyData?.email)}</p>
                        {pharmacyData?.secondaryemail && (
                          <p className="text-gray-700 text-xs mt-1 break-words">Secondary: {pharmacyData.secondaryemail}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <MapPin className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-purple-900 mb-1 text-sm">Pharmacy Address</h4>
                        <p className="text-gray-900 font-medium leading-relaxed text-sm">
                          {safeDisplay(pharmacyData?.fulladdress)}
                        </p>
                        <p className="text-gray-700 mt-1 text-xs">
                          {pharmacyData?.city}, {pharmacyData?.state}
                        </p>
                        <p className="text-gray-700 text-xs">
                          Pincode: {pharmacyData?.pincode}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <Clock className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-orange-900 mb-1 text-sm">Working Hours</h4>
                        <p className="text-gray-900 font-medium text-sm">{pharmacyData?.servicetimeinday || "24/7 Service"}</p>
                        <p className="text-gray-700 text-xs mt-1">{pharmacyData?.servicetimeinweek || "Monday - Sunday"}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* INFO TAB */}
            {activeTab === 'info' && (
              <Card className="border border-gray-200 shadow-sm rounded-xl">
                <CardContent className="p-4">
                  <h3 className="text-base font-bold text-gray-900 mb-3">Pharmacy Information</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="text-gray-600 text-xs block mb-0.5">Registration No:</span>
                      <p className="font-semibold text-gray-900 text-xs">{pharmacyData?.regno || "N/A"}</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="text-gray-600 text-xs block mb-0.5">Type:</span>
                      <p className="font-semibold text-gray-900 text-xs">{pharmacyData?.pharmacytype || "N/A"}</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="text-gray-600 text-xs block mb-0.5">PAN Card:</span>
                      <p className="font-semibold text-gray-900 text-xs">{pharmacyData?.pharmacypancardno || "N/A"}</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="text-gray-600 text-xs block mb-0.5">Status:</span>
                      <p className="font-semibold text-green-600 text-xs">Active</p>
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
                <h2 className="text-lg font-bold text-white text-center">Our Services</h2>
                <p className="text-blue-100 text-center text-xs mt-0.5">
                  Comprehensive pharmacy solutions
                </p>
              </div>
              <div className="p-3">
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { icon: <MdLocalPharmacy className="w-4 h-4 text-blue-600" />, label: "24/7", value: "Available" },
                    { icon: <Pill className="w-4 h-4 text-green-600" />, label: "Medicines", value: pharmacyData?.Product?.length || "500+" },
                    { icon: <Truck className="w-4 h-4 text-orange-600" />, label: "Delivery", value: pharmacyData?.homedelivery ? "Yes" : "No" },
                    { icon: <ShoppingCart className="w-4 h-4 text-purple-600" />, label: "Online", value: pharmacyData?.onlineplotformservice ? "Yes" : "Available" },
                    { icon: <Users className="w-4 h-4 text-cyan-600" />, label: "Pharmacists", value: pharmacyData?.TotalregPharmacist || "Expert" },
                    { icon: <Shield className="w-4 h-4 text-indigo-600" />, label: "Quality", value: "Assured" },
                    { icon: <FileText className="w-4 h-4 text-red-600" />, label: "Prescription", value: "Service" },
                    { icon: <Package className="w-4 h-4 text-teal-600" />, label: "Supplies", value: "Available" },
                    { icon: <Star className="w-4 h-4 text-yellow-600" />, label: "Rating", value: `${avgRating} ★` },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm text-center min-h-[70px] flex flex-col justify-center items-center"
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

          {/* Mobile Call to Action Section */}
          <Card className="border-2 border-blue-500 shadow-lg rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 overflow-hidden">
            <CardContent className="p-4">
              <div className="flex flex-col gap-4 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center animate-pulse flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold">24/7 Service</h3>
                    <p className="text-blue-100 text-xs">Always here for your health needs</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <a
                    href={`tel:${pharmacyData?.mobile || ''}`}
                    className="bg-white text-blue-600 hover:bg-blue-50 font-bold py-3 px-4 rounded-lg transition-all shadow-md text-center text-sm"
                  >
                    📞 Call: {safeDisplay(pharmacyData?.mobile, "Not Available")}
                  </a>
                  <button
                    onClick={() => router.push(`/pharmacy/${pharmacyData?.id}/products`)}
                    className="bg-white/20 border-2 border-white text-white hover:bg-white/30 font-semibold py-3 px-4 rounded-lg transition-all text-center text-sm"
                  >
                    Order Medicines Now
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PharmacySingleView;