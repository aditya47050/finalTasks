"use client"; // Client-side component

import React, { useMemo, useState } from "react";
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
import * as XLSX from "xlsx"; // Import XLSX for exporting
import {
  DateFilter,
  InputField,
  SelectField,
} from "@/app/components/input-selectui";
import GraphComponent from "./graph";

const BookAmbulanceClient = ({ userdata }) => {
  const pageSize = 10;
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  // Handle filter changes
  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  // Filtered Data
  const filteredData = useMemo(() => {
    return userdata.filter((row) =>
      Object.entries(filters).every(([key, value]) => {
        if (!value) return true;

        if (["createdAt", "updatedAt", "dateOfBirth"].includes(key)) {
          const rowDate = new Date(row[key]);
          return rowDate >= new Date(value);
        }

        // Strict comparison for gender
        if (key === "gender") {
          return row[key] === value;
        }

        return String(row[key] || "")
          .toLowerCase()
          .includes(value.toLowerCase());
      })
    );
  }, [userdata, filters]);

  const columns = useMemo(
    () => [
      {
        header: "Ambulance Model",
        cell: ({ row }) => {
          const model = row.original?.ambulanceVaichicle?.ambulancemodel;
          return model || "N/A";
        },
      },
      { accessorKey: "ambulancetype", header: "Ambulance Type" },
      { accessorKey: "ambulancecategory", header: "Ambulance Category" },
      { accessorKey: "firstName", header: "First Name" },
      { accessorKey: "middleName", header: "Middle Name" },
      { accessorKey: "lastName", header: "Last Name" },
      {
        accessorKey: "dateOfBirth",
        header: "Date of Birth",
        cell: ({ row }) => (
          <div>
            {row.getValue("dateOfBirth")
              ? new Date(row.getValue("dateOfBirth")).toLocaleDateString()
              : "N/A"}
          </div>
        ),
      },
      {
        accessorKey: "gender",
        header: "Gender",
        cell: ({ row }) => row.getValue("gender") || "N/A",
      },
      { accessorKey: "aadharCardNumber", header: "Aadhar Card Number" },
      { accessorKey: "mobileNumber", header: "Mobile Number" },
      { accessorKey: "email", header: "Email" },


      
      {
        header: "Hospital Name",
        cell: ({ row }) => {
          const hospitalName =
            row.original?.ambulanceVaichicle?.ambulance?.AmbulanceHsp
              ?.hspregname;
          return hospitalName || "N/A";
        },
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => (
          <div>{new Date(row.getValue("createdAt")).toLocaleDateString()}</div>
        ),
      },
      {
        accessorKey: "updatedAt",
        header: "Updated At",
        cell: ({ row }) => (
          <div>{new Date(row.getValue("updatedAt")).toLocaleDateString()}</div>
        ),
      },
    ],
    []
  );

  // React Table configuration
  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // Export to Excel Function
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Ambulance Booking Data");
    XLSX.writeFile(wb, "ambulance_booking_data.xlsx");
  };

  return (
    <div className="container font-poppins mx-auto">
      <div className="text-center pt-4">
        <h1 className="text-[20px] text-[#2b73ec] font-extrabold">
          Book Ambulance
        </h1>
        <p className="text-[#243460] text-[11px]">Patient Details</p>
      </div>

      <div className="mx-auto w-full pt-4">
        <div className="overflow-x-auto container mx-auto lg:w-[900px] xl:w-[1200px] w-[350px] md:w-[700px] bg-white p-4 rounded-[15px] shadow-lg">
          {/* Toggle Filters Button */}
          <div className="flex justify-end gap-1 pb-4">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-blue-500 hover:bg-blue-600 rounded-xl text-white"
            >
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
            <Button
              onClick={exportToExcel}
              className="bg-green-500 hover:bg-green-600 rounded-xl text-white"
            >
              Export to Excel
            </Button>
          </div>

          {/* Filters Section */}
          {showFilters && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
              {columns.map((col, index) => {
                if (
                  ["createdAt", "updatedAt", "dateOfBirth"].includes(
                    col.accessorKey
                  )
                ) {
                  return (
                    <DateFilter
                      key={index}
                      label={col.header}
                      id={col.accessorKey}
                      selected={filters[col.accessorKey] || null}
                      onChange={handleFilterChange}
                    />
                  );
                } else if (col.accessorKey === "gender") {
                  return (
                    <SelectField
                      key={index}
                      label="Gender"
                      id="gender"
                      value={filters.gender || ""}
                      onChange={handleFilterChange}
                      options={[
                        { value: "", label: "All" },
                        { value: "male", label: "Male" },
                        { value: "female", label: "Female" },
                        { value: "other", label: "Other" },
                      ]}
                    />
                  );
                } else if (col.accessorKey === "ambulancecategory") {
                  return (
                    <SelectField
                      key={index}
                      label="Ambulance Category"
                      id="ambulancecategory"
                      value={filters.ambulancecategory || ""}
                      onChange={handleFilterChange}
                      options={[
                        { value: "", label: "Select Category" },
                        { value: "108 Ambulance", label: "108 Ambulance" },
                        {
                          value: "Private Ambulance",
                          label: "Private Ambulance",
                        },
                        {
                          value: "Hospital Ambulance",
                          label: "Hospital Ambulance",
                        },
                        {
                          value: "RED Health Ambulance",
                          label: "RED Health Ambulance",
                        },
                        {
                          value: "Medulance Ambulance",
                          label: "Medulance Ambulance",
                        },
                        {
                          value: "AmbiPalm Ambulance",
                          label: "AmbiPalm Ambulance",
                        },
                        {
                          value: "MedCap Ambulance",
                          label: "MedCap Ambulance",
                        },
                        {
                          value: "Ziqitza Ambulance",
                          label: "Ziqitza Ambulance",
                        },
                      ]}
                    />
                  );
                } else {
                  return (
                    <InputField
                      key={index}
                      label={col.header}
                      id={col.accessorKey}
                      placeholder={`Enter ${col.header}`}
                      value={filters[col.accessorKey] || ""}
                      onChange={handleFilterChange}
                    />
                  );
                }
              })}
            </div>
          )}
<GraphComponent userdata={filteredData}/>
          {/* Table Section */}
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="border">
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
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="border">
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

          {/* Pagination & Export */}
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

export default BookAmbulanceClient;
