"use client";

import React, { useEffect, useState } from "react";
import {
  X,
  HeartPulse,
  Loader2,
  CheckCircle,
  AlertTriangle,
  BadgePercent,
  Home,
  Wallet,
  ClipboardList,
  Stethoscope,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function HospitalWellnessList({ onClose, hospitalService }) {
  const router = useRouter();

  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const hospitalId = hospitalService?.id || hospitalService?._id;
    if (!hospitalId) return;

    const fetchPackages = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/hospital/${hospitalId}/wellness`);
        if (res.data.success) {
          setPackages(res.data.wellnessPackages);
        } else {
          setError("Failed to load wellness packages.");
        }
      } catch (err) {
        console.error("🔥 Error fetching wellness packages:", err);
        setError("Error fetching wellness package data.");
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [hospitalService?.id, hospitalService?._id]);

  const filteredPackages =
    filter === "all"
      ? packages
      : packages.filter((p) =>
          filter === "homevisit"
            ? p.homevisit
            : filter === "discount"
            ? parseFloat(p.discount) > 0
            : true
        );

  // 🔥 Navigation Handler
  const goToPackagePage = (hospitalId, serviceId) => {
    router.push(
      `/pathology/hospital/${hospitalId}/service/${serviceId}`
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
      <div className="w-full h-full overflow-y-auto">
        <Card className="w-full max-w-[95vw] lg:max-w-none lg:rounded-none lg:border-0 lg:shadow-none mx-auto min-h-screen bg-white">
          
          {/* Header */}
          <CardHeader className="border-b bg-gradient-to-r from-[#1E3B90] to-[#3D85EF] text-white sticky top-0 z-10 shadow-md">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                  <HeartPulse className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl lg:text-3xl font-bold">
                    Wellness Packages
                  </CardTitle>
                  <p className="text-sm text-blue-100 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>
                      {filteredPackages.length} package
                      {filteredPackages.length !== 1 ? "s" : ""} available
                    </span>
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white hover:bg-white/20 h-10 w-10 rounded-lg"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </CardHeader>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 justify-center p-4 bg-gray-50 border-b">
            {[
              { key: "all", label: "✨ All Packages" },
              { key: "homevisit", label: "🏠 Home Visit" },
              { key: "discount", label: "💸 With Discount" },
            ].map((btn) => (
              <Button
                key={btn.key}
                variant={filter === btn.key ? "default" : "outline"}
                onClick={() => setFilter(btn.key)}
                className={`rounded-full px-4 py-2 font-semibold transition-all ${
                  filter === btn.key
                    ? "bg-gradient-to-r from-[#1E3B90] to-[#3D85EF] text-white border-0"
                    : "bg-white text-[#1E3B90] border-blue-200 hover:bg-blue-50"
                }`}
              >
                {btn.label}
              </Button>
            ))}
          </div>

          {/* Content */}
          <CardContent className="relative z-0 p-6 lg:px-8 lg:py-8 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-7xl mx-auto">
              {loading ? (
                <div className="text-center py-16">
                  <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Loading Wellness Packages
                  </h3>
                  <p className="text-gray-600">Please wait...</p>
                </div>
              ) : error ? (
                <div className="text-center py-16">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Error Loading Packages
                  </h3>
                  <p className="text-red-600 mb-6">{error}</p>
                  <Button
                    onClick={() => window.location.reload()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Try Again
                  </Button>
                </div>
              ) : filteredPackages.length === 0 ? (
                <div className="text-center py-16">
                  <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-700 mb-2">
                    No Wellness Packages Found
                  </h3>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  
                  {filteredPackages.map((pkg, index) => (
                    <Card
                      key={`${pkg.id}-${index}`}
                      className="h-full min-h-[300px] flex flex-col overflow-hidden border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 bg-white rounded-2xl hover:translate-y-[-4px]"
                    >
                      <CardContent className="p-0 flex flex-col flex-grow">
                        
                        {/* Header */}
                        <div className="bg-gradient-to-br from-[#1E3B90]/10 to-[#3D85EF]/10 p-6 rounded-t-2xl">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#1E3B90] to-[#3D85EF] flex items-center justify-center border-4 border-white shadow-lg">
                              <Stethoscope className="w-7 h-7 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-bold text-gray-800 mb-1 truncate">
                                {pkg.name}
                              </h3>
                              <p className="text-[#1E3B90] text-sm font-semibold mb-1 truncate">
                                {pkg.labPackage || "General Checkup"}
                              </p>
                              {pkg.discount && (
                                <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-1 rounded-full inline-flex items-center gap-1">
                                  <BadgePercent className="w-3 h-3" />{" "}
                                  {pkg.discount}% OFF
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-3 flex-grow text-sm text-gray-700">
                          {pkg.includes?.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-gray-800 mb-1 flex items-center gap-2">
                                <ClipboardList className="h-4 w-4 text-[#1E3B90]" />
                                Includes:
                              </h4>
                              <ul className="list-disc list-inside text-gray-600 text-xs space-y-1">
                                {pkg.includes.slice(0, 4).map((test, idx) => (
                                  <li key={idx}>{test}</li>
                                ))}
                              </ul>
                              {pkg.includes.length > 4 && (
                                <p className="text-xs text-blue-500 mt-1">
                                  +{pkg.includes.length - 4} more
                                </p>
                              )}
                            </div>
                          )}

                          <div className="flex items-center gap-2">
                            <Wallet className="h-4 w-4 text-[#1E3B90]" />
                            <span className="font-medium">
                              ₹{pkg.finalPrice}{" "}
                              {pkg.price && (
                                <span className="text-gray-500 line-through ml-1">
                                  ₹{pkg.price}
                                </span>
                              )}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Home className="h-4 w-4 text-[#1E3B90]" />
                            <span>
                              {pkg.homevisit
                                ? "Home Visit Available"
                                : "Clinic Only"}
                            </span>
                          </div>
                        </div>

                        {/* Footer Buttons */}
                        <div className="px-6 pb-6 pt-2">
                          <div className="flex gap-3">

                            {/* 🔵 BOOK NOW */}
                            <button
                              onClick={() =>
                                goToPackagePage(pkg.hospitalId, pkg.id)
                              }
                              className="flex-1 bg-gradient-to-r from-[#1E3B90] to-[#1E3B90] text-white font-medium py-2.5 px-3 rounded-xl shadow-md hover:scale-105 transition-all flex items-center justify-center gap-2 text-sm"
                            >
                              <HeartPulse className="h-4 w-4" />
                              Book Package
                            </button>

                            {/* 🔵 DETAILS */}
                            <button
                              onClick={() =>
                                goToPackagePage(pkg.hospitalId, pkg.id)
                              }
                              className="flex-1 bg-gradient-to-r from-[#3D85EF] to-[#3D85EF] text-white font-medium py-2.5 px-3 rounded-xl shadow-sm hover:scale-105 transition-all flex items-center justify-center gap-2 text-sm"
                            >
                              <ClipboardList className="h-4 w-4" />
                              Details
                            </button>

                          </div>
                        </div>

                      </CardContent>
                    </Card>
                  ))}

                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
