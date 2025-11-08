"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  ShieldCheck,
  IndianRupee,
  Wallet,
  Loader2,
  XCircle,
  CheckCircle2,
  Landmark,
} from "lucide-react";

const CashlessList = ({ onClose, hospitalId }) => {
  const [cashless, setCashless] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCashlessData = async () => {
      try {
        const res = await fetch(
          `/api/diagnostic-center/${hospitalId}/cashless-services`
        );
        const result = await res.json();

        if (result.success) {
          // Extract payment modes from facilitiesJson if cashlessservices is null
          const modes =
            result.data?.cashlessservices?.services ||
            result.data?.facilitiesJson?.set?.cashlessPaymentModes ||
            result.data?.hspdetails?.paymentmodes ||
            [];

          // Normalize into display-friendly format
          const formattedServices = modes.map((m) => ({
            name: m.mode || m.name || "Payment Option",
            details: "Available payment method for diagnostics center.",
            icon: getIconForMode(m.mode || m.name),
            highlight: m.available ? "Available" : "Not Available",
          }));

          setCashless({
            title: "Cashless & Digital Payment Options",
            subtitle: "Convenient payment methods available for all services",
            services: formattedServices,
          });
        }
      } catch (err) {
        console.error("🔥 Error fetching cashless data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCashlessData();
  }, [hospitalId]);

  // Helper function: Pick icons based on mode
  const getIconForMode = (mode = "") => {
    mode = mode.toLowerCase();
    if (mode.includes("upi")) return IndianRupee;
    if (mode.includes("card")) return CreditCard;
    if (mode.includes("insurance") || mode.includes("tpa")) return ShieldCheck;
    if (mode.includes("bank")) return Landmark;
    if (mode.includes("paytm") || mode.includes("wallet")) return Wallet;
    return CreditCard;
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-xl p-6 shadow-lg flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-gray-600 text-sm">Loading cashless services...</p>
        </div>
      </div>
    );
  }

  if (!cashless || !cashless.services?.length) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-xl p-6 shadow-lg flex flex-col items-center gap-3">
          <XCircle className="w-10 h-10 text-red-500" />
          <p className="text-gray-700 font-semibold">No data available</p>
          <Button onClick={onClose} className="mt-3 bg-blue-600 text-white">
            Close
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">{cashless.title}</h2>
            <p className="text-blue-100 text-sm">{cashless.subtitle}</p>
          </div>
          <Button
            onClick={onClose}
            variant="secondary"
            className="bg-white/20 hover:bg-white/30 text-white rounded-full px-3"
          >
            ✕
          </Button>
        </div>

        {/* Content */}
        <Card className="border-0 rounded-none">
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {cashless.services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <div
                    key={index}
                    className="p-5 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-blue-600 rounded-lg text-white">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-semibold text-gray-900 text-sm md:text-base">
                        {service.name}
                      </h3>
                    </div>
                    <p className="text-gray-700 text-xs md:text-sm leading-relaxed mb-2">
                      {service.details}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      <span className="text-blue-700 text-xs font-medium">
                        {service.highlight}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CashlessList;
