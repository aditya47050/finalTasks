"use client";

import React, { useEffect, useState } from "react";
import {
  X,
  Stethoscope,
  Loader2,
  CheckCircle,
  AlertTriangle,
  HeartPulse,
  BadgeDollarSign,
  Wallet,
  Activity,
  Building2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";  // ✅ ADDED

export default function HospitalSurgeryList({ onClose, hospitalService }) {
  const [surgeries, setSurgeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const router = useRouter(); // ✅ ADDED

  // ⭐ NAVIGATION FUNCTION
  const goToSurgeryPage = (serviceId) => {
    const hospitalId = hospitalService?.id || hospitalService?._id;
    if (!hospitalId || !serviceId) return;

    router.push(`/surgerypackages/${hospitalId}?serviceId=${serviceId}`);
  };

  useEffect(() => {
    const hospitalId = hospitalService?.id || hospitalService?._id;
    if (!hospitalId) return;

    const fetchSurgeries = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/hospital/${hospitalId}/surgery`);
        if (res.data.success) {
          setSurgeries(res.data.surgeries);
        } else {
          setError("Failed to load surgery packages.");
        }
      } catch (err) {
        console.error("🔥 Error fetching surgeries:", err);
        setError("Error fetching surgery data.");
      } finally {
        setLoading(false);
      }
    };

    fetchSurgeries();
  }, [hospitalService?.id, hospitalService?._id]);

  const filteredSurgeries =
    selectedCategory === "all"
      ? surgeries
      : surgeries.filter((s) => s.category === selectedCategory);

  const uniqueCategories = [
    "all",
    ...new Set(surgeries.map((s) => s.category)),
  ];

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
                    Surgery Packages & Treatments
                  </CardTitle>
                  <p className="text-sm text-blue-100 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>
                      {filteredSurgeries.length} package
                      {filteredSurgeries.length !== 1 ? "s" : ""} available
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
            {uniqueCategories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-4 py-2 font-semibold transition-all ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-[#1E3B90] to-[#3D85EF] text-white border-0"
                    : "bg-white text-[#1E3B90] border-blue-200 hover:bg-blue-50"
                }`}
              >
                {category === "all" ? "✨ All Categories" : category}
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
                    Loading Surgery Packages
                  </h3>
                </div>
              ) : error ? (
                <div className="text-center py-16">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Error Loading Surgeries
                  </h3>
                  <p className="text-red-600 mb-6">{error}</p>
                </div>
              ) : filteredSurgeries.length === 0 ? (
                <div className="text-center py-16">
                  <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-700 mb-2">
                    No Surgery Packages Found
                  </h3>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredSurgeries.map((surgery) => (
                    <Card
                      key={surgery.id}
                      className="h-full flex flex-col overflow-hidden border border-gray-100 shadow-lg hover:shadow-xl hover:translate-y-[-3px] transition-all duration-300 bg-white rounded-2xl"
                    >
                      <CardContent className="p-0 flex flex-col flex-grow">

                        {/* Header */}
                        <div className="bg-gradient-to-br from-[#1E3B90]/10 to-[#3D85EF]/10 p-6 rounded-t-2xl">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600/20 to-indigo-400/30 flex items-center justify-center border-4 border-white shadow-lg">
                              <Stethoscope className="w-7 h-7 text-[#1E3B90]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-bold text-gray-800 mb-1 truncate">
                                {surgery.serviceName}
                              </h3>
                              <p className="text-[#1E3B90] text-sm font-semibold mb-1">
                                {surgery.category}
                              </p>
                              <span
                                className={`inline-block text-xs font-semibold px-3 py-1 rounded-full border ${
                                  surgery.isAvailable
                                    ? "bg-green-100 text-green-700 border-green-300"
                                    : "bg-red-100 text-red-700 border-red-300"
                                }`}
                              >
                                {surgery.isAvailable ? "Available" : "Unavailable"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-3 flex-grow text-sm text-gray-700">
                          <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-[#1E3B90]" />
                            <span>Type: {surgery.type}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Wallet className="h-4 w-4 text-[#1E3B90]" />
                            <span>
                              ₹{surgery.minPrice} – ₹{surgery.maxPrice}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-gray-500 text-xs">
                            <Building2 className="h-3 w-3 text-[#1E3B90]" />
                            <span>
                              Added on{" "}
                              {new Date(surgery.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {/* Footer (⭐ NAVIGATION ADDED) */}
                        <div className="px-6 pb-6 pt-2">
                          <div className="flex gap-3">

                            {/* ⭐ BOOK SURGERY BUTTON */}
                            <button
                              onClick={() => goToSurgeryPage(surgery.id)}
                              className="flex-1 bg-gradient-to-r from-[#1E3B90] to-[#1E3B90] text-white font-medium py-2.5 px-3 rounded-xl shadow-md hover:scale-105 transition-all flex items-center justify-center gap-2 text-sm"
                            >
                              <BadgeDollarSign className="h-4 w-4" />
                              Book Surgery
                            </button>

                            {/* ⭐ DETAILS BUTTON */}
                            <button
                              onClick={() => goToSurgeryPage(surgery.id)}
                              className="flex-1 bg-gradient-to-r from-[#3D85EF] to-[#3D85EF] text-white font-medium py-2.5 px-3 rounded-xl shadow-sm hover:scale-105 transition-all flex items-center justify-center gap-2 text-sm"
                            >
                              <Stethoscope className="h-4 w-4" />
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
