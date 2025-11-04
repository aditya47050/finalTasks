"use client"
import { useState, useMemo } from "react"
import "react-datepicker/dist/react-datepicker.css"
import { Button } from "@/components/ui/button"
import * as XLSX from "xlsx"
import {
  Ambulance,
  Building2,
  FileText,
  Calendar,
  Clock,
  ExternalLink,
  Download,
  Car,
  Hospital,
  FolderOpen,
  Filter,
  Eye,
  X,
  CheckCircle, XCircle
} from "lucide-react"
import Link from "next/link"
import { DateFilter, SelectField } from "@/app/components/input-selectui"

const statusIcons = {
  PENDING: <Clock className="w-4 h-4 text-yellow-500" />,
  CONFIRMED: <CheckCircle className="w-4 h-4 text-green-500" />,
  CANCELLED: <XCircle className="w-4 h-4 text-red-500" />,
  COMPLETED: <CheckCircle className="w-4 h-4 text-blue-500" />
}

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  COMPLETED: "bg-blue-100 text-blue-800"
}

export default function BookAmbulance({ userdata }) {
  const [pageIndex, setPageIndex] = useState(0)
  const pageSize = 3
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    ambulancetype: "",
    ambulancecategory: "",
    hospitaltype: "",
    status: "",
    createdAt: null,
  })
  const [showDocuments, setShowDocuments] = useState(null)

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
    setPageIndex(0)
  }

  // date normalization
  const normalizeDate = (date) => {
    if (!date) return null
    const d = new Date(date)
    if (isNaN(d.getTime())) return null
    // Set to beginning of day in local timezone
    return new Date(d.getFullYear(), d.getMonth(), d.getDate())
  }

  // Format date for display
  const formatDateForDisplay = (date) => {
    if (!date) return "N/A"
    const d = new Date(date)
    if (isNaN(d.getTime())) return "N/A"
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Filter functionality
  const filteredData = useMemo(() => {
    return userdata.filter((row) => {
      return Object.entries(filters).every(([key, filterValue]) => {
        if (!filterValue) return true

        if (key === "status") {
          return row.status === filterValue
        }

        if (key === "createdAt") {
          const rowDate = normalizeDate(row.createdAt)
          const filterDate = normalizeDate(filterValue)

          if (!rowDate || !filterDate) return false

          // Compare dates at day level (ignoring time)
          return (
            rowDate.getFullYear() === filterDate.getFullYear() &&
            rowDate.getMonth() === filterDate.getMonth() &&
            rowDate.getDate() === filterDate.getDate()
          )
        }

        // For ambulance fields
        if (["ambulancecategory", "ambulancetype", "hospitaltype"].includes(key)) {
          const rowValue = String(row[key] || "").toLowerCase().trim()
          const filterValueStr = String(filterValue || "").toLowerCase().trim()
          return rowValue === filterValueStr
        }

        return true
      })
    })
  }, [filters, userdata])

  const paginatedData = filteredData.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize)
  const pageCount = Math.ceil(filteredData.length / pageSize)

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Ambulance Data")
    XLSX.writeFile(wb, "ambulance_data.xlsx")
  }

  const getAvailableDocuments = (row) => {
    const docs = [
      { key: "medicaldoc1", label: "Medical Document 1", url: row.medicaldoc1 },
      { key: "medicaldoc2", label: "Medical Document 2", url: row.medicaldoc2 },
      { key: "medicaldoc3", label: "Medical Document 3", url: row.medicaldoc3 },
    ]
    return docs.filter((doc) => doc.url)
  }

  const renderDocumentsButton = (row, index) => {
    const availableDocs = getAvailableDocuments(row)
    if (availableDocs.length === 0) {
      return <span className="text-gray-500 text-sm">No documents available</span>
    }
    return (
      <Button
        onClick={() => setShowDocuments(showDocuments === index ? null : index)}
        variant="outline"
        size="sm"
        className="flex items-center text-xs rounded-full px-6"
      >
        <Eye className="w-3 h-3" />
        View ({availableDocs.length})
      </Button>
    )
  }

  const renderDocumentsModal = (row, index) => {
    if (showDocuments !== index) return null
    const availableDocs = getAvailableDocuments(row)
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Medical Documents</h3>
            <Button onClick={() => setShowDocuments(null)} variant="ghost" size="sm" className="p-1">
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="p-4 space-y-3">
            {availableDocs.map((doc, docIndex) => (
              <a
                key={docIndex}
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-sm">{doc.label}</h4>
                  <p className="text-gray-500 text-xs">Click to view document</p>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </a>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto font-poppins p-4 lg:p-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-blue-600 flex items-center justify-center gap-2">
              Your Ambulance Bookings
            </h2>
            <p className="text-blue-600 mt-1">Manage and view your ambulance booking history</p>
          </div>


          {/* Top Actions */}
          <div className="flex justify-end gap-2 items-end">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-blue-500 rounded-xl text-white px-4 py-2 focus:outline-none hover:bg-blue-600 transition"
            >
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
            <Button
              onClick={exportToExcel}
              className="bg-green-400 rounded-xl text-white px-4 py-2 focus:outline-none hover:bg-green-400 transition"
            >
              Export to Excel
            </Button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <SelectField
                label="Ambulance Type"
                id="ambulancetype"
                value={filters.ambulancetype || ""}
                onChange={handleFilterChange}
                options={[
                  { value: "", label: "All Types" },
                  { value: "Basic Ambulance", label: "Basic Ambulance" },
                  { value: "O2 Ambulance", label: "O2 Ambulance" },
                  { value: "Without O2 Ambulance", label: "Without O2 Ambulance" },
                  { value: "Cardiac Ambulance", label: "Cardiac Ambulance" },
                  { value: "Mobile Equipped Unit", label: "Mobile Equipped Unit" },
                  { value: "Air Ambulance", label: "Air Ambulance" },
                ]}
              />

              <SelectField
                label="Ambulance Category"
                id="ambulancecategory"
                value={filters.ambulancecategory || ""}
                onChange={handleFilterChange}
                options={[
                  { value: "", label: "Select Category" },
                  { value: "108 Ambulance", label: "108 Ambulance" },
                  { value: "Private Ambulance", label: "Private Ambulance" },
                  { value: "Hospital Ambulance", label: "Hospital Ambulance" },
                  { value: "RED Health Ambulance", label: "RED Health Ambulance" },
                  { value: "Medulance Ambulance", label: "Medulance Ambulance" },
                  { value: "AmbiPalm Ambulance", label: "AmbiPalm Ambulance" },
                  { value: "MedCap Ambulance", label: "MedCap Ambulance" },
                  { value: "Ziqitza Ambulance", label: "Ziqitza Ambulance" },
                ]}
              />

              <SelectField
                label="Hospital Type"
                id="hospitaltype"
                value={filters.hospitaltype || ""}
                onChange={handleFilterChange}
                options={[
                  { value: "", label: "All Hospital Types" },
                  { value: "Goverment Hospitals", label: "Goverment Hospitals" },
                  { value: "Private Hospitals", label: "Private Hospitals" },
                  { value: "NABH Hospitals", label: "NABH Hospitals" },
                  { value: "MJPJAY Hospitals", label: "MJPJAY Hospitals" },
                  { value: "ESIC Hospitals", label: "ESIC Hospitals" },
                  { value: "CGHS Hospitals", label: "CGHS Hospitals" },
                  { value: "Trauma Care Hospitals", label: "Trauma Care Hospitals" },
                  { value: "Cardiac Care Hospitals", label: "Cardiac Care Hospitals" },
                  { value: "Mother & Child Hospitals", label: "Mother & Child Hospitals" },
                  { value: "Speciality Hospitals", label: "Speciality Hospitals" },
                  { value: "Multispeciality Hospitals", label: "Multispeciality Hospitals" },
                  { value: "Super-Speciality Hospitals", label: "Super-Speciality Hospitals" },
                  { value: "Cancer Hospitals", label: "Cancer Hospitals" },
                  { value: "Eye Hospitals", label: "Eye Hospitals" },
                  { value: "IVF Centers", label: "IVF Centers" },
                  { value: "Dialysis Centers", label: "Dialysis Centers" },
                  { value: "Dental Clinics", label: "Dental Clinics" },
                  { value: "Small Clinics", label: "Small Clinics" },
                ]}
              />

              <SelectField
                label="Status"
                id="status"
                value={filters.status || ""}
                onChange={handleFilterChange}
                options={[
                  { value: "", label: "All Statuses" },
                  { value: "PENDING", label: "Pending" },
                  { value: "CONFIRMED", label: "Confirmed" },
                  { value: "CANCELLED", label: "Cancelled" },
                  { value: "COMPLETED", label: "Completed" },
                ]}
              />

              <DateFilter
                label="Booked On"
                id="createdAt"
                selected={filters.createdAt || null}
                onChange={handleFilterChange}
              />
            </div>
          )}
        </div>

        {/* Card View */}
        <div className="p-6">
          {paginatedData.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {paginatedData.map((row, index) => (
                <div key={index} className="group relative">
                  {/* Card Container */}
                  <div className="h-full flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                    {/* Card Header */}
<div className="p-4 border-b border-gray-100 bg-gradient-to-r from-red-50 to-orange-50">
  <div className="flex items-start gap-3">
    {/* Icon */}
    <div className="flex items-center justify-center bg-red-100 rounded-xl w-10 h-10 p-2">
      <Ambulance className="w-5 h-5 text-red-600 rounded-xl" />
    </div>

    {/* Title + Category + Status */}
    <div className="flex-1 min-w-0">
      <h3 className="font-bold text-gray-900 text-sm truncate group-hover:text-red-600 transition-colors">
        {row.ambulancetype || "Standard Ambulance"}
      </h3>

      {/* Category + Status in same row */}
      <div className="flex items-center justify-between mt-1">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          {row.ambulancecategory || "Emergency"}
        </span>

        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
            statusColors[row.status] || "bg-gray-100 text-gray-800"
          }`}
        >
          {statusIcons[row.status]} {row.status}
        </span>
      </div>
    </div>
  </div>
</div>



                    <div className="p-4 flex-1 flex flex-col gap-4">
                      {/* Hospital Info - Horizontal */}
                      <div className="grid grid-cols-2 gap-3">
                        {/* Hospital Type */}
                        <div className="flex items-center gap-3 p-2 rounded-lg group-hover:bg-gray-50 transition-colors">
                          <div className="p-2 bg-blue-100 rounded-full">
                            <Building2 className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-medium text-gray-500">Hospital Type</h4>
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {row.hospitaltype}
                            </p>
                          </div>
                        </div>

                        {/* Hospital Name */}
                        <div className="flex items-center gap-3 p-2 rounded-lg group-hover:bg-gray-50 transition-colors">
                          <div className="p-2 bg-green-100 rounded-full">
                            <Hospital className="w-4 h-4 text-green-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-medium text-gray-500">Hospital Name</h4>
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {row.ambulanceVaichicle?.ambulance?.AmbulanceHsp?.hspregname || "NA"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Date Info - Horizontal */}
                      <div className="grid grid-cols-2 gap-3">
                        {/* Booked On */}
                        <div className="flex items-center gap-3 p-2 rounded-lg group-hover:bg-gray-50 transition-colors">
                          <div className="p-2 bg-purple-100 rounded-full">
                            <Calendar className="w-4 h-4 text-purple-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-medium text-gray-500">Booked On</h4>
                            <p className="text-sm text-gray-700 whitespace-nowrap">
                              {formatDateForDisplay(row.createdAt)}
                            </p>
                          </div>
                        </div>

                        {/* Updated On */}
                        <div className="flex items-center gap-3 p-2 rounded-lg group-hover:bg-gray-50 transition-colors">
                          <div className="p-2 bg-yellow-100 rounded-full">
                            <Clock className="w-4 h-4 text-yellow-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-medium text-gray-500">Updated</h4>
                            <p className="text-sm text-gray-700 whitespace-nowrap">
                              {formatDateForDisplay(row.updatedAt)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Documents Section */}
                      <div className="mt-auto">
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <FolderOpen className="w-4 h-4 text-gray-600" />
                            <span className="text-xs font-medium text-gray-700">Documents</span>
                          </div>
                          {renderDocumentsButton(row, index)}
                        </div>

                        {/* Vehicle Button */}
                        {row.ambulanceVaichicleId && (
                          <Link
                            href={`/ambulance/${row.ambulanceVaichicleId}`}
                            className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl text-sm font-medium transition-all shadow-sm hover:shadow-md"
                          >
                            <Car className="w-4 h-4" />
                            View Vehicle Details
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Documents Modal - keep existing */}
                  {renderDocumentsModal(row, index)}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Ambulance className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No ambulance bookings found</h3>
              <p className="text-gray-500">Try adjusting your filters to see more results.</p>
            </div>
          )}
        </div>
        {/* Pagination Section */}
        {pageCount > 1 && (
          <div className="px-6 py-0.5 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
            <div className="flex items-center justify-between">
              <Button
                onClick={() => setPageIndex((p) => Math.max(p - 1, 0))}
                disabled={pageIndex === 0}
                variant="outline"
                size="sm"
                className="rounded-full w-24 justify-center"
              >
                Previous
              </Button>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>
                  Page {pageIndex + 1} of {pageCount}
                </span>
                <span className="text-gray-400">•</span>
                <span>{filteredData.length} total bookings</span>
              </div>
              <Button
                onClick={() => setPageIndex((p) => Math.min(p + 1, pageCount - 1))}
                disabled={pageIndex >= pageCount - 1}
                variant="outline"
                size="sm"
                className="rounded-full w-24 justify-center"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}