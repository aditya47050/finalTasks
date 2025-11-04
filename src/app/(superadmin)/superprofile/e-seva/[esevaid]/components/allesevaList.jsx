"use client";
import { useState, useMemo } from "react";
import * as XLSX from "xlsx";
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
import Image from "next/image";
import Modal from "react-modal";
import { toast } from "react-toastify";
import HeadingClientMain from "@/app/components/heading";

const AllEsevaList = ({ esevaData, states, dist, taluka }) => {
  const pageSize = 20;

  const [esevaList, setEsevaList] = useState(esevaData);
  const [selectedIssues, setSelectedIssues] = useState([]);

  const [filters, setFilters] = useState({
    email: "",
    mobile: "",
    pincode: "",
    name: "",
    createdAtFrom: "",
    createdAtTo: "",
    updatedAtFrom: "",
    updatedAtTo: "",
    incharge: "",
    city: "",
    state: "all",
    district: "all",
    taluka: "all",
    status: "all",
    esevacode: "",
    alternatemobile: "",
    role: "all", // Add role filter
  });

  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: pageSize,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState(null);
  const [currentEsevaId, setCurrentEsevaId] = useState(null);
  const [remark, setRemark] = useState("");
  const [loading, setLoading] = useState(false);

  const generateEsevaIssues = () => {
    const documentIssues = [
      "Missing Shop Act Document",
      "Invalid Shop Act License",
      "Missing Registration Certificate",
      "Invalid Registration Certificate",
      "Missing Address Proof Document",
      "Invalid Address Proof",
      "Missing Incharge Aadhar Document",
      "Invalid Incharge Aadhar Card",
      "Missing Incharge PAN Document",
      "Invalid Incharge PAN Card",
      "Document Quality Issues",
      "Expired Documents",
    ];

    const personalInfoIssues = [
      "Incorrect Center Name",
      "Invalid Address Details",
      "Incorrect District Information",
      "Invalid State Information",
      "Incorrect Pincode",
      "Invalid Mobile Number",
      "Invalid Email Address",
      "Incorrect Incharge Name",
      "Invalid Incharge Details",
    ];

    const bankingIssues = [
      "Missing Banking Details",
      "Invalid Bank Account Number",
      "Incorrect IFSC Code",
      "Missing Cancelled Cheque",
      "Invalid Account Type",
      "Banking Information Mismatch",
    ];

    const verificationIssues = [
      "Location Verification Failed",
      "Background Check Failed",
      "Reference Verification Failed",
      "Physical Verification Pending",
      "Compliance Issues",
    ];

    const generalIssues = [
      "Incomplete Application",
      "Information Mismatch",
      "Duplicate Application",
      "Other",
    ];

    return [
      ...documentIssues,
      ...personalInfoIssues,
      ...bankingIssues,
      ...verificationIssues,
      ...generalIssues,
    ];
  };

  const issues = generateEsevaIssues();

  const toggleIssue = (issue) => {
    setSelectedIssues((prev) =>
      prev.includes(issue) ? prev.filter((i) => i !== issue) : [...prev, issue]
    );
  };

  const openModal = (action, esevaId) => {
    setCurrentAction(action);
    setCurrentEsevaId(esevaId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setRemark("");
    setSelectedIssues([]);
  };

  const handleSubmitRemark = async () => {
    if (
      currentAction === "reject" &&
      remark.trim() === "" &&
      selectedIssues.length === 0
    ) {
      toast.error("Please provide a remark or select issues for rejection!");
      return;
    }

    try {
      setLoading(true);
      const fullRemark =
        selectedIssues.length > 0
          ? `${remark}\n\nIssues:\n- ${selectedIssues.join("\n- ")}`
          : remark;

      const response = await fetch(`/api/e-seva/${currentEsevaId}/approval`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: currentAction,
          remark: fullRemark.trim() || null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update E-seva center status");
      }

      const result = await response.json();

      setEsevaList((prevData) =>
        prevData.map((eseva) =>
          eseva.id === currentEsevaId
            ? {
                ...eseva,
                status: result.data.status,
              }
            : eseva
        )
      );

      toast.success(
        `E-seva center ${
          currentAction === "approve" ? "approved" : "rejected"
        } successfully!`
      );
      closeModal();
    } catch (error) {
      console.error("Error updating E-seva center:", error);
      toast.error(error.message || "Failed to update E-seva center status");
    } finally {
      setLoading(false);
    }
  };

  const filteredData = useMemo(() => {
    return esevaList.filter((eseva) => {
      const createdAtDate = eseva.createdAt ? new Date(eseva.createdAt) : null;
      const updatedAtDate = eseva.updatedAt ? new Date(eseva.updatedAt) : null;
      const createdAtFromDate = filters.createdAtFrom
        ? new Date(filters.createdAtFrom)
        : null;
      const createdAtToDate = filters.createdAtTo
        ? new Date(filters.createdAtTo)
        : null;
      const updatedAtFromDate = filters.updatedAtFrom
        ? new Date(filters.updatedAtFrom)
        : null;
      const updatedAtToDate = filters.updatedAtTo
        ? new Date(filters.updatedAtTo)
        : null;

      return (
        (!filters.email ||
          (eseva.email &&
            eseva.email.toLowerCase().includes(filters.email.toLowerCase()))) &&
        (!filters.mobile || eseva.mobile.includes(filters.mobile)) &&
        (!filters.pincode || eseva.pincode === filters.pincode) &&
        (!filters.name ||
          (eseva.name &&
            eseva.name.toLowerCase().includes(filters.name.toLowerCase()))) &&
        (!createdAtFromDate ||
          (createdAtDate && createdAtDate >= createdAtFromDate)) &&
        (!createdAtToDate ||
          (createdAtDate && createdAtDate <= createdAtToDate)) &&
        (!updatedAtFromDate ||
          (updatedAtDate && updatedAtDate >= updatedAtFromDate)) &&
        (!updatedAtToDate ||
          (updatedAtDate && updatedAtDate <= updatedAtToDate)) &&
        (!filters.incharge ||
          (eseva.incharge &&
            eseva.incharge
              .toLowerCase()
              .includes(filters.incharge.toLowerCase()))) &&
        (filters.state === "all" ||
          (eseva.state &&
            eseva.state.toLowerCase().includes(filters.state.toLowerCase()))) &&
        (filters.district === "all" ||
          (eseva.district &&
            eseva.district
              .toLowerCase()
              .includes(filters.district.toLowerCase()))) &&
        (filters.taluka === "all" ||
          (eseva.taluka &&
            eseva.taluka
              .toLowerCase()
              .includes(filters.taluka.toLowerCase()))) &&
        (filters.status === "all" ||
          eseva.status?.toLowerCase() === filters.status.toLowerCase()) &&
        (!filters.esevacode ||
          (eseva.esevacode &&
            eseva.esevacode
              .toLowerCase()
              .includes(filters.esevacode.toLowerCase()))) &&
        (!filters.alternatemobile ||
          eseva.alternatemobile?.includes(filters.alternatemobile)) &&
        (filters.role === "all" ||
          eseva.role?.toLowerCase() === filters.role.toLowerCase()) // Add role filter logic
      );
    });
  }, [filters, esevaList]);

  const handleFilterChange = (field, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value,
    }));
  };

  const handleViewProfile = (id) => {
    window.location.href = `/superprofile/e-seva/${id}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "logo",
        header: "Logo",
        cell: ({ row }) => (
          <div className="w-12 h-12 overflow-hidden rounded-full">
            <Image
              src={row.original.logo || "/placeholder.svg?height=48&width=48"}
              alt="E-seva Logo"
              width={48}
              height={48}
              className="object-cover"
            />
          </div>
        ),
      },
      {
        accessorKey: "name",
        header: "Center Name",
        cell: ({ row }) => (
          <div>
            <p className="font-medium">{row.original.name || "N/A"}</p>
            <p className="text-xs text-muted-foreground">
              {row.original.esevacode || "No Code"}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "incharge",
        header: "Incharge",
        cell: ({ row }) => (
          <div>
            <p className="font-medium">{row.original.incharge || "N/A"}</p>
            <p className="text-xs text-muted-foreground">
              {row.original.mobile}
            </p>
          </div>
        ),
      },
      { accessorKey: "email", header: "Email" },
      {
        accessorKey: "address",
        header: "Location",
        cell: ({ row }) => (
          <div>
            <p>{row.original.district}</p>
            <p className="text-xs text-muted-foreground">
              {row.original.state} - {row.original.pincode}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "patients",
        header: "Patients",
        cell: ({ row }) => (
          <div className="text-center">
            <p className="font-medium">{row.original.patients?.length || 0}</p>
            <p className="text-xs text-muted-foreground">registered</p>
          </div>
        ),
      },
      {
        accessorKey: "subAdmins",
        header: "SubAdmins",
        cell: ({ row }) => (
          <div className="text-center">
            <p className="font-medium">{row.original.subAdmins?.length || 0}</p>
            <p className="text-xs text-muted-foreground">SubAdmin</p>
          </div>
        ),
      },
      {
        accessorKey: "viewSubAdmins",
        header: "SubAdmin Profiles",
        cell: ({ row }) => (
          <Button
            className="px-2 py-1 border border-purple-500 text-purple-500 font-semibold rounded-full hover:bg-purple-500 hover:text-white"
            onClick={() => {
              // You can either redirect or open a modal
              window.location.href = `/superprofile/e-seva/${row.original.id}/subadmin`;
            }}
          >
            View SubAdmins
          </Button>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => formatDate(row.original.createdAt),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = (row.getValue("status") || "pending").toLowerCase();
          return (
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                status === "approved"
                  ? "bg-emerald-100 text-emerald-800"
                  : status === "rejected"
                  ? "bg-rose-100 text-rose-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {status}
            </span>
          );
        },
      },
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
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const status = row.original.status?.toLowerCase();

          return (
            <div className="flex space-x-2">
              <button
                onClick={() => openModal("approve", row.original.id)}
                className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                disabled={status === "approved"}
              >
                {status === "approved" ? "Approved" : "Approve"}
              </button>

              {status !== "rejected" && (
                <button
                  onClick={() => openModal("reject", row.original.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                  disabled={status === "rejected"}
                >
                  {status === "rejected" ? "Rejected" : "Reject"}
                </button>
              )}
            </div>
          );
        },
      },
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

  const handleExportToExcel = (esevaData) => {
    if (!Array.isArray(esevaData) || esevaData.length === 0) {
      console.error("No valid data available to export.");
      return;
    }

    try {
      const ws = XLSX.utils.json_to_sheet(esevaData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "E-seva Data");
      XLSX.writeFile(wb, "EsevaData.xlsx");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
    }
  };

  const [showFilters, setShowFilters] = useState(false);
  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  return (
    <div className="md:container shadow-xl mx-auto font-poppins">
      <div className="overflow-x-auto xs:px-2 min-[1000px]:px-0 min-[1100px]:px-[32px] container mx-auto min-[1000px]:w-[700px] min-[1100px]:w-[900px] xl:w-[1000px] xlg:w-[1200px] w-[350px] md:w-[700px] bg-white">
        <HeadingClientMain
          main={"All E-seva Centers List"}
          sub={"Full Details"}
        />
        <div className="flex justify-end gap-2 py-4 items-end">
          <button
            onClick={toggleFilters}
            className="bg-blue-500 rounded-xl text-white px-4 py-2 focus:outline-none hover:bg-blue-600 transition"
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>

          <button
            onClick={() => handleExportToExcel(filteredData)}
            className="bg-green-400 rounded-xl text-white px-4 py-2 focus:outline-none hover:bg-green-400 transition"
          >
            Export to Excel
          </button>
        </div>
        {showFilters && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
            <InputField
              label="Email"
              id="email"
              type="email"
              placeholder="Email"
              value={filters.email}
              onChange={handleFilterChange}
            />
            <InputField
              label="Mobile"
              id="mobile"
              type="text"
              placeholder="Mobile Number"
              value={filters.mobile}
              onChange={handleFilterChange}
            />
            <InputField
              label="Pincode"
              id="pincode"
              type="text"
              placeholder="Pincode"
              value={filters.pincode}
              onChange={handleFilterChange}
            />
            <InputField
              label="Center Name"
              id="name"
              type="text"
              placeholder="Center Name"
              value={filters.name}
              onChange={handleFilterChange}
            />
            <DateFilter
              label="Created At From"
              id="createdAtFrom"
              selected={filters.createdAtFrom}
              onChange={handleFilterChange}
            />
            <DateFilter
              label="Created At To"
              id="createdAtTo"
              selected={filters.createdAtTo}
              onChange={handleFilterChange}
            />
            <InputField
              label="Incharge Name"
              id="incharge"
              type="text"
              placeholder="Incharge Name"
              value={filters.incharge}
              onChange={handleFilterChange}
            />
            <InputField
              label="E-seva Code"
              id="esevacode"
              type="text"
              placeholder="E-seva Code"
              value={filters.esevacode}
              onChange={handleFilterChange}
            />
            <SelectField
              label="State"
              id="state"
              options={[
                { label: "All", value: "all" },
                ...states.map((state) => ({
                  label: state.stateName,
                  value: state.stateName,
                })),
              ]}
              value={filters.state}
              onChange={handleFilterChange}
            />
            <SelectField
              label="District"
              id="district"
              options={[
                { label: "All", value: "all" },
                ...dist.map((district) => ({
                  label: district.district,
                  value: district.district,
                })),
              ]}
              value={filters.district}
              onChange={handleFilterChange}
            />
            <SelectField
              label="Status"
              id="status"
              options={[
                { label: "All", value: "all" },
                { label: "Pending", value: "pending" },
                { label: "Approved", value: "approved" },
                { label: "Rejected", value: "rejected" },
              ]}
              value={filters.status}
              onChange={handleFilterChange}
            />
            <SelectField
              label="Role"
              id="role"
              options={[
                { label: "All", value: "all" },
                { label: "Eseva", value: "Eseva" },
                { label: "Asha", value: "Asha" },
              ]}
              value={filters.role}
              onChange={handleFilterChange}
            />
            <InputField
              label="Alternate Mobile"
              id="alternatemobile"
              type="text"
              placeholder="Alternate Mobile"
              value={filters.alternatemobile}
              onChange={handleFilterChange}
            />
          </div>
        )}
        {/* Table */}
        <div className="overflow-x-auto bg-white p-4 rounded-xl shadow-lg">
          <div className="">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className="bg-gray-100 hover:bg-gray-100"
                  >
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="border border-gray-200 py-4 px-6 text-left font-semibold text-gray-900 whitespace-nowrap"
                      >
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
                  table.getRowModel().rows.map((row, index) => (
                    <TableRow
                      key={row.id}
                      className={`
                        transition-colors duration-150 ease-in-out
                        hover:bg-gray-50/50 
                        ${index % 2 === 0 ? "bg-white" : "bg-gray-50/20"}
                        border-[1px] border-gray-100
                      `}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className="border-[1px] border-gray-200 py-4 px-6 text-sm whitespace-nowrap max-w-max hover:bg-gray-100"
                        >
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

        {/* Approval Modal */}
        <Modal
          ariaHideApp={false}
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="E-seva Approval"
          className="bg-white p-6 rounded-xl mt-16 justify-center items-center shadow-lg max-w-xl h-[500px] overflow-y-auto mx-auto"
        >
          <h2 className="text-xl font-bold mb-4">
            {currentAction === "approve"
              ? "Approve E-seva Center"
              : "Reject E-seva Center"}
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
                    <span className="text-sm">{issue}</span>
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
              {loading
                ? "Processing..."
                : currentAction === "approve"
                ? "Confirm Approval"
                : "Confirm Rejection"}
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default AllEsevaList;
