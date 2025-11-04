"use client"
import { useState, useMemo } from "react"
import "react-datepicker/dist/react-datepicker.css"
import { Button } from "@/components/ui/button"
import * as XLSX from "xlsx"
import { ShieldCheck, FileDigit, FileText, ExternalLink, Hospital, FolderOpen, Eye, X } from "lucide-react"
import Link from "next/link"
import { SelectField } from "@/app/components/input-selectui"

export default function HealthInsurance({ insuranceData = [], patientName = "Patient" }) {
  const [pageIndex, setPageIndex] = useState(0)
  const pageSize = 3
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    provider: "",
  })
  const [showDocuments, setShowDocuments] = useState(null)

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
    setPageIndex(0)
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
    return insuranceData.filter((row) => {
      return Object.entries(filters).every(([key, filterValue]) => {
        if (!filterValue) return true
        if (key === "provider") {
          const rowValue = String(row[key] || "")
            .toLowerCase()
            .trim()
          const filterValueStr = String(filterValue || "")
            .toLowerCase()
            .trim()
          return rowValue === filterValueStr
        }
        return true
      })
    })
  }, [filters, insuranceData])

  const paginatedData = filteredData.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize)
  const pageCount = Math.ceil(filteredData.length / pageSize)

  const getAvailableDocuments = (row) => {
    const docs = [{ key: "document", label: "Insurance Document", url: row.document }]
    return docs.filter((doc) => doc.url)
  }

  const renderDocumentsButton = (row, index) => {
    const availableDocs = getAvailableDocuments(row)
    if (availableDocs.length === 0) {
      return <span className="text-gray-500 text-sm">No documents</span>
    }
    return (
<Button
  onClick={() => setShowDocuments(showDocuments === index ? null : index)}
  variant="outline"
  size="sm"
  className="flex items-center text-xs rounded-full px-2 py-1 min-w-0 space-x-1"
>
  <span>View({availableDocs.length})</span>
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
            <h3 className="text-lg font-semibold text-gray-900">Insurance Documents</h3>
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
        {/* Header - Centered */}
        <div className="p-6 border-b border-gray-100">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-blue-600 flex items-center justify-center gap-2">
              <ShieldCheck className="w-6 h-6" />
               Patient's Health Insurance Policies
            </h2>
            <p className="text-blue-600 mt-1">View All health insurance policies Taken By Patient's Till Date.</p>
          </div>

          {/* Top Actions - Centered */}
          <div className="flex justify-end gap-2 pb-2">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-blue-500 text-white rounded-xl hover:bg-blue-600"
            >
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
          </div>

          {/* Filters - Only Provider */}
          {showFilters && (
            <div className="flex justify-center">
              <div className="w-full max-w-md p-4 bg-gray-50 rounded-xl border border-gray-200">
                <SelectField
                  label="Provider"
                  id="provider"
                  value={filters.provider || ""}
                  onChange={(value) => handleFilterChange("provider", value)}
                  options={[
                    { value: "", label: "All Providers" },
                    { value: "Basic Insurance", label: "Basic Insurance" },
                    { value: "UnitedHealthcare", label: "UnitedHealthcare" },
                    { value: "Blue Cross Blue Shield", label: "Blue Cross Blue Shield" },
                    { value: "Aetna", label: "Aetna" },
                    { value: "Cigna", label: "Cigna" },
                    { value: "Kaiser Permanente", label: "Kaiser Permanente" },
                    { value: "Humana", label: "Humana" },
                  ]}
                />
              </div>
            </div>
          )}
        </div>

        {/* Card View */}
        <div className="p-6">
          {paginatedData.length ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {paginatedData.map((row, index) => (
                <div key={row.id}>
                  <div className="group bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:border-blue-200 overflow-hidden">
                    {/* Card Header - Provider Only */}
                    <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                      <div className="flex items-center justify-center gap-2">
                        <div className="flex items-center justify-center bg-blue-100 rounded-lg w-8 h-8">
                          <ShieldCheck className="w-4 h-4 text-blue-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 text-sm truncate">{row.provider || "N/A"}</h3>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-4 space-y-4">
                      {/* Row 1 - Coverage and Policy Number */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-start gap-3">
                          <div className="flex items-center justify-center bg-blue-100 rounded-lg w-8 h-8 mt-0.5">
                            <ShieldCheck className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="text-xs font-medium text-gray-500">Coverage</h4>
                            <p className="text-sm font-medium text-gray-900">{row.coverage || "N/A"}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="flex items-center justify-center bg-green-100 rounded-lg w-8 h-8 mt-0.5">
                            <FileDigit className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <h4 className="text-xs font-medium text-gray-500">Policy Number</h4>
                            <p className="text-sm font-medium text-gray-900">{row.policyNumber || "N/A"}</p>
                          </div>
                        </div>
                      </div>

                      {/* Row 2 - Copay and Documents */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-start gap-3">
                          <div className="flex items-center justify-center bg-red-100 rounded-lg w-8 h-8 mt-0.5">
                            <Hospital className="w-4 h-4 text-red-600" />
                          </div>
                          <div>
                            <h4 className="text-xs font-medium text-gray-500">Co-pay</h4>
                            <p className="text-sm font-medium text-gray-900">{row.copay || "N/A"}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center bg-gray-200 rounded-lg w-8 h-8">
                              <FolderOpen className="w-4 h-4 text-gray-600" />
                            </div>
                            <div>
                              <h4 className="text-xs font-medium text-gray-900">Docs</h4>
                            </div>
                          </div>
                          {renderDocumentsButton(row, index)}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Documents Modal */}
                  {renderDocumentsModal(row, index)}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No insurance policies found</h3>
              <p className="text-gray-500">You {"don't"} have any insurance policies registered yet.</p>
              <Button asChild className="mt-4">
                <Link href="/patient/dashboard/add-insurance">Add New Insurance</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Pagination Section */}
        {filteredData.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
            <div className="flex items-center justify-between">
              <Button
                onClick={() => setPageIndex((p) => Math.max(p - 1, 0))}
                disabled={pageIndex === 0}
                variant="outline"
                size="sm"
                className="rounded-full w-24 justify-center border-gray-300 hover:bg-gray-100"
              >
                Previous
              </Button>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="font-medium">
                  Page {pageIndex + 1} of {pageCount}
                </span>
                <span className="text-gray-400">•</span>
                <span className="font-medium">{filteredData.length} total policies</span>
              </div>
              <Button
                onClick={() => setPageIndex((p) => Math.min(p + 1, pageCount - 1))}
                disabled={pageIndex >= pageCount - 1}
                variant="outline"
                size="sm"
                className="rounded-full w-24 justify-center border-gray-300 hover:bg-gray-100"
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
