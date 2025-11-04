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

export default function FamilyMemberList({ userdata, state, dist, subdist, members }) {
  const columns = React.useMemo(
    () => [
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const member = row.original;
      
          // Someone added current user (invited) - show Approve/Reject based on status
          if (member.type === "invited") {
            if (!member.approvalStatus || member.approvalStatus === "PENDING") {
              return (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-green-500 text-white rounded-xl"
                    onClick={() => setDialogData({ 
                      memberId: member.id, 
                      status: "APPROVED",
                      familyType: member.isRegisteredPatient ? "registered" : "default"
                    })}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    className="bg-red-500 text-white rounded-xl"
                    onClick={() => setDialogData({ 
                      memberId: member.id, 
                      status: "REJECTED",
                      familyType: member.isRegisteredPatient ? "registered" : "default"
                    })}
                  >
                    Reject
                  </Button>
                </div>
              );
            }
            
            if (member.approvalStatus === "APPROVED") {
              return (
                <Button
                  size="sm"
                  className="bg-red-500 text-white rounded-xl"
                  onClick={() => setDialogData({ 
                    memberId: member.id, 
                    status: "REJECTED",
                    familyType: member.isRegisteredPatient ? "registered" : "default"
                  })}
                >
                  Reject
                </Button>
              );
            }
            
            if (member.approvalStatus === "REJECTED") {
              return (
                <Button
                  size="sm"
                  className="bg-green-500 text-white rounded-xl"
                  onClick={() => setDialogData({ 
                    memberId: member.id, 
                    status: "APPROVED",
                    familyType: member.isRegisteredPatient ? "registered" : "default"
                  })}
                >
                  Approve
                </Button>
              );
            }
          }
          
          return null;
        },
      },
      {
        accessorKey: "fullName",
        header: () => <div>Full Name</div>,
        cell: ({ row }) => {
          const m = row.original;
          return [m.firstName, m.middleName, m.lastName].filter(Boolean).join(" ");
        },
      },
      { accessorKey: "aadharCardNumber", header: () => <div>Aadhar Card No</div> },
      {
        accessorKey: "relation",
        header: () => <div>Relation</div>,
      },
      {
        accessorKey: "gender",
        header: () => <div>Gender</div>,
      },
      {
        accessorKey: "mobile",
        header: () => <div>Mobile</div>,
      },
      { accessorKey: "email", header: () => <div>Email</div> },
      {
        accessorKey: "bloodgroup",
        header: () => <div>Blood Group</div>,
      },
      {
        accessorKey: "age",
        header: () => <div>Age</div>,
        cell: ({ row }) => {
          const age = row.original.age;
          return age || "";
        },
      },
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
    ],
    []
  );

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

            {member.type === "invited" && (
              <div className="flex gap-2 mt-2">
                {(!member.approvalStatus || member.approvalStatus === "PENDING") && (
                  <>
                    <Button
                      size="sm"
                      className="bg-green-500 text-white"
                      onClick={() => setDialogData({ 
                        memberId: member.id, 
                        status: "APPROVED",
                        familyType: member.isRegisteredPatient ? "registered" : "default"
                      })}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      className="bg-red-500 text-white"
                      onClick={() => setDialogData({ 
                        memberId: member.id, 
                        status: "REJECTED",
                        familyType: member.isRegisteredPatient ? "registered" : "default"
                      })}
                    >
                      Reject
                    </Button>
                  </>
                )}

                {member.approvalStatus === "APPROVED" && (
                  <Button
                    size="sm"
                    className="bg-red-500 text-white"
                    onClick={() => setDialogData({ 
                      memberId: member.id, 
                      status: "REJECTED",
                      familyType: member.isRegisteredPatient ? "registered" : "default"
                    })}
                  >
                    Reject
                  </Button>
                )}

                {member.approvalStatus === "REJECTED" && (
                  <Button
                    size="sm"
                    className="bg-green-500 text-white"
                    onClick={() => setDialogData({ 
                      memberId: member.id, 
                      status: "APPROVED",
                      familyType: member.isRegisteredPatient ? "registered" : "default"
                    })}
                  >
                    Approve
                  </Button>
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
              <span className="text-sm text-gray-900 font-medium text-red-600">{member.bloodgroup}</span>
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
          <h1 className="text-[20px] text-[#2b73ec] font-extrabold">Patient'sFamily Members List</h1>
          <p className="text-[#243460] text-[11px]">All Details</p>
        </div>

        <div className="hidden md:block overflow-x-auto container mx-auto min-[1100px]:w-[900px] xl:w-[1100px] xlg:w-[1200px] w-[350px] md:w-[700px] bg-white p-4 rounded-[15px] shadow-lg">
          <div className="justify-end items-end flex pt-2 md:pt-0">
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