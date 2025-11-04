"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  X,
  Loader2,
  Ambulance,
  CheckCircle,
  ShieldCheck,
  Activity,
} from "lucide-react";

const HospitalAmbulanceList = ({ hospitalId, onClose }) => {
  const [ambulances, setAmbulances] = useState([]);
  const [filteredAmbulances, setFilteredAmbulances] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHospitalAmbulances();
  }, [hospitalId]);

  useEffect(() => {
    filterAmbulances();
  }, [searchTerm, ambulances]);

  const fetchHospitalAmbulances = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/hospital/${hospitalId}/ambulances`);
      if (!response.ok) throw new Error("Failed to fetch ambulances");

      const data = await response.json();
      setAmbulances(data.ambulances || []);
      setFilteredAmbulances(data.ambulances || []);
    } catch (err) {
      console.error("❌ Error fetching ambulances:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterAmbulances = () => {
    let filtered = ambulances;

    if (searchTerm) {
      filtered = filtered.filter((amb) => {
        const model = amb.model?.toLowerCase() || "";
        const type = amb.type?.toLowerCase() || "";
        const number = amb.number?.toLowerCase() || "";
        return (
          model.includes(searchTerm.toLowerCase()) ||
          type.includes(searchTerm.toLowerCase()) ||
          number.includes(searchTerm.toLowerCase())
        );
      });
    }

    setFilteredAmbulances(filtered);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm lg:bg-white lg:backdrop-blur-0 lg:p-0 p-4 flex items-center lg:block justify-center">
      <Card className="w-full max-w-[95vw] lg:max-w-none lg:rounded-none lg:border-0 lg:shadow-none max-h-[95vh] lg:max-h-none overflow-hidden my-auto lg:my-0 shadow-2xl">
        <CardHeader className="border-b bg-blue-600 text-white sticky top-0 z-10 shadow-md">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                <Ambulance className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl lg:text-3xl font-bold">
                  Hospital Ambulances
                </CardTitle>
                <p className="text-sm text-blue-100 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>
                    {filteredAmbulances.length} ambulanc
                    {filteredAmbulances.length !== 1 ? "es" : "e"} available
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

        <CardContent className="p-6 lg:px-8 lg:py-8 overflow-y-auto lg:overflow-visible max-h-[calc(95vh-100px)] lg:max-h-none bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto">
            {/* Search Section */}
            <div className="mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search by model, type, or number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 h-12 text-base border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-2xl bg-white shadow-sm transition-all"
                />
              </div>
            </div>

            {/* Ambulance Grid */}
            {loading ? (
              <div className="text-center py-16">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Loading Ambulances
                </h3>
                <p className="text-gray-600">Please wait...</p>
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                  <X className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Error Loading Ambulances
                </h3>
                <p className="text-red-600 mb-6">{error}</p>
                <Button
                  onClick={fetchHospitalAmbulances}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Try Again
                </Button>
              </div>
            ) : filteredAmbulances.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <Ambulance className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">
                  {searchTerm
                    ? "No Ambulances Found"
                    : "No Ambulances Registered"}
                </h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm
                    ? "Try adjusting your search criteria"
                    : "This hospital has not registered any ambulances yet"}
                </p>
                {searchTerm && (
                  <Button
                    onClick={() => setSearchTerm("")}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Clear Search
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 justify-center">
                {filteredAmbulances.map((amb) => (
                  <div
                    key={amb.id}
                    className="flex flex-col text-center items-center justify-center mb-4 bg-gray-50 rounded-2xl border hover:shadow-md transition-all hover:scale-[1.03] cursor-pointer p-4"
                  >
                    <div className="h-20 w-20 rounded-2xl bg-blue-100 flex items-center justify-center mb-3">
                      <Ambulance className="w-8 h-8 text-blue-600" />
                    </div>
                    <p className="text-[#5271FF] font-bold text-[14px] mb-1">
                      {amb.model}
                    </p>
                    <p className="text-[12px] text-gray-600 font-medium">
                      {amb.type}
                    </p>
                    <p className="text-[12px] text-gray-500">{amb.number}</p>
                    <div className="flex items-center justify-center gap-2 mt-2 text-xs">
                      <ShieldCheck
                        className={`w-4 h-4 ${
                          amb.status === "APPROVED"
                            ? "text-green-600"
                            : amb.status === "REJECTED"
                            ? "text-red-600"
                            : "text-yellow-500"
                        }`}
                      />
                      <span
                        className={`font-semibold ${
                          amb.status === "APPROVED"
                            ? "text-green-600"
                            : amb.status === "REJECTED"
                            ? "text-red-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {amb.status}
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
  );
};

export default HospitalAmbulanceList;
