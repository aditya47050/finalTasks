"use client";

import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, User } from "lucide-react";
import * as XLSX from "xlsx";
import HeadingClientMain from "@/app/components/heading";
import { DateFilter, InputField, SelectField } from "@/app/components/input-selectui";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ITEMS_PER_PAGE = 5;

const homeHealthcareServices = [
  "ICU at Home",
  "General Nursing",
  "Neurological Care & Rehabilitation",
  "On Bed Cancer",
  "Transplant & Post-Op Care",
  "Pregnancy Care",
  "Mother & Child Care",
  "Palliative Care",
  "Orthopaedic Care",
  "Stroke Care",
  "Cardiac Care",
  "Dialysis Care",
  "Old Age Health Care",
  "COPD Care",
  "Bed Sores Care",
];

const HomeHealthcareBookingsClient = ({ bookings }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    patientName: "",
    patientEmail: "",
    patientMobile: "",
    serviceName: "All",
    status: "All",
    bookingDate: null,
    preferredDate: null,
  });
  const [currentPage, setCurrentPage] = useState(1);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Filtering logic
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const fullPatientName = `${b.patient?.firstName || ""} ${b.patient?.lastName || ""}`.toLowerCase();
      const patientEmail = (b.patient?.email || "").toLowerCase();
      const patientMobile = (b.patient?.mobile || "").toLowerCase();
      const serviceName = (b.HomeHealthcare?.serviceName || "").toLowerCase();
      const status = (b.status || "").toLowerCase();

      if (filters.patientName && !fullPatientName.includes(filters.patientName.toLowerCase())) return false;
      if (filters.patientEmail && !patientEmail.includes(filters.patientEmail.toLowerCase())) return false;
      if (filters.patientMobile && !patientMobile.includes(filters.patientMobile.toLowerCase())) return false;
      if (filters.serviceName && filters.serviceName !== "All" && serviceName !== filters.serviceName.toLowerCase()) return false;
      if (filters.status && filters.status !== "All" && status !== filters.status.toLowerCase()) return false;
      if (filters.bookingDate && new Date(b.bookingDate).toDateString() !== filters.bookingDate.toDateString()) return false;
      if (filters.preferredDate && b.preferredDate && new Date(b.preferredDate).toDateString() !== filters.preferredDate.toDateString()) return false;

      return true;
    });
  }, [bookings, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Export to Excel
  const exportToExcel = () => {
    const data = filteredBookings.map((b) => ({
      Patient: `${b.patient?.firstName || ""} ${b.patient?.lastName || ""}`,
      Email: b.patient?.email || "-",
      Mobile: b.patient?.mobile || "-",
      Service: b.HomeHealthcare?.serviceName || "-",
      "Booking Date": new Date(b.bookingDate).toLocaleDateString(),
      "Preferred Date": b.preferredDate
        ? new Date(b.preferredDate).toLocaleDateString()
        : "-",
      "Time Slot": b.preferredTimeSlot || "-",
      Status: b.status,
      Notes: b.notes || "-",
    }));
    
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Home Healthcare Bookings");
    XLSX.writeFile(wb, "home_healthcare_bookings.xlsx");
  };

  return (
    <div className="overflow-x-auto min-[1000px]:px-0 min-[1100px]:px-[32px] container mx-auto min-[1000px]:w-[700px] min-[1100px]:w-[900px] xl:w-[1100px] w-[350px] md:w-[700px] bg-white py-4 font-poppins">
      <HeadingClientMain main="Home Healthcare Bookings" sub="Full Data" />

      {/* Page Header */}
      <div className="flex justify-end gap-1 py-4">
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
          <Download className="mr-2 h-4 w-4" /> Export to Excel
        </Button>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white rounded-xl shadow-sm mb-4">
          <InputField
            label="Patient Name"
            id="patientName"
            placeholder="Enter Patient Name"
            value={filters.patientName}
            onChange={handleFilterChange}
          />
          <InputField
            label="Patient Email"
            id="patientEmail"
            placeholder="Enter Patient Email"
            value={filters.patientEmail}
            onChange={handleFilterChange}
          />
          <InputField
            label="Patient Mobile"
            id="patientMobile"
            placeholder="Enter Patient Mobile"
            value={filters.patientMobile}
            onChange={handleFilterChange}
          />
          <SelectField
            label="Service"
            id="serviceName"
            value={filters.serviceName}
            onChange={handleFilterChange}
            options={[
              { value: "All", label: "All Services" },
              ...homeHealthcareServices.map(service => ({ 
                value: service, 
                label: service 
              }))
            ]}
          />
          <SelectField
            label="Status"
            id="status"
            value={filters.status}
            onChange={handleFilterChange}
            options={[
              { value: "All", label: "All Statuses" },
              { value: "PENDING", label: "Pending" },
              { value: "CONFIRMED", label: "Confirmed" },
              { value: "CANCELLED", label: "Cancelled" },
              { value: "COMPLETED", label: "Completed" },
            ]}
          />
          <DateFilter
            label="Booking Date"
            id="bookingDate"
            selected={filters.bookingDate}
            onChange={handleFilterChange}
          />
          <DateFilter
            label="Preferred Date"
            id="preferredDate"
            selected={filters.preferredDate}
            onChange={handleFilterChange}
          />
        </div>
      )}

      {/* Table Container */}
      <div className="bg-white p-4 rounded-xl shadow-lg">
        <div className="overflow-x-auto">
          <Table className="min-w-[1200px] table-fixed w-full">
            <TableHeader>
              <TableRow className="bg-white">
                <TableHead className="w-[150px]">Patient</TableHead>
                <TableHead className="w-[120px]">View Profile</TableHead>
                <TableHead className="w-[150px]">Email</TableHead>
                <TableHead className="w-[120px]">Mobile</TableHead>
                <TableHead className="w-[150px]">Service</TableHead>
                <TableHead className="w-[120px]">Booking Date</TableHead>
                <TableHead className="w-[120px]">Preferred Date</TableHead>
                <TableHead className="w-[120px]">Time Slot</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedBookings.length ? (
                paginatedBookings.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="w-[150px] truncate">
                      {b.patient ? `${b.patient.firstName || ""} ${b.patient.lastName || ""}` : "N/A"}
                    </TableCell>
                    <TableCell className="w-[120px] truncate">
                      {b.patient ? (
                        <a 
                          href={`/hospital/dashboard/patientinfo/${b.patient.id}`} 
                          className="flex items-center gap-1 text-blue-500 underline"
                        >
                          <User className="w-4 h-4" /> View Profile
                        </a>
                      ) : "N/A"}
                    </TableCell>
                    <TableCell className="w-[150px] truncate">
                      {b.patient?.email || "-"}
                    </TableCell>
                    <TableCell className="w-[120px] truncate">
                      {b.patient?.mobile || "-"}
                    </TableCell>
                    <TableCell className="w-[150px] truncate">
                      {b.HomeHealthcare?.serviceName || "-"}
                    </TableCell>
                    <TableCell className="w-[120px] truncate">
                      {new Date(b.bookingDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="w-[120px] truncate">
                      {b.preferredDate ? new Date(b.preferredDate).toLocaleDateString() : "-"}
                    </TableCell>
                    <TableCell className="w-[120px] truncate">
                      {b.preferredTimeSlot || "-"}
                    </TableCell>
                    <TableCell className="w-[100px] truncate">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          b.status === "CONFIRMED"
                            ? "bg-green-100 text-green-600"
                            : b.status === "CANCELLED"
                            ? "bg-red-100 text-red-600"
                            : b.status === "COMPLETED"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-yellow-100 text-yellow-600"
                        }`}
                      >
                        {b.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={10} className="text-center">
                    No bookings found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-4">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Previous
            </Button>
            <span className="px-3 py-2 text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeHealthcareBookingsClient;