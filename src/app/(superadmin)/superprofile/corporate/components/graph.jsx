"use client";
import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF", "#FF4560"];

const CorporateAnalytics = ({ userdata }) => {
  if (!userdata || !Array.isArray(userdata) || userdata.length === 0) {
    return <p style={{ textAlign: "center", padding: "20px", fontSize: "18px" }}>No Data Available</p>;
  }

  const companyTypeCounts = userdata.reduce((acc, c) => {
    const t = c.companyType || "Unknown";
    acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, {});
  const companyTypeData = Object.keys(companyTypeCounts).map((k) => ({ name: k, value: companyTypeCounts[k] }));

  const approvalCounts = userdata
    .flatMap((c) => c.CorporateCertificate?.map((cert) => cert.approvalStatus) || [])
    .reduce((acc, s) => {
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    }, {});
  const approvalData = Object.keys(approvalCounts).map((k) => ({ name: k, value: approvalCounts[k] }));

  const locationFields = ["city", "district", "taluka", "state"];
  const locationData = locationFields.map((field) => ({
    field,
    counts: userdata.reduce((acc, c) => {
      const v = c[field] || "Unknown";
      acc[v] = (acc[v] || 0) + 1;
      return acc;
    }, {}),
  }));

  const employeeBuckets = { "0": 0, "1-50": 0, "51-200": 0, "201-1000": 0, "1001+": 0, Unknown: 0 };
  userdata.forEach((c) => {
    const n = parseInt(c.employeeCount);
    if (Number.isNaN(n)) employeeBuckets.Unknown++;
    else if (n === 0) employeeBuckets["0"]++;
    else if (n <= 50) employeeBuckets["1-50"]++;
    else if (n <= 200) employeeBuckets["51-200"]++;
    else if (n <= 1000) employeeBuckets["201-1000"]++;
    else employeeBuckets["1001+"]++;
  });
  const employeeData = Object.keys(employeeBuckets).map((k) => ({ name: k, value: employeeBuckets[k] }));

  const fieldKeys = [
    "companyName", "email", "mobile", "city", "state", "district", "taluka",
    "companyType", "companyPan", "gstNumber", "bankName", "bankAccountNumber",
    "ifscCode", "accountType", "presentAddress", "pincode", "companyLogo"
  ];
  const completionData = userdata.map((c, idx) => {
    const filled = fieldKeys.filter((k) => !!c[k]).length;
    return { name: `Corp ${idx + 1}`, filled, empty: fieldKeys.length - filled };
    });

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Corporate Analytics Dashboard
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
        {[companyTypeData, approvalData, employeeData].map((data, index) => (
          <div key={index} style={{ marginBottom: "50px", width: "100%" }}>
            <h3>
              {["Company Type", "Approval Status", "Employee Count"][index]} Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={data} cx="50%" cy="50%" outerRadius={100} dataKey="value" label>
                  {data.map((entry, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>

      <h3 style={{ marginTop: 20 }}>Field Completion Rate</h3>
      <div style={{ width: "100%", overflowX: "auto" }}>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={completionData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="filled" fill="#4CAF50" name="Filled" />
            <Bar dataKey="empty" fill="#F44336" name="Empty" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CorporateAnalytics;