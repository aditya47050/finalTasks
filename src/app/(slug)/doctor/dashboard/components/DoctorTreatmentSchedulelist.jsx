"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, User, Phone, MapPin, FileText, Download, Filter, Search, Stethoscope } from "lucide-react"
import { format } from "date-fns"

const DoctorTreatmentSchedulelist = ({ bookings }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [showfilter, setShowfilter] = useState(false);

  // Get unique categories for filter
  const categories = useMemo(() => {
    const cats = bookings.map((booking) => booking.booking.service.category)
    return [...new Set(cats)]
  }, [bookings])

  // Filter bookings based on search and filters
  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const patient = booking.booking.patient
      const service = booking.booking.service
      const searchMatch =
        searchTerm === "" ||
        `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.mobile.includes(searchTerm)

      const statusMatch = statusFilter === "all" || booking.booking.status === statusFilter
      const categoryMatch = categoryFilter === "all" || service.category === categoryFilter

      const dateMatch =
        dateFilter === "" || format(new Date(booking.booking.preferredDate), "yyyy-MM-dd") === dateFilter

      return searchMatch && statusMatch && categoryMatch && dateMatch
    })
  }, [bookings, searchTerm, statusFilter, dateFilter, categoryFilter])

  const exportToExcel = () => {
    const csvContent = [
      ["Patient Name", "Mobile", "Treatment Type", "Category", "Date", "Time", "Status", "Hospital", "Doctor"],
      ...filteredBookings.map((booking) => [
        `${booking.booking.patient.firstName} ${booking.booking.patient.lastName}`,
        booking.booking.patient.mobile,
        booking.booking.service.serviceName,
        booking.booking.service.category,
        format(new Date(booking.booking.preferredDate), "dd/MM/yyyy"),
        booking.booking.preferredTimeSlot,
        booking.booking.status,
        booking.booking.service.hospital.email,
        `${booking.doctor.firstName} ${booking.doctor.lastName}`,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `treatment-schedule-${format(new Date(), "yyyy-MM-dd")}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4 animate-fade-in">
          <div className="flex flex-col items-center justify-center gap-3 mb-4">
            <div>
              <h1 className="text-[24px] text-[#2b73ec] font-extrabold inline-block">
                Treatment Schedule Management
              </h1>
            </div>
              <p className="text-[#243460] text-[13px] mt-1">
                Hospital-Assigned Treatment Bookings & Patient Care Coordination
              </p>
          </div>
        </div>

        {/* Filters and Search Section */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm animate-slide-up">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-end gap-4">
              <Button
                onClick={() => setShowfilter(!showfilter)}
                className="bg-blue-500 hover:bg-blue-500 text-white shadow-md transition-all duration-200 hover:shadow-lg rounded-xl"
                >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button
                onClick={exportToExcel}
                className="bg-green-600 hover:bg-green-700 text-white shadow-md transition-all duration-200 hover:shadow-lg rounded-xl"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Excel
              </Button>
            </div>
          </CardHeader>
          {
              showfilter && (
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                        placeholder="Search patients, treatments..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="border-gray-200 focus:border-blue-500">
                        <SelectValue placeholder="Filter by Status" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="border-gray-200 focus:border-blue-500">
                        <SelectValue placeholder="Filter by Category" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                            {category}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>

                    <Input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                    </div>
                </CardContent>
            )
          }
        </Card>

        {/* Treatment Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredBookings.map((booking, index) => (
            <Card
              key={booking.id}
              className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm hover:bg-white animate-fade-in-up overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="pb-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border-2 border-white/20">
                      <AvatarImage src={booking.booking.patient.passportPhoto || "/placeholder.svg"} />
                      <AvatarFallback className="bg-white/20 text-white font-semibold">
                        {booking.booking.patient.firstName[0]}
                        {booking.booking.patient.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg leading-tight">
                        {booking.booking.patient.firstName} {booking.booking.patient.lastName}
                      </h3>
                      <p className="text-blue-100 text-sm">
                        {booking.booking.patient.gender} • {booking.booking.patient.bloodgroup}
                      </p>
                    </div>
                  </div>
                  <Badge className={`${getStatusColor(booking.booking.status)} font-medium`}>
                    {booking.booking.status}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-4">
                {/* Treatment Information */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <Stethoscope className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm">{booking.booking.service.serviceName}</h4>
                      <p className="text-gray-600 text-xs mt-1">Category: {booking.booking.service.category}</p>
                      <p className="text-gray-600 text-xs">
                        Cost: ₹{booking.booking.service.minPrice} - ₹{booking.booking.service.maxPrice}
                      </p>
                    </div>
                  </div>

                  {/* Schedule Information */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                      <Calendar className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500">Treatment Date</p>
                        <p className="font-medium text-gray-900 text-sm">
                          {format(new Date(booking.booking.preferredDate), "dd MMM yyyy")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg">
                      <Clock className="h-4 w-4 text-orange-600 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500">Time Slot</p>
                        <p className="font-medium text-gray-900 text-sm">{booking.booking.preferredTimeSlot}</p>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium text-gray-900">{booking.booking.patient.mobile}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium text-gray-900">
                        {booking.booking.patient.city}, {booking.booking.patient.state}
                      </span>
                    </div>
                  </div>

                  {/* Doctor Information */}
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <User className="h-5 w-5 text-purple-600 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">Assigned Doctor</p>
                      <p className="font-semibold text-gray-900 text-sm">
                        Dr. {booking.doctor.firstName} {booking.doctor.lastName}
                      </p>
                      <p className="text-gray-600 text-xs">
                        {booking.doctor.education} • {booking.doctor.totalexperience} years exp.
                      </p>
                    </div>
                  </div>

                  {/* Notes */}
                  {booking.booking.notes && (
                    <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                      <FileText className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Notes</p>
                        <p className="text-sm text-gray-700">{booking.booking.notes}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Booking Details */}
                <div className="pt-3 border-t border-gray-100">
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>Booking ID: {booking.booking.id.slice(-8)}</span>
                    <span>Booked: {format(new Date(booking.booking.bookingDate), "dd MMM yyyy")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredBookings.length === 0 && (
          <Card className="text-center py-12 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent>
              <Stethoscope className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Treatment Bookings Found</h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== "all" || dateFilter || categoryFilter !== "all"
                  ? "Try adjusting your filters to see more results."
                  : "No treatment bookings have been assigned yet."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default DoctorTreatmentSchedulelist