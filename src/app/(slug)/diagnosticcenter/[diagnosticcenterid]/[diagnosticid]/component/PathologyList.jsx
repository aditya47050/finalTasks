"use client";
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  FlaskConical,
  FileText,
  ShieldCheck,
  Microscope,
  CheckCircle,
  AlertCircle,
  Link as LinkIcon
} from "lucide-react";

const PathologyList = ({ open, onOpenChange, diagnosticcenterId }) => {
  const [pathologyData, setPathologyData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch Pathology details
  useEffect(() => {
    if (!open) return;
    const fetchPathologyData = async () => {
      try {
        console.log("🧬 Fetching pathology data for:", diagnosticcenterId);
        const res = await fetch(
          `/api/diagnostic-center/${diagnosticcenterId}/pathology`
        );
        const data = await res.json();
        if (data.success) {
          setPathologyData(data.data);
        }
      } catch (error) {
        console.error("🔥 Error fetching pathology details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPathologyData();
  }, [open, diagnosticcenterId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 overflow-hidden rounded-2xl">
        <DialogHeader className="p-6 pb-3 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Microscope className="w-5 h-5" /> Pathology Certification
          </DialogTitle>
        </DialogHeader>

        <Card className="border-0 rounded-none shadow-none">
          <CardContent className="p-6">
            {loading ? (
              <div className="text-center text-gray-500 py-10">Loading...</div>
            ) : pathologyData ? (
              <div className="space-y-6">
                {/* Center Basic Info */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {pathologyData.hspInfo?.regname || "Diagnostic Center"}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {pathologyData.email} | {pathologyData.mobile}
                    </p>
                  </div>
                  <Badge
                    className={`${
                      pathologyData?.hspdetails?.pathologyapproved === "Yes"
                        ? "bg-green-100 text-green-800 border-green-300"
                        : "bg-red-100 text-red-800 border-red-300"
                    } text-sm py-1 px-3 mt-3 sm:mt-0`}
                  >
                    {pathologyData?.hspdetails?.pathologyapproved === "Yes"
                      ? "Certified"
                      : "Not Certified"}
                  </Badge>
                </div>

                {/* Certification Details */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center gap-3 mb-3">
                    <ShieldCheck className="w-5 h-5 text-blue-600" />
                    <h3 className="text-sm font-semibold text-gray-800">
                      Certification Details
                    </h3>
                  </div>

                  <div className="space-y-3 text-sm text-gray-700">
                    <p className="flex justify-between">
                      <span className="font-medium">Approval Status:</span>
                      <span>
                        {pathologyData?.hspdetails?.pathologyapproved || "N/A"}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className="font-medium">Certificate:</span>
                      {pathologyData?.hspdetails?.pathologycertificate ? (
                        <a
                          href={pathologyData.hspdetails.pathologycertificate}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-600 hover:underline"
                        >
                          <FileText className="w-4 h-4" /> View Certificate
                        </a>
                      ) : (
                        <span className="text-gray-500">Not Available</span>
                      )}
                    </p>
                    <p>
                      <span className="font-medium">Pathology Types:</span>{" "}
                      <br />
                      {pathologyData?.hspdetails?.pathologytype ||
                        "Details not available"}
                    </p>
                  </div>
                </div>

                {/* Quality & Status */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                    <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-1" />
                    <p className="text-xs font-medium text-green-800">
                      Certified Laboratory
                    </p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                    <FlaskConical className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                    <p className="text-xs font-medium text-blue-800">
                      {pathologyData?.hspInfo?.pathology === "Yes"
                        ? "Pathology Available"
                        : "Not Available"}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-10 flex flex-col items-center">
                <AlertCircle className="w-10 h-10 text-gray-400 mb-2" />
                <p>No Pathology details found.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default PathologyList;
