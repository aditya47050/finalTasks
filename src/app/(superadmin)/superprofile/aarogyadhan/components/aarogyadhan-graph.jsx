"use client";
import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Activity } from "lucide-react";

// Import the reusable components
import { InputField, SelectField } from "@/app/components/input-selectui";
import { FaIndianRupeeSign } from "react-icons/fa6";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const AarogyadhanGraph = ({ data }) => {
  const [chartType, setChartType] = useState("bar");
  const [timeRange, setTimeRange] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [healthIssueFilter, setHealthIssueFilter] = useState("all");
  const [filters, setFilters] = useState({
    minReceivedAmount: "",
    maxReceivedAmount: "",
    minGoalAmount: "",
    maxGoalAmount: "",
    donorName: "",
  });

  // Process data for different chart types
  const processedData = useMemo(() => {
    const campaigns = data.campaigns || [];
    const donations = data.donations || [];

    // Apply additional filters
    const filteredCampaigns = campaigns.filter((campaign) => {
      const matchesReceivedAmount =
        (!filters.minReceivedAmount ||
          parseFloat(campaign.recievedamount) >=
            parseFloat(filters.minReceivedAmount)) &&
        (!filters.maxReceivedAmount ||
          parseFloat(campaign.recievedamount) <=
            parseFloat(filters.maxReceivedAmount));
      const matchesGoalAmount =
        (!filters.minGoalAmount ||
          parseFloat(campaign.goalamount) >=
            parseFloat(filters.minGoalAmount)) &&
        (!filters.maxGoalAmount ||
          parseFloat(campaign.goalamount) <= parseFloat(filters.maxGoalAmount));
      const matchesDonorName =
        !filters.donorName ||
        campaign.donors?.some((donor) =>
          donor.fullname
            ?.toLowerCase()
            .includes(filters.donorName.toLowerCase())
        );

      return matchesReceivedAmount && matchesGoalAmount && matchesDonorName;
    });

    // Monthly campaign data
    const monthlyData = filteredCampaigns.reduce((acc, campaign) => {
      const date = new Date(campaign.createdAt);
      const monthYear = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      if (!acc[monthYear]) {
        acc[monthYear] = {
          month: monthYear,
          campaigns: 0,
          totalGoal: 0,
          totalReceived: 0,
          donations: 0,
        };
      }

      acc[monthYear].campaigns += 1;
      acc[monthYear].totalGoal += Number.parseFloat(campaign.goalamount || 0);
      acc[monthYear].totalReceived += Number.parseFloat(
        campaign.recievedamount || 0
      );

      return acc;
    }, {});

    // Add donation counts
    donations.forEach((donation) => {
      const date = new Date(donation.createdAt);
      const monthYear = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      if (monthlyData[monthYear]) {
        monthlyData[monthYear].donations += 1;
      }
    });

    const monthlyArray = Object.values(monthlyData).sort((a, b) =>
      a.month.localeCompare(b.month)
    );

    // Status distribution
    const statusData = filteredCampaigns.reduce((acc, campaign) => {
      const status = campaign.status || "UNKNOWN";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    const statusArray = Object.entries(statusData).map(([status, count]) => ({
      status,
      count,
      percentage: ((count / filteredCampaigns.length) * 100).toFixed(1),
    }));

    // Health issue distribution
    const healthIssueData = filteredCampaigns.reduce((acc, campaign) => {
      const issue = campaign.healthissue || "Other";
      acc[issue] = (acc[issue] || 0) + 1;
      return acc;
    }, {});

    const healthIssueArray = Object.entries(healthIssueData).map(
      ([issue, count]) => ({
        issue,
        count,
        percentage: ((count / filteredCampaigns.length) * 100).toFixed(1),
      })
    );

    // Donation amount ranges
    const donationRanges = donations.reduce((acc, donation) => {
      const amount = Number.parseFloat(donation.amount || 0);
      let range = "";

      if (amount < 1000) range = "< ₹1,000";
      else if (amount < 5000) range = "₹1,000 - ₹5,000";
      else if (amount < 10000) range = "₹5,000 - ₹10,000";
      else if (amount < 50000) range = "₹10,000 - ₹50,000";
      else range = "> ₹50,000";

      acc[range] = (acc[range] || 0) + 1;
      return acc;
    }, {});

    const donationRangeArray = Object.entries(donationRanges).map(
      ([range, count]) => ({
        range,
        count,
      })
    );

    return {
      monthly: monthlyArray,
      status: statusArray,
      healthIssues: healthIssueArray,
      donationRanges: donationRangeArray,
    };
  }, [data, filters]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const renderChart = () => {
    switch (chartType) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={processedData.monthly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="campaigns" fill="#8884d8" name="Campaigns" />
              <Bar dataKey="donations" fill="#82ca9d" name="Donations" />
            </BarChart>
          </ResponsiveContainer>
        );

      case "line":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={processedData.monthly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="totalGoal"
                stroke="#8884d8"
                name="Goal Amount"
              />
              <Line
                type="monotone"
                dataKey="totalReceived"
                stroke="#82ca9d"
                name="Received Amount"
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case "pie":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={processedData.status}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ status, percentage }) => `${status} (${percentage}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {processedData.status.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );

      case "area":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={processedData.monthly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="totalReceived"
                stackId="1"
                stroke="#8884d8"
                fill="#8884d8"
              />
              <Area
                type="monotone"
                dataKey="totalGoal"
                stackId="2"
                stroke="#82ca9d"
                fill="#82ca9d"
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Interactive Analytics Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <SelectField
              label="Chart Type"
              id="chartType"
              value={chartType}
              onChange={setChartType}
              options={[
                { value: "bar", label: "Bar Chart" },
                { value: "line", label: "Line Chart" },
                { value: "pie", label: "Pie Chart" },
                { value: "area", label: "Area Chart" },
              ]}
            />
            <SelectField
              label="Time Range"
              id="timeRange"
              value={timeRange}
              onChange={setTimeRange}
              options={[
                { value: "all", label: "All Time" },
                { value: "6months", label: "Last 6 Months" },
                { value: "1year", label: "Last Year" },
                { value: "2years", label: "Last 2 Years" },
              ]}
            />
            <SelectField
              label="Status Filter"
              id="statusFilter"
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: "all", label: "All Status" },
                { value: "PENDING", label: "Pending" },
                { value: "APPROVED", label: "Approved" },
                { value: "REJECTED", label: "Rejected" },
              ]}
            />
            <SelectField
              label="Health Issue"
              id="healthIssueFilter"
              value={healthIssueFilter}
              onChange={setHealthIssueFilter}
              options={[
                { value: "all", label: "All Issues" },
                { value: "cancer", label: "Cancer" },
                { value: "heart", label: "Heart Disease" },
                { value: "kidney", label: "Kidney Disease" },
                { value: "other", label: "Other" },
              ]}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            <InputField
              label="Min Received Amount"
              id="minReceivedAmount"
              type="number"
              placeholder="Minimum received amount"
              value={filters.minReceivedAmount}
              onChange={handleFilterChange}
            />
            <InputField
              label="Max Received Amount"
              id="maxReceivedAmount"
              type="number"
              placeholder="Maximum received amount"
              value={filters.maxReceivedAmount}
              onChange={handleFilterChange}
            />
            <InputField
              label="Min Goal Amount"
              id="minGoalAmount"
              type="number"
              placeholder="Minimum goal amount"
              value={filters.minGoalAmount}
              onChange={handleFilterChange}
            />
            <InputField
              label="Max Goal Amount"
              id="maxGoalAmount"
              type="number"
              placeholder="Maximum goal amount"
              value={filters.maxGoalAmount}
              onChange={handleFilterChange}
            />
            <InputField
              label="Donor Name"
              id="donorName"
              placeholder="Search by donor name"
              value={filters.donorName}
              onChange={handleFilterChange}
            />
          </div>
        </CardContent>
      </Card>

      {/* Main Chart */}
      <Card>
        <CardHeader>
          <CardTitle>
            {chartType === "bar" && "Campaign & Donation Trends"}
            {chartType === "line" && "Fundraising Goals vs Received"}
            {chartType === "pie" && "Campaign Status Distribution"}
            {chartType === "area" && "Cumulative Fundraising Progress"}
          </CardTitle>
        </CardHeader>
        <CardContent>{renderChart()}</CardContent>
      </Card>

      {/* Additional Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Health Issues Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Health Issues Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={processedData.healthIssues}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  label={({ issue, percentage }) => `${issue} (${percentage}%)`}
                >
                  {processedData.healthIssues.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Donation Ranges */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FaIndianRupeeSign className="h-5 w-5" />
              Donation Amount Ranges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={processedData.donationRanges}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {processedData.status.reduce(
                  (sum, item) => sum + item.count,
                  0
                )}
              </div>
              <div className="text-sm text-gray-600">Total Campaigns</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {processedData.status.find((item) => item.status === "APPROVED")
                  ?.count || 0}
              </div>
              <div className="text-sm text-gray-600">Approved Campaigns</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {processedData.donationRanges.reduce(
                  (sum, item) => sum + item.count,
                  0
                )}
              </div>
              <div className="text-sm text-gray-600">Total Donations</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AarogyadhanGraph;
