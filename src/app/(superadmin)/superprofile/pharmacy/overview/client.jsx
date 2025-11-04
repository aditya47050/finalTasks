"use client";
import * as XLSX from "xlsx";
import React, { useState, useMemo, useEffect } from "react";
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
import PharmacyAnalytics from "./graph";

const PharmacyAnalyticsgraph = ({ userdata }) => {
  const pageSize = 10;

  const [filters, setFilters] = useState({
    // Pharmacy Model Filters
    regname: "",
    email: "",
    mobile: "",
    pincode: "",
    pharmacytype: "",
    city: "",
    state: "",
    district: "",
    taluka: "",
    onlineplotformservice: "",
    homedelivery: "",
    TotalregPharmacist: "",
    bankName: "",
    accountType: "",

    // Pharmacy Certificate Filters
    approvalStatus: "", // pending, approved, rejected
    approvedBy: "",
    remarks: "",

    // Date Filters
    createdAtFrom: "",
    createdAtTo: "",
    updatedAtFrom: "",
    updatedAtTo: "",
  });

  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: pageSize,
  });

  const [debouncedFilters, setDebouncedFilters] = useState(filters);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 300);
    return () => clearTimeout(handler);
  }, [filters]);

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  const filteredData = useMemo(() => {
    return userdata.filter((pharmacy) => {
      const createdAtDate = pharmacy.createdAt
        ? new Date(pharmacy.createdAt)
        : null;
      const updatedAtDate = pharmacy.updatedAt
        ? new Date(pharmacy.updatedAt)
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
        // Pharmacy Filters
        (!filters.regname ||
          pharmacy.regname
            ?.toLowerCase()
            .includes(filters.regname.toLowerCase())) &&
        (!filters.email ||
          pharmacy.email?.toLowerCase().includes(filters.email.toLowerCase())) &&
        (!filters.mobile || pharmacy.mobile?.includes(filters.mobile)) &&
        (!filters.pincode || pharmacy.pincode === filters.pincode) &&
        (!filters.pharmacytype ||
          pharmacy.pharmacytype?.toLowerCase() === filters.pharmacytype.toLowerCase()) &&
        (!filters.city ||
          pharmacy.city
            ?.toLowerCase()
            .includes(filters.city.toLowerCase())) &&
        (!filters.state ||
          pharmacy.state
            ?.toLowerCase()
            .includes(filters.state.toLowerCase())) &&
        (!filters.district ||
          pharmacy.district
            ?.toLowerCase()
            .includes(filters.district.toLowerCase())) &&
        (!filters.taluka ||
          pharmacy.taluka
            ?.toLowerCase()
            .includes(filters.taluka.toLowerCase())) &&
        (!filters.onlineplotformservice ||
          pharmacy.onlineplotformservice === (filters.onlineplotformservice === "yes")) &&
        (!filters.homedelivery ||
          pharmacy.homedelivery === (filters.homedelivery === "yes")) &&
        (!filters.TotalregPharmacist ||
          pharmacy.TotalregPharmacist?.includes(filters.TotalregPharmacist)) &&
        (!filters.bankName ||
          pharmacy.bankName
            ?.toLowerCase()
            .includes(filters.bankName.toLowerCase())) &&
        (!filters.accountType ||
          pharmacy.accountType?.toLowerCase() === filters.accountType.toLowerCase()) &&
        // Pharmacy Certificate Filters
        (!filters.approvalStatus ||
          pharmacy.PharmacyCertificate?.some(
            (cert) => cert.approvalStatus === filters.approvalStatus
          )) &&
        (!filters.approvedBy ||
          pharmacy.PharmacyCertificate?.approvedBy === filters.approvedBy) &&
        (!filters.remarks ||
          pharmacy.PharmacyCertificate?.remarks
            ?.toLowerCase()
            .includes(filters.remarks.toLowerCase())) &&
        // Date Filters
        (!createdAtFromDate ||
          (createdAtDate && createdAtDate >= createdAtFromDate)) &&
        (!createdAtToDate ||
          (createdAtDate && createdAtDate <= createdAtToDate)) &&
        (!updatedAtFromDate ||
          (updatedAtDate && updatedAtDate >= updatedAtFromDate)) &&
        (!updatedAtToDate ||
          (updatedAtDate && updatedAtDate <= updatedAtToDate))
      );
    });
  }, [filters, userdata]);

  const handleFilterChange = (field, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value,
    }));
  };

  const handleViewProfile = (id) => {
    window.location.href = `/superprofile/pharmacy/${id}`;
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "regname",
        header: "Pharmacy Name",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "mobile",
        header: "Mobile",
      },
      {
        accessorKey: "pharmacytype",
        header: "Pharmacy Type",
      },
      {
        accessorKey: "city",
        header: "City",
      },
      {
        accessorKey: "state",
        header: "State",
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

  const [showFilters, setShowFilters] = useState(false);
  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  const handleExportToExcel = (userdata) => {
    if (!Array.isArray(userdata) || userdata.length === 0) {
      console.error("No valid data available to export.");
      return;
    }

    try {
      const ws = XLSX.utils.json_to_sheet(userdata);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Pharmacy Data");
      XLSX.writeFile(wb, "Pharmaciesdata.xlsx");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
    }
  };

  return (
    <div className="md:container shadow-xl mx-auto font-poppins">
      <div className="overflow-x-auto xs:px-2 min-[1000px]:px-0 xs:w-full min-[1100px]:px-[32px] container mx-auto min-[1000px]:w-[700px] min-[1100px]:w-[900px] xl:w-[1000px] xlg:w-[1200px] w-[350px] md:w-[700px] bg-white">
        <div className="text-center py-4">
          <h1 className="text-2xl font-bold text-green-500">All Pharmacies List</h1>
        </div>
        <div className="flex justify-end gap-2 my-4 items-end">
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
        
        {/* Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <InputField
              label="Pharmacy Name"
              id="regname"
              type="text"
              placeholder="Pharmacy Name"
              value={filters.regname}
              onChange={handleFilterChange}
            />
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
            <SelectField
              label="Pharmacy Type"
              id="pharmacytype"
              value={filters.pharmacytype}
              onChange={handleFilterChange}
              options={[
                { value: "", label: "All" },
                { value: "Hospital", label: "Hospital" },
                { value: "Clinical", label: "Clinical" },
                { value: "Regulatory Pharmacy", label: "Regulatory Pharmacy" },
              ]}
            />
            <InputField
              label="City"
              id="city"
              type="text"
              placeholder="City"
              value={filters.city}
              onChange={handleFilterChange}
            />
            <InputField
              label="State"
              id="state"
              type="text"
              placeholder="State"
              value={filters.state}
              onChange={handleFilterChange}
            />
            <InputField
              label="District"
              id="district"
              type="text"
              placeholder="District"
              value={filters.district}
              onChange={handleFilterChange}
            />
            <InputField
              label="Taluka"
              id="taluka"
              type="text"
              placeholder="Taluka"
              value={filters.taluka}
              onChange={handleFilterChange}
            />
            <SelectField
              label="Online Platform Service"
              id="onlineplotformservice"
              value={filters.onlineplotformservice}
              onChange={handleFilterChange}
              options={[
                { value: "", label: "All" },
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
              ]}
            />
            <SelectField
              label="Home Delivery"
              id="homedelivery"
              value={filters.homedelivery}
              onChange={handleFilterChange}
              options={[
                { value: "", label: "All" },
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
              ]}
            />
            <SelectField
              label="Approval Status"
              id="approvalStatus"
              value={filters.approvalStatus}
              onChange={handleFilterChange}
              options={[
                { value: "", label: "All" },
                { value: "PENDING", label: "Pending" },
                { value: "APPROVED", label: "Approved" },
                { value: "REJECTED", label: "Rejected" },
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
          </div>
        )}
        
        <PharmacyAnalytics userdata={filteredData}/>
        
        {/* Table */}
        <div className="overflow-x-auto bg-white p-4 rounded-xl shadow-lg">
          <div className="">
            <Table id="dataTable">
              <TableHeader>
                <TableRow className="bg-gray-100 hover:bg-gray-100">
                  {columns.map((col) => (
                    <TableHead key={col.accessorKey}>
                      <button
                        onClick={() =>
                          table.getColumn(col.accessorKey)?.toggleSorting()
                        }
                        className="border border-gray-200 py-4 px-6 text-left font-semibold text-gray-900 whitespace-nowrap">
                        {col.header}
                      </button>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map((row,index) => (
                  <TableRow key={row.id} className={`
                        transition-colors duration-150 ease-in-out
                        hover:bg-gray-50/50 
                        ${index % 2 === 0 ? "bg-white" : "bg-gray-50/20"}
                        border-[1px] border-gray-100
                      `}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="border-[1px] border-gray-200 py-4 px-6 text-sm whitespace-nowrap max-w-max hover:bg-gray-100">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination Controls */}
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

export default PharmacyAnalyticsgraph;