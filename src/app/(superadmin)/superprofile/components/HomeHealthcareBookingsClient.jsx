"use client"

import React, { useState, useMemo } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Download, User, Building2, Users } from "lucide-react"
import * as XLSX from "xlsx"
import HeadingClientMain from "@/app/components/heading"
import { DateFilter, InputField, SelectField } from "@/app/components/input-selectui"

const homeHealthcareServices = [
  "ICU at Home",
  "General Nursing",
  "Neurological Care & Rehabilitation",
  "On Bed Cancer",
  "Transplant & Post-Op Care",
  "Pregnancy Care",
  "Mother & Child Care",
  "Palliative Care",
  "Orthopaedic Care",
  "Stroke Care",
  "Cardiac Care",
  "Dialysis Care",
  "Old Age Health Care",
  "COPD Care",
  "Bed Sores Care",
]

const HomeHealthcareBookingsClient = ({ bookings }) => {
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    patientName: "",
    patientEmail: "",
    patientMobile: "",
    hospitalName: "",
    serviceName: "All",
    status: "All",
    bookingDate: null,
    preferredDate: null,
  })

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  // Filtering
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const fullPatientName = `${b.patient?.firstName || ""} ${b.patient?.lastName || ""}`.toLowerCase()
      const patientEmail = (b.patient?.email || "").toLowerCase()
      const patientMobile = (b.patient?.mobile || "").toLowerCase()
      const hospitalName = (b.HomeHealthcare?.hospital?.hspInfo?.regname || "").toLowerCase()
      const serviceName = (b.HomeHealthcare?.serviceName || "").toLowerCase()
      const status = (b.status || "").toLowerCase()

      if (filters.patientName && !fullPatientName.includes(filters.patientName.toLowerCase())) return false
      if (filters.patientEmail && !patientEmail.includes(filters.patientEmail.toLowerCase())) return false
      if (filters.patientMobile && !patientMobile.includes(filters.patientMobile.toLowerCase())) return false
      if (filters.hospitalName && !hospitalName.includes(filters.hospitalName.toLowerCase())) return false
      if (filters.serviceName && filters.serviceName !== "All" && serviceName !== filters.serviceName.toLowerCase()) return false
      if (filters.status && filters.status !== "All" && status !== filters.status.toLowerCase()) return false
      if (filters.bookingDate && new Date(b.bookingDate).toDateString() !== filters.bookingDate.toDateString()) return false
      if (filters.preferredDate && b.preferredDate && new Date(b.preferredDate).toDateString() !== filters.preferredDate.toDateString()) return false

      return true
    })
  }, [bookings, filters])

  // Define columns for the dynamic table
  const columns = useMemo(
    () => [
      {
        accessorKey: "hospital",
        header: "Hospital",
        cell: ({ row }) => {
          const hospital = row.original.HomeHealthcare?.hospital;
          return (
            <div>
              <div className="font-medium">{hospital?.hspInfo?.regname || "N/A"}</div>
              <div className="text-sm text-gray-500">
                {hospital?.email || "-"}
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "viewHospital",
        header: "View Hospital",
        cell: ({ row }) => {
          const hospital = row.original.HomeHealthcare?.hospital;
          return hospital ? (
            <a
              href={`/superadmin/dashboard/hospitalinfo/${hospital.id}`}
              className="bg-[#5271FF] hover:bg-blue-500 rounded-xl text-white px-3 py-1 hover:text-white inline-flex items-center gap-1"
            >
            View Hospital
            </a>
          ) : (
            "N/A"
          );
        },
      },
      {
        accessorKey: "patient",
        header: "Patient",
        cell: ({ row }) => {
          const patient = row.original.patient;
          return patient ? `${patient.firstName || ""} ${patient.lastName || ""}` : "N/A";
        },
      },
      {
        accessorKey: "viewProfile",
        header: "View Profile",
        cell: ({ row }) => {
          const patient = row.original.patient;
          return patient ? (
            <a
              href={`/superadmin/dashboard/patientinfo/${patient.id}`}
              className="bg-[#5271FF] hover:bg-blue-500 rounded-xl text-white px-3 py-1 hover:text-white inline-flex items-center gap-1"
            >
              View Profile
            </a>
          ) : (
            "N/A"
          );
        },
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => row.original.patient?.email || "-",
      },
      {
        accessorKey: "mobile",
        header: "Mobile",
        cell: ({ row }) => row.original.patient?.mobile || "-",
      },
      {
        accessorKey: "service",
        header: "Service",
        cell: ({ row }) => row.original.HomeHealthcare?.serviceName || "-",
      },
      {
        accessorKey: "bookingDate",
        header: "Booking Date",
        cell: ({ row }) => new Date(row.original.bookingDate).toLocaleDateString(),
      },
      {
        accessorKey: "preferredDate",
        header: "Preferred Date",
        cell: ({ row }) => row.original.preferredDate ? new Date(row.original.preferredDate).toLocaleDateString() : "-",
      },
      {
        accessorKey: "timeSlot",
        header: "Time Slot",
        cell: ({ row }) => row.original.preferredTimeSlot || "-",
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status;
          return (
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                status === "CONFIRMED"
                  ? "bg-green-100 text-green-600"
                  : status === "CANCELLED"
                  ? "bg-red-100 text-red-600"
                  : status === "COMPLETED"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-yellow-100 text-yellow-600"
              }`}
            >
              {status}
            </span>
          );
        },
      },
    ],
    []
  )

  // Create table instance
  const table = useReactTable({
    data: filteredBookings,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  // Export to Excel
  const exportToExcel = () => {
    const data = filteredBookings.map((b) => ({
      Hospital: b.HomeHealthcare?.hospital?.hspInfo?.regname || "-",
      "Hospital Email": b.HomeHealthcare?.hospital?.email || "-",
      Patient: `${b.patient?.firstName || ""} ${b.patient?.lastName || ""}`,
      Email: b.patient?.email || "-",
      Mobile: b.patient?.mobile || "-",
      Service: b.HomeHealthcare?.serviceName || "-",
      "Booking Date": new Date(b.bookingDate).toLocaleDateString(),
      "Preferred Date": b.preferredDate ? new Date(b.preferredDate).toLocaleDateString() : "-",
      "Time Slot": b.preferredTimeSlot || "-",
      Status: b.status,
      Notes: b.notes || "-",
    }))

    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "SuperAdmin Bookings")
    XLSX.writeFile(wb, "superadmin_home_healthcare_bookings.xlsx")
  }

  return (
    <div className="md:container mx-auto font-poppins h-screen flex flex-col">
      {/* Fixed Header */}
      <div className="pt-4 xs:px-2 min-[1000px]:px-0 min-[1100px]:px-[32px] container mx-auto min-[1000px]:w-[700px] min-[1100px]:w-[900px] xl:w-[1100px] w-[350px] md:w-[700px] bg-white">
        <HeadingClientMain main="All Home Healthcare Bookings" sub="All Data" />
        
        {/* Fixed Controls */}
        <div className="flex justify-end gap-1 py-4 sticky top-0 bg-white z-10">
          <Button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-blue-500 hover:bg-blue-600 rounded-xl text-white"
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
          <Button
            onClick={exportToExcel}
            className="bg-green-500 hover:bg-green-600 rounded-xl text-white"
          >
            <Download className="mr-2 h-4 w-4" /> Export to Excel
          </Button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white rounded-xl shadow-sm mb-4 sticky top-[68px] z-10">
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
              label="Patient Mobile"
              id="patientMobile"
              placeholder="Enter Patient Mobile"
              value={filters.patientMobile}
              onChange={handleFilterChange}
            />
            <InputField
              label="Hospital Name"
              id="hospitalName"
              placeholder="Enter Hospital Name"
              value={filters.hospitalName}
              onChange={handleFilterChange}
            />
            <SelectField
              label="Service"
              id="serviceName"
              value={filters.serviceName}
              onChange={handleFilterChange}
              options={[
                { value: "All", label: "All Services" },
                ...homeHealthcareServices.map((service) => ({
                  value: service,
                  label: service,
                })),
              ]}
            />
            <SelectField
              label="Status"
              id="status"
              value={filters.status}
              onChange={handleFilterChange}
              options={[
                { value: "All", label: "All Statuses" },
                { value: "PENDING", label: "Pending" },
                { value: "CONFIRMED", label: "Confirmed" },
                { value: "CANCELLED", label: "Cancelled" },
                { value: "COMPLETED", label: "Completed" },
              ]}
            />
            <DateFilter
              label="Booking Date"
              id="bookingDate"
              selected={filters.bookingDate}
              onChange={handleFilterChange}
            />
            <DateFilter
              label="Preferred Date"
              id="preferredDate"
              selected={filters.preferredDate}
              onChange={handleFilterChange}
            />
          </div>
        )}
      </div>

      {/* Scrollable Table Area */}
      <div className="flex-1 overflow-auto xs:px-2 min-[1000px]:px-0 min-[1100px]:px-[32px] container mx-auto min-[1000px]:w-[700px] min-[1100px]:w-[900px] xl:w-[1100px] w-[350px] md:w-[700px]">
        <div className="overflow-x-auto bg-white p-4 rounded-xl shadow-lg">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="bg-gray-100 hover:bg-gray-100 sticky top-0 z-10">
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="border border-gray-200 py-4 px-6 text-left font-semibold text-gray-900 whitespace-nowrap"
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row, index) => (
                  <TableRow
                    key={row.id}
                    className={`
                      transition-colors duration-150 ease-in-out
                      hover:bg-gray-50/50 
                      ${index % 2 === 0 ? "bg-white" : "bg-gray-50/20"}
                      border-[1px] border-gray-100
                    `}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="border-[1px] border-gray-200 py-4 px-6 text-sm whitespace-nowrap max-w-max hover:bg-gray-100"
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center py-12">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-gray-400" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-900">No bookings found</p>
                        <p className="text-sm text-gray-500">Try adjusting your search criteria</p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Fixed Pagination */}
      <div className="pb-4 xs:px-2 min-[1000px]:px-0 min-[1100px]:px-[32px] container mx-auto min-[1000px]:w-[700px] min-[1100px]:w-[900px] xl:w-[1100px] w-[350px] md:w-[700px] bg-white sticky bottom-0">
        <div className="flex items-center justify-between py-4 bg-white border-t">
          <Button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <span>
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>
          <Button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

export default HomeHealthcareBookingsClient