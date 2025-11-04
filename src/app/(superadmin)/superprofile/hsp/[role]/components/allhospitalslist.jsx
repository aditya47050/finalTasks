"use client";
import React, { useState, useMemo, useEffect } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DateFilter,
  InputField,
  SelectField,
} from "@/app/components/input-selectui";
import Image from "next/image";
import Modal from "react-modal";
import { toast } from 'react-toastify';
import HeadingClientMain from "@/app/components/heading";


const AllHospitalsList = ({
  hospitalData,
  states,
  dist,
  taluka,
  specialities,
  bedCategories,
  currentRole,
}) => {
  const pageSize = 10;

  const [hospitalList, setHospitalList] = useState(hospitalData);

  const [selectedIssues, setSelectedIssues] = useState([]);

  const [filters, setFilters] = useState({
    email: "",
    mobile: "",
    pincode: "",
    role: "",
    createdAtFrom: "",
    createdAtTo: "",
    updatedAtFrom: "",
    updatedAtTo: "",
    regname: "",
    onlineconsultation: "all",
    homehealthcare: "all",
    pharmacy: "all",
    pathology: "all",
    diagnosticservices: "all",
    cashlessservices: "all",
    governmentschemes: "all",
    inhousecanteen: "all",
    hspregno: "",
    nabhnablapproved: "all",
    isoapproved: "all",
    address: "",
    city: "",
    state: "all",
    dist: "all",
    taluka: "all",
    speciality: "all",
    doctorFirstName: "",
    doctorLastName: "",
    ambulanceCategory: "",
    ambulanceApprovalStatus: "",
    branchName: "",
    branchCity: "",
    bankName: "",
    bankAccountNo: "",
    bedCategory: "all",
  });

  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: pageSize,
  });
    const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState(null);
  const [currentHospitalId, setCurrentHospitalId] = useState(null);
  const [remark, setRemark] = useState("");
  const [loading, setLoading] = useState(false);


const generateHospitalIssues = () => {
  // Main Hospital model fields
  const hospitalFields = [
    'email', 'mobile', 'pincode', 'role'
  ];

  // HspInfo model fields
  const hspInfoFields = [
    'regname', 'totalnoofbed', 'totalspeciality', 'totaldoctor', 
    'totalambulance', 'onlineconsultation', 'homehealthcare',
    'pharmacy', 'pathology', 'diagnosticservices', 'cashlessservices',
    'governmentschemes', 'inhousecanteen', 'experience'
  ];

  // Hspdetails model fields
  const hspDetailsFields = [
    'hsplogo', 'hspregno', 'hspregcertificate', 'hspregdate',
    'nabhnablapproved', 'nabhnablcertificate', 'nabhnabllevel',
    'pancardno', 'pancardimg', 'isoapproved', 'bankname',
    'bankaccountno', 'ifsccode', 'accounttype', 'cancelledcheque',
    'micrcode'
  ];

  // Hspcontact model fields
  const hspContactFields = [
    'address', 'city', 'state', 'dist', 'taluka', 'pincode',
    'receptioncontact1', 'receptioncontact2', 'receptionemail',
    'managername', 'managercontact', 'manageremail',
    'adminname', 'admincontact', 'adminemail',
    'escalationmatrixsheet', 'alternateno'
  ];

  // Hspbranch model fields
  const hspBranchFields = [
    'branchname', 'branchregno', 'branchcity', 'branchpincode',
    'branchreceptionno1', 'branchreceptionno2', 'branchreceptionemail',
    'branchaddress', 'branchmanagername', 'branchmanagerno',
    'branchmanageremail', 'branchadminname', 'branchadminno',
    'branchadminemail', 'state', 'district', 'taluka'
  ];

  // Generate field-based issues
  const fieldIssues = [
    ...hospitalFields.map(f => `Incorrect ${f.charAt(0).toUpperCase() + f.slice(1)}`),
    ...hspInfoFields.map(f => `Invalid ${f.charAt(0).toUpperCase() + f.slice(1)}`),
    ...hspDetailsFields.map(f => `Invalid ${f.charAt(0).toUpperCase() + f.slice(1)}`),
    ...hspContactFields.map(f => `Incorrect ${f.charAt(0).toUpperCase() + f.slice(1)}`),
    ...hspBranchFields.map(f => `Invalid ${f.charAt(0).toUpperCase() + f.slice(1)}`)
  ];

  // Add relationship-based issues
  const relationshipIssues = [
    'Invalid Staff Information',
    'Invalid Department Information',
    'Invalid Speciality Information',
    'Invalid Doctor Information',
    'Invalid Ambulance Information',
    'Invalid Bed Category Information',
    'Invalid Bed Information',
    'Invalid Diagnostic Services',
    'Invalid Surgery Treatments'
  ];

  // Add document issues
  const documentIssues = [
    'Missing Required Documents',
    'Document Quality Issues',
    'Expired Documents',
    'Unclear Documents'
  ];

  // Add general issues
  const generalIssues = [
    'Incomplete Application',
    'Verification Failed',
    'Other'
  ];

  return [
    ...fieldIssues,
    ...relationshipIssues,
    ...documentIssues,
    ...generalIssues
  ];
};

const issues = generateHospitalIssues();

// Toggle function for selecting issues
const toggleIssue = (issue) => {
  setSelectedIssues(prev =>
    prev.includes(issue) 
      ? prev.filter(i => i !== issue) 
      : [...prev, issue]
  );
};
   // Modal functions
  const openModal = (action, hospitalId) => {
    setCurrentAction(action);
    setCurrentHospitalId(hospitalId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setRemark("");
  };


const handleSubmitRemark = async () => {
  if (currentAction === "reject" && remark.trim() === "" && selectedIssues.length === 0) {
    toast.error("Please provide a remark or select issues for rejection!");
    return;
  }

  try { 
    setLoading(true);
    const fullRemark = selectedIssues.length > 0
      ? `${remark}\n\nIssues:\n- ${selectedIssues.join("\n- ")}`
      : remark;
    const response = await fetch(`/api/hospital/${currentHospitalId}/approval`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        action: currentAction, 
        remark: fullRemark.trim() || null 
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update hospital status");
    }

    const result = await response.json();

    // Add validation for the API response
    if (!result?.data?.approvalStatus) {
      throw new Error("Invalid approval status in response");
    }

    // Update local hospitalList with the new status
    setHospitalList(prevData =>
      prevData.map(hospital =>
        hospital.id === currentHospitalId
          ? {
              ...hospital,
              approvalStatus: result.data.approvalStatus.toLowerCase(),
              adminRemarks: fullRemark.trim() || null
            }
          : hospital
      )
    );

    toast.success(`Hospital ${currentAction === "approve" ? "approved" : "rejected"} successfully!`);
    closeModal();

  } catch (error) {
    console.error("Error updating hospital:", error);
    toast.error(error.message || "Failed to update hospital status");
  } finally {
    setLoading(false);
  }
};

  const filteredData = useMemo(() => {
    return hospitalList.filter((hospital) => {
      const createdAtDate = hospital.createdAt
        ? new Date(hospital.createdAt)
        : null;
      const updatedAtDate = hospital.updatedAt
        ? new Date(hospital.updatedAt)
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
        (!filters.email ||
          (hospital.email &&
            hospital.email
              .toLowerCase()
              .includes(filters.email.toLowerCase()))) &&
        (!filters.mobile || hospital.mobile.includes(filters.mobile)) &&
        (!filters.pincode || hospital.pincode === filters.pincode) &&
        (!createdAtFromDate ||
          (createdAtDate && createdAtDate >= createdAtFromDate)) &&
        (!createdAtToDate ||
          (createdAtDate && createdAtDate <= createdAtToDate)) &&
        (!updatedAtFromDate ||
          (updatedAtDate && updatedAtDate >= updatedAtFromDate)) &&
        (!updatedAtToDate ||
          (updatedAtDate && updatedAtDate <= updatedAtToDate)) &&
        (!filters.regname ||
          (hospital.hspInfo?.regname &&
            hospital.hspInfo.regname
              .toLowerCase()
              .includes(filters.regname.toLowerCase()))) &&
        (filters.onlineconsultation === "all" ||
          hospital.hspInfo?.onlineconsultation ===
            (filters.onlineconsultation === "true")) &&
        (filters.homehealthcare === "all" ||
          hospital.hspInfo?.homehealthcare ===
            (filters.homehealthcare === "true")) &&
        (filters.pharmacy === "all" ||
          hospital.hspInfo?.pharmacy === (filters.pharmacy === "true")) &&
        (filters.pathology === "all" ||
          hospital.hspInfo?.pathology === (filters.pathology === "true")) &&
        (filters.diagnosticservices === "all" ||
          hospital.hspInfo?.diagnosticservices ===
            (filters.diagnosticservices === "true")) &&
        (filters.cashlessservices === "all" ||
          hospital.hspInfo?.cashlessservices ===
            (filters.cashlessservices === "true")) &&
        (filters.governmentschemes === "all" ||
          hospital.hspInfo?.governmentschemes ===
            (filters.governmentschemes === "true")) &&
        (filters.inhousecanteen === "all" ||
          hospital.hspInfo?.inhousecanteen ===
            (filters.inhousecanteen === "true")) &&
        (!filters.hspregno ||
          (hospital.hspdetails?.hspregno &&
            hospital.hspdetails.hspregno
              .toLowerCase()
              .includes(filters.hspregno.toLowerCase()))) &&
        (filters.nabhnablapproved === "all" ||
          hospital.hspdetails?.nabhnablapproved ===
            (filters.nabhnablapproved === "true")) &&
        (filters.isoapproved === "all" ||
          hospital.hspdetails?.isoapproved ===
            (filters.isoapproved === "true")) &&
        (!filters.address ||
          (hospital.hspcontact?.address &&
            hospital.hspcontact.address
              .toLowerCase()
              .includes(filters.address.toLowerCase()))) &&
        (!filters.city ||
          (hospital.hspcontact?.city &&
            hospital.hspcontact.city
              .toLowerCase()
              .includes(filters.city.toLowerCase()))) &&
        (filters.state === "all" ||
          (hospital.hspcontact?.state &&
            hospital.hspcontact.state
              .toLowerCase()
              .includes(filters.state.toLowerCase()))) &&
        (filters.dist === "all" ||
          (hospital.hspcontact?.dist &&
            hospital.hspcontact.dist
              .toLowerCase()
              .includes(filters.dist.toLowerCase()))) &&
        (filters.taluka === "all" ||
          (hospital.hspcontact?.taluka &&
            hospital.hspcontact.taluka
              .toLowerCase()
              .includes(filters.taluka.toLowerCase()))) &&
        (filters.speciality === "all" ||
          hospital.HospitalSpeciality?.some(
            (spec) =>
              spec.speciality?.title &&
              spec.speciality.title
                .toLowerCase()
                .includes(filters.speciality.toLowerCase())
          )) &&
        (!filters.doctorFirstName ||
          hospital.HospitalDoctor?.some(
            (doc) =>
              doc.doctor?.firstName &&
              doc.doctor.firstName
                .toLowerCase()
                .includes(filters.doctorFirstName.toLowerCase())
          )) &&
        (!filters.doctorLastName ||
          hospital.HospitalDoctor?.some(
            (doc) =>
              doc.doctor?.lastName &&
              doc.doctor.lastName
                .toLowerCase()
                .includes(filters.doctorLastName.toLowerCase())
          )) &&
        (!filters.ambulanceCategory ||
          hospital.HospitalAmbulance?.some(
            (amb) =>
              amb.ambulance?.category &&
              amb.ambulance.category
                .toLowerCase()
                .includes(filters.ambulanceCategory.toLowerCase())
          )) &&
        (!filters.ambulanceApprovalStatus ||
          hospital.HospitalAmbulance?.some(
            (amb) =>
              amb.ambulance?.approvalStatus &&
              amb.ambulance.approvalStatus
                .toLowerCase()
                .includes(filters.ambulanceApprovalStatus.toLowerCase())
          )) &&
        (!filters.branchName ||
          hospital.hspbranches?.some(
            (branch) =>
              branch.branchname &&
              branch.branchname
                .toLowerCase()
                .includes(filters.branchName.toLowerCase())
          )) &&
        (!filters.branchCity ||
          hospital.hspbranches?.some(
            (branch) =>
              branch.branchcity &&
              branch.branchcity
                .toLowerCase()
                .includes(filters.branchCity.toLowerCase())
          )) &&
        (!filters.bankName ||
          (hospital.hspdetails?.bankname &&
            hospital.hspdetails.bankname
              .toLowerCase()
              .includes(filters.bankName.toLowerCase()))) &&
        (!filters.bankAccountNo ||
          (hospital.hspdetails?.bankaccountno &&
            hospital.hspdetails.bankaccountno
              .toLowerCase()
              .includes(filters.bankAccountNo.toLowerCase()))) &&
        (filters.bedCategory === "all" ||
          hospital.BedCategory?.some(
            (category) =>
              category.name &&
              category.name
                .toLowerCase()
                .includes(filters.bedCategory.toLowerCase())
          ))
      );
    });
  }, [filters, hospitalList]);

  const handleFilterChange = (field, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value,
    }));
  };

  const handleViewProfile = (id) => {
    // Use the currentRole in the route
    window.location.href = `/superprofile/hsp/${currentRole}/${id}`;
  };
  const columns = useMemo(
    () => [
      {
        accessorKey: "hspdetails.hsplogo",
        header: "Hospital Logo",
        cell: ({ row }) => (
          <div className="w-12 h-12 overflow-hidden rounded-full">
            <Image
              src={row.original.hspdetails?.hsplogo || "/default-logo.png"}
              alt="Hospital Logo"
              width={48}
              height={48}
              className="object-cover"
            />
          </div>
        ),
      },
      { accessorKey: "hspInfo.regname", header: "Registration Name" },
      { accessorKey: "email", header: "Email" },
      { accessorKey: "mobile", header: "Mobile" },
      { accessorKey: "pincode", header: "Pincode" },
      { accessorKey: "hspcontact.city", header: "City" },
      { accessorKey: "hspdetails.hspregno", header: "Registration Number" },
      {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => formatDate(row.original.createdAt),
      },
      {
        accessorKey: "id",
        header: "Full Details",
        cell: ({ row }) => (
          <Button
            className="px-2 py-1 border border-blue-500 text-blue-500 font-semibold rounded-full hover:bg-blue-500 hover:text-white"
            onClick={() => handleViewProfile(row.getValue("id"))}
          >
            View Profile
          </Button>
        ),
      },
      {
        accessorKey: "HospitalCertificate.approvalStatus",
        header: "Approval Status",
        cell: ({ row }) => {
          const certs = row.original.HospitalCertificate;
          const status = certs?.length > 0
            ? (certs[0].approvalStatus || "PENDING").toLowerCase()
            : "pending";

          return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${status === "approved"
                ? "bg-emerald-100 text-emerald-800"
                : status === "rejected"
                  ? "bg-rose-100 text-rose-800"
                  : "bg-amber-100 text-amber-800"
              }`}>
              {status}
            </span>
          );
        },
      },
{
  accessorKey: "approvalStatus",
  header: "Approval Status",
  cell: ({ row }) => {
    const status = (row.getValue("approvalStatus") || "pending").toLowerCase();
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
        status === "approved"
          ? "bg-emerald-100 text-emerald-800"
          : status === "rejected"
          ? "bg-rose-100 text-rose-800"
          : "bg-amber-100 text-amber-800"
      }`}>
        {status}
      </span>
    );
  },
},
{
  accessorKey: "actions",
  header: "Actions",
  cell: ({ row }) => {
    const approvalStatus = row.original.approvalStatus?.toLowerCase();

    return (
      <div className="flex space-x-2">
        {/* Always show Approve button */}
        <button
          onClick={() => openModal("approve", row.original.id)}
          className="bg-green-500 text-white px-3 py-1 rounded text-sm"
        >
          Approve
        </button>
          <button
            onClick={() => openModal("reject", row.original.id)}
            className="bg-red-500 text-white px-3 py-1 rounded text-sm"
          >
            Reject
          </button>
      </div>
    );
  },
}
    ],
    []
  );

  // Utility function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    manualPagination: false,
  });

  const handleExportToExcel = (hospitalData) => {
    if (!Array.isArray(hospitalData) || hospitalData.length === 0) {
      console.error("No valid data available to export.");
      return;
    }

    try {
      const ws = XLSX.utils.json_to_sheet(hospitalData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Hospital Data");
      XLSX.writeFile(wb, "HospitalsData.xlsx");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
    }
  };

  const [showFilters, setShowFilters] = useState(false);
  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  return (
    <div className="md:container shadow-xl mx-auto font-poppins">
      <div className="overflow-x-auto xs:px-2 min-[1000px]:px-0 min-[1100px]:px-[32px] container mx-auto min-[1000px]:w-[700px] min-[1100px]:w-[900px] xl:w-[1000px] xlg:w-[1200px] w-[350px] md:w-[700px] bg-white">
        <HeadingClientMain main="All Hospital List" sub="Full Details" />
        <div className="flex justify-end gap-2 py-4 items-end">
          <button
            onClick={toggleFilters}
            className="bg-blue-500 rounded-xl text-white px-4 py-2  focus:outline-none hover:bg-blue-600 transition"
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>

          <button
            onClick={() => handleExportToExcel(filteredData)}
            className="bg-green-400 rounded-xl text-white px-4 py-2  focus:outline-none hover:bg-green-400 transition"
          >
            Export to Excel
          </button>
        </div>
        {showFilters && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <InputField
              label="Email"
              id="email"
              type="email"
              placeholder="Email"
              value={filters.email}
              onChange={handleFilterChange}
            />
            <InputField
              label="Mobile"
              id="mobile"
              type="text"
              placeholder="Mobile Number"
              value={filters.mobile}
              onChange={handleFilterChange}
            />
            <InputField
              label="Pincode"
              id="pincode"
              type="text"
              placeholder="Pincode"
              value={filters.pincode}
              onChange={handleFilterChange}
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
            <InputField
              label="Registration Name"
              id="regname"
              type="text"
              placeholder="Registration Name"
              value={filters.regname}
              onChange={handleFilterChange}
            />
            <SelectField
              label="Online Consultation"
              id="onlineconsultation"
              options={[
                { label: "All", value: "all" },
                { label: "Yes", value: "true" },
                { label: "No", value: "false" },
              ]}
              value={filters.onlineconsultation}
              onChange={handleFilterChange}
            />
            <SelectField
              label="Home Healthcare"
              id="homehealthcare"
              options={[
                { label: "All", value: "all" },
                { label: "Yes", value: "true" },
                { label: "No", value: "false" },
              ]}
              value={filters.homehealthcare}
              onChange={handleFilterChange}
            />
            <SelectField
              label="Pharmacy"
              id="pharmacy"
              options={[
                { label: "All", value: "all" },
                { label: "Yes", value: "true" },
                { label: "No", value: "false" },
              ]}
              value={filters.pharmacy}
              onChange={handleFilterChange}
            />
            <SelectField
              label="Pathology"
              id="pathology"
              options={[
                { label: "All", value: "all" },
                { label: "Yes", value: "true" },
                { label: "No", value: "false" },
              ]}
              value={filters.pathology}
              onChange={handleFilterChange}
            />
            <SelectField
              label="Diagnostic Services"
              id="diagnosticservices"
              options={[
                { label: "All", value: "all" },
                { label: "Yes", value: "true" },
                { label: "No", value: "false" },
              ]}
              value={filters.diagnosticservices}
              onChange={handleFilterChange}
            />
            <SelectField
              label="Cashless Services"
              id="cashlessservices"
              options={[
                { label: "All", value: "all" },
                { label: "Yes", value: "true" },
                { label: "No", value: "false" },
              ]}
              value={filters.cashlessservices}
              onChange={handleFilterChange}
            />
            <SelectField
              label="Government Schemes"
              id="governmentschemes"
              options={[
                { label: "All", value: "all" },
                { label: "Yes", value: "true" },
                { label: "No", value: "false" },
              ]}
              value={filters.governmentschemes}
              onChange={handleFilterChange}
            />
            <SelectField
              label="In-house Canteen"
              id="inhousecanteen"
              options={[
                { label: "All", value: "all" },
                { label: "Yes", value: "true" },
                { label: "No", value: "false" },
              ]}
              value={filters.inhousecanteen}
              onChange={handleFilterChange}
            />
            <InputField
              label="Registration Number"
              id="hspregno"
              type="text"
              placeholder="Registration Number"
              value={filters.hspregno}
              onChange={handleFilterChange}
            />
            <SelectField
              label="NABH/NABL Approved"
              id="nabhnablapproved"
              options={[
                { label: "All", value: "all" },
                { label: "Yes", value: "true" },
                { label: "No", value: "false" },
              ]}
              value={filters.nabhnablapproved}
              onChange={handleFilterChange}
            />
            <SelectField
              label="ISO Approved"
              id="isoapproved"
              options={[
                { label: "All", value: "all" },
                { label: "Yes", value: "true" },
                { label: "No", value: "false" },
              ]}
              value={filters.isoapproved}
              onChange={handleFilterChange}
            />
            <InputField
              label="Address"
              id="address"
              type="text"
              placeholder="Address"
              value={filters.address}
              onChange={handleFilterChange}
            />
            <InputField
              label="City"
              id="city"
              type="text"
              placeholder="City"
              value={filters.city}
              onChange={handleFilterChange}
            />
            <SelectField
              label="State"
              id="state"
              options={[
                { label: "All", value: "all" },
                ...states.map((state) => ({
                  label: state.stateName,
                  value: state.stateName,
                })),
              ]}
              value={filters.state}
              onChange={handleFilterChange}
            />
            <SelectField
              label="District"
              id="dist"
              options={[
                { label: "All", value: "all" },
                { label: "All", value: "all" },
                ...dist.map((state) => ({
                  label: state.district,
                  value: state.district,
                })),
              ]}
              value={filters.dist}
              onChange={handleFilterChange}
            />
            <SelectField
              label="Taluka"
              id="taluka"
              options={[
                { label: "All", value: "all" },
                ...taluka.map((state) => ({
                  label: state.subDistrict,
                  value: state.subDistrict,
                })),
              ]}
              value={filters.taluka}
              onChange={handleFilterChange}
            />
            <SelectField
              label="Speciality"
              id="speciality"
              options={[
                { label: "All", value: "all" },
                ...specialities.map((spec) => ({
                  label: spec.title,
                  value: spec.title,
                })),
              ]}
              value={filters.speciality}
              onChange={handleFilterChange}
            />
            <InputField
              label="Doctor First Name"
              id="doctorFirstName"
              type="text"
              placeholder="Doctor First Name"
              value={filters.doctorFirstName}
              onChange={handleFilterChange}
            />
            <InputField
              label="Doctor Last Name"
              id="doctorLastName"
              type="text"
              placeholder="Doctor Last Name"
              value={filters.doctorLastName}
              onChange={handleFilterChange}
            />
            <InputField
              label="Ambulance Category"
              id="ambulanceCategory"
              type="text"
              placeholder="Ambulance Category"
              value={filters.ambulanceCategory}
              onChange={handleFilterChange}
            />
            <InputField
              label="Ambulance Approval Status"
              id="ambulanceApprovalStatus"
              type="text"
              placeholder="Ambulance Approval Status"
              value={filters.ambulanceApprovalStatus}
              onChange={handleFilterChange}
            />
            <InputField
              label="Branch Name"
              id="branchName"
              type="text"
              placeholder="Branch Name"
              value={filters.branchName}
              onChange={handleFilterChange}
            />
            <InputField
              label="Branch City"
              id="branchCity"
              type="text"
              placeholder="Branch City"
              value={filters.branchCity}
              onChange={handleFilterChange}
            />
            <InputField
              label="Bank Name"
              id="bankName"
              type="text"
              placeholder="Bank Name"
              value={filters.bankName}
              onChange={handleFilterChange}
            />
            <InputField
              label="Bank Account Number"
              id="bankAccountNo"
              type="text"
              placeholder="Bank Account Number"
              value={filters.bankAccountNo}
              onChange={handleFilterChange}
            />
            <SelectField
              label="Bed Category"
              id="bedCategory"
              options={[
                { label: "All", value: "all" },
                ...bedCategories.map((category) => ({
                  label: category.name,
                  value: category.name,
                })),
              ]}
              value={filters.bedCategory}
              onChange={handleFilterChange}
            />
          </div>
        )}
        {/* Table */}
        <div className="overflow-x-auto bg-white p-4 rounded-xl shadow-lg">
          <div className="">
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
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <div className="flex items-center justify-between py-4">
              <Button
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="rounded-full border-2 px-3 border-[#243460]">
                  Previous
                </span>
              </Button>
              <Button
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="rounded-full border-2 px-3 border-[#243460]">
                  Next
                </span>
              </Button>
              <span>
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </span>
            </div>
          </div>
        </div>
        <Modal
        ariaHideApp={false}
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Hospital Approval"
          className="bg-white p-6 rounded-xl mt-16 justify-center items-center shadow-lg max-w-xl h-[400px] overflow-y-auto mx-auto"
        >
          <h2 className="text-xl font-bold mb-4">
            {currentAction === "approve" ? "Approve Hospital" : "Reject Hospital"}
          </h2>
          <textarea
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            className="w-full p-2 border rounded mb-4"
            rows={5}
            placeholder={
              currentAction === "approve"
                ? "Enter approval remarks (optional)"
                : "Please specify the reason for rejection"
            }
          ></textarea>
          {currentAction === "reject" && (
      <div className="mb-4 max-h-60 overflow-y-auto">
        <h3 className="font-semibold mb-2">Select Issues:</h3>
        <div className="grid grid-cols-1 gap-2">
          {issues.map((issue) => (
            <label key={issue} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedIssues.includes(issue)}
                onChange={() => toggleIssue(issue)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>{issue}</span>
            </label>
          ))}
        </div>
      </div>
    )}
          <div className="flex justify-end">
            <button
              onClick={closeModal}
              className="bg-gray-400 text-white px-4 py-2 rounded mr-2"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitRemark}
              className={`${currentAction === "approve" ? "bg-green-500" : "bg-red-500"
                } text-white px-4 py-2 rounded`}
              disabled={loading}
            >
              {loading ? (
                "Processing..."
              ) : currentAction === "approve" ? (
                "Confirm Approval"
              ) : (
                "Confirm Rejection"
              )}
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default AllHospitalsList;
