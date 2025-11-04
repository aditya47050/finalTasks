"use client";
import React, { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DFF"];

const GraphicalRepresentation = ({ userdata }) => {
  // 🟢 1. Gender Distribution
  const genderData = useMemo(() => {
    const counts = userdata.reduce((acc, user) => {
      const gender = user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : "Unknown";
      acc[gender] = (acc[gender] || 0) + 1;
      return acc;
    }, {});
  
    return Object.entries(counts).map(([gender, count]) => ({ name: gender, count }));
  }, [userdata]);

  // 🟢 2. Age Distribution
  const ageData = useMemo(() => {
    const now = new Date();
    const ageGroups = { "0-18": 0, "19-30": 0, "31-45": 0, "46-60": 0, "60+": 0 };

    userdata.forEach((user) => {
      if (user.dateOfBirth) {
        const age = now.getFullYear() - new Date(user.dateOfBirth).getFullYear();
        if (age <= 18) ageGroups["0-18"]++;
        else if (age <= 30) ageGroups["19-30"]++;
        else if (age <= 45) ageGroups["31-45"]++;
        else if (age <= 60) ageGroups["46-60"]++;
        else ageGroups["60+"]++;
      }
    });

    return Object.entries(ageGroups).map(([group, count]) => ({ name: group, count }));
  }, [userdata]);

  // 🟢 3. Appointments Per City
  const cityData = useMemo(() => {
    const counts = userdata.reduce((acc, user) => {
      acc[user.city] = (acc[user.city] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts).map(([city, count]) => ({ name: city, count }));
  }, [userdata]);

  // 🟢 4. Category Distribution
  const categoryData = useMemo(() => {
    const counts = userdata.reduce((acc, user) => {
      const category = user.category?.title || "Unknown";
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts).map(([category, count]) => ({ name: category, count }));
  }, [userdata]);

  // 🟢 5. Monthly Appointments
  const monthlyData = useMemo(() => {
    const months = Array(12).fill(0);
    
    userdata.forEach((user) => {
      const month = new Date(user.createdAt).getMonth(); // Get month index (0-11)
      months[month]++;
    });

    return months.map((count, index) => ({
      name: new Date(2023, index).toLocaleString("default", { month: "short" }),
      count,
    }));
  }, [userdata]);

  return (
    <div className="bg-white p-4 rounded-xl shadow-lg mt-6">
      <h2 className="text-xl font-bold text-center text-blue-600">Graphical Representation</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              {/* Monthly Appointments - Line Chart */}
              <div className="flex flex-col items-center col-span-2">
          <h3 className="font-semibold text-lg">Monthly Appointments</h3>
          <ResponsiveContainer width="100%" height={300}>
  <LineChart data={monthlyData}>
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip formatter={(value) => [`${value}`, "Count"]} />
    <Legend formatter={(value) => (value === "count" ? "Count" : value)} />
    <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} name="Count" />
  </LineChart>
</ResponsiveContainer>

        </div>
        {/* Gender Distribution - Pie Chart */}
        <div className="flex flex-col items-center">
          <h3 className="font-semibold text-lg">Gender Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
  <PieChart>
    <Pie data={genderData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
      {genderData.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
    </Pie>
    <Tooltip formatter={(value) => [`${value}`, "Count"]} />
    <Legend formatter={(value) => (value === "count" ? "Count" : value)} />
  </PieChart>
</ResponsiveContainer>
        </div>

        {/* Age Distribution - Bar Chart */}
        <div className="flex flex-col items-center">
          <h3 className="font-semibold text-lg">Age Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
  <BarChart data={ageData}>
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip formatter={(value) => [`${value}`, "Count"]} />
    <Legend formatter={(value) => (value === "count" ? "Count" : value)} />
    <Bar dataKey="count" fill="#82ca9d" barSize={50} name="Count" />
  </BarChart>
</ResponsiveContainer>
        </div>

        {/* Appointments Per City - Bar Chart */}
        <div className="flex flex-col items-center">
          <h3 className="font-semibold text-lg">Appointments Per City</h3>
          <ResponsiveContainer width="100%" height={300}>
  <BarChart data={cityData}>
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip formatter={(value) => [`${value}`, "Count"]} />
    <Legend formatter={(value) => (value === "count" ? "Count" : value)} />
    <Bar dataKey="count" fill="#FF8042" barSize={50} name="Count" />
  </BarChart>
</ResponsiveContainer>
        </div>

        {/* Category Distribution - Pie Chart */}
        <div className="flex flex-col items-center">
          <h3 className="font-semibold text-lg">Category Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={categoryData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {categoryData.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

  
      </div>
    </div>
  );
};

export default GraphicalRepresentation;
