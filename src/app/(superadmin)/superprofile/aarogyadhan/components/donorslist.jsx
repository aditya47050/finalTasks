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
} from "@/app/components/input-selectui";
import Image from "next/image";
import HeadingClientMain from "@/app/components/heading";
const Alldonorslist = ({ donorData }) => {
  const pageSize = 20;

  const [filters, setFilters] = useState({
    email: "",
    mobile: "",
    pincode: "",
    city: "",
    createdAtFrom: "",
    createdAtTo: "",
    updatedAtFrom: "",
    updatedAtTo: "",
    fullname: "",
  });

  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: pageSize,
  });

  const filteredData = useMemo(() => {
    return donorData.filter((donor) => {
      const createdAtDate = donor.createdAt ? new Date(donor.createdAt) : null;
      const updatedAtDate = donor.updatedAt ? new Date(donor.updatedAt) : null;

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
          (donor.email &&
            donor.email.toLowerCase().includes(filters.email.toLowerCase()))) &&
        (!filters.mobile || donor.mobile.includes(filters.mobile)) &&
        (!filters.pincode || donor.pincode === filters.pincode) &&
        (!filters.city ||
          (donor.city &&
            donor.city.toLowerCase().includes(filters.city.toLowerCase()))) &&
        (!filters.fullname ||
          (donor.fullname &&
            donor.fullname
              .toLowerCase()
              .includes(filters.fullname.toLowerCase()))) &&
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
  }, [filters, donorData]);

  const handleFilterChange = (field, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value,
    }));
  };

  const handleViewProfile = (id) => {
    window.location.href = `/superprofile/aarogyadhan/donors/${id}`;
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "fullname",
        header: "Full Name",
      },
      { accessorKey: "email", header: "Email" },
      { accessorKey: "mobile", header: "Mobile" },
      { accessorKey: "pincode", header: "Pincode" },
      { accessorKey: "city", header: "City" },
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

  const handleExportToExcel = (donorData) => {
    if (!Array.isArray(donorData) || donorData.length === 0) {
      console.error("No valid data available to export.");
      return;
    }

    try {
      const ws = XLSX.utils.json_to_sheet(donorData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Donor Data");
      XLSX.writeFile(wb, "DonorsData.xlsx");
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
        <HeadingClientMain main={"All Donor List"} />
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
            <InputField
              label="City"
              id="city"
              type="text"
              placeholder="City"
              value={filters.city}
              onChange={handleFilterChange}
            />
            <InputField
              label="Full Name"
              id="fullname"
              type="text"
              placeholder="Full Name"
              value={filters.fullname}
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

export default Alldonorslist;