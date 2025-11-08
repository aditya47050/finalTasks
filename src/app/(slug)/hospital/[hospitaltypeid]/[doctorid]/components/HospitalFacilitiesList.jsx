"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Building2,
  CheckCircle,
  AlertCircle,
  X,
  Shield,
  HeartPulse,
  Microscope,
  Ambulance,
  BedDouble,
  Stethoscope,
  Hospital,
  Activity,
  Radiation,
  Pill,
  Users,
  Clock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function HospitalFacilitiesList({ hospitalId, onClose }) {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Unified theme
  const unified = {
    headerGradient: "from-[#1E3B90] to-[#3D85EF]",
    buttonGradient: "from-[#1E3B90] to-[#3D85EF]",
    accentText: "text-[#1E3B90]",
    lightBg: "bg-[#EEF3FF]",
    borderColor: "border-[#E1E8FF]",
  };

  // Icon map for matching facility types
  const iconMap = {
    ICU: HeartPulse,
    Emergency: Ambulance,
    Pharmacy: Pill,
    Pathology: Microscope,
    Radiology: Radiation,
    Surgery: Stethoscope,
    "Operation Theatre": Activity,
    "Hospital Beds": BedDouble,
    "Modern Facilities": Building2,
    "Canteen": Users,
    "24/7": Clock,
    Default: Shield,
  };

  useEffect(() => {
    if (!hospitalId) return;

    const fetchFacilities = async () => {
      try {
        const res = await fetch(`/api/hospital/${hospitalId}/facilities`);
        const data = await res.json();

        if (data.success && data.facilities) {
          setFacilities(data.facilities);
        } else {
          setFacilities([]);
        }
      } catch (err) {
        console.error("Error fetching hospital facilities:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFacilities();
  }, [hospitalId]);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent
        className="max-w-4xl max-h-[85vh] overflow-y-auto p-0 rounded-2xl shadow-2xl border-none"
        hideCloseButton
      >
        {/* Header */}
        <DialogHeader
          className={`sticky top-0 z-10 bg-gradient-to-r ${unified.headerGradient} text-white p-5 sm:p-6 rounded-t-2xl shadow-md`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/25 rounded-xl backdrop-blur-sm shadow-inner">
                <Hospital className="w-6 h-6" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-white tracking-wide">
                  Hospital Facilities
                </DialogTitle>
                <p className="text-white/90 text-sm mt-1">
                  Modern amenities and patient care infrastructure
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 transition-all p-2 rounded-lg backdrop-blur-sm focus:outline-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </DialogHeader>

        {/* Main Content */}
        <div className="p-6 sm:p-8 bg-white">
          {loading ? (
            <div className="text-center py-10 text-gray-500">
              Loading hospital facilities...
            </div>
          ) : facilities.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {facilities.map((facility, i) => {
                const Icon =
                  iconMap[
                    Object.keys(iconMap).find((key) =>
                      facility.title?.toLowerCase().includes(key.toLowerCase())
                    )
                  ] || iconMap.Default;

                return (
                  <Card
                    key={i}
                    className={`border ${unified.borderColor} shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden bg-white`}
                  >
                    <div
                      className={`h-1.5 bg-gradient-to-r ${unified.buttonGradient}`}
                    />
                    <CardContent className="p-5 flex flex-col items-center text-center space-y-3">
                      <div
                        className={`p-4 rounded-2xl ${unified.lightBg} flex items-center justify-center`}
                      >
                        <Icon className={`w-8 h-8 ${unified.accentText}`} />
                      </div>
                      <h3 className="font-semibold text-lg text-gray-800">
                        {facility.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {facility.description}
                      </p>
                      <div className="flex items-center gap-1 text-green-600 font-medium text-sm">
                        <CheckCircle className="w-4 h-4" /> Available
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="border border-gray-200 shadow-lg rounded-2xl bg-white text-center hover:shadow-xl transition-all duration-300">
              <CardContent className="p-10 sm:p-14">
                <div className="flex flex-col items-center justify-center space-y-5">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                    <Building2 className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900">
                    No Facilities Data Available
                  </h3>
                  <p className="text-gray-600 max-w-md leading-relaxed">
                    Facility details are currently not available for this
                    hospital. Please contact the hospital administration for more
                    information.
                  </p>

                  <div
                    className={`mt-6 p-5 ${unified.lightBg} rounded-xl ${unified.borderColor} border max-w-lg text-left`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 ${unified.lightBg} rounded-lg`}>
                        <AlertCircle
                          className={`w-5 h-5 ${unified.accentText}`}
                        />
                      </div>
                      <p className="text-sm text-gray-800 leading-relaxed">
                        You can reach out to the hospital reception for
                        information about available facilities or future updates.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
