"use client";

import React, { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import GraphicalRepresentation from "../patient-appointment/overview/GraphAppointmentsGraph";
import { Input } from "@/components/ui/input";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as XLSX from "xlsx";
import { DateFilter, InputField, SelectField } from "@/app/components/input-selectui";
import HeadingClientMain from "@/app/components/heading";

const HospitalAppointments = ({ appointments }) => {
  const [filters, setFilters] = useState({
    patientName: "",
    patientEmail: "",
    doctorName: "",
    doctorEmail: "",
    bookedOn: null,
    preferredDate: null,
    status: "",
  });

  const [showOverview, setShowOverview] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const sortedAppointments = useMemo(() => {
    return [...appointments].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [appointments]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const filteredAppointments = useMemo(() => {
    return sortedAppointments.filter((apt) => {
      const fullPatientName = `${apt.patient?.firstName || ""} ${apt.patient?.lastName || ""}`.toLowerCase();
      const fullDoctorName = `${apt.doctor?.firstName || ""} ${apt.doctor?.lastName || ""}`.toLowerCase();
      const patientEmail = (apt.patient?.email || "").toLowerCase();
      const doctorEmail = (apt.doctor?.email || "").toLowerCase();
      const status = (apt.status || "").toLowerCase();

      if (filters.patientName && !fullPatientName.includes(filters.patientName.toLowerCase())) return false;
      if (filters.patientEmail && !patientEmail.includes(filters.patientEmail.toLowerCase())) return false;
      if (filters.doctorName && !fullDoctorName.includes(filters.doctorName.toLowerCase())) return false;
      if (filters.doctorEmail && !doctorEmail.includes(filters.doctorEmail.toLowerCase())) return false;
      if (filters.status && filters.status.toLowerCase() !== "all" && status !== filters.status.toLowerCase()) return false;
      if (filters.bookedOn && new Date(apt.createdAt).toDateString() !== filters.bookedOn.toDateString()) return false;
      if (filters.preferredDate && new Date(apt.preferredDate).toDateString() !== filters.preferredDate.toDateString()) return false;

      return true;
    });
  }, [filters, sortedAppointments]);

  const exportToExcel = () => {
    const data = filteredAppointments.map((apt) => ({
      Patient: `${apt.patient?.firstName || ""} ${apt.patient?.lastName || ""}`,
      "Patient Email": apt.patient?.email || "N/A",
      Doctor: `${apt.doctor?.firstName || ""} ${apt.doctor?.lastName || ""}`,
      "Doctor Email": apt.doctor?.email || "N/A",
      Category: apt.category?.title || "N/A",
      Mobile: apt.mobileNumber,
      Email: apt.email,
      "Date of Birth": apt.dateOfBirth ? new Date(apt.dateOfBirth).toLocaleDateString() : "N/A",
      Gender: apt.gender || "N/A",
      "Preferred Date": apt.preferredDate ? new Date(apt.preferredDate).toLocaleDateString() : "N/A",
      "Preferred Time": apt.preferredTime || "N/A",
      Status: apt.status || "PENDING",
      "Created At": new Date(apt.createdAt).toLocaleDateString(),
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Appointments");
    XLSX.writeFile(wb, "hospital_appointments.xlsx");
  };

  return (
    <div className="overflow-x-auto min-[1000px]:px-0 min-[1100px]:px-[32px] container mx-auto min-[1000px]:w-[700px] min-[1100px]:w-[900px] xl:w-[1100px] w-[350px] md:w-[700px] bg-white py-4 font-poppins">
      <HeadingClientMain main="Doctor Appointment" sub="Full Data" />
      
      {/* Toggle Filters Button */}
      <div className="flex justify-end gap-1 py-4">
        <Button
          onClick={() => setShowFilters(!showFilters)}
          className="bg-blue-500 hover:bg-blue-600 rounded-xl text-white"
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </Button>
        <Button onClick={exportToExcel} className="bg-green-500 hover:bg-green-600 rounded-xl text-white">
          Export to Excel
        </Button>
      </div>

      {/* Filters Section - Uniform Size */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white rounded-xl shadow-sm mb-4">
          <InputField
            label="Patient Name"
            id="patientName"
            placeholder="Enter Patient Name"
            value={filters.patientName}
            onChange={handleFilterChange}
          />
          <InputField
            label="Patient Email"
            id="patientEmail"
            placeholder="Enter Patient Email"
            value={filters.patientEmail}
            onChange={handleFilterChange}
          />
          <InputField
            label="Doctor Name"
            id="doctorName"
            placeholder="Enter Doctor Name"
            value={filters.doctorName}
            onChange={handleFilterChange}
          />
          <InputField
            label="Doctor Email"
            id="doctorEmail"
            placeholder="Enter Doctor Email"
            value={filters.doctorEmail}
            onChange={handleFilterChange}
          />
          <DateFilter
            label="Booked On"
            id="bookedOn"
            selected={filters.bookedOn}
            onChange={handleFilterChange}
          />
          <DateFilter
            label="Preferred Date"
            id="preferredDate"
            selected={filters.preferredDate}
            onChange={handleFilterChange}
          />
          <SelectField
            label="Status"
            id="status"
            value={filters.status}
            onChange={handleFilterChange}
            options={[
              { value: "all", label: "All Statuses" },
              { value: "pending", label: "Pending" },
              { value: "completed", label: "Completed" },
              { value: "cancelled", label: "Cancelled" },
            ]}
          />
          <div className="flex items-end">
            <Button
              onClick={() => setShowOverview(!showOverview)}
              className="bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 w-full"
            >
              {showOverview ? "Hide Overview" : "Show Overview"}
            </Button>
          </div>
        </div>
      )}

      {/* Graphical Overview */}
      {showOverview && (
        <div className="mb-4 bg-white rounded-xl shadow-sm">
          <GraphicalRepresentation appointments={appointments} />
        </div>
      )}

      {/* Table Container - Only table is scrollable */}
      <div className="bg-white p-4 rounded-xl shadow-lg">
        <div className="overflow-x-auto">
          <Table className="min-w-[1200px] table-fixed w-full">
            <TableHeader>
              <TableRow className="bg-white">
                <TableHead className="w-[150px]">Patient</TableHead>
                <TableHead className="w-[120px]">View Patient</TableHead>
                <TableHead className="w-[150px]">Doctor</TableHead>
                <TableHead className="w-[120px]">View Doctor</TableHead>
                <TableHead className="w-[120px]">Category</TableHead>
                <TableHead className="w-[120px]">Mobile</TableHead>
                <TableHead className="w-[180px]">Email</TableHead>
                <TableHead className="w-[130px]">Date of Birth</TableHead>
                <TableHead className="w-[100px]">Gender</TableHead>
                <TableHead className="w-[130px]">Preferred Date</TableHead>
                <TableHead className="w-[120px]">Preferred Time</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead className="w-[120px]">Booked By</TableHead> 
                <TableHead className="w-[130px]">Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAppointments.length ? (
                filteredAppointments.map((apt) => (
                  <TableRow key={apt.id}>
                    <TableCell className="w-[150px] truncate">{apt.patient ? `${apt.patient.firstName || ""} ${apt.patient.lastName || ""}` : "N/A"}</TableCell>
                    <TableCell className="w-[120px] truncate">
                      {apt.patient ? (
                        <a href={`/hospital/dashboard/patientinfo/${apt.patient.id}`} className="text-blue-500 underline">
                          View Patient
                        </a>
                      ) : "N/A"}
                    </TableCell>
                    <TableCell className="w-[150px] truncate">{apt.doctor ? `${apt.doctor.firstName || ""} ${apt.doctor.lastName || ""}` : "N/A"}</TableCell>
                    <TableCell className="w-[120px] truncate">
                      {apt.doctor ? (
                        <a href={`/hospital/dashboard/doctor/${apt.doctor.id}`} className="text-blue-500 underline">
                          View Doctor
                        </a>
                      ) : "N/A"}
                    </TableCell>
                    <TableCell className="w-[120px] truncate">{apt.category?.title || "N/A"}</TableCell>
                    <TableCell className="w-[120px] truncate">{apt.mobileNumber}</TableCell>
                    <TableCell className="w-[180px] truncate">{apt.email}</TableCell>
                    <TableCell className="w-[130px] truncate">{apt.dateOfBirth ? new Date(apt.dateOfBirth).toLocaleDateString() : "N/A"}</TableCell>
                    <TableCell className="w-[100px] truncate">{apt.gender || "N/A"}</TableCell>
                    <TableCell className="w-[130px] truncate">{apt.preferredDate ? new Date(apt.preferredDate).toLocaleDateString() : "N/A"}</TableCell>
                    <TableCell className="w-[120px] truncate">{apt.preferredTime || "N/A"}</TableCell>
                    <TableCell className="w-[100px] truncate">{apt.status || "PENDING"}</TableCell>
                     <TableCell className="w-[120px] truncate">{apt.bookedByType || "N/A"}</TableCell>
                    <TableCell className="w-[130px] truncate">{new Date(apt.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={13} className="text-center">
                    No appointments found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default HospitalAppointments;