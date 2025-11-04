"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Stethoscope, Info, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const PathologyList = ({ isOpen, onClose, pathologyData, centerName }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto p-0">
        <DialogHeader className="sticky top-0 z-10 bg-gradient-to-r from-red-600 to-pink-600 text-white p-4 sm:p-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Stethoscope className="w-6 h-6" />
              </div>
              <div>
                <DialogTitle className="text-xl sm:text-2xl font-bold text-white">
                  Pathology Services
                </DialogTitle>
                <p className="text-red-100 text-sm mt-1">
                  Pathology services available at {centerName}
                </p>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="p-4 sm:p-6">
          {pathologyData && pathologyData.trim() !== "" && pathologyData !== "null" ? (
            <Card className="border border-red-100 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <FileText className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Pathology Lab Information
                    </h3>
                    <div className="prose prose-sm max-w-none">
                      <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {pathologyData}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-2">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-semibold mb-1">Important Note:</p>
                      <p>
                        For specific pathology tests and requirements, please contact the
                        diagnostic center directly for accurate information and availability.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border border-gray-200 shadow-lg">
              <CardContent className="p-8 sm:p-12">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Stethoscope className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Data Not Found
                  </h3>
                  <p className="text-gray-600 max-w-md">
                    Pathology information is not currently available for
                    this diagnostic center. Please contact the center directly for
                    more information about pathology services.
                  </p>
                  <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200 max-w-lg">
                    <div className="flex items-start gap-2">
                      <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-amber-800">
                        You can reach out to the center's reception for details about
                        available pathology services and tests.
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

export default PathologyList;

