"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TestTube,
  ShieldCheck,
  IndianRupee,
  Percent,
  Star,
  X,
  AlertCircle,
  Loader2,
  ArrowLeft,
  CheckCircle,
  Clock,
  Award,
} from "lucide-react";

const LabTestList = ({ onClose, hospitalId }) => {
  const [labTests, setLabTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);

  const theme = {
    headerGradient: "from-[#1E3B90] to-[#3D85EF]",
    cardGradient: "from-[#1E3B90]/10 to-[#3D85EF]/10",
    accent: "text-[#1E3B90]",
    buttonGradient: "from-[#1E3B90] to-[#3D85EF]",
  };

  useEffect(() => {
    async function fetchLabTests() {
      try {
        setLoading(true);
        const res = await fetch(`/api/pathology/lab-tests?hospitalId=${hospitalId}`);
        const result = await res.json();

        if (result.success && result.data) {
          // ✅ Clean discount values
          const cleaned = result.data.map((t) => ({
            ...t,
            discount: t.discount
              ? String(t.discount).replace("%", "").trim()
              : "0",
          }));
          setLabTests(cleaned);
        } else {
          setError("Failed to load lab tests");
        }
      } catch (err) {
        console.error("Error fetching lab tests:", err);
        setError("Error fetching lab tests");
      } finally {
        setLoading(false);
      }
    }
    fetchLabTests();
  }, [hospitalId]);

  return (
    <div className="fixed inset-0 bg-black/60 z-50 overflow-y-auto">
      <div className="min-h-screen py-6 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div
            className={`bg-gradient-to-r ${theme.headerGradient} rounded-t-xl shadow-lg p-6 flex justify-between items-center`}
          >
            <div className="flex items-center gap-3">
              <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full">
                <ArrowLeft className="w-6 h-6 text-white" />
              </button>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <TestTube className="w-6 h-6" />
                Pathology Lab Tests
              </h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full">
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="bg-gray-50 rounded-b-xl shadow-lg p-6">
            {/* Loading */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-[#1E3B90] animate-spin mb-3" />
                <p className="text-gray-600 text-lg">Loading lab tests...</p>
              </div>
            )}

            {/* Error */}
            {error && !loading && (
              <div className="flex flex-col items-center justify-center py-20">
                <AlertCircle className="w-10 h-10 text-[#1E3B90] mb-3" />
                <p className="text-[#1E3B90] text-lg">{error}</p>
              </div>
            )}

            {/* Empty */}
            {!loading && !error && labTests.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20">
                <TestTube className="w-12 h-12 text-gray-400 mb-3" />
                <p className="text-gray-600">No lab tests available.</p>
              </div>
            )}

            {/* Cards Grid */}
            {!loading && !error && labTests.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {labTests.map((test) => (
                  <Card
                    key={test.id}
                    onClick={() => setSelectedTest(test)}
                    className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                  >
                    {/* Accent Bar */}
                    <div
                      className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${theme.headerGradient}`}
                    />

                    {/* Header */}
                    <div className="p-5 flex items-center gap-4">
                      <div className="bg-gradient-to-br from-[#1E3B90]/10 to-[#3D85EF]/10 p-3 rounded-xl">
                        <TestTube className="w-6 h-6 text-[#1E3B90]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-lg truncate">
                          {test.testname}
                        </h3>
                        {test.nabl && (
                          <div className="flex items-center gap-1 mt-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
                            <p className="text-xs font-medium text-green-600">NABL Certified</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Body */}
                    <CardContent className="px-5 pb-5 pt-0">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-sm text-gray-500">Final Price</p>
                          <div className="flex items-end gap-1">
                            <IndianRupee className="w-4 h-4 text-[#1E3B90]" />
                            <p className="text-2xl font-bold text-[#1E3B90] leading-none">
                              {test.finalprice}
                            </p>
                            <span className="text-sm text-gray-400 line-through ml-1">
                              ₹{test.price}
                            </span>
                          </div>
                        </div>

                        {/* ✅ Fixed % duplication here */}
                        <Badge className="bg-[#EEF3FF] text-[#1E3B90] font-semibold text-xs px-3 py-1 shadow-sm flex items-center gap-1">
                          <Percent className="w-3 h-3" />
                          {test.discount} Off
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <Badge
                          className={`text-xs px-3 py-1 rounded-full font-medium ${
                            test.available
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {test.available ? "Available" : "Unavailable"}
                        </Badge>

                        <div className="flex items-center gap-1 text-yellow-500">
                          <Star className="w-4 h-4" />
                          <span className="text-sm font-semibold">4.2</span>
                        </div>
                      </div>
                    </CardContent>

                    {/* Hover Accent */}
                    <div
                      className="absolute inset-0 bg-gradient-to-br from-[#1E3B90]/5 to-[#3D85EF]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedTest && (
        <div
          className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4"
          onClick={() => setSelectedTest(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className={`bg-gradient-to-r ${theme.headerGradient} p-5 rounded-t-2xl flex justify-between items-center text-white`}
            >
              <h3 className="text-lg font-bold flex items-center gap-2">
                <TestTube className="w-5 h-5" /> {selectedTest.testname}
              </h3>
              <button onClick={() => setSelectedTest(null)}>
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm text-gray-500">Discounted Price</p>
                  <div className="flex items-end gap-1">
                    <IndianRupee className="w-4 h-4 text-[#1E3B90]" />
                    <p className="text-3xl font-bold text-[#1E3B90] leading-none">
                      {selectedTest.finalprice}
                    </p>
                    <span className="text-sm text-gray-400 line-through ml-2">
                      ₹{selectedTest.price}
                    </span>
                  </div>
                </div>

                {/* ✅ Fixed % duplication in modal */}
                <Badge className="bg-[#EEF3FF] text-[#1E3B90] font-semibold text-xs px-3 py-1 shadow-sm flex items-center gap-1">
                  <Percent className="w-3 h-3" />
                  {selectedTest.discount} Off
                </Badge>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                  <Clock className="w-4 h-4 text-[#1E3B90]" />
                  <span className="text-sm font-medium text-gray-700">24/7 Service</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                  <Award className="w-4 h-4 text-[#1E3B90]" />
                  <span className="text-sm font-medium text-gray-700">Quality Assured</span>
                </div>
                {selectedTest.nabl && (
                  <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                    <ShieldCheck className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700">NABL Certified</span>
                  </div>
                )}
                <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-[#1E3B90]" />
                  <span className="text-sm font-medium text-gray-700">Home Collection</span>
                </div>
              </div>

              {/* Action */}
              <div
                className={`bg-gradient-to-r ${theme.buttonGradient} text-white p-4 rounded-lg mt-6 flex items-center justify-center gap-2 cursor-pointer hover:opacity-90 transition`}
              >
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">
                  Book or Enquire for {selectedTest.testname}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabTestList;
