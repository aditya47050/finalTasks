"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Coffee, Info, Clock, UtensilsCrossed, CheckCircle, IndianRupee, Leaf } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const InhouseCanteenList = ({ isOpen, onClose, canteenData, centerName }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto p-0">
        <DialogHeader className="sticky top-0 z-10 bg-gradient-to-r from-amber-600 to-yellow-600 text-white p-4 sm:p-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Coffee className="w-6 h-6" />
              </div>
              <div>
                <DialogTitle className="text-xl sm:text-2xl font-bold text-white">
                  Inhouse Canteen
                </DialogTitle>
                <p className="text-amber-100 text-sm mt-1">
                  Fresh meals and refreshments at {centerName}
                </p>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="p-4 sm:p-6">
          {canteenData && canteenData.length > 0 ? (
            <div className="space-y-4">
              <div className="text-sm text-gray-600 mb-4">
                <span className="font-semibold text-amber-600">{canteenData.length}</span> canteen service{canteenData.length > 1 ? 's' : ''} available
              </div>

              {canteenData.map((canteen, index) => (
                <Card key={index} className="border border-amber-100 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-4 sm:p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="p-2 bg-amber-100 rounded-lg">
                          <UtensilsCrossed className="w-5 h-5 text-amber-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {canteen.name || "Hospital Canteen"}
                          </h3>
                          {canteen.description && (
                            <p className="text-gray-600 text-sm">
                              {canteen.description}
                            </p>
                          )}
                        </div>
                      </div>
                      {canteen.operational !== undefined && (
                        <Badge
                          className={`${
                            canteen.operational
                              ? "bg-green-100 text-green-800 border-green-300"
                              : "bg-red-100 text-red-800 border-red-300"
                          } text-xs whitespace-nowrap ml-2`}
                        >
                          {canteen.operational ? "Operational" : "Closed"}
                        </Badge>
                      )}
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      {/* Timing */}
                      {canteen.timings && (
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="w-4 h-4 text-blue-600" />
                            <p className="text-xs font-medium text-blue-600">Operating Hours</p>
                          </div>
                          <p className="text-sm font-semibold text-gray-800">
                            {canteen.timings}
                          </p>
                        </div>
                      )}

                      {/* Location */}
                      {canteen.location && (
                        <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                          <div className="flex items-center gap-2 mb-1">
                            <Coffee className="w-4 h-4 text-purple-600" />
                            <p className="text-xs font-medium text-purple-600">Location</p>
                          </div>
                          <p className="text-sm font-semibold text-gray-800">
                            {canteen.location}
                          </p>
                        </div>
                      )}

                      {/* Price Range */}
                      {canteen.priceRange && (
                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 border border-green-200">
                          <div className="flex items-center gap-2 mb-1">
                            <IndianRupee className="w-4 h-4 text-green-600" />
                            <p className="text-xs font-medium text-green-600">Price Range</p>
                          </div>
                          <p className="text-sm font-semibold text-green-900">
                            {canteen.priceRange}
                          </p>
                        </div>
                      )}

                      {/* Seating Capacity */}
                      {canteen.seatingCapacity && (
                        <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                          <div className="flex items-center gap-2 mb-1">
                            <UtensilsCrossed className="w-4 h-4 text-orange-600" />
                            <p className="text-xs font-medium text-orange-600">Seating</p>
                          </div>
                          <p className="text-sm font-semibold text-gray-800">
                            {canteen.seatingCapacity} persons
                          </p>
                        </div>
                      )}

                      {/* Cuisine Type */}
                      {canteen.cuisineType && (
                        <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-200">
                          <div className="flex items-center gap-2 mb-1">
                            <Leaf className="w-4 h-4 text-indigo-600" />
                            <p className="text-xs font-medium text-indigo-600">Cuisine</p>
                          </div>
                          <p className="text-sm font-semibold text-gray-800">
                            {canteen.cuisineType}
                          </p>
                        </div>
                      )}

                      {/* Contact */}
                      {canteen.contact && (
                        <div className="bg-cyan-50 rounded-lg p-3 border border-cyan-200">
                          <div className="flex items-center gap-2 mb-1">
                            <Coffee className="w-4 h-4 text-cyan-600" />
                            <p className="text-xs font-medium text-cyan-600">Contact</p>
                          </div>
                          <p className="text-sm font-semibold text-gray-800">
                            {canteen.contact}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Menu Categories */}
                    {canteen.menuCategories && canteen.menuCategories.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-gray-600 mb-2 font-medium">Available Cuisine:</p>
                        <div className="flex flex-wrap gap-2">
                          {canteen.menuCategories.map((category, idx) => (
                            <Badge key={idx} className="bg-amber-100 text-amber-800 border border-amber-300 text-xs">
                              {category}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Popular Items */}
                    {canteen.popularItems && canteen.popularItems.length > 0 && (
                      <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200 mb-3">
                        <p className="text-xs text-yellow-700 mb-2 font-medium">Popular Items:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {canteen.popularItems.map((item, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                              <p className="text-sm text-yellow-800">
                                {item.name} {item.price && `- ₹${item.price}`}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Facilities/Features */}
                    {canteen.facilities && canteen.facilities.length > 0 && (
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-3">
                        <p className="text-xs text-gray-600 mb-2 font-medium">Facilities & Features:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {canteen.facilities.map((facility, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                              <p className="text-sm text-gray-700">{facility}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Special Features */}
                    {canteen.specialFeatures && canteen.specialFeatures.length > 0 && (
                      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <p className="text-xs text-green-600 mb-2 font-medium">Special Features:</p>
                        <div className="space-y-2">
                          {canteen.specialFeatures.map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <Leaf className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                              <p className="text-sm text-green-800">{feature}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Additional Notes */}
                    {canteen.notes && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-800">
                          <span className="font-semibold">Note:</span> {canteen.notes}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              {/* Additional Info */}
              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-start gap-2">
                  <Info className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-green-800">
                    <p className="font-semibold mb-1">Canteen Guidelines:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Fresh and hygienic food prepared daily</li>
                      <li>Seating available for patients and visitors</li>
                      <li>Follow canteen timings for meal availability</li>
                      <li>Special diet options available on request</li>
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
                    <Coffee className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Data Not Found
                  </h3>
                  <p className="text-gray-600 max-w-md">
                    Inhouse canteen information is not currently available for
                    this diagnostic center. Please contact the center directly for
                    more information about food and refreshment facilities.
                  </p>
                  <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200 max-w-lg">
                    <div className="flex items-start gap-2">
                      <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-amber-800">
                        You can reach out to the center's reception for details about
                        canteen availability, timings, and menu options.
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

export default InhouseCanteenList;

