"use client"

import { useMemo, useState } from "react"
import * as XLSX from "xlsx"
import { Button } from "@/components/ui/button"
import { Filter, Download, Users, CreditCard, Building2, TrendingUp } from "lucide-react"

const EsevaPaymentsList = ({
  esevaName,
  directPayments,
  subAdminPayments,
  patientPayments,
  userRole,
  currentSubAdminId,
}) => {
  const [paymentType, setPaymentType] = useState("overview") // overview | eseva | subadmin | patient | subadmin-collections
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    mobile: "",
    date: null,
    subAdminId: "",
    amountMin: "",
    amountMax: "",
    status: "",
  })

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const normalizeDate = (date) => {
    if (!date) return null
    const d = new Date(date)
    if (isNaN(d.getTime())) return null
    return new Date(d.getFullYear(), d.getMonth(), d.getDate())
  }

  const getFilteredPayments = (payments, type) => {
    let filtered = payments

    // If user is subadmin, only show their payments
    if (userRole === "subadmin" && currentSubAdminId) {
      if (type === "subadmin") {
        filtered = payments.filter((p) => p.subAdminId === currentSubAdminId)
      } else if (type === "patient") {
        filtered = payments.filter((p) => p.esevaSubAdminId === currentSubAdminId)
      }
    }

    return filtered.filter((payment) => {
      const patientName = payment.patient
        ? `${payment.patient.firstName || ""} ${payment.patient.lastName || ""}`.toLowerCase().trim()
        : ""
      const subAdminName = payment.subAdmin
        ? `${payment.subAdmin.firstName || ""} ${payment.subAdmin.lastName || ""}`.toLowerCase().trim()
        : ""
      const email = (payment.patient?.email || payment.subAdmin?.email || "").toLowerCase().trim()
      const mobile = (payment.patient?.mobile || payment.subAdmin?.mobile || "").toLowerCase().trim()

      const createdDate = normalizeDate(payment.createdAt)
      const selectedDate = normalizeDate(filters.date)

      const amount = Number.parseFloat(payment.amount)
      const minAmount = filters.amountMin ? Number.parseFloat(filters.amountMin) : null
      const maxAmount = filters.amountMax ? Number.parseFloat(filters.amountMax) : null

      return (
        (filters.name
          ? patientName.includes(filters.name.toLowerCase()) || subAdminName.includes(filters.name.toLowerCase())
          : true) &&
        (filters.email ? email.includes(filters.email.toLowerCase()) : true) &&
        (filters.mobile ? mobile.includes(filters.mobile.toLowerCase()) : true) &&
        (selectedDate && createdDate ? createdDate.getTime() === selectedDate.getTime() : true) &&
        (minAmount !== null ? amount >= minAmount : true) &&
        (maxAmount !== null ? amount <= maxAmount : true) &&
        (filters.status ? payment.paymentStatus.toLowerCase().includes(filters.status.toLowerCase()) : true)
      )
    })
  }

  const subAdminCollections = useMemo(() => {
    const collections = {}

    subAdminPayments.forEach((payment) => {
      const subAdminId = payment.subAdminId
      const subAdminName = `${payment.subAdmin?.firstName || ""} ${payment.subAdmin?.lastName || ""}`.trim()

      if (!collections[subAdminId]) {
        collections[subAdminId] = {
          name: subAdminName,
          email: payment.subAdmin?.email,
          mobile: payment.subAdmin?.mobile,
          totalAmount: 0,
          paymentCount: 0,
          payments: [],
        }
      }

      collections[subAdminId].totalAmount += payment.amount
      collections[subAdminId].paymentCount += 1
      collections[subAdminId].payments.push(payment)
    })

    // Add patient payments collected by subadmins
    patientPayments.forEach((payment) => {
      if (payment.esevaSubAdminId) {
        const subAdminId = payment.esevaSubAdminId

        if (collections[subAdminId]) {
          collections[subAdminId].totalAmount += payment.amount
          collections[subAdminId].paymentCount += 1
          collections[subAdminId].payments.push({ ...payment, type: "patient" })
        }
      }
    })

    return Object.values(collections)
  }, [subAdminPayments, patientPayments])

  const overviewStats = useMemo(() => {
    const directTotal = directPayments.reduce((sum, p) => sum + p.amount, 0)
  const subAdminMap = new Map()
  subAdminPayments.forEach(p => {
    if (p.paymentStatus === "SUCCESS" && !subAdminMap.has(p.subAdminId)) {
      subAdminMap.set(p.subAdminId, p.amount)
    }
  })
  const subAdminTotal = Array.from(subAdminMap.values()).reduce((sum, amt) => sum + amt, 0)
    const patientTotal = patientPayments.reduce((sum, p) => sum + p.amount, 0)


    return {
      direct: { count: directPayments.length, total: directTotal },
      subadmin: { count: subAdminMap.size, total: subAdminTotal },
      patient: { count: patientPayments.length, total: patientTotal },
      overall: {
        count: directPayments.length + subAdminMap.size + patientPayments.length,
        total: directTotal + subAdminTotal + patientTotal,
      },
    }
  }, [directPayments, subAdminPayments, patientPayments])

  const exportToExcel = () => {
    let dataToExport = []
    let filename = ""

    switch (paymentType) {
      case "eseva":
        dataToExport = directPayments
        filename = "eseva_direct_payments.xlsx"
        break
      case "subadmin":
        dataToExport = getFilteredPayments(subAdminPayments, "subadmin")
        filename = "subadmin_payments.xlsx"
        break
      case "patient":
        dataToExport = getFilteredPayments(patientPayments, "patient")
        filename = "patient_payments.xlsx"
        break
      case "subadmin-collections":
        dataToExport = subAdminCollections
        filename = "subadmin_collections.xlsx"
        break
      default:
        dataToExport = [...directPayments, ...subAdminPayments, ...patientPayments]
        filename = "all_payments.xlsx"
    }

    const ws = XLSX.utils.json_to_sheet(dataToExport)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Payments")
    XLSX.writeFile(wb, filename)
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-2xl shadow-lg space-y-8">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-blue-700">
          {userRole === "subadmin" ? "My Payments Dashboard" : `${esevaName} - Payment Management`}
        </h2>
        <p className="text-blue-600 mt-1">Comprehensive Payment Analytics</p>
      </div>

      {paymentType === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Direct E-seva</p>
                <p className="text-2xl font-bold">{overviewStats.direct.count}</p>
                <p className="text-sm">₹{overviewStats.direct.total.toLocaleString()}</p>
              </div>
              <Building2 className="w-8 h-8 text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Sub-admin</p>
                <p className="text-2xl font-bold">{overviewStats.subadmin.count}</p>
                <p className="text-sm">₹{overviewStats.subadmin.total.toLocaleString()}</p>
              </div>
              <Users className="w-8 h-8 text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Patient</p>
                <p className="text-2xl font-bold">{overviewStats.patient.count}</p>
                <p className="text-sm">₹{overviewStats.patient.total.toLocaleString()}</p>
              </div>
              <CreditCard className="w-8 h-8 text-purple-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Total</p>
                <p className="text-2xl font-bold">{overviewStats.overall.count}</p>
                <p className="text-sm">₹{overviewStats.overall.total.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-200" />
            </div>
          </div>
        </div>
      )}

      {/* Top Controls */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <label className="font-medium">View:</label>
          <select
            value={paymentType}
            onChange={(e) => setPaymentType(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >
            <option value="overview">Overview</option>
            <option value="eseva">E-seva Direct</option>
            <option value="subadmin">Sub-admin Payments</option>
            <option value="patient">Patient Payments</option>
            {userRole !== "subadmin" && <option value="subadmin-collections">Sub-admin Collections</option>}
          </select>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            className="bg-blue-500 text-white hover:bg-blue-600"
          >
            <Filter className="w-4 h-4 mr-2" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
          <Button onClick={exportToExcel} variant="outline" className="bg-green-500 text-white hover:bg-green-600">
            <Download className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      {showFilters && paymentType !== "overview" && (
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <input
              type="text"
              placeholder="Search by Name"
              value={filters.name}
              onChange={(e) => handleFilterChange("name", e.target.value)}
              className="border p-2 rounded"
            />
            <input
              type="email"
              placeholder="Search by Email"
              value={filters.email}
              onChange={(e) => handleFilterChange("email", e.target.value)}
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Search by Mobile"
              value={filters.mobile}
              onChange={(e) => handleFilterChange("mobile", e.target.value)}
              className="border p-2 rounded"
            />
            <input
              type="number"
              placeholder="Min Amount"
              value={filters.amountMin}
              onChange={(e) => handleFilterChange("amountMin", e.target.value)}
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Status"
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="border p-2 rounded"
            />
          </div>
        </div>
      )}

      {paymentType === "subadmin-collections" && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-800">Sub-admin Payment Collections</h3>
          <div className="grid gap-4">
            {subAdminCollections.map((collection, index) => (
              <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">{collection.name}</h4>
                    <p className="text-gray-600">{collection.email}</p>
                    <p className="text-gray-600">{collection.mobile}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">₹{collection.totalAmount.toLocaleString()}</p>
                    <p className="text-gray-600">{collection.paymentCount} payments</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment Tables */}
      {paymentType === "eseva" && (
        <div className="overflow-x-auto">
          <h3 className="text-xl font-semibold mb-4">Direct E-seva Payments</h3>
          <table className="w-full border border-gray-200 text-sm">
            <thead className="bg-blue-50">
              <tr>
                <th className="border p-3 text-left">Transaction ID</th>
                <th className="border p-3 text-left">Amount</th>
                <th className="border p-3 text-left">Status</th>
                <th className="border p-3 text-left">Purpose</th>
                <th className="border p-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {directPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="border p-3">{payment.transactionId}</td>
                  <td className="border p-3 font-semibold">₹{payment.amount.toLocaleString()}</td>
                  <td className="border p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        payment.paymentStatus === "SUCCESS"
                          ? "bg-green-100 text-green-800"
                          : payment.paymentStatus === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {payment.paymentStatus}
                    </span>
                  </td>
                  <td className="border p-3">{payment.forwhat || "-"}</td>
                  <td className="border p-3">{new Date(payment.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {paymentType === "subadmin" && (
        <div className="overflow-x-auto">
          <h3 className="text-xl font-semibold mb-4">Sub-admin Payments</h3>
          <table className="w-full border border-gray-200 text-sm">
            <thead className="bg-green-50">
              <tr>
                <th className="border p-3 text-left">Sub-admin</th>
                <th className="border p-3 text-left">Email</th>
                <th className="border p-3 text-left">Transaction ID</th>
                <th className="border p-3 text-left">Amount</th>
                <th className="border p-3 text-left">Status</th>
                <th className="border p-3 text-left">Purpose</th>
                <th className="border p-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {getFilteredPayments(subAdminPayments, "subadmin").map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="border p-3">
                    {`${payment.subAdmin?.firstName || ""} ${payment.subAdmin?.lastName || ""}`.trim()}
                  </td>
                  <td className="border p-3">{payment.subAdmin?.email}</td>
                  <td className="border p-3">{payment.transactionId}</td>
                  <td className="border p-3 font-semibold">₹{payment.amount.toLocaleString()}</td>
                  <td className="border p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        payment.paymentStatus === "SUCCESS"
                          ? "bg-green-100 text-green-800"
                          : payment.paymentStatus === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {payment.paymentStatus}
                    </span>
                  </td>
                  <td className="border p-3">{payment.forwhat || "-"}</td>
                  <td className="border p-3">{new Date(payment.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {paymentType === "patient" && (
        <div className="overflow-x-auto">
          <h3 className="text-xl font-semibold mb-4">Patient Payments</h3>
          <table className="w-full border border-gray-200 text-sm">
            <thead className="bg-purple-50">
              <tr>
                <th className="border p-3 text-left">Patient</th>
                <th className="border p-3 text-left">Email</th>
                <th className="border p-3 text-left">Mobile</th>
                <th className="border p-3 text-left">Transaction ID</th>
                <th className="border p-3 text-left">Amount</th>
                <th className="border p-3 text-left">Status</th>
                <th className="border p-3 text-left">Purpose</th>
                <th className="border p-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {getFilteredPayments(patientPayments, "patient").map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="border p-3">
                    {`${payment.patient?.firstName || ""} ${payment.patient?.lastName || ""}`.trim()}
                  </td>
                  <td className="border p-3">{payment.patient?.email}</td>
                  <td className="border p-3">{payment.patient?.mobile}</td>
                  <td className="border p-3">{payment.transactionId}</td>
                  <td className="border p-3 font-semibold">₹{payment.amount.toLocaleString()}</td>
                  <td className="border p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        payment.paymentStatus === "SUCCESS"
                          ? "bg-green-100 text-green-800"
                          : payment.paymentStatus === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {payment.paymentStatus}
                    </span>
                  </td>
                  <td className="border p-3">{payment.forwhat || "-"}</td>
                  <td className="border p-3">{new Date(payment.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default EsevaPaymentsList
