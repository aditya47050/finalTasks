"use client";
import React from "react";
import { X, CreditCard, Smartphone, Banknote, Globe, ShieldCheck, Wallet } from "lucide-react";
import { Card } from "@/components/ui/card";

const CashlessList = ({ onClose, insuranceService, serviceName }) => {
  const cashlessServices = insuranceService?.cashlessServices || [
    {
      type: "BHIM UPI",
      icon: "upi",
      description: "Instant UPI-based payments via linked bank accounts for cashless claim settlements.",
    },
    {
      type: "Google Pay",
      icon: "smartphone",
      description: "Secure and fast UPI payments through Google Pay.",
    },
    {
      type: "PhonePe",
      icon: "smartphone",
      description: "Cashless UPI & wallet payments via PhonePe.",
    },
    {
      type: "Paytm Wallet & UPI",
      icon: "wallet",
      description: "Supports both Paytm wallet and UPI for instant transactions.",
    },
    {
      type: "Debit / Credit Cards",
      icon: "credit",
      description: "Visa, MasterCard, and RuPay cards accepted for cashless insurance settlements.",
    },
    {
      type: "Net Banking",
      icon: "bank",
      description: "Instant net banking options through all major Indian banks.",
    },
  ];

  // Map icon keys to Lucide icons
  const iconMap = {
    upi: <ShieldCheck className="w-6 h-6 text-blue-600" />,
    smartphone: <Smartphone className="w-6 h-6 text-indigo-600" />,
    wallet: <Wallet className="w-6 h-6 text-cyan-600" />,
    credit: <CreditCard className="w-6 h-6 text-green-600" />,
    bank: <Globe className="w-6 h-6 text-purple-600" />,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 relative overflow-hidden border border-blue-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex justify-between items-center">
          <h2 className="text-white font-bold text-lg">
            Cashless Payment Methods
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {cashlessServices.length === 0 ? (
            <p className="text-gray-500 text-center py-10">
              No cashless payment methods available.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {cashlessServices.map((method, index) => (
                <Card
                  key={index}
                  className="flex items-start gap-4 border border-gray-100 shadow-md hover:shadow-lg transition-shadow p-4 rounded-xl bg-white hover:border-blue-300 hover:bg-blue-50/40"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-200">
                    {iconMap[method.icon] || <Banknote className="w-6 h-6 text-blue-600" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-gray-900">
                      {method.type}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 leading-snug">
                      {method.description}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-all shadow-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CashlessList;
