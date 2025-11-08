"use client";
import React from "react";
import { Star, User, MessageSquare, X } from "lucide-react";

const RatingServicesList = ({ onClose, homeHealthcareService }) => {
  const reviews = homeHealthcareService?.hospital?.reviews || [];
  const totalReviews = reviews.length;
  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, review) => sum + (review.rating || 0), 0) /
          reviews.length
        ).toFixed(1)
      : "0.0";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-3"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100"
      >
        {/* HEADER */}
        <div className="bg-[#3D85EF] text-white py-4 px-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white/20 rounded-lg">
              <Star className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold tracking-wide">Ratings & Reviews</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white text-xl leading-none"
          >
            ×
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-6 text-center">
          {/* AVERAGE RATING */}
          <div>
            <h2 className="text-5xl font-extrabold text-[#3D85EF] mb-2">{avgRating}</h2>
            <div className="flex justify-center mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-6 h-6 ${
                    i < Math.floor(avgRating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <p className="text-gray-600 text-sm">
              Based on {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
            </p>
          </div>

          {/* REVIEW INSIGHTS */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
              <User className="w-6 h-6 mx-auto mb-1 text-blue-600" />
              <p className="text-xs font-semibold text-gray-900">Verified Patients</p>
              <p className="text-sm font-bold text-[#3D85EF]">{totalReviews}</p>
            </div>
            <div className="p-3 rounded-lg bg-green-50 border border-green-200">
              <MessageSquare className="w-6 h-6 mx-auto mb-1 text-green-600" />
              <p className="text-xs font-semibold text-gray-900">Positive Feedback</p>
              <p className="text-sm font-bold text-green-600">
                {avgRating >= 4.5
                  ? "Excellent"
                  : avgRating >= 4
                  ? "Good"
                  : avgRating >= 3
                  ? "Average"
                  : "Low"}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
              <Star className="w-6 h-6 mx-auto mb-1 text-yellow-500" />
              <p className="text-xs font-semibold text-gray-900">Overall Rating</p>
              <p className="text-sm font-bold text-yellow-600">{avgRating} ★</p>
            </div>
          </div>

          {/* NO REVIEWS FALLBACK */}
          {reviews.length === 0 ? (
            <p className="text-gray-500 text-sm mt-2">
              No patient reviews yet. Be the first to share your feedback.
            </p>
          ) : (
            <div className="text-left mt-4 space-y-3 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
              {reviews.map((review, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-gray-50 border border-gray-200 shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-4 h-4 text-blue-600" />
                    <p className="text-sm font-semibold text-gray-900">
                      {review.userName || "Anonymous"}
                    </p>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {review.comment || "No comment provided."}
                  </p>
                  <div className="flex gap-1 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < (review.rating || 0)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RatingServicesList;
