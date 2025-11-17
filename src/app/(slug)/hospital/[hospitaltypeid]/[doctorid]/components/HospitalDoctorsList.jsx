"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  IndianRupee,
} from "lucide-react";
import { FaUserMd } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";   // ✅ Added

const HospitalDoctorsList = ({ hospitalId, onClose }) => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [feeRange, setFeeRange] = useState([0, 5000]);
  const [maxPossibleFee, setMaxPossibleFee] = useState(5000);
  const [isDragging, setIsDragging] = useState(false);

  const router = useRouter(); // ✅ Added

  useEffect(() => {
    fetchHospitalDoctors();
  }, [hospitalId]);

  useEffect(() => {
    filterDoctors();
  }, [searchTerm, selectedSpecialty, doctors, feeRange]);

  const fetchHospitalDoctors = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/hospital/${hospitalId}/doctors`);
      if (!response.ok) throw new Error("Failed to fetch doctors");
      const data = await response.json();

      const doctorList = data.doctors || [];
      setDoctors(doctorList);
      setFilteredDoctors(doctorList);

      const maxFee =
        Math.max(
          ...doctorList.map((d) =>
            parseFloat(d.doctorinfo?.consultationfee || 0)
          )
        ) || 5000;
      setMaxPossibleFee(maxFee);
      setFeeRange([0, maxFee]);
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
        const education = doc.education?.toLowerCase() || "";

        return (
          fullName.includes(searchTerm.toLowerCase()) ||
          specialties.includes(searchTerm.toLowerCase()) ||
          education.includes(searchTerm.toLowerCase())
        );
      });
    }

    if (selectedSpecialty !== "all") {
      filtered = filtered.filter((doc) =>
        doc.specialities?.some((s) => s.speciality?.id === selectedSpecialty)
      );
    }

    filtered = filtered.filter((doc) => {
      const fee = parseFloat(doc.doctorinfo?.consultationfee || 0);
      return fee >= feeRange[0] && fee <= feeRange[1];
    });

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

  // --- SLIDER COMPONENT (UNCHANGED) ---
  const FeeRangeSlider = ({ min, max, value, onChange, onDragChange }) => {
    const range = max - min;

    const handleMouseDown = (index) => (e) => {
      e.preventDefault();
      setIsDragging(true);
      onDragChange(true);

      const handleMouseMove = (e) => {
        const slider = document.querySelector(".slider-container");
        if (!slider) return;

        const rect = slider.getBoundingClientRect();
        const x = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
        const percentage = x / rect.width;
        const newValue = Math.round(min + percentage * range);

        setFeeRange((prev) => {
          const newValues = [...prev];
          newValues[index] = newValue;

          if (index === 0 && newValues[0] > newValues[1])
            newValues[1] = newValues[0];
          if (index === 1 && newValues[1] < newValues[0])
            newValues[0] = newValues[1];

          onChange(newValues);
          return newValues;
        });
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        setIsDragging(false);
        onDragChange(false);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };

    const handleTouchStart = (index) => (e) => {
      e.preventDefault();
      setIsDragging(true);
      onDragChange(true);

      const handleTouchMove = (e) => {
        const slider = document.querySelector(".slider-container");
        if (!slider) return;

        const rect = slider.getBoundingClientRect();
        const x = Math.min(
          Math.max(e.touches[0].clientX - rect.left, 0),
          rect.width
        );
        const percentage = x / rect.width;
        const newValue = Math.round(min + percentage * range);

        setFeeRange((prev) => {
          const newValues = [...prev];
          newValues[index] = newValue;

          if (index === 0 && newValues[0] > newValues[1])
            newValues[1] = newValues[0];
          if (index === 1 && newValues[1] < newValues[0])
            newValues[0] = newValues[1];

          onChange(newValues);
          return newValues;
        });
      };

      const handleTouchEnd = () => {
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
        setIsDragging(false);
        onDragChange(false);
      };

      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleTouchEnd);
    };

    const getPosition = (val) => ((val - min) / range) * 100;

    return (
      <div className="slider-container relative w-full h-16 px-2">
        <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-200 rounded-full transform -translate-y-1/2" />

        <div
          className="absolute top-1/2 h-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transform -translate-y-1/2"
          style={{
            left: `${getPosition(value[0])}%`,
            width: `${getPosition(value[1]) - getPosition(value[0])}%`,
          }}
        />

        {value.map((val, index) => (
          <div
            key={index}
            className={`absolute top-1/2 w-6 h-6 bg-white border-2 rounded-full shadow-lg cursor-grab transform -translate-y-1/2 -translate-x-1/2 ${
              index === 0 ? "border-blue-600" : "border-indigo-600"
            }`}
            style={{ left: `${getPosition(val)}%` }}
            onMouseDown={handleMouseDown(index)}
            onTouchStart={handleTouchStart(index)}
          ></div>
        ))}
      </div>
    );
  };

  const specialties = getUniqueSpecialties();

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
      <div className="w-full h-full overflow-y-auto">
        <Card className="w-full max-w-[95vw] lg:max-w-none lg:rounded-none border-0 shadow-none bg-white min-h-screen mx-auto">

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
          <CardContent className="p-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-7xl mx-auto space-y-6">

              {/* SEARCH */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search by name, specialty, or qualification..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 h-12 text-base border-2 border-gray-200 rounded-2xl"
                />
              </div>

              {/* 🔘 DOCTORS GRID */}
              {loading ? (
                <div className="text-center py-16">
                  <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800">
                    Loading Doctors...
                  </h3>
                </div>
              ) : error ? (
                <div className="text-center py-16">
                  <p className="text-red-600 mb-6">{error}</p>
                </div>
              ) : filteredDoctors.length === 0 ? (
                <div className="text-center py-16">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-700">
                    No Doctors Found
                  </h3>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredDoctors.map((item, index) => (
                    <motion.div
                      key={`${item.id}-${index}`}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="h-full flex flex-col overflow-hidden rounded-2xl">
                        <CardContent className="p-0 flex flex-col flex-grow">

                          {/* HEADER */}
                          <div className="bg-gradient-to-br from-[#1E3B90]/10 to-[#3D85EF]/10 p-6 flex items-center gap-4">
                            {item.doctorinfo?.passportphoto ? (
                              <Image
                                src={item.doctorinfo.passportphoto}
                                width={80}
                                height={80}
                                alt={item.firstName}
                                className="rounded-full h-20 w-20 object-cover border-4 border-white shadow-lg"
                              />
                            ) : (
                              <div className="w-20 h-20 bg-[#1E3B90]/20 rounded-full flex items-center justify-center text-white shadow-lg">
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

                          {/* INFO */}
                          <div className="p-6 space-y-3 text-gray-700">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-[#1E3B90]" />
                              <span>
                                {item.doctorinfo?.presentaddress ||
                                  "Not Available"}
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

                          {/* BUTTONS */}
                          <div className="px-6 pb-6 pt-2 flex gap-3">

                            {/* BOOK NOW - Navigate */}
<button
  onClick={() =>
    router.push(
      `/doctor/${item.specialities?.[0]?.specialityId}/${item.id}`
    )
  }
  className="flex-1 bg-[#1E3B90] text-white py-2.5 rounded-xl shadow-md hover:scale-105 transition-all flex items-center justify-center gap-2 text-sm"
>
  <Calendar className="h-3 w-3" />
  Book Now
</button>

<button
  onClick={() =>
    router.push(
      `/doctor/${item.specialities?.[0]?.specialityId}/${item.id}`
    )
  }
  className="flex-1 bg-[#3D85EF] text-white py-2.5 rounded-xl shadow-md hover:scale-105 transition-all flex items-center justify-center gap-2 text-sm"
>
  <Stethoscope className="h-3 w-3" />
  Profile
</button>


                          </div>

                        </CardContent>
                      </Card>
                    </motion.div>
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
