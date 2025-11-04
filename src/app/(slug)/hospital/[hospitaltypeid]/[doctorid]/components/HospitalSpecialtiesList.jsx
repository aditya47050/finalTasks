"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Icons from "@/lib/icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Search,
  X,
  Loader2,
  CheckCircle,
} from "lucide-react";

const HospitalSpecialtiesList = ({ hospitalId, onClose }) => {
  const [specialties, setSpecialties] = useState([]);
  const [filteredSpecialties, setFilteredSpecialties] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHospitalSpecialties();
  }, [hospitalId]);

  useEffect(() => {
    filterSpecialties();
  }, [searchTerm, specialties]);

  const fetchHospitalSpecialties = async () => {
    try {
      setLoading(true);
      console.log(`🔍 Fetching specialties for hospital: ${hospitalId}`);
      const response = await fetch(`/api/hospital/${hospitalId}/specialties`);
      if (!response.ok) {
        throw new Error("Failed to fetch specialties");
      }
      const data = await response.json();
      console.log(
        `✅ Received ${data.specialties?.length || 0} specialties for this hospital`
      );
      setSpecialties(data.specialties || []);
      setFilteredSpecialties(data.specialties || []);
    } catch (err) {
      console.error("❌ Error fetching specialties:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterSpecialties = () => {
    let filtered = specialties;
    if (searchTerm) {
      filtered = filtered.filter((spec) => {
        const title = spec.speciality?.title?.toLowerCase() || "";
        const description = spec.speciality?.description?.toLowerCase() || "";
        return (
          title.includes(searchTerm.toLowerCase()) ||
          description.includes(searchTerm.toLowerCase())
        );
      });
    }
    setFilteredSpecialties(filtered);
  };

  const iconsArray = Object.values(Icons);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm lg:bg-white lg:backdrop-blur-0 lg:p-0 p-4 flex items-center lg:block justify-center">
      <Card className="w-full max-w-[95vw] lg:max-w-none lg:rounded-none lg:border-0 lg:shadow-none max-h-[95vh] lg:max-h-none overflow-hidden my-auto lg:my-0 shadow-2xl">
        <CardHeader className="border-b bg-blue-600 text-white sticky top-0 z-10 shadow-md">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl lg:text-3xl font-bold">
                  Our Medical Specialties
                </CardTitle>
                <p className="text-sm text-blue-100 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>
                    {filteredSpecialties.length} specialt
                    {filteredSpecialties.length !== 1 ? "ies" : "y"} available
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
            {/* 🔍 Search Section */}
            <div className="mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search by specialty name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 h-12 text-base border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-2xl bg-white shadow-sm transition-all"
                />
              </div>
            </div>

            {/* 🏥 Specialties Grid */}
            {loading ? (
              <div className="text-center py-16">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Loading Specialties
                </h3>
                <p className="text-gray-600">Please wait...</p>
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                  <X className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Error Loading Specialties
                </h3>
                <p className="text-red-600 mb-6">{error}</p>
                <Button
                  onClick={fetchHospitalSpecialties}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Try Again
                </Button>
              </div>
            ) : filteredSpecialties.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">
                  {searchTerm
                    ? "No Specialties Found"
                    : "No Specialties Registered"}
                </h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm
                    ? "Try adjusting your search criteria"
                    : "This hospital has not registered any specialties yet"}
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
                {filteredSpecialties.map((spec, index) => {
                  const icon = iconsArray[index % iconsArray.length]; // cycle icons
                  return (
                    <div
                      key={spec.id || index}
                      className="flex flex-col text-center items-center justify-center mb-4 bg-gray-50 rounded-2xl border hover:shadow-lg hover:scale-[1.03] transition-all cursor-pointer p-4"
                    >
                      <span className="xl:h-24 xl:w-24 md:h-16 md:w-16 mb-3">
                        <Image
                          src={icon.src}
                          width={200}
                          height={200}
                          alt={icon.title || spec.speciality?.title || "Specialty"}
                          className="rounded-xl object-contain"
                        />
                      </span>
                      <p className="text-[#5271FF] font-poppins text-[14px] font-bold mb-2">
                        {spec.speciality?.title || icon.title || "Specialty"}
                      </p>
                      {spec.doctorCount !== undefined && (
                        <p className="text-[12px] text-gray-600 font-medium">
                          {spec.doctorCount} Doctor
                          {spec.doctorCount !== 1 ? "s" : ""}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HospitalSpecialtiesList;
