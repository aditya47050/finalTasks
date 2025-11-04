"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Stethoscope, Filter, Download, NotebookPen, Eye, Pill } from "lucide-react"
import { Input } from "@/components/ui/input"
import ReactDatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import * as XLSX from "xlsx"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { RiCalendarScheduleFill } from "react-icons/ri"
import PrescriptionDialog from "../components/PrescriptionDialog"

const statuses = {
  PENDING: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  APPROVED: { label: "Approved", color: "bg-green-100 text-green-800" },
  REJECTED: { label: "Rejected", color: "bg-red-100 text-red-800" },
  COMPLETED: { label: "Completed", color: "bg-blue-100 text-blue-800" },
  CANCELLED: { label: "Cancelled", color: "bg-gray-100 text-gray-800" },
}

export default function DoctorAppointments({ 
  appointments: initialAppointments, 
  doctor, 
  templates,
  doctorProducts // ✅ Receive doctor products from server
}) {
  const [appointments, setAppointments] = useState(initialAppointments)
  const [openNoteDialogId, setOpenNoteDialogId] = useState(null)
  const [noteType, setNoteType] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFilter, setDateFilter] = useState(null)
  const [statusFilter, setStatusFilter] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [pageIndex, setPageIndex] = useState(0)
  const [openDialogId, setOpenDialogId] = useState(null)
  const [manageForm, setManageForm] = useState({
    status: "",
    doctorNotes: "",
  })
  const [prescriptionDialogOpen, setPrescriptionDialogOpen] = useState(false)
  const [selectedAppointmentForPrescription, setSelectedAppointmentForPrescription] = useState(null)

  const pageSize = 3

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      const matchesSearch =
        appointment.patient?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.patient?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesDate = dateFilter
        ? new Date(appointment.createdAt).toDateString() === dateFilter.toDateString()
        : true

      const matchesStatus = statusFilter ? appointment.status === statusFilter : true

      return matchesSearch && matchesDate && matchesStatus
    })
  }, [appointments, searchTerm, dateFilter, statusFilter])

  const paginatedData = filteredAppointments.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)
  const pageCount = Math.ceil(filteredAppointments.length / pageSize)

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const calculateAge = (dob) => {
    if (!dob) return "N/A"
    const birthDate = new Date(dob)
    const ageDifMs = Date.now() - birthDate.getTime()
    const ageDate = new Date(ageDifMs)
    return Math.abs(ageDate.getUTCFullYear() - 1970)
  }

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredAppointments)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Appointments")
    XLSX.writeFile(wb, "doctor_appointments.xlsx")
  }

  const handleDialogOpen = (appointment) => {
    setOpenDialogId(appointment.id)
    setManageForm({
      status: appointment.status,
      doctorNotes: appointment.doctorNotes || "",
    })
  }

  const handleCreatePrescription = (appointment) => {
    setSelectedAppointmentForPrescription(appointment)
    setPrescriptionDialogOpen(true)
  }

  const handlePrescriptionSaved = (savedPrescription) => {
    console.log("Prescription saved successfully:", savedPrescription)
    setPrescriptionDialogOpen(false)
    setSelectedAppointmentForPrescription(null)
    // Optionally refresh appointments or show success message
  }

  const handleSubmit = async (appointmentId) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/doctor/doctorappointment/${appointmentId}/approval`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(manageForm),
      })

      if (response.ok) {
        const updated = await response.json()

        // Update the appointment in state
        setAppointments((prev) =>
          prev.map((appt) =>
            appt.id === updated.id ? { ...appt, status: updated.status, doctorNotes: updated.doctorNotes } : appt
          ),
        )

        // Close the Manage Appointment dialog
        setOpenDialogId(null)
      }
    } catch (error) {
      console.error("Error updating appointment:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="p-6 border-b border-gray-100">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-blue-600 flex items-center justify-center gap-2">
            <Stethoscope className="mr-2 h-6 w-6" />
            My Appointments
          </h2>
        </div>

        <div className="flex justify-end gap-2 pb-2">
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            className="bg-blue-500 text-white rounded-xl hover:bg-blue-600"
          >
            <Filter className="h-4 w-4" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
          <Button
            onClick={exportToExcel}
            variant="outline"
            className="bg-green-500 text-white rounded-xl hover:bg-green-600"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium mb-1">Search Patients</label>
              <Input placeholder="Search by name" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Booked On</label>
              <ReactDatePicker
                selected={dateFilter}
                onChange={(date) => setDateFilter(date)}
                placeholderText="Filter by date"
                className="w-full p-2 border rounded-xl"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-2 border rounded-xl"
              >
                <option value="">All Statuses</option>
                {Object.keys(statuses).map((status) => (
                  <option key={status} value={status}>
                    {statuses[status].label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 rounded-xl">
        {paginatedData.length > 0 ? (
          paginatedData.map((appointment) => (
            <div key={appointment.id} className="border rounded-xl shadow-sm hover:shadow-md transition-all">
              <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">
                    {appointment.patient.firstName} {appointment.patient.lastName}
                  </h3>
                  <Badge className={statuses[appointment.status]?.color}>{statuses[appointment.status]?.label}</Badge>
                </div>
                <p className="text-sm text-gray-600">{appointment.category?.title || "General"}</p>
              </div>
              <div className="p-4 space-y-3">
                {/* Row 1: Booked On & Patient Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <CalendarDays className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Booked On</p>
                      <p className="text-sm text-gray-600">{formatDate(appointment.createdAt)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg"></div>
                    <div>
                      <p className="text-sm font-medium">Patient Details</p>
                      <p className="text-sm text-gray-600">
                        {appointment.patient.gender}, {calculateAge(appointment.patient.dateOfBirth)}y
                      </p>
                    </div>
                  </div>
                </div>

                {/* Row 2: Preferred Date & Time */}
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <RiCalendarScheduleFill className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Preferred Date and Time</p>
                    <p className="text-sm text-gray-600">
                      {appointment.preferredDate
                        ? `${formatDate(appointment.preferredDate)} • ${appointment.preferredTime || "No time specified"}`
                        : "Not specified"}
                    </p>
                  </div>
                </div>

                {/* Row 3: Patient Note & Doctor Note */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Patient Note</p>
                    <Dialog
                      open={openNoteDialogId === appointment.id && noteType === "patient"}
                      onOpenChange={(open) => !open && setOpenNoteDialogId(null)}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="md"
                          className="rounded-xl px-10 py-2 bg-transparent"
                          onClick={() => {
                            setOpenNoteDialogId(appointment.id)
                            setNoteType("patient")
                          }}
                        >
                          <Eye className="h-5 w-5" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[400px] p-6 rounded-xl shadow-lg bg-white">
                        <DialogHeader>
                          <DialogTitle className="text-lg font-bold text-center">Patient Note</DialogTitle>
                        </DialogHeader>
                        <p className="text-gray-700">{appointment.notes || "N/A"}</p>
                        <div className="flex justify-center mt-4">
                          <Button onClick={() => setOpenNoteDialogId(null)}>Close</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div>
                    <p className="text-sm font-medium">Doctor Note</p>
                    <Dialog
                      open={openNoteDialogId === appointment.id && noteType === "doctor"}
                      onOpenChange={(open) => !open && setOpenNoteDialogId(null)}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="md"
                          className="rounded-xl px-10 py-2 bg-transparent"
                          onClick={() => {
                            setOpenNoteDialogId(appointment.id)
                            setNoteType("doctor")
                          }}
                        >
                          <Eye className="h-5 w-5" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[400px] p-6 rounded-xl shadow-lg bg-white">
                        <DialogHeader>
                          <DialogTitle className="text-lg font-bold text-center">Doctor Note</DialogTitle>
                        </DialogHeader>
                        <p className="text-gray-700">{appointment.doctorNotes || "N/A"}</p>
                        <div className="flex justify-center mt-4">
                          <Button onClick={() => setOpenNoteDialogId(null)}>Close</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Dialog
                    open={openDialogId === appointment.id}
                    onOpenChange={(open) => {
                      if (!open) setOpenDialogId(null)
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                        onClick={() => handleDialogOpen(appointment)}
                      >
                        <NotebookPen className="h-4 w-4 mr-2" />
                        Manage
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-xl shadow-lg bg-white">
                      <div className="p-6 flex justify-center">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-bold text-blue-700 text-center">
                            Manage Appointment
                          </DialogTitle>
                        </DialogHeader>
                      </div>

                      <div className="p-6 space-y-6">
                        <div className="space-y-2">
                          <h4 className="text-lg font-medium">Update Status</h4>
                          <select
                            value={manageForm.status}
                            onChange={(e) => setManageForm({ ...manageForm, status: e.target.value })}
                            className="w-full p-3 border rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select a status</option>
                            {Object.entries(statuses).map(([status, { label }]) => (
                              <option key={status} value={status}>
                                {label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-2">
                          <h4 className="text-lg font-medium">Doctor Notes (Optional)</h4>
                          <Textarea
                            value={manageForm.doctorNotes}
                            onChange={(e) => setManageForm({ ...manageForm, doctorNotes: e.target.value })}
                            placeholder="Add any notes about this appointment..."
                            className="min-h-[100px] text-sm rounded-xl"
                          />
                        </div>

                        <div className="flex justify-center">
                          <Button
                            onClick={() => handleSubmit(appointment.id)}
                            disabled={loading}
                            className="rounded-xl bg-blue-600 text-white hover:bg-blue-700 min-w-[450px]"
                          >
                            {loading ? "Saving..." : "Save Changes"}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="outline"
                    className="w-full rounded-xl bg-green-600 text-white hover:bg-green-700"
                    onClick={() => handleCreatePrescription(appointment)}
                  >
                    <Pill className="h-4 w-4 mr-2" />
                    Prescription
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Stethoscope className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
            <p className="text-gray-500">Try adjusting your filters</p>
          </div>
        )}
      </div>

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

      {selectedAppointmentForPrescription && (
        <PrescriptionDialog
          isOpen={prescriptionDialogOpen}
          onClose={() => {
            setPrescriptionDialogOpen(false)
            setSelectedAppointmentForPrescription(null)
          }}
          onSave={handlePrescriptionSaved}
          doctor={doctor}
          patient={selectedAppointmentForPrescription.patient}
          appointment={selectedAppointmentForPrescription}
          templates={templates}
          doctorProducts={doctorProducts} // ✅ Pass doctor products to PrescriptionDialog
        />
      )}
    </div>
  )
}