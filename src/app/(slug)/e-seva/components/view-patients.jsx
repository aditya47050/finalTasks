"use client";
import React, { useState, useMemo, useEffect } from "react";
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
import { InputField, SelectField } from "@/app/components/input-selectui";
import PatientPreViewWithTicking from "@/app/patient/dashboard/components/patientpreviewwithticking";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import TermsAndConditionOnSubmission from "@/app/components/termsandcondition";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loadRazorpayScript } from "@/lib/utils/loadrazorpay";
import ProfileUploadPage from "@/app/patient/dashboard/components/profile-upload";
import PatientActionsCell from "./esevafinalsubmit";
import { useRouter } from "next/navigation";

const ViewPatientsClient = ({ patientsData }) => {
    const router = useRouter()
  const pageSize = 10; // Number of rows per page
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    mobile: "",
    gender: "",
    registeredBy: "",
    registeredByName: "",
  });

  const [debouncedFilters, setDebouncedFilters] = useState(filters);
  const [open, setOpen] = useState(false); // State to manage dialog visibility
  const [isAgreed, setIsAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckboxChange = (event) => {
    setIsAgreed(event.target.checked);
  };

  const handleClose = () => {
    setOpen(false); // Close the dialog
  };
  // Debounce filter updates
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 300); // 300ms debounce delay
    return () => clearTimeout(handler);
  }, [filters]);

  const filteredData = useMemo(() => {
    return patientsData.filter((patient) => {
      const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
      const registeredBy = patient.subAdminId ? "subadmin" : "admin";
      const registeredByName = patient.subAdmin?.name || patient.Eseva?.incharge || "";
  
      return (
        (!debouncedFilters.name || fullName.includes(debouncedFilters.name.toLowerCase())) &&
        (!debouncedFilters.email || patient.email.toLowerCase().includes(debouncedFilters.email.toLowerCase())) &&
        (!debouncedFilters.mobile || patient.mobile.includes(debouncedFilters.mobile)) &&
        (!debouncedFilters.gender || patient.gender.toLowerCase() === debouncedFilters.gender.toLowerCase()) &&
        (!debouncedFilters.registeredBy || registeredBy === debouncedFilters.registeredBy) &&
        (!debouncedFilters.registeredByName || registeredByName.toLowerCase().includes(debouncedFilters.registeredByName.toLowerCase()))
      );
    });
  }, [debouncedFilters, patientsData]);
  

    const handleViewMedicalHistory = (patientId) => {
    // Navigate to the medical history page for this patient
    router.push(`/e-seva/dashboard/view-patients/${patientId}/medical-history`);
  };

  const columns = useMemo(
    () => [
      { accessorKey: "firstName", header: "First Name" },
      { accessorKey: "lastName", header: "Last Name" },
      { accessorKey: "email", header: "Email" },
      { accessorKey: "mobile", header: "Mobile" },
      { accessorKey: "gender", header: "Gender" },
      {
        accessorKey: "registeredBy",
        header: "Registered By",
        cell: ({ row }) => (row.original.subAdminId ? "Subadmin" : "Admin"),
      },
      {
        accessorKey: "registeredByName",
        header: "Registered By Name",
        cell: ({ row }) => {
          return row.original.subAdmin?.name || row.original.Eseva?.incharge;
        },
      },
      {
        accessorKey: "healthCardStatus",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original?.healthcard?.[0]?.approvalStatus || "N/A";
          return (
            <span
              className={
                status === "APPROVED"
                  ? "text-green-600 font-semibold"
                  : status === "REJECTED"
                    ? "text-red-600 font-semibold"
                    : "text-yellow-600 font-semibold"
              }
            >
              {status}
            </span>
          );
        },
      },
      {
        accessorKey: "id",
        header: "Actions",
        cell: ({ row }) => <PatientActionsCell user={row.original} />,
      },
      {
        accessorKey: "medicalHistory",
        header: "Medical History",
        cell: ({ row }) => (
          <Button
            onClick={() => handleViewMedicalHistory(row.original.id)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-xl text-sm"
          >
            Add History
          </Button>
        ),
      }

    ],
    []
  );

  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: pageSize,
  });

  const table = useReactTable({
    data: filteredData,
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

const handleFilterChange = (field, value) => {
  setFilters((prev) => ({
    ...prev,
    [field]: value,
  }));
};

  const [showFilters, setShowFilters] = useState(false);
  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  const handleSubmit = async (formData, rowId) => {
    setIsLoading(true);

    if (!userdata?.passportPhoto) {
      toast.error("Please go back and upload a profile photo.");
    }
    const scriptLoaded = await loadRazorpayScript();

    if (!scriptLoaded) {
      toast.error("Razorpay SDK failed to load. Are you online?");
      return;
    }

    try {
      const res = await fetch("/api/patient/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId: formData.id }),
      });

      const { order } = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Aarogya Aadhar",
        description: "Health Card Registration",
        order_id: order.id,
        handler: async function (response) {
          const verifyRes = await fetch("/api/patient/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              patientId: formData.id,
              amount: 100, // ₹100
            }),
          });

          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            toast("Payment Successful. Submitting form...");
            await submitPatientForm(formData);
          } else {
            toast("Payment verification failed.");
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.mobile,
        },
        theme: {
          color: "#243460",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      setIsLoading(false);
    } catch (err) {
      console.error("Payment failed:", err);
      toast("Payment process failed.");
      setIsLoading(false);
    }
  };

  const submitPatientForm = async (formData) => {
    const formPayload = new FormData();
    setIsLoading(true);
    try {
      const res = await fetch(`/api/patient/${formData.id}`, {
        method: "PUT",
        body: formPayload,
      });

      if (!res.ok) throw new Error("Failed to submit form");

      toast("Application Submitted successfully!");
      setIsLoading(false);
    } catch (err) {
      toast("Form submission failed.");
      setIsLoading(false);
    }
  };

  return (
    <div className="container shadow-xl mx-auto font-poppins h-screen">
      <div className="text-center py-4">
        <h1 className="text-2xl font-bold text-blue-500">Patients List</h1>
      </div>
      <div className="flex justify-end gap-2 mx-4 items-end">
        <button
          onClick={toggleFilters}
          className="bg-blue-500 rounded-xl text-white px-4 py-2 focus:outline-none hover:bg-blue-600 transition"
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {/* Filter Section */}
      {showFilters && (
  <div className="bg-white rounded-xl px-6 pb-6 mb-4">
    <h2 className="text-lg font-semibold mb-4 text-gray-700">
      Filter Data
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Name</label>
        <input
          type="text"
          value={filters.name}
          onChange={e => handleFilterChange("name", e.target.value)}
          placeholder="Search by Name"
          className="border rounded-xl px-3 py-2 focus:outline-none focus:ring"
        />
      </div>
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Email</label>
        <input
          type="text"
          value={filters.email}
          onChange={e => handleFilterChange("email", e.target.value)}
          placeholder="Search by Email"
          className="border rounded-xl px-3 py-2 focus:outline-none focus:ring"
        />
      </div>
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Mobile</label>
        <input
          type="text"
          value={filters.mobile}
          onChange={e => handleFilterChange("mobile", e.target.value)}
          placeholder="Search by Mobile"
          className="border rounded-xl px-3 py-2 focus:outline-none focus:ring"
        />
      </div>
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Gender</label>
        <select
          value={filters.gender}
          onChange={e => handleFilterChange("gender", e.target.value)}
          className="border rounded-xl px-3 py-2 focus:outline-none focus:ring"
        >
          <option value="">All Genders</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Registered By</label>
        <select
          value={filters.registeredBy}
          onChange={e => handleFilterChange("registeredBy", e.target.value)}
          className="border rounded-xl px-3 py-2 focus:outline-none focus:ring"
        >
          <option value="">All</option>
          <option value="admin">Admin</option>
          <option value="subadmin">Subadmin</option>
        </select>
      </div>
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Registered By Name</label>
        <input
          type="text"
          value={filters.registeredByName}
          onChange={e => handleFilterChange("registeredByName", e.target.value)}
          placeholder="Search by Registered By Name"
          className="border rounded-xl px-3 py-2 focus:outline-none focus:ring"
        />
      </div>
    </div>
  </div>
)}

      {/* Table Section */}
      <div className="overflow-x-auto container mx-auto min-[1100px]:w-[900px] xl:w-[1100px] xlg:w-[1200px] w-[350px] md:w-[700px] bg-white p-4 rounded-[15px] shadow-lg">
        <div className="mx-auto w-full">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
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
                table.getRowModel().rows.map((row, index) => (
                  <TableRow key={row.id}
                    className={`
                        transition-colors duration-150 ease-in-out
                        hover:bg-gray-50/50 
                        ${index % 2 === 0 ? "bg-white" : "bg-gray-50/20"}
                        border-[1px] border-gray-100
                      `}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="border-[1px] border-gray-200 py-1 px-2 text-center text-sm whitespace-nowrap max-w-max hover:bg-gray-100">
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
            <span>
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </span>
            <Button
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="rounded-full border-2 px-3 border-[#243460]">
                Next
              </span>
            </Button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPatientsClient;
