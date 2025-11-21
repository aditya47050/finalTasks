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
  X,
} from "lucide-react";
import Link from "next/link";

const PharmacyClient = ({ pharmacyList }) => {
  console.log("🔥 REAL PHARMACY DATA FROM SERVER:", pharmacyList);

  // MAP REAL DB DATA
  const pharmacies = pharmacyList.map((p) => {
    const reviewCount = p.PharmacyReview?.length || 0;

    const avgRating =
      reviewCount > 0
        ? (
            p.PharmacyReview.reduce(
              (sum, r) => sum + (r.rating || 0),
              0
            ) / reviewCount
          ).toFixed(1)
        : 0;

    const is24x7 =
      p.servicetimeinday?.trim() === "00:00-24:00" ||
      p.servicetimeinday?.trim() === "00:00-23:59";

    return {
      id: p.id,
      name: p.regname || "Unnamed Pharmacy",
      logo: p.pharmacylogo,

      type: p.pharmacytype || "Retail Pharmacy",
      address: p.fulladdress || "",
      city: p.city || "",
      state: p.state || "",
      pincode: p.pincode || "",

      productsCount: p.Product?.length || 0,
      ordersCount: p.PharmacyOrder?.length || 0,

      reviews: reviewCount,
      rating: avgRating,
      deliverySpeed: p.homedelivery ? 20 : 45,
      is24x7,
      homedelivery: p.homedelivery,
    };
  });

  // FILTERS
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    name: "",
    city: "",
    pincode: "",
    type: "",
    is24x7: false,
    homedelivery: false,
  });

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters({
      ...filters,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const clearFilters = () => {
    setFilters({
      name: "",
      city: "",
      pincode: "",
      type: "",
      is24x7: false,
      homedelivery: false,
    });
  };

  const filteredPharmacies = useMemo(() => {
    return pharmacies.filter((p) => {
      const nameMatch = p.name.toLowerCase().includes(filters.name.toLowerCase());
      const cityMatch = filters.city
        ? p.city.toLowerCase().includes(filters.city.toLowerCase())
        : true;
      const pinMatch = filters.pincode ? p.pincode == filters.pincode : true;
      const typeMatch = filters.type ? p.type === filters.type : true;
      const is24Match = filters.is24x7 ? p.is24x7 : true;
      const deliveryMatch = filters.homedelivery ? p.homedelivery === true : true;

      return (
        nameMatch &&
        cityMatch &&
        pinMatch &&
        typeMatch &&
        is24Match &&
        deliveryMatch
      );
    });
  }, [filters, pharmacies]);

  // SORT ROWS
  const row1 = [...filteredPharmacies].sort((a, b) => b.ordersCount - a.ordersCount);
  const row2 = [...filteredPharmacies].sort((a, b) => b.rating - a.rating);
  const row3 = [...filteredPharmacies].sort((a, b) => b.productsCount - a.productsCount);
  const row4 = [...filteredPharmacies].sort((a, b) => a.deliverySpeed - b.deliverySpeed);

  // CARD
  const PharmacyCard = ({ item }) => (
    <Link href={`/pharmacy/${item.id}`}>
      <Card className="h-full min-h-[280px] shadow-md hover:shadow-xl rounded-2xl transition-all bg-white hover:-translate-y-1">
        <CardContent className="p-0">
          <div className="bg-gradient-to-br from-[#1E3B90]/10 to-[#3D85EF]/10 p-5 rounded-t-2xl">
            <div className="flex items-center gap-4">
              <img
                src={item.logo}
                width={70}
                height={70}
                alt="logo"
                className="rounded-full object-contain bg-white p-2 shadow"
              />
              <div>
                <h3 className="font-bold text-lg">{item.name}</h3>
                <p className="text-[#1E3B90] text-sm">{item.type}</p>

                <div className="flex items-center gap-2 mt-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm">
                    {item.rating} ({item.reviews} reviews)
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 space-y-3 text-sm">
            <div className="flex items-center gap-2 text-gray-700">
              <MapPin className="w-4 h-4 text-[#1E3B90]" />
              <span className="line-clamp-2">{item.address}</span>
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <Shield className="w-4 h-4 text-[#1E3B90]" />
              <span>{item.productsCount} medicines</span>
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <Clock className="w-4 h-4 text-[#1E3B90]" />
              <span>Delivery in {item.deliverySpeed} mins</span>
            </div>
          </div>

          <div className="p-5 pt-1 flex gap-3">
            <button className="flex-1 py-2 bg-gradient-to-r from-[#1e40af] to-[#3b82f6] text-white rounded-xl text-sm font-medium">
              Order Now
            </button>
            <button className="flex-1 py-2 bg-gradient-to-r from-[#059669] to-[#10b981] text-white rounded-xl text-sm font-medium">
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
            <div className="p-2 bg-gradient-to-br from-[#1E3B90] to-[#3D85EF] rounded-xl">
              <Icon className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold">{title}</h2>
          </div>

          {data.length > 3 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-2 text-[#3D85EF]"
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
    <div className="min-h-screen bg-gradient-to-br from-[#1E3B90]/5 via-white to-[#3D85EF]/5">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-[#1E3B90] to-[#3D85EF] text-white py-10 shadow">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Briefcase /> Pharmacies
            </h1>
            <p className="text-white/90 mt-2">Find trusted pharmacies near you</p>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-white text-[#1E3B90] px-4 py-2 rounded-xl shadow flex items-center gap-2"
          >
            <Filter size={18} />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 flex gap-8">

        {/* FILTER PANEL */}
        {showFilters && (
          <div className="w-80 bg-white rounded-2xl shadow-xl p-6 h-fit sticky top-20">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Filters</h3>
              <button onClick={clearFilters} className="text-red-600 text-sm">
                Clear All
              </button>
            </div>

            <div className="space-y-4">

              <div>
                <label className="text-gray-700 text-sm">Search Pharmacy</label>
                <input
                  name="name"
                  value={filters.name}
                  onChange={handleFilterChange}
                  className="w-full mt-1 p-2 border rounded-xl"
                  placeholder="Enter name..."
                />
              </div>

              <div>
                <label className="text-gray-700 text-sm">City</label>
                <input
                  name="city"
                  value={filters.city}
                  onChange={handleFilterChange}
                  className="w-full mt-1 p-2 border rounded-xl"
                  placeholder="Mumbai, Pune..."
                />
              </div>

              <div>
                <label className="text-gray-700 text-sm">Pincode</label>
                <input
                  name="pincode"
                  value={filters.pincode}
                  onChange={handleFilterChange}
                  className="w-full mt-1 p-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="text-gray-700 text-sm">Pharmacy Type</label>
                <select
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                  className="w-full mt-1 p-2 border rounded-xl"
                >
                  <option value="">All</option>
                  <option value="Retail Pharmacy">Retail Pharmacy</option>
                  <option value="Wholesale">Wholesale</option>
                  <option value="Chemist">Chemist</option>
                  <option value="Medical Store">Medical Store</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is24x7"
                  checked={filters.is24x7}
                  onChange={handleFilterChange}
                />
                <label>Open 24x7</label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="homedelivery"
                  checked={filters.homedelivery}
                  onChange={handleFilterChange}
                />
                <label>Home Delivery Available</label>
              </div>

            </div>
          </div>
        )}

        {/* MAIN CONTENT */}
        <div className="flex-1">
          <RowSection title="Top Pharmacies" data={row1} icon={Heart} />
          <RowSection title="Top Rated Pharmacies" data={row2} icon={Star} />
          <RowSection title="Most Medicines Available" data={row3} icon={Briefcase} />
          <RowSection title="Fastest Delivery Pharmacies" data={row4} icon={Clock} />
        </div>

      </div>
    </div>
  );
};

export default PharmacyClient;
