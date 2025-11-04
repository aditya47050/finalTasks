"use client"
import { useState, useMemo } from "react"
import "react-datepicker/dist/react-datepicker.css"
import { Button } from "@/components/ui/button"
import * as XLSX from "xlsx"
import {
    Bed,
    Building2,
    FileText,
    Calendar,
    Clock,
    ExternalLink,
    Download,
    Hospital,
    FolderOpen,
    Filter,
    Eye,
    X,
} from "lucide-react"
import Link from "next/link"
import { DateFilter, SelectField } from "@/app/components/input-selectui"

export default function BedBooking({ userdata }) {
    const [pageIndex, setPageIndex] = useState(0)
    const pageSize = 3
    const [showFilters, setShowFilters] = useState(false)
    const [filters, setFilters] = useState({
        bedCategory: "",
        hospitalType: "",
        bookingDate: null,
        createdAt: null,
    })
    const [showDocuments, setShowDocuments] = useState(null)
    const [showDocumentModal, setShowDocumentModal] = useState(null)

    const handleFilterChange = (field, value) => {
        setFilters((prev) => ({ ...prev, [field]: value }))
        setPageIndex(0)
    }

    const normalizeDate = (date) => {
        if (!date) return null
        const d = new Date(date)
        if (isNaN(d.getTime())) return null
        return new Date(d.getFullYear(), d.getMonth(), d.getDate())
    }

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

    const filteredData = useMemo(() => {
        return userdata.filter((row) => {
            return Object.entries(filters).every(([key, filterValue]) => {
                if (!filterValue) return true

                if (key === "bookingDate" || key === "createdAt") {
                    const rowDate = normalizeDate(row[key])
                    const filterDate = normalizeDate(filterValue)

                    if (!rowDate || !filterDate) return false

                    return (
                        rowDate.getFullYear() === filterDate.getFullYear() &&
                        rowDate.getMonth() === filterDate.getMonth() &&
                        rowDate.getDate() === filterDate.getDate()
                    )
                }

                if (["bedCategory", "hospitalType"].includes(key)) {
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
        XLSX.utils.book_append_sheet(wb, ws, "Bed Booking Data")
        XLSX.writeFile(wb, "bed_booking_data.xlsx")
    }

    const renderDocumentsButton = (row, index) => {
        if (!row.diseaseDetails) {
            return <span className="text-gray-500 text-sm">No details available</span>
        }
        return (
            <Button
                onClick={() => setShowDocuments(showDocuments === index ? null : index)}
                variant="outline"
                size="sm"
                className="flex items-center gap-1 text-xs rounded-xl"
            >
                <Eye className="w-3 h-3" />
                View Details
            </Button>
        )
    }

    const renderDocumentButton = (row, index) => {
        if (!row.documents || row.documents.length === 0) {
            return <span className="text-gray-500 text-sm">No documents</span>
        }
        return (
            <Button
                onClick={() => setShowDocumentModal(showDocumentModal === index ? null : index)}
                variant="outline"
                size="sm"
                className="flex items-center gap-1 text-xs rounded-xl"
            >
                <FolderOpen className="w-3 h-3" />
                View Docs
            </Button>

        )
    }

    const renderDetailsModal = (row, index) => {
        if (showDocuments !== index) return null
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl max-w-md w-full max-h-96 overflow-y-auto">
                    <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Disease Details</h3>
                        <Button onClick={() => setShowDocuments(null)} variant="ghost" size="sm" className="p-1">
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                    <div className="p-4">
                        <div className="space-y-2">
                            <div>
                                <h4 className="font-medium text-gray-700 text-sm">Details:</h4>
                                <p className="text-gray-600 text-sm mt-1 whitespace-pre-wrap">
                                    {row.diseaseDetails || "No details provided"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const renderDocumentModal = (row, index) => {
        if (showDocumentModal !== index) return null
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl max-w-md w-full max-h-96 overflow-y-auto">
                    <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Booking Documents</h3>
                        <Button onClick={() => setShowDocumentModal(null)} variant="ghost" size="sm" className="p-1">
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                    <div className="p-4">
                        {row.documents && row.documents.length > 0 ? (
                            <div className="space-y-4">
                                {row.documents.map((doc, docIndex) => (
                                    <div key={docIndex} className="border border-gray-200 rounded-lg p-3">
                                        <div className="flex items-center gap-3">
                                            <FileText className="w-5 h-5 text-blue-500" />
                                            <div>
                                                <p className="font-medium text-sm">{doc.name || "Document"}</p>
                                                <p className="text-xs text-gray-500">{doc.type || "Unknown type"}</p>
                                            </div>
                                        </div>
                                        <div className="mt-3">
                                            <a
                                                href={doc.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                                            >
                                                <Download className="w-4 h-4" />
                                                Download Document
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-4">No documents available</p>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto font-poppins p-4 lg:p-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
                {/* Header */}
                <div className="p-6">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-blue-600 flex items-center justify-center gap-2">
                            Your Bed Bookings
                        </h2>
                        <p className="text-blue-600 mt-1">Manage and view your bed booking history</p>
                    </div>

                    {/* Top Actions */}
                    <div className="flex justify-end gap-1 py-4">
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
                                label="Bed Category"
                                id="bedCategory"
                                value={filters.bedCategory || ""}
                                onChange={handleFilterChange}
                                options={[
                                    { value: "", label: "All Categories" },
                                    { value: "General", label: "General" },
                                    { value: "ICU", label: "ICU" },
                                    { value: "CCU", label: "CCU" },
                                    { value: "NICU", label: "NICU" },
                                    { value: "PICU", label: "PICU" },
                                    { value: "Isolation", label: "Isolation" },
                                    { value: "Pediatric", label: "Pediatric" },
                                    { value: "Maternity", label: "Maternity" },
                                    { value: "Orthopedic", label: "Orthopedic" },
                                    { value: "Burn", label: "Burn" },
                                    { value: "Ventilator", label: "Ventilator" },
                                ]}
                            />

                            <SelectField
                                label="Hospital Type"
                                id="hospitalType"
                                value={filters.hospitalType || ""}
                                onChange={handleFilterChange}
                                options={[
                                    { value: "", label: "All Hospital Types" },
                                    { value: "Government", label: "Government" },
                                    { value: "Private", label: "Private" },
                                    { value: "NABH", label: "NABH" },
                                    { value: "MJPJAY", label: "MJPJAY" },
                                    { value: "ESIC", label: "ESIC" },
                                    { value: "CGHS", label: "CGHS" },
                                    { value: "Trauma Care", label: "Trauma Care" },
                                    { value: "Cardiac Care", label: "Cardiac Care" },
                                    { value: "Mother & Child", label: "Mother & Child" },
                                    { value: "Speciality", label: "Speciality" },
                                    { value: "Multispeciality", label: "Multispeciality" },
                                    { value: "Super-Speciality", label: "Super-Speciality" },
                                    { value: "Cancer", label: "Cancer" },
                                    { value: "Eye", label: "Eye" },
                                ]}
                            />

                            <DateFilter
                                label="Booking Date"
                                id="bookingDate"
                                selected={filters.bookingDate || null}
                                onChange={handleFilterChange}
                            />

                            <DateFilter
                                label="Created On"
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {paginatedData.map((row, index) => (
                                <div key={index} className="group relative">
                                    {/* Card Container */}
                                    <div className="h-full flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                                        {/* Card Header */}
                                        <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                                            <div className="flex items-start gap-3">
                                                <div className="flex items-center justify-center bg-blue-100 rounded-xl w-10 h-10 p-2">
                                                    <Bed className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-bold text-gray-900 text-sm truncate group-hover:text-blue-600 transition-colors">
                                                        {row.bedCategory || "General Bed"}
                                                    </h3>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                            {row.hospitalType || "Hospital"}
                                                        </span>
                                                        
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Card Body */}
                                        <div className="p-4 flex-1 flex flex-col gap-4">
                                            {/* Bed and Hospital Info */}
                                            <div className="grid grid-cols-2 gap-3">
                                                {/* Bed Number */}
                                                <div className="flex items-center gap-3 p-2 rounded-lg group-hover:bg-gray-50 transition-colors">
                                                    <div className="p-2 bg-purple-100 rounded-full">
                                                        <Bed className="w-4 h-4 text-purple-600" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-xs font-medium text-gray-500">Bed Number</h4>
                                                        <p className="text-sm font-medium text-gray-900 truncate">
                                                            {row.bedDetails?.bedNumber || "—"}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Hospital Name */}
                                                <div className="flex items-center gap-3 p-2 rounded-lg group-hover:bg-gray-50 transition-colors">
                                                    <div className="p-2 bg-green-100 rounded-full">
                                                        <Building2 className="w-4 h-4 text-green-600" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-xs font-medium text-gray-500">Hospital</h4>
                                                        <p className="text-sm font-medium text-gray-900 truncate">
                                                            {row.hospitalDetails?.name || "—"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Date Info */}
                                            <div className="grid grid-cols-2 gap-3">
                                                {/* Booked On */}
                                                <div className="flex items-center gap-3 p-2 rounded-lg group-hover:bg-gray-50 transition-colors">
                                                    <div className="p-2 bg-blue-100 rounded-full">
                                                        <Calendar className="w-4 h-4 text-blue-600" />
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
                                                {/* Documents Section */}
                                                <div className="mt-auto">
                                                    <div className="grid grid-cols-2 gap-3">
                                                        {/* Details Button */}
                                                        <div className="flex items-center gap-2 p-2 rounded-lg group-hover:bg-gray-50 transition-colors">
                                                            <div className="p-1.5 bg-gray-100 rounded-full">
                                                                <FileText className="w-3.5 h-3.5 text-gray-600" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <Button
                                                                    onClick={() => setShowDocuments(showDocuments === index ? null : index)}
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="flex items-center gap-1 text-xs rounded-xl px-2 py-1 h-7"
                                                                >
                                                                    <Eye className="w-3 h-3" />
                                                                    <span className="truncate">Details</span>
                                                                </Button>
                                                            </div>
                                                        </div>

                                                        {/* Documents Button */}
                                                        <div className="flex items-center gap-2 p-2 rounded-lg group-hover:bg-gray-50 transition-colors">
                                                            <div className="p-1.5 bg-orange-100 rounded-full">
                                                                <FolderOpen className="w-3.5 h-3.5 text-orange-600" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <Button
                                                                    onClick={() => setShowDocumentModal(showDocumentModal === index ? null : index)}
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="flex items-center gap-1 text-xs rounded-xl px-2 py-1 h-7"
                                                                >
                                                                    <FolderOpen className="w-3 h-3" />
                                                                    <span className="truncate">Docs</span>
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* View Bed Button */}
                                                {row.bedId && (
                                                    <Link
                                                        href={`/beds/${row.bedCategoryId}`}
                                                        className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-sm font-medium transition-all shadow-sm hover:shadow-md"
                                                    >
                                                        <Bed className="w-4 h-4" />
                                                        View Bed Details
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Modals (keep existing modal code) */}
                                    {renderDetailsModal(row, index)}
                                    {renderDocumentModal(row, index)}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Bed className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No bed bookings found</h3>
                            <p className="text-gray-500">Try adjusting your filters to see more results.</p>
                        </div>
                    )}
                </div>

                {/* Pagination Section */}
                {pageCount > 1 && (
                    <div className="mt-3 px-6 py-2 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
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