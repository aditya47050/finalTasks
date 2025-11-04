"use client";

import React, { useMemo, useState } from "react";
import { format } from "date-fns";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HomeHealthcareApprovalClient = ({ userdata, associations, state = [], dist = [], subdist = [] }) => {
  // associations: array of HospitalHomeHealthcare records, each includes .id and .hospital (with hspInfo/hspcontact)
  const [rows, setRows] = useState(associations || []);
  const [filters, setFilters] = useState({
    regname: "",
    email: "",
    mobile: "",
    city: "",
    state: "all",
    district: "all",
    subdistrict: "all",
    status: "all",
  });

  const [filtersVisible, setFiltersVisible] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(null);
  const [remarks, setRemarks] = useState({});
  const [dialogData, setDialogData] = useState(null); // { assoc, type }
  const [selectedIssues, setSelectedIssues] = useState({});

  const pageSize = 10;
  const rejectionIssues = [
    "Invalid Email",
    "Invalid Contact No",
    "Invalid Address",
    "Other Compliance Issues",
  ];

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "state" ? { district: "all", subdistrict: "all" } : {}),
      ...(field === "district" ? { subdistrict: "all" } : {}),
    }));
    setPage(1);
  };

  // Filtered data (same logic as Diagnostic client)
  const filteredData = useMemo(() => {
    return (rows || []).filter((item) => {
      const h = item.hospital || {};
      if (filters.regname && !h.hspInfo?.regname?.toLowerCase().includes(filters.regname.toLowerCase())) return false;
      if (filters.email && !h.email?.toLowerCase().includes(filters.email.toLowerCase())) return false;
      if (filters.mobile && !(h.mobile || "").includes(filters.mobile)) return false;
      if (filters.city && !h.hspcontact?.city?.toLowerCase().includes(filters.city.toLowerCase())) return false;
      if (filters.state !== "all" && h.hspcontact?.stateId !== filters.state) return false;
      if (filters.district !== "all" && h.hspcontact?.districtId !== filters.district) return false;
      if (filters.subdistrict !== "all" && h.hspcontact?.subdistrictId !== filters.subdistrict) return false;
      if (filters.status !== "all" && (item.status || "PENDING") !== filters.status) return false;
      return true;
    });
  }, [rows, filters]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize);

  // Export to Excel
  const exportToExcel = () => {
    const exportData = filteredData.map((item) => {
      const h = item.hospital || {};
      return {
        "Hospital Name": h.hspInfo?.regname || "N/A",
        Email: h.email || "N/A",
        Mobile: h.mobile || "N/A",
        Address: `${h.hspcontact?.address || ""}, ${h.hspcontact?.city || ""}, ${h.hspcontact?.state || ""}`.trim(),
        City: h.hspcontact?.city || "N/A",
        State: h.hspcontact?.state || "N/A",
        Status: item.status || "PENDING",
        "Linked At": item.createdAt ? format(new Date(item.createdAt), "dd/MM/yyyy") : "N/A",
      };
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "HomeHealthcareAssociations");
    XLSX.writeFile(wb, `HomeHealthcareAssociations_${format(new Date(), "yyyy-MM-dd")}.xlsx`);
  };

  // Approve / Reject (calls server API)
  const handleApproval = async (assocId, approved) => {
    try {
      setLoading(assocId);

      let notes = "";
      if (!approved) {
        notes = remarks[assocId] || "";
        if (selectedIssues[assocId]?.length > 0) {
          notes += (notes ? "\n" : "") + `Issues: ${selectedIssues[assocId].join(", ")}`;
        }
      }

      // API path: adjust server route name to your project if different
      const res = await fetch(`/api/home-healthcare/${userdata.id}/hospitalapproval`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hospitalHomeHealthcareId: assocId,
          approved,
          notes,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.message || "Failed to update status");
      }

      // Update UI immediately
      setRows((prev) =>
        prev.map((r) =>
          r.id === assocId
            ? {
                ...r,
                status: approved ? "APPROVED" : "REJECTED",
                notes: notes || null,
                approvedBy: userdata.email,
                approvedAt: new Date().toISOString(),
              }
            : r
        )
      );

      toast[approved ? "success" : "error"](json.message || (approved ? "Approved" : "Rejected"));
      setDialogData(null);

      // cleanup local inputs for that assoc
      setRemarks((p) => {
        const cp = { ...p };
        delete cp[assocId];
        return cp;
      });
      setSelectedIssues((p) => {
        const cp = { ...p };
        delete cp[assocId];
        return cp;
      });
    } catch (err) {
      console.error("Approval error:", err);
      toast.error(err.message || "Something went wrong while updating approval status.");
    } finally {
      setLoading(null);
    }
  };

  const filteredDistricts = filters.state === "all" ? [] : dist.filter((d) => d.stateId === filters.state);
  const filteredSubdistricts = filters.district === "all" ? [] : subdist.filter((sd) => sd.districtId === filters.district);

  return (
    <div className="container mx-auto font-poppins md:max-w-6xl">
      {/* Heading */}
      <div className="text-center pt-4">
        <h1 className="text-[24px] text-[#2b73ec] font-extrabold">Hospital Associations</h1>
        <p className="text-[#243460] text-[13px] mt-1">Hospitals requesting association</p>
      </div>

      {/* Controls */}
      <div className="flex justify-end items-center py-4 space-x-4">
        <Button onClick={() => setFiltersVisible(!filtersVisible)} className="bg-blue-500 hover:bg-blue-600 rounded-xl text-white">
          {filtersVisible ? "Hide Filters" : "Show Filters"}
        </Button>
        <Button onClick={exportToExcel} className="bg-green-500 hover:bg-green-600 rounded-xl text-white">
          Export to Excel
        </Button>
      </div>

      {/* Filters */}
      {filtersVisible && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 mb-4 bg-gray-50 rounded-xl">
          <input placeholder="Hospital Name" value={filters.regname} onChange={(e) => handleFilterChange("regname", e.target.value)} className="p-2 border rounded-xl" />
          <input placeholder="Email" value={filters.email} onChange={(e) => handleFilterChange("email", e.target.value)} className="p-2 border rounded-xl" />
          <input placeholder="Mobile" value={filters.mobile} onChange={(e) => handleFilterChange("mobile", e.target.value)} className="p-2 border rounded-xl" />
          <input placeholder="City" value={filters.city} onChange={(e) => handleFilterChange("city", e.target.value)} className="p-2 border rounded-xl" />

          {/* State dropdown */}
          <select value={filters.state} onChange={(e) => handleFilterChange("state", e.target.value)} className="p-2 border rounded-xl">
            <option value="all">All States</option>
            {state.map((s) => (
              <option key={s.id} value={s.id}>{s.stateName}</option>
            ))}
          </select>

          {/* District dropdown */}
          <select value={filters.district} onChange={(e) => handleFilterChange("district", e.target.value)} className="p-2 border rounded-xl" disabled={filters.state === "all"}>
            <option value="all">All Districts</option>
            {filteredDistricts.map((d) => (
              <option key={d.id} value={d.id}>{d.district}</option>
            ))}
          </select>

          {/* Subdistrict dropdown */}
          <select value={filters.subdistrict} onChange={(e) => handleFilterChange("subdistrict", e.target.value)} className="p-2 border rounded-xl" disabled={filters.district === "all"}>
            <option value="all">All Subdistricts</option>
            {filteredSubdistricts.map((sd) => (
              <option key={sd.id} value={sd.id}>{sd.subDistrict}</option>
            ))}
          </select>

          <select value={filters.status} onChange={(e) => handleFilterChange("status", e.target.value)} className="p-2 border rounded-xl">
            <option value="all">All Status</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="PENDING">Pending</option>
          </select>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto bg-white p-6 rounded-[15px] shadow-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Hospital Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>City</TableHead>
              <TableHead>State</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length ? (
              paginatedData.map((row) => {
                const h = row.hospital || {};
                return (
                  <TableRow key={row.id}>
                    <TableCell>{h.hspInfo?.regname || "N/A"}</TableCell>
                    <TableCell>{h.email || "N/A"}</TableCell>
                    <TableCell>{h.mobile || "N/A"}</TableCell>
                    <TableCell>{`${h.hspcontact?.address || ""}, ${h.hspcontact?.city || ""}, ${h.hspcontact?.state || ""}`.trim() || "N/A"}</TableCell>
                    <TableCell>{h.hspcontact?.city || "N/A"}</TableCell>
                    <TableCell>{h.hspcontact?.state || "N/A"}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${row.status === "APPROVED" ? "bg-green-100 text-green-700" : row.status === "REJECTED" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {row.status || "PENDING"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button className="bg-green-500 hover:bg-green-600 text-white rounded" disabled={loading === row.id || row.status === "APPROVED"} onClick={() => setDialogData({ assoc: row, type: "approve" })}>
                          Approve
                        </Button>
                        <Button className="bg-red-500 hover:bg-red-600 text-white rounded" disabled={loading === row.id || row.status === "REJECTED"} onClick={() => setDialogData({ assoc: row, type: "reject" })}>
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">No hospital associations found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between py-4">
          <Button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>Previous</Button>
          <span>Page {page} of {totalPages}</span>
          <Button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}>Next</Button>
        </div>
      </div>

      {/* Dialog */}
      <Dialog open={!!dialogData} onOpenChange={() => setDialogData(null)}>
        <DialogContent className="bg-white max-w-lg w-full min-h-[300px] rounded-2xl flex flex-col justify-between shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-800">{dialogData?.type === "approve" ? "Approve Hospital" : "Reject Hospital"}</DialogTitle>
          </DialogHeader>

          <Textarea placeholder="Optional note..." value={remarks[dialogData?.assoc?.id] || ""} onChange={(e) => setRemarks((prev) => ({ ...prev, [dialogData?.assoc?.id]: e.target.value }))} className="min-h-[100px] rounded-lg" />

          {dialogData?.type === "reject" && (
            <div className="mt-4 space-y-2 overflow-y-auto max-h-[120px]">
              <p className="font-medium text-sm">Select Issues (optional):</p>
              {rejectionIssues.map((issue) => (
                <label key={issue} className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox checked={selectedIssues[dialogData?.assoc?.id]?.includes(issue) || false} onCheckedChange={(checked) => {
                    setSelectedIssues((prev) => {
                      const current = prev[dialogData?.assoc?.id] || [];
                      return { ...prev, [dialogData?.assoc?.id]: checked ? [...current, issue] : current.filter((i) => i !== issue) };
                    });
                  }} />
                  {issue}
                </label>
              ))}
            </div>
          )}

          <DialogFooter className="flex justify-end gap-2 pt-4">
            <Button className="bg-gray-300 text-black rounded-full px-5" onClick={() => setDialogData(null)}>Cancel</Button>
            <Button className={`px-5 rounded-full ${dialogData?.type === "approve" ? "bg-green-500 text-white hover:bg-green-600" : "bg-red-500 text-white hover:bg-red-600"}`} disabled={loading === dialogData?.assoc?.id} onClick={() => handleApproval(dialogData.assoc.id, dialogData.type === "approve")}>
              {loading === dialogData?.assoc?.id ? "Processing..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HomeHealthcareApprovalClient;
