"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Beaker,
  X,
  TestTube,
  Droplets,
  BadgePercent,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function HospitalNablPathologyList({ hospitalId, onClose }) {
  const [data, setData] = useState({ labTests: [], bloodBank: [] });
  const [loading, setLoading] = useState(true);

  // FILTERS
  const [typeFilter, setTypeFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");

  const unified = {
    headerGradient: "from-[#1E3B90] to-[#3D85EF]",
    borderColor: "border-[#E1E8FF]",
  };

  useEffect(() => {
    if (!hospitalId) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/hospital/${hospitalId}/pathology`);
        const result = await res.json();

        if (result.success) {
          setData({
            labTests: result.labTests || [],
            bloodBank: result.bloodBank || [],
          });
        }
      } catch (err) {
        console.error("Error fetching pathology data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [hospitalId]);

  // PRICE FILTER LOGIC
  const filterByPrice = (list) => {
    return list.filter((item) => {
      const price = item.finalprice / 100;

      if (priceFilter === "low") return price <= 500;
      if (priceFilter === "medium") return price > 500 && price <= 2000;
      if (priceFilter === "high") return price > 2000;
      return true;
    });
  };

  const filteredLabTests = useMemo(
    () => filterByPrice(data.labTests),
    [data, priceFilter]
  );

  const filteredBloodBank = useMemo(
    () => filterByPrice(data.bloodBank),
    [data, priceFilter]
  );

  const formatPrice = (p) => `₹${(p / 100).toFixed(2)}`;

  // STYLES
  const cardStyle =
    "h-full min-h-[260px] flex flex-col overflow-hidden border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 bg-white rounded-2xl hover:translate-y-[-4px]";

  const headerBubble =
    "w-14 h-14 rounded-full bg-gradient-to-br from-[#1E3B90] to-[#3D85EF] flex items-center justify-center border-4 border-white shadow-lg";

  const navigateTo = (hid, sid) => {
    window.location.href = `/pathology/hospital/${hid}/service/${sid}`;
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent
        className="max-w-5xl max-h-[85vh] overflow-y-auto p-0 rounded-2xl shadow-2xl border-none"
        hideCloseButton
      >
        {/* HEADER */}
        <DialogHeader
          className={`sticky top-0 bg-gradient-to-r ${unified.headerGradient} text-white p-6 rounded-t-2xl`}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/25 rounded-xl">
                <Beaker className="w-6 h-6" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-white">
                  NABL Pathology Services
                </DialogTitle>
                <p className="text-white/90 text-sm mt-1">
                  Certified Lab Tests & Blood Bank Services
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 transition-all p-2 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </DialogHeader>

        {/* BODY */}
        <div className="p-6 sm:p-8 bg-white space-y-10">

          {/* FILTER ROW */}
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              { key: "all", label: "✨ All" },
              { key: "lab", label: "🧪 Lab Tests" },
              { key: "blood", label: "🩸 Blood Bank" },
            ].map((btn) => (
              <button
                key={btn.key}
                onClick={() => setTypeFilter(btn.key)}
                className={`
                  px-4 py-2 rounded-full font-medium border transition-all
                  ${
                    typeFilter === btn.key
                      ? "bg-gradient-to-r from-[#1E3B90] to-[#3D85EF] text-white border-transparent shadow-md"
                      : "bg-white text-[#1E3B90] border-blue-200 hover:bg-blue-50"
                  }
                `}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* PRICE FILTER */}
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              Filter by Price
            </h3>
            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger className="w-60 border-[#E1E8FF]">
                <SelectValue placeholder="Select filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="low">Under ₹500</SelectItem>
                <SelectItem value="medium">₹500 - ₹2000</SelectItem>
                <SelectItem value="high">Above ₹2000</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* LAB TESTS */}
          {(typeFilter === "all" || typeFilter === "lab") && (
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-900 mb-4">
                <TestTube className="w-6 h-6 text-blue-600" />
                NABL Lab Tests
              </h2>

              {loading ? (
                <p className="text-gray-500">Loading lab tests...</p>
              ) : filteredLabTests.length === 0 ? (
                <div className="text-center py-10 text-gray-600">
                  <AlertTriangle className="w-10 h-10 mx-auto mb-2" />
                  No NABL lab tests found
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredLabTests.map((t) => (
                    <Card key={t.id} className={cardStyle}>
                      <CardContent className="p-0 flex flex-col flex-grow">

                        {/* HEADER */}
                        <div className="bg-gradient-to-br from-[#1E3B90]/10 to-[#3D85EF]/10 p-5 rounded-t-2xl flex items-center gap-4">
                          <div className={headerBubble}>
                            <TestTube className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-800 truncate">
                              {t.testname}
                            </h3>
                            <span
                              className={`text-xs font-bold px-2 py-1 rounded-full mt-1 inline-block ${
                                t.nabl
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {t.nabl ? "NABL Certified" : "Not NABL Certified"}
                            </span>
                          </div>
                        </div>

                        {/* BODY */}
                        <div className="p-5 space-y-2 flex-grow text-sm text-gray-700">
                          <p>
                            <strong>Final Price:</strong>{" "}
                            {formatPrice(t.finalprice)}
                          </p>

                          {t.discount && (
                            <p className="flex items-center gap-1">
                              <BadgePercent className="w-4 h-4 text-green-700" />
                              <strong>Discount:</strong> {t.discount}
                            </p>
                          )}

                          <p
                            className={`font-semibold ${
                              t.available ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {t.available ? "Available" : "Unavailable"}
                          </p>
                        </div>

                        {/* FOOTER BUTTONS */}
                        <div className="px-5 pb-5 pt-2">
                          <div className="flex gap-3">
                            
                            <button
                              onClick={() => navigateTo(t.hospitalId, t.id)}
                              className="flex-1 bg-gradient-to-r from-[#1E3B90] to-[#1E3B90] text-white font-medium py-2.5 px-3 rounded-xl shadow-md hover:scale-105 transition-all"
                            >
                              Book Now
                            </button>

                            <button
                              onClick={() => navigateTo(t.hospitalId, t.id)}
                              className="flex-1 bg-gradient-to-r from-[#3D85EF] to-[#3D85EF] text-white font-medium py-2.5 px-3 rounded-xl shadow-sm hover:scale-105 transition-all"
                            >
                              View Details
                            </button>

                          </div>
                        </div>

                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* BLOOD BANK */}
          {(typeFilter === "all" || typeFilter === "blood") && (
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-900 mb-4">
                <Droplets className="w-6 h-6 text-red-600" />
                Blood Bank Services
              </h2>

              {loading ? (
                <p className="text-gray-500">Loading blood bank...</p>
              ) : filteredBloodBank.length === 0 ? (
                <div className="text-center py-10 text-gray-600">
                  <AlertTriangle className="w-10 h-10 mx-auto mb-2" />
                  No blood bank data found
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBloodBank.map((b) => (
                    <Card key={b.id} className={cardStyle}>
                      <CardContent className="p-0 flex flex-col flex-grow">

                        {/* HEADER */}
                        <div className="bg-gradient-to-br from-red-100 to-red-200 p-5 rounded-t-2xl flex items-center gap-4">
                          <div
                            className={headerBubble
                              .replace("from-[#1E3B90]", "from-red-600")
                              .replace("to-[#3D85EF]", "to-red-500")}
                          >
                            <Droplets className="w-6 h-6 text-white" />
                          </div>

                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-800 truncate">
                              {b.bloodname}
                            </h3>
                            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full inline-block mt-1">
                              Blood Group
                            </span>
                          </div>
                        </div>

                        {/* BODY */}
                        <div className="p-5 space-y-2 flex-grow text-sm text-gray-700">
                          <p>
                            <strong>Final Price:</strong>{" "}
                            {formatPrice(b.finalprice)}
                          </p>

                          {b.discount && (
                            <p className="flex items-center gap-1">
                              <BadgePercent className="w-4 h-4 text-green-700" />
                              <strong>Discount:</strong> {b.discount}
                            </p>
                          )}

                          <p
                            className={`font-semibold ${
                              b.available ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {b.available ? "Available" : "Unavailable"}
                          </p>
                        </div>

                        {/* FOOTER BUTTONS */}
                        <div className="px-5 pb-5 pt-2">
                          <div className="flex gap-3">
                            
                            <button
                              onClick={() => navigateTo(b.hospitalId, b.id)}
                              className="flex-1 bg-gradient-to-r from-red-600 to-red-600 text-white font-medium py-2.5 px-3 rounded-xl shadow-md hover:scale-105 transition-all"
                            >
                              Book Now
                            </button>

                            <button
                              onClick={() => navigateTo(b.hospitalId, b.id)}
                              className="flex-1 bg-gradient-to-r from-[#3D85EF] to-[#3D85EF] text-white font-medium py-2.5 px-3 rounded-xl shadow-sm hover:scale-105 transition-all"
                            >
                              View Details
                            </button>

                          </div>
                        </div>

                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </DialogContent>
    </Dialog>
  );
}
