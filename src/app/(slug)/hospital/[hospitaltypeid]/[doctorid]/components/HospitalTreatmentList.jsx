"use client";

import React, { useEffect, useState } from "react";
import {
  X,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Stethoscope,
  BadgeDollarSign,
  ClipboardList,
  HeartPulse,
  Activity,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axios from "axios";

export default function HospitalTreatmentList({ onClose, hospitalService }) {
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const hospitalId = hospitalService?.id || hospitalService?._id;
    if (!hospitalId) return;

    const fetchTreatments = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/hospital/${hospitalId}/treatments`);
        if (res.data.success) {
          setTreatments(res.data.treatments);
        } else {
          setError("Failed to load treatment packages.");
        }
      } catch (err) {
        console.error("🔥 Error fetching treatments:", err);
        setError("Error fetching treatment package data.");
      } finally {
        setLoading(false);
      }
    };

    fetchTreatments();
  }, [hospitalService?.id, hospitalService?._id]);

  const filteredTreatments =
    selectedCategory === "all"
      ? treatments
      : treatments.filter((t) => t.category === selectedCategory);

  const categories = [
    ...new Set(treatments.map((treatment) => treatment.category)),
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
      <div className="w-full h-full overflow-y-auto">
        <Card className="w-full max-w-[95vw] lg:max-w-none mx-auto min-h-screen bg-white rounded-none border-0 shadow-none">
          {/* Header */}
          <CardHeader className="border-b bg-gradient-to-r from-[#1E3B90] to-[#3D85EF] text-white sticky top-0 z-10 shadow-md">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                  <ClipboardList className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl lg:text-3xl font-bold">
                    Treatment Packages
                  </CardTitle>
                  <p className="text-sm text-blue-100 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>
                      {filteredTreatments.length} treatment package
                      {filteredTreatments.length !== 1 ? "s" : ""} available
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
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              onClick={() => setSelectedCategory("all")}
              className={`rounded-full px-4 py-2 font-semibold transition-all ${
                selectedCategory === "all"
                  ? "bg-gradient-to-r from-[#1E3B90] to-[#3D85EF] text-white border-0"
                  : "bg-white text-[#1E3B90] border-blue-200 hover:bg-blue-50"
              }`}
            >
              ✨ All Treatments
            </Button>
            {categories.map((category) => (
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
                {category}
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
                    Loading Treatment Packages
                  </h3>
                  <p className="text-gray-600">Please wait...</p>
                </div>
              ) : error ? (
                <div className="text-center py-16">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Error Loading Treatments
                  </h3>
                  <p className="text-red-600 mb-6">{error}</p>
                  <Button
                    onClick={() => window.location.reload()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Try Again
                  </Button>
                </div>
              ) : filteredTreatments.length === 0 ? (
                <div className="text-center py-16">
                  <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-700 mb-2">
                    No Treatment Packages Found
                  </h3>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTreatments.map((treatment, index) => (
                    <Card
                      key={`${treatment.id}-${index}`}
                      className="h-full min-h-[300px] flex flex-col overflow-hidden border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 bg-white rounded-2xl hover:translate-y-[-4px]"
                    >
                      <CardContent className="p-0 flex flex-col flex-grow">
                        {/* Header */}
                        <div className="bg-gradient-to-br from-[#1E3B90]/10 to-[#3D85EF]/10 p-6 rounded-t-2xl">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#1E3B90] to-[#3D85EF] flex items-center justify-center border-4 border-white shadow-lg">
                              <HeartPulse className="w-7 h-7 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-bold text-gray-800 mb-1 truncate">
                                {treatment.serviceName}
                              </h3>
                              <p className="text-[#1E3B90] text-sm font-semibold mb-1">
                                {treatment.category}
                              </p>
                              <span
                                className={`inline-block text-xs font-semibold px-3 py-1 rounded-full border ${
                                  treatment.isAvailable
                                    ? "bg-green-100 text-green-700 border-green-300"
                                    : "bg-red-100 text-red-700 border-red-300"
                                }`}
                              >
                                {treatment.isAvailable
                                  ? "Available"
                                  : "Unavailable"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-3 flex-grow text-sm text-gray-700">
                          {treatment.type && (
                            <div className="flex items-center gap-2">
                              <Activity className="h-4 w-4 text-[#1E3B90]" />
                              <span>Type: {treatment.type}</span>
                            </div>
                          )}

                          <div className="flex items-center gap-2">
                            <BadgeDollarSign className="h-4 w-4 text-[#1E3B90]" />
                            <span>
                              ₹{treatment.minPrice} – ₹{treatment.maxPrice}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Stethoscope className="h-4 w-4 text-[#1E3B90]" />
                            <span>
                              {treatment.specialization || "General Treatment"}
                            </span>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 pb-6 pt-2">
                          <div className="flex gap-3">
                            <button className="flex-1 bg-gradient-to-r from-[#1E3B90] to-[#1E3B90] text-white font-medium py-2.5 px-3 rounded-xl shadow-md hover:scale-105 transition-all flex items-center justify-center gap-2 text-sm">
                              <BadgeDollarSign className="h-4 w-4" />
                              Book Now
                            </button>
                            <button className="flex-1 bg-gradient-to-r from-[#3D85EF] to-[#3D85EF] text-white font-medium py-2.5 px-3 rounded-xl shadow-sm hover:scale-105 transition-all flex items-center justify-center gap-2 text-sm">
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
