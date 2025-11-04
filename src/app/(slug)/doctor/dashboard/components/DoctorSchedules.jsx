"use client"

import { useMemo, useState } from "react"
import {
  Building2,
  Clock,
  CalendarDays,
  Download,
  MapPin,
  Phone,
  IndianRupee,
  Filter,
  ListChecks,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import * as XLSX from "xlsx"
import { Input } from "@/components/ui/input"

const DAYS = [
  { value: "", label: "All Days" },
  { value: "Monday", label: "Monday" },
  { value: "Tuesday", label: "Tuesday" },
  { value: "Wednesday", label: "Wednesday" },
  { value: "Thursday", label: "Thursday" },
  { value: "Friday", label: "Friday" },
  { value: "Saturday", label: "Saturday" },
  { value: "Sunday", label: "Sunday" },
]

// Helpers
const to12Hour = (timeStr) => {
  const [hourStr, minStr = "00"] = timeStr.split(":")
  let hour = parseInt(hourStr)
  const minute = parseInt(minStr)
  const period = hour >= 12 ? "PM" : "AM"
  hour = hour % 12 || 12
  return `${hour}:${minute.toString().padStart(2, "0")} ${period}`
}

const getFormattedTime = (jsonStr, day) => {
  if (!jsonStr || !day) return "N/A"
  try {
    const parsed = JSON.parse(jsonStr)
    const slots = parsed[day]
    if (!Array.isArray(slots) || slots.length === 0) return "N/A"
    return slots.map((slot) => `${to12Hour(slot.from)} - ${to12Hour(slot.to)}`).join(", ")
  } catch {
    return "Invalid timing format"
  }
}

export default function DoctorSchedules({ doctor, schedules }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDay, setSelectedDay] = useState("")
  const [pageIndex, setPageIndex] = useState(0)
  const [showFilters, setShowFilters] = useState(false)
  const pageSize = 6

  const filteredSchedules = useMemo(() => {
    return schedules.filter((s) => {
      const matchesHospital = s.hospitalname?.toLowerCase().includes(searchTerm.toLowerCase())
      if (!matchesHospital) return false
      if (!selectedDay) return true
      // Check if selectedDay is in hospitalconsultationdays (comma separated)
      if (!s.hospitalconsultationdays) return false
      return s.hospitalconsultationdays
        .split(",")
        .map((d) => d.trim().toLowerCase())
        .includes(selectedDay.toLowerCase())
    })
  }, [searchTerm, selectedDay, schedules])

  const paginatedData = filteredSchedules.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)
  const pageCount = Math.ceil(filteredSchedules.length / pageSize)

  const exportToExcel = () => {
    const data = filteredSchedules.map((s) => ({
      Hospital: s.hospitalname,
      Address: s.presentAddress,
      City: s.city,
      State: s.state,
      Pincode: s.pincode,
      ConsultationFee: s.hospitalconsultationfee,
      ConsultationDays: s.hospitalconsultationdays,
      Contact: s.hospitalcontactno,
      Timing: getFormattedTime(s.hospitalinouttime, s.hospitalconsultationdays),
    }))
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Schedules")
    XLSX.writeFile(wb, "doctor_schedules.xlsx")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-blue-600 flex items-center justify-center gap-2">
            <ListChecks className="mr-2 h-6 w-6" />
            My Schedules
          </h2>
          <p className="text-sm text-blue-500">
            {doctor.firstName} {doctor.lastName}
          </p>
        </div>

        {/* Filters + Buttons */}
        <div className="flex justify-end gap-2 pb-2">
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            className="bg-blue-500 text-white rounded-xl hover:bg-blue-600"
          >
            <Filter className="h-4 w-4 mr-1" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
          <Button
            onClick={exportToExcel}
            variant="outline"
            className="bg-green-500 text-white rounded-xl hover:bg-green-600"
          >
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </div>

        {/* Search & Day Filter */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 p-4 rounded-xl">
            <div>
              <label className="block text-sm font-medium mb-1">Hospital Name</label>
              <Input
                placeholder=" "
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Select Day</label>
              <select
                className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
              >
                {DAYS.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Schedule Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 rounded-xl">
        {paginatedData.length > 0 ? (
          paginatedData.map((sch) => (
            <div
              key={sch.id}
              className="border rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 bg-white"
            >
              <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Building2 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{sch.hospitalname || "Unnamed Hospital"}</h3>
                    <p className="text-sm text-gray-600">{sch.presentAddress}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-3">
                {/* Row 1: Days & Time */}
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <CalendarDays className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Consultation Days And Timing</p>
                    <p className="text-sm text-gray-700">
                      {(() => {
                        try {
                          const dayArr = sch.hospitalconsultationdays.split(",").map(d => d.trim())
                          const timingsObj = JSON.parse(sch.hospitalinouttime)
                          return dayArr.map((day) => {
                            const slots = timingsObj[day]
                            if (!slots || slots.length === 0) return null
                            const formattedSlots = slots
                              .map(slot => `${to12Hour(slot.from)} - ${to12Hour(slot.to)}`)
                              .join(", ")
                            return (
                              <p key={day} className="text-sm text-gray-700">
                                <span className="font-semibold">{day}:</span> {formattedSlots}
                              </p>
                            )
                          })
                        } catch {
                          return <p className="text-sm text-red-600">Invalid timing data</p>
                        }
                      })()}
                    </p>
                  </div>
                </div>

                {/* Row 2: Fee & Contact */}
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <IndianRupee className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Fee</p>
                    <p className="text-sm text-gray-700">₹{sch.hospitalconsultationfee}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Phone className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Contact</p>
                    <p className="text-sm text-gray-700">{sch.hospitalcontactno}</p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-pink-100 rounded-lg">
                    <MapPin className="h-4 w-4 text-pink-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-sm text-gray-700">
                      {[sch.city, sch.district, sch.state, sch.pincode].filter(Boolean).join(", ")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No schedules found</h3>
            <p className="text-gray-500">Try adjusting your filters</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pageCount > 1 && (
        <div className="flex items-center justify-between border-t pt-4">
          <Button
            className="rounded-xl bg-transparent"
            variant="outline"
            onClick={() => setPageIndex(Math.max(0, pageIndex - 1))}
            disabled={pageIndex === 0}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {pageIndex + 1} of {pageCount}
          </span>
          <Button
            className="rounded-xl bg-transparent"
            variant="outline"
            onClick={() => setPageIndex(Math.min(pageCount - 1, pageIndex + 1))}
            disabled={pageIndex >= pageCount - 1}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}