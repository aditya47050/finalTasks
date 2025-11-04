"use client";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Shield, Search, IndianRupee, CheckCircle, XCircle, X, Stethoscope, Award } from "lucide-react";
import { Input } from "@/components/ui/input";

const DiagnosticServicesList = ({ open, onOpenChange, diagnosticServices = [] }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Get unique categories
  const categories = ["All", ...new Set(diagnosticServices.map(service => service.category).filter(Boolean))];

  // Filter services based on search and category
  const filteredServices = diagnosticServices.filter(service => {
    const matchesSearch = service.facility?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.subCategory?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b bg-gradient-to-r from-indigo-50 to-purple-50">
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="w-6 h-6 text-indigo-600" />
            Diagnostic Services
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Comprehensive diagnostic services available at our center
          </DialogDescription>
        </DialogHeader>

        {/* Search and Filter Section */}
        <div className="px-6 py-4 border-b bg-white space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search diagnostic services by name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          {categories.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? "bg-indigo-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Services List - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-4 bg-gray-50">
          {filteredServices.length > 0 ? (
            <div className="space-y-4">
              <div className="text-sm text-gray-600 mb-4">
                Showing <span className="font-semibold text-indigo-600">{filteredServices.length}</span> {filteredServices.length === 1 ? 'service' : 'services'}
              </div>
              <div className="grid grid-cols-1 gap-4">
                {filteredServices.map((service, idx) => (
                  <Card
                    key={idx}
                    className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-indigo-500 bg-white overflow-hidden"
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Left Section - Service Details */}
                        <div className="flex-1">
                          {/* Service Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-indigo-100 rounded-lg">
                                  <Stethoscope className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div>
                                  <h4 className="font-bold text-gray-900 text-lg leading-tight">
                                    {service.facility}
                                  </h4>
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {service.category && (
                                      <Badge className="bg-indigo-100 text-indigo-800 border-indigo-300 text-xs">
                                        {service.category}
                                      </Badge>
                                    )}
                                    {service.subCategory && (
                                      <Badge className="bg-purple-100 text-purple-800 border-purple-300 text-xs">
                                        {service.subCategory}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <Badge
                              className={`${
                                service.available
                                  ? "bg-green-100 text-green-800 border-green-300"
                                  : "bg-red-100 text-red-800 border-red-300"
                              } text-xs whitespace-nowrap flex items-center gap-1`}
                            >
                              {service.available ? (
                                <>
                                  <CheckCircle className="w-3 h-3" />
                                  Available
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-3 h-3" />
                                  Unavailable
                                </>
                              )}
                            </Badge>
                          </div>

                          {/* Machine/Equipment Info */}
                          {service.machinemodel && (
                            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200 mb-4">
                              <div className="flex items-center gap-2 mb-1">
                                <Award className="w-4 h-4 text-gray-600" />
                                <p className="text-xs text-gray-600 font-medium">Equipment/Machine Model</p>
                              </div>
                              <p className="text-sm font-semibold text-gray-900">{service.machinemodel}</p>
                            </div>
                          )}
                        </div>

                        {/* Right Section - Pricing */}
                        <div className="lg:w-80">
                          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200">
                            <h5 className="font-bold text-indigo-900 mb-3 text-center">Pricing Details</h5>
                            <div className="space-y-3">
                              {/* Price Range */}
                              <div className="grid grid-cols-2 gap-2">
                                <div className="bg-white rounded-lg p-3 border border-indigo-200">
                                  <div className="flex items-center gap-1 text-indigo-600 mb-1">
                                    <IndianRupee className="w-3 h-3" />
                                    <p className="text-xs font-medium">Min Price</p>
                                  </div>
                                  <p className="text-lg font-bold text-indigo-900">₹{service.minPrice}</p>
                                </div>
                                <div className="bg-white rounded-lg p-3 border border-purple-200">
                                  <div className="flex items-center gap-1 text-purple-600 mb-1">
                                    <IndianRupee className="w-3 h-3" />
                                    <p className="text-xs font-medium">Max Price</p>
                                  </div>
                                  <p className="text-lg font-bold text-purple-900">₹{service.maxPrice}</p>
                                </div>
                              </div>

                              {/* Final Price */}
                              <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg p-4 text-white">
                                <p className="text-xs font-medium mb-1 text-green-100">Final Price</p>
                                <p className="text-2xl font-bold">
                                  {service.finalPrice ? `₹${service.finalPrice}` : "Contact for Price"}
                                </p>
                              </div>

                              {/* Discount Badge */}
                              {service.discount > 0 && (
                                <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-3 text-white text-center">
                                  <p className="text-xs font-medium mb-1">Special Discount</p>
                                  <p className="text-xl font-bold">{service.discount}% OFF</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            /* No Data Found State */
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-16 h-16 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {searchTerm || selectedCategory !== "All" 
                  ? "No Services Found" 
                  : "No Data Found"}
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {searchTerm || selectedCategory !== "All"
                  ? "Try adjusting your search or filter criteria to find the services you're looking for."
                  : "No diagnostic services data is available at this time. Please check back later or contact the diagnostic center directly."}
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-xl mx-auto">
                <div className="flex items-start gap-3">
                  <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div className="text-left">
                    <h4 className="font-semibold text-blue-900 mb-2">Need Help?</h4>
                    <p className="text-sm text-blue-800 leading-relaxed">
                      For detailed information about our diagnostic services, pricing, and availability, 
                      please contact our center directly. Our team will be happy to assist you.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <Shield className="w-4 h-4 text-indigo-600" />
            <p>
              For service booking or detailed information, please contact the diagnostic center directly
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DiagnosticServicesList;

