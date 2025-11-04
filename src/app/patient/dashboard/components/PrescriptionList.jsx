// src/app/patient/dashboard/components/PrescriptionList.jsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Eye, Filter, Download, Loader } from "lucide-react"
import ReactDatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import * as XLSX from "xlsx"

export default function PrescriptionList({ prescriptions }) {
  const router = useRouter();
  const [doctorFilter, setDoctorFilter] = useState("");
  const [dateFilter, setDateFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [loadingId, setLoadingId] = useState(null);

  const filteredPrescriptions = prescriptions.filter((prescription) => {
    const matchesDoctor = `${prescription.doctor?.firstName || ""} ${prescription.doctor?.lastName || ""}`
      .toLowerCase()
      .includes(doctorFilter.toLowerCase());
    const matchesDate = dateFilter
      ? new Date(prescription.prescriptionDate).toDateString() === dateFilter.toDateString()
      : true;
    const matchesStatus = statusFilter ? prescription.status === statusFilter : true;

    return matchesDoctor && matchesDate && matchesStatus;
  });

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredPrescriptions);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Prescriptions");
    XLSX.writeFile(wb, "prescriptions.xlsx");
  };

  const handleViewPrescription = async (prescription) => {
    setLoadingId(prescription.id);
    await router.push(`/patient/dashboard/prescription/${prescription.id}/view`);
  };

  return (
    <div className="container mx-auto font-poppins p-4 lg:p-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="text-center mb-1">
            <h2 className="text-2xl font-bold text-blue-600 flex items-center justify-center gap-2">
              My Prescriptions
            </h2>
            <p className="text-blue-600 mt-0.5">View and manage your prescriptions</p>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium mb-1">Search Doctors</label>
                <input
                  type="text"
                  placeholder="Search by doctor name"
                  value={doctorFilter}
                  onChange={(e) => setDoctorFilter(e.target.value)}
                  className="w-full p-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Prescription Date</label>
                <ReactDatePicker
                  selected={dateFilter}
                  onChange={(date) => setDateFilter(date)}
                  placeholderText="Filter by date"
                  className="w-full p-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full p-2 border rounded-xl"
                >
                  <option value="">All Statuses</option>
                  <option value="ACTIVE">Active</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Prescription Cards */}
        <div className="p-6">
          {filteredPrescriptions.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 auto-rows-fr">
              {filteredPrescriptions.map((prescription) => (
                <div key={prescription.id} className="group relative">
                  <div className="h-full flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                    <div className="p-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-2">
                          <div className="flex items-center justify-center bg-blue-100 rounded-xl w-8 h-8 p-1.5">
                            <FileText className="w-3.5 h-3.5 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 text-xs truncate group-hover:text-blue-600 transition-colors">
                              Dr. {prescription.doctor?.firstName} {prescription.doctor?.lastName}
                            </h3>
                            <span className="text-blue-700">
                              {prescription.template?.name || "Custom"}
                            </span>
                          </div>
                        </div>

                        <Badge
                          className={
                            prescription.status === "ACTIVE"
                              ? "bg-green-100 text-green-800"
                              : prescription.status === "COMPLETED"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }
                        >
                          {prescription.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-3 flex-1 flex flex-col">
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                          <strong>Date:</strong> {formatDate(prescription.prescriptionDate)}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Medications:</strong> {prescription.medications?.length || 0} items
                        </p>
                        {prescription.diagnosis && (
                          <p className="text-sm text-gray-600">
                            <strong>Diagnosis:</strong> {prescription.diagnosis.substring(0, 50)}...
                          </p>
                        )}
                      </div>

                      <div className="mt-auto p-1">
                      <Button
  variant="outline"
  size="sm"
  onClick={() => handleViewPrescription(prescription)}
  className="w-full flex items-center justify-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[11px] font-medium transition-colors"
  disabled={loadingId === prescription.id} 
>
  {loadingId === prescription.id ? (
    <>
      <Loader className="h-4 w-4 animate-spin" />
      Loading...
    </>
  ) : (
    <>
      <Eye className="h-4 w-4 mr-1" />
      View
    </>
  )}
</Button>

                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No prescriptions found</h3>
              <p className="text-gray-500">Try adjusting your filters or create a new prescription</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}