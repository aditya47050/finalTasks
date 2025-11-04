"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Phone,
  Shield,
  Star,
  Award,
  Users,
  CheckCircle,
  X,
  ArrowLeft,
  Loader2,
  Sparkles,
  TrendingUp,
  Building2,
  Heart,
  Home,
  Calendar,
  IndianRupee,
  Activity,
  UserCheck,
  Clock,
  Stethoscope,
  HeartPulse,
} from "lucide-react";

const HospitalHomeHealthcareList = ({ onClose, hospitalService, serviceName }) => {
  const router = useRouter();
  const [services, setServices] = useState([]);
  const [groupedByService, setGroupedByService] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("grouped"); // 'grouped' or 'all'

  // Fetch home healthcare services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/hospital/home-healthcare");
        const result = await response.json();

        if (result.success) {
          setServices(result.data || []);
          setGroupedByService(result.grouped || []);
          setStatistics(result.statistics);
        } else {
          setError("Failed to load home healthcare services");
        }
      } catch (err) {
        console.error("Error fetching home healthcare:", err);
        setError("Failed to load home healthcare services");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const colorClasses = {
    pink: {
      bg: "bg-pink-50",
      border: "border-pink-200",
      text: "text-pink-600",
      hover: "hover:bg-pink-100",
      gradient: "from-pink-50 to-pink-100",
    },
    rose: {
      bg: "bg-rose-50",
      border: "border-rose-200",
      text: "text-rose-600",
      hover: "hover:bg-rose-100",
      gradient: "from-rose-50 to-rose-100",
    },
    red: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-600",
      hover: "hover:bg-red-100",
      gradient: "from-red-50 to-red-100",
    },
    fuchsia: {
      bg: "bg-fuchsia-50",
      border: "border-fuchsia-200",
      text: "text-fuchsia-600",
      hover: "hover:bg-fuchsia-100",
      gradient: "from-fuchsia-50 to-fuchsia-100",
    },
    purple: {
      bg: "bg-purple-50",
      border: "border-purple-200",
      text: "text-purple-600",
      hover: "hover:bg-purple-100",
      gradient: "from-purple-50 to-purple-100",
    },
  };

  const getServiceColor = (index) => {
    const colors = ["pink", "rose", "red", "fuchsia", "purple"];
    return colors[index % colors.length];
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
      <div className="min-h-screen py-6 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-600 to-rose-600 rounded-t-xl shadow-lg p-6 sticky top-0 z-10">
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
                    <Home className="w-8 h-8" />
                    Hospital Home Healthcare Services
                  </h2>
                  <p className="text-white/90 mt-1">
                    Professional healthcare services in the comfort of your home
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
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setViewMode("grouped")}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  viewMode === "grouped"
                    ? "bg-white text-pink-600"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                By Service Type
              </button>
              <button
                onClick={() => setViewMode("all")}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  viewMode === "all"
                    ? "bg-white text-pink-600"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                All Providers
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="bg-gray-50 rounded-b-xl shadow-lg p-6">
            {/* Statistics Banner */}
            {statistics && !loading && (
              <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-2 border-pink-200 hover:shadow-lg transition-all">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Home className="w-6 h-6 text-pink-600" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-2xl mb-1">{statistics.totalServices}</h4>
                    <p className="text-xs text-gray-600">Home Healthcare Services</p>
                  </CardContent>
                </Card>
                <Card className="border-2 border-rose-200 hover:shadow-lg transition-all">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Building2 className="w-6 h-6 text-rose-600" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-2xl mb-1">{statistics.totalHospitals}</h4>
                    <p className="text-xs text-gray-600">Hospitals</p>
                  </CardContent>
                </Card>
                <Card className="border-2 border-red-200 hover:shadow-lg transition-all">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <TrendingUp className="w-6 h-6 text-red-600" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-2xl mb-1">{statistics.totalBookings}</h4>
                    <p className="text-xs text-gray-600">Services Provided</p>
                  </CardContent>
                </Card>
                <Card className="border-2 border-fuchsia-200 hover:shadow-lg transition-all">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-fuchsia-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <MapPin className="w-6 h-6 text-fuchsia-600" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-2xl mb-1">{statistics.totalCities}</h4>
                    <p className="text-xs text-gray-600">Cities Covered</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Home Healthcare Benefits Banner */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                {
                  icon: <Home className="w-6 h-6 text-pink-600" />,
                  title: "At Home Care",
                  desc: "Professional care at your doorstep",
                },
                {
                  icon: <UserCheck className="w-6 h-6 text-rose-600" />,
                  title: "Trained Staff",
                  desc: "Qualified healthcare professionals",
                },
                {
                  icon: <Clock className="w-6 h-6 text-red-600" />,
                  title: "24/7 Service",
                  desc: "Available round the clock",
                },
                {
                  icon: <HeartPulse className="w-6 h-6 text-fuchsia-600" />,
                  title: "Personalized Care",
                  desc: "Tailored to your needs",
                },
              ].map((feature, idx) => (
                <Card key={idx} className="border-2 border-gray-200 hover:shadow-lg transition-all">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      {feature.icon}
                    </div>
                    <h4 className="font-bold text-gray-900 text-sm mb-1">{feature.title}</h4>
                    <p className="text-xs text-gray-600">{feature.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-12 h-12 text-pink-600 animate-spin mb-4" />
                <p className="text-gray-600 text-lg">Loading home healthcare services...</p>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="flex flex-col items-center justify-center py-20">
                <X className="w-12 h-12 text-red-600 mb-4" />
                <p className="text-red-600 text-lg mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-all"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && services.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20">
                <Home className="w-16 h-16 text-gray-400 mb-4" />
                <p className="text-gray-600 text-xl font-semibold mb-2">No Home Healthcare Services Available</p>
                <p className="text-gray-500 text-sm">Home healthcare services will appear here once hospitals add them</p>
                <div className="mt-6 text-left bg-pink-50 border border-pink-200 rounded-lg p-4 max-w-md">
                  <p className="text-sm text-pink-900 mb-2 font-semibold">💡 What are Home Healthcare Services?</p>
                  <p className="text-xs text-pink-700">
                    Professional medical care and assistance provided in the comfort of your home, 
                    including nursing care, physiotherapy, elderly care, and post-operative care.
                  </p>
                </div>
              </div>
            )}

            {/* Grouped By Service Type View */}
            {!loading && !error && viewMode === "grouped" && groupedByService.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Home Healthcare Services by Type ({groupedByService.length})
                </h3>
                <div className="space-y-6">
                  {groupedByService.map((serviceGroup, index) => {
                    const color = getServiceColor(index);
                    const colors = colorClasses[color];
                    return (
                      <Card
                        key={index}
                        className={`border-2 ${colors.border} transition-all hover:shadow-xl`}
                      >
                        <CardContent className="p-6">
                          {/* Service Type Header */}
                          <div className="flex items-start gap-4 mb-6 pb-4 border-b">
                            <div className={`p-4 rounded-xl ${colors.bg} ${colors.text} flex-shrink-0`}>
                              <Home className="w-8 h-8" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {serviceGroup.serviceName}
                              </h3>
                              <div className="flex flex-wrap gap-2 mb-2">
                                <Badge className={`${colors.bg} ${colors.text} text-xs`}>
                                  <Building2 className="w-3 h-3 mr-1" />
                                  {serviceGroup.totalProviders} Provider{serviceGroup.totalProviders > 1 ? "s" : ""}
                                </Badge>
                                {serviceGroup.totalBookings > 0 && (
                                  <Badge className="bg-blue-100 text-blue-700 text-xs">
                                    <TrendingUp className="w-3 h-3 mr-1" />
                                    {serviceGroup.totalBookings} Bookings
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  <span>Available in: {serviceGroup.availableIn.join(", ")}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Providers Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {serviceGroup.providers.map((service) => (
                              <div
                                key={service.id}
                                className={`${colors.bg} p-4 rounded-lg border ${colors.border} hover:shadow-md transition-all`}
                              >
                                <div className="flex items-start gap-2 mb-3">
                                  {service.hospital.logo ? (
                                    <div className="w-12 h-12 rounded-lg overflow-hidden border-2 border-gray-200 flex-shrink-0">
                                      <Image
                                        src={service.hospital.logo}
                                        width={48}
                                        height={48}
                                        alt={service.hospital.name}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  ) : (
                                    <div className={`w-12 h-12 rounded-lg ${colors.bg} border-2 ${colors.border} flex items-center justify-center flex-shrink-0`}>
                                      <Building2 className={`w-6 h-6 ${colors.text}`} />
                                    </div>
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2">
                                      {service.hospital.name}
                                    </h4>
                                    <Badge className="bg-blue-100 text-blue-700 text-xs">
                                      <Star className="w-2.5 h-2.5 mr-0.5" />
                                      {service.hospital.avgRating}
                                    </Badge>
                                  </div>
                                </div>

                                <div className="space-y-2 text-xs mb-3">
                                  <div className="flex items-start gap-2">
                                    <MapPin className="w-3.5 h-3.5 text-gray-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700 line-clamp-2">{service.hospital.address}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Phone className="w-3.5 h-3.5 text-gray-500" />
                                    <span className="text-gray-700">{service.hospital.mobile}</span>
                                  </div>
                                  {service.hospital.experience && (
                                    <div className="flex items-center gap-2">
                                      <Award className="w-3.5 h-3.5 text-gray-500" />
                                      <span className="text-gray-700">{service.hospital.experience}+ years</span>
                                    </div>
                                  )}
                                </div>

                                <div className="bg-white rounded-lg p-2">
                                  {service.discount && parseInt(service.discount) > 0 && (
                                    <p className="text-xs text-gray-400 line-through">₹{service.startingPrice}</p>
                                  )}
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="text-xs text-gray-600">Starting from</p>
                                      <p className={`text-base font-bold ${colors.text}`}>₹{service.finalPrice}</p>
                                    </div>
                                    <button className={`px-2 py-1 ${colors.bg} ${colors.text} rounded-lg font-semibold text-xs ${colors.hover} transition-all border ${colors.border}`}>
                                      Book
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* All Services View */}
            {!loading && !error && viewMode === "all" && services.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  All Home Healthcare Services ({services.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services.map((service, index) => {
                    const color = getServiceColor(index);
                    const colors = colorClasses[color];
                    return (
                      <Card
                        key={service.id}
                        className={`border-2 ${colors.border} hover:shadow-xl transition-all cursor-pointer`}
                        onClick={() => router.push(`/home-healthcare/${encodeURIComponent(service.serviceName)}/${service.hospital.id}`)}
                      >
                        <CardContent className="p-5">
                          {/* Hospital Info */}
                          <div className="flex items-start gap-3 mb-4 pb-3 border-b">
                            {service.hospital.logo ? (
                              <div className="w-14 h-14 rounded-lg overflow-hidden border-2 border-gray-200 flex-shrink-0">
                                <Image
                                  src={service.hospital.logo}
                                  width={56}
                                  height={56}
                                  alt={service.hospital.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className={`w-14 h-14 rounded-lg ${colors.bg} border-2 ${colors.border} flex items-center justify-center flex-shrink-0`}>
                                <Building2 className={`w-7 h-7 ${colors.text}`} />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-gray-600 mb-1">Hospital</p>
                              <h4 className="text-sm font-bold text-gray-900 line-clamp-2">
                                {service.hospital.name}
                              </h4>
                              <Badge className="bg-blue-100 text-blue-700 text-xs mt-1">
                                <Star className="w-3 h-3 mr-1" />
                                {service.hospital.avgRating}
                              </Badge>
                            </div>
                          </div>

                          {/* Service Details */}
                          <div className={`${colors.bg} p-3 rounded-lg mb-3`}>
                            <h3 className="text-base font-bold text-gray-900 mb-1">
                              {service.serviceName}
                            </h3>
                            {service.discount && parseInt(service.discount) > 0 && (
                              <Badge className="bg-red-500 text-white text-xs mt-1">
                                {service.discount}% OFF
                              </Badge>
                            )}
                          </div>

                          {/* Location */}
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                            <MapPin className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">{service.hospital.city}, {service.hospital.state}</span>
                          </div>

                          {/* Features */}
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2">
                              <Home className={`w-4 h-4 ${colors.text}`} />
                              <span className="text-sm text-gray-700">Home Visit Service</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className={`w-4 h-4 ${colors.text}`} />
                              <span className="text-sm text-gray-700">24/7 Available</span>
                            </div>
                            {service.hospital.experience && (
                              <div className="flex items-center gap-2">
                                <Award className={`w-4 h-4 ${colors.text}`} />
                                <span className="text-sm text-gray-700">{service.hospital.experience}+ years exp</span>
                              </div>
                            )}
                          </div>

                          {/* Pricing & Actions */}
                          <div className="bg-white rounded-lg p-3">
                            {service.discount && parseInt(service.discount) > 0 && (
                              <p className="text-sm text-gray-400 line-through mb-1">₹{service.startingPrice}</p>
                            )}
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-xs text-gray-500">Starting from</p>
                                <p className={`text-xl font-bold ${colors.text}`}>
                                  ₹{service.finalPrice}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(`tel:${service.hospital.mobile}`, '_self');
                                  }}
                                  className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-all"
                                >
                                  <Phone className="w-4 h-4" />
                                </button>
                                <button className={`px-3 py-2 ${colors.bg} ${colors.text} rounded-lg font-semibold text-xs ${colors.hover} transition-all`}>
                                  Book
                                </button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Why Choose Home Healthcare */}
            {!loading && !error && (
              <div className="mt-8">
                <Card className="border-2 border-pink-200 bg-gradient-to-r from-pink-50 to-rose-50">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Sparkles className="w-6 h-6 text-pink-600" />
                      Benefits of Home Healthcare Services
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        {
                          icon: <Home className="w-5 h-5 text-pink-600" />,
                          title: "Comfort of Home",
                          desc: "Receive care in familiar surroundings",
                        },
                        {
                          icon: <UserCheck className="w-5 h-5 text-rose-600" />,
                          title: "Professional Care",
                          desc: "Qualified healthcare professionals",
                        },
                        {
                          icon: <IndianRupee className="w-5 h-5 text-red-600" />,
                          title: "Cost Effective",
                          desc: "More affordable than hospital stays",
                        },
                        {
                          icon: <HeartPulse className="w-5 h-5 text-fuchsia-600" />,
                          title: "Personalized",
                          desc: "One-on-one attention and care",
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
            {!loading && !error && hospitalService && (
              <div className="mt-6">
                <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      Current Hospital Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-3 bg-white p-4 rounded-lg">
                        <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-pink-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Hospital</p>
                          <p className="font-semibold text-gray-900">
                            {hospitalService?.hspInfo?.regname || "Hospital"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-white p-4 rounded-lg">
                        <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-rose-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Location</p>
                          <p className="font-semibold text-gray-900">
                            {hospitalService?.hspcontact?.city}, {hospitalService?.hspcontact?.state}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-white p-4 rounded-lg">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                          <Phone className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Contact</p>
                          <p className="font-semibold text-gray-900">
                            {hospitalService?.mobile || "Contact Hospital"}
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

export default HospitalHomeHealthcareList;

