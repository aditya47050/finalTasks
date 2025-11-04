"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DFF"];

const EmergencyAmbulanceGraph = ({ userdata }) => {
  const [locationNames, setLocationNames] = useState({});

  // 🟢 1. Convert Lat/Lng to Location Names (Reverse Geocoding)
  const OPENCAGE_API_KEY = "0eed158387a74531bef9877e0a3cbf96"; // 🔴 Replace with your OpenCage API key

  useEffect(() => {
    const fetchLocationNames = async () => {
      const newLocationNames = {};

      for (const ambulance of userdata) {
        if (ambulance.locateme && !locationNames[ambulance.locateme]) {
          const loc = ambulance.locateme.split(",");

          if (loc.length !== 2) {
            console.warn("Invalid coordinates:", ambulance.locateme);
            newLocationNames[ambulance.locateme] = "Invalid Location";
            continue;
          }

          const [lat, lng] = loc.map((coord) => coord.trim());

          console.log("Fetching location for:", lat, lng); // Debugging log

          try {
            const response = await fetch(
              `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${OPENCAGE_API_KEY}`
            );
            const data = await response.json();

            console.log("OpenCage Response:", data); // Debugging log

            if (data.status.code === 200 && data.results.length > 0) {
              const locationName =
                data.results[0].components.city ||
                data.results[0].components.town ||
                data.results[0].components.village ||
                data.results[0].components.state ||
                "Unknown";

              newLocationNames[ambulance.locateme] = locationName;
            } else {
              console.warn("Invalid response:", data);
              newLocationNames[ambulance.locateme] = "Unknown";
            }

            // Delay to prevent API rate limit issues
            await new Promise((resolve) => setTimeout(resolve, 500));
          } catch (error) {
            console.error("Geocoding error:", error);
            newLocationNames[ambulance.locateme] = "Unknown";
          }
        }
      }

      setLocationNames((prev) => ({ ...prev, ...newLocationNames }));
    };

    fetchLocationNames();
  }, [userdata]);

  // 🟢 2. Ambulance Requests Per City (Category-wise)
  const categoryData = useMemo(() => {
    const counts = userdata.reduce((acc, ambulance) => {
      acc[ambulance.ambulancecategory] =
        (acc[ambulance.ambulancecategory] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts).map(([category, count]) => ({
      name: category || "Unknown",
      count,
    }));
  }, [userdata]);

  // 🟢 3. Requests Per Pin Code
  const pinCodeData = useMemo(() => {
    const counts = userdata.reduce((acc, ambulance) => {
      acc[ambulance.pinCode] = (acc[ambulance.pinCode] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts).map(([pinCode, count]) => ({
      name: pinCode || "Unknown",
      count,
    }));
  }, [userdata]);

  // 🟢 4. Requests Per Location (Pie Chart with City Names)
  const locationData = useMemo(() => {
    const counts = userdata.reduce((acc, ambulance) => {
      const locationName = locationNames[ambulance.locateme] || "Fetching...";
      acc[locationName] = (acc[locationName] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts).map(([location, count]) => ({
      name: location,
      count,
    }));
  }, [userdata, locationNames]);

  // 🟢 5. Monthly Ambulance Requests
  const monthlyData = useMemo(() => {
    const months = Array(12).fill(0);

    userdata.forEach((ambulance) => {
      if (ambulance.createdAt) {
        const month = new Date(ambulance.createdAt).getMonth();
        months[month]++;
      }
    });

    return months.map((count, index) => ({
      name: new Date(2023, index).toLocaleString("default", { month: "short" }),
      count,
    }));
  }, [userdata]);

  return (
    <div className="bg-white p-4 rounded-xl shadow-lg mt-6">
      <h2 className="text-xl font-bold text-center text-blue-600">
        Emergency Ambulance Data
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {/* 🟢 Monthly Requests - Line Chart */}
        <div className="flex flex-col items-center md:col-span-2">
          <h3 className="font-semibold text-lg">Monthly Ambulance Requests</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value}`, "Count"]} />
              <Legend
                formatter={(value) => (value === "count" ? "Count" : value)}
              />
              <CartesianGrid strokeDasharray="3 3" />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#8884d8"
                strokeWidth={2}
                name="Count"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 🟢 Ambulance Requests Per Category (City-wise) - Bar Chart */}
        <div className="flex flex-col items-center">
          <h3 className="font-semibold text-lg">Ambulance Requests Per City</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value}`, "Count"]} />
              <Legend
                formatter={(value) => (value === "count" ? "Count" : value)}
              />
              <Bar dataKey="count" fill="#FF8042" barSize={50} name="Count" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 🟢 Requests Per Pin Code - Bar Chart */}
        <div className="flex flex-col items-center">
          <h3 className="font-semibold text-lg">Requests Per Pin Code</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={pinCodeData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value}`, "Count"]} />
              <Legend
                formatter={(value) => (value === "count" ? "Count" : value)}
              />
              <Bar dataKey="count" fill="#00C49F" barSize={50} name="Count" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 🟢 Requests Per Location - Pie Chart with Names */}
        {/* <div className="flex flex-col items-center">
          <h3 className="font-semibold text-lg">Requests Per Location</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={locationData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {locationData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div> */}
      </div>
    </div>
  );
};

export default EmergencyAmbulanceGraph;
