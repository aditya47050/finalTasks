"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Award, CheckCircle, XCircle, FileText, Calendar, Building2, AlertCircle } from "lucide-react";
import Image from "next/image";

const NABLCertifiedList = ({ open, onOpenChange, diagnosticCenterData = {} }) => {
  // Extract NABL certification data
  const nablData = diagnosticCenterData?.hspdetails;
  const isNABLCertified = nablData?.nabhnablapproved === "Yes";
  const nablCertificate = nablData?.nabhnablcertificate;
  const nablLevel = nablData?.nabhnabllevel;
  const centerName = diagnosticCenterData?.hspInfo?.regname || "Diagnostic Center";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b bg-gradient-to-r from-green-50 to-emerald-50">
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Award className="w-6 h-6 text-green-600" />
            NABL Certification
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            National Accreditation Board for Testing and Calibration Laboratories
          </DialogDescription>
        </DialogHeader>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-6 bg-gray-50">
          {isNABLCertified ? (
            <div className="space-y-6">
              {/* Success Banner */}
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="font-bold text-2xl">NABL Accredited Laboratory</h3>
                    <p className="text-green-100 text-sm mt-1">
                      This diagnostic center meets international quality standards
                    </p>
                  </div>
                </div>
                <div className="bg-white/10 rounded-lg p-4 mt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Accreditation Level</p>
                      <p className="font-bold text-xl mt-1">{nablLevel || "Certified"}</p>
                    </div>
                    <Badge className="bg-white text-green-700 text-sm px-4 py-2">
                      ✓ Verified
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Certificate Information Card */}
              <Card className="border border-green-200 shadow-md rounded-xl">
                <CardContent className="p-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-green-600" />
                    Certification Details
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Building2 className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium text-green-900">Facility Name</span>
                      </div>
                      <p className="font-bold text-gray-900">{centerName}</p>
                    </div>
                    
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium text-green-900">Accreditation Status</span>
                      </div>
                      <p className="font-bold text-green-700">Active & Valid</p>
                    </div>
                    
                    {nablLevel && (
                      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="text-sm font-medium text-green-900">Certification Level</span>
                        </div>
                        <p className="font-bold text-gray-900">{nablLevel}</p>
                      </div>
                    )}
                    
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium text-green-900">Registration No</span>
                      </div>
                      <p className="font-bold text-gray-900">
                        {diagnosticCenterData?.hspdetails?.hspregno || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Certificate Image */}
                  {nablCertificate && (
                    <div className="mt-6">
                      <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-green-600" />
                        NABL Certificate Document
                      </h5>
                      <div className="border-2 border-green-200 rounded-lg overflow-hidden bg-white">
                        <div className="relative w-full h-96">
                          <Image
                            src={nablCertificate}
                            fill
                            alt="NABL Certificate"
                            className="object-contain p-4"
                          />
                        </div>
                        <div className="bg-green-50 p-3 border-t border-green-200">
                          <a
                            href={nablCertificate}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-700 hover:text-green-800 font-medium text-sm hover:underline flex items-center gap-2"
                          >
                            <FileText className="w-4 h-4" />
                            View Full Certificate
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* What is NABL Info Card */}
              <Card className="border border-blue-200 shadow-md rounded-xl">
                <CardContent className="p-6">
                  <h4 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-600" />
                    What is NABL Accreditation?
                  </h4>
                  <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
                    <p>
                      <strong className="text-gray-900">NABL (National Accreditation Board for Testing and Calibration Laboratories)</strong> is an autonomous body under the Department of Science & Technology, Government of India.
                    </p>
                    <p>
                      NABL accreditation ensures that the diagnostic center follows international standards and protocols in testing and calibration, providing you with accurate and reliable test results.
                    </p>
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mt-4">
                      <h5 className="font-semibold text-blue-900 mb-2">Benefits of NABL Accreditation:</h5>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span>Internationally recognized quality standards</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span>Accurate and reliable test results</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span>Strict quality control measures</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span>Regular audits and assessments</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span>Trained and qualified technical staff</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            /* No NABL Certification Found */
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-16 h-16 text-red-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                No NABL Certification Found
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                This diagnostic center does not have NABL certification data available in our records.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-2xl mx-auto">
                <div className="flex items-start gap-4">
                  <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                  <div className="text-left">
                    <h4 className="font-semibold text-yellow-900 mb-2">Note</h4>
                    <p className="text-sm text-yellow-800 leading-relaxed">
                      The absence of NABL certification in our records does not necessarily mean the center is not certified. 
                      We recommend contacting the diagnostic center directly to verify their accreditation status.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50">
          <p className="text-sm text-gray-600 text-center">
            For more information about NABL accreditation, visit{" "}
            <a
              href="https://www.nabl-india.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:text-green-700 font-semibold hover:underline"
            >
              www.nabl-india.org
            </a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NABLCertifiedList;

