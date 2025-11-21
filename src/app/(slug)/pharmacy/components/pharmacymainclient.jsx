"use client";
import React, { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Briefcase,
  ChevronRight,
  Star,
  MapPin,
  Clock,
  Heart,
  Shield,
  Filter,
  Truck,
  ShoppingCart,
  Building2,
} from "lucide-react";
import Link from "next/link";

const PharmacyClient = ({ pharmacyList }) => {
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
      city: p.city || "",
      state: p.state || "",
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

  const uniqueCities = [...new Set(pharmacies.map((p) => p.city).filter(Boolean))];
  const uniquePincodes = [...new Set(pharmacies.map((p) => p.pincode).filter(Boolean))];
  const uniqueTypes = [...new Set(pharmacies.map((p) => p.type).filter(Boolean))];

  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    name: "",
    city: "",
    pincode: "",
    type: "",
    homedelivery: false,
    onlineOrder: false,
    is24x7: false,
    rating: "",
    hasBranches: false,
  });

  const filteredPharmacies = useMemo(() => {
    return pharmacies.filter((p) => {
      if (filters.name && !p.name.toLowerCase().includes(filters.name.toLowerCase())) return false;
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

  const row1 = [...filteredPharmacies].sort((a, b) => b.ordersCount - a.ordersCount);
  const row2 = [...filteredPharmacies].sort((a, b) => b.rating - a.rating);
  const row3 = [...filteredPharmacies].sort((a, b) => b.productsCount - a.productsCount);
  const row4 = [...filteredPharmacies].filter((p) => p.homedelivery);

  const PharmacyCard = ({ item }) => (
    <Link href={`/pharmacy/${item.id}`}>
      <Card className="h-full min-h-[280px] shadow hover:shadow-xl rounded-2xl transition-all bg-white hover:-translate-y-1">
        <CardContent className="p-0">
          <div className="bg-gradient-to-br from-[#E68B67]/10 to-[#C47C52]/10 p-5 rounded-t-2xl">
            <div className="flex items-center gap-4">
              {item.logo ? (
                <img
                  src={item.logo}
                  width={70}
                  height={70}
                  alt={item.name}
                  className="rounded-full object-contain bg-white p-2 shadow"
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
{/* 
            <div className="flex items-center gap-3 text-gray-700">
              <Shield className="w-4 h-4 text-[#E68B67]" />
              <span>{item.productsCount} medicines</span>
            </div> */}

            <div className="flex items-center gap-3 text-gray-700">
              <Truck className="w-4 h-4 text-[#E68B67]" />
              <span>
                Home Delivery:{" "}
                <span className={item.homedelivery ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                  {item.homedelivery ? "Yes" : "No"}
                </span>
              </span>
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <ShoppingCart className="w-4 h-4 text-[#E68B67]" />
              <span>
                Online Order:{" "}
                <span className={item.onlineOrder ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                  {item.onlineOrder ? "Yes" : "No"}
                </span>
              </span>
            </div>
          </div>

          <div className="p-5 pt-1 flex gap-3">
            <button className="flex-1 py-2 bg-[#E68B67] hover:bg-[#d17a5b] text-white rounded-xl text-sm font-medium transition">
              Order Now
            </button>
            <button className="flex-1 py-2 bg-[#243460] hover:bg-[#1a2850] text-white rounded-xl text-sm font-medium transition">
              View More
            </button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );

  const RowSection = ({ title, data, icon: Icon }) => {
    const [expanded, setExpanded] = useState(false);
    const items = expanded ? data : data.slice(0, 3);

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
          {items.map((p) => (
            <PharmacyCard key={p.id} item={p} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF5E0]/30 via-white to-[#FAF5E0]/20">
      <div className="bg-gradient-to-r from-[#E68B67] to-[#C47C52] text-white py-10 shadow">
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

      <div className="container mx-auto px-4 py-10 flex gap-8">
        {showFilters && (
          <div className="w-80 bg-white rounded-2xl shadow-xl p-6 h-fit sticky top-20 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-[#243460]">Filters</h3>
              <button
                onClick={() =>
                  setFilters({
                    name: "",
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

            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600">Search</p>
              <input
                value={filters.name}
                onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-xl focus:border-[#E68B67] outline-none"
                placeholder="Pharmacy name..."
              />
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600">City</p>
              <select
                value={filters.city}
                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-xl focus:border-[#E68B67] outline-none"
              >
                <option value="">All Cities</option>
                {uniqueCities.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>

              <p className="text-sm font-medium text-gray-600 mt-3">Pincode</p>
              <select
                value={filters.pincode}
                onChange={(e) => setFilters({ ...filters, pincode: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-xl focus:border-[#E68B67] outline-none"
              >
                <option value="">All</option>
                {uniquePincodes.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600">Pharmacy Type</p>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-xl focus:border-[#E68B67] outline-none"
              >
                <option value="">All</option>
                {uniqueTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-600">Services</p>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={filters.homedelivery}
                  onChange={(e) => setFilters({ ...filters, homedelivery: e.target.checked })}
                  className="w-4 h-4 text-[#E68B67] rounded"
                />
                Home Delivery
              </label>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={filters.onlineOrder}
                  onChange={(e) => setFilters({ ...filters, onlineOrder: e.target.checked })}
                  className="w-4 h-4 text-[#E68B67] rounded"
                />
                Online Order
              </label>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={filters.is24x7}
                  onChange={(e) => setFilters({ ...filters, is24x7: e.target.checked })}
                  className="w-4 h-4 text-[#E68B67] rounded"
                />
                Open 24x7
              </label>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600">Ratings</p>
              <select
                value={filters.rating}
                onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-xl focus:border-[#E68B67] outline-none"
              >
                <option value="">Any Rating</option>
                <option value="4">4★ & above</option>
                <option value="3">3★ & above</option>
                <option value="2">2★ & above</option>
              </select>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600">Other</p>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={filters.hasBranches}
                  onChange={(e) => setFilters({ ...filters, hasBranches: e.target.checked })}
                  className="w-4 h-4 text-[#E68B67] rounded"
                />
                Has Branches
              </label>
            </div>
          </div>
        )}

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

export default PharmacyClient;