// e:/system/aarogya-aadhar/src/app/(slug)/hospital/dashboard/(pathology)/components/BookingsClient.jsx
"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UploadButton } from "@uploadthing/react";
import { Loader2 } from "lucide-react";
import * as XLSX from "xlsx";
import { InputField, SelectField } from "@/app/components/input-selectui";
import HeadingClientMain from "@/app/components/heading";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const BookingsClient = ({ bookings: initialBookings }) => {
  const [bookings, setBookings] = useState(initialBookings);
  const [filters, setFilters] = useState({
    patientName: "",
    mobile: "",
    email: "",
    city: "",
    service: "",
    status: "",
    serviceType: "",
    bookingDate: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [preferredDate, setPreferredDate] = useState(null);
  const [preferredTimeSlot, setPreferredTimeSlot] = useState(null);
  const [status, setStatus] = useState("PENDING");
  const [uploadStates, setUploadStates] = useState({});
  const [loading, setLoading] = useState(false); // Loading state for reschedule

  const toggleFilters = () => setShowFilters((prev) => !prev);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const setUploading = (bookingId, isLoading) => {
    setUploadStates((prev) => ({
      ...prev,
      [bookingId]: isLoading,
    }));
  };

  const filteredData = useMemo(() => {
    if (!bookings || !Array.isArray(bookings)) {
      return [];
    }

    return bookings.filter((row) => {
      if (!row) return false;

      try {
        const fullName = `${row.patient?.firstName || ""} ${row.patient?.middleName || ""} ${row.patient?.lastName || ""}`.toLowerCase().trim();
        const mobile = row.patient?.mobile || "";
        const email = row.patient?.email || "";
        const city = row.patient?.city || "";
        const serviceName = row.serviceName || "";
        const serviceType = row.serviceType || "";
        const rowStatus = (row.status || "").toLowerCase();
        const bookingDate = new Date(row.bookingDate);
        const selectedDate = filters.bookingDate ? new Date(filters.bookingDate) : null;

        const nameMatch = !filters.patientName || fullName.includes(filters.patientName.toLowerCase());
        const mobileMatch = !filters.mobile || mobile.toString().includes(filters.mobile);
        const emailMatch = !filters.email || email.toLowerCase().includes(filters.email.toLowerCase());
        const cityMatch = !filters.city || city.toLowerCase().includes(filters.city.toLowerCase());
        const serviceMatch = !filters.service || serviceName.toLowerCase().includes(filters.service.toLowerCase());
        const serviceTypeMatch = !filters.serviceType || serviceType === filters.serviceType;
        const statusMatch = !filters.status || rowStatus === filters.status.toLowerCase();
        const dateMatch = !selectedDate || bookingDate.toDateString() === selectedDate.toDateString();

        return nameMatch && mobileMatch && emailMatch && cityMatch && serviceMatch && serviceTypeMatch && statusMatch && dateMatch;
      } catch (error) {
        console.error("Error filtering row:", error, row);
        return false;
      }
    });
  }, [filters, bookings]);

  const handleFileUpload = async (bookingId, uploadType, res, booking) => {
    if (!res || res.length === 0) return;

    const fileUrl = res[0].url;

    let type = booking?.serviceType || booking?.type;
    if (!type) {
      alert("Booking type is undefined. Cannot upload file.");
      return;
    }

    if (type === "LabTest" || type.toLowerCase() === "labtest") type = "LabTest";
    else if (type === "WellnessPackage" || type.toLowerCase() === "wellness") type = "Wellness";
    else if (type === "BloodBank" || type.toLowerCase() === "bloodbank") type = "Bloodbank";
    else {
      alert(`Invalid booking type: ${type}`);
      return;
    }

    try {
      const response = await fetch(`/api/pathology/upload`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          type,
          report: uploadType === "report" ? fileUrl : undefined,
          receipt: uploadType === "receipt" ? fileUrl : undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save uploaded file");
      }

      // Update local state to reflect the uploaded file
      setBookings((prevBookings) =>
        prevBookings.map((b) =>
          b.id === bookingId ? { ...b, [uploadType]: fileUrl } : b
        )
      );

      alert(`${uploadType === "report" ? "Report" : "Receipt"} uploaded successfully!`);
    } catch (err) {
      console.error(err);
      alert(`Error uploading file: ${err.message}`);
    }
  };

  const openModal = (booking) => {
    setSelectedBooking(booking);
    setPreferredDate(new Date(booking.preferredDate || booking.bookingDate));

    if (booking.preferredTimeSlot) {
      const [hour, minute] = booking.preferredTimeSlot.split(":").map(Number);
      const time = new Date();
      time.setHours(hour);
      time.setMinutes(minute);
      time.setSeconds(0);

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
    setLoading(true); // Start loading
    try {
      const typeMap = {
        LabTest: "LabTest",
        WellnessPackage: "Wellness",
        BloodBank: "Bloodbank",
      };

      const type = typeMap[selectedBooking.serviceType];

      const res = await fetch(`/api/pathology/reschedule`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: selectedBooking.id,
          preferredDate,
          preferredTimeSlot: preferredTimeSlot ? preferredTimeSlot.toTimeString().slice(0, 5) : "",
          status,
          type,
        }),
      });

      if (!res.ok) throw new Error("Failed to update");
      alert("Booking updated!");
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Error updating booking.");
    } finally {
      setLoading(false); // End loading
    }
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Bookings");
    XLSX.writeFile(wb, "bookings.xlsx");
  };

  return (
    <div className="container mx-auto font-poppins">
      <div className="text-center py-4">
        <HeadingClientMain main={"Bookings"} />
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-600">
          Showing {filteredData.length} of {bookings.length} bookings
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
            className="bg-green-500 rounded-xl text-white px-4 py-2 hover:bg-green-600 transition"
          >
            Export to Excel
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white rounded-xl px-6 pb-6 mb-4 border">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Filter Data</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
              label="Service Name"
              id="service"
              placeholder="Search by Service Name"
              value={filters.service}
              onChange={handleFilterChange}
            />
            
            {/* Service Type Filter */}
            <div>
              <label className="block text-sm font-medium mb-1">Service Type</label>
              <select
                value={filters.serviceType}
                onChange={(e) => handleFilterChange("serviceType", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                <option value="LabTest">Lab Test</option>
                <option value="BloodBank">Blood Bank</option>
                <option value="WellnessPackage">Wellness Package</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Single Booking Date Filter */}
            <div>
              <label className="block text-sm font-medium mb-1">Booking Date</label>
              <DatePicker
                selected={filters.bookingDate}
                onChange={(date) => handleFilterChange("bookingDate", date)}
                dateFormat="yyyy-MM-dd"
                className="w-full border px-3 py-2 rounded"
                placeholderText="Select booking date"
              />
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto bg-white p-4 rounded-xl shadow-lg">
        {filteredData.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No bookings found matching your filters.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="border">Patient Name</TableHead>
                <TableHead className="border">Mobile</TableHead>
                <TableHead className="border">Email</TableHead>
                <TableHead className="border">City</TableHead>
                <TableHead className="border">Service</TableHead>
                <TableHead className="border">Service Type</TableHead>
                <TableHead className="border">Status</TableHead>
                <TableHead className="border">Booking Date</TableHead>
                <TableHead className="border">Actions</TableHead>
                <TableHead className="border">Report</TableHead>
                <TableHead className="border">Receipt</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="border">
                    {`${booking.patient?.firstName || ""} ${booking.patient?.middleName || ""} ${booking.patient?.lastName || ""}`.trim() || "N/A"}
                  </TableCell>
                  <TableCell className="border">{booking.patient?.mobile || "N/A"}</TableCell>
                  <TableCell className="border">{booking.patient?.email || "N/A"}</TableCell>
                  <TableCell className="border">{booking.patient?.city || "N/A"}</TableCell>
                  <TableCell className="border">{booking.serviceName || "N/A"}</TableCell>
                  <TableCell className="border">{booking.serviceType || "N/A"}</TableCell>
                  <TableCell className="border">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                      booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {booking.status || "N/A"}
                    </span>
                  </TableCell>
                  <TableCell className="border">
                    {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : "N/A"}
                  </TableCell>
                  <TableCell className="border">
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            onClick={() => openModal(booking)}
                            className="w-30 h-10 text-sm bg-purple-500 text-white font-semibold rounded-xl flex items-center justify-center hover:bg-purple-600 transition"
                          >
                            Reschedule
                          </Button>
                        </DialogTrigger>
                      </Dialog>
                    </div>
                  </TableCell>
                  <TableCell className="border">
                    {booking.report ? (
                      <a href={booking.report} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                        View Report
                      </a>
                    ) : (
                      <UploadButton
                        endpoint="fileUploader"
                        onUploadBegin={() => setUploading(booking.id, true)}
                        onClientUploadComplete={(res) => {
                          setUploading(booking.id, false);
                          handleFileUpload(booking.id, "report", res, booking);
                        }}
                        onUploadError={(err) => {
                          setUploading(booking.id, false);
                          alert(`Upload error: ${err.message}`);
                        }}
                        appearance={{
                          button: `w-20 h-10 text-sm bg-blue-500 text-white font-semibold rounded-xl flex items-center justify-center hover:bg-blue-600 transition ${uploadStates[booking.id] ? 'opacity-50 cursor-not-allowed' : ''}`,
                          container: "w-full flex flex-col gap-1 items-center",
                          allowedContent: "text-xs text-gray-500",
                        }}
                      />
                    )}
                  </TableCell>
                  <TableCell className="border">
                    {booking.receipt ? (
                      <a href={booking.receipt} target="_blank" rel="noopener noreferrer" className="text-green-600 underline">
                        View Receipt
                      </a>
                    ) : (
                      <UploadButton
                        endpoint="fileUploader"
                        onUploadBegin={() => setUploading(booking.id, true)}
                        onClientUploadComplete={(res) => {
                          setUploading(booking.id, false);
                          handleFileUpload(booking.id, "receipt", res, booking);
                        }}
                        onUploadError={(err) => {
                          setUploading(booking.id, false);
                          alert(`Upload error: ${err.message}`);
                        }}
                        appearance={{
                          button: `w-20 h-10 text-sm bg-green-500 text-white font-semibold rounded-xl flex items-center justify-center hover:bg-green-600 transition ${uploadStates[booking.id] ? 'opacity-50 cursor-not-allowed' : ''}`,
                          container: "w-full flex flex-col gap-1 items-center",
                          allowedContent: "text-xs text-gray-500",
                        }}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
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
                  disabled={loading} // Disable button while loading
                >
                  {loading ? (
                    <span className="flex items-center">
                      <Loader2 className="animate-spin mr-2" />
                      Submitting...
                    </span>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default BookingsClient;