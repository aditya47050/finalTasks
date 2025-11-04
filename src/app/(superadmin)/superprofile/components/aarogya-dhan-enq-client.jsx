"use client";

import React, { useState, useMemo } from "react";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { format, isWithinInterval } from "date-fns";
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
  InputField,
  SelectField,
  DateFilter,
} from "@/app/components/input-selectui";
import HeadingClientMain from "@/app/components/heading";

const AarogyaDhanEnqClient = ({ enquiries }) => {
  const pageSize = 10;
  const [filters, setFilters] = useState({
    name: "",
    mobile: "",
    why: "",
    designation: "",
    cost: "",
    category: "",
    startDate: null,
    endDate: null,
  });

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Filtering Logic
  const filteredData = useMemo(() => {
    return enquiries.filter((item) => {
      const matchesName =
        !filters.name ||
        item.name.toLowerCase().includes(filters.name.toLowerCase());
      const matchesMobile =
        !filters.mobile || item.mobile.includes(filters.mobile);
      const matchesWhy =
        !filters.why ||
        item.why.toLowerCase().includes(filters.why.toLowerCase());
      const matchesCost =
        !filters.cost || item.cost.toLowerCase() === filters.cost.toLowerCase();
      const matchesDate =
        !filters.startDate || !filters.endDate
          ? true
          : isWithinInterval(new Date(item.createdAt), {
              start: new Date(filters.startDate),
              end: new Date(filters.endDate),
            });

      return (
        matchesName && matchesMobile && matchesWhy && matchesCost && matchesDate
      );
    });
  }, [filters, enquiries]);
  const crowdfundingcategory = [
    { value: "", label: "All Reasons" },
    { value: "Help to NGO’s", label: "Help to NGO’s" },
    { value: "Child Health", label: "Child Health" },
    { value: "Emergency Help", label: "Emergency Help" },
    { value: "Medical Help", label: "Medical Help" },
    { value: "Cancer Care", label: "Cancer Care" },
    { value: "Transplant Surgery", label: "Transplant Surgery" },
    { value: "Personal Cause", label: "Personal Cause" },
  ];
  const columns = [
    {
      header: "S.No",
      accessorKey: "serialNo",
      cell: (info) => info.row.index + 1,
    },
    { accessorKey: "name", header: "Full Name" },
    { accessorKey: "why", header: "Why" },
    { accessorKey: "mobile", header: "Mobile" },
    { accessorKey: "cost", header: "Cost" },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) =>
        format(new Date(row.original.createdAt), "yyyy-MM-dd HH:mm"),
    },
  ];

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
      <div className="overflow-x-auto xs:px-2 min-[1000px]:px-0 min-[1100px]:px-[32px] container mx-auto min-[1000px]:w-[700px] min-[1100px]:w-[900px] xl:w-[1100px] w-[350px] md:w-[700px] bg-white">
      <HeadingClientMain main="AarogyaDhan Enquiries" sub="Full Details" />

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
        <SelectField
          label="Why"
          id="why"
          value={filters.why}
          onChange={handleFilterChange}
          options={crowdfundingcategory}
        />{" "}
        <SelectField
          label="Cost"
          id="cost"
          value={filters.cost}
          onChange={handleFilterChange}
          options={[
            { value: "", label: "All Costs" },
            { value: "1 Lakh to 2 Lakh", label: "1 Lakh to 2 Lakh" },
            { value: "2 Lakh to 3 Lakh", label: "2 Lakh to 3 Lakh" },
            { value: "3 Lakh to 5 Lakh", label: "3 Lakh to 5 Lakh" },
            { value: "5 Lakh to 8 Lakh", label: "5 Lakh to 8 Lakh" },
            { value: "8 Lakh to 10 Lakh", label: "8 Lakh to 10 Lakh" },
            { value: "10 Lakh to 15 Lakh", label: "10 Lakh to 15 Lakh" },

            { value: "15 Lakh to 20 Lakh", label: "15 Lakh to 20 Lakh" },

            { value: "20 Lakh to 25 Lakh", label: "20 Lakh to 25 Lakh" },
            { value: "25 Lakh to 30 Lakh", label: "25 Lakh to 30 Lakh" },
            { value: "30 Lakh Above", label: "30 Lakh Above" },
          ]}
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
              <TableRow key={headerGroup.id}
              className="bg-gray-100 hover:bg-gray-100">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="border border-gray-200 py-4 px-6 text-left font-semibold text-gray-900 whitespace-nowrap">
                    {flexRender(
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
  );
};

export default AarogyaDhanEnqClient;
