"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Video, Info, Clock, IndianRupee, User, CheckCircle, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const OnlineConsultationList = ({ isOpen, onClose, consultationData, centerName }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto p-0">
        <DialogHeader className="sticky top-0 z-10 bg-gradient-to-r from-teal-600 to-cyan-600 text-white p-4 sm:p-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Video className="w-6 h-6" />
              </div>
              <div>
                <DialogTitle className="text-xl sm:text-2xl font-bold text-white">
                  Online Consultation
                </DialogTitle>
                <p className="text-teal-100 text-sm mt-1">
                  Virtual healthcare services at {centerName}
                </p>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="p-4 sm:p-6">
          {consultationData && consultationData.length > 0 ? (
            <div className="space-y-4">
              <div className="text-sm text-gray-600 mb-4">
                <span className="font-semibold text-teal-600">{consultationData.length}</span> consultation service{consultationData.length > 1 ? 's' : ''} available
              </div>

              {consultationData.map((consultation, index) => (
                <Card key={index} className="border border-teal-100 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-4 sm:p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="p-2 bg-teal-100 rounded-lg">
                          <Video className="w-5 h-5 text-teal-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {consultation.serviceName || "Online Consultation"}
                          </h3>
                          {consultation.description && (
                            <p className="text-gray-600 text-sm">
                              {consultation.description}
                            </p>
                          )}
                        </div>
                      </div>
                      {consultation.available !== undefined && (
                        <Badge
                          className={`${
                            consultation.available
                              ? "bg-green-100 text-green-800 border-green-300"
                              : "bg-red-100 text-red-800 border-red-300"
                          } text-xs whitespace-nowrap ml-2`}
                        >
                          {consultation.available ? "Available" : "Unavailable"}
                        </Badge>
                      )}
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      {/* Doctor/Specialist */}
                      {consultation.doctorName && (
                        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                          <div className="flex items-center gap-2 mb-1">
                            <User className="w-4 h-4 text-blue-600" />
                            <p className="text-xs font-medium text-blue-600">Consultant</p>
                          </div>
                          <p className="text-sm font-semibold text-gray-800">
                            Dr. {consultation.doctorName}
                          </p>
                          {consultation.specialization && (
                            <p className="text-xs text-gray-600 mt-1">
                              {consultation.specialization}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Price */}
                      {consultation.price !== undefined && (
                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 border border-green-200">
                          <div className="flex items-center gap-2 mb-1">
                            <IndianRupee className="w-4 h-4 text-green-600" />
                            <p className="text-xs font-medium text-green-600">Consultation Fee</p>
                          </div>
                          <p className="text-lg font-bold text-green-900">
                            ₹{consultation.price}
                          </p>
                        </div>
                      )}

                      {/* Duration */}
                      {consultation.duration && (
                        <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="w-4 h-4 text-purple-600" />
                            <p className="text-xs font-medium text-purple-600">Duration</p>
                          </div>
                          <p className="text-sm font-semibold text-gray-800">
                            {consultation.duration}
                          </p>
                        </div>
                      )}

                      {/* Available Days/Time */}
                      {consultation.availability && (
                        <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="w-4 h-4 text-orange-600" />
                            <p className="text-xs font-medium text-orange-600">Availability</p>
                          </div>
                          <p className="text-sm font-semibold text-gray-800">
                            {consultation.availability}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Features/Benefits */}
                    {consultation.features && consultation.features.length > 0 && (
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <p className="text-xs text-gray-600 mb-2 font-medium">Features:</p>
                        <div className="space-y-2">
                          {consultation.features.map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                              <p className="text-sm text-gray-700">{feature}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Platform/Technology Info */}
                    {consultation.platform && (
                      <div className="mt-4 bg-indigo-50 rounded-lg p-3 border border-indigo-200">
                        <p className="text-xs text-indigo-600 mb-1 font-medium">Platform</p>
                        <p className="text-sm font-semibold text-gray-800">
                          {consultation.platform}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              {/* Additional Info */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-2">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">How to Book:</p>
                    <p>
                      Contact the center directly to schedule your online consultation. 
                      Ensure you have a stable internet connection and a device with a camera and microphone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Card className="border border-gray-200 shadow-lg">
              <CardContent className="p-8 sm:p-12">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Video className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Data Not Found
                  </h3>
                  <p className="text-gray-600 max-w-md">
                    Online consultation services are not currently available at
                    this diagnostic center. Please contact the center directly for
                    more information about virtual healthcare options.
                  </p>
                  <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200 max-w-lg">
                    <div className="flex items-start gap-2">
                      <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-amber-800">
                        You can reach out to the center's reception to inquire about
                        online consultation availability and booking procedures.
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

export default OnlineConsultationList;

