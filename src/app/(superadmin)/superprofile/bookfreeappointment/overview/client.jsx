"use client"; // Ensure it's a client component

import React, { useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import Date Picker styles
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
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
import * as XLSX from "xlsx"; // For exporting to Excel
import GraphicalRepresentation from "../../components/graph-bookfreeappointment";
import {
  DateFilter,
  InputField,
  SelectField,
} from "@/app/components/input-selectui";

const BookfreeappointmentwithGraph = ({ userdata, categorytitle, doctortype}) => {
 
  const pageSize = 10;
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false); // Toggle Filters

  // Function to handle filter change
  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  // Filtering Logic (Handles Text & Date Filtering)
  const filteredData = useMemo(() => {
    return userdata.filter((row) => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;

        if (
          key === "createdAt" ||
          key === "updatedAt" ||
          key === "dateOfBirth"
        ) {
          const rowDate = new Date(row[key]);
          return rowDate.toDateString() === new Date(value).toDateString();
        }

        if (key === "gender") {
          return row.gender === value; // Exact match for gender selection
        }

        if (key === "category") {
          return row.category?.title
            ?.toLowerCase()
            .includes(value.toLowerCase());
        }

        return String(row[key] || "")
          .toLowerCase()
          .includes(value.toLowerCase());
      });
    });
  }, [userdata, filters]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "patient",
        header: () => <div>Patient</div>,
        cell: ({ row }) => {
          const patient = row.original.patient;
          return patient ? (
            <a
              href={`/superprofile/patient/${patient.id}`}
              className="text-blue-500 underline "
            >
              View Patient
            </a>
          ) : (
            <div>No Patient</div>
          );
        },
      },
      { accessorKey: "firstName", header: "First Name" },
      { accessorKey: "middleName", header: "Middle Name" },
      { accessorKey: "lastName", header: "Last Name" },
      { accessorKey: "mobileNumber", header: "Mobile Number" },
      { accessorKey: "email", header: "Email" },
      { accessorKey: "aadharCardNumber", header: "Aadhar Card Number" },
      { accessorKey: "city", header: "City" },
      { accessorKey: "pinCode", header: "Pin Code" },
      { accessorKey: "gender", header: "Gender" },
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
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => {
          const categoryTitle = row.original.category?.title || "N/A"; // Ensure safe access
          return <div>{categoryTitle}</div>;
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
    [categorytitle]
  );

  // Table Config
  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // Function to Export Data to Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Patients Data");
    XLSX.writeFile(wb, "FreeAppointment_data.xlsx");
  };

  return (
    <div className="md:container shadow-xl mx-auto font-poppins">
      <div className="overflow-x-auto xs:px-2 min-[1000px]:px-0 xs:w-screen min-[1100px]:px-[32px] container mx-auto min-[1000px]:w-[700px] min-[1100px]:w-[900px] xl:w-[1000px] xlg:w-[1200px] w-[350px] md:w-[700px] bg-white">
        {/* Show/Hide Filters Button */}
        <div className="text-center pt-4">
          <h1 className="text-[20px] text-[#2b73ec] font-extrabold">Book Free Appointment</h1>
        </div>
        <div className="flex gap-2 justify-end py-4">
          <Button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-blue-500 hover:bg-blue-500 rounded-xl text-white"
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
                    <Button
            onClick={exportToExcel}
            className="bg-green-500 hover:bg-green-500 rounded-xl text-white"
          >
            Export to Excel
          </Button>
        </div>

        {/* Filters Section */}
        {showFilters && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
            {columns.slice(1).map((column) => {
              const key = column.accessorKey;

              if (key === "gender") {
                return (
                  <SelectField
                    key={key}
                    label="Gender"
                    id="gender"
                    value={filters[key] || ""}
                    onChange={handleFilterChange}
                    options={[
                      { value: "", label: "All" }, // Allow resetting filter
                      { value: "Male", label: "Male" },
                      { value: "Female", label: "Female" },
                      { value: "Other", label: "Other" },
                    ]}
                  />
                );
              }

              if (key === "category") {
                return (
                  <SelectField
                    key="category"
                    label="Category"
                    id="category"
                    value={filters["category"] || ""}
                    onChange={handleFilterChange}
                    options={[
                      { value: "", label: "All Categories" },
                      ...doctortype.map((category) => ({
                        value: category.id,
                        label: category.title,
                      })),
                    ]}
                  />
                );
              }

              if (
                key === "createdAt" ||
                key === "updatedAt" ||
                key === "dateOfBirth"
              ) {
                return (
                  <DateFilter
                    key={key}
                    label={column.header}
                    id={key}
                    selected={filters[key]}
                    onChange={handleFilterChange}
                  />
                );
              }

              return (
                <InputField
                  key={key}
                  label={column.header}
                  id={key}
                  placeholder={`Enter ${column.header}`}
                  value={filters[key] || ""}
                  onChange={handleFilterChange}
                />
              );
            })}
          </div>
        )}

        <GraphicalRepresentation userdata={filteredData} />

        <div className="overflow-x-auto bg-white p-4 rounded-xl shadow-lg">
          <div>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="bg-gray-100 hover:bg-gray-100">
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
            {/* Pagination & Export Section */}
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
    </div>
  );
};

export default BookfreeappointmentwithGraph;
