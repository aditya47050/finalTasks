"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  X,
  Bed,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Wallet,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";   // ✅ Added

export default function HospitalBedsList({ onClose, hospitalService }) {
  const [hospital, setHospital] = useState(null);
  const [beds, setBeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [statuses, setStatuses] = useState([]);

  const router = useRouter(); // ✅ Added

  useEffect(() => {
    const hospitalId = hospitalService?.id || hospitalService?._id;
    if (!hospitalId) return;

    const fetchBeds = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/hospital/${hospitalId}/beds`);

        if (res.data.success) {
          const fetchedBeds = res.data.beds || [];
          setBeds(fetchedBeds);

          if (res.data.hospital) setHospital(res.data.hospital);

          const uniqueStatuses = [
            ...new Set(fetchedBeds.map((b) => b.status).filter(Boolean)),
          ];
          setStatuses(uniqueStatuses);
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

  const statusIcons = {
    AVAILABLE: <CheckCircle className="h-4 w-4 text-green-600" />,
    BOOKED: <X className="h-4 w-4 text-red-600" />,
    RESERVED: <Clock className="h-4 w-4 text-yellow-600" />,
    AVAILABLE_SOON: <Clock className="h-4 w-4 text-orange-600" />,
    ADMITTED: <Bed className="h-4 w-4 text-blue-600" />,
    UNDER_MAINTENANCE: <AlertTriangle className="h-4 w-4 text-gray-500" />,
    DISCHARGED: <CheckCircle className="h-4 w-4 text-teal-600" />,
    CONFIRMED: <CheckCircle className="h-4 w-4 text-indigo-600" />,
  };

  const statusColors = {
    AVAILABLE: "bg-green-100 text-green-700",
    BOOKED: "bg-red-100 text-red-700",
    RESERVED: "bg-yellow-100 text-yellow-700",
    AVAILABLE_SOON: "bg-orange-100 text-orange-700",
    ADMITTED: "bg-blue-100 text-blue-700",
    UNDER_MAINTENANCE: "bg-gray-100 text-gray-700",
    DISCHARGED: "bg-teal-100 text-teal-700",
    CONFIRMED: "bg-indigo-100 text-indigo-700",
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
      <div className="w-full h-full overflow-y-auto">
        <Card className="w-full max-w-[95vw] lg:max-w-none mx-auto min-h-screen bg-white rounded-none border-0 shadow-none">

          {/* HEADER */}
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

          {/* FILTERS */}
          <div className="flex flex-wrap gap-2 justify-center p-4 bg-gray-50 border-b">
            {["all", ...statuses].map((status) => (
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
                {status === "all" ? "✨ All Beds" : status.replace(/_/g, " ")}
              </Button>
            ))}
          </div>

          {/* CONTENT */}
          <CardContent className="relative z-0 p-6 lg:px-8 lg:py-8 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-7xl mx-auto">

              {loading ? (
                <div className="text-center py-16">
                  <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Loading Beds
                  </h3>
                </div>
              ) : error ? (
                <div className="text-center py-16">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Error Loading Beds
                  </h3>
                  <p className="text-red-600 mb-6">{error}</p>
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
                  {filteredBeds.map((b) => {
                    const minPrice = b?.category?.minPrice ?? hospital?.minPrice;
                    const maxPrice = b?.category?.maxPrice ?? hospital?.maxPrice;
                    const hospitalName = hospital?.name || hospitalService?.name;

                    return (
                      <Card
                        key={b.id}
                        className="h-full flex flex-col border shadow-md rounded-2xl overflow-hidden hover:shadow-lg transition"
                      >
                        <div className="relative w-full h-44">
                          <Image
                            src={
                              b.category?.image ||
                              "https://res.cloudinary.com/demo/image/upload/v1693123123/hospital_bed.jpg"
                            }
                            alt="Bed"
                            fill
                            className="object-cover"
                          />

                          <div
                            className={`absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold shadow 
                              ${statusColors[b.status] || "bg-gray-100 text-gray-700"}
                            `}
                          >
                            {statusIcons[b.status]}
                            <span>{b.status.replace(/_/g, " ")}</span>
                          </div>
                        </div>

                        <CardContent className="p-5 space-y-2 flex flex-col flex-1">
                          <h2 className="text-lg font-semibold text-gray-900">
                            {b.category?.name || "Hospital Bed"}
                          </h2>

                          <p className="text-blue-600 font-semibold text-sm">
                            ₹{minPrice} – ₹{maxPrice}
                          </p>

                          <p className="text-gray-600 text-sm">{hospitalName}</p>

                          <p className="text-sm flex items-center gap-2">
                            <Wallet className="h-4 w-4 text-blue-700" />
                            ₹{b.category?.finalPrice ?? "N/A"} /{" "}
                            {b.category?.chargeType ?? "daily"}
                          </p>

                          {b.category?.discount && (
                            <p className="text-green-600 text-sm">
                              {b.category.discount}% discount
                            </p>
                          )}

                          {/* ✅ BOOK NOW BUTTON WITH NAVIGATION */}
                          <button
                            onClick={() =>
                              router.push(`/beds/${b.category?.id}`)
                            }
                            className="mt-auto w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-medium shadow"
                          >
                            Book Now
                          </button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
