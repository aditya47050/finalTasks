"use client";

import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#2b73ec", "#f97316", "#10b981", "#ef4444", "#8b5cf6", "#ec4899"];

const GraphComponent = ({ userdata }) => {
  // 📌 1. Monthly Count of Bookings
  const monthlyData = useMemo(() => {
    const monthCounts = {};

    userdata.forEach(({ createdAt }) => {
      if (!createdAt) return;
      const date = new Date(createdAt);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;

      monthCounts[monthKey] = (monthCounts[monthKey] || 0) + 1;
    });

    return Object.keys(monthCounts)
      .sort()
      .map((month) => ({
        month,
        count: monthCounts[month],
      }));
  }, [userdata]);

  // 📌 2. Category Distribution (Ambulance Type, Ambulance Category, Hospital Type)
  const getCategoryData = (field) => {
    const categoryCounts = {};
    userdata.forEach((item) => {
      if (!item[field]) return;
      categoryCounts[item[field]] = (categoryCounts[item[field]] || 0) + 1;
    });

    return Object.keys(categoryCounts).map((key, index) => ({
      name: key,
      value: categoryCounts[key],
      color: COLORS[index % COLORS.length], // Assign colors dynamically
    }));
  };

  const ambulanceTypeData = getCategoryData("ambulancetype");
  const ambulanceCategoryData = getCategoryData("ambulancecategory");
  const hospitalTypeData = getCategoryData("hospitaltype");

  return (
    <div className="w-full p-4 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold text-center text-blue-600">Ambulance Booking Analysis</h2>

      {/* 📊 Monthly Bookings Bar Chart */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-center text-gray-700">Monthly Bookings</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#2b73ec" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 📊 Category Distribution Pie Charts */}
      <div className="grid grid-cols-1  gap-4 mt-8">
        {/* 🚑 Ambulance Type */}
        <div>
          <h3 className="text-lg font-semibold text-center text-gray-700">Ambulance Type</h3>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={ambulanceTypeData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {ambulanceTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 🚑 Ambulance Category */}
        <div>
          <h3 className="text-lg font-semibold text-center text-gray-700">Ambulance Category</h3>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={ambulanceCategoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {ambulanceCategoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 🏥 Hospital Type */}
        <div>
          <h3 className="text-lg font-semibold text-center text-gray-700">Hospital Type</h3>
          <ResponsiveContainer width="100%" height={500}>
            <PieChart>
              <Pie
                data={hospitalTypeData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {hospitalTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default GraphComponent;
