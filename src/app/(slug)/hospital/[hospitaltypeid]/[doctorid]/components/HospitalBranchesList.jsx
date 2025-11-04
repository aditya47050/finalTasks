"use client";
import React, { useState, useEffect } from "react";
import {
  Building2,
  Search,
  X,
  Loader2,
  MapPin,
  Phone,
  Mail,
  Clock,
  Navigation,
  CheckCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const HospitalBranchesList = ({ hospitalId, onClose }) => {
  const [branches, setBranches] = useState([]);
  const [filteredBranches, setFilteredBranches] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBranches();
  }, [hospitalId]);

  useEffect(() => {
    filterBranches();
  }, [searchTerm, branches]);

  const fetchBranches = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/hospital/${hospitalId}/branches`);
      if (!response.ok) throw new Error("Failed to fetch branches");
      const data = await response.json();
      setBranches(data.branches || []);
      setFilteredBranches(data.branches || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterBranches = () => {
    let filtered = branches;

    if (searchTerm) {
      filtered = filtered.filter((branch) => {
        const bname = branch.branchname?.toLowerCase() || "";
        const address = branch.address?.toLowerCase() || "";
        const city = branch.city?.toLowerCase() || "";
        const state = branch.state?.toLowerCase() || "";
        return (
          bname.includes(searchTerm.toLowerCase()) ||
          address.includes(searchTerm.toLowerCase()) ||
          city.includes(searchTerm.toLowerCase()) ||
          state.includes(searchTerm.toLowerCase())
        );
      });
    }

    setFilteredBranches(filtered);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center pl-20">
      <div className="w-full h-full overflow-y-auto">
        <Card className="w-full max-w-[95vw] mx-auto min-h-screen bg-white border-0 lg:rounded-none shadow-none">
          {/* Header */}
          <CardHeader className="border-b bg-gradient-to-r from-[#1E3B90] to-[#3D85EF] text-white sticky top-0 z-10 shadow-md">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl lg:text-3xl font-bold">
                    Our Hospital Branches
                  </CardTitle>
                  <p className="text-sm text-blue-100 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>
                      {filteredBranches.length} branch
                      {filteredBranches.length !== 1 ? "es" : ""} available
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
          <CardContent className="p-6 lg:px-8 lg:py-8 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-7xl mx-auto">
              {/* Search */}
              <div className="mb-8">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search branch by name, city, or address..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 pr-4 h-12 text-base border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-2xl bg-white shadow-sm transition-all"
                  />
                </div>
              </div>

              {/* Branch Cards */}
              {loading ? (
                <div className="text-center py-16">
                  <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800">
                    Loading Branches...
                  </h3>
                </div>
              ) : error ? (
                <div className="text-center py-16">
                  <p className="text-red-600 mb-4">{error}</p>
                  <Button onClick={fetchBranches}>Try Again</Button>
                </div>
              ) : filteredBranches.length === 0 ? (
                <div className="text-center py-16">
                  <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-700">
                    No Branches Found
                  </h3>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBranches.map((branch) => (
                    <Card
                      key={branch.id}
                      className="h-full flex flex-col overflow-hidden border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 bg-white rounded-2xl hover:translate-y-[-4px]"
                    >
                      <CardContent className="p-0 flex flex-col flex-grow">
                        {/* Header */}
                        <div className="bg-gradient-to-br from-[#1E3B90]/10 to-[#3D85EF]/10 p-6 rounded-t-2xl">
                          <div className="flex items-center gap-4">
                            <div className="w-20 h-20 bg-gradient-to-br from-[#1E3B90]/20 to-[#3D85EF]/30 border-4 border-white rounded-full flex items-center justify-center shadow-lg">
                              <Building2 className="w-8 h-8 text-[#1E3B90]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-xl font-bold text-gray-800 mb-1 truncate">
                                {branch.branchname || "Hospital Branch"}
                              </h3>
                              <p className="text-[#1E3B90] text-base font-semibold mb-2">
                                {branch.city || "Location not available"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-3 flex-grow">
                          {/* Address */}
                          <div className="flex items-start gap-2 text-gray-700">
                            <MapPin className="h-4 w-4 text-[#1E3B90] mt-0.5" />
                            <span className="text-sm line-clamp-2">
                              {branch.address
                                ? `${branch.address}, ${branch.city || ""}, ${
                                    branch.state || ""
                                  }`
                                : "Not Available"}
                            </span>
                          </div>

                          {/* Phone */}
                          <div className="flex items-center gap-2 text-gray-700">
                            <Phone className="h-4 w-4 text-[#1E3B90]" />
                            <span className="text-sm">
                              {branch.contact || "Not Available"}
                            </span>
                          </div>

                          {/* Email */}
                          <div className="flex items-center gap-2 text-gray-700">
                            <Mail className="h-4 w-4 text-[#1E3B90]" />
                            <span className="text-sm truncate">
                              {branch.email || "Not Available"}
                            </span>
                          </div>

                          {/* Timings */}
                          <div className="flex items-center gap-2 text-gray-700">
                            <Clock className="h-4 w-4 text-[#1E3B90]" />
                            <span className="text-sm">
                              {branch.timings || "Timings not provided"}
                            </span>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 pb-6 pt-2">
                          <div className="flex gap-3">
                            <button
                              className="flex-1 bg-gradient-to-r from-[#1E3B90] to-[#1E3B90] text-white font-medium py-2.5 px-3 rounded-xl shadow-md hover:scale-105 transition-all flex items-center justify-center gap-2 text-sm"
                              onClick={() =>
                                branch.contact &&
                                window.open(`tel:${branch.contact}`, "_self")
                              }
                            >
                              <Phone className="h-3 w-3" />
                              Call Now
                            </button>
                            <button
                              className="flex-1 bg-gradient-to-r from-[#3D85EF] to-[#3D85EF] text-white font-medium py-2.5 px-3 rounded-xl shadow-sm hover:scale-105 transition-all flex items-center justify-center gap-2 text-sm"
                              onClick={() => {
                                const address = `${branch.address}, ${branch.city}, ${branch.state}`;
                                window.open(
                                  `https://maps.google.com/?q=${encodeURIComponent(
                                    address
                                  )}`,
                                  "_blank"
                                );
                              }}
                            >
                              <Navigation className="h-3 w-3" />
                              Directions
                            </button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
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

export default HospitalBranchesList;
