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
  SelectField,
} from "@/app/components/input-selectui";
import Image from "next/image";
import HeadingClientMain from "@/app/components/heading";
const AllDonationsList = ({ donationData }) => {
  const pageSize = 10;

  const [filters, setFilters] = useState({
    donorEmail: "",
    donorMobile: "",
    paymentStatus: "",
    createdAtFrom: "",
    createdAtTo: "",
    donorName: "",
  });

  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: pageSize,
  });

  const filteredData = useMemo(() => {
    return donationData.filter((donation) => {
      const createdAtDate = donation.createdAt
        ? new Date(donation.createdAt)
        : null;
      const createdAtFromDate = filters.createdAtFrom
        ? new Date(filters.createdAtFrom)
        : null;
      const createdAtToDate = filters.createdAtTo
        ? new Date(filters.createdAtTo)
        : null;

      return (
        (!filters.donorEmail ||
          (donation.donorEmail &&
            donation.donorEmail
              .toLowerCase()
              .includes(filters.donorEmail.toLowerCase()))) &&
        (!filters.donorMobile ||
          donation.donorMobile.includes(filters.donorMobile)) &&
        (!filters.paymentStatus ||
          donation.paymentStatus === filters.paymentStatus) &&
        (!filters.donorName ||
          (donation.donorName &&
            donation.donorName
              .toLowerCase()
              .includes(filters.donorName.toLowerCase()))) &&
        (!createdAtFromDate ||
          (createdAtDate && createdAtDate >= createdAtFromDate)) &&
        (!createdAtToDate ||
          (createdAtDate && createdAtDate <= createdAtToDate))
      );
    });
  }, [filters, donationData]);

  const handleViewProfile = (id, type) => {
    let url = "";
    switch (type) {
      case "campaign":
        url = `/superprofile/aarogyadhan/${id}`;
        break;
      case "donors":
        url = `/superprofile/aarogyadhan/donors/${id}`;
        break;
      case "patients":
        url = `/superprofile/patient/${id}`;
        break;
      default:
        return;
    }
    window.location.href = url;
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "donorName",
        header: "Donor Name",
      },
      { accessorKey: "donorEmail", header: "Donor Email" },
      { accessorKey: "donorMobile", header: "Donor Mobile" },
      { accessorKey: "amount", header: "Amount" },
      { accessorKey: "paymentStatus", header: "Payment Status" },
      {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => formatDate(row.original.createdAt),
      },
      {
        accessorKey: "campaignId",
        header: "View Campaign",
        cell: ({ row }) => (
          <Button
            className="px-2 py-1 border border-blue-500 text-blue-500 font-semibold rounded-full hover:bg-blue-500 hover:text-white"
            onClick={() =>
              handleViewProfile(row.getValue("campaignId"), "campaign")
            }
          >
            View Campaign
          </Button>
        ),
      },
      {
        accessorKey: "donorId",
        header: "View Donor",
        cell: ({ row }) => (
          <Button
            className="px-2 py-1 border border-blue-500 text-blue-500 font-semibold rounded-full hover:bg-blue-500 hover:text-white"
            onClick={() => handleViewProfile(row.getValue("donorId"), "donors")}
          >
            View Donor
          </Button>
        ),
      },
      {
        accessorKey: "fundraiser.patientId",
        header: "View Patient",
        cell: ({ row }) => (
          <Button
            className="px-2 py-1 border border-blue-500 text-blue-500 font-semibold rounded-full hover:bg-blue-500 hover:text-white"
            onClick={() =>
              handleViewProfile(
                row.getValue("fundraiser.patientId"),
                "patients"
              )
            }
          >
            View Patient
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

  const handleExportToExcel = (donationData) => {
    if (!Array.isArray(donationData) || donationData.length === 0) {
      console.error("No valid data available to export.");
      return;
    }

    try {
      const ws = XLSX.utils.json_to_sheet(donationData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Donation Data");
      XLSX.writeFile(wb, "DonationsData.xlsx");
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
        <HeadingClientMain main={"All Donations List"} />
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
              label="Donor Email"
              id="donorEmail"
              type="email"
              placeholder="Donor Email"
              value={filters.donorEmail}
              onChange={handleFilterChange}
            />
            <InputField
              label="Donor Mobile"
              id="donorMobile"
              type="text"
              placeholder="Donor Mobile Number"
              value={filters.donorMobile}
              onChange={handleFilterChange}
            />
            <SelectField
              label="Payment Status"
              id="paymentStatus"
              value={filters.paymentStatus}
              onChange={(value) => handleFilterChange("paymentStatus", value)}
              options={[
                { value: "", label: "All" },
                { value: "PENDING", label: "Pending" },
                { value: "SUCCESS", label: "Success" },
                { value: "FAILED", label: "Failed" },
                { value: "REFUNDED", label: "Refunded" },
              ]}
            />
            <InputField
              label="Donor Name"
              id="donorName"
              type="text"
              placeholder="Donor Name"
              value={filters.donorName}
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

export default AllDonationsList;
