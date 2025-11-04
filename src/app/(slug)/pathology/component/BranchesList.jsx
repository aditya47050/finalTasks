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
  Building2,
  Sparkles,
  TrendingUp,
  Mail,
  User,
  MapPinned,
  Navigation,
  Building,
  Network,
} from "lucide-react";

const BranchesList = ({ onClose, pathologyService, serviceName }) => {
  const router = useRouter();
  const [branches, setBranches] = useState([]);
  const [groupedByHospital, setGroupedByHospital] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("grouped"); // 'grouped' or 'all'

  // Fetch branches from API
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/pathology/branches");
        const result = await response.json();

        if (result.success) {
          setBranches(result.data || []);
          setGroupedByHospital(result.grouped || []);
          setStatistics(result.statistics);
        } else {
          setError("Failed to load branches");
        }
      } catch (err) {
        console.error("Error fetching branches:", err);
        setError("Failed to load branches");
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, []);

  const colorClasses = {
    purple: {
      bg: "bg-purple-50",
      border: "border-purple-200",
      text: "text-purple-600",
      hover: "hover:bg-purple-100",
      gradient: "from-purple-50 to-purple-100",
    },
    indigo: {
      bg: "bg-indigo-50",
      border: "border-indigo-200",
      text: "text-indigo-600",
      hover: "hover:bg-indigo-100",
      gradient: "from-indigo-50 to-indigo-100",
    },
    violet: {
      bg: "bg-violet-50",
      border: "border-violet-200",
      text: "text-violet-600",
      hover: "hover:bg-violet-100",
      gradient: "from-violet-50 to-violet-100",
    },
    fuchsia: {
      bg: "bg-fuchsia-50",
      border: "border-fuchsia-200",
      text: "text-fuchsia-600",
      hover: "hover:bg-fuchsia-100",
      gradient: "from-fuchsia-50 to-fuchsia-100",
    },
    pink: {
      bg: "bg-pink-50",
      border: "border-pink-200",
      text: "text-pink-600",
      hover: "hover:bg-pink-100",
      gradient: "from-pink-50 to-pink-100",
    },
  };

  const getBranchColor = (index) => {
    const colors = ["purple", "indigo", "violet", "fuchsia", "pink"];
    return colors[index % colors.length];
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
      <div className="min-h-screen py-6 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-t-xl shadow-lg p-6 sticky top-0 z-10">
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
                    <Building2 className="w-8 h-8" />
                    Pathology Lab Branches
                  </h2>
                  <p className="text-white/90 mt-1">
                    Find our diagnostic centers near you across multiple locations
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
                    ? "bg-white text-purple-600"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                By Hospital
              </button>
              <button
                onClick={() => setViewMode("all")}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  viewMode === "all"
                    ? "bg-white text-purple-600"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                All Branches
              </button>
            </div>
          </div>

          {/* Branches Content */}
          <div className="bg-gray-50 rounded-b-xl shadow-lg p-6">
            {/* Statistics Banner */}
            {statistics && !loading && (
              <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-2 border-purple-200 hover:shadow-lg transition-all">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Building2 className="w-6 h-6 text-purple-600" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-2xl mb-1">{statistics.totalBranches}</h4>
                    <p className="text-xs text-gray-600">Total Branches</p>
                  </CardContent>
                </Card>
                <Card className="border-2 border-indigo-200 hover:shadow-lg transition-all">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Network className="w-6 h-6 text-indigo-600" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-2xl mb-1">{statistics.totalHospitals}</h4>
                    <p className="text-xs text-gray-600">Lab Networks</p>
                  </CardContent>
                </Card>
                <Card className="border-2 border-violet-200 hover:shadow-lg transition-all">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <MapPinned className="w-6 h-6 text-violet-600" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-2xl mb-1">{statistics.totalCities}</h4>
                    <p className="text-xs text-gray-600">Cities Covered</p>
                  </CardContent>
                </Card>
                <Card className="border-2 border-fuchsia-200 hover:shadow-lg transition-all">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-fuchsia-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Navigation className="w-6 h-6 text-fuchsia-600" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-2xl mb-1">{statistics.totalStates}</h4>
                    <p className="text-xs text-gray-600">States</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Branch Benefits Banner */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                {
                  icon: <Building2 className="w-6 h-6 text-purple-600" />,
                  title: "Multiple Locations",
                  desc: "Branches across cities",
                },
                {
                  icon: <Shield className="w-6 h-6 text-indigo-600" />,
                  title: "NABL Certified",
                  desc: "Quality across all branches",
                },
                {
                  icon: <Users className="w-6 h-6 text-violet-600" />,
                  title: "Trained Staff",
                  desc: "Professional team at each branch",
                },
                {
                  icon: <CheckCircle className="w-6 h-6 text-fuchsia-600" />,
                  title: "Verified Branches",
                  desc: "All locations are verified",
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
                <Loader2 className="w-12 h-12 text-purple-600 animate-spin mb-4" />
                <p className="text-gray-600 text-lg">Loading branches...</p>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="flex flex-col items-center justify-center py-20">
                <X className="w-12 h-12 text-red-600 mb-4" />
                <p className="text-red-600 text-lg mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && branches.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20">
                <Building2 className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-gray-600 text-lg">No branches available at the moment</p>
              </div>
            )}

            {/* Grouped By Hospital View */}
            {!loading && !error && viewMode === "grouped" && groupedByHospital.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Pathology Labs with Branches ({groupedByHospital.length})
                </h3>
                <div className="space-y-6">
                  {groupedByHospital.map((hospitalGroup, index) => {
                    const color = getBranchColor(index);
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
                                  <Building2 className="w-3 h-3 mr-1" />
                                  {hospitalGroup.totalBranches} Branch{hospitalGroup.totalBranches > 1 ? "es" : ""}
                                </Badge>
                                {hospitalGroup.hospital.nabl && (
                                  <Badge className="bg-green-100 text-green-700 text-xs">
                                    <Shield className="w-3 h-3 mr-1" />
                                    NABL
                                  </Badge>
                                )}
                                <Badge className="bg-blue-100 text-blue-700 text-xs">
                                  <Star className="w-3 h-3 mr-1" />
                                  {hospitalGroup.hospital.avgRating} ({hospitalGroup.hospital.totalReviews})
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Award className="w-4 h-4" />
                                  <span>{hospitalGroup.hospital.experience}+ years</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  <span>{hospitalGroup.cities.join(", ")}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Branches Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {hospitalGroup.branches.map((branch) => (
                              <div
                                key={branch.id}
                                className={`${colors.bg} p-4 rounded-lg border ${colors.border} hover:shadow-md transition-all`}
                              >
                                <div className="flex items-start gap-2 mb-3">
                                  <Building className={`w-5 h-5 ${colors.text} flex-shrink-0 mt-1`} />
                                  <div className="flex-1">
                                    <h4 className="font-bold text-gray-900 text-sm mb-1">
                                      {branch.branchName}
                                    </h4>
                                    <p className="text-xs text-gray-600">Reg: {branch.branchRegNo}</p>
                                  </div>
                                </div>

                                <div className="space-y-2 text-xs">
                                  <div className="flex items-start gap-2">
                                    <MapPin className="w-3.5 h-3.5 text-gray-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700 line-clamp-2">{branch.branchAddress}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <MapPinned className="w-3.5 h-3.5 text-gray-500" />
                                    <span className="text-gray-700">{branch.branchCity}, {branch.branchState}</span>
                                  </div>
                                  {branch.branchReceptionNo1 && (
                                    <div className="flex items-center gap-2">
                                      <Phone className="w-3.5 h-3.5 text-gray-500" />
                                      <span className="text-gray-700">{branch.branchReceptionNo1}</span>
                                    </div>
                                  )}
                                  {branch.branchManagerName && (
                                    <div className="flex items-center gap-2">
                                      <User className="w-3.5 h-3.5 text-gray-500" />
                                      <span className="text-gray-700">{branch.branchManagerName}</span>
                                    </div>
                                  )}
                                </div>

                                <button
                                  onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(branch.branchAddress + ", " + branch.branchCity)}`, '_blank')}
                                  className={`w-full mt-3 px-3 py-2 ${colors.bg} ${colors.text} border ${colors.border} rounded-lg font-semibold text-xs hover:shadow transition-all flex items-center justify-center gap-2`}
                                >
                                  <Navigation className="w-3 h-3" />
                                  Get Directions
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

            {/* All Branches View */}
            {!loading && !error && viewMode === "all" && branches.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  All Branches ({branches.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {branches.map((branch, index) => {
                    const color = getBranchColor(index);
                    const colors = colorClasses[color];
                    return (
                      <Card
                        key={branch.id}
                        className={`border-2 ${colors.border} hover:shadow-xl transition-all`}
                      >
                        <CardContent className="p-5">
                          {/* Hospital Info */}
                          <div className="flex items-start gap-3 mb-4 pb-3 border-b">
                            {branch.hospital.logo && (
                              <div className="w-12 h-12 rounded-lg overflow-hidden border-2 border-gray-200 flex-shrink-0">
                                <Image
                                  src={branch.hospital.logo}
                                  width={48}
                                  height={48}
                                  alt={branch.hospital.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-gray-600 mb-1">Parent Lab</p>
                              <h4 className="text-sm font-bold text-gray-900 line-clamp-1">
                                {branch.hospital.name}
                              </h4>
                            </div>
                          </div>

                          {/* Branch Details */}
                          <div className={`${colors.bg} p-3 rounded-lg mb-3`}>
                            <h3 className="text-base font-bold text-gray-900 mb-1">
                              {branch.branchName}
                            </h3>
                            <p className="text-xs text-gray-600">Reg: {branch.branchRegNo}</p>
                          </div>

                          <div className="space-y-2 mb-4 text-sm">
                            <div className="flex items-start gap-2">
                              <MapPin className={`w-4 h-4 ${colors.text} flex-shrink-0 mt-0.5`} />
                              <span className="text-gray-700 line-clamp-2">{branch.branchAddress}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPinned className={`w-4 h-4 ${colors.text}`} />
                              <span className="text-gray-700">{branch.branchCity}, {branch.branchState} - {branch.branchPincode}</span>
                            </div>
                          </div>

                          {/* Contact Info */}
                          {(branch.branchReceptionNo1 || branch.branchManagerName) && (
                            <div className="space-y-2 mb-4 text-xs bg-gray-50 p-3 rounded-lg">
                              {branch.branchReceptionNo1 && (
                                <div className="flex items-center gap-2">
                                  <Phone className="w-3.5 h-3.5 text-purple-600" />
                                  <span className="text-gray-700">{branch.branchReceptionNo1}</span>
                                </div>
                              )}
                              {branch.branchManagerName && (
                                <div className="flex items-center gap-2">
                                  <User className="w-3.5 h-3.5 text-indigo-600" />
                                  <span className="text-gray-700">{branch.branchManagerName}</span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex gap-2">
                            <button 
                              onClick={() => window.open(`tel:${branch.branchReceptionNo1 || branch.hospital.mobile}`, '_self')}
                              className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-all"
                            >
                              <Phone className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(branch.branchAddress + ", " + branch.branchCity)}`, '_blank')}
                              className={`flex-1 px-3 py-2 ${colors.bg} ${colors.text} rounded-lg font-semibold text-xs ${colors.hover} transition-all flex items-center justify-center gap-2`}
                            >
                              <Navigation className="w-3 h-3" />
                              Get Directions
                            </button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Why Choose Multiple Branches */}
            {!loading && !error && (
              <div className="mt-8">
                <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Sparkles className="w-6 h-6 text-purple-600" />
                      Why Choose Our Multi-Branch Network?
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        {
                          icon: <Building2 className="w-5 h-5 text-purple-600" />,
                          title: "Convenient Locations",
                          desc: "Multiple branches for easy access",
                        },
                        {
                          icon: <Shield className="w-5 h-5 text-indigo-600" />,
                          title: "Consistent Quality",
                          desc: "Same standards across all branches",
                        },
                        {
                          icon: <Users className="w-5 h-5 text-violet-600" />,
                          title: "Expert Team",
                          desc: "Trained professionals at every location",
                        },
                        {
                          icon: <CheckCircle className="w-5 h-5 text-fuchsia-600" />,
                          title: "Verified Centers",
                          desc: "All branches are certified and verified",
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
                <Card className="border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-red-50">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      Current Service Provider Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-3 bg-white p-4 rounded-lg">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <Shield className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Provider</p>
                          <p className="font-semibold text-gray-900">
                            {pathologyService?.hospital?.hspInfo?.regname || "Pathology Lab"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-white p-4 rounded-lg">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Location</p>
                          <p className="font-semibold text-gray-900">
                            {pathologyService?.hospital?.hspcontact?.city}, {pathologyService?.hospital?.hspcontact?.state}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-white p-4 rounded-lg">
                        <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center">
                          <Phone className="w-5 h-5 text-violet-600" />
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

export default BranchesList;

