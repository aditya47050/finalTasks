"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Truck,
  Clock,
  MapPin,
  Phone,
  Info,
  AlertCircle,
  X,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const HomeCollectionList = ({ isOpen, onClose, diagnosticcenterid }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Unified Theme (same as GovtSchemesList)
  const unified = {
    headerGradient: "from-[#1E3B90] to-[#3D85EF]",
    cardHeaderGradient: "from-[#1E3B90]/10 to-[#3D85EF]/10",
    accentText: "text-[#1E3B90]",
    buttonGradient: "from-[#1E3B90] to-[#3D85EF]",
    lightBg: "bg-[#EEF3FF]",
    borderColor: "border-[#E1E8FF]",
  };

  useEffect(() => {
    if (!isOpen || !diagnosticcenterid) return;
    const fetchData = async () => {
      try {
        const res = await fetch(
          `/api/diagnostic-center/${diagnosticcenterid}/home-collection`
        );
        const result = await res.json();
        if (result.success) setData(result.data);
        else console.error("❌ Failed to fetch:", result.message);
      } catch (err) {
        console.error("🔥 Error fetching Home Collection:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isOpen, diagnosticcenterid]);

  const hsp = data?.hspdetails || {};
  const contact = data?.hspcontact || {};
  const info = data?.hspInfo || {};

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-3xl max-h-[85vh] overflow-y-auto p-0 rounded-2xl shadow-2xl border-none"
        hideCloseButton
      >
        {/* Header */}
        <DialogHeader
          className={`sticky top-0 z-10 bg-gradient-to-r ${unified.headerGradient} text-white p-5 sm:p-6 rounded-t-2xl shadow-md`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/25 rounded-xl backdrop-blur-sm shadow-inner">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-white tracking-wide">
                  Home Collection
                </DialogTitle>
                <p className="text-white/90 text-sm mt-1">
                  Doorstep sample collection service at{" "}
                  <span className="font-semibold">
                    {info?.regname || "this center"}
                  </span>
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

        {/* Body */}
        <div className="p-6 sm:p-8 bg-white">
          {loading ? (
            <div className="text-center py-12 text-gray-500">
              Loading Home Collection details...
            </div>
          ) : hsp?.homecollection === "Yes" ? (
            <Card
              className={`border ${unified.borderColor} shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden bg-white`}
            >
              <div className={`h-2 bg-gradient-to-r ${unified.buttonGradient}`} />
              <CardContent className="p-6 sm:p-8 space-y-6">
                {/* Main Info */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div
                    className={`p-3 ${unified.lightBg} rounded-xl flex-shrink-0`}
                  >
                    <CheckCircle2
                      className={`w-6 h-6 ${unified.accentText}`}
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      Home Collection Available
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Experience convenient sample collection from the comfort
                      of your home.
                    </p>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div
                    className={`p-4 rounded-xl ${unified.lightBg} border ${unified.borderColor}`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Clock className={`w-5 h-5 ${unified.accentText}`} />
                      <h4 className="font-semibold text-gray-900 text-sm">
                        Collection Timing
                      </h4>
                    </div>
                    <p className="text-gray-700">
                      {hsp.homecollectiontiming || "8:00 AM - 8:00 PM"}
                    </p>
                  </div>

                  <div
                    className={`p-4 rounded-xl ${unified.lightBg} border ${unified.borderColor}`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Phone className={`w-5 h-5 ${unified.accentText}`} />
                      <h4 className="font-semibold text-gray-900 text-sm">
                        Contact
                      </h4>
                    </div>
                    <p className="text-gray-700">
                      {hsp.homecollectioncontact ||
                        contact.managercontact ||
                        "Not Provided"}
                    </p>
                  </div>

                  <div
                    className={`p-4 rounded-xl ${unified.lightBg} border ${unified.borderColor}`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <MapPin className={`w-5 h-5 ${unified.accentText}`} />
                      <h4 className="font-semibold text-gray-900 text-sm">
                        Coverage Area
                      </h4>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {hsp.homecollectioncoverage ||
                        "Collection available within 10 km radius."}
                    </p>
                  </div>

                  <div
                    className={`p-4 rounded-xl ${unified.lightBg} border ${unified.borderColor}`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Info className={`w-5 h-5 ${unified.accentText}`} />
                      <h4 className="font-semibold text-gray-900 text-sm">
                        Availability
                      </h4>
                    </div>
                    <p className="text-gray-700">
                      {hsp.homecollectionavailable === "Yes"
                        ? "Available Daily"
                        : "Limited Availability"}
                    </p>
                  </div>
                </div>

                {/* Note Section */}
                <div
                  className={`mt-8 p-5 ${unified.lightBg} ${unified.borderColor} border rounded-xl flex items-start gap-3 hover:opacity-90 transition-all`}
                >
                  <div className={`p-2 ${unified.lightBg} rounded-lg`}>
                    <AlertCircle className={`w-5 h-5 ${unified.accentText}`} />
                  </div>
                  <div className="text-sm text-gray-800 leading-relaxed">
                    <p className="font-semibold mb-1">Important Note:</p>
                    <p>
                      Home collection is subject to slot availability. Please
                      confirm timing with the center before scheduling your
                      visit.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border border-gray-200 shadow-lg rounded-2xl bg-white text-center hover:shadow-xl transition-all duration-300">
              <CardContent className="p-10 sm:p-14">
                <div className="flex flex-col items-center justify-center space-y-5">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                    <Truck className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900">
                    Home Collection Not Available
                  </h3>
                  <p className="text-gray-600 max-w-md leading-relaxed">
                    This diagnostic center currently does not offer home sample
                    collection services. Please contact the center for more
                    information or updates.
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
                        You can contact{" "}
                        <span className="font-semibold">
                          {contact.managername || "center staff"}
                        </span>{" "}
                        at{" "}
                        <span className="text-[#1E3B90] font-medium">
                          {contact.managercontact || "N/A"}
                        </span>{" "}
                        for information about availability or future updates.
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
};

export default HomeCollectionList;
