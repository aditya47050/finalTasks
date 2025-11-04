"use client"
import { useState, useMemo } from "react"
import {
  Calendar,
  Building,
  CheckCircle,
  XCircle,
  HeadingIcon as PendingIcon,
  Download,
  Filter,
  X,
  Package,
  CreditCard,
  Truck,
  ChevronDown,
  ChevronUp,
  MapPin,
  Phone,
  Mail,
  Pill,
  ShoppingCart,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import * as XLSX from "xlsx"
import { SelectField } from '@/app/components/input-selectui';
import { DateFilter } from '@/app/components/input-selectui';
import DatePicker from "react-datepicker"
import { Label } from '@/components/ui/label';
const statusIcons = {
  PENDING: <PendingIcon className="w-4 h-4 text-yellow-500" />,
  CONFIRMED: <CheckCircle className="w-4 h-4 text-green-500" />,
  CANCELLED: <XCircle className="w-4 h-4 text-red-500" />,
  COMPLETED: <CheckCircle className="w-4 h-4 text-blue-500" />,
}

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  CONFIRMED: "bg-green-100 text-green-800 border-green-200",
  CANCELLED: "bg-red-100 text-red-800 border-red-200",
  COMPLETED: "bg-blue-100 text-blue-800 border-blue-200",
}
const paymentMethodColors = {
  ONLINE: "bg-blue-100 text-blue-800",
  COD: "bg-orange-100 text-orange-800",
  CARD: "bg-purple-100 text-purple-800",
}

export default function PharmacyViewOrder({ order}) {
  const [pageIndex, setPageIndex] = useState(0)
  const pageSize = 5
  const [showFilters, setShowFilters] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [filters, setFilters] = useState({
  status: "",
  paymentMethod: "",
  date: null, // or { start: null, end: null } if range
});


  const pharmacyOrders = order?.PharmacyOrder || []
  // util formatter
const formatDateOnly = (date) => {
  if (!date) return "Flexible";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }); // Example: Sep 30, 2025
};

const formatTime = (timeString) => {
  if (!timeString) return "Anytime";
  return timeString; // your slot is already like "01:00 PM"
};


  const handleFilterChange = (field, value) => {
  setFilters((prev) => ({
    ...prev,
    [field]: value,
  }))
  setPageIndex(0)
}



    const formatDate = (date) => {
    if (!date) return "Not specified"
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount)
  }
   const getExpectedDelivery = (orderDate) => {
    const randomDays = Math.floor(Math.random() * 11) + 5 // 5-15 days
    const deliveryDate = new Date(orderDate)
    deliveryDate.setDate(deliveryDate.getDate() + randomDays)
    return deliveryDate
  }

  const normalizeDate = (date) => {
    if (!date) return null
    const d = new Date(date)
    if (isNaN(d.getTime())) return null
    return new Date(d.getFullYear(), d.getMonth(), d.getDate())
  }

const filteredOrders = useMemo(() => {
  return pharmacyOrders.filter((order) => {
    // ✅ Status filter
    if (filters.status && order.status !== filters.status) return false;

    // ✅ Payment Method filter
    if (filters.paymentMethod && order.paymentMethod !== filters.paymentMethod) return false;

    // ✅ Date filter (assuming filters.dateRange = { start: Date, end: Date })
    if (filters.date) {
  const orderDate = new Date(order.createdAt);
  if (orderDate.toDateString() !== filters.date.toDateString()) {
    return false;
  }
}



    return true;
  });
}, [filters, pharmacyOrders]);



  const paginatedOrders = filteredOrders.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)
  const pageCount = Math.ceil(filteredOrders.length / pageSize)

  const exportToExcel = () => {
    const exportData = filteredOrders.map((order) => ({
      "Order ID": order.id,
      Status: order.status,
      "Total Amount": order.totalAmount,
      "Payment Method": order.paymentMethod,
      "Order Date": formatDate(order.createdAt),
      Pharmacy: order.pharmacy?.regname || "N/A",
      "Items Count": order.items?.length || 0,
    }))
    const ws = XLSX.utils.json_to_sheet(exportData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Pharmacy Orders")
    XLSX.writeFile(wb, "pharmacy_orders.xlsx")
  }

  return (
    <div className="container mx-auto font-poppins p-4 lg:p-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="text-center mb-1">
            <h2 className="text-2xl font-bold text-blue-600 flex items-center justify-center gap-2">
              <Pill className="w-8 h-8" />
                Pharmacy Orders
            </h2>
            <p className="text-blue-600 mt-0.5">View and manage your pharmacy orders</p>
            <div className="flex justify-center gap-4 mt-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              <span>{filteredOrders.length} Total Orders</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              <span>
                {formatCurrency(filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0))} Total Value
              </span>
            </div>
          </div>
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
  {/* Status Filter */}
  <div>
    <label className="block text-sm font-medium text-gray-600">Status</label>
    <select
      id="status"
      value={filters.status}
      onChange={(e) => handleFilterChange("status", e.target.value)}
      className="border border-gray-300 p-2 text-sm rounded-xl w-full text-gray-700 bg-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
    >
      <option value="">All Statuses</option>
      <option value="PENDING">Pending</option>
      <option value="CONFIRMED">Confirmed</option>
      <option value="CANCELLED">Cancelled</option>
      <option value="COMPLETED">Completed</option>
    </select>
  </div>

  {/* Payment Method Filter */}
  <div>
    <label className="block text-sm font-medium text-gray-600">Payment Method</label>
    <select
      id="paymentMethod"
      value={filters.paymentMethod}
      onChange={(e) => handleFilterChange("paymentMethod", e.target.value)}
      className="border border-gray-300 p-2 text-sm rounded-xl w-full text-gray-700 bg-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
    >
      <option value="">All Methods</option>
      <option value="ONLINE">Online</option>
      <option value="COD">Cash on Delivery</option>
      <option value="CARD">Card</option>
    </select>
  </div>

  {/* Date Filter */}
  <div>
    <label className="block text-sm font-medium text-gray-600">Select Date</label>
    <DatePicker
      selected={filters.date}
      onChange={(date) => handleFilterChange("date", date)}
      placeholderText="Select date"
      dateFormat="dd/MM/yyyy"
      className="border border-gray-300 p-2 text-sm rounded-xl w-full text-gray-700 bg-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
    />
  </div>
</div>

          )}
          <div className="space-y-4">
        {paginatedOrders.length === 0 ? (
          <Card className="border-0 shadow-md">
            <CardContent className="text-center py-12">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Orders Found</h3>
              <p className="text-gray-500">No pharmacy orders match your current filters.</p>
            </CardContent>
          </Card>
        ) : (
          paginatedOrders.map((orderItem, index) => (
            <Card
              key={orderItem.id}
              className="border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.01] cursor-pointer"
              onClick={() => setSelectedOrder(selectedOrder?.id === orderItem.id ? null : orderItem)}
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Package className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold text-lg">Order #{orderItem.id.slice(-8)}</span>
                      </div>
                      <Badge className={`${statusColors[orderItem.status]} border`}>
                        {statusIcons[orderItem.status]}
                        <span className="ml-1">{orderItem.status}</span>
                      </Badge>
                      <Badge className={`${paymentMethodColors[orderItem.paymentMethod]} border-0`}>
                        <CreditCard className="w-3 h-3 mr-1" />
                        {orderItem.paymentMethod}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">Ordered:</span>
                        <span className="font-medium">{formatDate(orderItem.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">Expected:</span>
                        <span className="font-medium text-green-600">
                          {formatDate(getExpectedDelivery(orderItem.createdAt)).split(",")[0]}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">Pharmacy:</span>
                        <span className="font-medium">{orderItem.pharmacy?.regname || "N/A"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">{formatCurrency(orderItem.totalAmount)}</div>
                      <div className="text-sm text-gray-500">{orderItem.items?.length || 0} items</div>
                    </div>
                    <div className="text-blue-600">
                      {selectedOrder?.id === orderItem.id ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </div>
                  </div>
                </div>

                <div
                  className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    selectedOrder?.id === orderItem.id ? "max-h-[1000px] opacity-100 mt-6" : "max-h-0 opacity-0"
                  }`}
                >
                  <Separator className="mb-6" />

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Order Items */}
                    <div>
                      <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <Pill className="w-5 h-5 text-blue-600" />
                        Order Items
                      </h4>
                      <div className="space-y-3">
                        {orderItem.items?.map((item, itemIndex) => (
                          <div key={item.id} className="bg-gray-50 rounded-lg p-4">
                            <div className="flex justify-between items-start gap-4">
                              <div className="flex-1">
                                <h5 className="font-medium text-gray-900">{item.productName}</h5>
                                <p className="text-sm text-gray-600 mt-1">
                                  {item.product?.brand} • {item.unitLabel}
                                </p>
                                <div className="flex items-center gap-4 mt-2 text-sm">
                                  <span className="text-gray-600">Qty: {item.quantity}</span>
                                  <span className="text-gray-600">Unit: {formatCurrency(item.unitPrice)}</span>
                                  {item.discountPercent > 0 && (
                                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                                      {item.discountPercent}% OFF
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold text-lg">{formatCurrency(item.lineTotal)}</div>
                                {item.discountPercent > 0 && (
                                  <div className="text-sm text-gray-500 line-through">
                                    {formatCurrency(item.unitPrice * item.quantity)}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pharmacy & Delivery Info */}
                    <div>
                      <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <Building className="w-5 h-5 text-blue-600" />
                        Pharmacy Details
                      </h4>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4 text-gray-500" />
                          <span className="font-medium">{orderItem.pharmacy?.regname || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <span>{orderItem.pharmacy?.mobile || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <span>{orderItem.pharmacy?.email || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span>{orderItem.pharmacy?.pincode || "N/A"}</span>
                        </div>
                      </div>

                      <div className="mt-4">
                        <h5 className="font-medium mb-2 flex items-center gap-2">
                          <Truck className="w-4 h-4 text-green-600" />
                          Delivery Information
                        </h5>
                        <div className="bg-green-50 rounded-lg p-4 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Expected Delivery:</span>
                            <span className="font-medium text-green-700">
                              {formatDate(getExpectedDelivery(orderItem.createdAt)).split(",")[0]}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Delivery Days:</span>
                            <span className="font-medium">{Math.floor(Math.random() * 11) + 5} days</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="mt-6 bg-blue-50 rounded-lg p-4">
                    <h5 className="font-semibold mb-3">Order Summary</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>{formatCurrency(orderItem.totalAmount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery:</span>
                        <span className="text-green-600">Free</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total:</span>
                        <span className="text-green-600">{formatCurrency(orderItem.totalAmount)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      {pageCount > 1 && (
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <Button
                onClick={() => setPageIndex(Math.max(0, pageIndex - 1))}
                disabled={pageIndex === 0}
                variant="outline"
                className="transition-all duration-200 hover:scale-105 rounded-xl"
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {pageIndex + 1} of {pageCount}
              </span>
              <Button
                onClick={() => setPageIndex(Math.min(pageCount - 1, pageIndex + 1))}
                disabled={pageIndex === pageCount - 1}
                variant="outline"
                className="transition-all duration-200 hover:scale-105 rounded-xl"
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
        </div>
      </div>
    </div>
  )
}