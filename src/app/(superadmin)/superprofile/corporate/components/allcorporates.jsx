"use client";
import * as XLSX from "xlsx";
import React, { useState, useMemo, useEffect } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
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
  DateFilter,
  InputField,
  SelectField,
} from "@/app/components/input-selectui";
import Modal from "react-modal";
import { toast } from 'react-toastify';
import { useRouter } from "next/navigation";
import HeadingClientMain from "@/app/components/heading";

const AllCorporatesList = ({ userdata }) => {
  const pageSize = 20;

  const [filters, setFilters] = useState({
    // Corporate model filters
    companyName: "",
    email: "",
    mobile: "",
    pincode: "",
    companyType: "",
    city: "",
    state: "",
    district: "",
    taluka: "",
    bankName: "",
    accountType: "",

    // Certificate filters
    approvalStatus: "",
    approvedBy: "",
    remarks: "",

    // Dates
    createdAtFrom: "",
    createdAtTo: "",
    updatedAtFrom: "",
    updatedAtTo: "",
  });

  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: pageSize,
  });
  const [currentCorporateId, setCurrentCorporateId] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState(null);
  const [remark, setRemark] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [selectedIssues, setSelectedIssues] = useState([]);

  const corporateFields = [
    'companyName','companyType','cinNumber','companyPan','gstNumber',
    'presentAddress','city','state','district','taluka','pincode',
    'bankName','bankAccountNumber','ifscCode','accountType','companyLogo',
    'employeeCount','contactPersonName','contactPersonRelation',
    'additionalEmail','emergencyContact'
  ];

  const issues = [
    ...corporateFields.map(f => `Incorrect ${f.charAt(0).toUpperCase() + f.slice(1)}`),
    'Missing Cancelled Cheque',
    'Missing Company Logo',
    'Document Quality Issues',
    'Invalid Registration Details',
    'Incomplete Application',
    'Verification Failed',
    'Other'
  ];

  const toggleIssue = (issue) => {
    setSelectedIssues(prev =>
      prev.includes(issue)
        ? prev.filter(i => i !== issue)
        : [...prev, issue]
    );
  };

  const openModal = (action, corporateId) => {
    setCurrentAction(action);
    setCurrentCorporateId(corporateId);
    setIsModalOpen(true);
    if (action === "reject") setSelectedIssues([]);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setRemark("");
    setSelectedIssues([]);
  };

  const handleSubmitRemark = async () => {
    if (currentAction === "reject" && remark.trim() === "" && selectedIssues.length === 0) {
      toast.error("Please provide a remark or select issues for rejection!");
      return;
    }

    try {
      setLoading(true);
      const fullRemark = selectedIssues.length > 0
        ? `${remark}\n\nIssues:\n- ${selectedIssues.join("\n- ")}`
        : remark;

      const response = await fetch(`/api/corporate/${currentCorporateId}/approvalstatus`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          approvalStatus: currentAction === "approve" ? "APPROVED" : "REJECTED",
          remark: fullRemark.trim() || null
        }),
      });

      if (!response.ok) throw new Error("Failed to update corporate status");

      await response.json();
      router.refresh();

      toast.success(`Corporate ${currentAction === "approve" ? "approved" : "rejected"} successfully!`);
      closeModal();
    } catch (error) {
      console.error("Error updating corporate:", error);
      toast.error(error.message || "Failed to update corporate status");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 300);
    return () => clearTimeout(handler);
  }, [filters]);

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  const filteredData = useMemo(() => {
    return userdata.filter((corp) => {
      const createdAtDate = corp.createdAt ? new Date(corp.createdAt) : null;
      const updatedAtDate = corp.updatedAt ? new Date(corp.updatedAt) : null;

      const createdAtFromDate = filters.createdAtFrom ? new Date(filters.createdAtFrom) : null;
      const createdAtToDate = filters.createdAtTo ? new Date(filters.createdAtTo) : null;
      const updatedAtFromDate = filters.updatedAtFrom ? new Date(filters.updatedAtFrom) : null;
      const updatedAtToDate = filters.updatedAtTo ? new Date(filters.updatedAtTo) : null;

      return (
        (!filters.companyName ||
          corp.companyName?.toLowerCase().includes(filters.companyName.toLowerCase())) &&
        (!filters.email ||
          corp.email?.toLowerCase().includes(filters.email.toLowerCase())) &&
        (!filters.mobile || corp.mobile?.includes(filters.mobile)) &&
        (!filters.pincode || corp.pincode === filters.pincode) &&
        (!filters.companyType ||
          (corp.companyType || "").toLowerCase() === filters.companyType.toLowerCase()) &&
        (!filters.city ||
          corp.city?.toLowerCase().includes(filters.city.toLowerCase())) &&
        (!filters.state ||
          corp.state?.toLowerCase().includes(filters.state.toLowerCase())) &&
        (!filters.district ||
          corp.district?.toLowerCase().includes(filters.district.toLowerCase())) &&
        (!filters.taluka ||
          corp.taluka?.toLowerCase().includes(filters.taluka.toLowerCase())) &&
        (!filters.bankName ||
          (corp.bankName || "").toLowerCase().includes(filters.bankName.toLowerCase())) &&
        (!filters.accountType ||
          (corp.accountType || "").toLowerCase() === filters.accountType.toLowerCase()) &&
        (!filters.approvalStatus ||
          corp.CorporateCertificate?.some(
            (cert) => cert.approvalStatus === filters.approvalStatus
          )) &&
        (!filters.approvedBy ||
          corp.CorporateCertificate?.approvedBy === filters.approvedBy) &&
        (!filters.remarks ||
          corp.CorporateCertificate?.remarks
            ?.toLowerCase()
            .includes(filters.remarks.toLowerCase())) &&
        (!createdAtFromDate || (createdAtDate && createdAtDate >= createdAtFromDate)) &&
        (!createdAtToDate || (createdAtDate && createdAtDate <= createdAtToDate)) &&
        (!updatedAtFromDate || (updatedAtDate && updatedAtDate >= updatedAtFromDate)) &&
        (!updatedAtToDate || (updatedAtDate && updatedAtDate <= updatedAtToDate))
      );
    });
  }, [filters, userdata]);

  const handleFilterChange = (field, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value,
    }));
  };

  const handleViewProfile = (id) => {
    window.location.href = `/superprofile/corporate/${id}`;
  };

  const columns = useMemo(
    () => [
      { accessorKey: "companyName", header: "Company Name" },
      { accessorKey: "email", header: "Email" },
      { accessorKey: "mobile", header: "Mobile" },
      { accessorKey: "companyType", header: "Company Type" },
      { accessorKey: "city", header: "City" },
      { accessorKey: "state", header: "State" },
      {
        accessorKey: "id",
        header: "Full Details",
        cell: ({ row }) => (
          <Button
            className="px-2 py-1 border border-blue-500 text-blue-500 font-semibold rounded-full hover:bg-blue-500 hover:text-white"
            onClick={() => handleViewProfile(row.getValue("id"))}
          >
            View Profile
          </Button>
        ),
      },
      {
        accessorKey: "CorporateCertificate.approvalStatus",
        header: "Approval Status",
        cell: ({ row }) => {
          const certs = row.original.CorporateCertificate;
          const status = certs?.length > 0
            ? (certs[0].approvalStatus || "PENDING").toLowerCase()
            : "pending";

          return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${status === "approved"
                ? "bg-emerald-100 text-emerald-800"
                : status === "rejected"
                  ? "bg-rose-100 text-rose-800"
                  : "bg-amber-100 text-amber-800"
              }`}>
              {status}
            </span>
          );
        },
      },
      {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const corporateId = row.original.id;

          return (
            <div className="flex space-x-2">
              <button
                onClick={() => openModal("approve", corporateId)}
                className="bg-green-500 text-white px-3 py-1 rounded text-sm"
              >
                Approve
              </button>
              <button
                onClick={() => openModal("reject", corporateId)}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm"
              >
                Reject
              </button>
            </div>
          );
        },
      }
    ],
    []
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    manualPagination: false,
  });

  const [showFilters, setShowFilters] = useState(false);
  const toggleFilters = () => setShowFilters((prev) => !prev);

  const handleExportToExcel = (rows) => {
    if (!Array.isArray(rows) || rows.length === 0) {
      console.error("No valid data available to export.");
      return;
    }
    try {
      const ws = XLSX.utils.json_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Corporate Data");
      XLSX.writeFile(wb, "Corporates.xlsx");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
    }
  };

  return (
    <div className="md:container shadow-xl mx-auto font-poppins">
      <div className="overflow-x-auto xs:px-2 min-[1000px]:px-0 min-[1100px]:px-[32px] container mx-auto min-[1000px]:w-[700px] min-[1100px]:w-[900px] xl:w-[1000px] xlg:w-[1200px] w-[350px] md:w-[700px] bg-white">
        <HeadingClientMain main={"All Corporates List"} sub={"Full Details"} />
        <div className="flex justify-end py-4 gap-2 items-end">
          <button
            onClick={toggleFilters}
            className="bg-blue-500 rounded-xl text-white px-4 py-2  focus:outline-none hover:bg-blue-600 transition"
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>

          <button
            onClick={() => handleExportToExcel(filteredData)}
            className="bg-green-400 rounded-xl text-white px-4 py-2  focus:outline-none hover:bg-green-400 transition"
          >
            Export to Excel
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <InputField label="Company" id="companyName" type="text" placeholder="Company" value={filters.companyName} onChange={handleFilterChange} />
            <InputField label="Email" id="email" type="email" placeholder="Email" value={filters.email} onChange={handleFilterChange} />
            <InputField label="Mobile" id="mobile" type="text" placeholder="Mobile Number" value={filters.mobile} onChange={handleFilterChange} />
            <InputField label="Pincode" id="pincode" type="text" placeholder="Pincode" value={filters.pincode} onChange={handleFilterChange} />

            <SelectField
              label="Company Type"
              id="companyType"
              value={filters.companyType}
              onChange={handleFilterChange}
              options={[
                { value: "", label: "All" },
                { value: "Public Limited", label: "Public Limited" },
                { value: "Private Limited", label: "Private Limited" },
                { value: "LLP", label: "LLP" },
                { value: "Partnership", label: "Partnership" },
                { value: "Sole Proprietorship", label: "Sole Proprietorship" },
                { value: "One Person Company", label: "One Person Company" },
              ]}
            />

            <InputField label="City" id="city" type="text" placeholder="City" value={filters.city} onChange={handleFilterChange} />
            <InputField label="State" id="state" type="text" placeholder="State" value={filters.state} onChange={handleFilterChange} />
            <InputField label="District" id="district" type="text" placeholder="District" value={filters.district} onChange={handleFilterChange} />
            <InputField label="Taluka" id="taluka" type="text" placeholder="Taluka" value={filters.taluka} onChange={handleFilterChange} />

            <InputField label="Bank Name" id="bankName" type="text" placeholder="Bank Name" value={filters.bankName} onChange={handleFilterChange} />
            <SelectField
              label="Account Type"
              id="accountType"
              value={filters.accountType}
              onChange={handleFilterChange}
              options={[
                { value: "", label: "All" },
                { value: "savings", label: "Savings" },
                { value: "current", label: "Current" },
              ]}
            />

            <SelectField
              label="Approval Status"
              id="approvalStatus"
              value={filters.approvalStatus}
              onChange={handleFilterChange}
              options={[
                { value: "", label: "All" },
                { value: "PENDING", label: "Pending" },
                { value: "APPROVED", label: "Approved" },
                { value: "REJECTED", label: "Rejected" },
              ]}
            />
            <DateFilter label="Created At From" id="createdAtFrom" selected={filters.createdAtFrom} onChange={handleFilterChange} />
            <DateFilter label="Created At To" id="createdAtTo" selected={filters.createdAtTo} onChange={handleFilterChange} />
          </div>
        )}

        <div className="overflow-x-auto bg-white p-4 rounded-xl shadow-lg">
          <div className="">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="bg-gray-100 hover:bg-gray-100">
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="border border-gray-200 py-4 px-6 text-left font-semibold text-gray-900 whitespace-nowrap">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
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
                  table.getRowModel().rows.map((row,index) => (
                    <TableRow key={row.id} className={`
                        transition-colors duration-150 ease-in-out
                        hover:bg-gray-50/50 
                        ${index % 2 === 0 ? "bg-white" : "bg-gray-50/20"}
                        border-[1px] border-gray-100
                      `}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="border-[1px] border-gray-200 py-4 px-6 text-sm whitespace-nowrap max-w-max hover:bg-gray-100">
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
                      className="h-24 text-center"
                    >
                      No results found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <div className="flex items-center justify-between py-4">
              <Button
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="rounded-full border-2 px-3 border-[#243460]">
                  Previous
                </span>
              </Button>
              <Button
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="rounded-full border-2 px-3 border-[#243460]">
                  Next
                </span>
              </Button>
              <span>
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </span>
            </div>
          </div>
        </div>

        <Modal
          ariaHideApp={false}
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Corporate Approval"
          className="bg-white p-6 rounded-xl mt-16 justify-center items-center shadow-lg max-w-xl h-[400px] overflow-y-auto mx-auto"
        >
          <h2 className="text-xl font-bold mb-4">
            {currentAction === "approve" 
              ? "Approve Corporate" 
              : "Reject Corporate"}
          </h2>

          <textarea
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            className="w-full p-2 border rounded mb-4"
            rows={5}
            placeholder={
              currentAction === "approve"
                ? "Enter approval remarks (optional)"
                : "Please specify the reason for rejection"
            }
          ></textarea>
          
          {currentAction === "reject" && (
            <div className="mb-4 max-h-60 overflow-y-auto">
              <h3 className="font-semibold mb-2">Select Issues:</h3>
              <div className="grid grid-cols-1 gap-2">
                {issues.map((issue) => (
                  <label key={issue} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedIssues.includes(issue)}
                      onChange={() => toggleIssue(issue)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>{issue}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={closeModal}
              className="bg-gray-400 text-white px-4 py-2 rounded mr-2"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitRemark}
              className={`${
                currentAction === "approve" ? "bg-green-500" : "bg-red-500"
              } text-white px-4 py-2 rounded`}
              disabled={loading}
            >
              {loading ? (
                "Processing..."
              ) : currentAction === "approve" ? (
                "Confirm Approval"
              ) : (
                "Confirm Rejection"
              )}
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default AllCorporatesList;