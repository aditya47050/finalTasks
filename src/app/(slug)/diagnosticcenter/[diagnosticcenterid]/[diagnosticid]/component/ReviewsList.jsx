"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import {
  Star,
  User,
  Calendar,
  MessageCircle,
  AlertCircle,
  X,
} from "lucide-react";

const ReviewsList = ({ isOpen, onClose, diagnosticcenterid, centerName }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🩵 Unified Theme
  const unified = {
    headerGradient: "from-[#1E3B90] to-[#3D85EF]",
    accentText: "text-[#1E3B90]",
    buttonGradient: "from-[#1E3B90] to-[#3D85EF]",
    lightBg: "bg-[#EEF3FF]",
    borderColor: "border-[#E1E8FF]",
  };

  useEffect(() => {
    if (!isOpen || !diagnosticcenterid) return;

    const fetchReviews = async () => {
      try {
        const res = await fetch(
          `/api/diagnostic-center/${diagnosticcenterid}/reviews`
        );
        const result = await res.json();
        if (result.success) {
          setReviews(result.data);
        } else {
          console.error("❌ Failed to fetch reviews:", result.message);
        }
      } catch (error) {
        console.error("🔥 Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [isOpen, diagnosticcenterid]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-4xl max-h-[85vh] overflow-y-auto p-0 rounded-2xl shadow-2xl border-none"
        hideCloseButton
      >
        {/* Header */}
        <DialogHeader
          className={`sticky top-0 z-10 bg-gradient-to-r ${unified.headerGradient} text-white p-5 sm:p-6 rounded-t-2xl shadow-md`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/25 rounded-xl backdrop-blur-sm shadow-inner">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-white tracking-wide">
                  Patient Reviews
                </DialogTitle>
                <p className="text-white/90 text-sm mt-1">
                  Feedback and experiences from patients at{" "}
                  <span className="font-semibold">{centerName}</span>
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 transition-all p-2 rounded-lg backdrop-blur-sm focus:outline-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="p-6 sm:p-8 bg-white">
          {loading ? (
            <div className="text-center text-gray-500 py-10">
              Loading reviews...
            </div>
          ) : reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review, index) => (
                <Card
                  key={index}
                  className={`border ${unified.borderColor} shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden`}
                >
                  <div
                    className={`h-1 bg-gradient-to-r ${unified.buttonGradient}`}
                  />
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div
                          className={`p-3 ${unified.lightBg} rounded-xl flex-shrink-0`}
                        >
                          <User className={`w-6 h-6 ${unified.accentText}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {review.patient?.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {review.patient?.email || "No email"} |{" "}
                            {review.patient?.mobile || "No contact"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < review.rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="mt-4 text-gray-800 leading-relaxed">
                      {review.comment}
                    </p>

                    <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border border-gray-200 shadow-lg rounded-2xl bg-white text-center hover:shadow-xl transition-all duration-300">
              <CardContent className="p-10 sm:p-14">
                <div className="flex flex-col items-center justify-center space-y-5">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900">
                    No Reviews Yet
                  </h3>
                  <p className="text-gray-600 max-w-md leading-relaxed">
                    There are no patient reviews available for{" "}
                    <span className="font-semibold text-[#1E3B90]">
                      {centerName}
                    </span>{" "}
                    yet. Check back later or be the first to share your
                    experience!
                  </p>
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
