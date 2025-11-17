"use client";
import React, { useState, useEffect } from "react";
import {
  Microscope,
  Activity,
  HeartPulse,
  ScanLine,
  Syringe,
  Loader2,
  AlertTriangle,
  X,
  CheckCircle,
  FlaskConical,
  BadgeDollarSign,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function HospitalDiagnosticList({
  hospitalId,
  diagnosticCenterId,
  onClose,
}) {
  const router = useRouter();

  // ⭐ NEW — center data store here
  const [center, setCenter] = useState(null);

  const [diagnostics, setDiagnostics] = useState([]);
  const [filteredDiagnostics, setFilteredDiagnostics] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    if (!hospitalId || !diagnosticCenterId) return;

    const fetchDiagnostics = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `/api/hospital/${hospitalId}/inhouse-diagnostic/${diagnosticCenterId}`
        );

        const data = await res.json();

        if (!data.success) {
          setError("Failed to fetch diagnostics.");
          return;
        }

        const list = Array.isArray(data.services) ? data.services : [];

        setDiagnostics(list);
        setFilteredDiagnostics(list);

        // ⭐ Save center from API
        setCenter(data.center);

      } catch (err) {
        console.error("🔥 FETCH ERROR:", err);
        setError("Error loading diagnostic data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDiagnostics();
  }, [hospitalId, diagnosticCenterId]);

  /* --------------- FILTERING ---------------- */
  const categories = ["all", ...new Set(diagnostics.map((d) => d.facility))];

  const handleFilter = (cat) => {
    setSelectedCategory(cat);
    if (cat === "all") setFilteredDiagnostics(diagnostics);
    else setFilteredDiagnostics(diagnostics.filter((d) => d.facility === cat));
  };

  /* --------------- ICONS ---------------- */
  const getIcon = (facility) => {
    switch (facility) {
      case "Radiology":
      case "CT Scan":
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

  /* --------------- GO TO BOOK TEST --------------- */
  const goToDiagnostic = (serviceId) => {
    if (!center) {
      console.error("❌ Center not loaded yet");
      return;
    }

    const categoryId =
      center?.hspInfo?.hspcategory?.[0]?.diagnosticcategory?.id;

    if (!categoryId) {
      console.error("❌ Diagnostic Category ID missing");
      return;
    }

    // ⭐ FINAL CORRECT ROUTE
    router.push(
      `/diagnosticcenter/${categoryId}/${diagnosticCenterId}?serviceId=${serviceId}`
    );
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
      <div className="w-full h-full overflow-y-auto">
        <Card className="w-full max-w-[95vw] lg:max-w-none lg:border-0 lg:shadow-none min-h-screen bg-white">

          {/* HEADER */}
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
                    {filteredDiagnostics.length} service
                    {filteredDiagnostics.length !== 1 ? "s" : ""}
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

          {/* FILTERS */}
          <div className="p-6 bg-gradient-to-br from-blue-50 via-white to-indigo-50 border-b shadow-sm">
            <div className="max-w-5xl mx-auto flex flex-wrap gap-2 justify-center">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  onClick={() => handleFilter(cat)}
                  className={`rounded-full font-semibold px-5 py-2 transition-all hover:scale-105 ${
                    selectedCategory === cat
                      ? "bg-gradient-to-r from-[#1E3B90] to-[#3D85EF] text-white shadow-lg"
                      : "bg-white border border-blue-200 text-[#1E3B90] hover:bg-blue-50"
                  }`}
                >
                  {cat === "all" ? "✨ All Tests" : cat}
                </Button>
              ))}
            </div>
          </div>

          {/* CONTENT */}
          <CardContent className="p-6 lg:px-10 bg-gradient-to-b from-gray-50 to-white">

            {loading ? (
              <div className="text-center py-16">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800">
                  Loading Diagnostic Services
                </h3>
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <p className="text-gray-700">{error}</p>
              </div>
            ) : filteredDiagnostics.length === 0 ? (
              <div className="text-center py-16">
                <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg text-gray-700">
                  No Diagnostic Services Found
                </h3>
              </div>
            ) : (
              <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {filteredDiagnostics.map((test) => (
                  <Card
                    key={test.id}
                    className="flex flex-col h-full border shadow-md bg-white rounded-2xl hover:-translate-y-1 transition-all"
                  >
                    <CardContent className="p-0 flex flex-col h-full">

                      {/* HEADER */}
                      <div className="bg-gradient-to-br from-[#1E3B90]/10 to-[#3D85EF]/10 p-5 rounded-t-2xl flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center shadow-sm">
                          {getIcon(test.facility)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-gray-800 leading-tight truncate">
                            {test.subCategory || test.facility}
                          </h3>

                          <p className="text-[#1E3B90] text-sm font-semibold leading-tight">
                            {test.facility}
                          </p>

                          <span className="text-xs font-semibold px-3 py-1 rounded-full border border-blue-300 bg-blue-50 text-blue-700 mt-1 inline-block w-fit">
                            {test.category}
                          </span>
                        </div>
                      </div>

                      {/* BODY */}
                      <div className="p-5 space-y-3 flex-grow text-sm text-gray-700">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <BadgeDollarSign className="h-4 w-4 text-[#1E3B90]" />
                            <span className="font-semibold text-lg text-gray-900">
                              ₹{test.finalPrice || test.minPrice || "N/A"}
                            </span>
                          </div>

                          {(test.minPrice || test.maxPrice) && (
                            <span className="text-xs text-gray-600 ml-6">
                              ₹{test.minPrice || "N/A"} – ₹{test.maxPrice || "N/A"}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* FOOTER */}
                      <div className="mt-auto px-5 pb-5">
                        <button
                          onClick={() => goToDiagnostic(test.id)}
                          className="w-full bg-gradient-to-r from-[#1E3B90] to-[#3D85EF] text-white font-medium py-2.5 rounded-xl shadow-md hover:scale-[1.03] transition flex items-center justify-center gap-2"
                        >
                          <BadgeDollarSign className="h-4 w-4" />
                          Book Test
                        </button>
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
