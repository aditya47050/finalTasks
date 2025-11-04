"use client";

import React, { useMemo, useState } from "react";
import * as XLSX from "xlsx";
import HeadingClientMain from "@/app/components/heading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AllSurgeryTreatmentBookings = ({ userdata }) => {
  const bookings = Array.isArray(userdata) ? userdata : [];

  // Filters
  const [filters, setFilters] = useState({
    patientName: "",
    patientEmail: "",
    hospitalName: "",
    hospitalEmail: "",
    status: "",
    type: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Sorting by createdAt (latest first)
  const sortedBookings = useMemo(() => {
    return bookings.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [bookings]);

  // Apply filters
  const filteredBookings = useMemo(() => {
    return sortedBookings.filter((b) => {
      const patientFullName = `${b.patient.firstName} ${b.patient.lastName}`.toLowerCase();
      const hospitalName = b.service?.hospital?.regname?.toLowerCase() || "";
      const hospitalEmail = b.service?.hospital?.email?.toLowerCase() || "";
      return (
        (filters.patientName
          ? patientFullName.includes(filters.patientName.toLowerCase())
          : true) &&
        (filters.patientEmail
          ? b.patient.email
              ?.toLowerCase()
              .includes(filters.patientEmail.toLowerCase())
          : true) &&
        (filters.hospitalName
          ? hospitalName.includes(filters.hospitalName.toLowerCase())
          : true) &&
        (filters.hospitalEmail
          ? hospitalEmail.includes(filters.hospitalEmail.toLowerCase())
          : true) &&
        (filters.status ? b.status === filters.status : true) &&
        (filters.type ? b.service?.type === filters.type : true)
      );
    });
  }, [sortedBookings, filters]);

  // Pagination logic
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Excel export
  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(
      filteredBookings.map((b) => ({
        BookingID: b.id,
        Patient: `${b.patient.firstName} ${b.patient.lastName}`,
        PatientEmail: b.patient.email,
        PatientMobile: b.patient.mobile,
        Hospital: b.service?.hospital?.regname || "N/A",
        HospitalEmail: b.service?.hospital?.email || "N/A",
        Service: b.service?.serviceName,
        Category: b.service?.category,
        Type: b.service?.type,
        PreferredDate: b.preferredDate,
        PreferredTime: b.preferredTimeSlot,
        Status: b.status,
        BookedBy: b.bookedByType,
        CreatedAt: new Date(b.createdAt).toLocaleString(),
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "SurgeryBookings");
    XLSX.writeFile(wb, "SurgeryBookings.xlsx");
  };

    // Handlers for navigation
  const handleViewPatient = (id) => {
    window.location.href = `/superprofile/patient/${id}`;
  };
  const handleViewHospital = (id) => {
    window.location.href = `/superprofile/hsp/Hospital/${id}`;
  };

  // Dynamic columns
  const columns = [
    {
      key: "patient",
      header: "Patient",
      render: (b) => `${b.patient.firstName} ${b.patient.lastName}`,
    },
    {
      key: "patientEmail",
      header: "Patient Email",
      render: (b) => b.patient.email,
    },
    {
      key: "viewPatient",
      header: "View Patient",
      render: (b) => (
        <button
          className="text-blue-500 underline"
          onClick={() => handleViewPatient(b.patient.id)}
        >
          View Profile
        </button>
      ),
    },
    {
      key: "hospital",
      header: "Hospital",
      render: (b) => b.service?.hospital?.regname || "N/A",
    },
    {
      key: "hospitalEmail",
      header: "Hospital Email",
      render: (b) => b.service?.hospital?.email || "N/A",
    },
    {
      key: "viewHospital",
      header: "View Hospital",
      render: (b) => (
        <button
          className="text-blue-500 underline"
          onClick={() => handleViewHospital(b.service?.hospital?.id)}
        >
          View profile
        </button>
      ),
    },
    { key: "service", header: "Service", render: (b) => b.service?.serviceName },
    { key: "category", header: "Category", render: (b) => b.service?.category },
    { key: "type", header: "Type", render: (b) => b.service?.type || "N/A" },
    {
      key: "preferredDate",
      header: "Preferred Date",
      render: (b) =>
        b.preferredDate
          ? new Date(b.preferredDate).toLocaleDateString()
          : "N/A",
    },
    {
      key: "preferredTime",
      header: "Preferred Time",
      render: (b) => b.preferredTimeSlot || "N/A",
    },
    { key: "status", header: "Status", render: (b) => b.status },
    { key: "bookedBy", header: "Booked By", render: (b) => b.bookedByType },
    {
      key: "createdAt",
      header: "Created At",
      render: (b) => new Date(b.createdAt).toLocaleString(),
    },
  ];

  return (
    <div className="md:container shadow-xl mx-auto font-poppins">
      <div className="overflow-x-auto xs:px-2 min-[1000px]:px-0 min-[1100px]:px-[32px] container mx-auto min-[1000px]:w-[700px] min-[1100px]:w-[900px] xl:w-[1000px] xlg:w-[1200px] w-[350px] md:w-[700px] bg-white">
        <HeadingClientMain
          main={"Surgery & Treatment Bookings"}
          sub={"Full Details"}
        />

        {/* Fixed Header with Actions */}
        <div className="flex justify-end gap-2 py-4 items-end">
          <button
            onClick={() => setShowFilters((prev) => !prev)}
            className="bg-blue-500 rounded-xl text-white px-4 py-2 focus:outline-none hover:bg-blue-600 transition"
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
          <button
            onClick={handleExport}
            className="bg-green-400 rounded-xl text-white px-4 py-2 focus:outline-none hover:bg-green-400 transition"
          >
            Export to Excel
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white rounded-xl px-6 pb-6 mb-4">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">
              Filter Data
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <input
                type="text"
                placeholder="Patient Name"
                value={filters.patientName}
                onChange={(e) =>
                  setFilters({ ...filters, patientName: e.target.value })
                }
                className="border rounded-xl p-2"
              />
              <input
                type="text"
                placeholder="Patient Email"
                value={filters.patientEmail}
                onChange={(e) =>
                  setFilters({ ...filters, patientEmail: e.target.value })
                }
                className="border rounded-xl p-2"
              />
              <input
                type="text"
                placeholder="Hospital Name"
                value={filters.hospitalName}
                onChange={(e) =>
                  setFilters({ ...filters, hospitalName: e.target.value })
                }
                className="border rounded-xl p-2"
              />
              <input
                type="text"
                placeholder="Hospital Email"
                value={filters.hospitalEmail}
                onChange={(e) =>
                  setFilters({ ...filters, hospitalEmail: e.target.value })
                }
                className="border rounded-xl p-2"
              />
              <select
                value={filters.type}
                onChange={(e) =>
                  setFilters({ ...filters, type: e.target.value })
                }
                className="border rounded-xl p-2"
              >
                <option value="">All Types</option>
                {[...new Set(
                  bookings.map((b) => b.service?.type).filter(Boolean)
                )].map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
                className="border rounded-xl p-2"
              >
                <option value="">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto bg-white p-4 rounded-xl shadow-lg">
          <Table className="border border-gray-200">
            <TableHeader>
              <TableRow className="bg-gray-100">
                {columns.map((col) => (
                  <TableHead
                    key={col.key}
                    className="border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-900"
                  >
                    {col.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedBookings.length ? (
                paginatedBookings.map((b, index) => (
                  <TableRow
                    key={b.id}
                    className={`transition-colors duration-150 ease-in-out hover:bg-gray-50 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                    }`}
                  >
                    {columns.map((col) => (
                      <TableCell
                        key={col.key}
                        className="border border-gray-200 px-4 py-2 text-sm text-gray-700 whitespace-nowrap"
                      >
                        {col.render(b)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="text-center p-4 border border-gray-200"
                  >
                    No bookings found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between py-4">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="rounded-full border-2 px-3 border-[#243460] disabled:opacity-50"
            >
              Prev
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="rounded-full border-2 px-3 border-[#243460] disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllSurgeryTreatmentBookings;
