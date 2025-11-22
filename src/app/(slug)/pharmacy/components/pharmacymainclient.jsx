"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Briefcase,
  ChevronRight,
  Star,
  MapPin,
  Heart,
  Filter,
  Truck,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";

const PharmacyMainClient = ({
  pharmacyList,
  stateList,
  districtList,
  subdistrictList,
}) => {
  // ------------------ FORMAT PHARMACY DATA ------------------
  const pharmacies = pharmacyList.map((p) => {
    const reviewCount = p.PharmacyReview?.length || 0;
    const avgRating =
      reviewCount > 0
        ? (
            p.PharmacyReview.reduce((sum, r) => sum + (r.rating || 0), 0) /
            reviewCount
          ).toFixed(1)
        : 0;

    const is24x7 =
      p.servicetimeinday?.trim() === "00:00-24:00" ||
      p.servicetimeinday?.trim() === "00:00-23:59";

    return {
      id: p.id,
      name: p.regname || "Unnamed Pharmacy",
      logo: p.pharmacylogo || null,
      type: p.pharmacytype || "",
      address: p.fulladdress || "",
      state: p.state || "",
      district: p.district || "",
      taluka: p.taluka || "",
      city: p.city || "",
      pincode: p.pincode || "",
      productsCount: p.Product?.length || 0,
      ordersCount: p.PharmacyOrder?.length || 0,
      reviews: reviewCount,
      rating: Number(avgRating),
      is24x7,
      homedelivery: p.homedelivery,
      onlineOrder: p.onlineplotformservice,
      branchCount: p.pharmacybranch?.length || 0,
    };
  });

  // ------------------ UNIQUE FILTER VALUES ------------------
  const uniqueCities = [...new Set(pharmacies.map((p) => p.city).filter(Boolean))];
  const uniquePincodes = [...new Set(pharmacies.map((p) => p.pincode).filter(Boolean))];
  const uniqueTypes = [...new Set(pharmacies.map((p) => p.type).filter(Boolean))];

  // ------------------ FILTER STATES ------------------
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    name: "",
    state: "",
    district: "",
    taluka: "",
    city: "",
    pincode: "",
    type: "",
    homedelivery: false,
    onlineOrder: false,
    is24x7: false,
    rating: "",
    hasBranches: false,
  });

  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [filteredTalukas, setFilteredTalukas] = useState([]);

  // ------------------ STATE → DISTRICT ------------------
  useEffect(() => {
    if (!filters.state) {
      setFilteredDistricts([]);
      return;
    }

    const selectedState = stateList.find(
      (s) => s.stateName.toLowerCase() === filters.state.toLowerCase()
    );

    if (selectedState) {
      const districts = districtList.filter((d) => d.stateId === selectedState.id);
      setFilteredDistricts(districts);
    }

    setFilters((prev) => ({ ...prev, district: "", taluka: "" }));
  }, [filters.state]);

  // ------------------ DISTRICT → TALUKA ------------------
  useEffect(() => {
    if (!filters.district) {
      setFilteredTalukas([]);
      return;
    }

    const selectedDistrict = filteredDistricts.find(
      (d) => d.district.toLowerCase() === filters.district.toLowerCase()
    );

    if (selectedDistrict) {
      const talukas = subdistrictList.filter(
        (t) => t.districtId === selectedDistrict.id
      );
      setFilteredTalukas(talukas);
    }

    setFilters((prev) => ({ ...prev, taluka: "" }));
  }, [filters.district]);

  // ------------------ FILTERED PHARMACY LIST ------------------
  const filteredPharmacies = useMemo(() => {
    return pharmacies.filter((p) => {
      if (filters.name && !p.name.toLowerCase().includes(filters.name.toLowerCase()))
        return false;

      if (filters.state && p.state !== filters.state) return false;
      if (filters.district && p.district !== filters.district) return false;
      if (filters.taluka && p.taluka !== filters.taluka) return false;

      if (filters.city && p.city !== filters.city) return false;
      if (filters.pincode && p.pincode !== filters.pincode) return false;
      if (filters.type && p.type !== filters.type) return false;

      if (filters.homedelivery && !p.homedelivery) return false;
      if (filters.onlineOrder && !p.onlineOrder) return false;
      if (filters.is24x7 && !p.is24x7) return false;

      if (filters.rating && p.rating < Number(filters.rating)) return false;
      if (filters.hasBranches && p.branchCount === 0) return false;

      return true;
    });
  }, [filters, pharmacies]);

  // ------------------ ROW LISTS ------------------
  const row1 = [...filteredPharmacies].sort((a, b) => b.ordersCount - a.ordersCount);
  const row2 = [...filteredPharmacies].sort((a, b) => b.rating - a.rating);
  const row3 = [...filteredPharmacies].sort((a, b) => b.productsCount - a.productsCount);
  const row4 = [...filteredPharmacies].filter((p) => p.homedelivery);

  // ------------------ CARD COMPONENT ------------------
  const PharmacyCard = ({ item }) => (
    <Link href={`/pharmacy/${item.id}`}>
      <Card className="h-full min-h-[280px] rounded-2xl shadow hover:shadow-xl transition-all bg-white hover:-translate-y-1">
        <CardContent className="p-0">
          <div className="bg-gradient-to-br from-[#E68B67]/10 to-[#C47C52]/10 p-5 rounded-t-2xl">
            <div className="flex items-center gap-4">
              {item.logo ? (
                <img
                  src={item.logo}
                  width={70}
                  height={70}
                  alt={item.name}
                  className="rounded-full bg-white p-2 shadow"
                />
              ) : (
                <div className="w-[70px] h-[70px] rounded-full bg-gray-200" />
              )}

              <div>
                <h3 className="font-bold text-lg text-[#243460]">{item.name}</h3>
                <p className="text-[#E68B67] text-sm">{item.type}</p>

                <div className="flex items-center gap-2 mt-1">
                  <Star className="w-4 h-4 text-[#E68B67] fill-[#E68B67]" />
                  <span className="text-sm text-[#243460]">
                    {item.rating} ({item.reviews} reviews)
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 space-y-3 text-sm">
            <div className="flex items-center gap-2 text-gray-700">
              <MapPin className="w-4 h-4 text-[#E68B67]" />
              <span className="line-clamp-2">{item.address}</span>
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <Truck className="w-4 h-4 text-[#E68B67]" />
              <span>
                Home Delivery:{" "}
                <span className={item.homedelivery ? "text-green-600" : "text-red-600"}>
                  {item.homedelivery ? "Yes" : "No"}
                </span>
              </span>
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <ShoppingCart className="w-4 h-4 text-[#E68B67]" />
              <span>
                Online Order:{" "}
                <span className={item.onlineOrder ? "text-green-600" : "text-red-600"}>
                  {item.onlineOrder ? "Yes" : "No"}
                </span>
              </span>
            </div>
          </div>

          <div className="p-5 pt-1 flex gap-3">
            <button className="flex-1 py-2 bg-[#E68B67] hover:bg-[#d17a5b] text-white rounded-xl text-sm">
              Order Now
            </button>
            <button className="flex-1 py-2 bg-[#243460] hover:bg-[#1a2850] text-white rounded-xl text-sm">
              View More
            </button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );

  // ------------------ ROW SECTION ------------------
  const RowSection = ({ title, data, icon: Icon }) => {
    const [expanded, setExpanded] = useState(false);
    const visible = expanded ? data : data.slice(0, 3);

    return (
      <div className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#E68B67] rounded-xl">
              <Icon className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-[#243460]">{title}</h2>
          </div>

          {data.length > 3 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-2 text-[#E68B67] font-medium"
            >
              {expanded ? "Show Less" : `View All (${data.length})`}
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map((item) => (
            <PharmacyCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    );
  };

  // ------------------ MAIN RETURN ------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF5E0]/30 via-white to-[#FAF5E0]/20">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-[#E68B67] to-[#C47C52] text-white py-10">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Briefcase /> Pharmacies
            </h1>
            <p className="text-white/90 mt-2">Find trusted pharmacies near you</p>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-white text-[#E68B67] px-4 py-2 rounded-xl shadow flex items-center gap-2 font-medium"
          >
            <Filter size={18} />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>
      </div>

      {/* PAGE BODY */}
      <div className="container mx-auto px-4 py-10 flex gap-8">
        {/* FILTER SIDEBAR */}
        {showFilters && (
          <div className="w-80 bg-white p-6 rounded-2xl shadow-xl space-y-6 sticky top-20 h-fit">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-[#243460]">Filters</h3>

              <button
                onClick={() =>
                  setFilters({
                    name: "",
                    state: "",
                    district: "",
                    taluka: "",
                    city: "",
                    pincode: "",
                    type: "",
                    homedelivery: false,
                    onlineOrder: false,
                    is24x7: false,
                    rating: "",
                    hasBranches: false,
                  })
                }
                className="text-[#E68B67] text-sm font-medium"
              >
                Clear All
              </button>
            </div>

            {/* Search */}
            <div>
              <p className="text-sm font-medium text-gray-600">Search</p>
              <input
                value={filters.name}
                onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                className="w-full p-2 border rounded-xl focus:border-[#E68B67]"
                placeholder="Pharmacy name..."
              />
            </div>

            {/* State */}
            <div>
              <p className="text-sm font-medium text-gray-600">State</p>
              <select
                value={filters.state}
                onChange={(e) => setFilters({ ...filters, state: e.target.value })}
                className="w-full p-2 border rounded-xl"
              >
                <option value="">All States</option>
                {stateList.map((s) => (
                  <option key={s.id}>{s.stateName}</option>
                ))}
              </select>
            </div>

            {/* District */}
            <div>
              <p className="text-sm font-medium text-gray-600">District</p>
              <select
                value={filters.district}
                onChange={(e) => setFilters({ ...filters, district: e.target.value })}
                className="w-full p-2 border rounded-xl"
                disabled={!filteredDistricts.length}
              >
                <option value="">All Districts</option>
                {filteredDistricts.map((d) => (
                  <option key={d.id}>{d.district}</option>
                ))}
              </select>
            </div>

            {/* Taluka */}
            <div>
              <p className="text-sm font-medium text-gray-600">Taluka</p>
              <select
                value={filters.taluka}
                onChange={(e) => setFilters({ ...filters, taluka: e.target.value })}
                className="w-full p-2 border rounded-xl"
                disabled={!filteredTalukas.length}
              >
                <option value="">All Talukas</option>
                {filteredTalukas.map((t) => (
                  <option key={t.id}>{t.subDistrict}</option>
                ))}
              </select>
            </div>

            {/* City */}
            <div>
              <p className="text-sm font-medium text-gray-600">City</p>
              <select
                value={filters.city}
                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                className="w-full p-2 border rounded-xl"
              >
                <option value="">All Cities</option>
                {uniqueCities.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Pincode */}
            <div>
              <p className="text-sm font-medium text-gray-600">Pincode</p>
              <select
                value={filters.pincode}
                onChange={(e) => setFilters({ ...filters, pincode: e.target.value })}
                className="w-full p-2 border rounded-xl"
              >
                <option value="">All</option>
                {uniquePincodes.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </div>

            {/* Pharmacy Type */}
            <div>
              <p className="text-sm font-medium text-gray-600">Pharmacy Type</p>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="w-full p-2 border rounded-xl"
              >
                <option value="">All</option>
                {uniqueTypes.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Checkboxes */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={filters.homedelivery}
                  onChange={(e) => setFilters({ ...filters, homedelivery: e.target.checked })}
                />
                Home Delivery
              </label>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={filters.onlineOrder}
                  onChange={(e) => setFilters({ ...filters, onlineOrder: e.target.checked })}
                />
                Online Order
              </label>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={filters.is24x7}
                  onChange={(e) => setFilters({ ...filters, is24x7: e.target.checked })}
                />
                Open 24x7
              </label>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={filters.hasBranches}
                  onChange={(e) => setFilters({ ...filters, hasBranches: e.target.checked })}
                />
                Has Branches
              </label>
            </div>

            {/* Rating */}
            <div>
              <p className="text-sm font-medium text-gray-600">Ratings</p>
              <select
                value={filters.rating}
                onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
                className="w-full p-2 border rounded-xl"
              >
                <option value="">Any Rating</option>
                <option value="4">4★ & above</option>
                <option value="3">3★ & above</option>
                <option value="2">2★ & above</option>
              </select>
            </div>
          </div>
        )}

        {/* ROWS SECTION */}
        <div className="flex-1">
          <RowSection title="Top Pharmacies" data={row1} icon={Heart} />
          <RowSection title="Top Rated Pharmacies" data={row2} icon={Star} />
          <RowSection title="Most Medicines Available" data={row3} icon={Briefcase} />
          <RowSection title="Home Delivery Pharmacies" data={row4} icon={Truck} />
        </div>
      </div>
    </div>
  );
};

export default PharmacyMainClient;
