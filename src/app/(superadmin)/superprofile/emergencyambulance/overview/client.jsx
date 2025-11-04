"use client"; // Ensure it's a client component

import React, { useMemo, useState } from "react";
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
import * as XLSX from "xlsx";
import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import EmergencyAmbulanceGraph from "./graph";

const EmergencyAmbulanceClientGraph = ({ userdata }) => {
  const pageSize = 10;
  const [filters, setFilters] = useState({ email: "", pinCode: "", ambulancecategory: "" });
  const [selectedImage, setSelectedImage] = useState(null);

  // Handle Filter Changes
  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  // Apply Filters
  const filteredData = useMemo(() => {
    return userdata.filter((row) => {
      return (
        row.email.toLowerCase().includes(filters.email.toLowerCase()) &&
        row.pinCode.toString().includes(filters.pinCode) &&
        row.ambulancecategory.toLowerCase().includes(filters.ambulancecategory.toLowerCase())
      );
    });
  }, [userdata, filters]);

  // Table Columns
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
      { accessorKey: "email", header: "Email" },
      { accessorKey: "ambulancecategory", header: "City" },
      { accessorKey: "pinCode", header: "Pin Code" },
      {
        accessorKey: "locateme",
        header: "Location",
        cell: ({ row }) => {
          const locateme = row.getValue("locateme");
          try {
            const { lat, lng } = JSON.parse(locateme);
            return (
              <a
                href={`https://www.google.com/maps?q=${lat},${lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                Open in Google Maps
              </a>
            );
          } catch {
            return <span>Invalid location</span>;
          }
        },
      },
      {
        accessorKey: "image",
        header: "Image",
        cell: ({ row }) => {
          const image = row.getValue("image");
      
          return image ? (
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  onClick={() => setSelectedImage(image)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
                >
                  View
                </Button>
              </DialogTrigger>
              <DialogContent>
                <Image 
                  src={selectedImage} 
                  alt="Ambulance Large" 
                  width={500} 
                  height={500} 
                  className="rounded-xl"
                />
              </DialogContent>
            </Dialog>
          ) : (
            <span>No Image</span>
          );
        },
      },
      
    ],
    [selectedImage]
  );

  // Table Configuration
  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // Export to Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Emergency Ambulance Data");
    XLSX.writeFile(wb, "emergency_ambulance_data.xlsx");
  };

  return (
    <div className="md:container shadow-xl mx-auto font-poppins">
      <div className="overflow-x-auto xs:px-2 min-[1000px]:px-0 xs:w-screen min-[1100px]:px-[32px] container mx-auto min-[1000px]:w-[700px] min-[1100px]:w-[900px] xl:w-[1000px] xlg:w-[1200px] w-[350px] md:w-[700px] bg-white">
        <div className="text-center pt-4">
          <h1 className="text-2xl text-blue-600 font-bold">Emergency Ambulance Booking</h1>
          <p className="text-blue-600 text-sm">Patient Details</p>
        </div>
        <div className="flex gap-2 justify-end py-4">
                      <Button onClick={exportToExcel} className="bg-green-500 hover:bg-green-600 rounded-xl text-white">
              Export to Excel
            </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
          <input
            type="text"
            placeholder="Filter by Email"
            value={filters.email}
            onChange={(e) => handleFilterChange("email", e.target.value)}
            className="border p-2 rounded-xl w-full"
          />
          <input
            type="text"
            placeholder="Filter by Pin Code"
            value={filters.pinCode}
            onChange={(e) => handleFilterChange("pinCode", e.target.value)}
            className="border p-2 rounded-xl w-full"
          />
          <input
            type="text"
            placeholder="Filter by City"
            value={filters.ambulancecategory}
            onChange={(e) => handleFilterChange("ambulancecategory", e.target.value)}
            className="border p-2 rounded-xl w-full"
          />
        </div>
        <EmergencyAmbulanceGraph userdata={filteredData}/>
        <div className="overflow-x-auto bg-white p-4 rounded-xl shadow-lg">
          <div className="">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="bg-gray-100 hover:bg-gray-100">
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="border border-gray-200 py-4 px-6 text-left font-semibold text-gray-900 whitespace-nowrap">
                        {flexRender(header.column.columnDef.header, header.getContext())}
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
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="text-center py-4">
                      No results found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination & Export */}
          <div className="flex items-center justify-between py-4">
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

export default EmergencyAmbulanceClientGraph;
