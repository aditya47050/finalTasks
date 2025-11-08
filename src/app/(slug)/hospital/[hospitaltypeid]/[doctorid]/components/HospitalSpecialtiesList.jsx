"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Icons from "@/lib/icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Heart, Search, X, Loader2, CheckCircle } from "lucide-react";

/* 🧠 Smart icon matching */
function findSrc(title) {
  const icon = Icons.find(
    (i) => i.title.toLowerCase() === title.toLowerCase()
  );
  return icon ? icon.src : Icons[0].src;
}

function getIconForSpecialty(name) {
  if (!name) return Icons[0].src;
  const cleanName = name.toLowerCase();

  const exact = Icons.find((icon) => icon.title.toLowerCase() === cleanName);
  if (exact) return exact.src;

  if (cleanName.includes("cardio")) return findSrc("Heart");
  if (cleanName.includes("neuro")) return findSrc("Brain");
  if (cleanName.includes("ortho") || cleanName.includes("bone"))
    return findSrc("Joint Replacement");
  if (cleanName.includes("eye")) return findSrc("Eyes");
  if (cleanName.includes("skin")) return findSrc("Skin");
  if (cleanName.includes("ent")) return findSrc("ENT");
  if (cleanName.includes("dental")) return findSrc("Dental");
  if (cleanName.includes("gyne")) return findSrc("Gynecology");
  if (cleanName.includes("kidney")) return findSrc("Kidney");
  if (cleanName.includes("pediatric")) return findSrc("Pediatrics");
  if (cleanName.includes("cancer") || cleanName.includes("onco"))
    return findSrc("Cancer");

  return Icons[0].src;
}

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
      if (!response.ok) throw new Error("Failed to fetch specialties");

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
      filtered = filtered.filter((spec) =>
        spec.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredSpecialties(filtered);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center">
      <Card className="w-full max-w-[95vw] lg:max-w-none lg:rounded-none lg:border-0 lg:shadow-none min-h-screen bg-white">
        <CardHeader className="border-b bg-gradient-to-r from-[#1E3B90] to-[#3D85EF] text-white sticky top-0 z-10 shadow-md">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl lg:text-3xl font-bold">
                  Hospital Specialties
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

        <CardContent className="p-6 lg:px-8 lg:py-8 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto">
            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search by specialty name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 h-12 text-base border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-2xl bg-white shadow-sm transition-all"
                />
              </div>
            </div>

            {/* Specialties Grid */}
            {loading ? (
              <div className="text-center py-16">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Loading Specialties...
                </h3>
              </div>
            ) : error ? (
              <div className="text-center py-16">
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
                <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-700 mb-2">
                  No Specialties Found
                </h3>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-5">
                {filteredSpecialties.map((spec, index) => {
                  const title = spec.title || "Specialty";
                  const iconSrc = getIconForSpecialty(title);
                  return (
                    <div
                      key={spec.id || index}
                      className="flex flex-col text-center items-center justify-center bg-white rounded-2xl border hover:shadow-lg hover:scale-[1.03] transition-all cursor-pointer p-4"
                    >
                      <Image
                        src={iconSrc}
                        width={100}
                        height={100}
                        alt={title}
                        className="rounded-xl object-contain mb-3"
                      />
                      <p className="text-[#1E3B90] font-bold text-[14px] mb-1">
                        {title}
                      </p>
                      {spec.doctorCount && (
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
