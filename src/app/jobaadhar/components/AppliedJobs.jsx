"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Building2, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { FaRupeeSign } from "react-icons/fa";

const STATUS_COLORS = {
  APPLIED: "bg-blue-100 text-blue-500",
  UNDER_REVIEW: "bg-yellow-100 text-yellow-600",
  SHORTLISTED: "bg-green-100 text-green-600",
  REJECTED: "bg-red-100 text-red-600",
  HIRED: "bg-green-200 text-green-800",
  INTERVIEW_SCHEDULED: "bg-purple-100 text-purple-600",
  INTERVIEWED: "bg-indigo-100 text-indigo-600",
  OFFER_EXTENDED: "bg-teal-100 text-teal-600",
};

const SORT_OPTIONS = [
  { label: "Most Recent", value: "recent" },
  { label: "Oldest", value: "oldest" },
  { label: "Status", value: "status" },
];

const AppliedJobs = ({ seekerId }) => {
  const [applications, setApplications] = useState([]);
  const [displayedApps, setDisplayedApps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState("recent");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const { toast } = useToast();

  useEffect(() => {
    fetchAppliedJobs();
  }, []);

  useEffect(() => {
    applySortAndPagination();
  }, [applications, sortBy, page]);

  const fetchAppliedJobs = async () => {
    try {
      const res = await fetch(`/api/jobaadhar/job-seeker/applied-jobs?seekerId=${seekerId}`);
      const data = await res.json();
      setApplications(data.applications || []);
    } catch (err) {
      toast({ title: "Error", description: "Failed to load applied jobs", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const applySortAndPagination = () => {
    let sorted = [...applications];

    if (sortBy === "recent") {
      sorted.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
    } else if (sortBy === "oldest") {
      sorted.sort((a, b) => new Date(a.appliedAt) - new Date(b.appliedAt));
    } else if (sortBy === "status") {
      sorted.sort((a, b) => a.status.localeCompare(b.status));
    }

    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    setDisplayedApps(sorted.slice(start, end));
  };

  const totalPages = Math.ceil(applications.length / pageSize);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const applied = new Date(dateString);
    const diffInDays = Math.floor((now - applied) / (1000 * 60 * 60 * 24));
    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "1 day ago";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  if (isLoading) return <LoadingPlaceholder />;

  return (
    <div className="min-h-screen py-10">
      <div className="container mx-auto px-4 lg:px-10 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center space-y-2 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-blue-500 text-balance">Applied Jobs</h1>
            <p className="text-gray-500">
              {applications.length} {applications.length === 1 ? "job" : "jobs"} applied
            </p>
          </div>

          {/* Sort */}
          <div className="flex gap-2 items-center">
            <label className="text-gray-600 text-sm">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {applications.length === 0 ? (
          <Card className="p-12 text-center bg-card border-gray-200">
            <Building2 className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-blue-500 mb-2">No applications yet</h3>
            <p className="text-gray-500">Apply to jobs to see them listed here.</p>
          </Card>
        ) : (
          <>
            {/* Jobs Grid */}
            <div className="grid gap-6 lg:grid-cols-4 md:grid-cols-2">
              {displayedApps.map((app) => (
                <Card
                  key={app.id}
                  className="p-6 space-y-4 bg-white border border-gray-300 rounded-xl hover:shadow-lg transition-all duration-300 ease-in-out"
                >
                  {/* Header */}
                  <div className="flex flex-col items-start gap-3">
                    {app.job.company.logoUrl ? (
                      <img src={app.job.company.logoUrl} className="h-12 w-auto object-cover rounded-lg" />
                    ) : (
                      <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-blue-300" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-blue-500 text-balance">{app.job.title}</h3>
                      <p className="text-xs text-gray-500">{app.job.company.name}</p>
                    </div>
                  </div>

                  {/* Job Details */}
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <MapPin className="h-4 w-4" /> {app.job.location}
                    </div>
                    <div className="flex items-center gap-4">
                      <FaRupeeSign className="h-4 w-4" /> {app.job.salary}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {app.job.skills.slice(0, 2).map((skill) => (
                        <Badge key={skill.id} variant="secondary" className="text-xs bg-blue-100 text-blue-500">
                          {skill.skill.name}
                        </Badge>
                      ))}
                      {app.job.skills.length > 2 && (
                        <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-500">
                          +{app.job.skills.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t border-gray-200">
                    <div className="flex flex-nowrap items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span className="whitespace-nowrap">Applied {getTimeAgo(app.appliedAt)}</span>
                    </div>
                    <Badge className={`text-[10px] whitespace-nowrap ${STATUS_COLORS[app.status]}`}>{app.status.replaceAll("_", " ")}</Badge>
                  </div>

                  {/* Action */}
                  <Link href={`/jobaadhar/jobs/${app.jobId}`} className="block mt-2">
                    <button className="w-full bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 transition">
                      View Job
                    </button>
                  </Link>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-2 mt-6">
              <button
                className="px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 disabled:opacity-50"
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
              >
                Prev
              </button>
              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded">
                {page} / {totalPages}
              </span>
              <button
                className="px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 disabled:opacity-50"
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const LoadingPlaceholder = () => (
  <div className="min-h-screen py-10">
    <div className="container mx-auto px-4 lg:px-10 space-y-8 animate-pulse">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="p-6 space-y-4 bg-blue-50 rounded-xl shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-blue-100 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-blue-100 rounded w-3/4" />
                <div className="h-3 bg-blue-100 rounded w-1/2" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-blue-100 rounded w-1/2" />
              <div className="h-3 bg-blue-100 rounded w-1/3" />
              <div className="h-3 bg-blue-100 rounded w-2/3" />
            </div>
            <div className="flex justify-between items-center mt-2">
              <div className="h-3 bg-blue-100 rounded w-1/4" />
              <div className="h-3 bg-blue-100 rounded w-1/6" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default AppliedJobs;
