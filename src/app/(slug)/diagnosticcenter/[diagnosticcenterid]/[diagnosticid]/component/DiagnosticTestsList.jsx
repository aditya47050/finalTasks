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
import { TestTube, Search, IndianRupee, Award, Tag, X } from "lucide-react";
import { Input } from "@/components/ui/input";

const DiagnosticTestsList = ({ open, onOpenChange, diagnosticServices = [] }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Get unique categories
  const categories = ["All", ...new Set(diagnosticServices.map(service => service.category).filter(Boolean))];

  // Filter tests based on search and category
  const filteredTests = diagnosticServices.filter(service => {
    const matchesSearch = service.facility?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.subCategory?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <TestTube className="w-6 h-6 text-blue-600" />
            Diagnostic Tests
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Browse our comprehensive range of diagnostic tests and services
          </DialogDescription>
        </DialogHeader>

        {/* Search and Filter Section */}
        <div className="px-6 py-4 border-b bg-white space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search by test name, category, or subcategory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
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
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Tests List - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-4 bg-gray-50">
          {filteredTests.length > 0 ? (
            <div className="space-y-4">
              <div className="text-sm text-gray-600 mb-4">
                Showing <span className="font-semibold text-blue-600">{filteredTests.length}</span> {filteredTests.length === 1 ? 'test' : 'tests'}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredTests.map((service, idx) => (
                  <Card
                    key={idx}
                    className="hover:shadow-lg transition-all duration-300 border border-gray-200 bg-white overflow-hidden"
                  >
                    <CardContent className="p-5">
                      {/* Test Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 text-base mb-1 leading-tight">
                            {service.facility}
                          </h4>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {service.category && (
                              <Badge className="bg-blue-100 text-blue-800 border-blue-300 text-xs">
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
                        <Badge
                          className={`${
                            service.available
                              ? "bg-green-100 text-green-800 border-green-300"
                              : "bg-red-100 text-red-800 border-red-300"
                          } text-xs whitespace-nowrap ml-2`}
                        >
                          {service.available ? "Available" : "Unavailable"}
                        </Badge>
                      </div>

                      {/* Pricing Section */}
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200">
                          <div className="flex items-center gap-1 text-blue-600 mb-1">
                            <IndianRupee className="w-3 h-3" />
                            <p className="text-xs font-medium">Min Price</p>
                          </div>
                          <p className="text-lg font-bold text-blue-900">₹{service.minPrice}</p>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 border border-purple-200">
                          <div className="flex items-center gap-1 text-purple-600 mb-1">
                            <IndianRupee className="w-3 h-3" />
                            <p className="text-xs font-medium">Max Price</p>
                          </div>
                          <p className="text-lg font-bold text-purple-900">₹{service.maxPrice}</p>
                        </div>
                      </div>

                      {/* Final Price and Discount */}
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 border border-green-200">
                          <div className="flex items-center gap-1 text-green-600 mb-1">
                            <Award className="w-3 h-3" />
                            <p className="text-xs font-medium">Final Price</p>
                          </div>
                          <p className="text-lg font-bold text-green-900">
                            {service.finalPrice ? `₹${service.finalPrice}` : "Call for Price"}
                          </p>
                        </div>
                        {service.discount > 0 && (
                          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-3 border border-orange-200">
                            <div className="flex items-center gap-1 text-orange-600 mb-1">
                              <Tag className="w-3 h-3" />
                              <p className="text-xs font-medium">Discount</p>
                            </div>
                            <p className="text-lg font-bold text-orange-900">{service.discount}%</p>
                          </div>
                        )}
                      </div>

                      {/* Machine/Equipment Info */}
                      {service.machinemodel && (
                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                          <p className="text-xs text-gray-600 mb-1 font-medium">Equipment/Machine</p>
                          <p className="text-sm font-semibold text-gray-800">{service.machinemodel}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <TestTube className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No tests found</h3>
              <p className="text-gray-500">
                {searchTerm || selectedCategory !== "All"
                  ? "Try adjusting your search or filter criteria"
                  : "No diagnostic tests are currently available"}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50">
          <p className="text-sm text-gray-600 text-center">
            For booking or more information, please contact the diagnostic center directly
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DiagnosticTestsList;

