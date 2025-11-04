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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { InputField } from "@/app/components/input-selectui";
import HeadingClientMain from "@/app/components/heading";
const AllPhotographersList = ({ photographerData }) => {
  const pageSize = 10;

  const [filters, setFilters] = useState({
    fullname: "",
    email: "",
    mobile: "",
    city: "",
    pincode: "",
    pancardno: "",
    aadharcardno: "",
  });

  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: pageSize,
  });

  const [showFilters, setShowFilters] = useState(false);

  const applyFilters = () => {
    // Reset to first page on filter apply
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const handleFilterChange = (field, value, triggeredByEnter = false) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value,
    }));

    if (triggeredByEnter) {
      applyFilters();
    }
  };

  const filteredData = useMemo(() => {
    const cleanedFilters = Object.fromEntries(
      Object.entries(filters).map(([key, val]) => [key, val.trim().toLowerCase()])
    );

    return photographerData.filter((photographer) =>
      Object.entries(cleanedFilters).every(([key, value]) => {
        if (!value) return true;
        const photographerValue = photographer[key];

        if (typeof photographerValue === "string") {
          return photographerValue.toLowerCase().includes(value);
        }
        if (typeof photographerValue === "number" || typeof photographerValue === "bigint") {
          return photographerValue.toString().includes(value);
        }
        return false;
      })
    );
  }, [filters, photographerData]);

  const handleViewProfile = (id) => {
    console.log(id);
    const url = `/superprofile/aarogyadhan/photographers/${id}`;
    window.location.href = url;
  };
  
  const columns = useMemo(
    () => [
      { accessorKey: "fullname", header: "Full Name" },
      { accessorKey: "email", header: "Email" },
      { accessorKey: "mobile", header: "Mobile" },
      { accessorKey: "city", header: "City" },
      { accessorKey: "pincode", header: "Pincode" },
      { accessorKey: "pancardno", header: "PAN Card Number" },
      { accessorKey: "aadharcardno", header: "Aadhar Card Number" },
      {
        accessorKey: "id",
        header: "View Profile",
        cell: ({ row }) => (
          <Button
            className="px-2 py-1 border border-blue-500 text-blue-500 font-semibold rounded-full hover:bg-blue-500 hover:text-white"
            onClick={() => handleViewProfile(row.original.id)} // ✅ use row.original.id
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

  const handleExportToExcel = (dataToExport) => {
    if (!Array.isArray(dataToExport) || dataToExport.length === 0) {
      console.error("No valid data available to export.");
      return;
    }

    try {
      const ws = XLSX.utils.json_to_sheet(dataToExport);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Photographer Data");
      XLSX.writeFile(wb, "PhotographersData.xlsx");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
    }
  };

  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  return (
    <div className="md:container shadow-xl mx-auto font-poppins">
      <div className="overflow-x-auto xs:px-2 min-[1000px]:px-0 min-[1100px]:px-[32px] container mx-auto min-[1000px]:w-[700px] min-[1100px]:w-[900px] xl:w-[1000px] xlg:w-[1200px] w-[350px] md:w-[700px] bg-white">
        <HeadingClientMain main={"All Photographers List"}/>
        <div className="flex justify-end py-4 gap-2 items-end">
          <button
            onClick={toggleFilters}
            className="bg-blue-500 rounded-xl text-white px-4 py-2 focus:outline-none hover:bg-blue-600 transition"
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
          <button
            onClick={() => handleExportToExcel(filteredData)}
            className="bg-green-500 rounded-xl text-white px-4 py-2 focus:outline-none hover:bg-green-600 transition"
          >
            Export to Excel
          </button>
        </div>
        {showFilters && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 my-4">
            <InputField label="Full Name" id="fullname" value={filters.fullname} onChange={handleFilterChange}   placeholder="Full Name" />
            <InputField label="Email" id="email" type="email" value={filters.email} onChange={handleFilterChange}   placeholder="Email"/>
            <InputField label="Mobile" id="mobile" value={filters.mobile} onChange={handleFilterChange}    placeholder="Mobile"/>
            <InputField label="City" id="city" value={filters.city} onChange={handleFilterChange}        placeholder="City"/>
            <InputField label="Pincode" id="pincode" value={filters.pincode} onChange={handleFilterChange}     placeholder="Pincode" />
            <InputField label="PAN Card Number" id="pancardno" value={filters.pancardno} onChange={handleFilterChange}             placeholder="PAN Card Number"/>
            <InputField label="Aadhar Card Number" id="aadharcardno" value={filters.aadharcardno} onChange={handleFilterChange}             placeholder="Aadhar Card Number"/>

        
              <Button onClick={applyFilters} className="bg-blue-600  text-white px-4 py-2 rounded-xl hover:bg-blue-700">
                Apply Filters
              </Button>
    
          </div>
        )}
        <div className="overflow-x-auto bg-white p-4 rounded-xl shadow-lg">
          <div className="">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="bg-gray-100 hover:bg-gray-100">
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="border border-gray-200 py-4 px-6 text-left font-semibold text-gray-900 whitespace-nowrap">
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row,index) => (
                    <TableRow key={row.original.id} className={`
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
                  ))
                ) : 
                  (
                      <TableRow>
                        <TableCell colSpan={columns.length} className="h-24 text-center">
                          No results found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
      
                {/* Pagination */}
                <div className="flex items-center justify-between py-4">
                  <Button size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                    <span className="rounded-full border-2 px-3 border-[#243460]">Previous</span>
                  </Button>
                  <span>
                    Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                  </span>
                  <Button size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                    <span className="rounded-full border-2 px-3 border-[#243460]">Next</span>
                  </Button>
                </div>
              </div>
        </div>
      </div>
    </div>
  );
};

export default AllPhotographersList;
    