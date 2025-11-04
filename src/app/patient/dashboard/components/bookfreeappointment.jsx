"use client";

import React, { useMemo, useState } from "react"
import "react-datepicker/dist/react-datepicker.css"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import * as XLSX from "xlsx"
import {
  CalendarDays,
  Clock,
  Stethoscope,
  FileText,
  UserCheck,
} from "lucide-react";
import { DateFilter, SelectField } from "@/app/components/input-selectui"
import HeadingClientMain from "@/app/components/heading"

const Bookfreeappointment = ({ userdata, categorytitle, doctortype }) => {
  const [filters, setFilters] = useState({})
  const [showFilters, setShowFilters] = useState(false)
  const [pageIndex, setPageIndex] = useState(0)
  const pageSize = 3;

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
    setPageIndex(0);
  };

  const normalizeDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    if (isNaN(d.getTime())) return null;
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  };

  const filteredData = useMemo(() => {
    return userdata.filter((row) => {
      return Object.entries(filters).every(([key, filterValue]) => {
        if (!filterValue) return true;

        if (key === "preferredDate") {
          const rowDate = normalizeDate(row.preferredDate);
          const filterDate = normalizeDate(filterValue);

          if (!rowDate || !filterDate) return false;

          return (
            rowDate.getFullYear() === filterDate.getFullYear() &&
            rowDate.getMonth() === filterDate.getMonth() &&
            rowDate.getDate() === filterDate.getDate()
          );
        }

        if (key === "category") {
          return row.category?.id === filterValue;
        }

        if (key === "status") {
          return row.status === filterValue;
        }

        return true;
      });
    });
  }, [userdata, filters]);

  const paginatedData = filteredData.slice(
    pageIndex * pageSize,
    pageIndex * pageSize + pageSize
  );

  const pageCount = Math.ceil(filteredData.length / pageSize);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData)
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Appointments")
    XLSX.writeFile(wb, "FreeAppointment_data.xlsx");
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { variant: "secondary", className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" },
      APPROVED: { variant: "default", className: "bg-green-100 text-green-800 hover:bg-green-200" },
      REJECTED: { variant: "destructive", className: "bg-red-100 text-red-800 hover:bg-red-200" },
    }

    const config = statusConfig[status] || statusConfig.PENDING
    return <Badge className={`${config.className} font-medium px-3 py-1 rounded-full`}>{status || "Pending"}</Badge>
  }

  // Define the date formatting functions
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "N/A";

      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      return "N/A";
    }
  };

  const formatTimeForDisplay = (timeString) => {
    if (!timeString) return "N/A";

    try {
      // If time is in "HH:mm AM/PM" format (like "05:30 PM")
      const match = timeString.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
      if (match) {
        let hours = parseInt(match[1], 10);
        const minutes = parseInt(match[2], 10);
        const period = match[3].toUpperCase();

        if (period === "PM" && hours < 12) hours += 12;
        if (period === "AM" && hours === 12) hours = 0;

        const date = new Date();
        date.setHours(hours);
        date.setMinutes(minutes);
        date.setSeconds(0);

        return date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      }

      // fallback
      const date = new Date(`1970-01-01T${timeString}`);
      if (!isNaN(date.getTime())) {
        return date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      }

      return timeString; // if parsing fails, show original
    } catch (e) {
      return timeString;
    }
  };


  return (
    <div className="container mx-auto font-poppins p-4 lg:p-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-blue-600 flex items-center justify-center gap-2">
              Your Doctor Appointments
            </h2>
            <p className="text-blue-600 mt-1">View and manage all your upcoming appointments</p>
          </div>

          {/* Top Actions */}
          <div className="flex justify-end gap-2 items-end">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-blue-500 rounded-xl text-white px-4 py-2 focus:outline-none hover:bg-blue-600 transition"
            >
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
            <Button
              onClick={exportToExcel}
              className="bg-green-500 rounded-xl text-white px-4 py-2 focus:outline-none hover:bg-green-600 transition"
            >
              Export to Excel
            </Button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 rounded-xl border border-gray-200 mt-4">
              <DateFilter
                label="Preferred Date"
                id="preferredDate"
                selected={filters["preferredDate"]}
                onChange={handleFilterChange}
              />
              <SelectField
                label="Category"
                id="category"
                value={filters["category"] || ""}
                onChange={handleFilterChange}
                options={[
                  { value: "", label: "All Categories" },
                  ...doctortype.map((cat) => ({
                    value: cat.id,
                    label: cat.title,
                  })),
                ]}
              />
              <SelectField
                label="Status"
                id="status"
                value={filters["status"] || ""}
                onChange={handleFilterChange}
                options={[
                  { value: "", label: "All Statuses" },
                  { value: "PENDING", label: "Pending" },
                  { value: "APPROVED", label: "Approved" },
                  { value: "REJECTED", label: "Rejected" },
                ]}
              />
            </div>
          )}
        </div>

        {/* Card View */}
        <div className="p-6">
          {paginatedData.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedData.map((row, index) => (
                <div
                  key={index}
                  className="group h-full overflow-hidden border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white"
                >
                  {/* Card Header */}
                  <div className="p-3 border-b bg-gradient-to-r from-blue-50 to-indigo-100 flex items-center">
                    <div className="flex items-center gap-3 w-full">
                      <div className="flex items-center justify-center rounded-full w-8 h-8 shadow-sm bg-blue-100 text-blue-600">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm truncate capitalize group-hover:text-blue-600 transition-colors">
                          {row.category?.title || "Appointment"}
                        </h3>
                        <p className="text-xs font-medium text-blue-700">
                          {formatDateForDisplay(row.preferredDate)}
                        </p>
                      </div>
                      {getStatusBadge(row.status)}
                    </div>
                  </div>

                  {/* Card Body - Now in two rows */}
                  <div className="p-4">
                    {/* First Row */}
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      {/* Booked Date */}
                      <div className="flex items-center gap-3 group-hover:bg-gray-50 p-2 rounded-lg transition-colors">
                        <div className="p-2 rounded-full bg-green-50 text-green-600">
                          <CalendarDays className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-medium text-gray-900 text-xs">Booked</h4>
                          <p className="text-gray-600 text-xs">
                            {formatDateForDisplay(row.createdAt)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 group-hover:bg-gray-50 p-2 rounded-lg transition-colors">
                        <div className="p-2 rounded-full bg-yellow-50 text-yellow-600">
                          <CalendarDays className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-medium text-gray-900 text-xs">Updated</h4>
                          <p className="text-gray-600 text-xs">
                            {formatDateForDisplay(row.updatedAt)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Second Row */}
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      {/* Preferred Date */}
                      <div className="flex items-center gap-3 group-hover:bg-gray-50 p-2 rounded-lg transition-colors">
                        <div className="p-2 rounded-full bg-indigo-50 text-indigo-600">
                          <CalendarDays className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-medium text-gray-900 text-xs">Preferred Date</h4>
                          <p className="text-gray-600 text-xs">
                            {formatDateForDisplay(row.preferredDate)}
                          </p>
                        </div>
                      </div>

                      {/* Preferred Time */}
                      <div className="flex items-center gap-3 group-hover:bg-gray-50 p-2 rounded-lg transition-colors">
                        <div className="p-2 rounded-full bg-pink-50 text-pink-600">
                          <Clock className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-medium text-gray-900 text-xs">Preferred Time</h4>
                          <p className="text-gray-600 text-xs">
                            {formatTimeForDisplay(row.preferredTime)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Doctor Info - Responsive row */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 group-hover:bg-gray-50 p-2 rounded-lg transition-colors">
                      {/* Assigned Doctor */}
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-purple-50 text-purple-600">
                          <Stethoscope className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-medium text-gray-900 text-xs">Assigned Doctor</h4>
                          <p className="text-gray-700 font-medium text-sm">{row.doctorFullName || "Not Assigned"}</p>
                        </div>
                      </div>

                      {/* Doctor Note */}
                      {row.doctorNotes && (
                        <div className="flex items-center gap-2 flex-1">
                          <div className="p-2 rounded-full bg-gray-100 text-gray-600">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 text-xs">Doctor Note</h4>
                            <p className="text-gray-500 text-xs italic">{row.doctorNotes}</p>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
              <p className="text-gray-500">Try adjusting your filters to see more results.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pageCount > 1 && (
          <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPageIndex(p => Math.max(p - 1, 0))}
                disabled={pageIndex === 0}
                className="rounded-xl"
              >
                Previous
              </Button>
              <div className="text-sm text-gray-600">
                Page {pageIndex + 1} of {pageCount}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPageIndex(p => Math.min(p + 1, pageCount - 1))}
                disabled={pageIndex >= pageCount - 1}
                className="rounded-xl"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookfreeappointment;