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
  CreditCard,
  Sparkles,
  TrendingUp,
  Building2,
  BadgeCheck,
  Wallet,
  Banknote,
  HandCoins,
  CircleDollarSign,
  ShieldCheck,
  Verified,
} from "lucide-react";

const CashlessList = ({ onClose, pathologyService, serviceName }) => {
  const router = useRouter();
  const [hospitals, setHospitals] = useState([]);
  const [groupedByInsurance, setGroupedByInsurance] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("grouped"); // 'grouped' or 'all'

  // Fetch cashless services from API
  useEffect(() => {
    const fetchCashlessServices = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/pathology/cashless-services");
        const result = await response.json();

        if (result.success) {
          setHospitals(result.data || []);
          setGroupedByInsurance(result.grouped || []);
          setStatistics(result.statistics);
        } else {
          setError("Failed to load cashless services");
        }
      } catch (err) {
        console.error("Error fetching cashless services:", err);
        setError("Failed to load cashless services");
      } finally {
        setLoading(false);
      }
    };

    fetchCashlessServices();
  }, []);

  const colorClasses = {
    orange: {
      bg: "bg-orange-50",
      border: "border-orange-200",
      text: "text-orange-600",
      hover: "hover:bg-orange-100",
      gradient: "from-orange-50 to-orange-100",
    },
    amber: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-600",
      hover: "hover:bg-amber-100",
      gradient: "from-amber-50 to-amber-100",
    },
    yellow: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      text: "text-yellow-600",
      hover: "hover:bg-yellow-100",
      gradient: "from-yellow-50 to-yellow-100",
    },
    lime: {
      bg: "bg-lime-50",
      border: "border-lime-200",
      text: "text-lime-600",
      hover: "hover:bg-lime-100",
      gradient: "from-lime-50 to-lime-100",
    },
    rose: {
      bg: "bg-rose-50",
      border: "border-rose-200",
      text: "text-rose-600",
      hover: "hover:bg-rose-100",
      gradient: "from-rose-50 to-rose-100",
    },
  };

  const getCashlessColor = (index) => {
    const colors = ["orange", "amber", "yellow", "lime", "rose"];
    return colors[index % colors.length];
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
      <div className="min-h-screen py-6 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-t-xl shadow-lg p-6 sticky top-0 z-10">
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
                    <CreditCard className="w-8 h-8" />
                    Cashless Insurance Services
                  </h2>
                  <p className="text-white/90 mt-1">
                    Hassle-free pathology services with direct insurance billing
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
                    ? "bg-white text-orange-600"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                By Insurance Provider
              </button>
              <button
                onClick={() => setViewMode("all")}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  viewMode === "all"
                    ? "bg-white text-orange-600"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                All Labs
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
                      <CreditCard className="w-6 h-6 text-orange-600" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-2xl mb-1">{statistics.totalInsuranceProviders}</h4>
                    <p className="text-xs text-gray-600">Insurance Companies</p>
                  </CardContent>
                </Card>
                <Card className="border-2 border-amber-200 hover:shadow-lg transition-all">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Building2 className="w-6 h-6 text-amber-600" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-2xl mb-1">{statistics.totalHospitals}</h4>
                    <p className="text-xs text-gray-600">Empaneled Labs</p>
                  </CardContent>
                </Card>
                <Card className="border-2 border-yellow-200 hover:shadow-lg transition-all">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <MapPin className="w-6 h-6 text-yellow-600" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-2xl mb-1">{statistics.totalCities}</h4>
                    <p className="text-xs text-gray-600">Cities Covered</p>
                  </CardContent>
                </Card>
                <Card className="border-2 border-lime-200 hover:shadow-lg transition-all">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-lime-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Shield className="w-6 h-6 text-lime-600" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-2xl mb-1">{statistics.nablAccredited}</h4>
                    <p className="text-xs text-gray-600">NABL Certified</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Cashless Benefits Banner */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                {
                  icon: <Wallet className="w-6 h-6 text-orange-600" />,
                  title: "No Upfront Payment",
                  desc: "Direct billing to insurance",
                },
                {
                  icon: <ShieldCheck className="w-6 h-6 text-amber-600" />,
                  title: "TPA Approved",
                  desc: "Verified insurance partners",
                },
                {
                  icon: <CircleDollarSign className="w-6 h-6 text-yellow-600" />,
                  title: "Hassle-Free",
                  desc: "Simple claim process",
                },
                {
                  icon: <BadgeCheck className="w-6 h-6 text-lime-600" />,
                  title: "Quick Approval",
                  desc: "Fast processing time",
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
                <p className="text-gray-600 text-lg">Loading cashless services...</p>
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
            {!loading && !error && hospitals.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20">
                <CreditCard className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-gray-600 text-lg">No cashless services available at the moment</p>
              </div>
            )}

            {/* Grouped By Insurance Provider View */}
            {!loading && !error && viewMode === "grouped" && groupedByInsurance.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Insurance Partners ({groupedByInsurance.length})
                </h3>
                <div className="space-y-6">
                  {groupedByInsurance.map((insuranceGroup, index) => {
                    const color = getCashlessColor(index);
                    const colors = colorClasses[color];
                    return (
                      <Card
                        key={index}
                        className={`border-2 ${colors.border} transition-all hover:shadow-xl`}
                      >
                        <CardContent className="p-6">
                          {/* Insurance Provider Header */}
                          <div className="flex items-start gap-4 mb-6 pb-4 border-b">
                            <div className={`p-4 rounded-xl ${colors.bg} ${colors.text} flex-shrink-0`}>
                              <CreditCard className="w-8 h-8" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {insuranceGroup.insuranceName}
                              </h3>
                              <div className="flex flex-wrap gap-2 mb-2">
                                <Badge className={`${colors.bg} ${colors.text} text-xs`}>
                                  <Building2 className="w-3 h-3 mr-1" />
                                  {insuranceGroup.totalProviders} Lab{insuranceGroup.totalProviders > 1 ? "s" : ""}
                                </Badge>
                                <Badge className="bg-green-100 text-green-700 text-xs">
                                  <BadgeCheck className="w-3 h-3 mr-1" />
                                  TPA Approved
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  <span>Available in: {insuranceGroup.availableIn}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Labs Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {insuranceGroup.hospitals.map((hospital) => (
                              <div
                                key={hospital.id}
                                className={`${colors.bg} p-4 rounded-lg border ${colors.border} hover:shadow-md transition-all cursor-pointer`}
                                onClick={() => router.push(`/pathology/hospital/${hospital.id}`)}
                              >
                                <div className="flex items-start gap-2 mb-3">
                                  {hospital.logo ? (
                                    <div className="w-12 h-12 rounded-lg overflow-hidden border-2 border-gray-200 flex-shrink-0">
                                      <Image
                                        src={hospital.logo}
                                        width={48}
                                        height={48}
                                        alt={hospital.hospitalName}
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
                                      {hospital.hospitalName}
                                    </h4>
                                    <div className="flex flex-wrap gap-1">
                                      {hospital.nabl && (
                                        <Badge className="bg-green-100 text-green-700 text-xs">
                                          <Shield className="w-2.5 h-2.5 mr-0.5" />
                                          NABL
                                        </Badge>
                                      )}
                                      <Badge className="bg-blue-100 text-blue-700 text-xs">
                                        <Star className="w-2.5 h-2.5 mr-0.5" />
                                        {hospital.avgRating}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-2 text-xs">
                                  <div className="flex items-start gap-2">
                                    <MapPin className="w-3.5 h-3.5 text-gray-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700 line-clamp-2">{hospital.address}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Phone className="w-3.5 h-3.5 text-gray-500" />
                                    <span className="text-gray-700">{hospital.mobile}</span>
                                  </div>
                                  {hospital.experience && (
                                    <div className="flex items-center gap-2">
                                      <Award className="w-3.5 h-3.5 text-gray-500" />
                                      <span className="text-gray-700">{hospital.experience}+ years exp</span>
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

            {/* All Labs View */}
            {!loading && !error && viewMode === "all" && hospitals.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  All Cashless Pathology Labs ({hospitals.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {hospitals.map((hospital, index) => {
                    const color = getCashlessColor(index);
                    const colors = colorClasses[color];
                    return (
                      <Card
                        key={hospital.id}
                        className={`border-2 ${colors.border} hover:shadow-xl transition-all cursor-pointer`}
                        onClick={() => router.push(`/pathology/hospital/${hospital.id}`)}
                      >
                        <CardContent className="p-5">
                          {/* Hospital Header */}
                          <div className="flex items-start gap-3 mb-4">
                            {hospital.logo ? (
                              <div className="w-14 h-14 rounded-lg overflow-hidden border-2 border-gray-200 flex-shrink-0">
                                <Image
                                  src={hospital.logo}
                                  width={56}
                                  height={56}
                                  alt={hospital.hospitalName}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className={`w-14 h-14 rounded-lg ${colors.bg} border-2 ${colors.border} flex items-center justify-center flex-shrink-0`}>
                                <Building2 className={`w-7 h-7 ${colors.text}`} />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h3 className="text-base font-bold text-gray-900 mb-1 line-clamp-2">
                                {hospital.hospitalName}
                              </h3>
                              <div className="flex flex-wrap gap-1">
                                <Badge className={`${colors.bg} ${colors.text} text-xs`}>
                                  <CreditCard className="w-3 h-3 mr-1" />
                                  Cashless
                                </Badge>
                                {hospital.nabl && (
                                  <Badge className="bg-green-100 text-green-700 text-xs">
                                    <Shield className="w-3 h-3 mr-1" />
                                    NABL
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Insurance Providers */}
                          <div className={`${colors.bg} p-3 rounded-lg mb-3`}>
                            <p className="text-xs text-gray-600 mb-1 font-semibold">Accepted Insurance</p>
                            <div className="space-y-1">
                              {hospital.insuranceProviders.slice(0, 3).map((provider, idx) => (
                                <div key={idx} className="flex items-center gap-1">
                                  <CheckCircle className={`w-3 h-3 ${colors.text} flex-shrink-0`} />
                                  <span className="text-xs text-gray-700 line-clamp-1">{provider}</span>
                                </div>
                              ))}
                              {hospital.totalInsuranceProviders > 3 && (
                                <p className="text-xs text-gray-600 italic">+{hospital.totalInsuranceProviders - 3} more providers</p>
                              )}
                            </div>
                          </div>

                          {/* Location */}
                          <div className="space-y-2 mb-4 text-sm">
                            <div className="flex items-start gap-2">
                              <MapPin className={`w-4 h-4 ${colors.text} flex-shrink-0 mt-0.5`} />
                              <span className="text-gray-700 line-clamp-2">{hospital.address}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <Phone className={`w-3.5 h-3.5 ${colors.text}`} />
                              <span className="text-gray-700">{hospital.mobile}</span>
                            </div>
                          </div>

                          {/* Experience Badge */}
                          {hospital.experience && (
                            <div className="flex items-center gap-2 mb-4 text-xs text-gray-600 bg-gray-50 p-2 rounded-lg">
                              <Award className="w-4 h-4 text-orange-600" />
                              <span>{hospital.experience}+ years experience</span>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex gap-2">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(`tel:${hospital.mobile}`, '_self');
                              }}
                              className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-all"
                            >
                              <Phone className="w-4 h-4" />
                            </button>
                            <button className={`flex-1 px-3 py-2 ${colors.bg} ${colors.text} rounded-lg font-semibold text-xs ${colors.hover} transition-all`}>
                              View Details
                            </button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Why Choose Cashless Services */}
            {!loading && !error && (
              <div className="mt-8">
                <Card className="border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Sparkles className="w-6 h-6 text-orange-600" />
                      Benefits of Cashless Insurance Services
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        {
                          icon: <Wallet className="w-5 h-5 text-orange-600" />,
                          title: "Zero Cash Payment",
                          desc: "No upfront payment required at lab",
                        },
                        {
                          icon: <ShieldCheck className="w-5 h-5 text-amber-600" />,
                          title: "Insurance Verified",
                          desc: "Pre-approved TPA partnerships",
                        },
                        {
                          icon: <CircleDollarSign className="w-5 h-5 text-yellow-600" />,
                          title: "Simple Process",
                          desc: "Easy claim settlement procedure",
                        },
                        {
                          icon: <BadgeCheck className="w-5 h-5 text-lime-600" />,
                          title: "Fast Approval",
                          desc: "Quick cashless authorization",
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
            {!loading && !error && pathologyService && (
              <div className="mt-6">
                <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      Current Service Provider Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-3 bg-white p-4 rounded-lg">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                          <Shield className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Provider</p>
                          <p className="font-semibold text-gray-900">
                            {pathologyService?.hospital?.hspInfo?.regname || "Pathology Lab"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-white p-4 rounded-lg">
                        <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Location</p>
                          <p className="font-semibold text-gray-900">
                            {pathologyService?.hospital?.hspcontact?.city}, {pathologyService?.hospital?.hspcontact?.state}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-white p-4 rounded-lg">
                        <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                          <Phone className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Contact</p>
                          <p className="font-semibold text-gray-900">
                            {pathologyService?.hospital?.mobile || "Contact Provider"}
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

export default CashlessList;

