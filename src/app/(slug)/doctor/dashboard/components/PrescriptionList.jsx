"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Eye, Trash2, Filter, Download } from "lucide-react"
import ReactDatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import * as XLSX from "xlsx"

export default function PrescriptionList({ doctor, prescriptions }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const filteredPrescriptions = prescriptions.filter((prescription) => {
    const matchesSearch = `${prescription.patient?.firstName || ""} ${prescription.patient?.lastName || ""}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesDate = dateFilter
      ? new Date(prescription.prescriptionDate).toDateString() === dateFilter.toDateString()
      : true;
    const matchesStatus = statusFilter ? prescription.status === statusFilter : true;

    return matchesSearch && matchesDate && matchesStatus;
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

  const handleViewPrescription = (prescription) => {
    router.push(`/doctor/dashboard/prescriptions/${prescription.id}/view`);
  };

  const handleDeletePrescription = async (prescriptionId) => {
    if (!confirm("Are you sure you want to delete this prescription?")) return;

    try {
      const response = await fetch(`/api/doctor/${doctor.id}/prescription/${prescriptionId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        // Optionally, you can refresh page
        router.refresh();
      }
    } catch (error) {
      console.error("Error deleting prescription:", error);
    }
  };

  return (
    <div className="container mx-auto font-poppins p-4 lg:p-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-blue-600 flex items-center justify-center gap-2">
              <FileText className="h-6 w-6" />
              My Prescriptions
            </h2>
            <p className="text-blue-600 mt-1">View and manage patient prescriptions</p>
          </div>

          {/* Top Actions */}
          <div className="flex justify-end gap-2 items-end">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-blue-500 text-white rounded-xl hover:bg-blue-600"
            >
              <Filter className="h-4 w-4" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
            <Button
              onClick={exportToExcel}
              className="bg-green-500 text-white rounded-xl hover:bg-green-600"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg mt-4">
              <div>
                <label className="block text-sm font-medium mb-1">Search Patients</label>
                <Input
                  placeholder="Search by patient name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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

        {/* Card View */}
        <div className="p-6">
          {filteredPrescriptions.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrescriptions.map((prescription) => (
                <div
                  key={prescription.id}
                  className="group h-full overflow-hidden border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white"
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-lg">{prescription.patientName}</span>
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
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        <strong>Date:</strong> {formatDate(prescription.prescriptionDate)}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Template:</strong> {prescription.template?.name || "Custom"}
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

                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewPrescription(prescription)}
                        className="flex-1 rounded-xl bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeletePrescription(prescription.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
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
