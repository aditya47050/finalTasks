"use client";

import React, { useState, useMemo } from "react";
import {
  ColumnDef,
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
import Image from "next/image";
import { format, isWithinInterval } from "date-fns";
import MultiSelectDropdown, {
  DateFilter,
  InputField,
  SelectField,
} from "@/app/components/input-selectui";
import HeadingClientMain from "@/app/components/heading";

// Modal Component for Document Preview
const Modal = ({ imageUrl, onClose }) => {
  if (!imageUrl) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div className="bg-white p-4 rounded-xl shadow-lg relative">
        <button
          className="absolute top-2 right-2 text-black text-2xl"
          onClick={onClose}
        >
          &times;
        </button>
        <Image
          src={imageUrl}
          width={400}
          height={400}
          alt="Document"
          className="max-w-full max-h-[80vh]"
        />
      </div>
    </div>
  );
};

const HSPPortalClient = ({ enquiries }) => {
  const pageSize = 10;
  const [data, setData] = useState(enquiries);

  // Filters State
  const [filters, setFilters] = useState({
    name: "",
    mobile: "",
    email: "",
    gender: "",
    designation: "",
    category: "",
    startDate: null,
    endDate: null,
  });

  const categoryOptions = [
    { value: "", label: "All Categories" },
    { value: "Road OR Air Ambulance Support", label: "Road OR Air Ambulance Support" },
    { value: "HSP All Types of License Support", label: "HSP All Types of License Support" },
    { value: "Free OPD & IPD Patients Leads", label: "Free OPD & IPD Patients Leads" },
    { value: "All Types of Teleradiology", label: "All Types of Teleradiology" },
    { value: "Govt & Pvt Insurance Help", label: "Govt & Pvt Insurance Help" },
    { value: "Health Equipment & Pharma Suppliers", label: "Health Equipment & Pharma Suppliers" },
    { value: "Digital Health Record OR OPD ISO:27001 Support", label: "Digital Health Record OR OPD ISO:27001 Support" },
    { value: "Health Medical Tourism Support", label: "Health Medical Tourism Support" },
    { value: "Entire HR Support for HSP", label: "Entire HR Support for HSP" },
    { value: "New HSP Project Plan & Support", label: "New HSP Project Plan & Support" },
  ];

  const handleFilterChange = (key, value) => {
    console.log(`Filter Change - ${key}:`, value); // Debugging log
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Filtering Logic
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesName = filters.name
        ? item.name?.toLowerCase().includes(filters.name.toLowerCase())
        : true;
      const matchesMobile = filters.mobile
        ? item.mobile?.includes(filters.mobile)
        : true;
      const matchesEmail = filters.email
        ? item.email?.toLowerCase().includes(filters.email.toLowerCase())
        : true;
      const matchesDesignation = filters.designation
        ? item.designation?.toLowerCase().includes(filters.designation.toLowerCase())
        : true;
      const matchesGender = filters.gender
        ? item.gender?.toLowerCase() === filters.gender.toLowerCase()
        : true;
      const matchesCategory =
        filters.category && filters.category.trim() !== ""
          ? item.category
              ?.trim()
              .localeCompare(filters.category.trim(), undefined, {
                sensitivity: "base",
              }) === 0
          : true;

      const matchesDate =
        !filters.startDate || !filters.endDate
          ? true
          : isWithinInterval(new Date(item.createdAt), {
              start: new Date(filters.startDate),
              end: new Date(filters.endDate),
            });

      return (
        matchesName &&
        matchesMobile &&
        matchesEmail &&
        matchesDesignation &&
        matchesGender &&
        matchesCategory &&
        matchesDate
      );
    });
  }, [data, filters]);

  // Table Columns
  const columns = useMemo(
    () => [
      {
        header: "S.No",
        accessorKey: "serialNo",
        cell: (info) => info.row.index + 1,
      },
      { accessorKey: "name", header: "Full Name" },
      { accessorKey: "email", header: "Email" },
      { accessorKey: "mobile", header: "Mobile" },
      { accessorKey: "category", header: "Category" },
      { accessorKey: "designation", header: "Designation" },
      { accessorKey: "gender", header: "Gender" },
      {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) =>
          format(new Date(row.original.createdAt), "yyyy-MM-dd HH:mm"),
      },
    ],
    []
  );

  // Pagination State
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: pageSize,
  });

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { pagination },
  });

  return (
    <div className="md:container font-poppins mx-auto">
      <div className="overflow-x-auto xs:px-0 min-[1000px]:px-0 min-[1100px]:px-[32px] container mx-auto min-[1000px]:w-[700px] min-[1100px]:w-[900px] xl:w-[1100px] w-[350px] md:w-[700px] bg-white">
      {/* Header */}
      <HeadingClientMain main="HSP Portal Enquiries" sub="Full Details" />

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        <InputField
          label="Name"
          id="name"
          placeholder="Enter Name"
          value={filters.name}
          onChange={handleFilterChange}
        />
        <InputField
          label="Mobile"
          id="mobile"
          placeholder="Enter Mobile"
          value={filters.mobile}
          onChange={handleFilterChange}
        />
        <InputField
          label="Email"
          id="email"
          placeholder="Enter Email"
          value={filters.email}
          onChange={handleFilterChange}
        />
        <InputField
          label="Designation"
          id="designation"
          placeholder="Enter Designation"
          value={filters.designation}
          onChange={handleFilterChange}
        />
        <SelectField
          label="Gender"
          id="gender"
          value={filters.gender}
          onChange={handleFilterChange}
          options={[
            { value: "", label: "All Genders" },
            { value: "Male", label: "Male" },
            { value: "Female", label: "Female" },
            { value: "Other", label: "Other" },
          ]}
        />
        <SelectField
          label="Category"
          id="category"
          value={filters.category}
          onChange={handleFilterChange}
          options={categoryOptions}
        />
        <DateFilter label="Start Date" id="startDate" selected={filters.startDate} onChange={handleFilterChange} />
        <DateFilter label="End Date" id="endDate" selected={filters.endDate} onChange={handleFilterChange} />
      </div>
      {/* Table */}
      <div className="lg:w-full  overflow-auto md:w-[700px]  p-4">
        <div className="">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}
                className="bg-gray-100 hover:bg-gray-100">
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
                  <TableRow key={row.id}
                  className={`
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
                    No results.
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
            <span>
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </span>
            <Button
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="rounded-full border-2 px-3 border-[#243460]">
                Next
              </span>
            </Button>
            
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default HSPPortalClient;
