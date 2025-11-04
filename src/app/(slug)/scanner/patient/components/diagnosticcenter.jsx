"use client"
import { useState, useMemo } from "react"
import {
  Calendar,
  Clock,
  ClipboardList,
  CheckCircle,
  XCircle,
  ExternalLink,
  Building,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import * as XLSX from "xlsx"
import { DateFilter, SelectField } from "@/app/components/input-selectui"
import { UploadButton } from "@uploadthing/react"

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  COMPLETED: "bg-blue-100 text-blue-800"
}

export default function DiagnosticCenter({ bookings, diagnosticCenterId }) {
  const [pageIndex, setPageIndex] = useState(0)
  const pageSize = 3
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    status: "",
    bookingDate: null,
    preferredDate: null
  })
  const [localBookings, setLocalBookings] = useState(bookings)
  const [uploadLoadingIds, setUploadLoadingIds] = useState([]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }))
    setPageIndex(0)
  }

  const isUploading = (bookingId) => uploadLoadingIds.includes(bookingId);

  const setUploading = (bookingId, loading) => {
    setUploadLoadingIds((prev) =>
      loading ? [...prev, bookingId] : prev.filter((id) => id !== bookingId)
    );
  }

  const formatDate = (date) => {
    if (!date) return "Not specified"
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  }

  const normalizeDate = (date) => {
    if (!date) return null
    const d = new Date(date)
    if (isNaN(d.getTime())) return null
    return new Date(d.getFullYear(), d.getMonth(), d.getDate())
  }

  const filteredData = useMemo(() => {
    return localBookings.filter(booking => {
      if (filters.status && booking.status !== filters.status) return false

      if (filters.bookingDate) {
        const bookingDate = normalizeDate(booking.bookingDate)
        const filterDate = normalizeDate(filters.bookingDate)
        if (!bookingDate || !filterDate) return false
        if (
          bookingDate.getFullYear() !== filterDate.getFullYear() ||
          bookingDate.getMonth() !== filterDate.getMonth() ||
          bookingDate.getDate() !== filterDate.getDate()
        ) return false
      }

      if (filters.preferredDate) {
        const preferredDate = normalizeDate(booking.preferredDate)
        const filterDate = normalizeDate(filters.preferredDate)
        if (!preferredDate || !filterDate) return false
        if (
          preferredDate.getFullYear() !== filterDate.getFullYear() ||
          preferredDate.getMonth() !== filterDate.getMonth() ||
          preferredDate.getDate() !== filterDate.getDate()
        ) return false
      }

      return true
    })
  }, [filters, localBookings])

  const paginatedData = filteredData.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)
  const pageCount = Math.ceil(filteredData.length / pageSize)


  const handleFileUpload = async (bookingId, type, res) => {
    if (!res || res.length === 0) return
    const fileUrl = res[0].url

    try {
      const updatedBooking = await fetch(`/api/diagnostic-center/bookservices/upload`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, [type]: fileUrl }),
      })

      if (!updatedBooking.ok) throw new Error("Failed to save uploaded file")

      setLocalBookings(prev =>
        prev.map(b => (b.id === bookingId ? { ...b, [type]: fileUrl } : b))
      )

      alert(`${type === "report" ? "Report" : "Receipt"} uploaded successfully!`)
    } catch (err) {
      console.error(err)
      alert("Error uploading file")
    }
  }

  return (
    <div className="container mx-auto font-poppins p-4 lg:p-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="text-center mb-1">
            <h2 className="text-2xl font-bold text-blue-600 flex items-center justify-center gap-2">
              Patient's Diagnostic Service Bookings
            </h2>
            <p className="text-blue-600 mt-0.5">View All diagnostic test bookings Done By Patient's Till Date</p>
          </div>

          {/* Top Actions */}
          <div className="flex justify-end gap-1 py-4">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-blue-500 rounded-xl text-white px-4 py-2 focus:outline-none hover:bg-blue-600 transition"
            >
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
          </div>

          {/* Filters */}
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
        <div className="p-6">
          {paginatedData.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {paginatedData.map((booking) => (
                <div key={booking.id} className="group relative">
                  <div className="h-full flex flex-col justify-between bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden" style={{ minHeight: '300px' }}>
                    {/* Header */}
                    <div className="p-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-2">
                          <div className="flex items-center justify-center bg-blue-100 rounded-xl w-8 h-8 p-1.5">
                            <ClipboardList className="w-3.5 h-3.5 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 text-xs truncate group-hover:text-blue-600 transition-colors">
                              {booking.category || "Diagnostic"}
                            </h3>
                            <span className="text-blue-700">{booking.subCategory || "Test"}</span>
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

                    {/* Body */}
                    <div className="p-3 flex-1 flex flex-col gap-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center gap-2 p-1 rounded-lg group-hover:bg-gray-50 transition-colors">
                          <div className="p-1.5 bg-purple-100 rounded-full">
                            <ClipboardList className="w-3 h-3 text-purple-600" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-medium text-gray-900">Price Range</h4>
                            <p className="text-gray-600">₹{booking.minPrice || "0"} - ₹{booking.maxPrice || "0"}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 p-1 rounded-lg group-hover:bg-gray-50 transition-colors">
                          <div className="p-1.5 bg-green-100 rounded-full">
                            <Building className="w-3 h-3 text-green-600" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-medium text-gray-900">Facility</h4>
                            <p className="text-gray-700 truncate">{booking.facility || "N/A"}</p>
                          </div>
                        </div>
                      </div>

                      {/* Booked & Pref Date */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center gap-2 p-1 rounded-lg group-hover:bg-gray-50 transition-colors">
                          <div className="p-1.5 bg-blue-100 rounded-full">
                            <Calendar className="w-3 h-3 text-blue-600" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-medium text-gray-900">Booked On</h4>
                            <p className="text-gray-600 whitespace-nowrap">{formatDate(booking.bookingDate)}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 p-1 rounded-lg group-hover:bg-gray-50 transition-colors">
                          <div className="p-1.5 bg-indigo-100 rounded-full">
                            <Clock className="w-3 h-3 text-indigo-600" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-medium text-gray-900">Pref Date</h4>
                            <p className="text-gray-600 whitespace-nowrap">{booking.preferredDate ? formatDate(booking.preferredDate) : "Flexible"}</p>
                          </div>
                        </div>
                      </div>

                      {/* Hospital & Diagnostic Category */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center gap-2 p-1 rounded-lg group-hover:bg-gray-50 transition-colors">
                          <div className="p-1.5 bg-gray-100 rounded-full">
                            <Building className="w-3 h-3 text-gray-600" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-medium text-gray-900">Hospital</h4>
                            <p className="text-gray-600 truncate">{booking.hospitalRegName || "Not specified"}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 p-1 rounded-lg group-hover:bg-gray-50 transition-colors">
                          <div className="p-1.5 bg-orange-100 rounded-full">
                            <ClipboardList className="w-3 h-3 text-orange-600" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-medium text-gray-900">Diagnostic Category</h4>
                            <p className="text-gray-600 truncate">{booking.diagnosticCategory || "Not specified"}</p>
                          </div>
                        </div>
                      </div>

                      {booking.canUpload && (
                        <div className="flex items-center justify-between p-3 border-t border-gray-100">
                          <div>
                            <span className="font-medium text-gray-800 text-xs">Report:</span>
                            {booking.report ? (
                              <a href={booking.report} target="_blank" className="text-blue-600 underline ml-1">
                                View
                              </a>
                            ) : (
                              <UploadButton
                                endpoint="fileUploader"
                                onUploadBegin={() => setUploading(booking.id, true)}
                                onClientUploadComplete={(res) => {
                                  setUploading(booking.id, false);
                                  handleFileUpload(booking.id, "report", res);
                                }}
                                onUploadError={(err) => {
                                  setUploading(booking.id, false);
                                  alert(`Upload error: ${err.message}`);
                                }}
                                appearance={{
                                  button:
                                    "text-sm bg-blue-500 text-white font-semibold rounded-xl flex items-center justify-center hover:bg-blue-600 transition",
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
                              <a href={booking.receipt} target="_blank" className="text-green-600 underline ml-1">
                                View
                              </a>
                            ) : (
                              <UploadButton
                                endpoint="fileUploader"
                                onUploadBegin={() => setUploading(booking.id, true)}
                                onClientUploadComplete={(res) => {
                                  setUploading(booking.id, false);
                                  handleFileUpload(booking.id, "receipt", res);
                                }}
                                onUploadError={(err) => {
                                  setUploading(booking.id, false);
                                  alert(`Upload error: ${err.message}`);
                                }}
                                appearance={{
                                  button:
                                    "text-sm bg-green-500 text-white font-semibold rounded-xl flex items-center justify-center hover:bg-blue-600 transition",
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
                      {booking.diagnosticCategoryId && booking.hospitalId && (
                        <div className="mt-2 p-1">
                          <Link
                            href={`/diagnosticcenter/${booking.diagnosticCategoryId}/${booking.hospitalId}`}
                            className="w-full flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl text-[11px] font-medium transition-colors bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <ClipboardList className="w-3 h-3" />
                            <span>View Service</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <ClipboardList className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-1.5">No diagnostic bookings found</h3>
              <p className="text-gray-500 text-xs">Try adjusting your filters to see more results.</p>
            </div>
          )}
        </div>

        {/* Pagination Section */}
        {pageCount > 1 && (
          <div className="px-6 py-2 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
            <div className="flex items-center justify-between">
              <Button
                onClick={() => setPageIndex(p => Math.max(p - 1, 0))}
                disabled={pageIndex === 0}
                variant="outline"
                size="sm"
                className="rounded-full w-24 justify-center"
              >
                Previous
              </Button>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Page {pageIndex + 1} of {pageCount}</span>
                <span className="text-gray-400">•</span>
                <span>{filteredData.length} total bookings</span>
              </div>

              <Button
                onClick={() => setPageIndex(p => Math.min(p + 1, pageCount - 1))}
                disabled={pageIndex >= pageCount - 1}
                variant="outline"
                size="sm"
                className="rounded-full w-24 justify-center"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
