"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontalIcon } from "lucide-react"
import { Dialog,DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { JobCreateForm } from "./job-create-form"

export function JobList({ employer }) {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewJob, setViewJob] = useState(null)
  const [editJob, setEditJob] = useState(null)

  // Fetch jobs from backend
  const fetchJobs = async () => {
    try {
      const res = await fetch(`/api/jobaadhar/employer/jobs?employerId=${employer.id}`)
      if (!res.ok) throw new Error("Failed to fetch jobs")
      const data = await res.json()
      setJobs(data)
      setLoading(false)
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  // Update job status
  const handleStatusChange = async (id, newStatus) => {
  try {
    const res = await fetch(`/api/jobaadhar/employer/jobs`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: newStatus }),
    });
    if (!res.ok) throw new Error("Failed to update status");
    const updatedJob = await res.json();
    setJobs((prevJobs) =>
      prevJobs.map((job) => (job.id === id ? { ...job, status: updatedJob.status } : job))
    );
  } catch (error) {
    console.error(error);
  }
};


  // Delete a job
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/jobaadhar/employer/jobs/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete job")
      setJobs((prevJobs) => prevJobs.filter((job) => job.id !== id))
    } catch (error) {
      console.error(error)
    }
  }
  

  if (loading) return <p>Loading jobs...</p>

  return (
    <div className="overflow-x-auto bg-white p-4 rounded-xl shadow-lg">
      {/* Create Job Button */}
      <div className="flex justify-end mb-4">
        <Dialog>
          <Button asChild className="bg-blue-500 text-white rounded-xl hover:bg-blue-600">
            <DialogTrigger>Create Job</DialogTrigger>
          </Button>
          <DialogContent className="max-w-xl h-[80vh] bg-white">
            <DialogHeader>
              <DialogTitle className="text-center">Create New Job</DialogTitle>
            </DialogHeader>
            <JobCreateForm
            
              employerId={employer.id}
              companyId={employer.companyId}
              onJobCreated={fetchJobs}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Jobs Table */}
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-100 hover:bg-gray-100">
            <TableHead>Job Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Salary</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Applications</TableHead>
            <TableHead>Date Posted</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.map((job, index) => (
            <TableRow key={job.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50/20"}>
              <TableCell>{job.title}</TableCell>
              <TableCell>{job.employmentType || "N/A"}</TableCell>
              <TableCell>{job.location || "N/A"}</TableCell>
              <TableCell>{job.salary || "N/A"}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    job.status === "active"
                      ? "default"
                      : job.status === "inactive"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {job.status}
                </Badge>
              </TableCell>
              <TableCell>{job.applications?.length || 0}</TableCell>
              <TableCell>{new Date(job.postedAt).toLocaleDateString()}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button aria-haspopup="true" size="icon" variant="ghost">
                      <MoreHorizontalIcon />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white rounded-xl shadow-lg" align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => setViewJob(job)}>View</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setEditJob(job)}>Edit</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleStatusChange(job.id, "active")}>
                      Mark as Active
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange(job.id, "inactive")}>
                      Mark as Inactive
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange(job.id, "closed")}>
                      Mark as Closed
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleDelete(job.id)}>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* View Job Dialog */}
      <Dialog open={!!viewJob} onOpenChange={() => setViewJob(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{viewJob?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <p><strong>Type:</strong> {viewJob?.workMode}</p>
            <p><strong>Location:</strong> {viewJob?.location}</p>
            <p><strong>Salary:</strong> {viewJob?.salary}</p>
            <p><strong>Description:</strong> {viewJob?.description}</p>
            <p><strong>Status:</strong> {viewJob?.status}</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Job Dialog */}
      <Dialog open={!!editJob} onOpenChange={() => setEditJob(null)}>
        <DialogContent className="max-w-xl h-[80vh] bg-white overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Job</DialogTitle>
          </DialogHeader>
          <JobCreateForm
            employerId={employer.id}
            companyId={employer.companyId}
            job={editJob}
            onJobCreated={fetchJobs}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
