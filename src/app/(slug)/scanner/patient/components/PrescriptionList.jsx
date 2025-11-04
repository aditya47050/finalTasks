"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Eye, Loader } from "lucide-react"
import ReactDatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import * as XLSX from "xlsx"
import { UploadButton } from "@uploadthing/react"

export default function PrescriptionList({ prescriptions, patientId }) {
  const router = useRouter()
  const [doctorFilter, setDoctorFilter] = useState("")
  const [dateFilter, setDateFilter] = useState(null)
  const [statusFilter, setStatusFilter] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploadLoadingIds, setUploadLoadingIds] = useState([])
  const [notes, setNotes] = useState(
    prescriptions.reduce((acc, prescription) => {
      acc[prescription.id] = prescription.note || ""
      return acc
    }, {})
  )

  const filteredPrescriptions = prescriptions.filter((prescription) => {
    const matchesDoctor = `${prescription.doctor?.firstName || ""} ${prescription.doctor?.lastName || ""}`
      .toLowerCase()
      .includes(doctorFilter.toLowerCase())
    const matchesDate = dateFilter
      ? new Date(prescription.prescriptionDate).toDateString() === dateFilter.toDateString()
      : true
    const matchesStatus = statusFilter ? prescription.status === statusFilter : true

    return matchesDoctor && matchesDate && matchesStatus
  })

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })

  const handleViewPrescription = async (prescription) => {
    setLoading(true)
    await router.push(`/scanner/patient/${patientId}/prescription/${prescription.id}/view`)
    setLoading(false)
  }

  const handleNoteChange = (prescriptionId, note) => {
    setNotes((prev) => ({ ...prev, [prescriptionId]: note }))
  }

  const handleFileUpload = async (prescriptionId, res) => {
    if (!res || res.length === 0) return

    const fileUrl = res[0].ufsUrl

    try {
      const response = await fetch(`/api/pharmacy/upload`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prescriptionId, receipt: fileUrl, note: notes[prescriptionId] }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to save uploaded file")
      }

      alert("Receipt uploaded successfully!")
    } catch (err) {
      console.error(err)
      alert(`Error uploading file: ${err.message}`)
    }
  }

  const isUploading = (prescriptionId) => uploadLoadingIds.includes(prescriptionId)

  const setUploading = (prescriptionId, loading) => {
    setUploadLoadingIds((prev) =>
      loading ? [...prev, prescriptionId] : prev.filter((id) => id !== prescriptionId)
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="text-center mb-1">
          <h2 className="text-2xl font-bold text-blue-600 flex items-center justify-center gap-2">
            Patient's Prescriptions
          </h2>
          <p className="text-blue-600 mt-0.5">View All Prescriptions Received By Patient's Till Date</p>
        </div>

        {/* Top Actions */}
        <div className="flex justify-end gap-1 py-4 flex-wrap">
          <Button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-blue-500 rounded-xl text-white px-4 py-2 focus:outline-none hover:bg-blue-600 transition"
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium mb-1">Search Doctors</label>
              <input
                type="text"
                placeholder="Search by doctor name"
                value={doctorFilter}
                onChange={(e) => setDoctorFilter(e.target.value)}
                className="w-full p-2 border rounded-xl"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Prescription Date</label>
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
                <option value="ACTIVE">Active</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Prescription Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {filteredPrescriptions.map((prescription) => (
          <Card key={prescription.id} className="hover:shadow-md transition-shadow flex flex-col h-full w-full">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-lg">
                  Dr. {prescription.doctor?.firstName} {prescription.doctor?.lastName}
                </span>
                <Badge
                  className={
                    prescription.status === "ACTIVE"
                      ? "bg-green-100 text-green-800"
                      : prescription.status === "COMPLETED"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                  }
                >
                  {prescription.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col flex-1">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <strong>Date:</strong> {formatDate(prescription.prescriptionDate)}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Template:</strong> {prescription.template?.name || "Custom"}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Medications:</strong> {prescription.medications?.length || 0} items
                </p>
                {prescription.diagnosis && (
                  <p className="text-sm text-gray-600">
                    <strong>Diagnosis:</strong> {prescription.diagnosis.substring(0, 50)}...
                  </p>
                )}
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium mb-1">Note</label>
                <textarea
                  value={notes[prescription.id] || ""}
                  onChange={(e) => handleNoteChange(prescription.id, e.target.value)}
                  className="w-full p-2 border rounded-xl"
                  placeholder="Add a note..."
                />
              </div>

              {/* Buttons */}
<div className="flex flex-col gap-2 mt-4">
  <button
    onClick={() => handleViewPrescription(prescription)}
    className="text-sm bg-blue-500 text-white font-semibold rounded-xl flex items-center justify-center hover:bg-blue-600 transition whitespace-nowrap px-4 py-2 w-full"
    disabled={loading}
  >
    {loading ? <Loader className="h-4 w-4 animate-spin mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
    {loading ? "Loading..." : "View Prescription"}
  </button>

  {prescription.receipt ? (
    <a
      href={prescription.receipt}
      target="_blank"
      rel="noopener noreferrer"
      className="text-sm bg-green-500 text-white font-semibold rounded-xl flex items-center justify-center hover:bg-green-600 transition px-4 py-2 w-full"
    >
      View Receipt
    </a>
  ) : (
    <div className="flex flex-col gap-1 w-full">
      
      <UploadButton
  endpoint="fileUploader"
  onUploadBegin={() => setUploading(prescription.id, true)}
  onClientUploadComplete={(res) => {
    setUploading(prescription.id, false)
    handleFileUpload(prescription.id, res)
  }}
  onUploadError={(err) => {
    setUploading(prescription.id, false)
    alert(`Upload error: ${err.message}`)
  }}
  appearance={{
    button:
      "text-sm bg-green-500 text-white font-semibold rounded-xl flex items-center justify-center hover:bg-green-600 transition w-full",
    container: "inline-block",
    allowedContent: "text-xs text-gray-500",
  }}
  asChild
>
  <button disabled={isUploading(prescription.id)}>
    {isUploading(prescription.id) ? (
      <span className="animate-spin">
        <Loader className="w-5 h-5" />
      </span>
    ) : (
      "Upload Receipt" 
    )}
  </button>
</UploadButton>

    </div>
  )}
</div>

            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredPrescriptions.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No prescriptions found</h3>
          <p className="text-gray-500">Try adjusting your filters or create a new prescription</p>
        </div>
      )}
    </div>
  )
}
