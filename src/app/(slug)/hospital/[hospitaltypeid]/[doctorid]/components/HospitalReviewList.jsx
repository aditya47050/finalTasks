"use client";

import React, { useEffect, useState } from "react";
import { Star, Users, X, Loader2, MessageSquare } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const HospitalReviewList = ({ hospitalId, onClose }) => {
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHospitalReviews();
  }, [hospitalId]);

  const fetchHospitalReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/hospital/${hospitalId}/reviews`);
      const data = await res.json();

      if (!data.success) throw new Error(data.message || "Failed to fetch");

      setReviews(data.reviews || []);
      setAvgRating(data.averageRating || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
      <div className="w-full h-full overflow-y-auto">
        <Card className="w-full max-w-[95vw] lg:max-w-none lg:rounded-none lg:border-0 lg:shadow-none mx-auto min-h-screen bg-white">
          {/* Header */}
          <CardHeader className="border-b bg-gradient-to-r from-[#1E3B90] to-[#3D85EF] text-white sticky top-0 z-10 shadow-md">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl lg:text-3xl font-bold">
                    HSP Reviews & Ratings
                  </CardTitle>
                  <p className="text-sm text-blue-100 flex items-center gap-2">
                    ⭐ Average Rating:{" "}
                    <span className="text-white font-semibold">
                      {avgRating.toFixed(1)}
                    </span>
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white hover:bg-white/20 h-10 w-10 rounded-lg"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </CardHeader>

          {/* Content */}
          <CardContent className="relative z-0 p-6 lg:px-8 lg:py-8 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-7xl mx-auto">
              {loading ? (
                <div className="text-center py-16">
                  <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Loading Reviews
                  </h3>
                  <p className="text-gray-600">Please wait...</p>
                </div>
              ) : error ? (
                <div className="text-center py-16">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Error Loading Reviews
                  </h3>
                  <p className="text-red-600 mb-6">{error}</p>
                  <Button
                    onClick={fetchHospitalReviews}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Try Again
                  </Button>
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-16">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-700 mb-2">
                    No Reviews Found
                  </h3>
                  <p className="text-gray-500">
                    Be the first to review this hospital.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="bg-gradient-to-br from-[#EFF6FF] to-white border border-blue-100 rounded-2xl p-6 shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-700 italic mb-4">
                        “{review.comment}”
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>
                          —{" "}
                          {review.patient?.firstName
                            ? `${review.patient.firstName} ${
                                review.patient.lastName || ""
                              }`
                            : "Anonymous"}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HospitalReviewList;
