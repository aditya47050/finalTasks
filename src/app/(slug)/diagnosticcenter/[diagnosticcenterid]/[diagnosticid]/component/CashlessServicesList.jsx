"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CreditCard,
  Smartphone,
  Building2,
  Banknote,
  Wallet,
  Landmark,
  ShieldCheck,
  X,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const CashlessServicesList = ({ isOpen, onClose, diagnosticcenterid }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🎨 Unified Theme
  const unified = {
    headerGradient: "from-[#1E3B90] to-[#3D85EF]",
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
          `/api/diagnostic-center/${diagnosticcenterid}/cashless-services`
        );
        const result = await res.json();
        if (result.success) setData(result.data);
        else console.error("❌ Failed to fetch:", result.message);
      } catch (err) {
        console.error("🔥 Error fetching Cashless Services:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isOpen, diagnosticcenterid]);

  const info = data?.hspInfo || {};
  const details = data?.hspdetails || {};
  const contact = data?.hspcontact || {};
  const paymentModes = details?.paymentmodes || [];

  // 🧩 Function to select an icon based on payment mode
  const getIcon = (mode) => {
    const name = mode.toLowerCase();
    if (name.includes("upi") || name.includes("paytm") || name.includes("google"))
      return <Smartphone className={`w-5 h-5 ${unified.accentText}`} />;
    if (name.includes("card"))
      return <CreditCard className={`w-5 h-5 ${unified.accentText}`} />;
    if (name.includes("bank"))
      return <Landmark className={`w-5 h-5 ${unified.accentText}`} />;
    if (name.includes("insurance") || name.includes("tpa"))
      return <ShieldCheck className={`w-5 h-5 ${unified.accentText}`} />;
    return <Wallet className={`w-5 h-5 ${unified.accentText}`} />;
  };

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
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-white tracking-wide">
                  Cashless Services
                </DialogTitle>
                <p className="text-white/90 text-sm mt-1">
                  Accepted payment options at{" "}
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
              Loading Cashless Services...
            </div>
          ) : info.cashlessservices === "Yes" ? (
            <Card
              className={`border ${unified.borderColor} shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden bg-white`}
            >
              <div className={`h-2 bg-gradient-to-r ${unified.buttonGradient}`} />
              <CardContent className="p-6 sm:p-8 space-y-6">
                {/* ✅ Available Tag */}
                <div className="flex items-center gap-3">
                  <div className={`p-3 ${unified.lightBg} rounded-xl`}>
                    <CheckCircle2 className={`w-6 h-6 ${unified.accentText}`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      Cashless Services Available
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Choose from multiple safe and convenient payment options.
                    </p>
                  </div>
                </div>

                {/* 💳 Payment Modes */}
                {paymentModes.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {paymentModes.map((item, idx) => (
                      <div
                        key={idx}
                        className={`p-4 flex items-center gap-3 rounded-xl border ${unified.borderColor} ${unified.lightBg} hover:shadow-md transition-all`}
                      >
                        {getIcon(item.mode)}
                        <div>
                          <p className="text-gray-900 font-medium">
                            {item.mode}
                          </p>
                          <p className="text-xs text-gray-600">
                            {item.available ? "Available" : "Not Available"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 italic text-center">
                    No payment methods listed yet.
                  </p>
                )}

                {/* 🏦 Bank Details */}
                <div
                  className={`mt-8 p-5 ${unified.lightBg} ${unified.borderColor} border rounded-xl`}
                >
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Bank & Transaction Info
                  </h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    <strong>Bank:</strong> {details.bankname || "N/A"} <br />
                    <strong>Account Type:</strong> {details.accounttype || "N/A"} <br />
                    <strong>IFSC:</strong> {details.ifsccode || "N/A"}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border border-gray-200 shadow-lg rounded-2xl bg-white text-center hover:shadow-xl transition-all duration-300">
              <CardContent className="p-10 sm:p-14">
                <div className="flex flex-col items-center justify-center space-y-5">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                    <CreditCard className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900">
                    Cashless Services Not Available
                  </h3>
                  <p className="text-gray-600 max-w-md leading-relaxed">
                    This diagnostic center currently doesn’t support cashless or digital
                    transactions. Please check again later.
                  </p>

                  <div
                    className={`mt-6 p-5 ${unified.lightBg} rounded-xl ${unified.borderColor} border max-w-lg text-left`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 ${unified.lightBg} rounded-lg`}>
                        <AlertCircle className={`w-5 h-5 ${unified.accentText}`} />
                      </div>
                      <p className="text-sm text-gray-800 leading-relaxed">
                        You can reach out to{" "}
                        <span className="font-semibold">
                          {contact.managername || "the center staff"}
                        </span>{" "}
                        at{" "}
                        <span className="text-[#1E3B90] font-medium">
                          {contact.managercontact || "N/A"}
                        </span>{" "}
                        for more information about supported payment modes or
                        upcoming updates.
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

export default CashlessServicesList;
