"use client";

import React, { useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import * as XLSX from "xlsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

const AmbulanceHospitalsClient = ({ hospitals, ambulanceId }) => {
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(null);
  const [remarks, setRemarks] = useState({});
  const [dialogData, setDialogData] = useState(null); // { hospitalId, status }
  const [selectedIssues, setSelectedIssues] = useState({}); // store issues per hospital
  const [hospitalList, setHospitalList] = useState(hospitals);

  // Example rejection reasons
  const rejectionIssues = [
    "Invalid contact details",
    "Documents missing",
    "Duplicate registration",
    "Other compliance issue",
  ];

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

const handleApproval = async (hospitalId, approved) => {
  try {
    setLoading(hospitalId);

    let rejectionNote = "";
    if (!approved) {
      rejectionNote = remarks[hospitalId] || "";
      if (selectedIssues[hospitalId]?.length > 0) {
        rejectionNote += `\nIssues: ${selectedIssues[hospitalId].join(", ")}`;
      }
    }

    const res = await fetch(`/api/ambulance/${ambulanceId}/hospitalapproval`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hospitalId,
        approved,
        rejectionNote,
      }),
    });

    if (!res.ok) throw new Error("Failed to update status");

    const data = await res.json();

    // ✅ Update local state immediately
    setHospitalList((prev) =>
      prev.map((h) =>
        h.id === hospitalId
          ? { ...h, approvalStatus: approved ? "APPROVED" : "REJECTED" }
          : h
      )
    );

    alert(
      `Hospital ${approved ? "approved" : "rejected"} successfully!\n\n${
        data.message
      }`
    );
  } catch (err) {
    console.error(err);
    alert("Error updating hospital approval.");
  } finally {
    setLoading(null);
    setDialogData(null);
  }
};



  const filteredData = useMemo(() => {
    return hospitalList.filter((row) =>
      Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        if (key === "regname") {
          return (row.hspInfo?.regname || "")
            .toLowerCase()
            .includes(value.toLowerCase());
        }
        if (key === "address") {
          const addr = `${row.hspcontact?.address || ""} ${row.hspcontact?.city || ""} ${row.hspcontact?.state || ""}`.trim();
          return addr.toLowerCase().includes(value.toLowerCase());
        }
        return String(row[key] || "")
          .toLowerCase()
          .includes(value.toLowerCase());
      })
    );
  }, [hospitalList, filters]);

  const columns = useMemo(
    () => [
      {
        header: "Hospital Name",
        accessorKey: "regname",
        cell: ({ row }) => row.original.hspInfo?.regname || "N/A",
      },
      {
        header: "Address",
        accessorKey: "address",
        cell: ({ row }) => {
          const addr = row.original.hspcontact?.address || "N/A";
          const city = row.original.hspcontact?.city || "";
          const state = row.original.hspcontact?.state || "";
          return `${addr} ${city} ${state}`.trim() || "N/A";
        },
      },
      {
        header: "Approval Status",
        accessorKey: "approvalStatus",
        cell: ({ row }) => {
          const status = row.original.approvalStatus || "PENDING";
          return (
            <span
              className={`px-2 py-1 rounded text-xs font-semibold ${
                status === "APPROVED"
                  ? "bg-green-100 text-green-700"
                  : status === "REJECTED"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {status}
            </span>
          );
        },
      },
      {
        header: "Actions",
cell: ({ row }) => {
  const hospitalId = row.original.id;
  return (
    <div className="flex flex-row gap-2">
      <Button
        className="bg-green-500 hover:bg-green-600 text-white rounded"
        disabled={loading === hospitalId}
        onClick={() => setDialogData({ hospitalId, status: "APPROVED" })}
      >
        Approve
      </Button>
      <Button
        className="bg-red-500 hover:bg-red-600 text-white rounded"
        disabled={loading === hospitalId}
        onClick={() => setDialogData({ hospitalId, status: "REJECTED" })}
      >
        Reject
      </Button>
    </div>
  );
},

      },
    ],
    [loading]
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      filteredData.map((h) => ({
        "Hospital Name": h.hspInfo?.regname || "",
        Address: `${h.hspcontact?.address || ""} ${h.hspcontact?.city || ""} ${h.hspcontact?.state || ""}`.trim(),
        Status: h.approvalStatus || "PENDING",
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Hospitals");
    XLSX.writeFile(wb, "ambulance_hospitals.xlsx");
  };

  return (
    <div className="container mx-auto font-poppins">
      {/* Header */}
      <div className="text-center pt-4">
        <h1 className="text-[20px] text-[#2b73ec] font-extrabold">
          Associated Hospitals
        </h1>
        <p className="text-[#243460] text-[11px]">
          List of hospitals linked to this ambulance
        </p>
      </div>

      {/* Controls */}
      <div className="flex justify-end gap-2 py-4">
        <Button
          className="bg-blue-500 hover:bg-blue-600 rounded-xl text-white"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </Button>
        <Button
          className="bg-green-500 hover:bg-green-600 rounded-xl text-white"
          onClick={exportToExcel}
        >
          Export to Excel
        </Button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
          <input
            type="text"
            placeholder="Search Hospital Name"
            value={filters.regname || ""}
            onChange={(e) => handleFilterChange("regname", e.target.value)}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Search Address"
            value={filters.address || ""}
            onChange={(e) => handleFilterChange("address", e.target.value)}
            className="p-2 border rounded"
          />
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto bg-white p-4 rounded-[15px] shadow-lg">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="border">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="border align-top">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-4"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between py-4">
          <Button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <span>
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>
          <Button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
<Dialog open={!!dialogData} onOpenChange={() => setDialogData(null)}>
  <DialogContent className="bg-white max-w-lg w-full min-h-[300px] rounded-2xl flex flex-col justify-between shadow-lg">
    <DialogHeader className="text-center">
      <DialogTitle className="text-lg font-semibold text-gray-800">
        {dialogData?.status === "APPROVED"
          ? "Approve Hospital"
          : "Reject Hospital"}
      </DialogTitle>
    </DialogHeader>

    {/* Remark textarea */}
    <Textarea
      placeholder="Optional note..."
      value={remarks[dialogData?.hospitalId] || ""}
      onChange={(e) =>
        setRemarks((prev) => ({
          ...prev,
          [dialogData?.hospitalId]: e.target.value,
        }))
      }
      className="min-h-[100px] rounded-lg"
    />

    {/* Show issues only when rejecting */}
    {dialogData?.status === "REJECTED" && (
      <div className="mt-4 space-y-2 overflow-y-auto max-h-[120px]">
        <p className="font-medium text-sm">Select Issues (optional):</p>
        {rejectionIssues.map((issue) => (
          <label
            key={issue}
            className="flex items-center gap-2 text-sm cursor-pointer"
          >
            <Checkbox
              checked={
                selectedIssues[dialogData?.hospitalId]?.includes(issue) || false
              }
              onCheckedChange={(checked) => {
                setSelectedIssues((prev) => {
                  const current = prev[dialogData?.hospitalId] || [];
                  return {
                    ...prev,
                    [dialogData?.hospitalId]: checked
                      ? [...current, issue]
                      : current.filter((i) => i !== issue),
                  };
                });
              }}
            />
            {issue}
          </label>
        ))}
      </div>
    )}

    <DialogFooter className="flex justify-end gap-2 pt-4">
      <Button
        className="bg-gray-300 text-black rounded-full px-5"
        onClick={() => setDialogData(null)}
      >
        Cancel
      </Button>
      <Button
        className={`px-5 rounded-full ${
          dialogData?.status === "APPROVED"
            ? "bg-green-500 text-white hover:bg-green-600"
            : "bg-red-500 text-white hover:bg-red-600"
        }`}
        disabled={loading === dialogData?.hospitalId}
        onClick={() =>
          handleApproval(
            dialogData.hospitalId,
            dialogData.status === "APPROVED"
          )
        }
      >
        {loading === dialogData?.hospitalId ? "Processing..." : "Confirm"}
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

    </div>
  );
};

export default AmbulanceHospitalsClient;
