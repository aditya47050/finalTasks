"use client";
import * as XLSX from "xlsx";
import React, { useMemo, useState, useEffect } from "react";
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
import CorporateAnalytics from "./graph";

const CorporateOverviewClient = ({ userdata }) => {
  const pageSize = 10;

  const [filters, setFilters] = useState({
    companyName: "",
    email: "",
    mobile: "",
    pincode: "",
    companyType: "",
    city: "",
    state: "",
    district: "",
    taluka: "",
    approvalStatus: "",
    createdAtFrom: "",
    createdAtTo: "",
    updatedAtFrom: "",
    updatedAtTo: "",
  });

  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize });
  const [debouncedFilters, setDebouncedFilters] = useState(filters);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedFilters(filters), 300);
    return () => clearTimeout(t);
  }, [filters]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString() : "N/A");

  const filteredData = useMemo(() => {
    return userdata.filter((c) => {
      const createdAtDate = c.createdAt ? new Date(c.createdAt) : null;
      const updatedAtDate = c.updatedAt ? new Date(c.updatedAt) : null;

      const createdAtFromDate = filters.createdAtFrom ? new Date(filters.createdAtFrom) : null;
      const createdAtToDate = filters.createdAtTo ? new Date(filters.createdAtTo) : null;
      const updatedAtFromDate = filters.updatedAtFrom ? new Date(filters.updatedAtFrom) : null;
      const updatedAtToDate = filters.updatedAtTo ? new Date(filters.updatedAtTo) : null;

      return (
        (!filters.companyName || (c.companyName || "").toLowerCase().includes(filters.companyName.toLowerCase())) &&
        (!filters.email || (c.email || "").toLowerCase().includes(filters.email.toLowerCase())) &&
        (!filters.mobile || (c.mobile || "").includes(filters.mobile)) &&
        (!filters.pincode || (c.pincode || "") === filters.pincode) &&
        (!filters.companyType || (c.companyType || "").toLowerCase() === filters.companyType.toLowerCase()) &&
        (!filters.city || (c.city || "").toLowerCase().includes(filters.city.toLowerCase())) &&
        (!filters.state || (c.state || "").toLowerCase().includes(filters.state.toLowerCase())) &&
        (!filters.district || (c.district || "").toLowerCase().includes(filters.district.toLowerCase())) &&
        (!filters.taluka || (c.taluka || "").toLowerCase().includes(filters.taluka.toLowerCase())) &&
        (!filters.approvalStatus ||
          c.CorporateCertificate?.some((cert) => cert.approvalStatus === filters.approvalStatus)) &&
        (!createdAtFromDate || (createdAtDate && createdAtDate >= createdAtFromDate)) &&
        (!createdAtToDate || (createdAtDate && createdAtDate <= createdAtToDate)) &&
        (!updatedAtFromDate || (updatedAtDate && updatedAtDate >= updatedAtFromDate)) &&
        (!updatedAtToDate || (updatedAtDate && updatedAtDate <= updatedAtToDate))
      );
    });
  }, [filters, userdata]);

  const viewProfile = (id) => {
    window.location.href = `/superprofile/corporate/${id}`;
  };

  const columns = useMemo(
    () => [
      { accessorKey: "companyName", header: "Company" },
      { accessorKey: "email", header: "Email" },
      { accessorKey: "mobile", header: "Mobile" },
      { accessorKey: "city", header: "City" },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = (row.original.CorporateCertificate?.[0]?.approvalStatus || "PENDING").toLowerCase();
          return (
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                status === "approved"
                  ? "bg-emerald-100 text-emerald-800"
                  : status === "rejected"
                  ? "bg-rose-100 text-rose-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {status}
            </span>
          );
        },
      },
      {
        accessorKey: "id",
        header: "Full Details",
        cell: ({ row }) => (
          <Button
            className="px-2 py-1 border border-blue-500 text-blue-500 font-semibold rounded-full hover:bg-blue-500 hover:text-white"
            onClick={() => viewProfile(row.getValue("id"))}
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
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    manualPagination: false,
  });

  const toggleFilters = () => setShowFilters((p) => !p);

  const exportToExcel = (rows) => {
    if (!Array.isArray(rows) || rows.length === 0) return;
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Corporates");
    XLSX.writeFile(wb, "Corporates.xlsx");
  };

  return (
    <div className="md:container shadow-xl mx-auto font-poppins">
      <div className="overflow-x-auto xs:px-2 min-[1100px]:px-[32px] container mx-auto w-full bg-white">
        <div className="text-center py-4">
          <h1 className="text-2xl font-bold text-indigo-600">All Corporates Overview</h1>
        </div>

        <div className="flex justify-end gap-2 my-4 items-end">
          <button
            onClick={toggleFilters}
            className="bg-blue-500 rounded-xl text-white px-4 py-2 hover:bg-blue-600 transition"
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
          <button
            onClick={() => exportToExcel(filteredData)}
            className="bg-green-500 rounded-xl text-white px-4 py-2 hover:bg-green-600 transition"
          >
            Export to Excel
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <InputField label="Company" id="companyName" type="text" value={filters.companyName} onChange={handleFilterChange} />
            <InputField label="Email" id="email" type="email" value={filters.email} onChange={handleFilterChange} />
            <InputField label="Mobile" id="mobile" type="text" value={filters.mobile} onChange={handleFilterChange} />
            <InputField label="Pincode" id="pincode" type="text" value={filters.pincode} onChange={handleFilterChange} />
            <InputField label="City" id="city" type="text" value={filters.city} onChange={handleFilterChange} />
            <InputField label="State" id="state" type="text" value={filters.state} onChange={handleFilterChange} />
            <InputField label="District" id="district" type="text" value={filters.district} onChange={handleFilterChange} />
            <InputField label="Taluka" id="taluka" type="text" value={filters.taluka} onChange={handleFilterChange} />
            <SelectField
              label="Company Type"
              id="companyType"
              value={filters.companyType}
              onChange={handleFilterChange}
              options={[
                { value: "", label: "All" },
                { value: "Public Limited", label: "Public Limited" },
                { value: "Private Limited", label: "Private Limited" },
                { value: "LLP", label: "LLP" },
                { value: "Partnership", label: "Partnership" },
                { value: "Sole Proprietorship", label: "Sole Proprietorship" },
                { value: "One Person Company", label: "One Person Company" },
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
            <DateFilter label="Created At From" id="createdAtFrom" selected={filters.createdAtFrom} onChange={handleFilterChange} />
            <DateFilter label="Created At To" id="createdAtTo" selected={filters.createdAtTo} onChange={handleFilterChange} />
          </div>
        )}

        <CorporateAnalytics userdata={filteredData} />

        <div className="overflow-x-auto bg-white p-4 rounded-xl shadow-lg">
          <Table id="dataTable">
            <TableHeader>
              <TableRow className="bg-gray-100 hover:bg-gray-100">
                {table.getHeaderGroups().map((hg) =>
                  hg.headers.map((h) => (
                    <TableHead key={h.id} className="border border-gray-200 py-4 px-6 text-left font-semibold text-gray-900 whitespace-nowrap">
                      {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                    </TableHead>
                  ))
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  className={`transition-colors duration-150 ease-in-out hover:bg-gray-50/50 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50/20"
                  } border-[1px] border-gray-100`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="border-[1px] border-gray-200 py-4 px-6 text-sm whitespace-nowrap max-w-max hover:bg-gray-100"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex justify-between items-center py-4">
            <Button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
              Previous
            </Button>
            <span>
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
            <Button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CorporateOverviewClient;