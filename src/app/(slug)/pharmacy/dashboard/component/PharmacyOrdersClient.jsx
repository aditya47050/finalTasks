"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UploadButton } from "@uploadthing/react";
import { Loader2, Eye, Download } from "lucide-react";
import * as XLSX from "xlsx";
import { InputField, SelectField } from "@/app/components/input-selectui";
import HeadingClientMain from "@/app/components/heading";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";

const PharmacyOrdersClient = ({ orders, pharmacyName, pharmacyId }) => {
  const [filters, setFilters] = useState({
    patientName: "",
    patientMobile: "",
    status: "",
    paymentMethod: "",
  });

  const [showFilters, setShowFilters] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [viewOrderDialog, setViewOrderDialog] = useState(false);
  const [uploadStates, setUploadStates] = useState({});

  const toggleFilters = () => setShowFilters((prev) => !prev);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const setUploading = (orderId, isLoading) => {
    setUploadStates(prev => ({
      ...prev,
      [orderId]: isLoading
    }));
  };

  const filteredData = useMemo(() => {
    if (!orders || !Array.isArray(orders)) {
      return [];
    }

    const filtered = orders.filter((order) => {
      if (!order) return false;

      try {
        const patientName = order.patientName?.toLowerCase() || "";
        const patientMobile = order.patientMobile || "";
        const status = order.status?.toLowerCase() || "";
        const paymentMethod = order.paymentMethod?.toLowerCase() || "";

        const nameMatch = !filters.patientName || 
          patientName.includes(filters.patientName.toLowerCase());
        
        const mobileMatch = !filters.patientMobile || 
          patientMobile.includes(filters.patientMobile);
        
        const statusMatch = !filters.status || 
          status === filters.status.toLowerCase();
        
        const paymentMethodMatch = !filters.paymentMethod || 
          paymentMethod === filters.paymentMethod.toLowerCase();

        return nameMatch && mobileMatch && statusMatch && paymentMethodMatch;
      } catch (error) {
        console.error("Error filtering order:", error, order);
        return false;
      }
    });

    return filtered;
  }, [filters, orders]);

  const handleFileUpload = async (orderId, res) => {
    if (!res || res.length === 0) return;

    const fileUrl = res[0].url;

    try {
      const response = await fetch(`/api/site/pharmacy/${pharmacyId}/order/upload`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          orderId: orderId, 
          receipt: fileUrl 
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to save uploaded file");
      }

      alert("Receipt uploaded successfully!");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert(`Error uploading file: ${err.message}`);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`/api/pharmacy/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      alert("Order status updated successfully!");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Error updating order status");
    }
  };

  const exportToExcel = () => {
    const dataToExport = filteredData.map(order => ({
      "Order ID": order.id,
      "Patient Name": order.patientName,
      "Patient Mobile": order.patientMobile,
      "Patient Email": order.patientEmail,
      "Patient City": order.patientCity,
      "Total Amount": order.totalAmount,
      "Status": order.status,
      "Payment Method": order.paymentMethod,
      "Items Count": order.items.length,
      "Order Date": new Date(order.createdAt).toLocaleDateString(),
      "Note": order.note || "N/A",
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Pharmacy Orders");
    XLSX.writeFile(wb, `pharmacy-orders-${pharmacyName}-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setViewOrderDialog(true);
  };

  return (
    <div className="container mx-auto font-poppins">
      <div className="text-center py-4">
        <HeadingClientMain main={`Pharmacy Orders - ${pharmacyName}`} />
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-600">
          Showing {filteredData.length} of {orders.length} orders
        </div>
        <div className="flex justify-end gap-2 items-end">
          <button
            onClick={toggleFilters}
            className="bg-blue-500 rounded-xl text-white px-4 py-2 hover:bg-blue-600 transition"
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
          <button
            onClick={exportToExcel}
            className="bg-green-500 rounded-xl text-white px-4 py-2 hover:bg-green-600 transition"
          >
            Export to Excel
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white rounded-xl px-6 pb-6 mb-4 border">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Filter Orders</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <InputField
              label="Patient Name"
              id="patientName"
              placeholder="Search by Patient Name"
              value={filters.patientName}
              onChange={handleFilterChange}
            />
            <InputField
              label="Patient Mobile"
              id="patientMobile"
              placeholder="Search by Mobile"
              value={filters.patientMobile}
              onChange={handleFilterChange}
            />
            
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="PROCESSING">Processing</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Payment Method</label>
              <select
                value={filters.paymentMethod}
                onChange={(e) => handleFilterChange("paymentMethod", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Methods</option>
                <option value="ONLINE">Online</option>
                <option value="OFFLINE">Offline</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto bg-white p-4 rounded-xl shadow-lg">
        {filteredData.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No orders found matching your filters.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="border">Order ID</TableHead>
                <TableHead className="border">Patient Name</TableHead>
                <TableHead className="border">Mobile</TableHead>
                <TableHead className="border">Total Amount</TableHead>
                <TableHead className="border">Status</TableHead>
                <TableHead className="border">Payment Method</TableHead>
                <TableHead className="border">Order Date</TableHead>
                <TableHead className="border">Actions</TableHead>
                <TableHead className="border">Receipt</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="border font-mono text-sm">
                    {order.id.slice(-8)}
                  </TableCell>
                  <TableCell className="border">{order.patientName}</TableCell>
                  <TableCell className="border">{order.patientMobile}</TableCell>
                  <TableCell className="border font-semibold">
                    ₹{order.totalAmount.toFixed(2)}
                  </TableCell>
                  <TableCell className="border">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className={`px-2 py-1 rounded-full text-xs border-0 focus:ring-2 focus:ring-blue-400 ${
                        order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        order.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'PROCESSING' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="CONFIRMED">Confirmed</option>
                      <option value="PROCESSING">Processing</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </TableCell>
                  <TableCell className="border">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      order.paymentMethod === 'ONLINE' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {order.paymentMethod}
                    </span>
                  </TableCell>
                  <TableCell className="border">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="border">
                    <div className="flex gap-2">
                      <Button
                        onClick={() => openOrderDetails(order)}
                        className="w-8 h-8 bg-blue-500 text-white rounded-xl flex items-center justify-center hover:bg-blue-600 transition"
                        title="View Order Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="border">
                    {order.receipt ? (
                      <a href={order.receipt} target="_blank" rel="noopener noreferrer" className="text-green-600 underline flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        View Receipt
                      </a>
                    ) : (
                      <UploadButton
                        endpoint="fileUploader"
                        onUploadBegin={() => setUploading(order.id, true)}
                        onClientUploadComplete={(res) => {
                          setUploading(order.id, false);
                          handleFileUpload(order.id, res);
                        }}
                        onUploadError={(err) => {
                          setUploading(order.id, false);
                          alert(`Upload error: ${err.message}`);
                        }}
                        appearance={{
                          button: `w-20 h-8 text-xs bg-green-500 text-white font-semibold rounded-xl flex items-center justify-center hover:bg-green-600 transition ${uploadStates[order.id] ? 'opacity-50 cursor-not-allowed' : ''}`,
                          container: "w-full flex flex-col gap-1 items-center",
                          allowedContent: "text-xs text-gray-500",
                        }}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Order Details Dialog - Same as before */}
      {viewOrderDialog && selectedOrder && (
        <Dialog open={viewOrderDialog} onOpenChange={setViewOrderDialog}>
          <DialogContent className="sm:max-w-2xl bg-white">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Order Details</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-700">Patient Information</h3>
                  <p><strong>Name:</strong> {selectedOrder.patientName}</p>
                  <p><strong>Mobile:</strong> {selectedOrder.patientMobile}</p>
                  <p><strong>Email:</strong> {selectedOrder.patientEmail}</p>
                  <p><strong>City:</strong> {selectedOrder.patientCity}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-700">Order Information</h3>
                  <p><strong>Order ID:</strong> {selectedOrder.id}</p>
                  <p><strong>Total Amount:</strong> ₹{selectedOrder.totalAmount.toFixed(2)}</p>
                  <p><strong>Status:</strong> {selectedOrder.status}</p>
                  <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</p>
                  <p><strong>Order Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
              </div>

              {selectedOrder.note && (
                <div>
                  <h3 className="font-semibold text-gray-700">Order Note</h3>
                  <p className="bg-gray-50 p-2 rounded">{selectedOrder.note}</p>
                </div>
              )}

              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Order Items</h3>
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product Name</TableHead>
                        <TableHead>Brand</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Unit Price</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.productName}</TableCell>
                          <TableCell>{item.brand || "N/A"}</TableCell>
                          <TableCell>{item.category || "N/A"}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>₹{item.unitPrice.toFixed(2)}</TableCell>
                          <TableCell>₹{item.lineTotal.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => setViewOrderDialog(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default PharmacyOrdersClient;