"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Coffee, AlertCircle, X, UtensilsCrossed } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function InhouseCanteenList({ hospitalId, onClose }) {
  const [canteen, setCanteen] = useState(null);
  const [loading, setLoading] = useState(true);

  const unified = {
    headerGradient: "from-[#1E3B90] to-[#3D85EF]",
    accentText: "text-[#1E3B90]",
    buttonGradient: "from-[#1E3B90] to-[#3D85EF]",
    lightBg: "bg-[#EEF3FF]",
    borderColor: "border-[#E1E8FF]",
  };

  useEffect(() => {
    if (!hospitalId) return;

    const fetchCanteen = async () => {
      try {
        const res = await fetch(`/api/hospital/${hospitalId}/inhouse-canteen`);
        const data = await res.json();
        if (data.success && data.canteen) {
          setCanteen(data.canteen);
        }
      } catch (err) {
        console.error("Error fetching canteen data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCanteen();
  }, [hospitalId]);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent
        className="max-w-3xl max-h-[85vh] overflow-y-auto p-0 rounded-2xl shadow-2xl border-none"
        hideCloseButton
      >
        {/* Header */}
        <DialogHeader
          className={`sticky top-0 z-10 bg-gradient-to-r ${unified.headerGradient} text-white p-5 rounded-t-2xl shadow-md`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/25 rounded-xl backdrop-blur-sm shadow-inner">
                <Coffee className="w-6 h-6" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-white tracking-wide">
                  Inhouse Canteen
                </DialogTitle>
                <p className="text-white/90 text-sm mt-1">
                  Details about hospital's in-house canteen services
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

        {/* Content */}
        <div className="p-6 sm:p-8 bg-white">
          {loading ? (
            <p className="text-center text-gray-500 py-8">
              Loading canteen details...
            </p>
          ) : canteen ? (
            <Card
              className={`border ${unified.borderColor} shadow-md rounded-2xl overflow-hidden bg-white`}
            >
              <div className={`h-2 bg-gradient-to-r ${unified.buttonGradient}`} />
              <CardContent className="p-6 space-y-5">
                <div className="flex items-center gap-3 mb-3">
                  <UtensilsCrossed className={`w-6 h-6 ${unified.accentText}`} />
                  <h3 className="text-xl font-semibold text-gray-800">
                    Available:{" "}
                    <span className="text-green-600 font-bold">
                      {canteen.available ? "Yes" : "No"}
                    </span>
                  </h3>
                </div>

                <p className="text-gray-700 leading-relaxed">
                  <strong>Operating Hours:</strong> {canteen.openHours}
                </p>
                <p className="text-gray-700 leading-relaxed">
                  <strong>Capacity:</strong> {canteen.capacity}
                </p>

                <div>
                  <h4 className="font-semibold mb-2 text-gray-800">
                    Menu Highlights:
                  </h4>
                  <ul className="list-disc ml-6 text-gray-600 space-y-1">
                    {canteen.menuHighlights?.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 p-4 bg-[#EEF3FF] border border-[#E1E8FF] rounded-xl">
                  <p className="font-semibold text-gray-700 mb-1">
                    Managed By: {canteen.managedBy}
                  </p>
                  <p className="text-sm text-gray-600">
                    Manager: {canteen.contact?.managerName} | 📞{" "}
                    {canteen.contact?.phone}
                  </p>
                </div>

                {canteen.hygieneCertified && (
                  <div className="mt-5 text-green-700 flex items-center gap-2 text-sm font-medium">
                    ✅ Hygiene Certified
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="border border-gray-200 shadow-lg rounded-2xl bg-white text-center">
              <CardContent className="p-10">
                <AlertCircle className="w-10 h-10 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800">
                  No Canteen Data Found
                </h3>
                <p className="text-gray-600 mt-2">
                  This hospital has not provided canteen information yet.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
