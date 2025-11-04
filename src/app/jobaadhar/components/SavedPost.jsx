"use client"
import React, { useState, useEffect, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookmarkCheck, MapPin, DollarSign, Clock, Building2, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

const SORT_OPTIONS = [
  { label: "Date Saved (Newest)", value: "savedAtDesc" },
  { label: "Date Saved (Oldest)", value: "savedAtAsc" },
  { label: "Job Title (A-Z)", value: "titleAsc" },
  { label: "Job Title (Z-A)", value: "titleDesc" },
]
const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

  const getTimeAgo = (dateString) => {
    const now = new Date()
    const posted = new Date(dateString)
    const diffInDays = Math.floor((now.getTime() - posted.getTime()) / (1000 * 60 * 60 * 24))
    if (diffInDays === 0) return "Today"
    if (diffInDays === 1) return "1 day ago"
    if (diffInDays < 7) return `${diffInDays} days ago`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
    return `${Math.floor(diffInDays / 30)} months ago`
  }
const SavedPost = ({ seekerId }) => {
  const [savedJobs, setSavedJobs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState("savedAtDesc")
  const { toast } = useToast()

  const JOBS_PER_PAGE = 8

  useEffect(() => {
    fetchSavedJobs()
  }, [])

  const fetchSavedJobs = async () => {
    try {
      const response = await fetch(`/api/jobaadhar/job-seeker/jobs/saved?seekerId=${seekerId}`)
      const data = await response.json()
      setSavedJobs(data.savedJobs || [])
    } catch (error) {
      console.error("Error fetching saved jobs:", error)
      toast({
        title: "Error",
        description: "Failed to load saved jobs. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUnsaveJob = async (jobId) => {
    try {
      const response = await fetch("/api/jobaadhar/job-seeker/jobs/unsave", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, seekerId }),
      })

      if (response.ok) {
        setSavedJobs((prev) => prev.filter((savedJob) => savedJob.job.id !== jobId))
        toast({ title: "Job removed", description: "The job has been removed from your saved jobs." })
      } else throw new Error("Failed to unsave job")
    } catch (error) {
      console.error("Error unsaving job:", error)
      toast({
        title: "Error",
        description: "Failed to remove job. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Sorting logic
  const sortedJobs = useMemo(() => {
    const jobsCopy = [...savedJobs]
    switch (sortBy) {
      case "savedAtDesc":
        return jobsCopy.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt))
      case "savedAtAsc":
        return jobsCopy.sort((a, b) => new Date(a.savedAt) - new Date(b.savedAt))
      case "titleAsc":
        return jobsCopy.sort((a, b) => a.job.title.localeCompare(b.job.title))
      case "titleDesc":
        return jobsCopy.sort((a, b) => b.job.title.localeCompare(a.job.title))
      default:
        return jobsCopy
    }
  }, [savedJobs, sortBy])

  // Pagination logic
  const totalPages = Math.ceil(sortedJobs.length / JOBS_PER_PAGE)
  const paginatedJobs = sortedJobs.slice((page - 1) * JOBS_PER_PAGE, page * JOBS_PER_PAGE)

  if (isLoading) return <LoadingPlaceholder />

  return (
    <div className="min-h-screen py-10 bg-white">
      <div className="container mx-auto px-4 lg:px-10 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-blue-500 text-balance">Saved Jobs</h1>
            <p className="text-gray-500">
              {savedJobs.length} {savedJobs.length === 1 ? "job" : "jobs"} saved
            </p>
          </div>
          <div className="flex gap-3 items-center">
            <span className="text-gray-700 font-medium text-sm">Sort by:</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-blue-300 text-gray-700 text-sm rounded-xl px-4 py-2 pr-8 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Jobs Grid */}
        {paginatedJobs.length === 0 ? (
          <EmptyState />
        ) : (
          <motion.div layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <AnimatePresence>
              {paginatedJobs.map((savedJob) => (
                <motion.div
                  key={savedJob.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <SavedJobCard savedJob={savedJob} onUnsave={handleUnsaveJob} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-6">
            <Button
              size="sm"
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="gap-1 bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
            >
              <ChevronLeft className="h-4 w-4" /> Prev
            </Button>
            <span className="text-gray-600 font-medium">
              Page {page} of {totalPages}
            </span>
            <Button
              size="sm"
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="gap-1 bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
            >
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

const SavedJobCard = ({ savedJob, onUnsave }) => (
  <Card className="p-4 space-y-3 bg-blue-50 border border-blue-200 hover:shadow-lg transition-all rounded-xl">
    <div className="flex justify-between items-start">
      <div className="flex flex-col items-start gap-3">
        {savedJob.job.company.logoUrl ? (
          <img src={savedJob.job.company.logoUrl} alt="logo" className="h-12 w-auto object-cover rounded-lg" />
        ) : (
          <div className="h-12 w-12 bg-white rounded-lg flex items-center justify-center border border-gray-200">
            <Building2 className="h-6 w-6 text-blue-500" />
          </div>
        )}
        <div>
          <h3 className="font-semibold text-blue-500 text-sm md:text-base">{savedJob.job.title}</h3>
        </div>
      </div>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => onUnsave(savedJob.job.id)}
        className="text-red-500 hover:text-red-600"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>

    <div className="flex flex-nowrap gap-1">
      {savedJob.job.skills.slice(0, 2).map((skill, idx) => (
        <Badge key={idx} variant="secondary" className="text-xs bg-white/50 text-blue-500 border border-blue-200">
          {skill.skill.name}
        </Badge>
      ))}
      {savedJob.job.skills.length > 3 && (
        <Badge variant="secondary" className="text-xs bg-white/50 text-gray-500 border border-gray-200">
          +{savedJob.job.skills.length - 2} more
        </Badge>
      )}
    </div>

    <p className="text-xs md:text-sm text-gray-600 line-clamp-2">{savedJob.job.description}</p>

    <div className="flex justify-between items-center text-xs text-gray-500">
      <span>Posted {getTimeAgo(savedJob.job.postedAt)}</span>
      <span>Saved {formatDate(savedJob.savedAt)}</span>
    </div>

    <Link href={`/jobaadhar/jobs/${savedJob.jobId}`}>
      <Button size="sm" className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl mt-2">
        Apply Now
      </Button>
    </Link>
  </Card>
)

const LoadingPlaceholder = () => (
  <div className="min-h-screen py-10">
    <div className="container mx-auto px-4 lg:px-10 space-y-8 animate-pulse">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="p-6 space-y-4 bg-blue-50 rounded-xl shadow-sm">
            {/* Company / Title */}
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-blue-100 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-blue-100 rounded w-3/4" />
                <div className="h-3 bg-blue-100 rounded w-1/2" />
              </div>
            </div>

            {/* Job Details */}
            <div className="space-y-2">
              <div className="h-3 bg-blue-100 rounded w-1/2" />
              <div className="h-3 bg-blue-100 rounded w-1/3" />
              <div className="h-3 bg-blue-100 rounded w-2/3" />
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center mt-2">
              <div className="h-3 bg-blue-100 rounded w-1/4" />
              <div className="h-3 bg-blue-100 rounded w-1/6" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)


const EmptyState = () => (
  <Card className="p-12 text-center bg-white border border-blue-200 rounded-xl">
    <BookmarkCheck className="h-16 w-16 text-blue-500 mx-auto mb-4" />
    <h3 className="text-xl font-semibold text-blue-500 mb-2">No saved jobs yet</h3>
    <p className="text-gray-500">
      Start exploring jobs and save the ones you're interested in to see them here.
    </p>
  </Card>
)

export default SavedPost
