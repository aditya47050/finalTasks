"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  X,
  Bed,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Clock,
  Building2,
  Wallet,
  Percent,
  BadgeDollarSign,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axios from "axios";

export default function HospitalBedsList({ onClose, hospitalService }) {
  const [beds, setBeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  useEffect(() => {
    const hospitalId = hospitalService?.id || hospitalService?._id;
    if (!hospitalId) return;

    const fetchBeds = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/hospital/${hospitalId}/beds`);
        if (res.data.success) {
          setBeds(res.data.beds);
        } else {
          setError("Failed to load beds.");
        }
      } catch (err) {
        console.error("🔥 Error fetching beds:", err);
        setError("Error fetching bed data.");
      } finally {
        setLoading(false);
      }
    };

    fetchBeds();
  }, [hospitalService?.id, hospitalService?._id]);

  const filteredBeds =
    selectedStatus === "all"
      ? beds
      : beds.filter((b) => b.status === selectedStatus);

  const statusColors = {
    AVAILABLE: "bg-green-100 text-green-700 border-green-300",
    BOOKED: "bg-red-100 text-red-700 border-red-300",
    RESERVED: "bg-yellow-100 text-yellow-700 border-yellow-300",
    UNDER_MAINTENANCE: "bg-gray-100 text-gray-700 border-gray-300",
    ADMITTED: "bg-blue-100 text-blue-700 border-blue-300",
    AVAILABLE_SOON: "bg-orange-100 text-orange-700 border-orange-300",
    DISCHARGED: "bg-teal-100 text-teal-700 border-teal-300",
    CONFIRMED: "bg-indigo-100 text-indigo-700 border-indigo-300",
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
      <div className="w-full h-full overflow-y-auto">
        <Card className="w-full max-w-[95vw] lg:max-w-none mx-auto min-h-screen bg-white rounded-none border-0 shadow-none">
          {/* Header */}
          <CardHeader className="border-b bg-gradient-to-r from-[#1E3B90] to-[#3D85EF] text-white sticky top-0 z-10 shadow-md">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                  <Bed className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl lg:text-3xl font-bold">
                    Hospital Bed Availability
                  </CardTitle>
                  <p className="text-sm text-blue-100 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>
                      {filteredBeds.length} bed
                      {filteredBeds.length !== 1 ? "s" : ""} available
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
              "all",
              "AVAILABLE",
              "BOOKED",
              "RESERVED",
              "ADMITTED",
              "UNDER_MAINTENANCE",
            ].map((status) => (
              <Button
                key={status}
                variant={selectedStatus === status ? "default" : "outline"}
                onClick={() => setSelectedStatus(status)}
                className={`rounded-full px-4 py-2 font-semibold transition-all ${
                  selectedStatus === status
                    ? "bg-gradient-to-r from-[#1E3B90] to-[#3D85EF] text-white border-0"
                    : "bg-white text-[#1E3B90] border-blue-200 hover:bg-blue-50"
                }`}
              >
                {status === "all"
                  ? "✨ All Beds"
                  : status.replace("_", " ").toUpperCase()}
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
                    Loading Beds
                  </h3>
                  <p className="text-gray-600">Please wait...</p>
                </div>
              ) : error ? (
                <div className="text-center py-16">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Error Loading Beds
                  </h3>
                  <p className="text-red-600 mb-6">{error}</p>
                  <Button
                    onClick={() => window.location.reload()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Try Again
                  </Button>
                </div>
              ) : filteredBeds.length === 0 ? (
                <div className="text-center py-16">
                  <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-700 mb-2">
                    No Beds Found
                  </h3>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBeds.map((b) => (
                    <Card
                      key={b.id}
                      className="h-full min-h-[300px] flex flex-col overflow-hidden border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 bg-white rounded-2xl hover:translate-y-[-4px]"
                    >
                      <CardContent className="p-0 flex flex-col flex-grow">
                        {/* Header */}
                        <div className="bg-gradient-to-br from-[#1E3B90]/10 to-[#3D85EF]/10 p-6 rounded-t-2xl">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-lg">
                              <Image
                                src={
                                  b.category?.image ||
                                  "https://res.cloudinary.com/demo/image/upload/v1693123123/hospital_bed.jpg"
                                }
                                alt={b.category?.name || "Hospital Bed"}
                                width={80}
                                height={80}
                                className="object-cover w-full h-full"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-bold text-gray-800 mb-1 truncate">
                                Bed #{b.bedNumber}
                              </h3>
                              <p className="text-[#1E3B90] text-sm font-semibold mb-1">
                                {b.category?.name || "General Ward"}
                              </p>
                              <span
                                className={`inline-block text-xs font-semibold px-3 py-1 rounded-full border ${
                                  statusColors[b.status] ||
                                  "bg-gray-100 text-gray-700 border-gray-300"
                                }`}
                              >
                                {b.status}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-3 flex-grow text-sm text-gray-700">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-[#1E3B90]" />
                            <span>Hospital ID: {b.hospitalId}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Wallet className="h-4 w-4 text-[#1E3B90]" />
                            <span>
                              ₹{b.category?.finalPrice || "N/A"} /{" "}
                              {b.category?.chargeType || "daily"}
                            </span>
                          </div>

                          {b.category?.discount && (
                            <div className="flex items-center gap-2">
                              <Percent className="h-4 w-4 text-green-600" />
                              <span>{b.category.discount} discount</span>
                            </div>
                          )}

                          <div className="flex items-center gap-2 text-gray-500 text-xs">
                            <Clock className="h-3 w-3 text-[#1E3B90]" />
                            <span>
                              Added on{" "}
                              {new Date(b.createdAt).toLocaleDateString()}
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
