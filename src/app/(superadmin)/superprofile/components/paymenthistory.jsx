"use client";
import React, { useState, useMemo } from "react";
import * as XLSX from "xlsx";
import {
  Download,
  Filter,
  CreditCard,
  BadgeCheck,
  BadgeX,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DateFilter,
  InputField,
  SelectField,
} from "@/app/components/input-selectui";
import { Input } from "@/components/ui/input";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import HeadingClientMain from "@/app/components/heading";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function PatientPayment({ userdata }) {
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 10;
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    transactionId: "",
    patientName: "",
    mobile: "",
    email: "",
    gender: "",
    city: "",
    state: "",
    district: "",
    taluka: "",
    bloodgroup: "",
    aadharCardNumber: "",
    abhaCardNumber: "",
    healthCardNo: "",
    amount: "",
    createdAt: null,
    updatedAt: null,
  });

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPageIndex(0);
  };

  const normalizeDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    if (isNaN(d.getTime())) return null;
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  };

  const formatDateForDisplay = (date) => {
    if (!date) return "N/A";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "N/A";
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const filteredData = useMemo(() => {
    return userdata.filter((row) => {
      return Object.entries(filters).every(([key, filterValue]) => {
        if (!filterValue) return true;

        if (key === "createdAt" || key === "updatedAt") {
          const rowDate = normalizeDate(row[key]);
          const filterDate = normalizeDate(filterValue);

          if (!rowDate || !filterDate) return false;

          return (
            rowDate.getFullYear() === filterDate.getFullYear() &&
            rowDate.getMonth() === filterDate.getMonth() &&
            rowDate.getDate() === filterDate.getDate()
          );
        }

        if (key === "status") {
          const rowValue = String(row[key] || "")
            .toLowerCase()
            .trim();
          const filterValueStr = String(filterValue || "")
            .toLowerCase()
            .trim();
          return rowValue === filterValueStr;
        }

        if (
          key === "transactionId" ||
          key === "aadharCardNumber" ||
          key === "abhaCardNumber" ||
          key === "healthCardNo"
        ) {
          const rowValue = String(
            row[key] ||
              (key === "healthCardNo" ? row.patient?.healthCardNo || "" : "")
          )
            .toLowerCase()
            .trim();
          const filterValueStr = String(filterValue || "")
            .toLowerCase()
            .trim();
          return rowValue.includes(filterValueStr);
        }

        if (key === "patientName") {
          const fullName = `${row.patient?.firstName || ""} ${
            row.patient?.middleName || ""
          } ${row.patient?.lastName || ""}`
            .toLowerCase()
            .trim();
          const filterValueStr = String(filterValue || "")
            .toLowerCase()
            .trim();
          return fullName.includes(filterValueStr);
        }

        if (key === "amount") {
          const rowValue = String(row.amount || "")
            .toLowerCase()
            .trim();
          const filterValueStr = String(filterValue || "")
            .toLowerCase()
            .trim();
          return rowValue.includes(filterValueStr);
        }

        if (
          [
            "mobile",
            "email",
            "gender",
            "city",
            "state",
            "district",
            "taluka",
            "bloodgroup",
          ].includes(key)
        ) {
          const rowValue = String(row.patient?.[key] || "")
            .toLowerCase()
            .trim();
          const filterValueStr = String(filterValue || "")
            .toLowerCase()
            .trim();
          return rowValue.includes(filterValueStr);
        }

        return true;
      });
    });
  }, [filters, userdata]);

  const paginatedData = filteredData.slice(
    pageIndex * pageSize,
    pageIndex * pageSize + pageSize
  );
  const pageCount = Math.ceil(filteredData.length / pageSize);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Payment Data");
    XLSX.writeFile(wb, "patient_payments.xlsx");
  };

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case "success":
        return (
          <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            <BadgeCheck className="w-3 h-3" />
            Success
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            <BadgeX className="w-3 h-3" />
            Failed
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            <Loader2 className="w-3 h-3 animate-spin" />
            Pending
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {status}
          </span>
        );
    }
  };

  const getPatientName = (patient) => {
    return `${patient?.firstName || ""} ${patient?.middleName || ""} ${
      patient?.lastName || ""
    }`.trim();
  };

  const openReceiptModal = (payment) => {
    setSelectedPayment(payment);
    setIsReceiptOpen(true);
  };

  const tableColumns = [
    {
      header: "Transaction",
      render: (row) => (
        <>
          <div className="text-sm">{row.transactionId}</div>
          <div className="text-xs text-gray-500">
            {formatDateForDisplay(row.createdAt)}
          </div>
        </>
      ),
    },
    {
      header: "Patient",
      render: (row) => (
        <>
          <div className="font-medium">{getPatientName(row.patient)}</div>
          <div className="text-xs text-gray-500">
            {row.patient?.gender} • {row.patient?.bloodgroup}
          </div>
        </>
      ),
    },
    {
      header: "Contact",
      render: (row) => (
        <>
          <div className="text-sm">{row.patient?.mobile}</div>
          <div className="text-xs text-gray-500">{row.patient?.email}</div>
        </>
      ),
    },
    {
      header: "Health Card",
      render: (row) => (
        <div className="text-sm">{row.patient?.healthCardNo || "N/A"}</div>
      ),
    },
    {
      header: "Amount",
      render: (row) => formatCurrency(row.amount),
    },
    {
      header: "Status",
      render: (row) => getStatusBadge(row.status),
    },
    {
      header: "Date",
      render: (row) => (
        <>
          <div className="text-sm">{formatDateForDisplay(row.createdAt)}</div>
          <div className="text-xs text-gray-500">
            Updated: {formatDateForDisplay(row.updatedAt)}
          </div>
        </>
      ),
    },
    {
      header: "Action",
      render: (row) => (
        <Button
          variant="outline"
          size="sm"
          className="rounded-xl"
          onClick={() => openReceiptModal(row)}
        >
          View Receipt
        </Button>
      ),
      align: "right",
    },
  ];

  return (
    <div className="md:container mx-auto font-poppins">
      <div className="overflow-x-auto xs:px-2 min-[1000px]:px-0 min-[1100px]:px-[32px] container mx-auto min-[1000px]:w-[700px] min-[1100px]:w-[900px] xl:w-[1000px] xlg:w-[1200px] w-[350px] md:w-[700px] bg-white">
        <HeadingClientMain main="Patients Payment History" sub="Full Details" />
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
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {/* Status */}
            <SelectField
              label="Status"
              id="status"
              value={filters.status}
              onChange={handleFilterChange}
              options={[
                { value: "all", label: "All Statuses" },
                { value: "success", label: "Success" },
                { value: "failed", label: "Failed" },
                { value: "pending", label: "Pending" },
              ]}
            />

            {/* Transaction ID */}
            <InputField
              label="Transaction ID"
              id="transactionId"
              placeholder="Search transaction ID"
              value={filters.transactionId}
              onChange={handleFilterChange}
            />

            {/* Patient Name */}
            <InputField
              label="Patient Name"
              id="patientName"
              placeholder="Search patient name"
              value={filters.patientName}
              onChange={handleFilterChange}
            />

            {/* Mobile */}
            <InputField
              label="Mobile"
              id="mobile"
              placeholder="Search mobile"
              value={filters.mobile}
              onChange={handleFilterChange}
            />

            {/* Email */}
            <InputField
              label="Email"
              id="email"
              placeholder="Search email"
              value={filters.email}
              onChange={handleFilterChange}
            />

            {/* Health Card No */}
            <InputField
              label="Health Card No"
              id="healthCardNo"
              placeholder="Search health card number"
              value={filters.healthCardNo}
              onChange={handleFilterChange}
            />

            {/* Gender */}
            <SelectField
              label="Gender"
              id="gender"
              value={filters.gender}
              onChange={handleFilterChange}
              options={[
                { value: "all", label: "All Genders" },
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
                { value: "other", label: "Other" },
              ]}
            />

            {/* Blood Group */}
            <SelectField
              label="Blood Group"
              id="bloodgroup"
              value={filters.bloodgroup}
              onChange={handleFilterChange}
              options={[
                { value: "all", label: "All Blood Groups" },
                { value: "A+", label: "A+" },
                { value: "A-", label: "A-" },
                { value: "B+", label: "B+" },
                { value: "B-", label: "B-" },
                { value: "AB+", label: "AB+" },
                { value: "AB-", label: "AB-" },
                { value: "O+", label: "O+" },
                { value: "O-", label: "O-" },
              ]}
            />

            {/* Amount */}
            <InputField
              label="Amount"
              id="amount"
              placeholder="Search amount"
              value={filters.amount}
              onChange={handleFilterChange}
            />

            {/* City */}
            <InputField
              label="City"
              id="city"
              placeholder="Search city"
              value={filters.city}
              onChange={handleFilterChange}
            />

            {/* State */}
            <InputField
              label="State"
              id="state"
              placeholder="Search state"
              value={filters.state}
              onChange={handleFilterChange}
            />

            {/* District */}
            <InputField
              label="District"
              id="district"
              placeholder="Search district"
              value={filters.district}
              onChange={handleFilterChange}
            />

            {/* Taluka */}
            <InputField
              label="Taluka"
              id="taluka"
              placeholder="Search taluka"
              value={filters.taluka}
              onChange={handleFilterChange}
            />

            {/* Aadhar Number */}
            <InputField
              label="Aadhar Number"
              id="aadharCardNumber"
              placeholder="Search Aadhar"
              value={filters.aadharCardNumber}
              onChange={handleFilterChange}
            />

            {/* ABHA Number */}
            <InputField
              label="ABHA Number"
              id="abhaCardNumber"
              placeholder="Search ABHA"
              value={filters.abhaCardNumber}
              onChange={handleFilterChange}
            />

            {/* Created Date */}
            <DateFilter
              label="Created Date"
              id="createdAt"
              selected={filters.createdAt}
              onChange={handleFilterChange}
            />

            {/* Updated Date */}
            <DateFilter
              label="Updated Date"
              id="updatedAt"
              selected={filters.updatedAt}
              onChange={handleFilterChange}
            />
          </div>
        )}
        <div className="overflow-x-auto bg-white p-4 rounded-xl shadow-lg">
          <div>
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100 hover:bg-gray-100">
                  {tableColumns.map((column, index) => (
                    <TableHead
                      key={index}
                      className="border border-gray-200 py-4 px-6 text-left font-semibold text-gray-900 whitespace-nowrap"
                    >
                      {column.header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length ? (
                  paginatedData.map((row, index) => (
                    <TableRow
                      key={row.id}
                      className={`
                                            transition-colors duration-150 ease-in-out
                                            hover:bg-gray-50/50 
                                            ${
                                              index % 2 === 0
                                                ? "bg-white"
                                                : "bg-gray-50/20"
                                            }
                                            border-[1px] border-gray-100
                                        `}
                    >
                      {tableColumns.map((column, colIndex) => (
                        <TableCell
                          key={colIndex}
                          className="border-[1px] border-gray-200 py-4 px-6 text-sm whitespace-nowrap max-w-max hover:bg-gray-100"
                        >
                          {column.render(row)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow className="border-b border-black/20">
                    <TableCell
                      colSpan={tableColumns.length}
                      className="text-center py-8 border-b border-black/20"
                    >
                      <div className="text-gray-500">No payments found</div>
                      <div className="text-sm text-gray-400 mt-1">
                        Try adjusting your filters
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <div className="flex items-center justify-between py-4">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl"
                onClick={() => setPageIndex(Math.max(pageIndex - 1, 0))}
                disabled={pageIndex === 0}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              <span>
                Showing {paginatedData.length} of {filteredData.length} payments
              </span>

              <Button
                variant="outline"
                size="sm"
                className="rounded-xl"
                onClick={() =>
                  setPageIndex(Math.min(pageIndex + 1, pageCount - 1))
                }
                disabled={pageIndex >= pageCount - 1}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
        {/* Receipt Dialog */}
        <Dialog open={isReceiptOpen} onOpenChange={setIsReceiptOpen}>
          <DialogContent className="sm:max-w-[600px] bg-white rounded-2xl shadow-xl">
            <DialogHeader className="border-b pb-3">
              <DialogTitle className="text-xl font-bold text-center text-blue-700">
                🧾 Payment Receipt
              </DialogTitle>
            </DialogHeader>

            {selectedPayment && (
              <div className="space-y-6 p-2 sm:p-4">
                {/* ✅ Transaction Info */}
                <div className="grid grid-cols-2 gap-4 text-sm sm:text-base">
                  <div className="bg-gray-50 p-3 rounded-xl shadow-sm">
                    <p className="text-xs text-gray-500">Transaction ID</p>
                    <p className="font-semibold break-words">
                      {selectedPayment.transactionId}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl shadow-sm">
                    <p className="text-xs text-gray-500">Date</p>
                    <p className="font-semibold">
                      {formatDateForDisplay(selectedPayment.createdAt)}
                    </p>
                  </div>
                </div>

                {/* ✅ Patient Info */}
                <div className="bg-blue-50 p-4 rounded-xl shadow-md">
                  <h3 className="text-blue-600 font-semibold mb-2">
                    Patient Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm sm:text-base">
                    <div>
                      <p className="text-xs text-gray-500">Name</p>
                      <p className="font-medium">
                        {getPatientName(selectedPayment.patient)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Health Card No</p>
                      <p className="font-medium">
                        {selectedPayment.patient?.healthCardNo || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* ✅ Payment Info */}
                <div className="bg-green-50 p-4 rounded-xl shadow-md text-center">
                  <p className="text-xs text-gray-500">Amount Paid</p>
                  <p className="text-2xl font-bold text-green-700">
                    {formatCurrency(selectedPayment.amount)}
                  </p>
                  <div className="mt-2">
                    {getStatusBadge(selectedPayment.status)}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
