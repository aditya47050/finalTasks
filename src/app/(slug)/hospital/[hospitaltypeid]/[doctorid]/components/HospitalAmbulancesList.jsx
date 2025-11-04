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
  Truck,
  User,
  CreditCard,
  AlertCircle,
  Timer,
  Navigation,
  Activity,
} from "lucide-react";
import { FaAmbulance } from "react-icons/fa";

const HospitalAmbulancesList = ({ onClose, hospitalService, serviceName }) => {
  const router = useRouter();
  const [ambulances, setAmbulances] = useState([]);
  const [groupedByType, setGroupedByType] = useState([]);
  const [groupedByHospital, setGroupedByHospital] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("byType"); // 'byType', 'byHospital', or 'all'

  // Fetch ambulances from API
  useEffect(() => {
    const fetchAmbulances = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/hospital/ambulances");
        const result = await response.json();

        if (result.success) {
          setAmbulances(result.data || []);
          setGroupedByType(result.groupedByType || []);
          setGroupedByHospital(result.groupedByHospital || []);
          setStatistics(result.statistics);
        } else {
          setError("Failed to load ambulance services");
        }
      } catch (err) {
        console.error("Error fetching ambulances:", err);
        setError("Failed to load ambulance services");
      } finally {
        setLoading(false);
      }
    };

    fetchAmbulances();
  }, []);

  const colorClasses = {
    orange: {
      bg: "bg-orange-50",
      border: "border-orange-200",
      text: "text-orange-600",
      hover: "hover:bg-orange-100",
      gradient: "from-orange-50 to-orange-100",
    },
    red: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-600",
      hover: "hover:bg-red-100",
      gradient: "from-red-50 to-red-100",
    },
    amber: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-600",
      hover: "hover:bg-amber-100",
      gradient: "from-amber-50 to-amber-100",
    },
    rose: {
      bg: "bg-rose-50",
      border: "border-rose-200",
      text: "text-rose-600",
      hover: "hover:bg-rose-100",
      gradient: "from-rose-50 to-rose-100",
    },
    yellow: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      text: "text-yellow-600",
      hover: "hover:bg-yellow-100",
      gradient: "from-yellow-50 to-yellow-100",
    },
  };

  const getAmbulanceColor = (index) => {
    const colors = ["orange", "red", "amber", "rose", "yellow"];
    return colors[index % colors.length];
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
      <div className="min-h-screen py-6 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-t-xl shadow-lg p-6 sticky top-0 z-10">
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
                    <FaAmbulance className="w-8 h-8" />
                    Hospital Ambulance Services
                  </h2>
                  <p className="text-white/90 mt-1">
                    24/7 emergency ambulance services available across locations
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
                onClick={() => setViewMode("byType")}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  viewMode === "byType"
                    ? "bg-white text-orange-600"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                By Type
              </button>
              <button
                onClick={() => setViewMode("byHospital")}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  viewMode === "byHospital"
                    ? "bg-white text-orange-600"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                By Hospital
              </button>
              <button
                onClick={() => setViewMode("all")}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  viewMode === "all"
                    ? "bg-white text-orange-600"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                All Ambulances
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="bg-gray-50 rounded-b-xl shadow-lg p-6">
            {/* Statistics Banner */}
            {statistics && !loading && (
              <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-2 border-orange-200 hover:shadow-lg transition-all">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <FaAmbulance className="w-6 h-6 text-orange-600" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-2xl mb-1">{statistics.totalAmbulances}</h4>
                    <p className="text-xs text-gray-600">Total Ambulances</p>
                  </CardContent>
                </Card>
                <Card className="border-2 border-red-200 hover:shadow-lg transition-all">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Building2 className="w-6 h-6 text-red-600" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-2xl mb-1">{statistics.totalHospitals}</h4>
                    <p className="text-xs text-gray-600">Hospitals</p>
                  </CardContent>
                </Card>
                <Card className="border-2 border-amber-200 hover:shadow-lg transition-all">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <MapPin className="w-6 h-6 text-amber-600" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-2xl mb-1">{statistics.totalCities}</h4>
                    <p className="text-xs text-gray-600">Cities Covered</p>
                  </CardContent>
                </Card>
                <Card className="border-2 border-rose-200 hover:shadow-lg transition-all">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Activity className="w-6 h-6 text-rose-600" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-2xl mb-1">24/7</h4>
                    <p className="text-xs text-gray-600">Availability</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Ambulance Benefits Banner */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                {
                  icon: <Timer className="w-6 h-6 text-orange-600" />,
                  title: "Quick Response",
                  desc: "Fast emergency response time",
                },
                {
                  icon: <Shield className="w-6 h-6 text-red-600" />,
                  title: "Trained Staff",
                  desc: "Professional paramedics on board",
                },
                {
                  icon: <Activity className="w-6 h-6 text-amber-600" />,
                  title: "24/7 Service",
                  desc: "Available round the clock",
                },
                {
                  icon: <CheckCircle className="w-6 h-6 text-rose-600" />,
                  title: "Equipped",
                  desc: "Modern medical equipment",
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
                <Loader2 className="w-12 h-12 text-orange-600 animate-spin mb-4" />
                <p className="text-gray-600 text-lg">Loading ambulance services...</p>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="flex flex-col items-center justify-center py-20">
                <X className="w-12 h-12 text-red-600 mb-4" />
                <p className="text-red-600 text-lg mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && ambulances.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20">
                <FaAmbulance className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-gray-600 text-lg">No ambulances available at the moment</p>
              </div>
            )}

            {/* Grouped By Type View */}
            {!loading && !error && viewMode === "byType" && groupedByType.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Ambulances by Type ({groupedByType.length})
                </h3>
                <div className="space-y-6">
                  {groupedByType.map((typeGroup, index) => {
                    const color = getAmbulanceColor(index);
                    const colors = colorClasses[color];
                    return (
                      <Card
                        key={index}
                        className={`border-2 ${colors.border} transition-all hover:shadow-xl`}
                      >
                        <CardContent className="p-6">
                          {/* Type Header */}
                          <div className="flex items-start gap-4 mb-6 pb-4 border-b">
                            <div className={`p-4 rounded-xl ${colors.bg} ${colors.text} flex-shrink-0`}>
                              <FaAmbulance className="w-8 h-8" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {typeGroup.ambulanceType}
                              </h3>
                              <div className="flex flex-wrap gap-2 mb-2">
                                <Badge className={`${colors.bg} ${colors.text} text-xs`}>
                                  <Truck className="w-3 h-3 mr-1" />
                                  {typeGroup.totalCount} Ambulance{typeGroup.totalCount > 1 ? "s" : ""}
                                </Badge>
                                <Badge className="bg-blue-100 text-blue-700 text-xs">
                                  <Building2 className="w-3 h-3 mr-1" />
                                  {typeGroup.totalHospitals} Hospital{typeGroup.totalHospitals > 1 ? "s" : ""}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  <span>Available in: {typeGroup.cities.join(", ")}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Ambulances Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {typeGroup.ambulances.map((ambulance) => (
                              <div
                                key={ambulance.id}
                                className={`${colors.bg} p-4 rounded-lg border ${colors.border} hover:shadow-md transition-all`}
                              >
                                {ambulance.imageFront && (
                                  <div className="w-full h-32 rounded-lg overflow-hidden mb-3">
                                    <Image
                                      src={ambulance.imageFront}
                                      width={300}
                                      height={200}
                                      alt={ambulance.ambulanceType}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                )}

                                <div className="mb-3">
                                  <h4 className="font-bold text-gray-900 text-sm mb-1">
                                    {ambulance.hospital.name}
                                  </h4>
                                  <p className="text-xs text-gray-600">RC: {ambulance.ambulanceRCNo}</p>
                                </div>

                                <div className="space-y-2 text-xs">
                                  <div className="flex items-start gap-2">
                                    <MapPin className="w-3.5 h-3.5 text-gray-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700 line-clamp-2">{ambulance.hospital.address}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Phone className="w-3.5 h-3.5 text-gray-500" />
                                    <span className="text-gray-700">{ambulance.hospital.mobile}</span>
                                  </div>
                                  {ambulance.driverName && (
                                    <div className="flex items-center gap-2">
                                      <User className="w-3.5 h-3.5 text-gray-500" />
                                      <span className="text-gray-700">Driver: {ambulance.driverName}</span>
                                    </div>
                                  )}
                                </div>

                                <button
                                  onClick={() => window.open(`tel:${ambulance.hospital.mobile}`, '_self')}
                                  className={`w-full mt-3 px-3 py-2 bg-green-600 text-white rounded-lg font-semibold text-xs hover:bg-green-700 transition-all flex items-center justify-center gap-2`}
                                >
                                  <Phone className="w-3 h-3" />
                                  Call Emergency
                                </button>
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

            {/* Grouped By Hospital View */}
            {!loading && !error && viewMode === "byHospital" && groupedByHospital.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Hospitals with Ambulances ({groupedByHospital.length})
                </h3>
                <div className="space-y-6">
                  {groupedByHospital.map((hospitalGroup, index) => {
                    const color = getAmbulanceColor(index);
                    const colors = colorClasses[color];
                    return (
                      <Card
                        key={hospitalGroup.hospital.id}
                        className={`border-2 ${colors.border} transition-all hover:shadow-xl`}
                      >
                        <CardContent className="p-6">
                          {/* Hospital Header */}
                          <div className="flex items-start gap-4 mb-6 pb-4 border-b">
                            {hospitalGroup.hospital.logo && (
                              <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-gray-200 flex-shrink-0">
                                <Image
                                  src={hospitalGroup.hospital.logo}
                                  width={64}
                                  height={64}
                                  alt={hospitalGroup.hospital.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {hospitalGroup.hospital.name}
                              </h3>
                              <div className="flex flex-wrap gap-2 mb-2">
                                <Badge className={`${colors.bg} ${colors.text} text-xs`}>
                                  <FaAmbulance className="w-3 h-3 mr-1" />
                                  {hospitalGroup.totalAmbulances} Ambulance{hospitalGroup.totalAmbulances > 1 ? "s" : ""}
                                </Badge>
                                <Badge className="bg-blue-100 text-blue-700 text-xs">
                                  <Star className="w-3 h-3 mr-1" />
                                  {hospitalGroup.hospital.avgRating} ({hospitalGroup.hospital.totalReviews})
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  <span>{hospitalGroup.hospital.city}, {hospitalGroup.hospital.state}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Phone className="w-4 h-4" />
                                  <span>{hospitalGroup.hospital.mobile}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Ambulances Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {hospitalGroup.ambulances.map((ambulance) => (
                              <div
                                key={ambulance.id}
                                className={`${colors.bg} p-4 rounded-lg border ${colors.border} hover:shadow-md transition-all`}
                              >
                                {ambulance.imageFront && (
                                  <div className="w-full h-32 rounded-lg overflow-hidden mb-3">
                                    <Image
                                      src={ambulance.imageFront}
                                      width={300}
                                      height={200}
                                      alt={ambulance.ambulanceType}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                )}

                                <div className="space-y-2 text-xs">
                                  <div className="flex items-center gap-2">
                                    <Truck className={`w-3.5 h-3.5 ${colors.text}`} />
                                    <span className="font-semibold text-gray-900">{ambulance.ambulanceType}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <CreditCard className="w-3.5 h-3.5 text-gray-500" />
                                    <span className="text-gray-700">RC: {ambulance.ambulanceRCNo}</span>
                                  </div>
                                  {ambulance.driverName && (
                                    <div className="flex items-center gap-2">
                                      <User className="w-3.5 h-3.5 text-gray-500" />
                                      <span className="text-gray-700">{ambulance.driverName}</span>
                                    </div>
                                  )}
                                  {ambulance.driverContact && (
                                    <div className="flex items-center gap-2">
                                      <Phone className="w-3.5 h-3.5 text-gray-500" />
                                      <span className="text-gray-700">{ambulance.driverContact}</span>
                                    </div>
                                  )}
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

            {/* All Ambulances View */}
            {!loading && !error && viewMode === "all" && ambulances.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  All Available Ambulances ({ambulances.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ambulances.map((ambulance, index) => {
                    const color = getAmbulanceColor(index);
                    const colors = colorClasses[color];
                    return (
                      <Card
                        key={ambulance.id}
                        className={`border-2 ${colors.border} hover:shadow-xl transition-all`}
                      >
                        <CardContent className="p-5">
                          {/* Ambulance Image */}
                          {ambulance.imageFront && (
                            <div className="w-full h-40 rounded-lg overflow-hidden mb-4">
                              <Image
                                src={ambulance.imageFront}
                                width={400}
                                height={300}
                                alt={ambulance.ambulanceType}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}

                          {/* Ambulance Details */}
                          <div className={`${colors.bg} p-3 rounded-lg mb-3`}>
                            <h3 className="text-base font-bold text-gray-900 mb-1">
                              {ambulance.ambulanceType}
                            </h3>
                            <p className="text-xs text-gray-600">{ambulance.ambulanceCategory}</p>
                          </div>

                          {/* Hospital Info */}
                          <div className="flex items-start gap-2 mb-3">
                            {ambulance.hospital.logo ? (
                              <div className="w-10 h-10 rounded-lg overflow-hidden border-2 border-gray-200 flex-shrink-0">
                                <Image
                                  src={ambulance.hospital.logo}
                                  width={40}
                                  height={40}
                                  alt={ambulance.hospital.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className={`w-10 h-10 rounded-lg ${colors.bg} border-2 ${colors.border} flex items-center justify-center flex-shrink-0`}>
                                <Building2 className={`w-5 h-5 ${colors.text}`} />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 text-sm line-clamp-1">
                                {ambulance.hospital.name}
                              </p>
                              <p className="text-xs text-gray-600">{ambulance.hospital.city}, {ambulance.hospital.state}</p>
                            </div>
                          </div>

                          {/* Driver Info */}
                          {ambulance.driverName && (
                            <div className="bg-gray-50 p-3 rounded-lg mb-3">
                              <div className="flex items-center gap-2 mb-1">
                                <User className="w-4 h-4 text-gray-600" />
                                <span className="text-xs font-semibold text-gray-900">Driver: {ambulance.driverName}</span>
                              </div>
                              {ambulance.driverContact && (
                                <p className="text-xs text-gray-600">Contact: {ambulance.driverContact}</p>
                              )}
                              {ambulance.driverLicense && (
                                <p className="text-xs text-gray-600">License: {ambulance.driverLicense}</p>
                              )}
                            </div>
                          )}

                          {/* Registration */}
                          <div className="mb-4">
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <CreditCard className="w-3.5 h-3.5" />
                              <span>RC No: {ambulance.ambulanceRCNo}</span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2">
                            <button 
                              onClick={() => window.open(`tel:${ambulance.hospital.mobile}`, '_self')}
                              className="flex-1 bg-red-600 text-white rounded-lg font-semibold text-xs py-2 hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                            >
                              <Phone className="w-3 h-3" />
                              Emergency Call
                            </button>
                            <button 
                              onClick={() => window.open(`tel:${ambulance.driverContact || ambulance.hospital.mobile}`, '_self')}
                              className={`px-3 py-2 ${colors.bg} ${colors.text} rounded-lg font-semibold text-xs ${colors.hover} transition-all`}
                            >
                              <Phone className="w-3 h-3" />
                            </button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Why Choose Hospital Ambulances */}
            {!loading && !error && (
              <div className="mt-8">
                <Card className="border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-red-50">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Sparkles className="w-6 h-6 text-orange-600" />
                      Why Choose Our Ambulance Services?
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        {
                          icon: <Timer className="w-5 h-5 text-orange-600" />,
                          title: "Rapid Response",
                          desc: "Quick emergency response time",
                        },
                        {
                          icon: <Shield className="w-5 h-5 text-red-600" />,
                          title: "Trained Paramedics",
                          desc: "Qualified medical staff on board",
                        },
                        {
                          icon: <Activity className="w-5 h-5 text-amber-600" />,
                          title: "24/7 Availability",
                          desc: "Always ready for emergencies",
                        },
                        {
                          icon: <CheckCircle className="w-5 h-5 text-rose-600" />,
                          title: "Modern Equipment",
                          desc: "Advanced life-saving equipment",
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
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Hospital</p>
                          <p className="font-semibold text-gray-900">
                            {hospitalService?.hspInfo?.regname || "Hospital"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-white p-4 rounded-lg">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Location</p>
                          <p className="font-semibold text-gray-900">
                            {hospitalService?.hspcontact?.city}, {hospitalService?.hspcontact?.state}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-white p-4 rounded-lg">
                        <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                          <Phone className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Emergency</p>
                          <p className="font-semibold text-gray-900">
                            {hospitalService?.mobile || "108"}
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

export default HospitalAmbulancesList;

