"use client"

import { useState, useMemo } from "react"
import { format } from "date-fns"
import { Bed, Ambulance, CalendarCheck, Stethoscope, ChevronLeft, ChevronRight, FileText, Calendar, ExternalLink, Download, Hospital, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Scissors } from "lucide-react";

const BookingTypeIcon = ({ type }) => {
  switch (type) {
    case "appointment":
      return <CalendarCheck className="w-4 h-4 text-blue-600" />
    case "bed":
      return <Bed className="w-4 h-4 text-green-600" />
    case "ambulance":
      return <Ambulance className="w-4 h-4 text-red-600" />
    case "diagnostic":
      return <Stethoscope className="w-4 h-4 text-purple-600" />
    case "surgery":
      return <Scissors className="w-4 h-4 text-pink-600" />;
    case "treatment":
      return <Stethoscope className="w-4 h-4 text-pink-600" />
    default:
      return null
  }
}

const BookingCard = ({ booking, type }) => {
  return (
    <div className="group h-full overflow-hidden border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white">
      {/* Card Header with gradient background */}
      <div className={`p-3 border-b ${type === 'appointment' ? 'bg-gradient-to-r from-blue-50 to-blue-100' :
        type === 'bed' ? 'bg-gradient-to-r from-green-50 to-green-100' :
          type === 'ambulance' ? 'bg-gradient-to-r from-red-50 to-red-100' :
            type === 'diagnostic' ? 'bg-gradient-to-r from-purple-50 to-purple-100' :
              type === 'surgery' ? 'bg-gradient-to-r from-pink-50 to-pink-100' :
                type === 'treatment' ? 'bg-gradient-to-r from-teal-50 to-teal-100' :
                  'bg-gradient-to-r from-indigo-50 to-indigo-100'} flex items-center`}>

        <div className="flex items-center gap-3 w-full">
          {/* Changed rounded-lg to rounded-full for circular shape */}
          <div className={`flex items-center justify-center rounded-full w-8 h-8 shadow-sm ${type === 'appointment' ? 'bg-blue-100 text-blue-600' :
            type === 'bed' ? 'bg-green-100 text-green-600' :
              type === 'ambulance' ? 'bg-red-100 text-red-600' :
                type === 'diagnostic' ? 'bg-purple-100 text-purple-600' :
                  type === 'surgery' ? 'bg-pink-100 text-pink-600' :
                    type === 'treatment' ? 'bg-teal-100 text-teal-600' :
                      'bg-indigo-100 text-indigo-600'}`}>
            <BookingTypeIcon type={type} className="w-4 h-4" />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-gray-900 text-sm truncate capitalize group-hover:text-blue-600 transition-colors">
              {type} Booking
            </h3>
            <p className={`text-xs font-medium ${type === 'appointment' ? 'text-blue-700' :
              type === 'bed' ? 'text-green-700' :
                type === 'ambulance' ? 'text-red-700' :
                  type === 'diagnostic' ? 'text-purple-700' :
                    type === 'surgery' ? 'text-pink-700' :
                      type === 'treatment' ? 'text-pink-700' :
                        'text-indigo-700'}`}>
              {format(new Date(booking.date), "MMM dd, yyyy hh:mm a")}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* Common Fields */}
        <div className="flex items-center gap-3 group-hover:bg-gray-50 p-2 rounded-lg transition-colors">
          <div className={`p-2 rounded-full ${type === 'appointment' ? 'bg-blue-50 text-blue-600' :
            type === 'bed' ? 'bg-green-50 text-green-600' :
              type === 'ambulance' ? 'bg-red-50 text-red-600' :
                type === 'diagnostic' ? 'bg-purple-50 text-purple-600' :
                  type === 'surgery' ? 'bg-pink-50 text-pink-600' :
                    type === 'treatment' ? 'bg-teal-50 text-teal-600' :
                      'bg-indigo-50 text-indigo-600'}`}>
            <Calendar className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-medium text-gray-900 text-xs">Booking Date</h4>
            <p className="text-gray-600 text-xs">{format(new Date(booking.date), "MMM dd, yyyy hh:mm a")}</p>
          </div>
        </div>

        {/* Type Specific Fields */}
        {type === "appointment" && (
          <>
            <div className="flex items-center gap-3 group-hover:bg-gray-50 p-2 rounded-lg transition-colors">
              <div className="p-2 rounded-full bg-blue-50 text-blue-600">
                <Stethoscope className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-medium text-gray-900 text-xs">Doctor</h4>
                <p className="text-gray-600 text-xs truncate">{booking.doctorName || "N/A"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 group-hover:bg-gray-50 p-2 rounded-lg transition-colors">
              <div className="p-2 rounded-full bg-green-50 text-green-600">
                <FileText className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-medium text-gray-900 text-xs">Status</h4>
                <p className="text-gray-600 text-xs capitalize">{booking.status.toLowerCase() || "N/A"}</p>
              </div>
            </div>
          </>
        )}

        {type === "bed" && (
          <>
            <div className="flex items-center gap-3 group-hover:bg-gray-50 p-2 rounded-lg transition-colors">
              <div className="p-2 rounded-full bg-green-50 text-green-600">
                <Bed className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-medium text-gray-900 text-xs">Bed Category</h4>
                <p className="text-gray-600 text-xs truncate">{booking.bedCategory || "N/A"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 group-hover:bg-gray-50 p-2 rounded-lg transition-colors">
              <div className="p-2 rounded-full bg-blue-50 text-blue-600">
                <Hospital className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-medium text-gray-900 text-xs">Hospital</h4>
                <p className="text-gray-600 text-xs truncate">{booking.hospitalName || "N/A"}</p>
              </div>
            </div>
          </>
        )}

        {type === "ambulance" && (
          <>
            <div className="flex items-center gap-3 group-hover:bg-gray-50 p-2 rounded-lg transition-colors">
              <div className="p-2 rounded-full bg-green-50 text-green-600">
                <Ambulance className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-medium text-gray-900 text-xs">Type</h4>
                <p className="text-gray-600 text-xs truncate">{booking.ambulanceType || "N/A"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 group-hover:bg-gray-50 p-2 rounded-lg transition-colors">
              <div className="p-2 rounded-full bg-blue-50 text-blue-600">
                <Hospital className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-medium text-gray-900 text-xs">Hospital</h4>
                <p className="text-gray-600 text-xs truncate">{booking.hospitalName || "N/A"}</p>
              </div>
            </div>
          </>
        )}

        {type === "diagnostic" && (
          <>
            <div className="flex items-center gap-3 group-hover:bg-gray-50 p-2 rounded-lg transition-colors">
              <div className="p-2 rounded-full bg-green-50 text-green-600">
                <Stethoscope className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-medium text-gray-900 text-xs">Test</h4>
                <p className="text-gray-600 text-xs truncate">{booking.category || "N/A"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 group-hover:bg-gray-50 p-2 rounded-lg transition-colors">
              <div className="p-2 rounded-full bg-blue-50 text-blue-600">
                <Hospital className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-medium text-gray-900 text-xs">Facility</h4>
                <p className="text-gray-600 text-xs truncate">{booking.hospitalName || "N/A"}</p>
              </div>
            </div>
          </>
        )}

        {type === "surgery" && (
          <>
            <div className="flex items-center gap-3 group-hover:bg-gray-50 p-2 rounded-lg transition-colors">
              <div className="p-2 rounded-full bg-green-50 text-green-600">
                <Scissors className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-medium text-gray-900 text-xs">Surgery Name</h4>
                <p className="text-gray-600 text-xs truncate">{booking.surgeryName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 group-hover:bg-gray-50 p-2 rounded-lg transition-colors">
              <div className="p-2 rounded-full bg-blue-50 text-blue-600">
                <FileText className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-medium text-gray-900 text-xs">Status</h4>
                <p className="text-gray-600 text-xs capitalize">{booking.status.toLowerCase()}</p>
              </div>
            </div>
          </>
        )}
        {type === "treatment" && (
          <>
            <div className="flex items-center gap-3 group-hover:bg-gray-50 p-2 rounded-lg transition-colors">
              <div className="p-2 rounded-full bg-green-50 text-green-600">
                <Stethoscope className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-medium text-gray-900 text-xs">Treatment Name</h4>
                <p className="text-gray-600 text-xs truncate">
                  {booking.treatmentName || "N/A"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 group-hover:bg-gray-50 p-2 rounded-lg transition-colors">
              <div className="p-2 rounded-full bg-blue-50 text-blue-600">
                <FileText className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-medium text-gray-900 text-xs">Status</h4>
                <p className="text-gray-600 text-xs capitalize">
                  {booking.status?.toLowerCase() || "N/A"}
                </p>
              </div>
            </div>
          </>
        )}


      </div>
    </div>
  )
}

const UpcomingSchedule = ({ bookings }) => {
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(3) // Changed to 3 cards per page
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateRange, setDateRange] = useState({ from: undefined, to: undefined })
  const [bookingType, setBookingType] = useState("all")

  // Combine all bookings
  const allBookings = useMemo(() => [
    ...bookings.appointments.map((b) => ({ ...b, type: "appointment" })),
    ...bookings.bedBookings.map((b) => ({ ...b, type: "bed" })),
    ...bookings.ambulanceBookings.map((b) => ({ ...b, type: "ambulance" })),
    ...bookings.diagnosticBookings.map((b) => ({ ...b, type: "diagnostic" })),
    ...bookings.surgeryBookings.map(b => ({ ...b, type: "surgery" })),
    ...bookings.treatmentBookings.map(b => ({ ...b, type: "treatment" })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date)), [bookings])

  // Filter logic
  const filteredBookings = useMemo(() => {
    const typeFiltered = bookingType === "all"
      ? allBookings
      : allBookings.filter(booking => booking.type === bookingType)

    return typeFiltered.filter((booking) => {
      const hasStatus = ["appointment", "diagnostic"].includes(booking.type)
      const matchesStatus = statusFilter === "all" || (hasStatus && booking.status === statusFilter)

      return matchesStatus
    })
  }, [bookingType, statusFilter, allBookings])



  // Pagination logic
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage)
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { variant: "secondary", className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" },
      APPROVED: { variant: "default", className: "bg-green-100 text-green-800 hover:bg-green-200" },
      REJECTED: { variant: "destructive", className: "bg-red-100 text-red-800 hover:bg-red-200" },
    }
  }

  const resetFilters = () => {
    setStatusFilter("all")
    setDateRange({ from: undefined, to: undefined })
    setCurrentPage(1)
  }

  const handleExport = () => {
    console.log("Exporting bookings...")
  }



  return (
    <div className="container mx-auto font-poppins p-4 lg:p-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-blue-600 flex items-center justify-center gap-2">
              Your Upcoming Bookings
            </h2>
            <p className="text-blue-600 mt-1">View and manage all your upcoming medical bookings</p>
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
              onClick={handleExport}
              className="bg-green-400 rounded-xl text-white px-4 py-2 focus:outline-none hover:bg-green-400 transition"
            >
              Export to Excel
            </Button>
          </div>

          {/* Filters - Only shown when showFilters is true */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl border border-gray-200 mt-4">
              {/* Booking Type Filter */}
              <div className="flex flex-col w-full">
                <label className="text-xs font-medium text-gray-700">Booking Type</label>
                <Select
                  value={bookingType}
                  onValueChange={(value) => {
                    setBookingType(value)
                    setCurrentPage(1)
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Booking Types</SelectItem>
                    <SelectItem value="appointment">Appointments</SelectItem>
                    <SelectItem value="bed">Bed Bookings</SelectItem>
                    <SelectItem value="ambulance">Ambulances</SelectItem>
                    <SelectItem value="diagnostic">Diagnostics</SelectItem>
                    <SelectItem value="surgery">Surgery Bookings</SelectItem>
                    <SelectItem value="treatment">Treatment Bookings</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div className="flex flex-col w-full">
                <label className="text-xs font-medium text-gray-700">Status</label>
                <Select
                  value={statusFilter}
                  onValueChange={(value) => {
                    setStatusFilter(value)
                    setCurrentPage(1)
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="APPROVED">Approved</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        {/* Booking Cards */}
        <div className="p-6">
          {paginatedBookings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedBookings.map((booking) => (
                <BookingCard key={`${booking.type}-${booking.id}`} booking={booking} type={booking.type} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CalendarCheck className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
              <p className="text-gray-500">Try adjusting your filters to see more results.</p>
            </div>
          )}
        </div>

        {/* Simplified Pagination */}
        {filteredBookings.length > 0 && (
          <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="rounded-xl"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              <div className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage >= totalPages}
                className="rounded-xl"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UpcomingSchedule