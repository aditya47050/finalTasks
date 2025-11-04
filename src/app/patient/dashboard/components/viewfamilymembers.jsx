"use client";
import React from "react";
import {
  ColumnDef,
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
import AddFamilymemberformClient from "./addfamilydetailsform";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const pageSize = 10;

export default function FamilyMemberList({ userdata, connectionReq , state, dist, subdist, members }) {
  const [editingMemberId, setEditingMemberId] = React.useState(null);
  const [connectionRequests, setConnectionRequests] = React.useState([]); 

// Fetch requests when component mounts
React.useEffect(() => {
  async function fetchRequests() {
    try {
      const res = await fetch("/api/patient/connection-request");
      if (!res.ok) throw new Error("Failed to fetch requests");
      const data = await res.json();
      setConnectionRequests(data); // store all requests
    } catch (err) {
      console.error(err);
    }
  }
  fetchRequests();
}, []);

// Update request after approve/reject
const handleRequestUpdate = (requestId, status, remark = "") => {
  // Update locally
  setConnectionRequests((prev) =>
    prev.map((req) =>
      req.id === requestId ? { ...req, status, remark } : req
    )
  );

  // If approved, add to members table
  if (status === "APPROVED") {
    const approvedReq = connectionRequests.find((r) => r.id === requestId);
    if (approvedReq) {
      members((prev) => [
        ...prev,
        {
          ...approvedReq.child,
          relation: approvedReq.remark || "Child",
          approvalStatus: "APPROVED",
          type: "addedFromRequest",
        },
      ]);
    }
  }
};

// Render request cards
const ConnectionRequestCard = ({ request, onUpdate }) => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  // Hide if already processed
  if (request.status === "APPROVED" || request.status === "REJECTED") return null;

  const handleStatusUpdate = async (status) => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/patient/connection-request", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: request.id,
          status,
          remark: request.remark || "",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update request");

      // Notify parent to update UI
      if (onUpdate) onUpdate(request.id, status);

    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border p-4 mb-4">
      <h3 className="font-semibold">
        Connection Request for {request.child?.firstName || request.receiverEmail}
      </h3>
      <p>Remark: {request.remark}</p>

      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}

      <div className="flex gap-2 mt-2">
        <Button
          size="sm"
          className="bg-green-500 text-white"
          disabled={loading}
          onClick={() => handleStatusUpdate("APPROVED")}
        >
          {loading ? "Processing..." : "Approve"}
        </Button>
        <Button
          size="sm"
          className="bg-red-500 text-white"
          disabled={loading}
          onClick={() => handleStatusUpdate("REJECTED")}
        >
          {loading ? "Processing..." : "Reject"}
        </Button>
      </div>
    </div>
  );
};

  const getAge = (member) => {
  if (member.age) {
    return member.age;
  }
  return new Date().getFullYear() - new Date(member.dateOfBirth).getFullYear() || null;
};

const columns = React.useMemo(() => [
  // 1️⃣ Request Connection
{
  id: "connectionRequest",
  header: "Connection Request",
  cell: ({ row }) => {
    const member = row.original;
    const age = getAge(member);

    if (age !== null && age <= 16) {
      console.log(connectionReq);
      // ✅ Check if a pending request exists for this member
      const existingRequest =  connectionReq?.status !== null && connectionReq?.receiverEmail === member.email;
      const approved = connectionReq?.status === "APPROVED" && connectionReq?.receiverEmail === member.email;

      return approved 
      ?  
      <span className="text-yellow-600 font-semibold text-sm">Approved</span>
      :
      existingRequest ? (
        <span className="text-yellow-600 font-semibold text-sm">Request Sent</span>
      ) : (
        <Button
          size="sm"
          className="bg-blue-500 text-white rounded-xl"
          onClick={() => handleRequestConnection(member)}
        >
          Request
        </Button>
      );
    }

    return <span className="text-gray-400 text-xs italic">Not applicable</span>;
  },
},


  // 2️⃣ Edit (owned members)
  {
  id: "edit",
  header: "Edit",
  cell: ({ row }) => {
    const member = row.original;

    if (member.type === "owned") {
      return (
        <div>
          <Button
            size="sm"
            className="bg-blue-500 text-white rounded-xl"
            onClick={() =>
              setEditingMemberId(editingMemberId === member.id ? null : member.id)
            }
          >
            {editingMemberId === member.id ? "Close" : "Edit"}
          </Button>

          {editingMemberId === member.id && (
            <AddFamilymemberformClient
              userdata={userdata}
              memberid={member.id}
              states={state}
              dist={dist}
              subdist={subdist}
            />
          )}
        </div>
      );
    }

    return <span className="text-gray-400 text-xs italic">No edit</span>;
  },
}
,

  // 4️⃣ Other data columns (Full name, Aadhar, Relation, etc.)
  {
    accessorKey: "fullName",
    header: "Full Name",
    cell: ({ row }) => {
      const m = row.original;
      return [m.firstName, m.middleName, m.lastName].filter(Boolean).join(" ");
    },
  },
  { accessorKey: "aadharCardNumber", header: "Aadhar Card No" },
  { accessorKey: "relation", header: "Relation" },
  { accessorKey: "gender", header: "Gender" },
  { accessorKey: "mobile", header: "Mobile" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "bloodgroup", header: "Blood Group" },
  { accessorKey: "age", header: "Age", cell: ({ row }) => getAge(row.original) || "" },
  {
    accessorKey: "approvalStatus",
    header: "Approval Status",
    cell: ({ row }) => {
      const status = row.original.approvalStatus;
      if (!status) return "Pending";
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
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
], [userdata, state, dist, subdist]);



  const [sorting, setSorting] = React.useState([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: pageSize,
  });
  const [dialogData, setDialogData] = React.useState(null);
  const [remark, setRemark] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");

  const table = useReactTable({
    data: members || [],
    columns,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      pagination,
    },
  });

  const handleApproval = async (memberId, status, remark = "", familyType = "default") => {
    try {
      setLoading(true);
      setErrorMsg("");
  
      const endpoint = familyType === "registered" 
        ? `/api/patient/${userdata.id}/family-details/registered/${memberId}/approval`
        : `/api/patient/${userdata.id}/family-details/${memberId}/approval`;
  
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, remark }),
      });
  
      if (!res.ok) throw new Error("Failed to update approval");
  
      window.location.reload();
    } catch (err) {
      console.error("Error updating member:", err);
      setErrorMsg("Failed to update member. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Send connection request (parent → child)
  const handleRequestConnection = async (member) => {
    try {
      setLoading(true);

      const res = await fetch("/api/patient/connection-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverEmail: member.email,
          remark: `Connection request for minor: ${member.firstName}`,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send connection request");
      }

      alert("Connection request sent successfully!");
    } catch (err) {
      console.error("Request connection failed:", err);
      alert(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };


  const FamilyMemberCard = ({ member, index }) => {

    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <div className="flex justify-between items-start mb-3 pb-3 border-b border-gray-100">
          <div>
            <h3 className="font-semibold text-lg text-gray-900 mb-1">
              {[member.firstName, member.middleName, member.lastName].filter(Boolean).join(" ")}
            </h3>
            <span className="inline-block px-2 py-1 bg-[#2b73ec] text-white text-xs rounded-[10px] font-medium">
              {member.relation}
            </span>
          </div>
          <div className="flex-shrink-0 flex flex-col items-end gap-2">
            {/* Request Connection */}
            {member.age <= 16 && (
              <Button
                size="sm"
                className="bg-blue-500 text-white"
                onClick={() => handleRequestConnection(member)}
              >
                Request
              </Button>
            )}

            {/* Edit form */}
            {member.type === "owned" && (
  <div className="mt-2">
    <Button
      size="sm"
      className="bg-blue-500 text-white"
      onClick={() =>
        setEditingMemberId(editingMemberId === member.id ? null : member.id)
      }
    >
      {editingMemberId === member.id ? "Close" : "Edit"}
    </Button>

    {editingMemberId === member.id && (
      <AddFamilymemberformClient
        userdata={userdata}
        memberid={member.id}
        states={state}
        dist={dist}
        subdist={subdist}
      />
    )}
  </div>
)}

          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Gender:</span>
              <span className="text-sm text-gray-900">{member.gender}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Age:</span>
              <span className="text-sm text-gray-900">
                {member.dateOfBirth ? new Date().getFullYear() - new Date(member.dateOfBirth).getFullYear() : ""}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Blood Group:</span>
              <span className="text-sm  font-medium text-red-600">{member.bloodgroup}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Mobile:</span>
              <span className="text-sm text-gray-900 font-mono">{member.mobile}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email:</span>
              <span className="text-sm text-gray-900 font-mono">{member.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Aadhar:</span>
              <span className="text-sm text-gray-900 font-mono">{member.aadharCardNumber}</span>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-100">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Approval Status:</span>
          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
            member.approvalStatus === "APPROVED"
              ? "bg-green-100 text-green-700"
              : member.approvalStatus === "REJECTED"
              ? "bg-red-100 text-red-700"
              : "bg-yellow-100 text-yellow-700"
          }`}>
            {member.approvalStatus || "PENDING"}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="md:container mx-auto md:flex py-4 justify-center items-center md:max-w-6xl">
      <div className="w-full">
        <div className="justify-center text-center font-poppins pt-2">
          <h1 className="text-[20px] text-[#2b73ec] font-extrabold">Family Members List</h1>
          <p className="text-[#243460] text-[11px]">All Details</p>
        </div>

        <div className="hidden md:block overflow-x-auto container mx-auto min-[1100px]:w-[900px] xl:w-[1100px] xlg:w-[1200px] w-[350px] md:w-[700px] bg-white p-4 rounded-[15px] shadow-lg">
          <div className="justify-end items-end flex pt-2 md:pt-0">
            <AddFamilymemberformClient
              userdata={userdata}
              states={state}
              dist={dist}
              subdist={subdist}
              className="justify-end flex"
            />
          </div>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="border border-gray-200 py-4 px-6 text-left font-semibold text-gray-900 whitespace-nowrap">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="transition-colors duration-150 ease-in-out hover:bg-gray-50/50 border-[1px] border-gray-100">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="border-[1px] border-gray-200 py-2 px-2 text-center text-sm whitespace-nowrap max-w-max hover:bg-gray-100">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center py-12">
                    <div className="flex flex-col items-center space-y-3">
                      <p className="text-sm font-medium text-gray-900">No results.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between py-4">
            <Button size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
              <span className="rounded-full border-2 px-3 border-[#243460]">Previous</span>
            </Button>
            <span>Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}</span>
            <Button size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              <span className="rounded-full border-2 px-3 border-[#243460]">Next</span>
            </Button>
          </div>
        </div>
        
        <div className="block md:hidden mx-auto min-[1100px]:w-[900px] xl:w-[1100px] xlg:w-[1200px] md:w-[700px] bg-gray-50/30 p-4 rounded-[15px] shadow-lg">
          <div className="justify-end items-end flex pt-2 md:pt-0 mb-4">
            <AddFamilymemberformClient
              userdata={userdata}
              states={state}
              dist={dist}
              subdist={subdist}
              className="justify-end flex"
            />
          </div>

          <div className="space-y-0">
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row, index) => (
                <FamilyMemberCard key={row.id} member={row.original} index={index} />
              ))
            ) : (
              <div className="text-center py-12">
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 极狐a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 极狐 014 0z" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-900">No family members found.</p>
                  <p className="text-xs text-gray-500">Add your first family member to get started.</p>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="mb-4">
          {connectionRequests
            .filter(
              (r) =>
                r.status === "PENDING" &&
                r.receiverEmail === userdata.email // only for child
            )
            .map((req) => (
              <ConnectionRequestCard key={req.id} request={req} />
            ))}
        </div>        
        <Dialog open={!!dialogData} onOpenChange={() => setDialogData(null)}>
          <DialogContent className="rounded-xl bg-white max-w-md">
            <DialogHeader className="text-center">
              <DialogTitle className="text-xl font-semibold">
                {dialogData?.status === "APPROVED" ? "Approve Member" : "极狐 Member"}
              </DialogTitle>
              {dialogData?.status === "REJECTED" && (
                <DialogDescription className="mt-1">Please provide a remark before proceeding.</DialogDescription>
              )}
            </DialogHeader>

            <Textarea placeholder="Enter remark" value={remark} onChange={(e) => setRemark(e.target.value)} className="mt-2 rounded-xl" />

            {errorMsg && <p className="text-sm text-red-600 mt-2">{errorMsg}</p>}

            <DialogFooter className="mt-4 flex justify-end gap极狐">
              <Button variant="outline" disabled={loading} className="rounded-xl" onClick={() => { setDialogData(null); setRemark(""); setErrorMsg(""); }}>
                Cancel
              </Button>
              <Button
                className={`rounded-xl ${dialogData?.status === "APPROVED" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
                disabled={loading}
                onClick={() => handleApproval(dialogData.memberId, dialogData.status, remark, dialogData.familyType)}
              >
                {loading ? "Processing..." : dialogData?.status === "APPROVED" ? "Approve" : "Reject"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}