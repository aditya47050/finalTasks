"use client";

import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer
} from "recharts";

// Key Fields
const keyFields = [
  "regname", "regno", "regdate", "regcertificate", "pharmacypancardno",
  "pharmacypancarddoc", "servicetimeinday", "servicetimeinweek",
  "onlineplotformservice", "homedelivery", "pharmacytype", "TotalregPharmacist",
  "fulladdress", "city", "state", "district", "taluka", "primarycontactno",
  "alternatemobile", "secondaryemail", "bankName", "accountNumber",
  "ifscCode", "accountType", "cancelledCheque", "micrCode", "pharmacylogo"
];

// Color Palette
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF", "#FF4560"];

const PharmacyAnalytics = ({ userdata }) => {
  if (!userdata || !Array.isArray(userdata) || userdata.length === 0) {
    return <p style={{ textAlign: "center", padding: "20px", fontSize: "18px" }}>No Data Available</p>;
  }

  /*** �� FIELD COMPLETION RATE ***/
  const completionData = userdata.map((pharmacy, index) => {
    const filledFields = keyFields.filter(field =>
      pharmacy[field] !== null && pharmacy[field] !== undefined && pharmacy[field] !== ""
    );
    return {
      name: `Pharmacy ${index + 1}`,
      filled: filledFields.length,
      empty: keyFields.length - filledFields.length,
    };
  });

  /*** �� PHARMACY TYPE DISTRIBUTION ***/
  const pharmacyTypeCounts = userdata.reduce((acc, pharmacy) => {
    const type = pharmacy.pharmacytype || "Unknown";
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const pharmacyTypeData = Object.keys(pharmacyTypeCounts).map(type => ({
    name: type,
    value: pharmacyTypeCounts[type]
  }));

  /*** 📌 APPROVAL STATUS ***/
  const approvalCounts = userdata.flatMap(pharmacy =>
    pharmacy.PharmacyCertificate?.map(cert => cert.approvalStatus) || []
  ).reduce((acc, status) => {
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const approvalData = Object.keys(approvalCounts).map(status => ({
    name: status,
    value: approvalCounts[status]
  }));

  /*** 📌 SERVICE TYPE DISTRIBUTION ***/
  const serviceData = [
    {
      name: "Online Platform",
      value: userdata.filter(p => p.onlineplotformservice).length
    },
    {
      name: "Home Delivery",
      value: userdata.filter(p => p.homedelivery).length
    }
  ];

  /*** 📌 LOCATION BREAKDOWN ***/
  const locationData = ["city", "district", "taluka", "state", "pincode"].map(field => ({
    field,
    counts: userdata.reduce((acc, pharmacy) => {
      const value = pharmacy[field] || "Unknown";
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {})
  }));

  /*** 📌 PHARMACIST COUNT DISTRIBUTION ***/
  const pharmacistCounts = userdata.reduce((acc, pharmacy) => {
    const count = parseInt(pharmacy.TotalregPharmacist) || 0;
    let range = "0";
    if (count === 0) range = "0";
    else if (count <= 2) range = "1-2";
    else if (count <= 5) range = "3-5";
    else if (count <= 10) range = "6-10";
    else range = "10+";
    
    acc[range] = (acc[range] || 0) + 1;
    return acc;
  }, {});

  const pharmacistData = Object.keys(pharmacistCounts).map(range => ({
    name: range,
    value: pharmacistCounts[range]
  }));

  /*** 📌 BANK DISTRIBUTION ***/
  const bankCounts = userdata.reduce((acc, pharmacy) => {
    const bank = pharmacy.bankName || "Unknown";
    acc[bank] = (acc[bank] || 0) + 1;
    return acc;
  }, {});

  const bankData = Object.keys(bankCounts).map(bank => ({
    name: bank,
    value: bankCounts[bank]
  }));

  /*** 📌 REGISTRATION YEAR DISTRIBUTION ***/
  const regYearCounts = userdata.reduce((acc, pharmacy) => {
    if (!pharmacy.regdate) {
      acc["Unknown"] = (acc["Unknown"] || 0) + 1;
      return acc;
    }
    const year = new Date(pharmacy.regdate).getFullYear();
    acc[year] = (acc[year] || 0) + 1;
    return acc;
  }, {});

  const regYearData = Object.keys(regYearCounts).map(year => ({
    name: year,
    value: regYearCounts[year]
  }));

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        📊 Pharmacy Analytics Dashboard
      </h2>

      {/* Pie Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
        {[pharmacyTypeData, approvalData, serviceData, pharmacistData, bankData, regYearData].map((data, index) => (
          <div key={index} style={{ marginBottom: "50px", width: "100%" }}>
            <h3>📌 {["Pharmacy Type", "Approval Status", "Service Types", "Pharmacist Count", "Bank", "Registration Year"][index]} Distribution</h3>
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

      {/* Field Completion */}
      <h3>📌 Field Completion Rate</h3>
      <div style={{ width: "100%", overflowX: "auto" }}>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={completionData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="filled" fill="#4CAF50" />
            <Bar dataKey="empty" fill="#F44336" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PharmacyAnalytics;