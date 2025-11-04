"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontalIcon,
  Eye,
  FileText,
  User,
  Loader2,
  MapPin,
  Briefcase,
  DollarSign,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ApplicationDetailsModal } from "./ApplicationDetailsModal";
import Image from "next/image";
import { InputField, DateFilter } from "@/app/components/input-selectui";
import { FaIndianRupeeSign } from 'react-icons/fa6';

export function ApplicationList({ employerId }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();
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

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleExportExcel = () => {
    const headers = ["Candidate Name", "Email", "Phone", "Job Title", "Company", "Applied Date"];
    const rows = filteredData.map((app) => [
      app?.seeker?.user?.fullName || "",
      app?.seeker?.user?.email || "",
      app?.seeker?.user?.phone || "",
      app?.job?.title || "",
      app?.job?.company?.name || "",
      new Date(app?.appliedAt).toLocaleDateString(),
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "applications.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Fetch Applications
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/jobaadhar/employer/application?employerId=${employerId}`);
        if (!res.ok) throw new Error("Failed to fetch applications");
        const data = await res.json();
        setApplications(data.applications || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (employerId) fetchApplications();
  }, [employerId]);

  const handleViewDetails = async (id) => {
    try {
      const res = await fetch(`/api/jobaadhar/employer/application/${id}`);
      const data = await res.json();
      setDetails(data);
      setOpen(true);
    } catch (err) {
      console.error("Failed to load details", err);
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      const response = await fetch(`/api/jobaadhar/employer/application/${applicationId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      );

      toast({
        title: "Status Updated",
        description: `Application status changed to ${newStatus}`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/jobaadhar/employer/application/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete application");
      setApplications((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredData = useMemo(() => {
    return applications.filter((app) => {
      const seeker = app.seeker;
      const job = app.job;
      const matchesName =
        !filters.name ||
        seeker?.user?.fullName?.toLowerCase().includes(filters.name.toLowerCase());
      const matchesJob =
        !filters.jobTitle ||
        job?.title?.toLowerCase().includes(filters.jobTitle.toLowerCase());
      const matchesCompany =
        !filters.company ||
        job?.company?.name?.toLowerCase().includes(filters.company.toLowerCase());

      const appliedDate = new Date(app.appliedAt);
      const matchesDate =
        !filters.startDate ||
        !filters.endDate ||
        (appliedDate >= new Date(filters.startDate) &&
          appliedDate <= new Date(filters.endDate));

      return matchesName && matchesJob && matchesCompany && matchesDate;
    });
  }, [applications, filters]);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-64 text-[#2b73ec]">
        <Loader2 className="h-8 w-8 animate-spin mb-2" />
        <p className="text-sm font-medium">Loading applications...</p>
      </div>
    );

  if (error)
    return <p className="text-red-600 text-center mt-4">Error: {error}</p>;

  return (
    <div className="md:container font-poppins mx-auto">
      <div className="overflow-x-auto xs:px-2 min-[1000px]:px-0 min-[1100px]:px-[32px] container mx-auto xl:w-[1100px] w-[350px] md:w-[700px] bg-white">

        {/* Header Buttons */}
        <div className="flex flex-wrap items-center justify-end gap-3 p-4 border-b border-gray-200">
          <Button
            onClick={() => setShowFilters((prev) => !prev)}
            className="hover:bg-blue-500 bg-blue-500 text-white rounded-xl"
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

        {/* Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border-b border-gray-100">
            <InputField label="Candidate Name" id="name" value={filters.name} onChange={handleFilterChange} />
            <InputField label="Job Title" id="jobTitle" value={filters.jobTitle} onChange={handleFilterChange} />
            <InputField label="Company Name" id="company" value={filters.company} onChange={handleFilterChange} />
            <DateFilter label="Start Date" id="startDate" selected={filters.startDate} onChange={handleFilterChange} />
            <DateFilter label="End Date" id="endDate" selected={filters.endDate} onChange={handleFilterChange} />
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto bg-white p-4 rounded-xl shadow-lg">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead>#</TableHead>
                <TableHead>Candidate</TableHead>
                <TableHead>Job Details</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applied Date</TableHead>
                <TableHead>Resume</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredData.length ? (
                filteredData.map((app, index) => (
                  <TableRow key={app.id} className="hover:bg-gray-50/50 border border-gray-100">
                    <TableCell>{index + 1}</TableCell>

                    {/* Candidate */}
                    <TableCell>
                      <div className="flex items-start gap-3">
                        <div>
                          <p className="font-semibold text-gray-900">{app.seeker?.user?.fullName}</p>
                          <p className="text-xs text-gray-500">{app.seeker?.user?.email}</p>
                          <p className="text-xs text-gray-500">{app.seeker?.user?.phone}</p>
                          {app.seeker?.location && (
                            <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                              <MapPin className="h-3 w-3" /> {app.seeker.location}
                            </p>
                          )}
                          {app.seeker?.skills?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {app.seeker.skills.slice(0, 3).map((s) => (
                                <Badge key={s} variant="secondary" className="text-xs">
                                  {s.name}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    {/* Job */}
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{app.job?.title}</p>
                        <p className="text-xs text-gray-500">{app.job?.company?.name}</p>
                        <div className="flex flex-wrap gap-2 mt-1 text-xs text-gray-500">
                          {app.job?.type && (
                            <span className="flex items-center gap-1">
                              <Briefcase className="h-3 w-3" /> {app.job.type}
                            </span>
                          )}
                          {app.job?.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" /> {app.job.location}
                            </span>
                          )}
                          {app.job?.salary && (
                            <span className="flex items-center gap-1">
                              <FaIndianRupeeSign className="h-3 w-3" /> {app.job.salary}
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge variant="secondary">{app.status}</Badge>
                    </TableCell>
                    <TableCell>{new Date(app.appliedAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {app.seeker?.resumeUrl ? (
                        <a href={app.seeker.resumeUrl} target="_blank" className="text-blue-600 hover:underline flex items-center gap-1">
                          <FileText className="h-4 w-4" /> View
                        </a>
                      ) : (
                        "No Resume"
                      )}
                    </TableCell>

                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost">
                            <MoreHorizontalIcon className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleViewDetails(app.id)}>
                            <Eye className="h-4 w-4 mr-2" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleStatusChange(app.id, "UNDER_REVIEW")}>
                            Mark as Reviewed
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(app.id, "SHORTLISTED")}>
                            Shortlist
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(app.id, "HIRED")}>
                            Hire
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(app.id, "REJECTED")}>
                            Reject
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleDelete(app.id)}>
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                    No applications found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <ApplicationDetailsModal open={open} setOpen={setOpen} details={details} />
    </div>
  );
}
