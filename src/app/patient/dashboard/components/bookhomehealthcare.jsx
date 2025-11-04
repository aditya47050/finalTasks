"use client"
import { useState, useMemo } from "react"
import "react-datepicker/dist/react-datepicker.css"
import { Button } from "@/components/ui/button"
import * as XLSX from "xlsx"
import {
    Heart,
    Building2,
    FileText,
    Calendar,
    Clock,
    ExternalLink,
    Download,
    User,
    Hospital,
    FolderOpen,
    Filter,
    Eye,
    X,
    CheckCircle,
    XCircle
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
];


export default function BookHomeHealthcare({ userdata }) {
    const [pageIndex, setPageIndex] = useState(0)
    const pageSize = 3
    const [showFilters, setShowFilters] = useState(false)
    const [filters, setFilters] = useState({
        serviceName: "",
        status: "",
        createdAt: null,
        preferredDate: null,
        hospitalName: "",
    })
    const [showNotes, setShowNotes] = useState(null)

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

    // Format time for display
    const formatTimeForDisplay = (timeString) => {
        if (!timeString) return "N/A"
        return timeString
    }

    const allHospitals = useMemo(() => {
        const hospitals = new Set();
        userdata.forEach(row => {
            const name = row.HomeHealthcare?.hospital?.hspInfo?.regname;
            if (name) hospitals.add(name);
        });
        return Array.from(hospitals).sort();
    }, [userdata]);


    // Filter functionality
    const filteredData = useMemo(() => {
        return userdata.filter((row) => {
            return Object.entries(filters).every(([key, filterValue]) => {
                if (!filterValue) return true

                if (key === "status") {
                    return row.status === filterValue
                }

                if (key === "createdAt" || key === "preferredDate") {
                    const rowDate = normalizeDate(row[key === "createdAt" ? "createdAt" : "preferredDate"])
                    const filterDate = normalizeDate(filterValue)

                    if (!rowDate || !filterDate) return false

                    // Compare dates at day level (ignoring time)
                    return (
                        rowDate.getFullYear() === filterDate.getFullYear() &&
                        rowDate.getMonth() === filterDate.getMonth() &&
                        rowDate.getDate() === filterDate.getDate()
                    )
                }

                if (key === "hospitalName") {
                    const hospitalName = row.HomeHealthcare?.hospital?.hspInfo?.regname || "";
                    return hospitalName.toLowerCase().includes(filterValue.toLowerCase());
                }


                if (key === "serviceName") {
                    const serviceName = row.HomeHealthcare?.serviceName || ""
                    return serviceName.toLowerCase().includes(filterValue.toLowerCase())
                }

                return true
            })
        })
    }, [filters, userdata])

    const paginatedData = filteredData.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize)
    const pageCount = Math.ceil(filteredData.length / pageSize)

    // Get all unique home healthcare services from the data
    const allHomeHealthcareServices = useMemo(() => {
        const services = new Set()
        userdata.forEach(row => {
            if (row.HomeHealthcare?.serviceName) {
                services.add(row.HomeHealthcare.serviceName)
            }
        })
        return Array.from(services).sort()
    }, [userdata])

    const exportToExcel = () => {
        // Prepare data for export
        const exportData = filteredData.map(row => ({
            "Service Name": row.HomeHealthcare?.serviceName || "N/A",
            "Hospital": row.HomeHealthcare?.hospital?.hspInfo?.regname || "N/A",
            "Preferred Date": formatDateForDisplay(row.preferredDate),
            "Preferred Time": row.preferredTimeSlot || "N/A",
            "Status": row.status,
            "Booked On": formatDateForDisplay(row.createdAt),
            "Last Updated": formatDateForDisplay(row.updatedAt),
            "Notes": row.notes || "N/A",
        }))

        const ws = XLSX.utils.json_to_sheet(exportData)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, "Home Healthcare Data")
        XLSX.writeFile(wb, "home_healthcare_data.xlsx")
    }

    const renderNotesButton = (row, index) => {
        if (!row.notes) {
            return <span className="text-gray-500 text-sm">No notes available</span>
        }
        return (
            <Button
                onClick={() => setShowNotes(showNotes === index ? null : index)}
                variant="outline"
                size="sm"
                className="flex items-center text-xs rounded-full px-6"
            >
                <Eye className="w-3 h-3" />
                View Notes
            </Button>
        )
    }

    const renderNotesModal = (row, index) => {
        if (showNotes !== index || !row.notes) return null

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg max-w-md w-full max-h-96 overflow-y-auto">
                    <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Booking Notes</h3>
                        <Button onClick={() => setShowNotes(null)} variant="ghost" size="sm" className="p-1">
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                    <div className="p-4">
                        <p className="text-gray-700 whitespace-pre-wrap">{row.notes}</p>
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
                            <Heart className="w-6 h-6" />
                            Your Home Healthcare Bookings
                        </h2>
                        <p className="text-blue-600 mt-1">Manage and view your home healthcare service history</p>
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
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 mt-4">
                            <SelectField
                                label="Hospital Name"
                                id="hospitalName"
                                value={filters.hospitalName || ""}
                                onChange={handleFilterChange}
                                options={[
                                    { value: "", label: "All Hospitals" },
                                    ...allHospitals.map(hospital => ({
                                        value: hospital,
                                        label: hospital,
                                    })),
                                ]}
                            />

                            <SelectField
                                label="Service Name"
                                id="serviceName"
                                value={filters.serviceName || ""}
                                onChange={handleFilterChange}
                                options={[
                                    { value: "", label: "All Services" },
                                    ...homeHealthcareServices.map(service => ({
                                        value: service,
                                        label: service
                                    }))
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

                            <DateFilter
                                label="Preferred Date"
                                id="preferredDate"
                                selected={filters.preferredDate || null}
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
                                        <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
                                            <div className="flex items-start gap-3">
                                                {/* Icon */}
                                                <div className="flex items-center justify-center bg-blue-100 rounded-xl w-10 h-10 p-2">
                                                    <Heart className="w-5 h-5 text-blue-600 rounded-xl" />
                                                </div>

                                                {/* Title + Status */}
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-bold text-gray-900 text-sm truncate group-hover:text-blue-600 transition-colors">
                                                        {row.HomeHealthcare?.serviceName || "Home Healthcare Service"}
                                                    </h3>

                                                    {/* Status */}
                                                    <div className="flex items-center justify-between mt-1">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                            Home Care
                                                        </span>

                                                        <span
                                                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[row.status] || "bg-gray-100 text-gray-800"
                                                                }`}
                                                        >
                                                            {statusIcons[row.status]} {row.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-4 flex-1 flex flex-col gap-4">
                                            {/* Hospital Info */}
                                            <div className="flex items-center gap-3 p-2 rounded-lg group-hover:bg-gray-50 transition-colors">
                                                <div className="p-2 bg-green-100 rounded-full">
                                                    <Hospital className="w-4 h-4 text-green-600" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-xs font-medium text-gray-500">Hospital</h4>
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {row.HomeHealthcare?.hospital?.hspInfo?.regname || "Not specified"}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Date & Time Info */}
                                            <div className="grid grid-cols-2 gap-3">
                                                {/* Preferred Date */}
                                                <div className="flex items-center gap-3 p-2 rounded-lg group-hover:bg-gray-50 transition-colors">
                                                    <div className="p-2 bg-purple-100 rounded-full">
                                                        <Calendar className="w-4 h-4 text-purple-600" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-xs font-medium text-gray-500">Preferred Date</h4>
                                                        <p className="text-sm text-gray-700 whitespace-nowrap">
                                                            {formatDateForDisplay(row.preferredDate)}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Preferred Time */}
                                                <div className="flex items-center gap-3 p-2 rounded-lg group-hover:bg-gray-50 transition-colors">
                                                    <div className="p-2 bg-yellow-100 rounded-full">
                                                        <Clock className="w-4 h-4 text-yellow-600" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-xs font-medium text-gray-500">Preferred Time</h4>
                                                        <p className="text-sm text-gray-700 whitespace-nowrap">
                                                            {formatTimeForDisplay(row.preferredTimeSlot)}
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
                                                    <div className="p-2 bg-gray-100 rounded-full">
                                                        <Clock className="w-4 h-4 text-gray-600" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-xs font-medium text-gray-500">Updated</h4>
                                                        <p className="text-sm text-gray-700 whitespace-nowrap">
                                                            {formatDateForDisplay(row.updatedAt)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Notes Section */}
                                            <div className="mt-auto">
                                                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="w-4 h-4 text-gray-600" />
                                                        <span className="text-xs font-medium text-gray-700">Notes</span>
                                                    </div>
                                                    {renderNotesButton(row, index)}
                                                </div>

                                                {/* View Service Button */}
                                                {row.HomeHealthcare?.hospital?.id && (
                                                    <Link
                                                        href={`/home-healthcare/${encodeURIComponent(row.HomeHealthcare.serviceName)}/${row.HomeHealthcare.hospital.id}`}
                                                        className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl text-sm font-medium transition-all shadow-sm hover:shadow-md"
                                                    >
                                                        <User className="w-4 h-4" />
                                                        View Service Details
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Notes Modal */}
                                    {renderNotesModal(row, index)}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Heart className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No home healthcare bookings found</h3>
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