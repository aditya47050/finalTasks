"use client";
import * as XLSX from "xlsx";
import React, { useState, useMemo, useEffect } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
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
import PatientGraph from "../../components/patientgraph";

const FiltersWithGraphClient = ({ userdata }) => {
  const pageSize = 10; // Number of rows per page
  const [filters, setFilters] = useState({
    name: "",
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
    createdAtFrom:"",
    createdAtTo:"",
    updatedAtFrom:"",
    updatedAtTo:""
  });

  const [debouncedFilters, setDebouncedFilters] = useState(filters);

  // Debounce filter updates
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 300); // 300ms debounce delay
    return () => clearTimeout(handler);
  }, [filters]);

  // Calculate age from Date of Birth
  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };
  const filteredData = useMemo(() => {
    return userdata.filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      const age = calculateAge(user.dateOfBirth);
  
      // Ensure user createdAt and updatedAt are converted into Date objects
      const createdAtDate = user.createdAt ? new Date(user.createdAt) : null;
      const updatedAtDate = user.updatedAt ? new Date(user.updatedAt) : null;
  
      // Convert filters to Date objects only if they exist
      const createdAtFromDate = filters.createdAtFrom ? new Date(filters.createdAtFrom) : null;
      const createdAtToDate = filters.createdAtTo ? new Date(filters.createdAtTo) : null;
      const updatedAtFromDate = filters.updatedAtFrom ? new Date(filters.updatedAtFrom) : null;
      const updatedAtToDate = filters.updatedAtTo ? new Date(filters.updatedAtTo) : null;
  
      return (
        (!filters.name || fullName.includes(filters.name.toLowerCase())) &&
        (!filters.email || user.email?.toLowerCase().includes(filters.email.toLowerCase())) &&
        (!filters.mobile || user.mobile.includes(filters.mobile)) &&
        (!filters.gender || user.gender?.toLowerCase() === filters.gender.toLowerCase()) &&
        (!filters.bloodgroup || user.bloodgroup?.toLowerCase() === filters.bloodgroup.toLowerCase()) &&
        (!filters.pincode || user.pincode === filters.pincode) &&
        (!filters.minAge || age >= parseInt(filters.minAge)) &&
        (!filters.maxAge || age <= parseInt(filters.maxAge)) &&
        (!filters.maritalStatus || user.maritalStatus?.toLowerCase() === filters.maritalStatus.toLowerCase()) &&
        (!filters.religion || user.religion?.toLowerCase() === filters.religion.toLowerCase()) &&
        (!filters.city || user.city?.toLowerCase().includes(filters.city.toLowerCase())) &&
        (!filters.state || user.state?.toLowerCase() === filters.state.toLowerCase()) &&
        (!filters.district || user.district?.toLowerCase() === filters.district.toLowerCase()) &&
        (!filters.taluka || user.taluka?.toLowerCase() === filters.taluka.toLowerCase()) &&
        (!filters.hasPanCard || user.hasPanCard?.toString() === filters.hasPanCard) &&
        (!filters.income || user.income?.toString() === filters.income) &&
        (!filters.healthInsurance || user.healthInsurance?.toString() === filters.healthInsurance) &&
        (!filters.abhacard || user.abhacard?.toString() === filters.abhacard) &&
        (!filters.ayushmancard || user.ayushmancard?.toString() === filters.ayushmancard) &&
        (!filters.rationcard || user.rationcard?.toString() === filters.rationcard) &&
        (!filters.organDonation || user.organDonation?.toString() === filters.organDonation) &&
        (!filters.isCompanyRegistered || user.isCompanyRegistered?.toString() === filters.isCompanyRegistered) &&
        (!filters.bankName || user.bankName?.toLowerCase().includes(filters.bankName.toLowerCase())) &&
        (!filters.accountType || user.accountType?.toLowerCase() === filters.accountType.toLowerCase()) &&
        (!filters.aadharCardNumber || user.aadharCardNumber?.toString().includes(filters.aadharCardNumber)) &&
        // CreatedAt Filters
        (!createdAtFromDate || (createdAtDate && createdAtDate >= createdAtFromDate)) &&
        (!createdAtToDate || (createdAtDate && createdAtDate <= createdAtToDate)) &&
        // UpdatedAt Filters
        (!updatedAtFromDate || (updatedAtDate && updatedAtDate >= updatedAtFromDate)) &&
        (!updatedAtToDate || (updatedAtDate && updatedAtDate <= updatedAtToDate))
      );
    });
  }, [filters, userdata]);
  
  
  

  const columns = useMemo(
    () => [
      {
        accessorKey: "firstName",
        header: "First Name",
      },
      {
        accessorKey: "lastName",
        header: "Last Name",
      },
      {
        accessorKey: "gender",
        header: "Gender",
      },
      {
        accessorKey: "dateOfBirth",
        header: "Date of Birth",
        cell: ({ row }) =>
          new Date(row.getValue("dateOfBirth")).toLocaleDateString(),
      },
      {
        accessorKey: "mobile",
        header: "Mobile Number",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "city",
        header: "City",
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
    ],
    []
  );
 const handleExportToExcel = () => {
      const ws = XLSX.utils.json_to_sheet(filteredData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Patient Data");
      XLSX.writeFile(wb, "healthcard_data.xlsx");
    };
  const handleViewProfile = (id) => {
    window.location.href = `/superprofile/patient/${id}`;
  };

  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: pageSize,
  });

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,

    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      pagination,
    },
  });

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value, // Update the correct field dynamically
    }));
  };
  
  const [showFilters, setShowFilters] = useState(false);
  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  return (
    <div className="md:container shadow-xl mx-auto font-poppins">
      <div className="overflow-x-auto xs:px-2 min-[1000px]:px-0 xs:w-screen min-[1100px]:px-[32px] container mx-auto min-[1000px]:w-[700px] min-[1100px]:w-[900px] xl:w-[1000px] xlg:w-[1200px] w-[350px] md:w-[700px] bg-white">
        <div className="text-center py-4">
          <h1 className="text-2xl font-bold text-blue-500">All Patients List</h1>
        </div>
        <div className="flex justify-end gap-2 my-4 items-end">
          <button
            onClick={toggleFilters}
            className="bg-blue-500 rounded-xl text-white px-4 py-2  focus:outline-none hover:bg-blue-600 transition"
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>

          <button
            onClick={handleExportToExcel}
            className="bg-green-400 rounded-xl text-white px-4 py-2  focus:outline-none hover:bg-green-400 transition"
          >
            Export to Excel
          </button>
        </div>

        {/* Filter Section */}
        {showFilters && (
          <div className="bg-white rounded-xl px-6 pb-6 mb-4">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">
              Filter Data
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {/* Name */}
              <InputField
                label="Name"
                id="name"
                placeholder="Search by Name"
                value={filters.name}
                onChange={handleFilterChange}
              />

              {/* Email */}
              <InputField
                label="Email"
                id="email"
                placeholder="Search by Email"
                value={filters.email}
                onChange={handleFilterChange}
              />

              {/* Mobile */}
              <InputField
                label="Mobile"
                id="mobile"
                placeholder="Search by Mobile"
                value={filters.mobile}
                onChange={handleFilterChange}
              />

              {/* Pincode */}
              <InputField
                label="Pincode"
                id="pincode"
                placeholder="Enter Pincode"
                value={filters.pincode}
                onChange={handleFilterChange}
              />

              {/* Aadhar Card Number */}
              <InputField
                label="Aadhar Card No"
                id="aadharCardNumber"
                placeholder="Enter Aadhar Number"
                value={filters.aadharCardNumber}
                onChange={handleFilterChange}
              />

              {/* Gender */}
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

              {/* Blood Group */}
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

              {/* Religion */}
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

              {/* Min Age */}
              <InputField
                label="Min Age"
                id="minAge"
                type="number"
                placeholder="Min Age"
                value={filters.minAge}
                onChange={handleFilterChange}
              />

              {/* Max Age */}
              <InputField
                label="Max Age"
                id="maxAge"
                type="number"
                placeholder="Max Age"
                value={filters.maxAge}
                onChange={handleFilterChange}
              />

              {/* Marital Status */}
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

              {/* City */}
              <InputField
                label="City"
                id="city"
                placeholder="City"
                value={filters.city}
                onChange={handleFilterChange}
              />

              {/* District */}
              <InputField
                label="District"
                id="district"
                placeholder="District"
                value={filters.district}
                onChange={handleFilterChange}
              />

              {/* Taluka */}
              <InputField
                label="Taluka"
                id="taluka"
                placeholder="Taluka"
                value={filters.taluka}
                onChange={handleFilterChange}
              />

              {/* State */}
              <InputField
                label="State"
                id="state"
                placeholder="State"
                value={filters.state}
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
              {/* Bank Name */}
              {/* Account Type */}
              <SelectField
                label="Bank Name"
                id="bankName"
                value={filters.bankName}
                onChange={handleFilterChange}
                options={[
                  { value: "", label: "All Banks" },
                  { value: "state_bank_of_india", label: "State Bank of India" },
                  { value: "bank_of_baroda", label: "Bank of Baroda" },
                  {
                    value: "punjab_national_bank",
                    label: "Punjab National Bank",
                  },
                  { value: "canara_bank", label: "Canara Bank" },
                  { value: "union_bank_of_india", label: "Union Bank of India" },
                  { value: "bank_of_india", label: "Bank of India" },
                  { value: "indian_bank", label: "Indian Bank" },
                  {
                    value: "central_bank_of_india",
                    label: "Central Bank of India",
                  },
                  {
                    value: "indian_overseas_bank",
                    label: "Indian Overseas Bank",
                  },
                  { value: "uco_bank", label: "UCO Bank" },
                  { value: "bank_of_maharashtra", label: "Bank of Maharashtra" },
                  { value: "punjab_and_sind_bank", label: "Punjab & Sind Bank" },
                  { value: "hdfc_bank", label: "HDFC Bank" },
                  { value: "icici_bank", label: "ICICI Bank" },
                  { value: "axis_bank", label: "Axis Bank" },
                  { value: "kotak_mahindra_bank", label: "Kotak Mahindra Bank" },
                  { value: "indusind_bank", label: "IndusInd Bank" },
                  { value: "yes_bank", label: "Yes Bank" },
                  { value: "federal_bank", label: "Federal Bank" },
                  { value: "idfc_first_bank", label: "IDFC First Bank" },
                  { value: "bandhan_bank", label: "Bandhan Bank" },
                  { value: "rbl_bank", label: "RBL Bank" },
                  { value: "citibank", label: "Citibank" },
                  {
                    value: "standard_chartered_bank",
                    label: "Standard Chartered Bank",
                  },
                  { value: "hsbc", label: "HSBC" },
                  { value: "deutsche_bank", label: "Deutsche Bank" },
                  { value: "dbs_bank", label: "DBS Bank" },
                  {
                    value: "andhra_pradesh_grameena_vikas_bank",
                    label: "Andhra Pradesh Grameena Vikas Bank",
                  },
                  { value: "baroda_up_bank", label: "Baroda UP Bank" },
                  { value: "kerala_gramin_bank", label: "Kerala Gramin Bank" },
                  {
                    value: "karnataka_gramin_bank",
                    label: "Karnataka Gramin Bank",
                  },
                  { value: "punjab_gramin_bank", label: "Punjab Gramin Bank" },
                ]}
              />
              {/* Account Type */}
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

              {/* Boolean Filters */}
              {[
                { label: "PAN Card", key: "hasPanCard" },
                { label: "Income Certificate", key: "income" },
                { label: "Health Insurance", key: "healthInsurance" },
                { label: "ABHA Card", key: "abhacard" },
                { label: "Ayushman Card", key: "ayushmancard" },
                { label: "Ration Card", key: "rationcard" },
                { label: "Organ Donation", key: "organDonation" },
                { label: "Company Registered", key: "isCompanyRegistered" },
              ].map(({ label, key }) => (
                <SelectField
                  key={key}
                  label={label}
                  id={key}
                  value={filters[key]}
                  onChange={handleFilterChange}
                  options={[
                    { value: "", label: "All" },
                    { value: "true", label: "Yes" },
                    { value: "false", label: "No" },
                  ]}
                />
              ))}
            </div>
          </div>
        )}
        <PatientGraph filteredData={filteredData} />
        {/* Table Section */}
        <div className="overflow-x-auto bg-white p-4 rounded-xl shadow-lg">
          <div className="">
            <Table id="dataTable">
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
                      className="text-center py-4"
                    >
                      No results found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex justify-between items-center py-4">
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
        </div>
      </div>
    </div>
  );
};

export default FiltersWithGraphClient;
