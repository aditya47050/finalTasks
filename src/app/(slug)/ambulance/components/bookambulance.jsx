"use client"; // Client-side component

import React, { useMemo, useState, useEffect } from "react";
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
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Modal from "react-modal";
import { toast } from "react-toastify";

const BookAmbulanceClient = ({ userdata }) => {
  const pageSize = 10;
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

    // Approval system states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState(null);
  const [currentBookingId, setCurrentBookingId] = useState(null);
  const [remark, setRemark] = useState("");
  const [bookingStatus, setBookingStatus] = useState("pending");
const [data, setData] = useState(userdata);

  // Handle filter changes
  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

    // Open approval modal
  const openModal = (action, bookingId) => {
    setCurrentAction(action);
    setCurrentBookingId(bookingId);
    setIsModalOpen(true);
  };

  // Close approval modal
  const closeModal = () => {
    setIsModalOpen(false);
    setRemark("");
  };

  React.useEffect(() => {
  console.log('userdata received in client:', userdata);
}, [userdata]);

   // Handle booking approval/rejection
const handleBookingAction = async () => {
  if (currentAction === "reject" && remark.trim() === "") {
    toast.error("Please provide a reason for rejection!");
    return;
  }

  try {
    setLoading(true);
    
    const response = await fetch(
      `/api/ambulance/book-ambulance/${currentBookingId}/approval`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          approvalStatus: currentAction === "approve" ? "APPROVED" : "REJECTED",
          remark: remark.trim() || null,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update booking status");
    }

    const result = await response.json();
    
    // Update local state
    setData(prevData => 
      prevData.map(booking => 
        booking.id === currentBookingId 
          ? { ...booking, ...result.data.booking } 
          : booking
      )
    );
    
    toast.success(
      `Booking ${currentAction === "approve" ? "approved" : "rejected"} successfully!`
    );
    
    closeModal();
  } catch (error) {
    console.error("Error updating booking:", error);
    toast.error(error.message || "Failed to update booking status");
  } finally {
    setLoading(false);
  }
};

  // Filtered Data
  const filteredData = useMemo(() => {
    return data.filter((row) =>
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
  }, [data, filters]);

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
      { accessorKey: "ambulancecategory", header: "Location" },
      { accessorKey: "firstName", header: "First Name" },
      { accessorKey: "middleName", header: "Middle Name" },
      { accessorKey: "lastName", header: "Last Name" },
      {
        accessorKey: "diseaseDetails",
        header: "Disease Details",
        cell: ({ row }) => {
          const text = row.getValue("diseaseDetails");

          return (
            <Dialog>
              <DialogTrigger>View</DialogTrigger>{" "}
              <DialogContent>{text}</DialogContent>
            </Dialog>
          );
        },
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
{
  accessorKey: "status",
  header: "Status",
  cell: ({ row }) => {
    const status = row.getValue("status") || "PENDING";

    const statusStyles = {
      PENDING: "bg-amber-100 text-amber-800",
      BOOKED: "bg-blue-100 text-blue-800",
      CONFIRMED: "bg-emerald-100 text-emerald-800",
      ADMITTED: "bg-purple-100 text-purple-800",
      AVAILABLE: "bg-green-100 text-green-800",
      NOT_AVAILABLE: "bg-red-100 text-red-800",
      REJECTED: "bg-rose-100 text-rose-800",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${
          statusStyles[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status.toLowerCase()}
      </span>
    );
  },
}

,
{
        header: "Actions",
        cell: ({ row }) => {
          const status = row.original.status || "pending";
          
          return (
            <div className="flex space-x-2">
<div className="flex space-x-2">
  <button
    onClick={() => openModal("approve", row.original.id)}
    className="bg-green-500 text-white px-3 py-1 rounded text-sm"
  >
    Approve
  </button>
  <button
    onClick={() => openModal("reject", row.original.id)}
    className="bg-red-500 text-white px-3 py-1 rounded text-sm"
  >
    Reject
  </button>
</div>

            </div>
          );
        },
      }

    ],
    [loading, message]
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
       {/* Approval Modal */}
      <Modal
        ariaHideApp={false}
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Booking Approval"
        className="bg-white p-6 rounded-xl mt-16 justify-center items-center shadow-lg max-w-xl mx-auto"
      >
        <h2 className="text-xl font-bold mb-4">
          {currentAction === "approve" ? "Approve Booking" : "Reject Booking"}
        </h2>
        
        <textarea
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          rows={5}
          placeholder={
            currentAction === "approve"
              ? "Enter approval remarks (optional)"
              : "Please specify the reason for rejection"
          }
        ></textarea>

        <div className="flex justify-end">
          <button 
            onClick={closeModal} 
            className="bg-gray-400 text-white px-4 py-2 rounded mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleBookingAction}
            className={`${
              currentAction === "approve" ? "bg-green-500" : "bg-red-500"
            } text-white px-4 py-2 rounded`}
            disabled={loading}
          >
            {loading ? "Processing..." : currentAction === "approve" ? "Confirm Approval" : "Confirm Rejection"}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default BookAmbulanceClient;
