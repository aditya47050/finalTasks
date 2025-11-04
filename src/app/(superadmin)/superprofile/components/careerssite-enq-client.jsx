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
import { format, isWithinInterval } from "date-fns";
import MultiSelectDropdown, {
  DateFilter,
  InputField,
  SelectField,
} from "@/app/components/input-selectui";
import HeadingClientMain from "@/app/components/heading";

// Sample Category Options
const categoryOptions = [
  { value: "", label: "All Categories" },
  { value: "Software Engineer", label: "Software Engineer" },
  { value: "Product Manager", label: "Product Manager" },
  { value: "UI/UX Designer", label: "UI/UX Designer" },
  { value: "HR Manager", label: "HR Manager" },
];

const CareersEnqClient = ({ careers }) => {
  const pageSize = 10;
  const [data, setData] = useState(careers);

  // Filters State
  const [filters, setFilters] = useState({
    fullname: "",
    email: "",
    mobile: "",
    category: "",
    startDate: null,
    endDate: null,
  });

  // Handle Filter Changes
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Filtering Logic
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesFullName = filters.fullname
        ? item.fullname?.toLowerCase().includes(filters.fullname.toLowerCase())
        : true;
      const matchesEmail = filters.email
        ? item.email?.toLowerCase().includes(filters.email.toLowerCase())
        : true;
      const matchesMobile = filters.mobile
        ? item.mobile?.includes(filters.mobile)
        : true;
      const matchesCategory = filters.category
        ? item.category?.toLowerCase() === filters.category.toLowerCase()
        : true;
      const matchesDate =
        !filters.startDate || !filters.endDate
          ? true
          : isWithinInterval(new Date(item.createdAt), {
              start: new Date(filters.startDate),
              end: new Date(filters.endDate),
            });

      return (
        matchesFullName &&
        matchesEmail &&
        matchesMobile &&
        matchesCategory &&
        matchesDate
      );
    });
  }, [data, filters]);
  const categoryOptions = [
    { value: "", label: "All Categories" },
    { value: "Consultant Doctor", label: "Consultant Doctor" },
    { value: "Super Consultant Doctor", label: "Super Consultant Doctor" },
    { value: "MBBS Doctor", label: "MBBS Doctor" },
    { value: "CMO Doctor", label: "CMO Doctor" },
    { value: "RMO Doctor", label: "RMO Doctor" },
    { value: "Nurse's & Brother's", label: "Nurse's & Brother's" },
    { value: "Pharmacist Staff", label: "Pharmacist Staff" },
    { value: "Fresher/Intern Staff", label: "Fresher/Intern Staff" },
    { value: "Administration Staff", label: "Administration Staff" },
    { value: "Human Resource", label: "Human Resource" },
    { value: "Radiology Technician", label: "Radiology Technician" },
    { value: "Pathology Technician", label: "Pathology Technician" },
    { value: "Healthcare Reception", label: "Healthcare Reception" },
    { value: "Insurance Coordinator", label: "Insurance Coordinator" },
    { value: "Senior Management Staff", label: "Senior Management Staff" },
    { value: "Marketing Staff", label: "Marketing Staff" },
    { value: "Ambulance Driver", label: "Ambulance Driver" },
    { value: "Healthcare Coordinator", label: "Healthcare Coordinator" },
    { value: "Housekeeping Staff", label: "Housekeeping Staff" },
    { value: "Security Staff", label: "Security Staff" },
    { value: "Accountant Staff", label: "Accountant Staff" },
  ];

  // Table Columns
  const columns = useMemo(
    () => [
      {
        header: "S.No",
        accessorKey: "serialNo",
        cell: (info) => info.row.index + 1,
      },
      { accessorKey: "fullname", header: "Full Name" },
      { accessorKey: "email", header: "Email" },
      { accessorKey: "mobile", header: "Mobile" },
      { accessorKey: "category", header: "Category" },
      {
        accessorKey: "cv",
        header: "CV",
        cell: ({ row }) =>
          row.original.cv ? (
            <a
              href={row.original.cv}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-indigo-500 hover:bg-indigo-500 rounded-xl text-white px-3 py-1 hover:text-white"
            >
              View CV
            </a>
          ) : (
            <span className="rounded-xl text-indigo-500 px-3 py-1">
              No CV Uploaded
            </span>
          ),
      },
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
      <div className="overflow-x-auto xs:px-2 min-[1000px]:px-0 min-[1100px]:px-[32px] container mx-auto min-[1000px]:w-[700px] min-[1100px]:w-[900px] xl:w-[1000px] xlg:w-[1200px] w-[350px] md:w-[700px] bg-white">
      {/* Header */}
      <HeadingClientMain main="Careers Portal" sub="Applicants Details" />

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        <InputField
          label="Full Name"
          id="fullname"
          placeholder="Enter Full Name"
          value={filters.fullname}
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
          label="Mobile"
          id="mobile"
          placeholder="Enter Mobile"
          value={filters.mobile}
          onChange={handleFilterChange}
        />
        <SelectField
          label="Category"
          id="category"
          value={filters.category}
          onChange={handleFilterChange}
          options={categoryOptions}
        />
        <DateFilter
          label="Start Date"
          id="startDate"
          selected={filters.startDate}
          onChange={handleFilterChange}
        />
        <DateFilter
          label="End Date"
          id="endDate"
          selected={filters.endDate}
          onChange={handleFilterChange}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white p-4 rounded-xl shadow-lg">
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
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
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
  );
};

export default CareersEnqClient;
