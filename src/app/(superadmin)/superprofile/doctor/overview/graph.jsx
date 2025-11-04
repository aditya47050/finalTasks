"use client";

import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer
} from "recharts";

// Key Fields
const keyFields = [
  "gender", "education", "totalexperience", "degreecertificate",
  "registrationcertificate", "specialitydegreecertificate",
  "consultationfee", "city", "state", "district", "taluka",
  "bankName", "accountNumber", "pancardno", "aadharcardno",
  "presentaddress", "personalclinic"
];

// Color Palette
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF", "#FF4560"];

const DoctorAnalytics = ({ userdata }) => {
  if (!userdata || !Array.isArray(userdata) || userdata.length === 0) {
    return <p style={{ textAlign: "center", padding: "20px", fontSize: "18px" }}>No Data Available</p>;
  }

  /*** 📌 FIELD COMPLETION RATE ***/
  const completionData = userdata.map((doctor, index) => {
    const filledFields = keyFields.filter(field =>
      doctor[field] || (doctor.doctorinfo && doctor.doctorinfo[field])
    );
    return {
      name: `Doctor ${index + 1}`,
      filled: filledFields.length,
      empty: keyFields.length - filledFields.length,
    };
  });

  /*** 📌 SPECIALIZATION DISTRIBUTION ***/
  const specializationCounts = userdata.flatMap(doctor =>
    doctor.specialities?.map(spec => spec.title) || []
  ).reduce((acc, title) => {
    acc[title] = (acc[title] || 0) + 1;
    return acc;
  }, {});

  const specializationData = Object.keys(specializationCounts).map(title => ({
    name: title,
    value: specializationCounts[title]
  }));

  /*** 📌 EXPERIENCE VS SPECIALIZATION ***/
  const experienceSpecData = userdata.map(doctor => ({
    name: doctor.firstName || "Unknown",
    experience: parseInt(doctor.totalexperience) || 0,
    specialization: doctor.specialities?.map(spec => spec.title).join(", ") || "Unknown"
  }));

  /*** 📌 APPROVAL STATUS ***/
  const approvalCounts = userdata.flatMap(doctor =>
    doctor.DoctorCertificate?.map(cert => cert.approvalStatus) || []
  ).reduce((acc, status) => {
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const approvalData = Object.keys(approvalCounts).map(status => ({
    name: status,
    value: approvalCounts[status]
  }));

  /*** 📌 GENDER DISTRIBUTION ***/
  const genderCounts = userdata.reduce((acc, doctor) => {
    const gender = doctor.gender || "Unknown";
    acc[gender] = (acc[gender] || 0) + 1;
    return acc;
  }, {});

  const genderData = Object.keys(genderCounts).map(gender => ({
    name: gender,
    value: genderCounts[gender]
  }));

  /*** 📌 LOCATION BREAKDOWN ***/
  const locationData = ["city", "district", "taluka", "state", "pincode"].map(field => ({
    field,
    counts: userdata.reduce((acc, doctor) => {
      const value = doctor.doctorinfo?.[field] || "Unknown";
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {})
  }));

  /*** 📌 CONSULTATION FEE RANGES ***/
  const feeBuckets = {
    "Free": 0, "<500": 0, "500-1000": 0, "1000-2000": 0, "2000+": 0, Unknown: 0
  };

  userdata.forEach((doctor) => {
    const fee = parseInt(doctor.doctorinfo?.consultationfee) || 0;
    if (fee === 0) feeBuckets["Free"]++;
    else if (fee < 500) feeBuckets["<500"]++;
    else if (fee <= 1000) feeBuckets["500-1000"]++;
    else if (fee <= 2000) feeBuckets["1000-2000"]++;
    else if (fee > 2000) feeBuckets["2000+"]++;
    else feeBuckets["Unknown"]++;
  });

  const feeData = Object.keys(feeBuckets).map(range => ({
    name: range,
    value: feeBuckets[range],
  }));

  /*** 📌 BANK DISTRIBUTION ***/
  const bankCounts = userdata.reduce((acc, doctor) => {
    const bank = doctor.doctorinfo?.bankName || "Unknown";
    acc[bank] = (acc[bank] || 0) + 1;
    return acc;
  }, {});

  const bankData = Object.keys(bankCounts).map(bank => ({
    name: bank,
    value: bankCounts[bank]
  }));

  /*** 📌 AGE DISTRIBUTION ***/
  const ageBuckets = { "20-30": 0, "31-40": 0, "41-50": 0, "51+": 0, Unknown: 0 };

  userdata.forEach((doctor) => {
    if (!doctor.dateOfBirth) {
      ageBuckets["Unknown"]++;
      return;
    }
    const age = new Date().getFullYear() - new Date(doctor.dateOfBirth).getFullYear();
    if (age < 30) ageBuckets["20-30"]++;
    else if (age < 40) ageBuckets["31-40"]++;
    else if (age < 50) ageBuckets["41-50"]++;
    else ageBuckets["51+"]++;
  });

  const ageData = Object.keys(ageBuckets).map(range => ({
    name: range,
    value: ageBuckets[range]
  }));
  const experienceRanges = {
    "0-5": 0,
    "6-10": 0,
    "11-15": 0,
    "16-20": 0,
    "21+": 0
  };

  const specializationExperience = {};

  userdata.forEach((doctor) => {
    const experience = parseInt(doctor.totalexperience) || 0;
    let expGroup = "21+";

    if (experience <= 5) expGroup = "0-5";
    else if (experience <= 10) expGroup = "6-10";
    else if (experience <= 15) expGroup = "11-15";
    else if (experience <= 20) expGroup = "16-20";

    doctor.specialities?.forEach(spec => {
      const title = spec.title;
      if (!specializationExperience[title]) {
        specializationExperience[title] = { ...experienceRanges }; // Initialize with empty counts
      }
      specializationExperience[title][expGroup]++;
    });
  });

  const experienceSpeciData = Object.keys(specializationExperience).map(specialization => ({
    specialization,
    ...specializationExperience[specialization]
  }));
  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
    <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
      📊 Doctor Analytics Dashboard
    </h2>

 
    {/* Pie Charts */}
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
      {[specializationData, approvalData, genderData, feeData, bankData, ageData].map((data, index) => (
        <div key={index} style={{ marginBottom: "50px", width: "100%" }}>
          <h3>📌 {["Specialization", "Approval Status", "Gender", "Consultation Fee", "Bank", "Age"][index]} Distribution</h3>
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
       {/* Specialization vs Experience */}
       <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
      📊 Specialization vs. Average Experience
    </h2>
    <div style={{ width: "100%", overflowX: "auto" }}>
      <ResponsiveContainer width="100%" height={500}>
        <BarChart data={experienceSpeciData}>
          <XAxis dataKey="specialization" className="truncate"   height={80} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="0-5" fill={COLORS[0]} stackId="a" name="0-5 Years" />
          <Bar dataKey="6-10" fill={COLORS[1]} stackId="a" name="6-10 Years" />
          <Bar dataKey="11-15" fill={COLORS[2]} stackId="a" name="11-15 Years" />
          <Bar dataKey="16-20" fill={COLORS[3]} stackId="a" name="16-20 Years" />
          <Bar dataKey="21+" fill={COLORS[4]} stackId="a" name="21+ Years" />
        </BarChart>
      </ResponsiveContainer>
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

export default DoctorAnalytics;
