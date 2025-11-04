"use client"
import { useState, useMemo } from "react"
import {
  Calendar,
  Clock,
  ClipboardList,
  Building,
  CheckCircle,
  XCircle,
  Clock as PendingIcon,
  ExternalLink,
  Download,
  Filter,
  X,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import * as XLSX from "xlsx"
import { DateFilter, SelectField } from "@/app/components/input-selectui"

const statusIcons = {
  PENDING: <PendingIcon className="w-4 h-4 text-yellow-500" />,
  CONFIRMED: <CheckCircle className="w-4 h-4 text-green-500" />,
  CANCELLED: <XCircle className="w-4 h-4 text-red-500" />,
  COMPLETED: <CheckCircle className="w-4 h-4 text-blue-500" />
}

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  COMPLETED: "bg-blue-100 text-blue-800"
}

export default function WellnessCenter({ bookings}) {
  const [pageIndex, setPageIndex] = useState(0)
  const pageSize = 3
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    status: "",
    bookingDate: null,
    preferredDate: null
  })
  // util formatter
const formatDateOnly = (date) => {
  if (!date) return "Flexible";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }); // Example: Sep 30, 2025
};

const formatTime = (timeString) => {
  if (!timeString) return "Anytime";
  return timeString; // your slot is already like "01:00 PM"
};


  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }))
    setPageIndex(0)
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
  return bookings.filter((booking) => {
    // Status filter
    if (filters.status && booking.status !== filters.status) return false;

    // Booking date filter
    if (filters.bookingDate) {
      const bookingDate = normalizeDate(booking.bookingDate);
      const filterDate = normalizeDate(filters.bookingDate);
      if (
        bookingDate?.getTime() !== filterDate?.getTime()
      ) {
        return false;
      }
    }

    // Preferred date filter
    if (filters.preferredDate) {
      const preferredDate = normalizeDate(booking.preferredDate);
      const filterDate = normalizeDate(filters.preferredDate);
      if (
        preferredDate?.getTime() !== filterDate?.getTime()
      ) {
        return false;
      }
    }

    return true;
  });
}, [filters, bookings]);

//   const paginatedData = filteredData.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)
//   const pageCount = Math.ceil(filteredData.length / pageSize)

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Pathology Bookings")
    XLSX.writeFile(wb, "pathlogy_bookings.xlsx")
  }

  return (
    <div className="container mx-auto font-poppins p-4 lg:p-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="text-center mb-1">
            <h2 className="text-2xl font-bold text-blue-600 flex items-center justify-center gap-2">
              Wellness Package Service Bookings
            </h2>
            <p className="text-blue-600 mt-0.5">View and manage your wellness package bookings</p>
          </div>

          {/* Top Actions */}
          <div className="flex justify-end gap-1 py-4">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-blue-500 rounded-xl text-white px-4 py-2 focus:outline-none hover:bg-blue-600 transition"
            >
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
            <Button
              onClick={exportToExcel}
              className="bg-green-400 rounded-xl text-white px-4 py-2 focus:outline-none hover:bg-green-400 transition"
            >
              Export to Excel
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
        <div className="p-4">
  {filteredData.length ? (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      { filteredData.map((matchingServices, index) => (
          matchingServices.service !== null && (
            <div key={index} className="group relative">
              {/* Card Container */}
              <div className="h-full flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                
                {/* Card Header */}
                <div className="p-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center justify-between">
  <div className="flex items-start gap-2 flex-1"> 
    <div className="flex items-center justify-center bg-blue-100 rounded-xl w-8 h-8 p-1.5">
      <ClipboardList className="w-3.5 h-3.5 text-blue-600" />
    </div>
    <div className="flex-1 min-w-0">
      <h3 className="font-semibold text-gray-900 text-xs truncate group-hover:text-blue-600 transition-colors">
        {matchingServices?.service.aapackagename}  ({matchingServices?.service.labpackagename})
      </h3>
      <span className="text-blue-700">
        {"Wellnes Package"}
      </span>
    </div>
  </div>

  <span
  className={`inline-flex items-center px-2 py-1 rounded-full font-medium text-sm ${statusColors[matchingServices.status] || "bg-gray-100 text-gray-800"}`}
>
  {matchingServices.status}
</span>

</div>
                </div>
    
                {/* Card Body */}
                <div className="p-3 flex-1 flex flex-col gap-2">
                  
                  {/* Price Row */}
                  <div className="flex items-center gap-2 p-1 rounded-lg group-hover:bg-gray-50 transition-colors">
                    <div className="p-1.5 bg-purple-100 rounded-full">
                      <ClipboardList className="w-3 h-3 text-purple-600" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm">Price</h4>
                      <p className="text-gray-600">
                        ₹{matchingServices?.service.price || 0} → ₹{matchingServices?.service.finalpackageprice || 0}
                        {matchingServices?.service.discount && (
                          <span className="ml-1 text-xs text-green-600">
                            ({matchingServices.service.discount}% off)
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
    
                  {/* Booking Dates */}
                  <div className="grid grid-cols-2 gap-2 ">
                    <div className="flex items-start  gap-2 p-1 rounded-lg group-hover:bg-gray-50 transition-colors">
                      <div className="p-1.5 bg-blue-100 rounded-full">
                        <Calendar className="w-3 h-3 text-blue-600" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-medium text-gray-900 text-sm">Booked On</h4>
                        <p className="text-gray-600 whitespace-nowrap">
                          {formatDate(bookings[0].bookingDate)}
                        </p>
                      </div>
                    </div>
                    {/* Preferred Date */}
                    <div className="flex items-start gap-2 p-1 rounded-lg group-hover:bg-gray-50 transition-colors">
                    <div className="p-1.5 bg-indigo-100 rounded-full">
                        <Clock className="w-3 h-3 text-indigo-600" />
                    </div>
                    <div className="min-w-0">
                        <h4 className="font-medium text-gray-900 text-sm">Preferred Date & Time</h4>
                        <p className="text-gray-600 whitespace-nowrap">
                        {matchingServices.preferredDate ? formatDateOnly(matchingServices.preferredDate) : "Flexible"}
                        <br/>
                        {matchingServices.preferredTimeSlot && (
                            <span> {formatTime(matchingServices.preferredTimeSlot)}</span>
                        )}
                        </p>
                    </div>
                    </div>
    
                  </div>
    
                  {/* Hospital */}
                  <div className="flex items-start gap-2 p-1 rounded-lg group-hover:bg-gray-50 transition-colors">
                    <div className="p-1.5 bg-gray-100 rounded-full">
                      <Building className="w-3 h-3 text-gray-600" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm">Hospital</h4>
                      <p className="text-gray-600 truncate">
                        {matchingServices.Hospital?.hspInfo?.regname || "Not specified"}
                      </p>
                    </div>
                  </div>
    
                  {/* Action Button */}
                  {matchingServices.hospitalId && (
                    <div className="mt-2 p-1">
                      <Link
                        href={`/pathology/${matchingServices.service.id}/${matchingServices.hospitalId}`}
                        className="w-full flex items-center justify-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[11px] font-medium transition-colors"
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
          )
      ))}
    </div>
  ) : (
    <div className="text-center py-12">
      <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
        <ClipboardList className="w-6 h-6 text-gray-400" />
      </div>
      <h3 className="text-sm font-medium text-gray-900 mb-1.5">
        No diagnostic bookings found
      </h3>
      <p className="text-gray-500 text-xs">
        Try adjusting your filters to see more results.
      </p>
    </div>
  )}
</div>


        {/* Pagination Section */}
        {/* {pageCount > 1 && (
          <div className="px-6 py-2 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
            <div className="flex items-center justify-between"> */}
              {/* Previous Button */}
              {/* <Button
                onClick={() => setPageIndex((p) => Math.max(p - 1, 0))}
                disabled={pageIndex === 0}
                variant="outline"
                size="sm"
                className="rounded-full w-24 justify-center"
              >
                Previous
              </Button> */}

              {/* Page Info */}
              {/* <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>
                  Page {pageIndex + 1} of {pageCount}
                </span>
                <span className="text-gray-400">•</span>
                <span>{filteredData.length} total bookings</span>
              </div> */}

              {/* Next Button */}
              {/* <Button
                onClick={() => setPageIndex((p) => Math.min(p + 1, pageCount - 1))}
                disabled={pageIndex >= pageCount - 1}
                variant="outline"
                size="sm"
                className="rounded-full w-24 justify-center"
              >
                Next
              </Button>
            </div>
          </div> */}


        {/* )} */}
      </div>
    </div>
  )
}