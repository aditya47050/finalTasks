"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Award, Info, Calendar, Users, Star, TrendingUp, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ExperienceList = ({ isOpen, onClose, experienceData, centerName }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto p-0">
        <DialogHeader className="sticky top-0 z-10 bg-gradient-to-r from-amber-600 to-orange-600 text-white p-4 sm:p-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <DialogTitle className="text-xl sm:text-2xl font-bold text-white">
                  Experience & Expertise
                </DialogTitle>
                <p className="text-amber-100 text-sm mt-1">
                  Years of excellence at {centerName}
                </p>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="p-4 sm:p-6">
          {experienceData && experienceData.length > 0 ? (
            <div className="space-y-4">
              <div className="text-sm text-gray-600 mb-4">
                <span className="font-semibold text-amber-600">{experienceData.length}</span> experience record{experienceData.length > 1 ? 's' : ''} available
              </div>

              {experienceData.map((experience, index) => (
                <Card key={index} className="border border-amber-100 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-4 sm:p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="p-2 bg-amber-100 rounded-lg">
                          <Award className="w-5 h-5 text-amber-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {experience.title || "Professional Experience"}
                          </h3>
                          {experience.description && (
                            <p className="text-gray-600 text-sm">
                              {experience.description}
                            </p>
                          )}
                        </div>
                      </div>
                      {experience.verified !== undefined && (
                        <Badge
                          className={`${
                            experience.verified
                              ? "bg-green-100 text-green-800 border-green-300"
                              : "bg-gray-100 text-gray-800 border-gray-300"
                          } text-xs whitespace-nowrap ml-2`}
                        >
                          {experience.verified ? "Verified" : "Unverified"}
                        </Badge>
                      )}
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      {/* Years of Experience */}
                      {experience.years && (
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200">
                          <div className="flex items-center gap-2 mb-1">
                            <Calendar className="w-4 h-4 text-blue-600" />
                            <p className="text-xs font-medium text-blue-600">Years of Experience</p>
                          </div>
                          <p className="text-2xl font-bold text-blue-900">
                            {experience.years}+ Years
                          </p>
                        </div>
                      )}

                      {/* Established Year */}
                      {experience.establishedYear && (
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 border border-purple-200">
                          <div className="flex items-center gap-2 mb-1">
                            <Calendar className="w-4 h-4 text-purple-600" />
                            <p className="text-xs font-medium text-purple-600">Established</p>
                          </div>
                          <p className="text-2xl font-bold text-purple-900">
                            {experience.establishedYear}
                          </p>
                        </div>
                      )}

                      {/* Patients Served */}
                      {experience.patientsServed && (
                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 border border-green-200">
                          <div className="flex items-center gap-2 mb-1">
                            <Users className="w-4 h-4 text-green-600" />
                            <p className="text-xs font-medium text-green-600">Patients Served</p>
                          </div>
                          <p className="text-lg font-bold text-green-900">
                            {experience.patientsServed.toLocaleString()}+
                          </p>
                        </div>
                      )}

                      {/* Success Rate */}
                      {experience.successRate && (
                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-3 border border-orange-200">
                          <div className="flex items-center gap-2 mb-1">
                            <TrendingUp className="w-4 h-4 text-orange-600" />
                            <p className="text-xs font-medium text-orange-600">Success Rate</p>
                          </div>
                          <p className="text-lg font-bold text-orange-900">
                            {experience.successRate}%
                          </p>
                        </div>
                      )}

                      {/* Rating */}
                      {experience.rating && (
                        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-3 border border-yellow-200">
                          <div className="flex items-center gap-2 mb-1">
                            <Star className="w-4 h-4 text-yellow-600" />
                            <p className="text-xs font-medium text-yellow-600">Rating</p>
                          </div>
                          <p className="text-lg font-bold text-yellow-900">
                            {experience.rating} / 5.0
                          </p>
                        </div>
                      )}

                      {/* Specialization */}
                      {experience.specialization && (
                        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-3 border border-indigo-200">
                          <div className="flex items-center gap-2 mb-1">
                            <Award className="w-4 h-4 text-indigo-600" />
                            <p className="text-xs font-medium text-indigo-600">Specialization</p>
                          </div>
                          <p className="text-sm font-semibold text-indigo-900">
                            {experience.specialization}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Achievements/Highlights */}
                    {experience.achievements && experience.achievements.length > 0 && (
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <p className="text-xs text-gray-600 mb-2 font-medium">Key Achievements:</p>
                        <div className="space-y-2">
                          {experience.achievements.map((achievement, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                              <p className="text-sm text-gray-700">{achievement}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Services Offered */}
                    {experience.services && experience.services.length > 0 && (
                      <div className="mt-4">
                        <p className="text-xs text-gray-600 mb-2 font-medium">Services Offered:</p>
                        <div className="flex flex-wrap gap-2">
                          {experience.services.map((service, idx) => (
                            <Badge key={idx} className="bg-amber-100 text-amber-800 border border-amber-300 text-xs">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Additional Info */}
                    {experience.additionalInfo && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-800">
                          {experience.additionalInfo}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              {/* Additional Note */}
              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-start gap-2">
                  <Info className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-green-800">
                    <p className="font-semibold mb-1">Trusted Healthcare Partner:</p>
                    <p>
                      Our years of experience ensure that you receive the highest quality of care 
                      with state-of-the-art facilities and expert professionals.
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
                    <Award className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Data Not Found
                  </h3>
                  <p className="text-gray-600 max-w-md">
                    Experience information is not currently available for
                    this diagnostic center. Please contact the center directly for
                    more information about their expertise and track record.
                  </p>
                  <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200 max-w-lg">
                    <div className="flex items-start gap-2">
                      <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-amber-800">
                        You can reach out to the center's reception for details about
                        their years of service, specializations, and achievements.
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

export default ExperienceList;

