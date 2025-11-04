"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  MapPin,
  Phone,
  Shield,
  Star,
  Award,
  Users,
  Calendar,
  CheckCircle,
  IndianRupee,
  Stethoscope,
  X,
  ArrowLeft,
  Loader2,
  TrendingDown,
  DollarSign,
  Tag,
  Percent,
  Wallet,
  Home,
  Sparkles,
  ArrowUpDown,
} from "lucide-react";

const PricingServicesList = ({ onClose, homeHealthcareService, serviceName }) => {
  const router = useRouter();
  const [selectedService, setSelectedService] = useState(null);
  const [pricingServices, setPricingServices] = useState([]);
  const [groupedServices, setGroupedServices] = useState([]);
  const [servicesByPriceRange, setServicesByPriceRange] = useState({});
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("all"); // 'all', 'budget', 'moderate', 'premium', 'grouped'
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' or 'desc'

  // Fetch pricing services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/home-healthcare/pricing-services");
        const result = await response.json();

        if (result.success) {
          setPricingServices(result.data || []);
          setGroupedServices(result.grouped || []);
          setServicesByPriceRange(result.byPriceRange || {});
          setStatistics(result.statistics);
        } else {
          setError("Failed to load pricing services");
        }
      } catch (err) {
        console.error("Error fetching pricing services:", err);
        setError("Failed to load pricing services");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const colorClasses = {
    green: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-600",
      hover: "hover:bg-green-100",
      gradient: "from-green-50 to-green-100",
    },
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-600",
      hover: "hover:bg-blue-100",
      gradient: "from-blue-50 to-blue-100",
    },
    purple: {
      bg: "bg-purple-50",
      border: "border-purple-200",
      text: "text-purple-600",
      hover: "hover:bg-purple-100",
      gradient: "from-purple-50 to-purple-100",
    },
    orange: {
      bg: "bg-orange-50",
      border: "border-orange-200",
      text: "text-orange-600",
      hover: "hover:bg-orange-100",
      gradient: "from-orange-50 to-orange-100",
    },
    teal: {
      bg: "bg-teal-50",
      border: "border-teal-200",
      text: "text-teal-600",
      hover: "hover:bg-teal-100",
      gradient: "from-teal-50 to-teal-100",
    },
  };

  const getServiceColor = (index) => {
    const colors = ["green", "blue", "purple", "orange", "teal"];
    return colors[index % colors.length];
  };

  const getAffordabilityColor = (affordability) => {
    if (affordability === "budget") return "green";
    if (affordability === "moderate") return "blue";
    return "purple";
  };

  const getCurrentViewServices = () => {
    if (viewMode === "grouped") return groupedServices;
    if (viewMode === "budget") return servicesByPriceRange.budget || [];
    if (viewMode === "moderate") return servicesByPriceRange.moderate || [];
    if (viewMode === "premium") return servicesByPriceRange.premium || [];
    
    // For 'all' mode, apply sorting
    const services = [...pricingServices];
    return sortOrder === "asc" 
      ? services.sort((a, b) => a.priceValue - b.priceValue)
      : services.sort((a, b) => b.priceValue - a.priceValue);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
      <div className="min-h-screen py-6 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-t-xl shadow-lg p-6 sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <ArrowLeft className="w-6 h-6 text-white" />
                </button>
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <IndianRupee className="w-8 h-8" />
                    Affordable Healthcare Services
                  </h2>
                  <p className="text-white/90 mt-1">
                    Quality healthcare at competitive prices - sorted by affordability
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => setViewMode("all")}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  viewMode === "all"
                    ? "bg-white text-green-600"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                All Services
              </button>
              <button
                onClick={() => setViewMode("budget")}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  viewMode === "budget"
                    ? "bg-white text-green-600"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                Budget (Under ₹1000)
              </button>
              <button
                onClick={() => setViewMode("moderate")}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  viewMode === "moderate"
                    ? "bg-white text-green-600"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                Moderate (₹1000-2000)
              </button>
              <button
                onClick={() => setViewMode("premium")}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  viewMode === "premium"
                    ? "bg-white text-green-600"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                Premium (Above ₹2000)
              </button>
              <button
                onClick={() => setViewMode("grouped")}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  viewMode === "grouped"
                    ? "bg-white text-green-600"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                By Service Type
              </button>
              {viewMode === "all" && (
                <button
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  className="px-4 py-2 rounded-lg font-semibold text-sm bg-white/20 text-white hover:bg-white/30 transition-all flex items-center gap-2"
                >
                  <ArrowUpDown className="w-4 h-4" />
                  {sortOrder === "asc" ? "Low to High" : "High to Low"}
                </button>
              )}
            </div>
          </div>

          {/* Services Content */}
          <div className="bg-gray-50 rounded-b-xl shadow-lg p-6">
            {/* Statistics Banner */}
            {statistics && !loading && (
              <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-2 border-green-200 hover:shadow-lg transition-all">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <IndianRupee className="w-6 h-6 text-green-600" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-2xl mb-1">₹{statistics.lowestPrice}</h4>
                    <p className="text-xs text-gray-600">Lowest Starting Price</p>
                  </CardContent>
                </Card>
                <Card className="border-2 border-blue-200 hover:shadow-lg transition-all">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <DollarSign className="w-6 h-6 text-blue-600" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-2xl mb-1">₹{statistics.averagePrice}</h4>
                    <p className="text-xs text-gray-600">Average Price</p>
                  </CardContent>
                </Card>
                <Card className="border-2 border-orange-200 hover:shadow-lg transition-all">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Tag className="w-6 h-6 text-orange-600" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-2xl mb-1">{statistics.servicesWithDiscount}</h4>
                    <p className="text-xs text-gray-600">Discounted Services</p>
                  </CardContent>
                </Card>
                <Card className="border-2 border-teal-200 hover:shadow-lg transition-all">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Stethoscope className="w-6 h-6 text-teal-600" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-2xl mb-1">{statistics.totalServices}</h4>
                    <p className="text-xs text-gray-600">Total Services</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Price Range Info */}
            {statistics && !loading && viewMode === "all" && (
              <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <TrendingDown className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Budget Services</p>
                      <p className="font-bold text-gray-900">{statistics.budgetServices} (Under ₹1000)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Moderate Services</p>
                      <p className="font-bold text-gray-900">{statistics.moderateServices} (₹1000-2000)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Premium Services</p>
                      <p className="font-bold text-gray-900">{statistics.premiumServices} (Above ₹2000)</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-12 h-12 text-green-600 animate-spin mb-4" />
                <p className="text-gray-600 text-lg">Loading pricing information...</p>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="flex flex-col items-center justify-center py-20">
                <X className="w-12 h-12 text-red-600 mb-4" />
                <p className="text-red-600 text-lg mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && getCurrentViewServices().length === 0 && (
              <div className="flex flex-col items-center justify-center py-20">
                <IndianRupee className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-gray-600 text-lg">No services available in this price range</p>
              </div>
            )}

            {/* Grouped Services View */}
            {!loading && !error && viewMode === "grouped" && groupedServices.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Services Grouped by Type - Sorted by Price ({groupedServices.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupedServices.map((service, index) => {
                    const color = getServiceColor(index);
                    const colors = colorClasses[color];
                    return (
                      <Card
                        key={index}
                        className={`border-2 ${colors.border} ${colors.hover} transition-all hover:shadow-xl cursor-pointer`}
                        onClick={() => router.push(`/home-healthcare/${encodeURIComponent(service.serviceName)}`)}
                      >
                        <CardContent className="p-5">
                          <div className="flex items-start gap-3 mb-4">
                            <div className={`p-3 rounded-xl ${colors.bg} ${colors.text} flex-shrink-0`}>
                              <Stethoscope className="w-6 h-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-bold text-gray-900 mb-1">
                                {service.serviceName}
                              </h3>
                              <Badge className="bg-green-100 text-green-700 text-xs">
                                <IndianRupee className="w-3 h-3 mr-1" />
                                Starting ₹{service.minPrice}
                              </Badge>
                            </div>
                          </div>

                          {/* Price Stats */}
                          <div className="flex items-center gap-3 mb-4 text-xs text-gray-600">
                            <div className="flex items-center gap-1">
                              <TrendingDown className="w-3.5 h-3.5" />
                              <span>Min: ₹{service.minPrice}</span>
                            </div>
                            {service.averagePrice && (
                              <div className="flex items-center gap-1">
                                <DollarSign className="w-3.5 h-3.5" />
                                <span>Avg: ₹{service.averagePrice}</span>
                              </div>
                            )}
                          </div>

                          {/* Provider Count */}
                          <div className="flex items-center gap-1 mb-4 text-xs text-gray-600">
                            <Users className="w-3.5 h-3.5" />
                            <span>{service.totalProviders} Provider{service.totalProviders > 1 ? "s" : ""} Available</span>
                          </div>

                          {/* Locations */}
                          {service.availableIn && service.availableIn.length > 0 && (
                            <div className="flex items-center gap-1 mb-4 text-xs text-gray-600">
                              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                              <span className="truncate">
                                Available in {service.availableIn.slice(0, 2).join(", ")}
                                {service.availableIn.length > 2 && ` +${service.availableIn.length - 2} more`}
                              </span>
                            </div>
                          )}

                          {/* Features */}
                          <div className="space-y-2 mb-4">
                            {["Affordable Pricing", "Quality Service"].map((feature, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <CheckCircle className={`w-4 h-4 ${colors.text} flex-shrink-0`} />
                                <span className="text-sm text-gray-700">{feature}</span>
                              </div>
                            ))}
                          </div>

                          {/* Pricing & Action */}
                          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Starting from</p>
                              <p className={`text-2xl font-bold ${colors.text}`}>
                                ₹{service.minPrice}
                              </p>
                            </div>
                            <button className={`px-4 py-2 ${colors.bg} ${colors.text} rounded-lg font-semibold text-sm ${colors.hover} transition-all flex items-center gap-2`}>
                              <Calendar className="w-4 h-4" />
                              View
                            </button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* All Services / Filtered by Price Range */}
            {!loading && !error && viewMode !== "grouped" && getCurrentViewServices().length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {viewMode === "all" && `All Services Sorted by Price (${getCurrentViewServices().length})`}
                  {viewMode === "budget" && `Budget-Friendly Services (${getCurrentViewServices().length})`}
                  {viewMode === "moderate" && `Moderately Priced Services (${getCurrentViewServices().length})`}
                  {viewMode === "premium" && `Premium Services (${getCurrentViewServices().length})`}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getCurrentViewServices().map((service, index) => {
                    const color = getAffordabilityColor(service.affordability);
                    const colors = colorClasses[color];
                    return (
                      <Card
                        key={service.id}
                        className={`border-2 ${colors.border} hover:shadow-xl transition-all cursor-pointer relative`}
                        onClick={() => router.push(`/home-healthcare/${encodeURIComponent(service.serviceName)}/${service.hospital.id}`)}
                      >
                        <CardContent className="p-5">
                          {/* Discount Badge */}
                          {service.hasDiscount && service.discountPercentage > 0 && (
                            <div className="absolute top-3 right-3">
                              <Badge className="bg-red-500 text-white">
                                <Percent className="w-3 h-3 mr-1" />
                                {service.discountPercentage}% OFF
                              </Badge>
                            </div>
                          )}

                          {/* Hospital Logo & Name */}
                          <div className="flex items-start gap-3 mb-4">
                            {service.hospital.logo && (
                              <div className="w-14 h-14 rounded-lg overflow-hidden border-2 border-gray-200 flex-shrink-0">
                                <Image
                                  src={service.hospital.logo}
                                  width={56}
                                  height={56}
                                  alt={service.hospital.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h3 className="text-base font-bold text-gray-900 mb-1 line-clamp-2">
                                {service.hospital.name}
                              </h3>
                              <div className="flex flex-wrap gap-1">
                                <Badge className={`${colors.bg} ${colors.text} text-xs`}>
                                  {service.priceRange}
                                </Badge>
                                {service.totalBookings > 0 && (
                                  <Badge className="bg-blue-100 text-blue-700 text-xs">
                                    {service.totalBookings} bookings
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Service Name */}
                          <div className={`${colors.bg} ${colors.text} p-3 rounded-lg mb-3`}>
                            <p className="font-semibold text-sm">{service.serviceName}</p>
                          </div>

                          {/* Location */}
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                            <MapPin className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">{service.hospital.city}, {service.hospital.state}</span>
                          </div>

                          {/* Pricing Details */}
                          <div className="bg-gray-50 p-3 rounded-lg mb-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-gray-600">Starting Price:</span>
                              <span className="font-bold text-gray-900">₹{service.minPrice}</span>
                            </div>
                            {service.maxPrice && (
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs text-gray-600">Max Price:</span>
                                <span className="font-bold text-gray-900">₹{service.maxPrice}</span>
                              </div>
                            )}
                            {service.finalprice && (
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-600">Final Price:</span>
                                <span className="font-bold text-green-600">₹{service.finalprice}</span>
                              </div>
                            )}
                          </div>

                          {/* Experience Badge */}
                          {service.hospital.experience && (
                            <div className="flex items-center gap-2 mb-4 text-xs text-gray-600 bg-gray-50 p-2 rounded-lg">
                              <Award className="w-4 h-4 text-green-600" />
                              <span>{service.hospital.experience}+ years experience</span>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(`tel:${service.hospital.mobile}`, '_self');
                              }}
                              className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-all"
                            >
                              <Phone className="w-4 h-4" />
                            </button>
                            <button className={`flex-1 px-3 py-2 ${colors.bg} ${colors.text} rounded-lg font-semibold text-xs ${colors.hover} transition-all`}>
                              Book Now
                            </button>
                            <div className="text-right">
                              <p className={`text-xl font-bold ${colors.text}`}>
                                ₹{service.minPrice}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Why Choose Affordable Services */}
            {!loading && !error && (
              <div className="mt-8">
                <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Wallet className="w-6 h-6 text-green-600" />
                      Benefits of Our Affordable Healthcare Services
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        {
                          icon: <TrendingDown className="w-5 h-5 text-green-600" />,
                          title: "Competitive Pricing",
                          desc: "Best rates in the market",
                        },
                        {
                          icon: <Tag className="w-5 h-5 text-blue-600" />,
                          title: "Discounts Available",
                          desc: "Special offers and packages",
                        },
                        {
                          icon: <Shield className="w-5 h-5 text-purple-600" />,
                          title: "Quality Assured",
                          desc: "No compromise on service quality",
                        },
                        {
                          icon: <CheckCircle className="w-5 h-5 text-orange-600" />,
                          title: "Transparent Pricing",
                          desc: "No hidden charges",
                        },
                      ].map((benefit, idx) => (
                        <div
                          key={idx}
                          className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                        >
                          <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3 border-2 border-gray-200">
                            {benefit.icon}
                          </div>
                          <h4 className="font-bold text-gray-900 mb-1">{benefit.title}</h4>
                          <p className="text-sm text-gray-600">{benefit.desc}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Provider Info Section */}
            {!loading && !error && homeHealthcareService && (
              <div className="mt-6">
                <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      Current Service Provider Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-3 bg-white p-4 rounded-lg">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Shield className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Provider</p>
                          <p className="font-semibold text-gray-900">
                            {homeHealthcareService?.hospital?.hspInfo?.regname || "Healthcare Provider"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-white p-4 rounded-lg">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <IndianRupee className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Starting Price</p>
                          <p className="font-semibold text-gray-900">
                            ₹{homeHealthcareService?.minPrice || homeHealthcareService?.startingPrice || "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-white p-4 rounded-lg">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <Phone className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Contact</p>
                          <p className="font-semibold text-gray-900">
                            {homeHealthcareService?.hospital?.mobile || "Contact Provider"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingServicesList;

