"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Star, Info, User, ThumbsUp, Filter, StarHalf } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ReviewsList = ({ isOpen, onClose, reviewsData, centerName }) => {
  const [filterRating, setFilterRating] = useState("all");

  // Calculate average rating
  const avgRating = reviewsData && reviewsData.length > 0 
    ? (reviewsData.reduce((acc, r) => acc + (r.rating || 0), 0) / reviewsData.length).toFixed(1) 
    : "0.0";

  // Filter reviews by rating
  const filteredReviews = filterRating === "all" 
    ? reviewsData 
    : reviewsData.filter(review => review.rating === parseInt(filterRating));

  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => {
    const count = reviewsData.filter(r => r.rating === rating).length;
    const percentage = reviewsData.length > 0 ? (count / reviewsData.length) * 100 : 0;
    return { rating, count, percentage };
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto p-0">
        <DialogHeader className="sticky top-0 z-10 bg-gradient-to-r from-yellow-600 to-amber-600 text-white p-4 sm:p-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Star className="w-6 h-6" />
              </div>
              <div>
                <DialogTitle className="text-xl sm:text-2xl font-bold text-white">
                  Patient Reviews
                </DialogTitle>
                <p className="text-yellow-100 text-sm mt-1">
                  See what patients say about {centerName}
                </p>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="p-4 sm:p-6">
          {reviewsData && reviewsData.length > 0 ? (
            <div className="space-y-4">
              {/* Rating Overview */}
              <Card className="border border-yellow-100 shadow-lg">
                <CardContent className="p-4 sm:p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Overall Rating */}
                    <div className="flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-gray-200 pb-4 md:pb-0">
                      <div className="text-5xl sm:text-6xl font-bold text-gray-900 mb-2">
                        {avgRating}
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.floor(avgRating)
                                ? "text-yellow-400 fill-yellow-400"
                                : i < Math.ceil(avgRating)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-600 font-medium">
                        Based on {reviewsData.length} review{reviewsData.length !== 1 ? 's' : ''}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {avgRating >= 4.5 ? "Excellent" : avgRating >= 3.5 ? "Very Good" : avgRating >= 2.5 ? "Good" : "Average"}
                      </p>
                    </div>

                    {/* Rating Distribution */}
                    <div className="pt-4 md:pt-0 space-y-2">
                      <h4 className="font-semibold text-gray-900 mb-3 text-sm">Rating Distribution</h4>
                      {ratingDistribution.map(({ rating, count, percentage }) => (
                        <div key={rating} className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-700 w-12">
                            {rating} <Star className="w-3 h-3 inline text-yellow-500" />
                          </span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-yellow-400 h-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 w-12 text-right">
                            {count}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Filter */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Filter by rating:</span>
                </div>
                <div className="flex gap-2">
                  {['all', '5', '4', '3', '2', '1'].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setFilterRating(rating)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        filterRating === rating
                          ? "bg-yellow-500 text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {rating === 'all' ? 'All' : `${rating} ★`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                <div className="text-sm text-gray-600 mb-2">
                  Showing <span className="font-semibold text-yellow-600">{filteredReviews.length}</span> review{filteredReviews.length !== 1 ? 's' : ''}
                </div>

                {filteredReviews.length > 0 ? (
                  filteredReviews.map((review, index) => {
                    const patientName = review.patient?.firstName 
                      ? `${review.patient.firstName} ${review.patient.lastName || ''}`.trim()
                      : review.patientName || "Anonymous Patient";
                    const patientInitial = patientName.charAt(0).toUpperCase();
                    
                    const bgColors = [
                      "from-blue-50 to-indigo-50 border-blue-200",
                      "from-green-50 to-emerald-50 border-green-200",
                      "from-purple-50 to-pink-50 border-purple-200",
                      "from-orange-50 to-amber-50 border-orange-200",
                      "from-cyan-50 to-teal-50 border-cyan-200"
                    ];

                    const initialColors = [
                      "bg-blue-500",
                      "bg-green-500",
                      "bg-purple-500",
                      "bg-orange-500",
                      "bg-cyan-500"
                    ];
                    
                    return (
                      <Card key={review.id || index} className={`bg-gradient-to-r ${bgColors[index % 5]} border shadow-sm hover:shadow-md transition-shadow`}>
                        <CardContent className="p-4 sm:p-5">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-start gap-3 flex-1">
                              <div className={`w-10 h-10 ${initialColors[index % 5]} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}>
                                {patientInitial}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 mb-1">
                                  {patientName}
                                </h4>
                                <p className="text-xs text-gray-600">
                                  {review.createdAt 
                                    ? new Date(review.createdAt).toLocaleDateString('en-US', { 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric' 
                                      })
                                    : "Recently"}
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-1 ml-2">
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating 
                                        ? "text-yellow-400 fill-yellow-400" 
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 text-xs">
                                {review.rating}.0
                              </Badge>
                            </div>
                          </div>

                          {review.comment && (
                            <div className="bg-white/60 rounded-lg p-3 border border-gray-200">
                              <p className="text-gray-700 text-sm leading-relaxed">
                                "{review.comment}"
                              </p>
                            </div>
                          )}

                          {/* Optional: Verified badge */}
                          {review.verified && (
                            <div className="mt-3 flex items-center gap-1 text-green-600">
                              <ThumbsUp className="w-3 h-3" />
                              <span className="text-xs font-medium">Verified Patient</span>
                            </div>
                          )}

                          {/* Optional: Service type */}
                          {review.serviceType && (
                            <div className="mt-2">
                              <Badge className="bg-gray-100 text-gray-700 border-gray-300 text-xs">
                                {review.serviceType}
                              </Badge>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <Star className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No reviews found for this rating</p>
                  </div>
                )}
              </div>

              {/* Additional Info */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-2">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">Share Your Experience:</p>
                    <p>
                      Your feedback helps us improve our services and helps other patients 
                      make informed decisions. After your visit, please take a moment to share your experience.
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
                    <Star className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No Reviews Yet
                  </h3>
                  <p className="text-gray-600 max-w-md">
                    This diagnostic center hasn't received any reviews yet. 
                    Be the first to share your experience and help other patients!
                  </p>
                  <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200 max-w-lg">
                    <div className="flex items-start gap-2">
                      <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-amber-800">
                        After your visit to the center, you'll be able to leave a review 
                        based on your experience with their services and staff.
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

export default ReviewsList;

