"use client";
import { useState, useMemo } from "react";
import {
  Calendar,
  Clock,
  ClipboardList,
  Building,
  ExternalLink,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";
import { DateFilter, SelectField } from "@/app/components/input-selectui";
import { UploadButton } from "@uploadthing/react";

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  COMPLETED: "bg-blue-100 text-blue-800",
};

const PathologyCenter = ({ bookings }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    bookingDate: null,
    preferredDate: null,
    serviceType: "", // New filter for service type
  });
  const [localBookings, setLocalBookings] = useState(bookings);
  const [uploadLoadingIds, setUploadLoadingIds] = useState([]);
  const [pageIndex, setPageIndex] = useState(0); // Pagination state
  const pageSize = 3; // Number of items per page

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPageIndex(0); // Reset to first page on filter change
  };

  const formatDateOnly = (date) => {
    if (!date) return "Flexible";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "Anytime";
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

  const normalizeDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    if (isNaN(d.getTime())) return null;
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  };
  
  const filteredData = useMemo(() => {
    return localBookings.filter((booking) => {
      if (filters.status && booking.status !== filters.status) return false;
      if (filters.serviceType && booking.type !== filters.serviceType) return false; // Filter by service type
      if (filters.bookingDate) {
        const bookingDate = normalizeDate(booking.bookingDate);
        const filterDate = normalizeDate(filters.bookingDate);
        if (bookingDate?.getTime() !== filterDate?.getTime()) return false;
      }
      if (filters.preferredDate) {
        const preferredDate = normalizeDate(booking.preferredDate);
        const filterDate = normalizeDate(filters.preferredDate);
        if (preferredDate?.getTime() !== filterDate?.getTime()) return false;
      }
      return true;
    });
  }, [filters, localBookings]);

  const paginatedData = filteredData.slice(
    pageIndex * pageSize,
    pageIndex * pageSize + pageSize
  );

  const pageCount = Math.ceil(filteredData.length / pageSize);

  return (
    <div className="container mx-auto font-poppins p-4 lg:p-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        {/* Header & Filters */}
        <div className="p-6 border-b border-gray-100">
          <div className="text-center mb-1">
            <h2 className="text-2xl font-bold text-blue-600 flex items-center justify-center gap-2">
              Patient Bookings
            </h2>
            <p className="text-blue-600 mt-0.5">
              View all bookings done by the patient till date.
            </p>
          </div>

          <div className="flex justify-end gap-2 py-4">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-blue-500 rounded-xl text-white px-4 py-2 hover:bg-blue-600 transition"
            >
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
              <SelectField
                label="Status"
                id="status"
                value={filters.status || ""}
                onChange={handleFilterChange}
                options={[
                  { value: "", label: "All Statuses" },
                  { value: "PENDING", label: "Pending" },
                  { value: "CONFIRMED", label: "Confirmed" },
                  { value: "CANCELLED", label: "Cancelled" },
                  { value: "COMPLETED", label: "Completed" },
                ]}
              />
              <SelectField
                label="Service Type"
                id="serviceType"
                value={filters.serviceType || ""}
                onChange={handleFilterChange}
                options={[
                  { value: "", label: "All Types" },
                  { value: "LabTest", label: "Lab Test" },
                  { value: "Wellness", label: "Wellness" },
                  { value: "Bloodbank", label: "Blood Bank" },
                ]}
              />
              <DateFilter
                label="Booking Date"
                id="bookingDate"
                selected={filters.bookingDate || null}
                onChange={handleFilterChange}
              />
              <DateFilter
                label="Preferred Date"
                id="preferredDate"
                selected={filters.preferredDate || null}
                onChange={handleFilterChange}
              />
            </div>
          )}
        </div>

        {/* Card View */}
        <div className="p-4">
          {paginatedData.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {paginatedData.map((booking, index) => {
                if (!booking.service) return null;

                let serviceTypePath = "";
                switch (booking.type) {
                  case "LabTest":
                    serviceTypePath = booking.service.nabl
                      ? `/pathology/nabl/${booking.service.id}/${booking.service.hospitalId}`
                      : `/pathology/category/${booking.service.id}/${booking.service.hospitalId}`;
                    break;
                  case "Wellness":
                    serviceTypePath = `/wellness/${booking.service.id}/${booking.service.hospitalId}`;
                    break;
                  case "Bloodbank":
                    serviceTypePath = `/bloodbank/${booking.service.id}/${booking.service.hospitalId}`;
                    break;
                  default:
                    serviceTypePath = "#";
                }

                return (
                  <div key={index} className="group relative">
                    <div className="h-full flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                      {/* Card Header */}
                      <div className="p-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-start gap-2">
                            <div className="flex items-center justify-center bg-blue-100 rounded-xl w-8 h-8 p-1.5">
                              <ClipboardList className="w-3.5 h-3.5 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 text-xs truncate group-hover:text-blue-600 transition-colors">
                                {booking.service.name || "Service"}
                              </h3>
                              <span className="text-blue-700">
                                {booking.type === "LabTest" && booking.service.nabl
                                  ? "NABL Lab Test"
                                  : booking.type}
                              </span>
                            </div>
                          </div>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full font-medium ${statusColors[booking.status] || "bg-gray-100 text-gray-800"
                              }`}
                          >
                            {booking.status}
                          </span>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-3 flex-1 flex flex-col gap-2">
                        {/* Price, Dates, Hospital */}
                        <div className="flex items-center gap-2 p-1 rounded-lg group-hover:bg-gray-50 transition-colors">
                          <div className="p-1.5 bg-purple-100 rounded-full">
                            <ClipboardList className="w-3 h-3 text-purple-600" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-medium text-gray-900 text-sm">Price</h4>
                            <p className="text-gray-600">
                              ₹{booking.service.finalprice} → ₹{booking.service.price}
                              {booking.service.discount && (
                                <span className="ml-1 text-xs text-green-600">
                                  ({booking.service.discount}% off)
                                </span>
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-start gap-2 p-1 rounded-lg group-hover:bg-gray-50 transition-colors">
                            <div className="p-1.5 bg-blue-100 rounded-full">
                              <Calendar className="w-3 h-3 text-blue-600" />
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-medium text-gray-900 text-sm">Booked On</h4>
                              <p className="text-gray-600 whitespace-nowrap">
                                {formatDateOnly(booking.bookingDate)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2 p-1 rounded-lg group-hover:bg-gray-50 transition-colors">
                            <div className="p-1.5 bg-indigo-100 rounded-full">
                              <Clock className="w-3 h-3 text-indigo-600" />
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-medium text-gray-900 text-sm">
                                Preferred Date & Time
                              </h4>
                              <p className="text-gray-600 whitespace-nowrap">
                                {booking.preferredDate
                                  ? formatDateOnly(booking.preferredDate)
                                  : "Flexible"}
                                <br />
                                {booking.preferredTimeSlot && (
                                  <span>{formatTime(booking.preferredTimeSlot)}</span>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start gap-2 p-1 rounded-lg group-hover:bg-gray-50 transition-colors">
                          <div className="p-1.5 bg-gray-100 rounded-full">
                            <Building className="w-3 h-3 text-gray-600" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-medium text-gray-900 text-sm">Hospital</h4>
                            <p className="text-gray-600 truncate">
                              {booking.service.hospitalName || "Not specified"}
                            </p>
                          </div>
                        </div>

                        {/* Upload Section */}
                        {booking.canUpload && (
                          <div className="flex items-center justify-between p-3 border-t border-gray-100">
                            <div>
                              <span className="font-medium text-gray-800 text-xs">Report:</span>
                              {booking.report ? (
                                <a
                                  href={booking.report}
                                  target="_blank"
                                  className="text-blue-600 underline ml-1"
                                >
                                  View
                                </a>
                              ) : (
                                <UploadButton
                                  endpoint="fileUploader"
                                  onUploadBegin={() => setUploading(booking.id, true)}
                                  onClientUploadComplete={(res) => {
                                    setUploading(booking.id, false);
                                    handleFileUpload(booking.id, booking.type, "report", res);
                                  }}
                                  onUploadError={(err) => {
                                    setUploading(booking.id, false);
                                    alert(`Upload error: ${err.message}`);
                                  }}
                                  appearance={{
                                    button: "text-sm bg-blue-500 text-white font-semibold rounded-xl flex items-center justify-center hover:bg-blue-600 transition",
                                    container: "inline-block ml-1",
                                    allowedContent: "text-xs text-gray-500",
                                  }}
                                  asChild
                                >
                                  <button disabled={isUploading(booking.id)}>
                                    {isUploading(booking.id) ? (
                                      <span className="animate-spin">
                                        <Loader2 className="w-5 h-5" />
                                      </span>
                                    ) : (
                                      "Upload"
                                    )}
                                  </button>
                                </UploadButton>
                              )}
                            </div>
                            <div>
                              <span className="font-medium text-gray-800 text-xs">Receipt:</span>
                              {booking.receipt ? (
                                <a
                                  href={booking.receipt}
                                  target="_blank"
                                  className="text-green-600 underline ml-1"
                                >
                                  View
                                </a>
                              ) : (
                                <UploadButton
                                  endpoint="fileUploader"
                                  onUploadBegin={() => setUploading(booking.id, true)}
                                  onClientUploadComplete={(res) => {
                                    setUploading(booking.id, false);
                                    handleFileUpload(booking.id, booking.type, "receipt", res);
                                  }}
                                  onUploadError={(err) => {
                                    setUploading(booking.id, false);
                                    alert(`Upload error: ${err.message}`);
                                  }}
                                  appearance={{
                                    button: "text-sm bg-green-500 text-white font-semibold rounded-xl flex items-center justify-center hover:bg-green-600 transition",
                                    container: "inline-block ml-1",
                                    allowedContent: "text-xs text-gray-500",
                                  }}
                                  asChild
                                >
                                  <button disabled={isUploading(booking.id)}>
                                    {isUploading(booking.id) ? (
                                      <span className="animate-spin">
                                        <Loader2 className="w-5 h-5" />
                                      </span>
                                    ) : (
                                      "Upload"
                                    )}
                                  </button>
                                </UploadButton>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Action Button */}
                        <div className="mt-2 p-1">
                          <Link
                            href={serviceTypePath}
                            className="w-full flex items-center justify-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[11px] font-medium transition-colors"
                          >
                            <ClipboardList className="w-3 h-3" />
                            <span>View Service</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <ClipboardList className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-1.5">No bookings found</h3>
              <p className="text-gray-500 text-xs">
                Try adjusting your filters to see more results.
              </p>
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
                onClick={() => setPageIndex((p) => Math.max(p - 1, 0))}
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
                onClick={() => setPageIndex((p) => Math.min(p + 1, pageCount - 1))}
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

export default PathologyCenter;
