"use client";

import React, { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { FaChevronDown } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { ArrowDown, CalendarDays } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import * as XLSX from "xlsx"; // Import XLSX for exporting
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import BedBookingGraph from "./graph";
import {
  DateFilter,
  InputField,
  SelectField,
} from "@/app/components/input-selectui";

// ✅ Import reusable components

const BedBookingClientGraph = ({ userdata }) => {
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [advanceSearch, setAdvanceSearch] = useState([]);
  const hospitalOptions = [
    "NABH Hospitals",
    "MJPJAY Hospitals",
    "ESIC Hospitals",
    "CGHS Hospitals",
    "Trauma Care Hospitals",
    "Cardiac Care Hospitals",
    "Mother & Child Hospitals",
    "Speciality Hospitals",
    "Multispeciality Hospitals",
    "Super-Speciality Hospitals",
    "Cancer Hospitals",
    "Eye Hospitals",
    "IVF Centers",
    "Dialysis Centers",
    "Dental Clinics",
    "Small Clinics",
  ];

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // to select Multiple option
  const handleMultiCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setAdvanceSearch((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value)
    );
  };
  // Function to handle filter changes
  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  // Filtering Logic
  const filteredData = useMemo(() => {
    return userdata.filter((row) =>
      Object.entries(filters).every(([key, value]) => {
        if (!value) return true;

        if (["createdAt", "updatedAt", "dateOfBirth"].includes(key)) {
          const rowDate = new Date(row[key]);
          return rowDate >= new Date(value);
        }
        if (key === "gender") {
          return row[key]?.toLowerCase() === value.toLowerCase(); // Ensure strict matching
        }
        return String(row[key] || "")
          .toLowerCase()
          .includes(value.toLowerCase());
      })
    );
  }, [userdata, filters]);

  // Define Table Columns
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
              className="text-blue-500 underline"
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
      {
        accessorKey: "gender",
        header: "Gender",
        cell: ({ row }) => <div>{row.getValue("gender") || "N/A"}</div>,
      },
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
      { accessorKey: "hospitalType", header: "Hospital Type" },
      { accessorKey: "bedCategory", header: "Bed Category" },
      { accessorKey: "advancedSearch", header: "Advanced Search" },
      { accessorKey: "hospitalName", header: "Hospital Name" },
     {
  accessorKey: "createdAt",
  header: "Created At",
  cell: ({ row }) => {
    const date = row.getValue("createdAt");
    return <div>{date ? new Date(date).toLocaleDateString() : "N/A"}</div>;
  },
},
{
  accessorKey: "updatedAt",
  header: "Updated At",
  cell: ({ row }) => {
    const date = row.getValue("updatedAt");
    return <div>{date ? new Date(date).toLocaleDateString() : "N/A"}</div>;
  },
},

    ],
    []
  );

  // Table Configuration
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
    XLSX.utils.book_append_sheet(wb, ws, "Bed Booking Data");
    XLSX.writeFile(wb, "bed_booking_data.xlsx");
  };

  return (
    <div className="md:container shadow-xl mx-auto font-poppins">
      <div className="overflow-x-auto xs:px-2 min-[1000px]:px-0 xs:w-screen min-[1100px]:px-[32px] container mx-auto min-[1000px]:w-[700px] min-[1100px]:w-[900px] xl:w-[1000px] xlg:w-[1200px] w-[350px] md:w-[700px] bg-white">
        {/* Toggle Filters Button */}
        <div className="text-center pt-4">
          <h1 className="text-[20px] text-[#2b73ec] font-extrabold">Bed Booking</h1>
        </div>
        <div className="flex justify-end py-4">
          <Button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-blue-500 hover:bg-blue-600 rounded-xl text-white"
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>

        {/* Filters Section */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
            {columns.slice(1).map((col, index) => {
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
                    selected={filters[col.accessorKey] || ""}
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
                      { value: "", label: "Select Gender" },
                      { value: "Male", label: "Male" },
                      { value: "Female", label: "Female" },
                      { value: "Other", label: "Other" },
                    ]}
                  />
                );
              } else if (col.accessorKey === "bedCategory") {
                return (
                  <SelectField
                    key="category"
                    label="Category"
                    id="category"
                    value={filters["category"] || ""}
                    onChange={handleFilterChange}
                    options={[
                      { value: "", label: "Select Bed Category" },
                      {
                        value: "ICU Ventilator Bed",
                        label: "ICU Ventilator Bed",
                      },
                      { value: "ICU Bed", label: "ICU Bed" },
                      { value: "CCU", label: "CCU" },
                      { value: "NICU", label: "NICU" },
                      {
                        value: "PICU Ventilator Bed",
                        label: "PICU Ventilator Bed",
                      },
                      { value: "PICU Bed", label: "PICU Bed" },
                      { value: "HDU", label: "HDU" },
                      { value: "Suite Room Bed", label: "Suite Room Bed" },
                      { value: "Deluxe Room Bed", label: "Deluxe Room Bed" },
                      {
                        value: "Private Single Sharing Bed",
                        label: "Private Single Sharing Bed",
                      },
                      {
                        value: "Non AC Private Single Sharing Bed",
                        label: "Non AC Private Single Sharing Bed",
                      },
                      {
                        value: "Semi Private Sharing Bed",
                        label: "Semi Private Sharing Bed",
                      },
                      {
                        value: "Non AC Semi Private Sharing Bed",
                        label: "Non AC Semi Private Sharing Bed",
                      },
                      { value: "Male Ward Bed", label: "Male Ward Bed" },
                      { value: "Female Ward Bed", label: "Female Ward Bed" },
                      { value: "General Ward", label: "General Ward" },
                      { value: "Day Care", label: "Day Care" },
                    ]}
                  />
                );
              } else if (col.accessorKey === "hospitalType") {
                return (
                  <SelectField
                    key="hospitaltype"
                    label="Hospital Type"
                    id="hospitaltype"
                    value={filters["hospitaltype"] || ""}
                    onChange={handleFilterChange}
                    options={[
                      { value: "", label: "Select Hospital Type" },
                      {
                        value: "Goverment Hospitals",
                        label: "Goverment Hospitals",
                      },
                      {
                        value: "Private Hospitals",
                        label: "Private Hospitals",
                      },
                    ]}
                  />
                );
              } else  {
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

        <BedBookingGraph userdata={filteredData} />

        {/* Table Section */}
        <div className="overflow-x-auto bg-white p-4 rounded-xl shadow-lg">
          <div className="">
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
                {table.getRowModel().rows.map((row,index) => (
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
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BedBookingClientGraph;
