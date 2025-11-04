"use client";
import { useMemo, useState } from "react";
import {
  Building2,
  CalendarDays,
  Phone,
  Filter,
  ListChecks,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";

const DAYS = [
  { value: "", label: "All Days" },
  { value: "Monday", label: "Monday" },
  { value: "Tuesday", label: "Tuesday" },
  { value: "Wednesday", label: "Wednesday" },
  { value: "Thursday", label: "Thursday" },
  { value: "Friday", label: "Friday" },
  { value: "Saturday", label: "Saturday" },
  { value: "Sunday", label: "Sunday" },
];

const to12Hour = (timeStr) => {
  if (!timeStr) return "";
  const [hourStr, minStr = "00"] = timeStr.split(":");
  let hour = parseInt(hourStr, 10);
  const minute = parseInt(minStr, 10);
  const period = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${minute.toString().padStart(2, "0")} ${period}`;
};

export default function HospitalDoctorSchedules({ doctor, schedules }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const pageSize = 3;

  // Filter schedules by Hospital Name and Day
  const filteredSchedules = useMemo(() => {
    return schedules.filter((s) => {
      const matchesHospital = s.hospital.regname?.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchesHospital) return false;
      if (!selectedDay) return true;
      if (!s.consultationDays) return false;
      return s.consultationDays
        .split(",")
        .map((d) => d.trim().toLowerCase())
        .includes(selectedDay.toLowerCase());
    });
  }, [searchTerm, selectedDay, schedules]);

  const paginatedData = filteredSchedules.slice(
    pageIndex * pageSize,
    (pageIndex + 1) * pageSize
  );
  const pageCount = Math.ceil(filteredSchedules.length / pageSize);

  // Export to Excel
  const exportToExcel = () => {
    const data = filteredSchedules.map((s) => ({
      Hospital: s.hospital.regname,
      Email: s.hospital.email,
      Mobile: s.hospital.mobile,
      ConsultationDays: s.consultationDays,
      Timing: (() => {
        if (!s.consultationTime) return "";
        try {
          const timeObj = JSON.parse(s.consultationTime);
          if (!s.consultationDays) return "";
          return s.consultationDays.split(",").map((d) => {
            const day = d.trim();
            const slots = timeObj[day] || [];
            return slots.length
              ? `${day}: ${slots.map(
                (slot) => `${to12Hour(slot.from)} - ${to12Hour(slot.to)}`
              ).join("; ")}`
              : `${day}: -`
          }).join(" | ");
        } catch {
          return "";
        }
      })(),
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Schedules");
    XLSX.writeFile(wb, "hospital_doctor_schedules.xlsx");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-blue-600 flex items-center justify-center gap-2">
            <ListChecks className="mr-2 h-6 w-6" />
            My Hospital Schedules
          </h2>
          <p className="text-sm text-blue-500">
            {doctor.firstName} {doctor.lastName}
          </p>
        </div>
        {/* Filters + Export */}
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
              <input
                type="text"
                className="border rounded-xl px-3 py-2 w-full"
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
                    <h3 className="font-semibold">{sch.hospital.regname || "Unnamed Hospital"}</h3>
                    <p className="text-xs text-gray-600">{sch.hospital.email}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-3">
                {/* Days & Time */}
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <CalendarDays className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Consultation Days & Timing</p>
                    <div className="text-sm text-gray-700">
                      {(() => {
                        try {
                          const dayArr = sch.consultationDays
                            ? sch.consultationDays.split(",").map((d) => d.trim())
                            : [];
                          const timingsObj = sch.consultationTime
                            ? JSON.parse(sch.consultationTime)
                            : {};
                          return dayArr.length
                            ? dayArr.map((day) => {
                                const slots = timingsObj[day];
                                if (!slots || slots.length === 0) return null;
                                const formattedSlots = slots
                                  .map(
                                    (slot) =>
                                      `${to12Hour(slot.from)} - ${to12Hour(slot.to)}`
                                  )
                                  .join(", ");
                                return (
                                  <p key={day} className="text-sm text-gray-700">
                                    <span className="font-semibold">{day}:</span>{" "}
                                    {formattedSlots}
                                  </p>
                                );
                              })
                            : "No days set";
                        } catch {
                          return (
                            <p className="text-sm text-red-600">
                              Invalid timing data
                            </p>
                          );
                        }
                      })()}
                    </div>
                  </div>
                </div>
                {/* Contact */}
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Phone className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Contact</p>
                    <p className="text-sm text-gray-700">
                      {sch.hospital.mobile || sch.hospital.email}
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No schedules found
            </h3>
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
  );
}