"use client";

import { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Loader2, FileSpreadsheet } from "lucide-react";
import HeadingClientMain from "@/app/components/heading";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import * as XLSX from "xlsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import toast, { Toaster } from "react-hot-toast";

export default function TreatmentBookingsList({ bookings = [], doctors = [] }) {
  const [filteredBookings, setFilteredBookings] = useState(bookings);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    bookingDateFrom: "",
    bookingDateTo: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [preferredDate, setPreferredDate] = useState(null);
  const [preferredTimeSlot, setPreferredTimeSlot] = useState(null);
  const [status, setStatus] = useState("PENDING");
  const [isLoading, setIsLoading] = useState(false);
  const [isCancelling, setIsCancelling] = useState({});
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [selectedDoctors, setSelectedDoctors] = useState([]);

  // ✅ Filtering Logic
  useEffect(() => {
    let filtered = bookings;

    if (searchTerm) {
      filtered = filtered.filter((booking) => {
        const patientName = `${booking.patient.firstName} ${booking.patient.lastName}`.toLowerCase();
        return (
          patientName.includes(searchTerm.toLowerCase()) ||
          booking.service.serviceName.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    if (filters.status) {
      filtered = filtered.filter(
        (booking) => booking.status.toLowerCase() === filters.status.toLowerCase()
      );
    }

    if (filters.bookingDateFrom || filters.bookingDateTo) {
      const from = filters.bookingDateFrom ? new Date(filters.bookingDateFrom) : null;
      const to = filters.bookingDateTo ? new Date(filters.bookingDateTo) : null;

      filtered = filtered.filter((booking) => {
        const bookingDate = new Date(booking.bookingDate);
        return (!from || bookingDate >= from) && (!to || bookingDate <= to);
      });
    }

    setFilteredBookings(filtered);
  }, [searchTerm, bookings, filters]);

  // ✅ Reschedule Handler
  const handleReschedule = (booking) => {
    setSelectedBooking(booking);
  
    const bookingDateSafe = booking.bookingDate && !isNaN(new Date(booking.bookingDate))
      ? new Date(booking.bookingDate)
      : null;
    const preferredDateSafe = booking.preferredDate && !isNaN(new Date(booking.preferredDate))
      ? new Date(booking.preferredDate)
      : bookingDateSafe;
  
    setPreferredDate(preferredDateSafe);
  
    if (booking.preferredTimeSlot && booking.preferredTimeSlot.includes(":")) {
      const [hour, minute] = booking.preferredTimeSlot.split(":").map(Number);
      const time = new Date();
      time.setHours(hour, minute, 0);
      setPreferredTimeSlot(!isNaN(time.getTime()) ? time : null);
    } else {
      setPreferredTimeSlot(null);
    }
  
    setStatus(booking.status || "PENDING");
  
    // Assign all available doctors for this hospital
    setFilteredDoctors(doctors);
  
    // Preselect assigned doctors (if your booking data has field: doctors: [{doctor: {...}}])
    if (booking.doctors && booking.doctors.length > 0) {
      setSelectedDoctors(booking.doctors.map(d => d.doctor.id));
    } else {
      setSelectedDoctors([]);
    }
  
    setModalOpen(true);
  };

  // ✅ Update Booking
  const handleUpdate = async () => {
    setIsLoading(true);

      // Optimistically update the local state first
      setFilteredBookings(prevBookings =>
        prevBookings.map(booking =>
          booking.id === selectedBooking.id
            ? {
                ...booking,
                status,
                preferredDate,
                preferredTimeSlot: preferredTimeSlot
                  ? preferredTimeSlot.toTimeString().slice(0, 5)
                  : null,
                // If you want to show assigned doctors immediately:
                doctors: filteredDoctors.filter(doc =>
                  selectedDoctors.includes(doc.doctor.id)
                ).map(doc => ({ doctor: doc.doctor })),
              }
            : booking
        )
      );
    try {
      const res = await fetch(`/api/hospital/bookservices/reschedule`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: selectedBooking.id,
          preferredDate,
          preferredTimeSlot: preferredTimeSlot
            ? preferredTimeSlot.toTimeString().slice(0, 5)
            : "",
          status,
          doctorIds: selectedDoctors, 
        }),
      });
      if (!res.ok) throw new Error("Failed to update");
      toast.success("Booking updated successfully!");
      setModalOpen(false);
    } catch (err) {
      toast.error("Error updating booking.");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Filter Change
  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  // ✅ Export to Excel
  const exportToExcel = () => {
    const data = filteredBookings.map((b) => ({
      Patient: `${b.patient.firstName} ${b.patient.lastName}`,
      Mobile: b.patient.mobile,
      Email: b.patient.email,
      Treatment: b.service.serviceName,
      Hospital: b.service.hospital?.hspInfo?.regname || "N/A",
      BookingDate: b.bookingDate
        ? format(new Date(b.bookingDate), "dd/MM/yyyy")
        : "N/A",
      PreferredDate: b.preferredDate
        ? format(new Date(b.preferredDate), "dd/MM/yyyy")
        : "N/A",
      TimeSlot: b.preferredTimeSlot || "-",
      Status: b.status,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Treatment Bookings");
    XLSX.writeFile(wb, "treatment_bookings.xlsx");
  };

  return (
    <div className="container mx-auto font-poppins">
      <Toaster position="top-right" />

      <div className="text-center py-4">
        <HeadingClientMain main="Treatment Bookings" />
      </div>

      <div className="flex justify-end gap-2 items-end">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="bg-blue-500 rounded-xl text-white px-4 py-2 hover:bg-blue-600 transition"
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
        <button
          onClick={exportToExcel}
          className="bg-green-400 rounded-xl text-white px-4 py-2 hover:bg-green-500 transition"
        >
          Export to Excel
        </button>
      </div>

      {showFilters && (
        <div className="bg-white rounded-xl px-6 pb-6 mb-4">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Filter Data</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div>
              <label className="text-sm font-medium mb-1 block">Status</label>
              <Select
                value={filters.status}
                onValueChange={(v) => handleFilterChange("status", v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">From Date</label>
              <DatePicker
                selected={
                  filters.bookingDateFrom
                    ? new Date(filters.bookingDateFrom)
                    : null
                }
                onChange={(date) => handleFilterChange("bookingDateFrom", date)}
                dateFormat="yyyy-MM-dd"
                className="w-full border px-3 py-2 rounded text-sm"
                placeholderText="Select start date"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">To Date</label>
              <DatePicker
                selected={
                  filters.bookingDateTo
                    ? new Date(filters.bookingDateTo)
                    : null
                }
                onChange={(date) => handleFilterChange("bookingDateTo", date)}
                dateFormat="yyyy-MM-dd"
                className="w-full border px-3 py-2 rounded text-sm"
                placeholderText="Select end date"
              />
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto bg-white p-4 rounded-xl shadow-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="border">Patient</TableHead>
              <TableHead className="border">Mobile</TableHead>
              <TableHead className="border">Email</TableHead>
              <TableHead className="border">Treatment</TableHead>
              <TableHead className="border">Hospital</TableHead>
              <TableHead className="border">Booking Date</TableHead>
              <TableHead className="border">Preferred Date</TableHead>
              <TableHead className="border">Time</TableHead>
              <TableHead className="border">Status</TableHead>
              <TableHead className="border">Assigned Doctors</TableHead>
              <TableHead className="border">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="border">
                    {booking.patient.firstName} {booking.patient.lastName}
                  </TableCell>
                  <TableCell className="border">{booking.patient.mobile}</TableCell>
                  <TableCell className="border">{booking.patient.email}</TableCell>
                  <TableCell className="border">{booking.service.serviceName}</TableCell>
                  <TableCell className="border">
                    {booking.service.hospital?.hspInfo?.regname || "N/A"}
                  </TableCell>
                  <TableCell className="border">
                    {booking.bookingDate
                      ? format(new Date(booking.bookingDate), "dd/MM/yyyy")
                      : "N/A"}
                  </TableCell>
                  <TableCell className="border">
                    {booking.preferredDate
                      ? format(new Date(booking.preferredDate), "dd/MM/yyyy")
                      : "N/A"}
                  </TableCell>
                  <TableCell className="border">{booking.preferredTimeSlot || "-"}</TableCell>
                  <TableCell className="border">
                    <Badge variant={booking.status === "CONFIRMED" ? "default" : "secondary"}>
                      {booking.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="border">
  {(booking.doctors || []).map(d => (
    <div key={d.doctor.id}>
      {d.doctor.firstName} {d.doctor.lastName}
    </div>
  ))}
</TableCell>
                  <TableCell className="border">
                    <div className="flex gap-2">
                      <Button
                        className="bg-blue-600 text-white hover:bg-blue-700 rounded-xl px-3 py-1"
                        onClick={() => handleReschedule(booking)}
                      >
                        Reschedule
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8">
                  No treatment bookings found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Reschedule Modal */}
      {modalOpen && selectedBooking && (
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="sm:max-w-md bg-white">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Reschedule Booking</h2>
{/* Doctors Selection */}
<div className="rounded p-2 max-h-40 overflow-y-auto border">
  {filteredDoctors.length > 0 ? (
    filteredDoctors.map((doc) => (
      <div key={doc.id} className="flex items-center gap-4 p-2 border-b last:border-none">
        <div className="flex flex-col flex-1">
          <span className="text-sm font-medium">
            {doc.doctor.firstName} {doc.doctor.lastName}
          </span>
          <span className="text-xs text-gray-500">{doc.doctor.email}</span>
        </div>
        <input
          type="checkbox"
          id={doc.doctor.id}
          checked={selectedDoctors.includes(doc.doctor.id)}
          onChange={e => {
            if (e.target.checked) {
              setSelectedDoctors(prev => [...prev, doc.doctor.id]);
            } else {
              setSelectedDoctors(prev => prev.filter(id => id !== doc.doctor.id));
            }
          }}
        />
      </div>
    ))
  ) : (
    <p className="text-gray-500 text-sm text-center p-4">No doctors found</p>
  )}
</div>
              <div>
                <label className="block mb-1">Preferred Date</label>
                <DatePicker
                  selected={preferredDate instanceof Date ? preferredDate : null}
                  onChange={(date) => setPreferredDate(date)}
                  dateFormat="yyyy-MM-dd"
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              <DatePicker
                selected={preferredTimeSlot instanceof Date && !isNaN(preferredTimeSlot) ? preferredTimeSlot : null}
                onChange={(date) => setPreferredTimeSlot(date)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="hh:mm aa"
                placeholderText="Select preferred time"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />

              <div>
                <label className="block mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => setModalOpen(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-blue-600 text-white hover:bg-blue-700 rounded-xl"
                  onClick={handleUpdate}
                  disabled={isLoading}
                >
                  {isLoading ? "Updating..." : "Submit"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}