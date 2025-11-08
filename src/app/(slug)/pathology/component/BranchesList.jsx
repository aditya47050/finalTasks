"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  X,
  MapPin,
  Phone,
  Mail,
  Clock,
  Award,
  Building2,
  CheckCircle,
} from "lucide-react";

const BranchesList = ({ onClose, hospitalId }) => {
  const [branchData, setBranchData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await fetch(`/api/pathology/branches?hospitalId=${hospitalId}`);
        const data = await res.json();
        if (data.success) setBranchData(data.data);
      } catch (err) {
        console.error("❌ Error fetching branches:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBranches();
  }, [hospitalId]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 text-center shadow-lg">
          <p className="text-blue-600 font-semibold">Loading Branches...</p>
        </div>
      </div>
    );
  }

  if (!branchData) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 text-center shadow-lg">
          <p className="text-gray-600 font-semibold">No branch data available</p>
          <button
            onClick={onClose}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-2 sm:px-4">
      <Card className="w-full max-w-3xl bg-white shadow-xl rounded-2xl overflow-hidden relative animate-in fade-in-50 zoom-in-95">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 sm:p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 bg-white/20 hover:bg-white/30 rounded-full p-1"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <Building2 className="w-10 h-10 mx-auto mb-2 text-white/90" />
          <h2 className="text-2xl font-bold">{branchData.title || "Our Branches"}</h2>
          <p className="text-blue-100 text-sm mt-1">
            {branchData.subtitle || "Multiple Centers, One Quality Standard"}
          </p>
        </div>

        {/* Content */}
        <CardContent className="p-5 sm:p-6 space-y-4 overflow-y-auto max-h-[75vh]">
          <p className="text-gray-600 text-sm text-center mb-3">
            {branchData.description ||
              "Explore our different pathology centers with advanced testing and home collection services."}
          </p>

          {branchData.branches?.map((branch, idx) => (
            <div
              key={idx}
              className="border border-gray-200 rounded-xl p-4 bg-gradient-to-br from-blue-50 to-white hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  {branch.name}
                </h3>
                <span className="text-sm text-gray-500">
                  {branch.openDays || "Mon - Sat"}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2 text-gray-700">
                  <MapPin className="w-4 h-4 text-blue-600 mt-0.5" />
                  <span>{branch.address}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Phone className="w-4 h-4 text-green-600" />
                  <span>{branch.contact}</span>
                </div>
                {branch.email && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Mail className="w-4 h-4 text-purple-600" />
                    <span>{branch.email}</span>
                  </div>
                )}
                {branch.timing && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Clock className="w-4 h-4 text-orange-500" />
                    <span>{branch.timing}</span>
                  </div>
                )}
              </div>

              {branch.facilities && branch.facilities.length > 0 && (
                <div className="mt-3">
                  <div className="flex flex-wrap gap-2">
                    {branch.facilities.map((facility, i) => (
                      <span
                        key={i}
                        className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-xs font-medium"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        {facility}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default BranchesList;
