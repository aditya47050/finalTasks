"use client";

import React, { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const BedBookingGraph = ({ userdata }) => {
  // Process data for each chart
  const { genderData, hospitalTypeData, bedCategoryData, cityData, monthlyData } = useMemo(() => {
    const summary = {
      Male: 0,
      Female: 0,
      Others: 0,
      hospitalTypes: {},
      bedCategories: {},
      cities: {},
      monthlyBookings: {},
    };

    userdata.forEach((row) => {
      // Count Gender
      if (row.gender === "male") summary.Male++;
      else if (row.gender === "female") summary.Female++;
      else summary.Others++;

      // Count Hospital Types
      const hospitalType = row.hospitalType || "Unknown";
      summary.hospitalTypes[hospitalType] = (summary.hospitalTypes[hospitalType] || 0) + 1;

      // Count Bed Categories
      const bedCategory = row.bedCategory || "Unknown";
      summary.bedCategories[bedCategory] = (summary.bedCategories[bedCategory] || 0) + 1;

      // Count Cities
      const city = row.city || "Unknown";
      summary.cities[city] = (summary.cities[city] || 0) + 1;

      // Count Bookings Per Month
      const month = new Date(row.createdAt).toLocaleString("default", { month: "short", year: "numeric" });
      summary.monthlyBookings[month] = (summary.monthlyBookings[month] || 0) + 1;
    });

    // Convert Data to Chart Format
    return {
      genderData: [
        { name: "Male", value: summary.Male },
        { name: "Female", value: summary.Female },
        { name: "Others", value: summary.Others },
      ],
      hospitalTypeData: Object.entries(summary.hospitalTypes).map(([key, value]) => ({ name: key, value })),
      bedCategoryData: Object.entries(summary.bedCategories).map(([key, value]) => ({ name: key, value })),
      cityData: Object.entries(summary.cities).map(([key, value]) => ({ name: key, value })),
      monthlyData: Object.entries(summary.monthlyBookings)
        .sort(([a], [b]) => new Date(a) - new Date(b))
        .map(([key, value]) => ({ name: key, value })),
    };
  }, [userdata]);

  return (
    <div className="bg-white p-4 rounded-xl shadow-lg my-6">
      <h2 className="text-xl font-bold text-center mb-4 text-blue-600">Bed Booking Overview</h2>

      {/* Gender Distribution Chart */}
      <div className="mb-6">
        <h3 className="text-md font-semibold text-center mb-2">Gender Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={genderData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#3182CE" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Hospital Type Chart */}
      <div className="mb-6">
        <h3 className="text-md font-semibold text-center mb-2">Hospital Type Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={hospitalTypeData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
            <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} height={100} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#E53E3E" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Bed Category Chart */}
      <div className="mb-6">
        <h3 className="text-md font-semibold text-center mb-2">Bed Category Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={bedCategoryData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
            <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} height={100} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#38A169" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* City Chart */}
      <div className="mb-6">
        <h3 className="text-md font-semibold text-center mb-2">City-wise Bookings</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={cityData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
            <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} height={100} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#D69E2E" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly Booking Chart */}
      <div className="mb-6">
        <h3 className="text-md font-semibold text-center mb-2">Monthly Booking Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#805AD5" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BedBookingGraph;
