"use client"

import { useMemo, useState } from "react"
import * as XLSX from "xlsx"
import { Button } from "@/components/ui/button"
import { Filter, Download, Users, Building, User, CreditCard } from "lucide-react"

const ComprehensivePaymentsList = ({ esevaName, directPayments, subAdminPayments, patientPayments, totalStats }) => {
  const [activeCategory, setActiveCategory] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    mobile: "",
    dateFrom: "",
    dateTo: "",
    status: "",
    minAmount: "",
    maxAmount: "",
  })

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  // Filter function for all payment types
  const filterPayments = (payments, type) => {
    return payments.filter((payment) => {
      // Date filtering
      const paymentDate = new Date(payment.createdAt)
      const fromDate = filters.dateFrom ? new Date(filters.dateFrom) : null
      const toDate = filters.dateTo ? new Date(filters.dateTo) : null

      if (fromDate && paymentDate < fromDate) return false
      if (toDate && paymentDate > toDate) return false

      // Status filtering
      if (filters.status && payment.paymentStatus !== filters.status) return false

      // Amount filtering
      if (filters.minAmount && payment.amount < Number.parseFloat(filters.minAmount)) return false
      if (filters.maxAmount && payment.amount > Number.parseFloat(filters.maxAmount)) return false

      // Name/Email/Mobile filtering (only for patient and subadmin payments)
      if (type === "patient" && payment.patient) {
        const fullName = `${payment.patient.firstName || ""} ${payment.patient.lastName || ""}`.toLowerCase()
        const email = (payment.patient.email || "").toLowerCase()
        const mobile = (payment.patient.mobile || "").toLowerCase()

        if (filters.name && !fullName.includes(filters.name.toLowerCase())) return false
        if (filters.email && !email.includes(filters.email.toLowerCase())) return false
        if (filters.mobile && !mobile.includes(filters.mobile.toLowerCase())) return false
      }

      if (type === "subadmin" && payment.subAdmin) {
        const fullName = `${payment.subAdmin.firstName || ""} ${payment.subAdmin.lastName || ""}`.toLowerCase()
        const email = (payment.subAdmin.email || "").toLowerCase()
        const mobile = (payment.subAdmin.mobile || "").toLowerCase()

        if (filters.name && !fullName.includes(filters.name.toLowerCase())) return false
        if (filters.email && !email.includes(filters.email.toLowerCase())) return false
        if (filters.mobile && !mobile.includes(filters.mobile.toLowerCase())) return false
      }

      return true
    })
  }

  const filteredDirectPayments = useMemo(() => filterPayments(directPayments, "direct"), [filters, directPayments])
  const filteredSubAdminPayments = useMemo(
    () => filterPayments(subAdminPayments, "subadmin"),
    [filters, subAdminPayments],
  )
  const filteredPatientPayments = useMemo(() => filterPayments(patientPayments, "patient"), [filters, patientPayments])

  // Get current data based on active category
  const getCurrentData = () => {
    switch (activeCategory) {
      case "direct":
        return filteredDirectPayments
      case "subadmin":
        return filteredSubAdminPayments
      case "patient":
        return filteredPatientPayments
      case "all":
      default:
        return [
          ...filteredDirectPayments.map((p) => ({ ...p, type: "Direct E-seva" })),
          ...filteredSubAdminPayments.map((p) => ({ ...p, type: "Sub-admin" })),
          ...filteredPatientPayments.map((p) => ({ ...p, type: "Patient" })),
        ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }
  }

  // Excel Export
  const exportToExcel = () => {
    const dataToExport = getCurrentData()
    const ws = XLSX.utils.json_to_sheet(dataToExport)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, `${activeCategory}_payments`)
    XLSX.writeFile(wb, `${esevaName}_${activeCategory}_payments.xlsx`)
  }

  const categories = [
    { id: "all", label: "All Payments", icon: CreditCard, count: totalStats.total },
    { id: "direct", label: "E-seva Direct", icon: Building, count: totalStats.direct },
    { id: "subadmin", label: "Sub-admin", icon: Users, count: totalStats.subadmin },
    { id: "patient", label: "Patient", icon: User, count: totalStats.patient },
  ]

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-2xl shadow-lg space-y-8">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-blue-700">{esevaName} - Payment Management</h2>
        <p className="text-blue-600 mt-2">Comprehensive Payment Overview</p>
      </div>

      {/* Category Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {categories.map((category) => {
          const Icon = category.icon
          return (
            <div
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`p-4 rounded-xl cursor-pointer transition-all ${
                activeCategory === category.id ? "bg-blue-500 text-white shadow-lg" : "bg-gray-50 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{category.label}</p>
                  <p className="text-2xl font-bold">{category.count}</p>
                </div>
                <Icon className="w-8 h-8 opacity-70" />
              </div>
            </div>
          )
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2 mb-4">
        <Button
          onClick={() => setShowFilters(!showFilters)}
          variant="outline"
          className="bg-blue-500 text-white rounded-xl hover:bg-blue-600"
        >
          <Filter className="w-4 h-4 mr-2" />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </Button>
        <Button
          onClick={exportToExcel}
          variant="outline"
          className="bg-green-500 text-white rounded-xl hover:bg-green-600"
        >
          <Download className="w-4 h-4 mr-2" />
          Export to Excel
        </Button>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-xl space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search by Name"
              value={filters.name}
              onChange={(e) => handleFilterChange("name", e.target.value)}
              className="border p-2 rounded-lg"
            />
            <input
              type="email"
              placeholder="Search by Email"
              value={filters.email}
              onChange={(e) => handleFilterChange("email", e.target.value)}
              className="border p-2 rounded-lg"
            />
            <input
              type="text"
              placeholder="Search by Mobile"
              value={filters.mobile}
              onChange={(e) => handleFilterChange("mobile", e.target.value)}
              className="border p-2 rounded-lg"
            />
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="border p-2 rounded-lg"
            >
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="COMPLETED">Completed</option>
              <option value="FAILED">Failed</option>
              <option value="REFUNDED">Refunded</option>
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="date"
              placeholder="From Date"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
              className="border p-2 rounded-lg"
            />
            <input
              type="date"
              placeholder="To Date"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange("dateTo", e.target.value)}
              className="border p-2 rounded-lg"
            />
            <input
              type="number"
              placeholder="Min Amount"
              value={filters.minAmount}
              onChange={(e) => handleFilterChange("minAmount", e.target.value)}
              className="border p-2 rounded-lg"
            />
            <input
              type="number"
              placeholder="Max Amount"
              value={filters.maxAmount}
              onChange={(e) => handleFilterChange("maxAmount", e.target.value)}
              className="border p-2 rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Payments Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {activeCategory === "all" && <th className="border p-3 text-left">Type</th>}
              {(activeCategory === "patient" || activeCategory === "subadmin" || activeCategory === "all") && (
                <>
                  <th className="border p-3 text-left">Name</th>
                  <th className="border p-3 text-left">Email</th>
                  <th className="border p-3 text-left">Mobile</th>
                </>
              )}
              <th className="border p-3 text-left">Transaction ID</th>
              <th className="border p-3 text-left">Amount</th>
              <th className="border p-3 text-left">Status</th>
              <th className="border p-3 text-left">Purpose</th>
              <th className="border p-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {getCurrentData().map((payment) => (
              <tr key={`${payment.type || activeCategory}-${payment.id}`} className="hover:bg-gray-50">
                {activeCategory === "all" && (
                  <td className="border p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        payment.type === "Direct E-seva"
                          ? "bg-blue-100 text-blue-800"
                          : payment.type === "Sub-admin"
                            ? "bg-green-100 text-green-800"
                            : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {payment.type}
                    </span>
                  </td>
                )}
                {(activeCategory === "patient" || activeCategory === "subadmin" || activeCategory === "all") && (
                  <>
                    <td className="border p-3">
                      {payment.patient
                        ? `${payment.patient.firstName || ""} ${payment.patient.lastName || ""}`
                        : payment.subAdmin
                          ? `${payment.subAdmin.firstName || ""} ${payment.subAdmin.lastName || ""}`
                          : "-"}
                    </td>
                    <td className="border p-3">{payment.patient?.email || payment.subAdmin?.email || "-"}</td>
                    <td className="border p-3">{payment.patient?.mobile || payment.subAdmin?.mobile || "-"}</td>
                  </>
                )}
                <td className="border p-3 font-mono text-xs">{payment.transactionId}</td>
                <td className="border p-3 font-semibold">₹{payment.amount.toLocaleString()}</td>
                <td className="border p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      payment.paymentStatus === "COMPLETED"
                        ? "bg-green-100 text-green-800"
                        : payment.paymentStatus === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : payment.paymentStatus === "FAILED"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {payment.paymentStatus}
                  </span>
                </td>
                <td className="border p-3">{payment.forwhat || "-"}</td>
                <td className="border p-3">
                  {new Date(payment.createdAt).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {getCurrentData().length === 0 && (
          <div className="text-center py-8 text-gray-500">No payments found matching your criteria.</div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="bg-blue-50 p-4 rounded-xl">
        <h3 className="font-semibold text-blue-800 mb-2">Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-blue-600">Total Payments</p>
            <p className="font-bold text-blue-800">{getCurrentData().length}</p>
          </div>
          <div>
            <p className="text-blue-600">Total Amount</p>
            <p className="font-bold text-blue-800">
              ₹
              {getCurrentData()
                .reduce((sum, p) => sum + p.amount, 0)
                .toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-blue-600">Completed</p>
            <p className="font-bold text-green-600">
              {getCurrentData().filter((p) => p.paymentStatus === "COMPLETED").length}
            </p>
          </div>
          <div>
            <p className="text-blue-600">Pending</p>
            <p className="font-bold text-yellow-600">
              {getCurrentData().filter((p) => p.paymentStatus === "PENDING").length}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComprehensivePaymentsList
