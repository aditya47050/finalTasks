"use client";
import React, { useState, useEffect } from "react";
import {
  Microscope,
  Activity,
  HeartPulse,
  ScanLine,
  Syringe,
  Building2,
  Loader2,
  AlertTriangle,
  X,
  CheckCircle,
  FlaskConical,
  BadgeDollarSign,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function HospitalDiagnosticList({ hospitalService, onClose }) {
  const [diagnostics, setDiagnostics] = useState([]);
  const [filteredDiagnostics, setFilteredDiagnostics] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const hospitalId = hospitalService?.id || hospitalService?._id;
    if (!hospitalId) return;

    const fetchDiagnostics = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/hospital/${hospitalId}/diagnostic`);
        const data = await res.json();
        if (data.success) {
          setDiagnostics(data.diagnostics || []);
          setFilteredDiagnostics(data.diagnostics || []);
        } else {
          setError("Failed to fetch diagnostics.");
        }
      } catch (err) {
        console.error("🔥 Error fetching diagnostics:", err);
        setError("Error loading diagnostic data.");
      } finally {
        setLoading(false);
      }
    };
    fetchDiagnostics();
  }, [hospitalService?.id, hospitalService?._id]);

  const categories = ["all", ...new Set(diagnostics.map((d) => d.facility))];

  const handleFilter = (cat) => {
    setSelectedCategory(cat);
    if (cat === "all") setFilteredDiagnostics(diagnostics);
    else setFilteredDiagnostics(diagnostics.filter((d) => d.facility === cat));
  };

  const getIcon = (facility) => {
    switch (facility) {
      case "Radiology":
        return <ScanLine className="text-[#1E3B90]" />;
      case "Pathology":
        return <Microscope className="text-[#1E3B90]" />;
      case "Cardiology":
        return <HeartPulse className="text-[#1E3B90]" />;
      case "Endocrinology":
        return <Syringe className="text-[#1E3B90]" />;
      case "Biochemistry":
        return <Activity className="text-[#1E3B90]" />;
      default:
        return <FlaskConical className="text-[#1E3B90]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
      <div className="w-full h-full overflow-y-auto">
        <Card className="w-full max-w-[95vw] lg:max-w-none lg:border-0 lg:shadow-none min-h-screen bg-white">
          {/* Header */}
          <CardHeader className="sticky top-0 z-10 bg-gradient-to-r from-[#1E3B90] to-[#3D85EF] text-white shadow-md border-b">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <Microscope className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl lg:text-3xl font-bold">
                    Diagnostic Services
                  </CardTitle>
                  <p className="text-sm text-blue-100 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>
                      {filteredDiagnostics.length} service
                      {filteredDiagnostics.length !== 1 ? "s" : ""} available
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

          {/* Filter Section */}
          <div className="p-6 bg-gradient-to-br from-blue-50 via-white to-indigo-50 border-b shadow-sm">
            <div className="max-w-5xl mx-auto flex flex-wrap gap-2 justify-center">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  onClick={() => handleFilter(cat)}
                  className={`rounded-full font-semibold px-5 py-2 transition-all hover:scale-105 ${
                    selectedCategory === cat
                      ? "bg-gradient-to-r from-[#1E3B90] to-[#3D85EF] text-white border-0 shadow-lg"
                      : "bg-white border border-blue-200 text-[#1E3B90] hover:bg-blue-50"
                  }`}
                >
                  {cat === "all" ? "✨ All Tests" : cat}
                </Button>
              ))}
            </div>
          </div>

          {/* Content */}
          <CardContent className="p-6 lg:px-10 bg-gradient-to-b from-gray-50 to-white">
            {loading ? (
              <div className="text-center py-16">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Loading Diagnostic Services
                </h3>
                <p className="text-gray-600">Please wait...</p>
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <p className="text-gray-700 font-medium">{error}</p>
              </div>
            ) : filteredDiagnostics.length === 0 ? (
              <div className="text-center py-16">
                <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700">
                  No Diagnostic Services Found
                </h3>
              </div>
            ) : (
              <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDiagnostics.map((test) => (
                  <Card
                    key={test.id}
                    className="h-full flex flex-col overflow-hidden border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 bg-white rounded-2xl hover:translate-y-[-4px]"
                  >
                    <CardContent className="p-0 flex flex-col flex-grow">
                      {/* Card Header (matches doctor style) */}
                      <div className="bg-gradient-to-br from-[#1E3B90]/10 to-[#3D85EF]/10 p-6 rounded-t-2xl">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center shadow-md">
                            {getIcon(test.facility)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-gray-800 mb-1 truncate">
                              {test.serviceName}
                            </h3>
                            <p className="text-[#1E3B90] text-sm font-semibold mb-1">
                              {test.facility || "General"}
                            </p>
                            <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full border border-blue-300 bg-blue-50 text-blue-700">
                              {test.category || "Lab Test"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-6 space-y-3 flex-grow text-sm text-gray-700">
                        <p className="line-clamp-2">
                          {test.description ||
                            "Comprehensive diagnostic test for accurate results."}
                        </p>
                        <div className="flex items-center gap-2">
                          <BadgeDollarSign className="h-4 w-4 text-[#1E3B90]" />
                          <span>
                            ₹{test.finalPrice || test.price || "N/A"}{" "}
                            {test.discount && (
                              <span className="text-green-600 text-xs ml-2">
                                ({test.discount}% off)
                              </span>
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-[#1E3B90]" />
                          <span className="text-xs text-gray-600">
                            Hospital ID: {test.hospitalId.slice(-6)}
                          </span>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="px-6 pb-6 pt-2">
                        <div className="flex gap-3">
                          <button className="flex-1 bg-gradient-to-r from-[#1E3B90] to-[#3D85EF] text-white font-medium py-2.5 px-3 rounded-xl shadow-md hover:scale-105 transition-all flex items-center justify-center gap-2 text-sm">
                            <BadgeDollarSign className="h-4 w-4" />
                            Book Test
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
