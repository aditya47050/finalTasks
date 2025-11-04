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

const AarogyaMitraEnquiryClient = ({ enquiries }) => {
  const pageSize = 10;
  const [data, setData] = useState(enquiries);
  const [modalImage, setModalImage] = useState(null);

  // Filters State
  const [filters, setFilters] = useState({
    name: "",
    mobile: "",
    email: "",
    city: "",
    pincode: "",
    category: "",
    startDate: null,
    endDate: null,
  });
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
      const matchesCity = filters.city ? item.city === filters.city : true;
      const matchesPincode = filters.pincode
        ? item.pincode.includes(filters.pincode)
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
        matchesCity &&
        matchesCategory &&
        matchesPincode &&
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
      { accessorKey: "city", header: "City" },
      { accessorKey: "pincode", header: "Pin Code" },
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
      {/* Header */}

      <HeadingClientMain
        main={"Aarogya Mitra Enquiries"}
        sub={" Full Details "}
      />

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
          label="City"
          id="city"
          placeholder="Enter City"
          value={filters.city}
          onChange={handleFilterChange}
        />
        <InputField
          label="Pincode"
          id="pincode"
          placeholder="Enter Pincode"
          value={filters.pincode}
          onChange={handleFilterChange}
        />
        <SelectField
          label="Category"
          id="category"
          value={filters.category} // Ensure this is a string
          onChange={(id, value) => handleFilterChange(id, value)} // Pass correct arguments
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
      <div className="lg:w-full w-[360px] overflow-auto md:w-[700px]  p-4">
        <div className="">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="border-r">
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
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="border-r ">
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
            <Button
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="rounded-full border-2 px-3 border-[#243460]">
                Next
              </span>
            </Button>
            <span>
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </span>
          </div>
        </div>
      </div>

      {/* Modal for Document Preview */}
      <Modal imageUrl={modalImage} onClose={() => setModalImage(null)} />
    </div>
  );
};

export default AarogyaMitraEnquiryClient;
