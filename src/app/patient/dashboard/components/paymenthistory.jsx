"use client"
import { useState, useMemo } from "react"
import * as XLSX from "xlsx"
import {
  FileText,
  Calendar,
  Clock,
  Download,
  Filter,
  CreditCard,
  BadgeCheck,
  BadgeX,
  Loader2,
  IndianRupee,
  Receipt,
  ExternalLink,
  X,
} from "lucide-react"
import { DateFilter, SelectField } from "@/app/components/input-selectui"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const statusIcons = {
  success: <BadgeCheck className="w-4 h-4 text-green-500" />,
  failed: <BadgeX className="w-4 h-4 text-red-500" />,
  pending: <Loader2 className="w-4 h-4 text-yellow-500 animate-spin" />,
  refunded: <BadgeCheck className="w-4 h-4 text-blue-500" />
}

const statusColors = {
  success: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
  pending: "bg-yellow-100 text-yellow-800",
  refunded: "bg-blue-100 text-blue-800"
}

export default function PatientPayment({ userdata }) {
  const [pageIndex, setPageIndex] = useState(0)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [isReceiptOpen, setIsReceiptOpen] = useState(false)
  const pageSize = 3

  const [filters, setFilters] = useState({
    status: "",
    transactionId: "",
    createdAt: null,
    updatedAt: null
  })

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }))
    setPageIndex(0)
  }

  const normalizeDate = (date) => {
    if (!date) return null
    const d = new Date(date)
    if (isNaN(d.getTime())) return null
    return new Date(d.getFullYear(), d.getMonth(), d.getDate())
  }

  const formatDate = (date) => {
    if (!date) return "N/A"
    const d = new Date(date)
    if (isNaN(d.getTime())) return "N/A"
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(amount)
  }

  const filteredData = useMemo(() => {
    return userdata.filter(row => {
      // Status filter
      if (filters.status && row.status.toLowerCase() !== filters.status.toLowerCase()) return false

      // Transaction ID filter
      if (filters.transactionId && 
          !String(row.transactionId || "").toLowerCase().includes(filters.transactionId.toLowerCase())) {
        return false
      }

      // Created date filter
      if (filters.createdAt) {
        const createdDate = normalizeDate(row.createdAt)
        const filterDate = normalizeDate(filters.createdAt)
        if (!createdDate || !filterDate) return false
        return (
          createdDate.getFullYear() === filterDate.getFullYear() &&
          createdDate.getMonth() === filterDate.getMonth() &&
          createdDate.getDate() === filterDate.getDate()
        )
      }

      // Updated date filter
      if (filters.updatedAt) {
        const updatedDate = normalizeDate(row.updatedAt)
        const filterDate = normalizeDate(filters.updatedAt)
        if (!updatedDate || !filterDate) return false
        return (
          updatedDate.getFullYear() === filterDate.getFullYear() &&
          updatedDate.getMonth() === filterDate.getMonth() &&
          updatedDate.getDate() === filterDate.getDate()
        )
      }

      return true
    })
  }, [filters, userdata])

  const paginatedData = filteredData.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)
  const pageCount = Math.ceil(filteredData.length / pageSize)

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Payment Data")
    XLSX.writeFile(wb, "patient_payments.xlsx")
  }

  return (
    <div className="container mx-auto font-poppins p-4 lg:p-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="text-center mb-1">
            <h2 className="text-2xl font-bold text-blue-600 flex items-center justify-center gap-2">
              Your Payment History
            </h2>
            <p className="text-blue-600 mt-0.5">View and manage your payment transactions</p>
          </div>

          {/* Top Actions */}
          <div className="flex justify-end gap-1 py-4">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-blue-600 text-white rounded-xl hover:bg-blue-600 active:bg-blue-600 focus:bg-blue-600"
            >
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
            <Button
              onClick={exportToExcel}
              className="bg-green-600 text-white rounded-xl hover:bg-green-600 active:bg-green-600 focus:bg-green-600"
            >
              Export to Excel
            </Button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
              <SelectField
                label="Payment Status"
                id="status"
                value={filters.status || ""}
                onChange={handleFilterChange}
                options={[
                  { value: "", label: "All Statuses" },
                  { value: "success", label: "Success" },
                  { value: "failed", label: "Failed" },
                  { value: "pending", label: "Pending" },
                  { value: "refunded", label: "Refunded" },
                ]}
              />

              <div className="space-y-1">
                <label htmlFor="transactionId" className="block text-xs font-medium text-gray-700">
                  Transaction ID
                </label>
                <input
                  type="text"
                  id="transactionId"
                  value={filters.transactionId || ""}
                  onChange={(e) => handleFilterChange("transactionId", e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Search transaction ID"
                />
              </div>

              <DateFilter
                label="Paid On"
                id="createdAt"
                selected={filters.createdAt || null}
                onChange={handleFilterChange}
              />

              <DateFilter
                label="Updated Date"
                id="updatedAt"
                selected={filters.updatedAt || null}
                onChange={handleFilterChange}
              />
            </div>
          )}
        </div>

        {/* Card View */}
        <div className="p-6">
          {paginatedData.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {paginatedData.map((payment, index) => (
                <div key={index} className="group relative">
                  {/* Card Container */}
                  <div className="h-full flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                    {/* Card Header */}
                    <div className="p-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                      <div className="flex items-center justify-between">
                        {/* Left section */}
                        <div className="flex items-start gap-2">
                          <div className="flex items-center justify-center bg-blue-100 rounded-xl w-8 h-8 p-1.5">
                            <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 text-xs truncate group-hover:text-blue-600 transition-colors">
                              {payment.transactionId || "Payment"}
                            </h3>
                            <span className="   text-blue-700">
                              {payment.paymentMethod || "N/A"}
                            </span>
                          </div>
                        </div>

                        {/* Right-aligned status */}
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full    font-medium ${statusColors[payment.status.toLowerCase()] || "bg-gray-100 text-gray-800"}`}
                        >
                          {statusIcons[payment.status.toLowerCase()] || statusIcons.pending}
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1).toLowerCase()}
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-3 flex-1 flex flex-col gap-2">
                      {/* First Row */}
                      <div className="grid grid-cols-2 gap-2">
                        {/* Amount */}
                        <div className="flex items-center gap-2 p-1 rounded-lg group-hover:bg-gray-50 transition-colors">
                          <div className="p-1.5 bg-purple-100 rounded-full">
                            <IndianRupee className="w-3 h-3 text-purple-600" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-medium text-gray-900   ">Amount</h4>
                            <p className="text-gray-600   ">
                              {formatCurrency(payment.amount).replace('₹', '')}
                            </p>
                          </div>
                        </div>

                        {/* Payment Method */}
                        <div className="flex items-center gap-2 p-1 rounded-lg group-hover:bg-gray-50 transition-colors">
                          <div className="p-1.5 bg-green-100 rounded-full">
                            <CreditCard className="w-3 h-3 text-green-600" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-medium text-gray-900   ">Method</h4>
                            <p className="text-gray-700    truncate">
                              {payment.paymentMethod || "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Second Row */}
                      <div className="grid grid-cols-2 gap-2">
                        {/* Paid On */}
                        <div className="flex items-center gap-2 p-1 rounded-lg group-hover:bg-gray-50 transition-colors">
                          <div className="p-1.5 bg-blue-100 rounded-full">
                            <Calendar className="w-3 h-3 text-blue-600" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-medium text-gray-900   ">Paid On</h4>
                            <p className="text-gray-600    whitespace-nowrap">
                              {formatDate(payment.createdAt)}
                            </p>
                          </div>
                        </div>

                        {/* Updated At */}
                        <div className="flex items-center gap-2 p-1 rounded-lg group-hover:bg-gray-50 transition-colors">
                          <div className="p-1.5 bg-indigo-100 rounded-full">
                            <Clock className="w-3 h-3 text-indigo-600" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-medium text-gray-900   ">Updated</h4>
                            <p className="text-gray-600    whitespace-nowrap">
                              {formatDate(payment.updatedAt)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="mt-2 p-1">
                        <Button
                          onClick={() => {
                            setSelectedPayment(payment)
                            setIsReceiptOpen(true)
                          }}
                          className="w-full flex items-center justify-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[11px] font-medium transition-colors"
                        >
                          <Receipt className="w-3 h-3" />
                          <span>View Receipt</span>
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CreditCard className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-1.5">No payment records found</h3>
              <p className="text-gray-500 text-xs">Try adjusting your filters to see more results.</p>
            </div>
          )}
        </div>

        {/* Pagination Section */}
        {pageCount > 1 && (
          <div className="px-6 py-2 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
            <div className="flex items-center justify-between">
              {/* Previous Button */}
              <Button
                onClick={() => setPageIndex((p) => Math.max(p - 1, 0))}
                disabled={pageIndex === 0}
                variant="outline"
                size="sm"
                className="rounded-full w-24 justify-center"
              >
                Previous
              </Button>

              {/* Page Info */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>
                  Page {pageIndex + 1} of {pageCount}
                </span>
                <span className="text-gray-400">•</span>
                <span>{filteredData.length} total payments</span>
              </div>

              {/* Next Button */}
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

      {/* Receipt Dialog */}
      <Dialog open={isReceiptOpen} onOpenChange={setIsReceiptOpen}>
        <DialogContent className="sm:max-w-[600px] bg-white rounded-2xl shadow-xl">
          <DialogHeader className="border-b pb-3">
            <div className="flex justify-between items-center">
              <DialogTitle className="text-xl font-bold text-blue-700 flex items-center gap-2">
                <Receipt className="w-5 h-5" />
                Payment Receipt
              </DialogTitle>
            </div>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-4 p-4">
              {/* Transaction Info */}
              <div className="bg-blue-50 p-4 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-blue-600 font-medium">Transaction ID</p>
                    <p className="font-bold text-blue-900">{selectedPayment.transactionId}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[selectedPayment.status.toLowerCase()]}`}>
                    {statusIcons[selectedPayment.status.toLowerCase()]}
                    {selectedPayment.status.charAt(0).toUpperCase() + selectedPayment.status.slice(1).toLowerCase()}
                  </span>
                </div>
              </div>

              {/* Payment Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Payment Method</p>
                  <p className="font-medium text-sm">{selectedPayment.paymentMethod || "N/A"}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Paid On</p>
                  <p className="font-medium text-sm">{formatDate(selectedPayment.createdAt)}</p>
                </div>
              </div>

              {/* Amount Section */}
              <div className="bg-green-50 p-4 rounded-xl text-center border border-green-100">
                <p className="text-xs text-green-600 font-medium">Amount Paid</p>
                <p className="text-2xl font-bold text-green-700">
                  {formatCurrency(selectedPayment.amount)}
                </p>
              </div>

              {/* Additional Info */}
              {selectedPayment.description && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Description</p>
                  <p className="font-medium text-sm">{selectedPayment.description}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}