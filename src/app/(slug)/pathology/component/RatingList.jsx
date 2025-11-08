"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Award, Clock, Headphones, IndianRupee, X } from "lucide-react";

const RatingList = ({ onClose, hospitalId }) => {
  const [ratingData, setRatingData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const res = await fetch(`/api/pathology/rating?hospitalId=${hospitalId}`);
        const data = await res.json();
        if (data.success) setRatingData(data.data);
      } catch (err) {
        console.error("❌ Error fetching ratings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRatings();
  }, [hospitalId]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 text-center shadow-lg">
          <p className="text-blue-600 font-semibold">Loading Ratings...</p>
        </div>
      </div>
    );
  }

  if (!ratingData) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 text-center shadow-lg">
          <p className="text-gray-600 font-semibold">No rating data available</p>
          <button
            onClick={onClose}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-2 sm:px-4">
      <Card className="w-full max-w-2xl max-h-[85vh] bg-white shadow-xl rounded-2xl overflow-hidden relative animate-in fade-in-50 zoom-in-95">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 sm:p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 bg-white/20 hover:bg-white/30 rounded-full p-1"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <h2 className="text-2xl font-bold">Lab Ratings & Reviews</h2>
          <p className="text-blue-100 text-sm mt-1">Powered by Verified Patients</p>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto" style={{ maxHeight: "calc(85vh - 90px)" }}>
          <CardContent className="p-5 sm:p-6 space-y-5">
            {/* Overall Rating */}
            <div className="text-center">
              <div className="flex justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-6 h-6 ${
                      i < Math.floor(ratingData.averageRating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-4xl font-extrabold text-blue-700">
                {ratingData.averageRating}
              </p>
              <p className="text-gray-600 text-sm mt-1">
                Based on {ratingData.totalReviews} verified reviews
              </p>
              {ratingData.certified && (
                <div className="flex justify-center items-center mt-2 text-green-600 text-sm font-semibold">
                  <Award className="w-4 h-4 mr-1" /> NABL {ratingData.nablLevel} Certified
                </div>
              )}
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ratingData.highlights?.map((h, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl border border-gray-200 bg-gradient-to-br from-blue-50 to-white hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-2 mb-2">
                    {h.icon === "Award" && <Award className="w-5 h-5 text-blue-600" />}
                    {h.icon === "Clock" && <Clock className="w-5 h-5 text-orange-500" />}
                    {h.icon === "IndianRupee" && (
                      <IndianRupee className="w-5 h-5 text-green-600" />
                    )}
                    {h.icon === "Headphones" && (
                      <Headphones className="w-5 h-5 text-purple-600" />
                    )}
                    <h4 className="font-semibold text-gray-900 text-sm">{h.title}</h4>
                  </div>
                  <p className="text-gray-700 text-sm font-medium">{h.score}</p>
                  <p className="text-gray-500 text-xs mt-1">{h.comment}</p>
                </div>
              ))}
            </div>

            {/* Recent Reviews */}
            {ratingData.recentReviews?.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Recent Reviews
                </h3>
                <div className="space-y-3">
                  {ratingData.recentReviews.map((review, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-50 border border-gray-200 rounded-xl p-3 hover:bg-blue-50 transition-all"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <p className="font-semibold text-gray-900 text-sm">
                          {review.name}
                        </p>
                        <div className="flex">
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
                      </div>
                      <p className="text-gray-700 text-sm">{review.comment}</p>
                      <p className="text-gray-400 text-xs mt-1">
                        {new Date(review.date).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </div>
      </Card>
    </div>
  );
};

export default RatingList;
