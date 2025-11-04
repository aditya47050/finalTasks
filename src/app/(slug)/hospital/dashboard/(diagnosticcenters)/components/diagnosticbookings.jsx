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
import {
  InputField,
  SelectField,
  DateFilter,
} from "@/app/components/input-selectui";
import HeadingClientMain from "@/app/components/heading";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import {Loader2 } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { UploadButton } from "@uploadthing/react";


const DiagnosticBookingsClient = ({ userdata }) => {
  const [bookings, setBookings] = useState(userdata);
  const [filters, setFilters] = useState({
    patientName: "",
    mobile: "",
    email: "",
    city: "",
    service: "",
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

  const toggleFilters = () => setShowFilters((prev) => !prev);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const filteredData = useMemo(() => {
    return userdata.filter((row) => {
      const fullName = `${row.patient.firstName} ${
        row.patient.middleName || ""
      } ${row.patient.lastName}`.toLowerCase();
      const bookingDate = new Date(row.bookingDate);
      const from = filters.bookingDateFrom
        ? new Date(filters.bookingDateFrom)
        : null;
      const to = filters.bookingDateTo ? new Date(filters.bookingDateTo) : null;

      return (
        (!filters.patientName ||
          fullName.includes(filters.patientName.toLowerCase())) &&
        (!filters.mobile || row.patient.mobile.includes(filters.mobile)) &&
        (!filters.email ||
          row.patient.email
            .toLowerCase()
            .includes(filters.email.toLowerCase())) &&
        (!filters.city ||
          row.patient.city
            .toLowerCase()
            .includes(filters.city.toLowerCase())) &&
        (!filters.service ||
          row.service.facility
            .toLowerCase()
            .includes(filters.service.toLowerCase())) &&
        (!filters.status ||
          row.status.toLowerCase() === filters.status.toLowerCase()) &&
        (!from || bookingDate >= from) &&
        (!to || bookingDate <= to)
      );
    });
  }, [filters, userdata]);

  const handleFileUpload = async (bookingId, type, res) => {
    if (!res || res.length === 0) return;
  
    const fileUrl = res[0].url;
  
    try {
      const updatedBooking = await fetch(`/api/diagnostic-center/bookservices/upload`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          [type]: fileUrl, // dynamically set either 'report' or 'receipt'
        }),
      });
  
      if (!updatedBooking.ok) throw new Error("Failed to save uploaded file");
  
      // Update state locally for immediate UI update
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, [type]: fileUrl } : b))
      );
  
      alert(`${type === "report" ? "Report" : "Receipt"} uploaded successfully!`);
    } catch (err) {
      console.error(err);
      alert("Error uploading file");
    }
  };
  

  const columns = useMemo(
    () => [
      {
        accessorKey: "patientName",
        header: "Patient Name",
        cell: ({ row }) => {
          const { firstName, middleName, lastName } = row.original.patient;
          return [firstName, middleName, lastName].filter(Boolean).join(" ");
        },
      },
      {
        accessorKey: "patient.mobile",
        header: "Mobile",
        cell: ({ row }) => row.original.patient.mobile,
      },
      {
        accessorKey: "patient.email",
        header: "Email",
        cell: ({ row }) => row.original.patient.email,
      },
      {
        accessorKey: "patient.city",
        header: "City",
        cell: ({ row }) => row.original.patient.city,
      },
      {
        accessorKey: "service.subCategory",
        header: "Service",
        cell: ({ row }) => row.original.service.subCategory,
      },
      {
        accessorKey: "bookingDateTime",
        header: "Booking Date & Time",
        cell: ({ row }) => {
          const bookingDate = new Date(row.original.bookingDate);
          return `${bookingDate.toLocaleDateString()} ${bookingDate.toLocaleTimeString()}`;
        },
      },
      {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <Dialog>
            <DialogTrigger asChild>
              <Button
                onClick={() => openModal(row.original)}
                className="w-30 h-10 text-sm bg-purple-500 text-white font-semibold rounded-xl flex items-center justify-center hover:bg-purple-600 transition"
              >
                Reschedule
              </Button>
            </DialogTrigger>
          </Dialog>
        ),
      },
      
      {
        accessorKey: "report",
        header: "Report",
        cell: ({ row }) => {
          const booking = row.original;
          const [uploadLoading, setUploadLoading] = useState(false);
      
          const setFieldLoading = (value) => setUploadLoading(value);
      
          return booking.report ? (
            <a
              href={booking.report}
              target="_blank"
              className="text-blue-600 underline"
            >
              View Report
            </a>
          ) : (
            <UploadButton
  endpoint="fileUploader"
  onUploadBegin={() => setFieldLoading(true)}
  onClientUploadComplete={(res) => {
    setFieldLoading(false);
    handleFileUpload(booking.id, "report", res);
  }}
  onUploadError={(err) => {
    setFieldLoading(false);
    alert(`Upload error: ${err.message}`);
  }}
  appearance={{
    button:
      "w-20 h-10 text-sm bg-blue-500 text-white font-semibold rounded-xl flex items-center justify-center hover:bg-blue-600 transition",
    container: "w-full flex flex-col gap-1 items-center",
    allowedContent: "text-xs text-gray-500",
  }}
  asChild
>
  <button disabled={uploadLoading}>
    {uploadLoading ? (
      <span className="animate-spin">
        <Loader2 className="w-5 h-5" />
      </span>
    ) : (
      "Upload Report"
    )}
  </button>
</UploadButton>

          );
        },
      },
      {
        accessorKey: "receipt",
        header: "Receipt",
        cell: ({ row }) => {
          const booking = row.original;
          const [uploadLoading, setUploadLoading] = useState(false);
      
          const setFieldLoading = (value) => setUploadLoading(value);
      
          return booking.receipt ? (
            <a
              href={booking.receipt}
              target="_blank"
              className="text-green-600 underline"
            >
              View Receipt
            </a>
          ) : (
            <UploadButton
            endpoint="fileUploader"
            onUploadBegin={() => setFieldLoading(true)}
            onClientUploadComplete={(res) => {
              setFieldLoading(false);
              handleFileUpload(booking.id, "receipt", res);
            }}
            onUploadError={(err) => {
              setFieldLoading(false);
              alert(`Upload error: ${err.message}`);
            }}
            appearance={{
              button:
                "w-20 h-10 text-sm bg-green-500 text-white font-semibold rounded-xl flex items-center justify-center hover:bg-green-600 transition",
              container: "w-full flex flex-col gap-1 items-center",
              allowedContent: "text-xs text-gray-500",
            }}
            asChild
          >
            <button disabled={uploadLoading}>
              {uploadLoading ? (
                <span className="animate-spin">
                  <Loader2 className="w-5 h-5" />
                </span>
              ) : (
                "Upload Receipt"
              )}
            </button>
          </UploadButton>
          
          );
        },
      },
      
      
      
    ],
    []
  );



  const openModal = (booking) => {
    setSelectedBooking(booking);
    setPreferredDate(new Date(booking.preferredDate || booking.bookingDate));

    // ✅ Convert "HH:mm" string to Date object
    if (booking.preferredTimeSlot) {
      const [hour, minute] = booking.preferredTimeSlot.split(":").map(Number);
      const time = new Date();
      time.setHours(hour);
      time.setMinutes(minute);
      time.setSeconds(0);

      // Check if the time is valid
      if (!isNaN(time.getTime())) {
        setPreferredTimeSlot(time);
      } else {
        console.error("Invalid time value:", booking.preferredTimeSlot);
        setPreferredTimeSlot(null);
      }
    } else {
      setPreferredTimeSlot(null);
    }

    setStatus(booking.status || "PENDING");
    setModalOpen(true);
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(
        `/api/diagnostic-center/bookservices/reschedule`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bookingId: selectedBooking.id,
            preferredDate,
            preferredTimeSlot: preferredTimeSlot
              ? preferredTimeSlot.toTimeString().slice(0, 5) // "HH:mm"
              : "",
            status,
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to update");
      alert("Booking updated!");
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Error updating booking.");
    }
  };

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Diagnostic Bookings");
    XLSX.writeFile(wb, "diagnostic_bookings.xlsx");
  };

  return (
    <div className="container mx-auto font-poppins">
      <div className="text-center py-4">
        <HeadingClientMain main={"Diagnostic Bookings"} />
      </div>
      <div className="flex justify-end gap-2 items-end">
        <button
          onClick={toggleFilters}
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
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Filter Data
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <InputField
              label="Patient Name"
              id="patientName"
              placeholder="Search by Name"
              value={filters.patientName}
              onChange={handleFilterChange}
            />
            <InputField
              label="Mobile"
              id="mobile"
              placeholder="Search by Mobile"
              value={filters.mobile}
              onChange={handleFilterChange}
            />
            <InputField
              label="Email"
              id="email"
              placeholder="Search by Email"
              value={filters.email}
              onChange={handleFilterChange}
            />
            <InputField
              label="City"
              id="city"
              placeholder="Search by City"
              value={filters.city}
              onChange={handleFilterChange}
            />
            <InputField
              label="Service"
              id="service"
              placeholder="Search by Service"
              value={filters.service}
              onChange={handleFilterChange}
            />
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
            <DateFilter
              label="Booking Date From"
              id="bookingDateFrom"
              selected={filters.bookingDateFrom}
              onChange={handleFilterChange}
            />
            <DateFilter
              label="Booking Date To"
              id="bookingDateTo"
              selected={filters.bookingDateTo}
              onChange={handleFilterChange}
            />
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
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
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

      {modalOpen && selectedBooking && (
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="sm:max-w-md bg-white">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Reschedule Booking</h2>

              <div>
                <label className="block mb-1">Preferred Date</label>
                <DatePicker
                  selected={preferredDate}
                  onChange={(date) => setPreferredDate(date)}
                  dateFormat="yyyy-MM-dd"
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              <div>
                <label className="block mb-1">Preferred Time Slot</label>
                <DatePicker
                  selected={preferredTimeSlot}
                  onChange={(date) => setPreferredTimeSlot(date)}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="Time"
                  dateFormat="hh:mm aa"
                  placeholderText="Select preferred time"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

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
                >
                  Cancel
                </Button>
                <Button
                  className="bg-blue-600 text-white hover:bg-blue-700 rounded-xl"
                  onClick={handleUpdate}
                >
                  Submit
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default DiagnosticBookingsClient;
