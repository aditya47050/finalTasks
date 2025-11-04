"use client";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  FileDigit,
  Hospital,
  FolderOpen,
  Plus,
  X,
  Download,
  FileText,
  Upload as UploadIcon,
  Loader2,
} from "lucide-react";
import { UploadButton } from "@uploadthing/react";
import { SelectField } from "@/app/components/input-selectui";
import * as XLSX from "xlsx";

export default function HealthInsurance({
  primaryInsurance,
  secondaryInsurances: initialSecondaryInsurances,
  patientId,
  patientName = "Patient",
}) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [secondaryInsurances, setSecondaryInsurances] = useState(initialSecondaryInsurances || []);
  const [form, setForm] = useState({
    provider: "",
    policyNumber: "",
    document: "",
    coverage: "",
    copay: "",
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ provider: "" });

  // Filtering logic
  const filteredData = useMemo(() => {
    return secondaryInsurances.filter((row) => {
      return Object.entries(filters).every(([key, filterValue]) => {
        if (!filterValue) return true;
        if (key === "provider") {
          const rowValue = String(row[key] || "").toLowerCase().trim();
          const filterValueStr = String(filterValue || "").toLowerCase().trim();
          return rowValue === filterValueStr;
        }
        return true;
      });
    });
  }, [filters, secondaryInsurances]);

  // Export to Excel
  const exportToExcel = () => {
    const allData = [
      ...(primaryInsurance
        ? [
            {
              ...primaryInsurance,
              type: "Primary",
            },
          ]
        : []),
      ...secondaryInsurances.map((row) => ({
        ...row,
        type: "Secondary",
      })),
    ];
    const ws = XLSX.utils.json_to_sheet(allData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Health Insurance");
    XLSX.writeFile(wb, "health_insurance_data.xlsx");
  };

  // Add insurance
  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleAddInsurance = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/patient/healthinsurance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, patientId }),
      });
      if (!res.ok) throw new Error("Failed to add insurance");
      const data = await res.json();
      setSecondaryInsurances((prev) => [data, ...prev]);
      setShowAddDialog(false);
      setForm({ provider: "", policyNumber: "", document: "", coverage: "", copay: "" });
    } catch (err) {
      setError(err.message || "Error adding insurance");
    } finally {
      setLoading(false);
    }
  };

  // Card UI for both primary and secondary
  const InsuranceCard = ({ insurance, isPrimary = false }) => (
    <div className="flex flex-col bg-white border border-gray-100 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      {/* Card Header */}
      <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-100 flex items-center gap-3">
        <div className="flex items-center justify-center bg-blue-100 rounded-xl w-12 h-12 p-2">
          <ShieldCheck className="w-7 h-7 text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 text-lg md:text-xl">
            {isPrimary ? "Primary Insurance" : "Secondary Insurance"}
          </h3>
          <div className="flex flex-wrap gap-1 mt-1">
            {insurance.provider && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                {insurance.provider}
              </span>
            )}
          </div>
        </div>
      </div>
      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col gap-3">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <FileDigit className="w-4 h-4 text-blue-500" />
          <span>
            <span className="font-medium">Policy Number:</span>{" "}
            <span className="font-semibold text-blue-700">{insurance.policyNumber || "N/A"}</span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Hospital className="w-4 h-4 text-indigo-500" />
          <span>
            <span className="font-medium">Coverage:</span>{" "}
            <span className="font-semibold text-indigo-700">{insurance.coverage || "N/A"}</span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <FileText className="w-4 h-4 text-green-600" />
          <span>
            <span className="font-medium">Co-pay:</span>{" "}
            <span className="font-semibold text-green-700">{insurance.copay || "N/A"}</span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <FolderOpen className="w-4 h-4 text-pink-500" />
          <span>
            <span className="font-medium">Document:</span>{" "}
            {insurance.document ? (
              <a
                href={insurance.document}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline text-xs font-semibold"
              >
                View Document
              </a>
            ) : (
              <span className="text-gray-400 text-xs">No document</span>
            )}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto font-poppins p-2 sm:p-4 lg:p-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        {/* Header - Centered */}
        <div className="p-4 sm:p-6 border-b border-gray-100">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-blue-600 flex items-center justify-center gap-2">
              <ShieldCheck className="w-6 h-6" />
              Health Insurance Policies
            </h2>
            <p className="text-blue-600 mt-1">Manage and view your health insurance policies</p>
          </div>
          {/* Top Actions - Responsive */}
          <div className="flex flex-col sm:flex-row flex-wrap justify-end gap-2 pb-2">
            <Button
              onClick={() => setShowAddDialog(true)}
              className="bg-blue-500 text-white rounded-xl flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add New Health Insurance
            </Button>
            <Button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-blue-500 text-white rounded-xl flex items-center gap-2"
            >
              <FolderOpen className="w-4 h-4" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
            <Button
              onClick={exportToExcel}
              className="bg-green-500 text-white rounded-xl flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export to Excel
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
                  onChange={(value) => setFilters((f) => ({ ...f, provider: value }))}
                  options={[
                    { value: "", label: "All Providers" },
                    ...[...new Set(secondaryInsurances.map((i) => i.provider))]
                      .filter(Boolean)
                      .map((provider) => ({ value: provider, label: provider })),
                  ]}
                />
              </div>
            </div>
          )}
        </div>

        {/* Card View */}
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Primary Insurance Card */}
            {primaryInsurance && <InsuranceCard insurance={primaryInsurance} isPrimary />}
            {/* Secondary Insurance Cards */}
            {filteredData.length > 0 ? (
              filteredData.map((row) => (
                <InsuranceCard key={row.id} insurance={row} />
              ))
            ) : (
              <div className="text-gray-500 text-center py-8 col-span-3">
                No secondary health insurances added yet.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Insurance Dialog */}
      {showAddDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 w-full max-w-md relative">
            <button
              onClick={() => setShowAddDialog(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
              title="Close"
              type="button"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold mb-4 text-blue-700 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add Health Insurance
            </h3>
            <form onSubmit={handleAddInsurance} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
                <input
                  name="provider"
                  value={form.provider}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter provider name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Policy Number</label>
                <input
                  name="policyNumber"
                  value={form.policyNumber}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter policy number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Coverage</label>
                <input
                  name="coverage"
                  value={form.coverage}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter coverage"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Co-pay</label>
                <input
                  name="copay"
                  value={form.copay}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter co-pay"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Document</label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={form.document}
                    readOnly
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Upload or paste document URL"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <UploadButton
                      endpoint="fileUploader"
                      content={{
                        button({ ready }) {
                          return (
                            <div className="flex items-center gap-1">
                              {uploading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <UploadIcon className="w-4 h-4" />
                              )}
                              <span>{ready ? (uploading ? "Uploading..." : "Upload") : "..."}</span>
                            </div>
                          );
                        },
                        allowedContent: () => "",
                      }}
                      appearance={{
                        button: "bg-blue-500 text-white px-3 py-1 rounded text-xs",
                        container: "flex-1",
                        allowedContent: "hidden",
                      }}
                      onUploadBegin={() => setUploading(true)}
                      onClientUploadComplete={(res) => {
                        setUploading(false);
                        if (res.length > 0) {
                          setForm((prev) => ({
                            ...prev,
                            document: res[0].url,
                          }));
                        }
                      }}
                      onUploadError={(error) => {
                        setUploading(false);
                        alert(`Upload error: ${error.message}`);
                      }}
                    />
                  </div>
                </div>
                {form.document && (
                  <a
                    href={form.document}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline text-xs mt-1 inline-block"
                  >
                    View
                  </a>
                )}
              </div>
              {error && <div className="text-red-600 text-sm">{error}</div>}
              <Button
                type="submit"
                className="w-full bg-blue-600 text-white rounded-lg mt-2"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Insurance"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}