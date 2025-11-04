"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreditCard, Info, Building2, CheckCircle, Shield, FileText, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const CashlessServicesList = ({ isOpen, onClose, cashlessData, centerName }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto p-0">
        <DialogHeader className="sticky top-0 z-10 bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 sm:p-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <DialogTitle className="text-xl sm:text-2xl font-bold text-white">
                  Cashless Services
                </DialogTitle>
                <p className="text-green-100 text-sm mt-1">
                  Hassle-free insurance coverage at {centerName}
                </p>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="p-4 sm:p-6">
          {cashlessData && cashlessData.length > 0 ? (
            <div className="space-y-4">
              <div className="text-sm text-gray-600 mb-4">
                <span className="font-semibold text-green-600">{cashlessData.length}</span> cashless service provider{cashlessData.length > 1 ? 's' : ''} available
              </div>

              {cashlessData.map((service, index) => (
                <Card key={index} className="border border-green-100 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-4 sm:p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Building2 className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {service.providerName || service.insuranceName || "Insurance Provider"}
                          </h3>
                          {service.description && (
                            <p className="text-gray-600 text-sm">
                              {service.description}
                            </p>
                          )}
                        </div>
                      </div>
                      {service.active !== undefined && (
                        <Badge
                          className={`${
                            service.active
                              ? "bg-green-100 text-green-800 border-green-300"
                              : "bg-red-100 text-red-800 border-red-300"
                          } text-xs whitespace-nowrap ml-2`}
                        >
                          {service.active ? "Active" : "Inactive"}
                        </Badge>
                      )}
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      {/* Insurance Type */}
                      {service.insuranceType && (
                        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                          <div className="flex items-center gap-2 mb-1">
                            <Shield className="w-4 h-4 text-blue-600" />
                            <p className="text-xs font-medium text-blue-600">Insurance Type</p>
                          </div>
                          <p className="text-sm font-semibold text-gray-800">
                            {service.insuranceType}
                          </p>
                        </div>
                      )}

                      {/* Policy Number */}
                      {service.policyNumber && (
                        <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                          <div className="flex items-center gap-2 mb-1">
                            <FileText className="w-4 h-4 text-purple-600" />
                            <p className="text-xs font-medium text-purple-600">Policy Number</p>
                          </div>
                          <p className="text-sm font-semibold text-gray-800">
                            {service.policyNumber}
                          </p>
                        </div>
                      )}

                      {/* Coverage Amount */}
                      {service.coverageAmount && (
                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 border border-green-200">
                          <div className="flex items-center gap-2 mb-1">
                            <CreditCard className="w-4 h-4 text-green-600" />
                            <p className="text-xs font-medium text-green-600">Coverage Amount</p>
                          </div>
                          <p className="text-lg font-bold text-green-900">
                            ₹{service.coverageAmount.toLocaleString()}
                          </p>
                        </div>
                      )}

                      {/* Processing Time */}
                      {service.processingTime && (
                        <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                          <div className="flex items-center gap-2 mb-1">
                            <Info className="w-4 h-4 text-orange-600" />
                            <p className="text-xs font-medium text-orange-600">Processing Time</p>
                          </div>
                          <p className="text-sm font-semibold text-gray-800">
                            {service.processingTime}
                          </p>
                        </div>
                      )}

                      {/* Contact Person */}
                      {service.contactPerson && (
                        <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-200">
                          <div className="flex items-center gap-2 mb-1">
                            <Phone className="w-4 h-4 text-indigo-600" />
                            <p className="text-xs font-medium text-indigo-600">Contact Person</p>
                          </div>
                          <p className="text-sm font-semibold text-gray-800">
                            {service.contactPerson}
                          </p>
                          {service.contactNumber && (
                            <p className="text-xs text-indigo-700 mt-1">
                              {service.contactNumber}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Network Type */}
                      {service.networkType && (
                        <div className="bg-cyan-50 rounded-lg p-3 border border-cyan-200">
                          <div className="flex items-center gap-2 mb-1">
                            <Building2 className="w-4 h-4 text-cyan-600" />
                            <p className="text-xs font-medium text-cyan-600">Network Type</p>
                          </div>
                          <p className="text-sm font-semibold text-gray-800">
                            {service.networkType}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Covered Services */}
                    {service.coveredServices && service.coveredServices.length > 0 && (
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-3">
                        <p className="text-xs text-gray-600 mb-2 font-medium">Covered Services:</p>
                        <div className="space-y-2">
                          {service.coveredServices.map((covered, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                              <p className="text-sm text-gray-700">{covered}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Required Documents */}
                    {service.requiredDocuments && service.requiredDocuments.length > 0 && (
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-3">
                        <p className="text-xs text-blue-600 mb-2 font-medium">Required Documents:</p>
                        <div className="space-y-1">
                          {service.requiredDocuments.map((doc, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <FileText className="w-3 h-3 text-blue-600 flex-shrink-0 mt-1" />
                              <p className="text-sm text-blue-800">{doc}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Benefits/Features */}
                    {service.benefits && service.benefits.length > 0 && (
                      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <p className="text-xs text-green-600 mb-2 font-medium">Key Benefits:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {service.benefits.map((benefit, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                              <p className="text-sm text-green-800">{benefit}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Additional Notes */}
                    {service.notes && (
                      <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                        <p className="text-sm text-amber-800">
                          <span className="font-semibold">Note:</span> {service.notes}
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
                    <p className="font-semibold mb-1">How to Avail Cashless Service:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Carry your valid insurance card and ID proof</li>
                      <li>Inform the reception about cashless facility at admission</li>
                      <li>Pre-authorization will be obtained from your insurance company</li>
                      <li>Ensure all required documents are submitted on time</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Card className="border border-gray-200 shadow-lg">
              <CardContent className="p-8 sm:p-12">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <CreditCard className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Data Not Found
                  </h3>
                  <p className="text-gray-600 max-w-md">
                    Cashless service information is not currently available for
                    this diagnostic center. Please contact the center directly for
                    more information about insurance tie-ups and cashless facilities.
                  </p>
                  <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200 max-w-lg">
                    <div className="flex items-start gap-2">
                      <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-amber-800">
                        You can reach out to the center's reception for details about
                        available insurance providers and cashless claim procedures.
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

