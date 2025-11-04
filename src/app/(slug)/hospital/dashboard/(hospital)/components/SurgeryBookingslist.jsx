"use client";
import React, { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import * as XLSX from "xlsx";
import { InputField, SelectField, DateFilter } from "@/app/components/input-selectui";
import HeadingClientMain from "@/app/components/heading";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import toast, { Toaster } from "react-hot-toast";
import { Checkbox } from '@/components/ui/checkbox';

const SurgeryBookingslist = ({ userdata ,doctors,bookings1}) => {
  console.log(doctors);
  const [filters, setFilters] = useState({
    patientName: "",
    mobile: "",
    email: "",
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
  const [loading, setLoading] = useState(false);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [selectedDoctors, setSelectedDoctors] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState(userdata || []);



  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const filteredData = useMemo(() => {
    return userdata.filter((row) => {
      const fullName = `${row.patient.firstName || ""} ${row.patient.lastName || ""}`.toLowerCase();
      const bookingDate = new Date(row.bookingDate);
      const from = filters.bookingDateFrom ? new Date(filters.bookingDateFrom) : null;
      const to = filters.bookingDateTo ? new Date(filters.bookingDateTo) : null;

      return (
        (!filters.patientName || fullName.includes(filters.patientName.toLowerCase())) &&
        (!filters.mobile || row.patient.mobile.includes(filters.mobile)) &&
        (!filters.email || row.patient.email.toLowerCase().includes(filters.email.toLowerCase())) &&
        (!filters.status || row.status.toLowerCase() === filters.status.toLowerCase()) &&
        (!from || bookingDate >= from) &&
        (!to || bookingDate <= to)
      );
    });
  }, [filters, userdata]);

const handleReschedule = (booking) => {
  setSelectedBooking(booking);

  setPreferredDate(
    booking.preferredDate ? new Date(booking.preferredDate) : new Date(booking.bookingDate)
  );

  // Parse time
  if (booking.preferredTimeSlot && booking.preferredTimeSlot.includes(":")) {
    const time = new Date(`1970-01-01T${booking.preferredTimeSlot}`);
    setPreferredTimeSlot(!isNaN(time.getTime()) ? time : null);
  } else {
    setPreferredTimeSlot(null);
  }

  setStatus(booking.status || "PENDING");

  // 🔹 Filter doctors by hospitalId (no API call needed)
  if (booking.service?.hospital?.id) {
    const doctorsForHospital = doctors.filter(
      (d) => d.hospitalId === booking.service.hospital.id
    );
    setFilteredDoctors(doctorsForHospital);
  } else {
    setFilteredDoctors([]);
  }

  setModalOpen(true);
};



  const handleUpdate = async () => {
  try {
    setLoading(true);

    // Update local state
    setFilteredBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking.id === selectedBooking.id
          ? {
              ...booking,
              status,
              preferredDate,
              preferredTimeSlot: preferredTimeSlot
                ? preferredTimeSlot.toTimeString().slice(0, 5)
                : "",
            }
          : booking
      )
    );

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
    console.error(err);
    toast.error("Error updating booking.");
  } finally {
    setLoading(false);
  }
};



  const columns = useMemo(
    () => [
      {
        accessorKey: "patientName",
        header: "Patient Name",
        cell: ({ row }) => {
          const { firstName, lastName } = row.original.patient;
          return `${firstName || ""} ${lastName || ""}`.trim() || "N/A";
        },
      },
      { accessorKey: "patient.mobile", header: "Mobile", cell: ({ row }) => row.original.patient.mobile },
      { accessorKey: "patient.email", header: "Email", cell: ({ row }) => row.original.patient.email },
      { accessorKey: "service.serviceName", header: "Service", cell: ({ row }) => row.original.service.serviceName },
      { accessorKey: "service.category", header: "Category", cell: ({ row }) => row.original.service.category },
      {
        accessorKey: "bookingDate",
        header: "Booking Date",
        cell: ({ row }) => format(new Date(row.original.bookingDate), "dd/MM/yyyy"),
      },
      {
        accessorKey: "preferredDate",
        header: "Preferred Date",
        cell: ({ row }) =>
          row.original.preferredDate
            ? format(new Date(row.original.preferredDate), "dd/MM/yyyy")
            : "N/A",
      },
      {
        accessorKey: "preferredTimeSlot",
        header: "Preferred Time Slot",
        cell: ({ row }) => row.original.preferredTimeSlot || "N/A",
      },
      { accessorKey: "status", header: "Status", cell: ({ row }) => row.original.status },
      { accessorKey: "notes", header: "Notes", cell: ({ row }) => row.original.notes || "N/A" },
      {
  accessorKey: "assignedDoctors",
  header: "Assigned Doctors",
  cell: ({ row }) => {
    const doctors = row.original.doctors || [];
    if (doctors.length === 0) return "N/A";

    return (
      <div className="flex flex-col">
        {doctors.map((d) => (
          <span key={d.id}>
            {d.doctor.firstName} {d.doctor.lastName} ({d.doctor.email})
          </span>
        ))}
      </div>
    );
  },
},
,
      {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button
              className="bg-blue-600 text-white hover:bg-blue-700 rounded-xl px-3 py-1"
              onClick={() => handleReschedule(row.original)}
            >
              Reschedule
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Surgery Bookings");
    XLSX.writeFile(wb, "surgery_bookings.xlsx");
  };
  const handleCheckboxChange = (checked, doctorId) => {
    if (checked) {
      setSelectedDoctors((prev) => [...prev, doctorId]);
    } else {
      setSelectedDoctors((prev) => prev.filter((id) => id !== doctorId));
    }
  };


  return (
    <div className="md:container font-poppins mx-auto">
      <div className="overflow-x-auto xs:px-2 min-[1000px]:px-0 min-[1100px]:px-[32px] container mx-auto min-[1000px]:w-[700px] min-[1100px]:w-[900px] xl:w-[1000px] xlg:w-[1200px] w-[350px] md:w-[700px] bg-white">
      <Toaster position="top-right" />

      <div className="text-center py-4">
        <HeadingClientMain main="Surgery Bookings" />
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
            <InputField label="Patient Name" id="patientName" value={filters.patientName} onChange={handleFilterChange} />
            <InputField label="Mobile" id="mobile" value={filters.mobile} onChange={handleFilterChange} />
            <InputField label="Email" id="email" value={filters.email} onChange={handleFilterChange} />
            <SelectField
              label="Status"
              id="status"
              value={filters.status}
              onChange={handleFilterChange}
              options={[
                { value: "", label: "All Statuses" },
                { value: "pending", label: "Pending" },
                { value: "confirmed", label: "Confirmed" },
                { value: "completed", label: "Completed" },
                { value: "cancelled", label: "Cancelled" },
              ]}
            />
            <DateFilter label="Booking Date From" id="bookingDateFrom" selected={filters.bookingDateFrom} onChange={handleFilterChange} />
            <DateFilter label="Booking Date To" id="bookingDateTo" selected={filters.bookingDateTo} onChange={handleFilterChange} />
          </div>
        </div>
      )}

      <div className="overflow-x-auto bg-white p-4 rounded-xl shadow-lg">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="border">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="border">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Reschedule Modal */}
      {modalOpen && selectedBooking && (
  <Dialog open={modalOpen} onOpenChange={setModalOpen}>
    <DialogContent className="sm:max-w-md bg-white">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Reschedule Booking</h2>

        {/* Doctor List */}
        <div className="rounded p-2 max-h-40 overflow-y-auto border">
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center gap-4 p-2 border-b last:border-none"
              >

                {/* Doctor Details */}
                <div className="flex flex-col flex-1">
                  <span className="text-sm font-medium">
                    {doc.doctor.firstName} {doc.doctor.lastName}
                  </span>
                  <span className="text-xs text-gray-500">
                    {doc.doctor.email}
                  </span>
                </div>

                {/* Checkbox */}
                <Checkbox
                  id={doc.doctor.id}
                  checked={selectedDoctors.includes(doc.doctor.id)}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(checked, doc.doctor.id)
                  }
                />
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm text-center p-4">
              No doctors found
            </p>
          )}
        </div>

        {/* Preferred Date */}
        <div>
          <label className="block mb-1">Preferred Date</label>
          <DatePicker
            selected={preferredDate instanceof Date ? preferredDate : null}
            onChange={(date) => setPreferredDate(date)}
            dateFormat="yyyy-MM-dd"
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Preferred Time */}
        <DatePicker
          selected={
            preferredTimeSlot instanceof Date && !isNaN(preferredTimeSlot)
              ? preferredTimeSlot
              : null
          }
          onChange={(date) => setPreferredTimeSlot(date)}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={15}
          timeCaption="Time"
          dateFormat="hh:mm aa"
          placeholderText="Select preferred time"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Status Dropdown */}
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

        {/* Buttons */}
        <div className="flex justify-end gap-2 pt-4">
          <Button
            variant="outline"
            className="rounded-xl"
            onClick={() => setModalOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            className="bg-blue-600 text-white hover:bg-blue-700 rounded-xl"
            onClick={handleUpdate}
            disabled={loading}
          >
            {loading ? "Updating..." : "Submit"}
          </Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
)}

    </div>
    </div>
  );
};

export default SurgeryBookingslist;
