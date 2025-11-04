"use client"
import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const COLORS = ["#3498db", "#e74c3c", "#2ecc71", "#f39c12", "#9b59b6", "#1abc9c", "#d35400", "#34495e"];

const PatientGraph = ({ filteredData }) => {
  // Process data based on applied filters
  const {
    genderData,
    ageGroupData,
    maritalStatusData,
    bloodGroupData,
    stateData,
    cityData,
    districtData,
    talukaData,
    incomeData,
    religionData,
    hasPanCardData,
    healthInsuranceData,
    abhacardData,
    ayushmancardData,
    rationCardData,
    organDonationData,
    isCompanyRegisteredData,
    bankNameData,
    accountTypeData,
  } = useMemo(() => {
    let genderCount = {};
    let ageGroups = { "0-20": 0, "21-40": 0, "41-60": 0, "61+": 0 };
    let maritalStatusCount = {};
    let bloodGroupCount = {};
    let stateCount = {};
    let cityCount = {};
    let districtCount = {};
    let talukaCount = {};
    let incomeDistribution = {};
    let religionCount = {};
    let bankNameCount = {};
    let accountTypeCount = {};
    let healthInsuranceCount = { Yes: 0, No: 0 };
    let hasPanCardCount = { Yes: 0, No: 0 };
    let abhacardCount = { Yes: 0, No: 0 };
    let ayushmancardCount = { Yes: 0, No: 0 };
    let rationCardCount = { Yes: 0, No: 0 };
    let organDonationCount = { Yes: 0, No: 0 };
    let isCompanyRegisteredCount = { Yes: 0, No: 0 };
  
    filteredData.forEach((user) => {
      if (!user) return;
  
      // Gender
      genderCount[user.gender] = (genderCount[user.gender] || 0) + 1;
  
      // Age Groups
      const age = user.dateOfBirth ? new Date().getFullYear() - new Date(user.dateOfBirth).getFullYear() : null;
      if (age !== null) {
        if (age <= 20) ageGroups["0-20"]++;
        else if (age <= 40) ageGroups["21-40"]++;
        else if (age <= 60) ageGroups["41-60"]++;
        else ageGroups["61+"]++;
      }
  
      // Marital Status
      maritalStatusCount[user.maritalStatus] = (maritalStatusCount[user.maritalStatus] || 0) + 1;
  
      // Blood Group
      bloodGroupCount[user.bloodgroup] = (bloodGroupCount[user.bloodgroup] || 0) + 1;
  
      // Location-based Data
      stateCount[user.state] = (stateCount[user.state] || 0) + 1;
      cityCount[user.city] = (cityCount[user.city] || 0) + 1;
      districtCount[user.district] = (districtCount[user.district] || 0) + 1;
      talukaCount[user.taluka] = (talukaCount[user.taluka] || 0) + 1;
  
      // Income
      incomeDistribution[user.income] = (incomeDistribution[user.income] || 0) + 1;
  
      // Religion
      religionCount[user.religion] = (religionCount[user.religion] || 0) + 1;
  
      // Bank Name & Account Type
      bankNameCount[user.bankName] = (bankNameCount[user.bankName] || 0) + 1;
      accountTypeCount[user.accountType] = (accountTypeCount[user.accountType] || 0) + 1;
  
      // Yes/No Data
      hasPanCardCount[user.hasPanCard ? "Yes" : "No"]++;
      healthInsuranceCount[user.healthInsurance ? "Yes" : "No"]++;
      abhacardCount[user.abhacard ? "Yes" : "No"]++;
      ayushmancardCount[user.ayushmancard ? "Yes" : "No"]++;
      rationCardCount[user.rationcard ? "Yes" : "No"]++;
      organDonationCount[user.organDonation ? "Yes" : "No"]++;
      isCompanyRegisteredCount[user.isCompanyRegistered ? "Yes" : "No"]++;
    });
  
    // Format Data for Charts
    const formatData = (data, defaultCategories = []) => {
      defaultCategories.forEach((category) => {
        if (!data[category]) data[category] = 0;
      });
      return Object.keys(data).map((key, index) => ({
        category: key ? key.charAt(0).toUpperCase() + key.slice(1) : "Unknown",
        count: data[key],
        color: COLORS[index % COLORS.length],
      }));
    };
    
  
    return {
      genderData: formatData(genderCount),
      ageGroupData: formatData(ageGroups, ["0-20", "21-40", "41-60", "61+"]),
      maritalStatusData: formatData(maritalStatusCount),
      bloodGroupData: formatData(bloodGroupCount),
      stateData: formatData(stateCount),
      cityData: formatData(cityCount),
      districtData: formatData(districtCount),
      talukaData: formatData(talukaCount),
      incomeData: formatData(incomeDistribution),
      religionData: formatData(religionCount),
      hasPanCardData: formatData(hasPanCardCount, ["Yes", "No"]),
      healthInsuranceData: formatData(healthInsuranceCount, ["Yes", "No"]),
      abhacardData: formatData(abhacardCount, ["Yes", "No"]),
      ayushmancardData: formatData(ayushmancardCount, ["Yes", "No"]),
      rationCardData: formatData(rationCardCount, ["Yes", "No"]),
      organDonationData: formatData(organDonationCount, ["Yes", "No"]),
      isCompanyRegisteredData: formatData(isCompanyRegisteredCount, ["Yes", "No"]),
      bankNameData: formatData(bankNameCount),
      accountTypeData: formatData(accountTypeCount),
    };
  }, [filteredData]);
  

  return (
    <div className="w-full bg-white p-4 rounded-xl font-poppins shadow-lg">
      <h2 className="text-xl font-semibold text-center text-[#2b73ec] mb-4">Filtered Patient Data Overview </h2>
<h6 className="text-sm font-semibold underline text-center text-[#2b73ec] mb-4">Total - {filteredData.length}</h6>
      {/* Charts Layout */}
      <div className="flex flex-wrap justify-center">
        {/* Gender Distribution */}
        <ChartCard title="Gender Distribution">
          <PieChartComponent data={genderData} />
        </ChartCard>

        {/* Age Group Distribution */}
        <ChartCard title="Age Group Distribution">
          <BarChartComponent data={ageGroupData} />
        </ChartCard>

        {/* Marital Status */}
        <ChartCard title="Marital Status">
          <PieChartComponent data={maritalStatusData} />
        </ChartCard>

        {/* Blood Group */}
        <ChartCard title="Blood Group Distribution">
          <BarChartComponent data={bloodGroupData} />
        </ChartCard>

        {/* State-wise Distribution */}
        <ChartCard title="State-wise Distribution">
          <BarChartComponent data={stateData} />
        </ChartCard>

        {/* City-wise Distribution */}
        <ChartCard title="City-wise Distribution">
          <BarChartComponent data={cityData} />
        </ChartCard>

        {/* District-wise Distribution */}
        <ChartCard title="District-wise Distribution">
          <BarChartComponent data={districtData} />
        </ChartCard>
        <ChartCard title="Taluka Distribution">
  <BarChartComponent data={talukaData} />
</ChartCard>
        {/* Income Distribution */}
        <ChartCard title="Income Distribution">
          <BarChartComponent data={incomeData} />
        </ChartCard>

        {/* Health Insurance */}
        <ChartCard title="Health Insurance">
          <PieChartComponent data={healthInsuranceData} />
        </ChartCard>

        {/* Ration Card */}
        <ChartCard title="Ration Card Holders">
          <PieChartComponent data={rationCardData} />
        </ChartCard>

        {/* Organ Donation */}
        <ChartCard title="Organ Donors">
          <PieChartComponent data={organDonationData} />
        </ChartCard>
        <ChartCard title="Religion Distribution">
  <PieChartComponent data={religionData} />
</ChartCard>



{/* <ChartCard title="Bank Name Distribution">
  <BarChartComponent data={bankNameData} />
</ChartCard> */}

<ChartCard title="Account Type">
  <PieChartComponent data={accountTypeData} />
</ChartCard>

<ChartCard title="PAN Card Holders">
  <PieChartComponent data={hasPanCardData} />
</ChartCard>

<ChartCard title="ABHA Card Holders">
  <PieChartComponent data={abhacardData} />
</ChartCard>

<ChartCard title="Ayushman Card Holders">
  <PieChartComponent data={ayushmancardData} />
</ChartCard>

<ChartCard title="Company Registered">
  <PieChartComponent data={isCompanyRegisteredData} />
</ChartCard>

      </div>
    </div>
  );
};

// Reusable Chart Components
const ChartCard = ({ title, children }) => (
  <div className="w-full md:w-1/2 min-[1100px]:w-1/3 p-4">
    <h3 className="text-lg font-semibold text-center mb-2">{title}</h3>
    <div className="bg-gray-100 p-4 rounded-xl shadow">{children}</div>
  </div>
);

const PieChartComponent = ({ data }) => (
  <ResponsiveContainer width="100%" height={250}>
    <PieChart>
      <Pie data={data} dataKey="count" nameKey="category" cx="50%" cy="50%" outerRadius={80}>
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
);

const BarChartComponent = ({ data }) => (
  <ResponsiveContainer width="100%" height={250}>
    <BarChart data={data}>
      <XAxis dataKey="category" />
      <YAxis />
      {/* Customizing Tooltip & Legend */}
      <Tooltip formatter={(value) => [`${value}`, "Count"]} />
      <Legend formatter={(value) => (value === "count" ? "Count" : value)} />
      <Bar dataKey="count" fill="#3498db" name="Count" />
    </BarChart>
  </ResponsiveContainer>
);


export default PatientGraph;
