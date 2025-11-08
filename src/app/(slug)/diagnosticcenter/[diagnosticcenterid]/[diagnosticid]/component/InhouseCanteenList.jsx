"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Utensils,
  Info,
  AlertCircle,
  X,
  CheckCircle2,
  MapPin,
  Phone,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const InhouseCanteenList = ({ isOpen, onClose, diagnosticcenterid }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🎨 Unified Theme
  const unified = {
    headerGradient: "from-[#1E3B90] to-[#3D85EF]",
    cardHeaderGradient: "from-[#1E3B90]/10 to-[#3D85EF]/10",
    accentText: "text-[#1E3B90]",
    buttonGradient: "from-[#1E3B90] to-[#3D85EF]",
    lightBg: "bg-[#EEF3FF]",
    borderColor: "border-[#E1E8FF]",
  };

  // 📡 Fetch data when dialog opens
  useEffect(() => {
    if (!isOpen || !diagnosticcenterid) return;

    const fetchData = async () => {
      try {
        const res = await fetch(
          `/api/diagnostic-center/${diagnosticcenterid}/inhouse-canteen`
        );
        const result = await res.json();
        if (result.success) setData(result.data);
        else console.error("❌ Failed to fetch:", result.message);
      } catch (err) {
        console.error("🔥 Error fetching In-House Canteen:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isOpen, diagnosticcenterid]);

  const hsp = data?.hspInfo || {};
  const contact = data?.hspcontact || {};

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
                <Utensils className="w-6 h-6" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-white tracking-wide">
                  In-House Canteen
                </DialogTitle>
                <p className="text-white/90 text-sm mt-1">
                  Facility details at{" "}
                  <span className="font-semibold">
                    {hsp?.regname || "this center"}
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

        {/* Main Content */}
        <div className="p-6 sm:p-8 bg-white">
          {loading ? (
            <div className="text-center py-12 text-gray-500">
              Loading In-House Canteen details...
            </div>
          ) : hsp?.inhousecanteen === "Yes" ? (
            // ✅ Available Case
            <Card
              className={`border ${unified.borderColor} shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden bg-white`}
            >
              <div className={`h-2 bg-gradient-to-r ${unified.buttonGradient}`} />
              <CardContent className="p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div
                    className={`p-3 ${unified.lightBg} rounded-xl flex-shrink-0`}
                  >
                    <CheckCircle2 className={`w-6 h-6 ${unified.accentText}`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      In-House Canteen Available
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Enjoy healthy meals and refreshments within the premises
                      of{" "}
                      <span className="font-semibold">
                        {hsp.regname || "this center"}
                      </span>
                      .
                    </p>
                  </div>
                </div>

                {/* Contact and Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div
                    className={`p-4 rounded-xl ${unified.lightBg} border ${unified.borderColor}`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Phone className={`w-5 h-5 ${unified.accentText}`} />
                      <h4 className="font-semibold text-gray-900 text-sm">
                        Contact Person
                      </h4>
                    </div>
                    <p className="text-gray-700">
                      {contact?.managername || "Canteen Manager"} –{" "}
                      {contact?.managercontact || "N/A"}
                    </p>
                  </div>

                  <div
                    className={`p-4 rounded-xl ${unified.lightBg} border ${unified.borderColor}`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <MapPin className={`w-5 h-5 ${unified.accentText}`} />
                      <h4 className="font-semibold text-gray-900 text-sm">
                        Location
                      </h4>
                    </div>
                    <p className="text-gray-700">
                      {contact?.city || "Within center premises"}
                    </p>
                  </div>
                </div>

                {/* Info Note */}
                <div
                  className={`mt-8 p-5 ${unified.lightBg} ${unified.borderColor} border rounded-xl flex items-start gap-3 hover:opacity-90 transition-all`}
                >
                  <div className={`p-2 ${unified.lightBg} rounded-lg`}>
                    <Info className={`w-5 h-5 ${unified.accentText}`} />
                  </div>
                  <div className="text-sm text-gray-800 leading-relaxed">
                    <p className="font-semibold mb-1">Note:</p>
                    <p>
                      The canteen offers a variety of meals and beverages for
                      patients, visitors, and staff. Timing may vary based on
                      hospital hours.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            // 🚫 Not Available Case
            <Card className="border border-gray-200 shadow-lg rounded-2xl bg-white text-center hover:shadow-xl transition-all duration-300">
              <CardContent className="p-10 sm:p-14">
                <div className="flex flex-col items-center justify-center space-y-5">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                    <Utensils className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900">
                    In-House Canteen Not Available
                  </h3>
                  <p className="text-gray-600 max-w-md leading-relaxed">
                    This diagnostic center currently does not provide in-house
                    canteen facilities. Please contact the center for updates or
                    nearby meal options.
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
                          {contact?.managername || "center staff"}
                        </span>{" "}
                        at{" "}
                        <span className="text-[#1E3B90] font-medium">
                          {contact?.managercontact || "N/A"}
                        </span>{" "}
                        for any updates regarding canteen services.
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

export default InhouseCanteenList;
