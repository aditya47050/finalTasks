"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
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
import { Loader2, Eye, MoreHorizontalIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { ApplicationDetailsModal } from "./ApplicationDetailsModal";
import HeadingClientMain from "@/app/components/heading";
import { InputField, DateFilter } from "@/app/components/input-selectui";

export default function ShortlistCandidateList({ employerId }) {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState(null);

  // Filters
  const [filters, setFilters] = useState({
    name: "",
    jobTitle: "",
    company: "",
    startDate: null,
    endDate: null,
  });
  const [showFilters, setShowFilters] = useState(false);

const handleExportExcel = () => {
  // Convert filteredData to CSV format
  const headers = ["Candidate Name", "Email", "Phone", "Job Title", "Company", "Applied Date"];
  const rows = filteredData.map((cand) => [
    cand?.seeker?.user?.fullName || "",
    cand?.seeker?.user?.email || "",
    cand?.seeker?.user?.phone || "",
    cand?.job?.title || "",
    cand?.job?.company?.name || "",
    new Date(cand?.appliedAt).toLocaleDateString(),
  ]);

  const csvContent =
    [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "shortlisted_candidates.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    const fetchShortlisted = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/jobaadhar/employer/shortlist?employerId=${employerId}`);
        if (!res.ok) throw new Error("Failed to fetch shortlisted candidates");
        const data = await res.json();
        setCandidates(data.shortlisted || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (employerId) fetchShortlisted();
  }, [employerId]);

  const handleViewDetails = async (id) => {
    try {
      const res = await fetch(`/api/jobaadhar/employer/application/${id}`);
      if (!res.ok) throw new Error("Failed to fetch details");
      const data = await res.json();
      setDetails(data);
      setOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/jobaadhar/employer/application/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      setCandidates((prev) =>
        prev.map((cand) => (cand.id === id ? { ...cand, status: newStatus } : cand))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/jobaadhar/employer/application/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete candidate");
      setCandidates((prev) => prev.filter((cand) => cand.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Filtered Data
  const filteredData = useMemo(() => {
    return candidates.filter((cand) => {
      const seeker = cand.seeker;
      const job = cand.job;
      const matchesName =
        !filters.name ||
        seeker?.user?.fullName?.toLowerCase().includes(filters.name.toLowerCase());
      const matchesJob =
        !filters.jobTitle ||
        job?.title?.toLowerCase().includes(filters.jobTitle.toLowerCase());
      const matchesCompany =
        !filters.company ||
        job?.company?.name?.toLowerCase().includes(filters.company.toLowerCase());

      const appliedDate = new Date(cand.appliedAt);
      const matchesDate =
        !filters.startDate ||
        !filters.endDate ||
        (appliedDate >= new Date(filters.startDate) &&
          appliedDate <= new Date(filters.endDate));

      return matchesName && matchesJob && matchesCompany && matchesDate;
    });
  }, [candidates, filters]);

  const columns = [
    {
      header: "S.No",
      accessorKey: "serialNo",
      cell: (info) => info.row.index + 1,
    },
    {
      header: "Candidate",
      cell: ({ row }) => {
        const seeker = row.original.seeker;
        const skills = seeker?.skills?.map((s) => s.skill?.name).join(", ");
        return (
          <div className="flex items-start gap-3">
            <div>
              <p className="font-semibold">{seeker?.user?.fullName}</p>
              <p className="text-xs text-gray-500 whitespace-normal">{seeker?.user?.email}</p>
              <p className="text-xs text-gray-500">{seeker?.user?.phone}</p>
              <p className="text-xs text-gray-600">{seeker?.bio}</p>
              {skills && (
                <p className="whitespace-normal text-xs text-blue-600">Skills: {skills}</p>
              )}
            </div>
          </div>
        );
      },
    },
    {
      header: "Job Details",
      cell: ({ row }) => {
        const job = row.original.job;
        const jobSkills = job?.skills?.map((s) => s.skill?.name).join(", ");
        return (
          <div>
            <p className="font-semibold">{job?.title}</p>
            <p className="text-xs text-gray-500">{job?.location}</p>
            <p className="text-xs text-gray-500">Mode: {job?.workMode}</p>
            <p className="text-xs text-gray-500">Exp: {job?.exp}</p>
            <p className="text-xs text-gray-500">Salary: ₹{job?.salary}</p>
            {jobSkills && (
              <p className="text-xs text-blue-600">Req: {jobSkills}</p>
            )}
          </div>
        );
      },
    },
    {
      header: "Company",
      cell: ({ row }) => {
        const company = row.original.job?.company;
        return (
          <div>
            <p className="font-semibold">{company?.name}</p>
            <p className="text-xs text-gray-500">
              Founded: {company?.founded || "N/A"}
            </p>
            <a
              href={company?.logoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:underline"
            >
              View Logo
            </a>
          </div>
        );
      },
    },
    {
      header: "Dates",
      cell: ({ row }) => (
        <div className="text-sm">
          <p>Applied: {new Date(row.original.appliedAt).toLocaleDateString()}</p>
          <p>Updated: {new Date(row.original.updatedAt).toLocaleDateString()}</p>
        </div>
      ),
    },
    {
      header: "Resume",
      cell: ({ row }) =>
        row.original.seeker?.resumeUrl ? (
          <a
            href={row.original.seeker.resumeUrl}
            target="_blank"
            className="text-blue-600 hover:underline"
          >
            View Resume
          </a>
        ) : (
          "No Resume"
        ),
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost">
              <MoreHorizontalIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handleViewDetails(row.original.id)}>
              <Eye className="h-4 w-4 mr-2" /> View Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleStatusChange(row.original.id, "INTERVIEWED")}>
              Mark Interviewed
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange(row.original.id, "HIRED")}>
              Mark Hired
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange(row.original.id, "REJECTED")}>
              Reject
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleDelete(row.original.id)}>
              Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { pagination },
  });

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-64 text-[#2b73ec]">
        <Loader2 className="h-8 w-8 animate-spin mb-2" />
        <p className="text-sm font-medium">Loading shortlisted candidates...</p>
      </div>
    );

  if (error)
    return <p className="text-red-600 text-center mt-4">Error: {error}</p>;

  return (
  <div className="md:container font-poppins mx-auto">
    <div className="overflow-x-auto xs:px-2 min-[1000px]:px-0 min-[1100px]:px-[32px] container mx-auto min-[1000px]:w-[700px] min-[1100px]:w-[900px] xl:w-[1100px] w-[350px] md:w-[700px] bg-white">

      {/* Header Buttons */}
      <div className="flex flex-wrap items-center justify-end gap-3 p-4 border-b border-gray-200">
        <div className="flex gap-3">
          <Button
            onClick={() => setShowFilters((prev) => !prev)}
            className=" hover:bg-blue-500 bg-blue-500 text-white rounded-xl"
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
          <Button
            variant="default"
            onClick={handleExportExcel}
            className="bg-green-600 hover:bg-green-700 text-white rounded-xl"
          >
            Export Excel
          </Button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border-b border-gray-100">
          <InputField
            label="Candidate Name"
            id="name"
            placeholder="Enter name"
            value={filters.name}
            onChange={handleFilterChange}
          />
          <InputField
            label="Job Title"
            id="jobTitle"
            placeholder="Enter job title"
            value={filters.jobTitle}
            onChange={handleFilterChange}
          />
          <InputField
            label="Company Name"
            id="company"
            placeholder="Enter company"
            value={filters.company}
            onChange={handleFilterChange}
          />
          <DateFilter
            label="Start Date"
            id="startDate"
            selected={filters.startDate}
            onChange={handleFilterChange}
          />
          <DateFilter
            label="End Date"
            id="endDate"
            selected={filters.endDate}
            onChange={handleFilterChange}
          />
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto bg-white p-4 rounded-xl shadow-lg">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-gray-100">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="border border-gray-200 py-4 px-6 text-left font-semibold text-gray-900 whitespace-nowrap"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
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
                  className={`transition-colors duration-150 ease-in-out hover:bg-gray-50/50 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50/20"
                  } border-[1px] border-gray-100 overflow-hidden`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="border-[1px] border-gray-200 py-4 px-6 overflow-hidden text-sm whitespace-nowrap max-w-max hover:bg-gray-100"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-6 text-gray-500">
                  No shortlisted candidates found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between py-4">
          <Button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Previous
          </Button>
          <span>
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <Button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>

    <ApplicationDetailsModal open={open} setOpen={setOpen} details={details} />
  </div>
);

}
