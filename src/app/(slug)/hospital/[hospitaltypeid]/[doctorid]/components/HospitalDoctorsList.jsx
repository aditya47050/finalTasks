"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Users,
  Search,
  MapPin,
  Calendar,
  X,
  Loader2,
  Stethoscope,
  GraduationCap,
  CheckCircle,
  Briefcase,
  Star,
} from "lucide-react";
import { FaUserMd } from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const HospitalDoctorsList = ({ hospitalId, onClose }) => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");

  useEffect(() => {
    fetchHospitalDoctors();
  }, [hospitalId]);

  useEffect(() => {
    filterDoctors();
  }, [searchTerm, selectedSpecialty, doctors]);

  const fetchHospitalDoctors = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/hospital/${hospitalId}/doctors`);
      if (!response.ok) throw new Error("Failed to fetch doctors");
      const data = await response.json();

      setDoctors(data.doctors || []);
      setFilteredDoctors(data.doctors || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterDoctors = () => {
    let filtered = doctors;

    if (searchTerm) {
      filtered = filtered.filter((doc) => {
        const fullName = `${doc.firstName} ${doc.lastName}`.toLowerCase();
        const specialties =
          doc.specialities
            ?.map((s) => s.speciality?.title)
            .join(" ")
            .toLowerCase() || "";
        return (
          fullName.includes(searchTerm.toLowerCase()) ||
          specialties.includes(searchTerm.toLowerCase()) ||
          doc.education?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    if (selectedSpecialty !== "all") {
      filtered = filtered.filter((doc) =>
        doc.specialities?.some((s) => s.speciality?.id === selectedSpecialty)
      );
    }

    setFilteredDoctors(filtered);
  };

  const getUniqueSpecialties = () => {
    const specialties = new Map();
    doctors.forEach((doc) => {
      doc.specialities?.forEach((spec) => {
        if (spec.speciality)
          specialties.set(spec.speciality.id, spec.speciality.title);
      });
    });
    return Array.from(specialties, ([id, title]) => ({ id, title }));
  };

  const specialties = getUniqueSpecialties();

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
      <div className="w-full h-full overflow-y-auto">
        <Card className="w-full max-w-[95vw] lg:max-w-none lg:rounded-none lg:border-0 lg:shadow-none mx-auto min-h-screen bg-white">
          {/* HEADER */}
          <CardHeader className="border-b bg-gradient-to-r from-[#1E3B90] to-[#3D85EF] text-white sticky top-0 z-10 shadow-md">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                  <Stethoscope className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl lg:text-3xl font-bold">
                    Our Expert Doctors
                  </CardTitle>
                  <p className="text-sm text-blue-100 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>
                      {filteredDoctors.length} doctor
                      {filteredDoctors.length !== 1 ? "s" : ""} available
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

          {/* CONTENT */}
          <CardContent className="relative z-0 p-6 lg:px-8 lg:py-8 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-7xl mx-auto">
              {/* Search */}
              <div className="mb-8 space-y-5">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search by name, specialty, or qualification..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 pr-4 h-12 text-base border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-2xl bg-white shadow-sm transition-all"
                  />
                </div>

                {/* Specialty Filter */}
                {specialties.length > 0 && (
                  <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-2xl p-6 shadow-lg border-2 border-blue-100 relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-200/20 rounded-full blur-2xl"></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
                            <Stethoscope className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-gray-900">
                              Filter by Medical Specialty
                            </h3>
                            <p className="text-xs text-gray-600">
                              Select a specialty to view doctors
                            </p>
                          </div>
                        </div>
                        {selectedSpecialty !== "all" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedSpecialty("all")}
                            className="text-xs text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            Clear Filter
                          </Button>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2.5">
                        <Button
                          size="sm"
                          variant={
                            selectedSpecialty === "all" ? "default" : "outline"
                          }
                          onClick={() => setSelectedSpecialty("all")}
                          className={`rounded-full font-semibold px-5 py-2 ${
                            selectedSpecialty === "all"
                              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                              : "bg-white hover:bg-blue-50 hover:text-blue-600 border-2 border-blue-200"
                          }`}
                        >
                          ✨ All Specialties
                        </Button>
                        {specialties.map((spec) => (
                          <Button
                            key={spec.id}
                            size="sm"
                            onClick={() => setSelectedSpecialty(spec.id)}
                            className={`rounded-full font-semibold px-4 py-2 ${
                              selectedSpecialty === spec.id
                                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                                : "bg-white hover:bg-blue-50 hover:text-blue-600 border-2 border-blue-200"
                            }`}
                          >
                            {spec.title}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Doctors Grid */}
              {loading ? (
                <div className="text-center py-16">
                  <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Loading Doctors...
                  </h3>
                </div>
              ) : error ? (
                <div className="text-center py-16">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Error Loading Doctors
                  </h3>
                  <p className="text-red-600 mb-6">{error}</p>
                  <Button
                    onClick={fetchHospitalDoctors}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Try Again
                  </Button>
                </div>
              ) : filteredDoctors.length === 0 ? (
                <div className="text-center py-16">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-700 mb-2">
                    No Doctors Found
                  </h3>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredDoctors.map((item, index) => (
                    <Card
                      key={`${item.id}-${index}`}
                      className="h-full flex flex-col overflow-hidden border border-gray-100 shadow-lg hover:shadow-xl bg-white rounded-2xl hover:-translate-y-1 transition-all duration-300"
                    >
                      <CardContent className="p-0 flex flex-col flex-grow">
                        {/* Header */}
                        <div className="bg-gradient-to-br from-[#1E3B90]/10 to-[#3D85EF]/10 p-6 rounded-t-2xl flex items-center gap-4">
                          {item.doctorinfo?.passportphoto ? (
                            <Image
                              src={item.doctorinfo.passportphoto}
                              width={80}
                              height={80}
                              alt={item.firstName}
                              className="rounded-full h-20 w-20 object-cover border-4 border-white shadow-lg"
                            />
                          ) : (
                            <div className="w-20 h-20 bg-gradient-to-br from-[#1E3B90]/20 to-[#3D85EF]/30 border-4 border-white rounded-full flex items-center justify-center text-white shadow-lg">
                              <FaUserMd className="w-8 h-8" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-bold text-gray-800 truncate">
                              Dr. {item.firstName} {item.lastName}
                            </h3>
                            <p className="text-[#1E3B90] text-sm font-semibold">
                              {item.specialities?.[0]?.speciality?.title ||
                                "General Practitioner"}
                            </p>
                          </div>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-3 flex-grow text-gray-700">
                          {/* <div className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-[#1E3B90]" />
                            <span>
                              {item.doctorinfo?.experience || "N/A"} yrs exp
                            </span>
                          </div> */}

                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-[#1E3B90]" />
                            <span className="line-clamp-2">
                              {item.doctorinfo?.presentaddress
                                ? `${item.doctorinfo.presentaddress}, ${item.doctorinfo.city}, ${item.doctorinfo.state}`
                                : "Not Available"}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4 text-[#1E3B90]" />
                            <span>{item.education || "Not Available"}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Stethoscope className="h-4 w-4 text-[#1E3B90]" />
                            <span>
                              ₹{item.doctorinfo?.consultationfee || "N/A"} Fee
                            </span>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 pb-6 pt-2 flex gap-3">
                          <button className="flex-1 bg-[#1E3B90] text-white py-2.5 rounded-xl shadow-md hover:scale-105 transition-all flex items-center justify-center gap-2 text-sm">
                            <Calendar className="h-3 w-3" />
                            Book Now
                          </button>
                          <button className="flex-1 bg-[#3D85EF] text-white py-2.5 rounded-xl shadow-md hover:scale-105 transition-all flex items-center justify-center gap-2 text-sm">
                            <Stethoscope className="h-3 w-3" />
                            Profile
                          </button>
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

export default HospitalDoctorsList;
