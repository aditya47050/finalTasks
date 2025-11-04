"use client";
import React, { useState, useMemo, useEffect } from "react";
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
} from "recharts";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";

const GraphHealthcard = ({ fdata }) => {
  const [data, setData] = useState(fdata);

  useEffect(() => {
    setData(fdata);
  }, [fdata]); // Updates `data` whenever `fdata` changes

  // Group data by month for approval status
  const approvalStatusData = useMemo(() => {
    const groupedData = {};

    data.forEach((item) => {
      if (!item.createdAt || !item.approvalStatus) return;

      const date = new Date(item.createdAt);
      const monthYear = `${date.toLocaleString("default", {
        month: "short",
      })} ${date.getFullYear()}`;

      if (!groupedData[monthYear]) {
        groupedData[monthYear] = {
          month: monthYear,
          approved: 0,
          rejected: 0,
          pending: 0,
          submitted: 0,
        };
      }

      const status = item.approvalStatus.toLowerCase();
      if (status === "approved") groupedData[monthYear].approved += 1;
      else if (status === "rejected") groupedData[monthYear].rejected += 1;
      else if (status === "submitted") groupedData[monthYear].submitted += 1;
      else groupedData[monthYear].pending += 1;
    });

    return Object.values(groupedData);
  }, [data]);

  // Function to generate pie chart data for boolean fields
  const generateBooleanData = (field, label) => {
    let yes = 0,
      no = 0;

    data.forEach((item) => {
      if (item.patient?.[field]) yes += 1;
      else no += 1;
    });

    return {
      title: label,
      data: [
        { name: "Yes", value: yes },
        { name: "No", value: no },
      ],
    };
  };

  // Boolean fields - each as a separate pie chart
  const booleanFields = [
    generateBooleanData("healthInsurance", "Health Insurance"),
    generateBooleanData("ayushmanCard", "Ayushman Card"),
    generateBooleanData("rationcard", "Ration Card"),
    generateBooleanData("organDonation", "Organ Donation"),
    generateBooleanData("income", "Income Certificate"),
    generateBooleanData("hasPanCard", "PAN Card"),
    generateBooleanData("isCompanyRegistered", "Company Registration"),
  ];

  // Gender Distribution
  const genderData = useMemo(() => {
    let male = 0,
      female = 0,
      other = 0;

    data.forEach((item) => {
      if (item.patient?.gender?.toLowerCase() === "male") male += 1;
      else if (item.patient?.gender?.toLowerCase() === "female") female += 1;
      else other += 1;
    });

    return [
      { name: "Male", value: male },
      { name: "Female", value: female },
      { name: "Other", value: other },
    ];
  }, [data]);

  // State-wise distribution
  const stateData = useMemo(() => {
    const stateCount = {};

    data.forEach((item) => {
      if (item.patient?.state) {
        const state = item.patient.state;
        stateCount[state] = (stateCount[state] || 0) + 1;
      }
    });

    return Object.entries(stateCount).map(([state, count]) => ({
      state,
      count,
    }));
  }, [data]);

  // District-wise distribution
  const districtData = useMemo(() => {
    const districtCount = {};

    data.forEach((item) => {
      if (item.patient?.district) {
        const district = item.patient.district;
        districtCount[district] = (districtCount[district] || 0) + 1;
      }
    });

    return Object.entries(districtCount).map(([district, count]) => ({
      district,
      count,
    }));
  }, [data]);

  // Colors for pie charts
  const colors = ["#4CAF50", "#F44336"];

  return (
    <div className="container w-full mx-auto">
      <h1 className="text-[20px] text-[#2b73ec] font-extrabold text-center mt-4">
        Health Card Applications - Detailed Analytics
      </h1>
      <div className="grid grid-cols-1">
        {/* Approval Status Bar Chart */}
        <div className="w-full mt-6 flex justify-center">
          <ResponsiveContainer width="100%" height={window.innerWidth < 640 ? 300 : 400}>
            <BarChart
              data={approvalStatusData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                formatter={(value, name) => [
                  `${value}`,
                  name.charAt(0).toUpperCase() + name.slice(1),
                ]}
              />
              <Legend
                formatter={(value) =>
                  value.charAt(0).toUpperCase() + value.slice(1)
                }
              />
              <Bar dataKey="approved" fill="#4CAF50" name="Approved" />
              <Bar dataKey="rejected" fill="#F44336" name="Rejected" />
              <Bar dataKey="pending" fill="#FF9800" name="Pending" />
              <Bar dataKey="submitted" fill="#2196F3" name="Submitted" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* State-wise Distribution */}
        <div className="w-full mt-10">
          <h2 className="text-lg font-semibold text-center">
            State-wise Distribution
          </h2>
          <div className="w-full flex justify-center">
            <ResponsiveContainer width="100%" height={window.innerWidth < 640 ? 300 : 400} className="max-w-3xl">
              <BarChart data={stateData}>
                <XAxis
                  dataKey="state"
                  angle={window.innerWidth < 768 ? -45 : 0}
                  textAnchor={window.innerWidth < 768 ? "end" : "middle"}
                  interval={0}
                  height={window.innerWidth < 768 ? 80 : 60}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#2196F3" />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>

        {/* District-wise Distribution */}
        <div className="w-full mt-10">
          <h2 className="text-lg font-semibold text-center">
            District-wise Distribution
          </h2>
          <div className="w-full flex justify-center">
    <ResponsiveContainer width="100%" height={window.innerWidth < 640 ? 300 : 400} className="max-w-3xl">
      <BarChart data={districtData}>
        <XAxis
          dataKey="state"
          angle={window.innerWidth < 768 ? -45 : 0}
          textAnchor={window.innerWidth < 768 ? "end" : "middle"}
          interval={0}
          height={window.innerWidth < 768 ? 80 : 60}
        />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#2196F3" />
      </BarChart>
    </ResponsiveContainer>
  </div>

        </div>
      </div>

      {/* Boolean Fields - Each Pie Chart Separately */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {booleanFields.map((item, index) => (
          <div key={index} className="text-center">
            <h2 className="text-lg font-semibold mb-2">{item.title}</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={item.data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {item.data.map((entry, i) => (
                    <Cell key={`cell-${i}`} fill={colors[i % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ))}
      {/* Gender Distribution */}
      <div className="w-full flex justify-center mt-10">
        <div className="text-center">
          <h2 className="text-lg font-semibold mb-2">Gender Distribution</h2>
          <ResponsiveContainer width="100%" height={window.innerWidth < 640 ? 150 : 250}>
            <PieChart>
              <Pie
                data={genderData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {genderData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={["#4CAF50", "#2196F3", "#FF9800"][index]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      </div>


      {/* Export Button */}
      <div className="flex justify-end mt-4">
        <Button
          onClick={() => {
            const ws = XLSX.utils.json_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Health Card Data");
            XLSX.writeFile(wb, "healthcard_data.xlsx");
          }}
          className="bg-green-500 hover:bg-green-600 rounded-xl text-white"
        >
          Export to Excel
        </Button>
      </div>
    </div>
  );
};

export default GraphHealthcard;
