"use client";

import React, { useState, useMemo } from "react";
import * as XLSX from "xlsx";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  SelectField,
  InputField,
  DateFilter,
} from "@/app/components/input-selectui"; // Assuming these components are available
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Users, TrendingUp, Filter, Download, Eye } from "lucide-react";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { toast } from "react-toastify";
import AssignPhotographerDialog from "./case-assigndialogue";

const AarogyadhanDataDisplay = ({ data, photographers }) => {
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    // Campaign-related filters
    campaignName: "",
    status: "all",
    assignmentStatus: "all",
    photographerDecision: "all",
    startDateFrom: "",
    startDateTo: "",
    endDateFrom: "",
    endDateTo: "",
    minGoalAmount: "",
    maxGoalAmount: "",
    // Patient-related filters
    search: "",
    patientName: "",
    email: "",
    mobile: "",
    gender: "",
    minAge: "",
    maxAge: "",
    pincode: "",
    maritalStatus: "",
    religion: "",
    city: "",
    state: "",
    district: "",
    taluka: "",
    hasPanCard: "",
    income: "",
    healthInsurance: "",
    abhacard: "",
    ayushmancard: "",
    rationcard: "",
    organDonation: "",
    isCompanyRegistered: "",
    bloodgroup: "",
    bankName: "",
    accountType: "",
    aadharCardNumber: "",
    createdAtFrom: "",
    createdAtTo: "",
    updatedAtFrom: "",
    updatedAtTo: "",
  });

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const applyFilters = () => {
    console.log("Filters applied:", filters);
    // Implement filtering logic here
  };

  const stats = useMemo(() => {
    const totalDonations =
      data.donations?.reduce(
        (sum, donation) => sum + Number.parseFloat(donation.amount || 0),
        0
      ) || 0;

    return {
      totalDonations,
      totalCampaigns: data.campaigns?.length || 0,
      activeCampaigns:
        data.campaigns?.filter((c) => c.status === "APPROVED").length || 0,
      totalDonors: data.donors?.length || 0,
    };
  }, [data]);

  const filteredCampaigns = useMemo(() => {
    return (
      data.campaigns?.filter((campaign) => {
        const matchesCampaignName =
          !filters.campaignName ||
          campaign.fundraisertitle
            ?.toLowerCase()
            .includes(filters.campaignName.toLowerCase());
        const matchesStatus =
          filters.status === "all" || campaign.status === filters.status;
        const matchesAssignmentStatus =
          filters.assignmentStatus === "all" ||
          campaign.assignmentStatus === filters.assignmentStatus;
        const matchesPhotographerDecision =
          filters.photographerDecision === "all" ||
          campaign.photographerDecision === filters.photographerDecision;
        const matchesStartDate =
          (!filters.startDateFrom ||
            new Date(campaign.startDate) >= new Date(filters.startDateFrom)) &&
          (!filters.startDateTo ||
            new Date(campaign.startDate) <= new Date(filters.startDateTo));
        const matchesEndDate =
          (!filters.endDateFrom ||
            new Date(campaign.endDate) >= new Date(filters.endDateFrom)) &&
          (!filters.endDateTo ||
            new Date(campaign.endDate) <= new Date(filters.endDateTo));
        const matchesGoalAmount =
          (!filters.minGoalAmount ||
            campaign.goalamount >= parseFloat(filters.minGoalAmount)) &&
          (!filters.maxGoalAmount ||
            campaign.goalamount <= parseFloat(filters.maxGoalAmount));

        // Additional patient-related filters
        const matchesSearch =
          !filters.search ||
          campaign.fundraisertitle
            ?.toLowerCase()
            .includes(filters.search.toLowerCase()) ||
          campaign.description
            ?.toLowerCase()
            .includes(filters.search.toLowerCase());
        const matchesPatientName =
          !filters.patientName ||
          campaign.fundraiser.patient?.name
            ?.toLowerCase()
            .includes(filters.patientName.toLowerCase());

        // Additional patient-related filters
        const matchesEmail =
          !filters.email ||
          campaign.fundraiser.patient?.email
            ?.toLowerCase()
            .includes(filters.email.toLowerCase());
        const matchesMobile =
          !filters.mobile ||
          campaign.fundraiser.patient?.mobile.includes(filters.mobile);
        const matchesGender =
          !filters.gender ||
          campaign.fundraiser.patient?.gender?.toLowerCase() ===
            filters.gender.toLowerCase();
        const matchesPincode =
          !filters.pincode ||
          campaign.fundraiser.patient?.pincode === filters.pincode;
        const matchesMaritalStatus =
          !filters.maritalStatus ||
          campaign.fundraiser.patient?.maritalStatus?.toLowerCase() ===
            filters.maritalStatus.toLowerCase();
        const matchesReligion =
          !filters.religion ||
          campaign.fundraiser.patient?.religion?.toLowerCase() ===
            filters.religion.toLowerCase();
        const matchesCity =
          !filters.city ||
          campaign.fundraiser.patient?.city
            ?.toLowerCase()
            .includes(filters.city.toLowerCase());
        const matchesState =
          !filters.state ||
          campaign.fundraiser.patient?.state?.toLowerCase() ===
            filters.state.toLowerCase();
        const matchesDistrict =
          !filters.district ||
          campaign.fundraiser.patient?.district?.toLowerCase() ===
            filters.district.toLowerCase();
        const matchesTaluka =
          !filters.taluka ||
          campaign.fundraiser.patient?.taluka?.toLowerCase() ===
            filters.taluka.toLowerCase();
        const matchesHasPanCard =
          !filters.hasPanCard ||
          campaign.fundraiser.patient?.hasPanCard?.toString() ===
            filters.hasPanCard;
        const matchesIncome =
          !filters.income ||
          campaign.fundraiser.patient?.income?.toString() === filters.income;
        const matchesHealthInsurance =
          !filters.healthInsurance ||
          campaign.fundraiser.patient?.healthInsurance?.toString() ===
            filters.healthInsurance;
        const matchesAbhacard =
          !filters.abhacard ||
          campaign.fundraiser.patient?.abhacard?.toString() ===
            filters.abhacard;
        const matchesAyushmancard =
          !filters.ayushmancard ||
          campaign.fundraiser.patient?.ayushmancard?.toString() ===
            filters.ayushmancard;
        const matchesRationcard =
          !filters.rationcard ||
          campaign.fundraiser.patient?.rationcard?.toString() ===
            filters.rationcard;
        const matchesOrganDonation =
          !filters.organDonation ||
          campaign.fundraiser.patient?.organDonation?.toString() ===
            filters.organDonation;
        const matchesIsCompanyRegistered =
          !filters.isCompanyRegistered ||
          campaign.fundraiser.patient?.isCompanyRegistered?.toString() ===
            filters.isCompanyRegistered;
        const matchesBloodgroup =
          !filters.bloodgroup ||
          campaign.fundraiser.patient?.bloodgroup?.toLowerCase() ===
            filters.bloodgroup.toLowerCase();
        const matchesBankName =
          !filters.bankName ||
          campaign.fundraiser.patient?.bankName
            ?.toLowerCase()
            .includes(filters.bankName.toLowerCase());
        const matchesAccountType =
          !filters.accountType ||
          campaign.fundraiser.patient?.accountType?.toLowerCase() ===
            filters.accountType.toLowerCase();
        const matchesAadharCardNumber =
          !filters.aadharCardNumber ||
          campaign.fundraiser.patient?.aadharCardNumber
            ?.toString()
            .includes(filters.aadharCardNumber);

        // Date filters
        const createdAtDate = campaign.createdAt
          ? new Date(campaign.createdAt)
          : null;
        const updatedAtDate = campaign.updatedAt
          ? new Date(campaign.updatedAt)
          : null;
        const createdAtFromDate = filters.createdAtFrom
          ? new Date(filters.createdAtFrom)
          : null;
        const createdAtToDate = filters.createdAtTo
          ? new Date(filters.createdAtTo)
          : null;
        const updatedAtFromDate = filters.updatedAtFrom
          ? new Date(filters.updatedAtFrom)
          : null;
        const updatedAtToDate = filters.updatedAtTo
          ? new Date(filters.updatedAtTo)
          : null;

        return (
          matchesCampaignName &&
          matchesStatus &&
          matchesAssignmentStatus &&
          matchesPhotographerDecision &&
          matchesStartDate &&
          matchesEndDate &&
          matchesGoalAmount &&
          matchesSearch &&
          matchesPatientName &&
          matchesEmail &&
          matchesMobile &&
          matchesGender &&
          matchesPincode &&
          matchesMaritalStatus &&
          matchesReligion &&
          matchesCity &&
          matchesState &&
          matchesDistrict &&
          matchesTaluka &&
          matchesHasPanCard &&
          matchesIncome &&
          matchesHealthInsurance &&
          matchesAbhacard &&
          matchesAyushmancard &&
          matchesRationcard &&
          matchesOrganDonation &&
          matchesIsCompanyRegistered &&
          matchesBloodgroup &&
          matchesBankName &&
          matchesAccountType &&
          matchesAadharCardNumber &&
          (!createdAtFromDate ||
            (createdAtDate && createdAtDate >= createdAtFromDate)) &&
          (!createdAtToDate ||
            (createdAtDate && createdAtDate <= createdAtToDate)) &&
          (!updatedAtFromDate ||
            (updatedAtDate && updatedAtDate >= updatedAtFromDate)) &&
          (!updatedAtToDate ||
            (updatedAtDate && updatedAtDate <= updatedAtToDate))
        );
      }) || []
    );
  }, [data.campaigns, filters]);

  const handleExportToExcel = (dataToExport, filename) => {
    if (!Array.isArray(dataToExport) || dataToExport.length === 0) {
      console.error("No valid data available to export.");
      return;
    }

    try {
      const ws = XLSX.utils.json_to_sheet(dataToExport);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Data");
      XLSX.writeFile(wb, `${filename}.xlsx`);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
    }
  };

  const campaignColumns = [
    {
      accessorKey: "fundraisertitle",
      header: "Campaign Title",
    },
    {
      accessorKey: "goalamount",
      header: "Goal Amount",
      cell: ({ row }) =>
        `₹${Number.parseFloat(row.original.goalamount || 0).toLocaleString()}`,
    },
    {
      accessorKey: "recievedamount",
      header: "Received Amount",
      cell: ({ row }) =>
        `₹${Number.parseFloat(
          row.original.recievedamount || 0
        ).toLocaleString()}`,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant={row.original.status === "APPROVED" ? "default" : "secondary"}
        >
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: "assignmentStatus",
      header: "Assignment Status",
      cell: ({ row }) => (
        <Badge
          variant={
            row.original.assignmentStatus === "ASSIGNED"
              ? "default"
              : "secondary"
          }
        >
          {row.original.assignmentStatus}
        </Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created Date",
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const handleViewDetails = () => {
          window.location.href = `/superprofile/aarogyadhan/${row.original.id}`;
        };

        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="px-2 py-1 border border-blue-500 text-blue-500 font-semibold rounded-full hover:bg-blue-500 hover:text-white"
              onClick={handleViewDetails}
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>

            <AssignPhotographerDialog
              campaignId={row.original.id}
              photographers={photographers}
              onAssign={async (campaignId, photographerId) => {
                const res = await fetch(
                  "/api/aarogyadhan/photographer/case-assign",
                  {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ campaignId, photographerId }),
                  }
                );

                if (!res.ok) {
                  const { message } = await res.json();
                  throw new Error(message || "Assignment failed");
                }

                toast.success("Photographer assigned successfully!");
              }}
            ></AssignPhotographerDialog>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: filteredCampaigns,
    columns: campaignColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="md:container mx-auto md:p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Total Donations */}

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Donations</p>
                <p className="text-2xl font-bold text-green-600">
                  ₹{stats.totalDonations.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <FaIndianRupeeSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Campaigns */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Campaigns</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.totalCampaigns}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Heart className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Campaigns */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Campaigns</p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.activeCampaigns}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Donors */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Donors</p>
                <p className="text-2xl font-bold text-orange-600">
                  {stats.totalDonors}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Export */}
      <div className="flex justify-end !my-4 gap-2">
        <Button
          onClick={() => setShowFilters(!showFilters)}
          className="bg-blue-500 hover:bg-blue-500 rounded-xl text-white"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
        <Button
          onClick={() =>
            handleExportToExcel(filteredCampaigns, "aarogyadhan-campaigns")
          }
          className="bg-green-500 rounded-xl text-white"
        >
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Filter UI */}
      {showFilters && (
        <div className="bg-white rounded-xl px-6 pb-6 mb-4">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Filter Campaigns
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Campaign Filters */}
            <InputField
              label="Campaign Name"
              id="campaignName"
              placeholder="Search by campaign name"
              value={filters.campaignName}
              onChange={handleFilterChange}
            />

            <SelectField
              label="Status"
              id="status"
              value={filters.status}
              onChange={handleFilterChange}
              options={[
                { value: "all", label: "All" },
                { value: "APPROVED", label: "Approved" },
                { value: "PENDING", label: "Pending" },
                { value: "REJECTED", label: "Rejected" },
              ]}
            />

            <SelectField
              label="Assignment Status"
              id="assignmentStatus"
              value={filters.assignmentStatus}
              onChange={handleFilterChange}
              options={[
                { value: "all", label: "All" },
                { value: "ASSIGNED", label: "Assigned" },
                { value: "UNASSIGNED", label: "Unassigned" },
                { value: "COMPLETED", label: "Completed" },
              ]}
            />

            <SelectField
              label="Photographer Decision"
              id="photographerDecision"
              value={filters.photographerDecision}
              onChange={handleFilterChange}
              options={[
                { value: "all", label: "All" },
                { value: "ACCEPTED", label: "Accepted" },

                { value: "PENDING", label: "Pending" },
              ]}
            />

            <DateFilter
              label="Start Date From"
              id="startDateFrom"
              selected={filters.startDateFrom}
              onChange={handleFilterChange}
            />

            <DateFilter
              label="Start Date To"
              id="startDateTo"
              selected={filters.startDateTo}
              onChange={handleFilterChange}
            />

            <DateFilter
              label="End Date From"
              id="endDateFrom"
              selected={filters.endDateFrom}
              onChange={handleFilterChange}
            />

            <DateFilter
              label="End Date To"
              id="endDateTo"
              selected={filters.endDateTo}
              onChange={handleFilterChange}
            />

            <InputField
              label="Min Goal Amount"
              id="minGoalAmount"
              type="number"
              placeholder="Min Goal Amount"
              value={filters.minGoalAmount}
              onChange={handleFilterChange}
            />

            <InputField
              label="Max Goal Amount"
              id="maxGoalAmount"
              type="number"
              placeholder="Max Goal Amount"
              value={filters.maxGoalAmount}
              onChange={handleFilterChange}
            />

            {/* Patient Filters */}
            <InputField
              label="Search"
              id="search"
              placeholder="Search by title or description"
              value={filters.search}
              onChange={handleFilterChange}
            />

            <InputField
              label="Patient Name"
              id="patientName"
              placeholder="Search by patient name"
              value={filters.patientName}
              onChange={handleFilterChange}
            />

            <InputField
              label="Email"
              id="email"
              placeholder="Search by Email"
              value={filters.email}
              onChange={handleFilterChange}
            />

            <InputField
              label="Mobile"
              id="mobile"
              placeholder="Search by Mobile"
              value={filters.mobile}
              onChange={handleFilterChange}
            />

            <SelectField
              label="Gender"
              id="gender"
              value={filters.gender}
              onChange={handleFilterChange}
              options={[
                { value: "", label: "All Genders" },
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
              ]}
            />

            <InputField
              label="Min Age"
              id="minAge"
              type="number"
              placeholder="Min Age"
              value={filters.minAge}
              onChange={handleFilterChange}
            />

            <InputField
              label="Max Age"
              id="maxAge"
              type="number"
              placeholder="Max Age"
              value={filters.maxAge}
              onChange={handleFilterChange}
            />

            <InputField
              label="Pincode"
              id="pincode"
              placeholder="Enter Pincode"
              value={filters.pincode}
              onChange={handleFilterChange}
            />

            <SelectField
              label="Marital Status"
              id="maritalStatus"
              value={filters.maritalStatus}
              onChange={handleFilterChange}
              options={[
                { value: "", label: "All" },
                { value: "unmarried", label: "Unmarried" },
                { value: "married", label: "Married" },
              ]}
            />

            <SelectField
              label="Religion"
              id="religion"
              value={filters.religion}
              onChange={handleFilterChange}
              options={[
                { value: "", label: "All Religion" },
                { value: "hinduism", label: "Hinduism" },
                { value: "islam", label: "Islam" },
                { value: "christianity", label: "Christianity" },
                { value: "sikhism", label: "Sikhism" },
                { value: "buddhism", label: "Buddhism" },
                { value: "jainism", label: "Jainism" },
                { value: "kabirpanth", label: "Kabir Panth" },
                { value: "zoroastrianism", label: "Zoroastrianism" },
                { value: "other", label: "Other" },
              ]}
            />

            <InputField
              label="City"
              id="city"
              placeholder="City"
              value={filters.city}
              onChange={handleFilterChange}
            />

            <InputField
              label="District"
              id="district"
              placeholder="District"
              value={filters.district}
              onChange={handleFilterChange}
            />

            <InputField
              label="Taluka"
              id="taluka"
              placeholder="Taluka"
              value={filters.taluka}
              onChange={handleFilterChange}
            />

            <InputField
              label="State"
              id="state"
              placeholder="State"
              value={filters.state}
              onChange={handleFilterChange}
            />

            <SelectField
              label="Blood Group"
              id="bloodgroup"
              value={filters.bloodgroup}
              onChange={handleFilterChange}
              options={[
                { value: "", label: "All Blood Group" },
                { value: "A+", label: "A+" },
                { value: "A-", label: "A-" },
                { value: "B+", label: "B+" },
                { value: "B-", label: "B-" },
                { value: "O+", label: "O+" },
                { value: "O-", label: "O-" },
                { value: "AB+", label: "AB+" },
                { value: "AB-", label: "AB-" },
              ]}
            />

            <InputField
              label="Bank Name"
              id="bankName"
              placeholder="Bank Name"
              value={filters.bankName}
              onChange={handleFilterChange}
            />

            <SelectField
              label="Account Type"
              id="accountType"
              value={filters.accountType}
              onChange={handleFilterChange}
              options={[
                { value: "", label: "All" },
                { value: "savings", label: "Savings" },
                { value: "current", label: "Current" },
              ]}
            />

            <InputField
              label="Aadhar Card No"
              id="aadharCardNumber"
              placeholder="Enter Aadhar Number"
              value={filters.aadharCardNumber}
              onChange={handleFilterChange}
            />

            <SelectField
              label="PAN Card"
              id="hasPanCard"
              value={filters.hasPanCard}
              onChange={handleFilterChange}
              options={[
                { value: "", label: "All" },
                { value: "true", label: "Yes" },
                { value: "false", label: "No" },
              ]}
            />

            <SelectField
              label="Income Certificate"
              id="income"
              value={filters.income}
              onChange={handleFilterChange}
              options={[
                { value: "", label: "All" },
                { value: "true", label: "Yes" },
                { value: "false", label: "No" },
              ]}
            />

            <SelectField
              label="Health Insurance"
              id="healthInsurance"
              value={filters.healthInsurance}
              onChange={handleFilterChange}
              options={[
                { value: "", label: "All" },
                { value: "true", label: "Yes" },
                { value: "false", label: "No" },
              ]}
            />

            <SelectField
              label="ABHA Card"
              id="abhacard"
              value={filters.abhacard}
              onChange={handleFilterChange}
              options={[
                { value: "", label: "All" },
                { value: "true", label: "Yes" },
                { value: "false", label: "No" },
              ]}
            />

            <SelectField
              label="Ayushman Card"
              id="ayushmancard"
              value={filters.ayushmancard}
              onChange={handleFilterChange}
              options={[
                { value: "", label: "All" },
                { value: "true", label: "Yes" },
                { value: "false", label: "No" },
              ]}
            />

            <SelectField
              label="Ration Card"
              id="rationcard"
              value={filters.rationcard}
              onChange={handleFilterChange}
              options={[
                { value: "", label: "All" },
                { value: "true", label: "Yes" },
                { value: "false", label: "No" },
              ]}
            />

            <SelectField
              label="Organ Donation"
              id="organDonation"
              value={filters.organDonation}
              onChange={handleFilterChange}
              options={[
                { value: "", label: "All" },
                { value: "true", label: "Yes" },
                { value: "false", label: "No" },
              ]}
            />

            <SelectField
              label="Company Registered"
              id="isCompanyRegistered"
              value={filters.isCompanyRegistered}
              onChange={handleFilterChange}
              options={[
                { value: "", label: "All" },
                { value: "true", label: "Yes" },
                { value: "false", label: "No" },
              ]}
            />

            <DateFilter
              label="Created At From"
              id="createdAtFrom"
              selected={filters.createdAtFrom}
              onChange={handleFilterChange}
            />

            <DateFilter
              label="Created At To"
              id="createdAtTo"
              selected={filters.createdAtTo}
              onChange={handleFilterChange}
            />

            <DateFilter
              label="Updated At From"
              id="updatedAtFrom"
              selected={filters.updatedAtFrom}
              onChange={handleFilterChange}
            />

            <DateFilter
              label="Updated At To"
              id="updatedAtTo"
              selected={filters.updatedAtTo}
              onChange={handleFilterChange}
            />
          </div>
          <Button
            onClick={applyFilters}
            className="mt-4 bg-green-500 text-white"
          >
            Apply Filters
          </Button>
        </div>
      )}

      {/* Campaign Table */}
      <div className="overflow-x-auto w-full bg-white p-4 rounded-lg shadow-md">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-gray-100 hover:bg-gray-100">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="border border-gray-200 py-4 px-6 text-left font-semibold text-gray-900 whitespace-nowrap">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row,index) => (
                <TableRow key={row.id} className={`
                        transition-colors duration-150 ease-in-out
                        hover:bg-gray-50/50 
                        ${index % 2 === 0 ? "bg-white" : "bg-gray-50/20"}
                        border-[1px] border-gray-100
                      `}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="border-[1px] border-gray-200 py-4 px-6 text-sm whitespace-nowrap max-w-max hover:bg-gray-100">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={campaignColumns.length}
                  className="text-center py-4"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between pb-4">
        <Button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <span>
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>
        <Button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default AarogyadhanDataDisplay;
