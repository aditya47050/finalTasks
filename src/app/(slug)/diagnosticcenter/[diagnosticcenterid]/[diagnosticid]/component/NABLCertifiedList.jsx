"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  CheckCircle,
  XCircle,
  ShieldCheck,
  RefreshCw,
  X,
} from "lucide-react";

const NABLCertifiedList = ({ diagnosticcenterId, onClose }) => {
  const [nablData, setNablData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (diagnosticcenterId) fetchNablData();
  }, [diagnosticcenterId]);

  const fetchNablData = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/diagnostic-center/${diagnosticcenterId}/nabl-certification`
      );
      if (!res.ok) throw new Error("Failed to fetch NABL certification data");

      const result = await res.json();
      if (!result.success) throw new Error(result.message || "Fetch failed");

      setNablData(result.data);
    } catch (err) {
      console.error("❌ Error fetching NABL:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const approved = nablData?.hspdetails?.nabhnablapproved === "Yes";

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white shadow-2xl rounded-2xl overflow-hidden">
        <CardHeader className="bg-blue-600 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-7 h-7" />
            <CardTitle className="text-xl font-bold">NABL Certification</CardTitle>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
          >
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>

        <CardContent className="p-6 bg-gradient-to-b from-gray-50 to-white">
          {/* Loading State */}
          {loading ? (
            <div className="text-center py-10">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-3" />
              <p className="text-gray-700 font-medium">
                Loading NABL Certification...
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <XCircle className="w-12 h-12 text-red-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                Error Loading Data
              </h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button
                onClick={fetchNablData}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <RefreshCw className="w-4 h-4 mr-2" /> Retry
              </Button>
            </div>
          ) : !nablData ? (
            <div className="text-center py-10">
              <XCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-700">
                No Certification Data Found
              </h3>
              <p className="text-gray-500">
                This diagnostic center has not uploaded NABL certification.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {nablData?.hspInfo?.regname || "Unnamed Diagnostic Center"}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {nablData?.email || "No email available"} |{" "}
                    {nablData?.mobile || "No contact available"}
                  </p>
                </div>
                {approved ? (
                  <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium text-sm">Certified</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 bg-red-100 text-red-700 px-3 py-1 rounded-full">
                    <XCircle className="w-5 h-5" />
                    <span className="font-medium text-sm">Not Certified</span>
                  </div>
                )}
              </div>

              {/* NABL Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-white border rounded-xl shadow-sm">
                  <p className="text-gray-600 text-sm mb-1 font-medium">
                    Approval Status
                  </p>
                  <p className="text-blue-700 font-semibold">
                    {nablData?.hspdetails?.nabhnablapproved || "N/A"}
                  </p>
                </div>
                <div className="p-4 bg-white border rounded-xl shadow-sm">
                  <p className="text-gray-600 text-sm mb-1 font-medium">
                    NABL Level
                  </p>
                  <p className="text-blue-700 font-semibold">
                    {nablData?.hspdetails?.nabhnabllevel || "N/A"}
                  </p>
                </div>
              </div>

              {/* Certificate Link */}
              {nablData?.hspdetails?.nabhnablcertificate && (
                <div className="p-4 bg-gray-50 border rounded-xl">
                  <p className="text-gray-600 text-sm mb-1 font-medium">
                    NABL Certificate
                  </p>
                  <a
                    href={nablData.hspdetails.nabhnablcertificate}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-all"
                  >
                    {nablData.hspdetails.nabhnablcertificate}
                  </a>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NABLCertifiedList;
