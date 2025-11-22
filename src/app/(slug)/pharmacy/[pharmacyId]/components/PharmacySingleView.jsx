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
  ShoppingCart,
  ArrowRight,
  BusFront,
  Plane,
  Train,
  Landmark,
  Route
} from "lucide-react";
import { FaHospitalAlt } from "react-icons/fa";
import { MdLocalPharmacy } from "react-icons/md";
import { useRouter } from "next/navigation";

const PharmacySingleView = ({ pharmacyData, customerId, addReview }) => {
  console.log("🚀 ~ Pharmacy Data:", pharmacyData)
  
  const [activeTab, setActiveTab] = useState('overview');
  const [rating, setRating] = useState(0);

  const router = useRouter();

  // Get reviews from pharmacy data
  const reviews = pharmacyData?.PharmacyReview || pharmacyData?.reviews || [];
  console.log("🚀 ~ Pharmacy Reviews:", JSON.stringify(reviews, null, 2))
  
  // Calculate average rating from actual reviews
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length).toFixed(1) 
    : null;
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
{/* =================== PHARMACY HEADER (Exact Screenshot + Exact Layout) =================== */}
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
      {pharmacyData?.regname || "Pharmacy"}
    </h1>

    <div className="flex items-center gap-2 text-[#243460] text-[15px] leading-none">
      <Building2 className="w-4 h-4" />
      {pharmacyData?.pharmacytype || "Retail Pharmacy"}
    </div>
  </div>

{/* RIGHT SECTION */}
<div className="flex flex-col items-end gap-2">

  {/* BUTTONS */}
  <div className="flex items-center gap-3">
    <button
      onClick={() => window.open(`tel:${pharmacyData?.mobile || ''}`, '_self')}
      className="px-6 py-2 rounded-[12px] text-white text-[15px] font-semibold"
      style={{ background: "#5868F2" }}
    >
      Call Now
    </button>

    <button
      onClick={() => router.push(`/pharmacy/${pharmacyData?.id}/products`)}
      className="px-6 py-2 rounded-[12px] text-white text-[15px] font-semibold"
      style={{ background: "#4CAF50" }}
    >
      Order Now
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
  onClick={() => router.push(`/pharmacy/${pharmacyData?.id}/products`)}
  className="w-[236px] h-[44px] bg-[#E68B67] text-white font-semibold 
  rounded-[12px] flex items-center justify-center gap-[10px]
  px-[20px] py-[10px] text-sm shadow-md"
>
  <ShoppingCart className="w-5 h-5" />
  Order Medicines Now
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

{/* --- CARD 1: ABOUT PHARMACY --- */}
<Card
  className="w-[806px] h-[187px] border border-[#00000033] rounded-[12px] shadow-sm mt-5"
>
  <CardContent className="p-5">
    <h3 className="text-xl md:text-2xl font-bold mb-3"
      style={{ color: "#243460" }}
    >
      About {pharmacyData?.regname}
    </h3>

    <p
      className="text-sm md:text-base leading-relaxed"
      style={{ color: "#666666" }}
    >
      {pharmacyData?.aboutus || `${pharmacyData?.regname} is a trusted pharmacy providing quality medicines and healthcare products. 
      Located in ${safeDisplay(pharmacyData?.city, "your area")}, ${safeDisplay(pharmacyData?.state, "")}, we are committed to
      your health and wellness with ${pharmacyData?.TotalregPharmacist || "expert"} registered pharmacists and wide range of medicines.`}
    </p>
  </CardContent>
</Card>


{/* --- CARD 2: PHARMACY STATUS (Exact Figma Design) --- */}
<Card
  className="w-[806px] h-[121px] border border-[#00000033] rounded-[12px] shadow-sm"
>
  <CardContent className="p-5">

    {/* Title */}
    <h3
      className="text-xl font-bold mb-3"
      style={{ color: "#243460" }}
    >
      Pharmacy Status
    </h3>

    {/* Registration / Type / Status Row */}
    <div className="text-sm flex flex-wrap gap-2">
      <span style={{ color: "#407BFF" }}>Registration:</span>
      <span style={{ color: "#E68B67" }}>
        {pharmacyData?.regno || "N/A"}
      </span>

      <span style={{ color: "#407BFF" }}>| Type:</span>
      <span style={{ color: "#E68B67" }}>
        {pharmacyData?.pharmacytype || "Retail Pharmacy"}
      </span>

      <span style={{ color: "#407BFF" }}>| Status:</span>
      <span
        style={{
          color: "#28A745",
        }}
      >
        Active & Verified
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
          icon: <Image src="/icons/pill.png" width={60} height={60} alt="doctor" />,
          title: "Products",
          value: pharmacyData?.Product?.length || "500+",
          rows: [
            { color: "bg-green-500", text: "Wide Range Available" },
            { color: "bg-blue-500", text: "Quality Medicines" },
          ]
        },
        {
          icon: <Image src="/icons/doctor.png" width={60} height={60} alt="doctor" />,
          title: "Pharmacists",
          value: pharmacyData?.TotalregPharmacist || "N/A",
          rows: [
            { color: "bg-green-500", text: "Expert Consultation" },
            { color: "bg-blue-500", text: "Registered Professionals" },
          ]
        },
        {
          icon: <Image src="/icons/ambulance.png" width={60} height={60} alt="doctor" />,
          title: "Home Delivery",
          value: pharmacyData?.homedelivery ? "Yes" : "No",
          rows: [
            { color: "bg-green-500", text: "Fast Delivery" },
            { color: "bg-blue-500", text: "Safe Packaging" },
          ]
        },
        {
          icon: <Clock className="w-12 h-12 text-[#243460]" />,
          title: "Service Time",
          value: pharmacyData?.servicetimeinday || "24/7",
          rows: [
            { color: "bg-green-500", text: "Round the Clock" },
            { color: "bg-blue-500", text: "Always Available" },
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
                                                          {/* {(product.category === "Tablets" || product.category === "Capsule") && (
                            <div className="text-xs text-[#243460] bg-blue-50 px-2 py-1 rounded-full border border-blue-200">
                               {product.unit || 'unit'} Units
                            </div>
                          )} */}
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
                    {/* ====== ADD REVIEW BOX ====== */}
{customerId && (
  <form action={addReview} className="mb-8 bg-blue-50 border border-blue-200 rounded-xl p-5 shadow-sm">
    <h4 className="text-lg font-semibold text-gray-900 mb-3">Write a Review</h4>

    {/* Rating Stars */}
    <div className="flex items-center gap-2 mb-4">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setRating(star)}
          className="focus:outline-none"
        >
          <Star
            className={`w-7 h-7 cursor-pointer ${
              star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            }`}
          />
        </button>
      ))}

      <input type="hidden" name="rating" value={rating} />
    </div>

    {/* Comment Box */}
    <textarea
      name="comment"
      required
      placeholder="Share your experience…"
      className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
      rows={4}
    />

    {/* Submit Button */}
    <button
      type="submit"
      className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md"
    >
      Submit Review
    </button>
  </form>
)}
{/* ====== END REVIEW BOX ====== */}

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
          {safeDisplay(pharmacyData?.mobile, "N/A")}
        </p>
      </div>

      {/* Email */}
      <div>
        <div className="flex items-center gap-2 text-[#243460]">
          <Mail className="w-4 h-4 text-[#666666]" />
          <span className="text-[14px] text-[#666666]">Email</span>
        </div>
        <p className="text-[15px] font-semibold text-[#243460] mt-1 truncate">
          {safeDisplay(pharmacyData?.email, "N/A")}
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
          onClick={() => setActiveTab('reviews')}
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
          safeDisplay(pharmacyData?.fulladdress || pharmacyData?.city || "", "")
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
        {safeDisplay(pharmacyData?.city, "City")}, {safeDisplay(pharmacyData?.state, "State")} {pharmacyData?.pincode ? `- ${pharmacyData.pincode}` : ""}
      </p>

      <p className="text-[15px] text-[#243460] font-medium mt-1 leading-5">
        {safeDisplay(pharmacyData?.fulladdress, "Address not available")}
      </p>
    </div>

  </div>

  {/* ---------------------- NEARBY TRANSPORT ---------------------- */}
  {pharmacyData?.facilitiesJson?.transportation?.length > 0 && (
    <div className="mt-5">
      <h3 className="text-[16px] font-semibold text-[#C47C52] mb-2">
        Nearby Transportation
      </h3>

      <div className="space-y-3">
        {pharmacyData.facilitiesJson.transportation.map((item, i) => (
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
  {pharmacyData?.facilitiesJson?.landmarks?.length > 0 && (
    <div className="mt-6">
      <h3 className="text-[16px] font-semibold text-[#C47C52] mb-2">
        Nearby Landmarks
      </h3>

      <div className="space-y-3">
        {pharmacyData.facilitiesJson.landmarks.map((place, i) => (
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
            { icon: <MdLocalPharmacy className="w-5 h-5 text-[#243460]" />, label: "24/7 Pharmacy", value: "Available" },
            { icon: <Pill className="w-5 h-5 text-[#243460]" />, label: "Medicines", value: pharmacyData?.Product?.length || "500+" },
            { icon: <Truck className="w-5 h-5 text-[#243460]" />, label: "Home Delivery", value: pharmacyData?.homedelivery ? "Yes" : "No" },
            { icon: <ShoppingCart className="w-5 h-5 text-[#243460]" />, label: "Online Order", value: pharmacyData?.onlineplotformservice ? "Yes" : "Available" },
            { icon: <Users className="w-5 h-5 text-[#243460]" />, label: "Pharmacists", value: pharmacyData?.TotalregPharmacist || "Expert" },
            { icon: <Shield className="w-5 h-5 text-[#243460]" />, label: "Quality", value: "Assured" },
            { icon: <FileText className="w-5 h-5 text-[#243460]" />, label: "Prescription", value: "Service" },
            { icon: <Package className="w-5 h-5 text-[#243460]" />, label: "Medical Supplies", value: "Available" },
            { icon: <Clock className="w-5 h-5 text-[#243460]" />, label: "Service Time", value: pharmacyData?.servicetimeinday || "24/7" },
            { icon: <Heart className="w-5 h-5 text-[#243460]" />, label: "Health Care", value: "Products" },
            { icon: <Star className="w-5 h-5 text-[#243460]" />, label: "Rating", value: `${avgRating} ★` },
            { icon: <Building2 className="w-5 h-5 text-[#243460]" />, label: "Branches", value: pharmacyData?.pharmacybranch?.length || "1+" },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`bg-[#FAF5E05C] p-4 rounded-xl border border-[#F1E9E2] shadow-sm hover:shadow-md transition-all text-center flex flex-col items-center justify-center`}
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