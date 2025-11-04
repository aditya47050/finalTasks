"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { loadRazorpayScript } from "@/lib/utils/loadrazorpay";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

const ViewSubAdminsClient = ({ subAdmins, esevaId }) => {
  const [tableData, setTableData] = useState(subAdmins);
  const pageSize = 10;
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
  });
  const [debouncedFilters, setDebouncedFilters] = useState(filters);
  const [showFilters, setShowFilters] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [loadingStatusId, setLoadingStatusId] = useState(null);

  // Sort subAdmins by createdAt or another relevant field
  const sortedSubAdmins = useMemo(() => {
    return [...tableData]
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }, [tableData]);

  // Debounce filter updates
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 300);
    return () => clearTimeout(handler);
  }, [filters]);

  const filteredData = useMemo(() => {
    return sortedSubAdmins.filter((subAdmin) => {
      const name = subAdmin.name?.toLowerCase() || "";
      const email = subAdmin.email?.toLowerCase() || "";
      const mobile = subAdmin.mobile || "";
      const address = subAdmin.address?.toLowerCase() || "";

      return (
        (!debouncedFilters.name || name.includes(debouncedFilters.name.toLowerCase())) &&
        (!debouncedFilters.email || email.includes(debouncedFilters.email.toLowerCase())) &&
        (!debouncedFilters.mobile || mobile.includes(debouncedFilters.mobile)) &&
        (!debouncedFilters.address || address.includes(debouncedFilters.address.toLowerCase()))
      );
    });
  }, [debouncedFilters, sortedSubAdmins]);

  // Payment handler
  const handlePayment = async (subAdminId) => {
    const subAdmin = tableData.find((s) => s.id === subAdminId);
    if (!subAdmin) return toast.error("Invalid SubAdmin");

    setIsPaying(true);

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      toast.error("Razorpay SDK failed to load. Are you online?");
      setIsPaying(false);
      return;
    }

    try {
      // Create order on backend
      const res = await fetch("/api/e-seva/subadmin/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subAdminId: subAdmin.id, esevaId, amount: 36500 }),
      });
      const { order } = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Eseva Service",
        description: "Eseva Sub-Admin Registration",
        order_id: order.id,
        handler: async function (response) {
          const verifyRes = await fetch("/api/e-seva/subadmin/payment-verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              subAdminId: subAdmin.id,
              amount: order.amount,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            toast.success("Payment Successful!");

            // Update local table data to show Paid and change status to Active
            setTableData((prev) =>
              prev.map((s) =>
                s.id === subAdmin.id
                  ? { ...s, payments: [...(s.payments || []), { status: "SUCCESS" }], status: "ACTIVE" }
                  : s
              )
            );
          } else {
            toast.error("Payment verification failed.");
          }
        },
        prefill: {
          name: subAdmin.name,
          email: subAdmin.email,
          contact: subAdmin.mobile,
        },
        theme: { color: "#243460" },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error("Payment failed:", err);
      toast.error("Payment process failed.");
    } finally {
      setIsPaying(false);
    }
  };

  // Status change handler
  const handleStatusChange = async (subAdminId, newStatus) => {
    setLoadingStatusId(subAdminId); // Set loading state
    try {
      const res = await fetch(`/api/e-seva/subadmin/${subAdminId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error("Failed to update status");
      }

      // Update local table data to reflect status change
      setTableData((prev) =>
        prev.map((s) =>
          s.id === subAdminId ? { ...s, status: newStatus } : s
        )
      );

      toast.success(`SubAdmin status updated to ${newStatus}`);
    } catch (err) {
      console.error("Status update failed:", err);
      toast.error("Status update failed.");
    } finally {
      setLoadingStatusId(null); // Reset loading state
    }
  };

  const columns = useMemo(
    () => [
      { accessorKey: "name", header: "Name" },
      { accessorKey: "email", header: "Email" },
      { accessorKey: "mobile", header: "Mobile" },
      { accessorKey: "address", header: "Address" },
      {
        id: "paymentStatus",
        header: "Payment Status",
        cell: ({ row }) => {
          const subAdmin = row.original;
          const index = row.index; // Ensure index is correctly accessed
          const hasPaid = subAdmin?.payments?.some((p) => p.paymentStatus === "SUCCESS");
          const isBeyondFreeLimit = index >= 4; // Only first 4 are free
          const isPendingPayment = subAdmin?.status === "INACTIVE" || subAdmin?.status === "PENDING";
  
          console.log(`SubAdmin: ${subAdmin.name}, Index: ${index}, Status: ${subAdmin.status}, HasPaid: ${hasPaid}`);
  
          return hasPaid ? (
            <span className="text-green-600 font-semibold">Paid</span>
          ) : isBeyondFreeLimit && isPendingPayment ? (
            <button
              className={`bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 ${
                isPaying ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={() => handlePayment(subAdmin.id)}
              disabled={isPaying}
            >
              {isPaying ? "Processing..." : "Proceed to Payment"}
            </button>
          ) : (
            <span className="text-green-600 font-semibold">Free</span> // Display "Free" for first 4
          );
        },
      },
      {
        id: "status",
        header: "Status",
        cell: ({ row }) => {
          const subAdmin = row.original;
          const isLoading = loadingStatusId === subAdmin.id;
          return isLoading ? (
            <Loader2 className="animate-spin h-5 w-5 text-blue-500" />
          ) : (
            <select
              value={subAdmin.status}
              onChange={(e) => handleStatusChange(subAdmin.id, e.target.value)}
              className="border rounded px-2 py-1"
              disabled={isLoading} // Disable dropdown while loading
            >
              <option value="ACTIVE">Active</option>
              <option value="SUSPENDED">Suspended</option>
              <option value="DEACTIVATED">Deactivated</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          );
        },
      },
    ],
    [isPaying, loadingStatusId]
  );

  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize });

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const toggleFilters = () => setShowFilters((prev) => !prev);

  return (
    <div className="container shadow-xl mx-auto font-poppins h-screen p-4">
      <div className="text-center py-4">
        <h1 className="text-2xl font-bold text-blue-500">SubAdmins List</h1>
      </div>

      <div className="flex justify-end gap-2 mb-4">
        <button
          onClick={toggleFilters}
          className="bg-blue-500 rounded-xl text-white px-4 py-2 hover:bg-blue-600 transition"
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {/* Filter Section */}
      {showFilters && (
        <div className="bg-white rounded-xl px-6 pb-6 mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {["name", "email", "mobile", "address"].map((field) => (
              <div key={field} className="flex flex-col">
                <label className="text-sm font-medium mb-1">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <input
                  type="text"
                  value={filters[field]}
                  onChange={(e) => handleFilterChange(field, e.target.value)}
                  placeholder={`Search by ${field}`}
                  className="border rounded-xl px-3 py-2 focus:outline-none focus:ring"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Table Section */}
      <div className="overflow-x-auto bg-white p-4 rounded-[15px] shadow-lg">
        <Table className="table-fixed w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="border px-4 py-2 text-left font-semibold"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row, idx) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="border px-4 py-2 text-left">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No SubAdmins found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between py-4">
          <Button size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Previous
          </Button>
          <span>
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <Button size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ViewSubAdminsClient;