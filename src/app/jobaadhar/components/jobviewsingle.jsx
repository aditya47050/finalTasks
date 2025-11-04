"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bookmark, BookmarkCheck } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Building2, Laptop, Globe } from "lucide-react";
import { Briefcase, Clock, FileBadge, GraduationCap } from "lucide-react";
import { Share2, Copy, Mail, MessageCircle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
function formatEmploymentType(type) {
  if (!type) return { label: "Not specified", icon: null };

  switch (type.toLowerCase()) {
    case "full-time":
      return { label: "Full-time", icon: <Briefcase className="w-4 h-4 text-blue-500" /> };
    case "part-time":
      return { label: "Part-time", icon: <Clock className="w-4 h-4 text-yellow-500" /> };
    case "contract":
      return { label: "Contract", icon: <FileBadge className="w-4 h-4 text-purple-500" /> };
    case "internship":
    case "intern":
      return { label: "Internship", icon: <GraduationCap className="w-4 h-4 text-green-500" /> };
    default:
      return { label: type, icon: null };
  }
}

function formatWorkMode(mode) {
  if (!mode) return { label: "Not specified", icon: null };

  switch (mode.toLowerCase()) {
    case "on-site":
    case "onsite":
      return { label: "On-site", icon: <Building2 className="w-4 h-4 text-blue-500" /> };
    case "remote":
      return { label: "Remote", icon: <Laptop className="w-4 h-4 text-green-500" /> };
    case "hybrid":
      return { label: "Hybrid", icon: <Globe className="w-4 h-4 text-purple-500" /> };
    default:
      return { label: mode, icon: null };
  }
}

const JobViewSingle = ({ job, seekerId }) => {
  console.log(job);
  const [isSaved, setIsSaved] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isApplying, setIsApplying] = useState(false)
  const [hasApplied, setHasApplied] = useState(false)
  const { toast } = useToast()
   const [open, setOpen] = useState(false)
  const shareUrl = typeof window !== "undefined" ? window.location.href : ""

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast.success("Link copied to clipboard!")
    } catch (error) {
      toast.error("Failed to copy link")
    }
  }

  const handleShareEmail = () => {
    const subject = encodeURIComponent("Check out this job opportunity!")
    const body = encodeURIComponent(`Hey, I found this job and thought you might like it:\n\n${shareUrl}`)
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank")
  }

  const handleShareWhatsApp = () => {
    const message = encodeURIComponent(`Check out this job I found: ${shareUrl}`)
    window.open(`https://wa.me/?text=${message}`, "_blank")
  }
  // Check if job is already saved / applied
  useEffect(() => {
    if (!job.id || !seekerId) return

    const checkSavedStatus = async () => {
      try {
        const res = await fetch(`/api/jobaadhar/job-seeker/jobs/check-saved?jobId=${job.id}&seekerId=${seekerId}`)
        const data = await res.json()
        setIsSaved(data.isSaved)
      } catch (err) {
        console.error(err)
      }
    }

    const checkAppliedStatus = async () => {
      try {
        const res = await fetch(`/api/jobaadhar/job-seeker/application/check?jobId=${job.id}&seekerId=${seekerId}`)
        const data = await res.json()
        setHasApplied(data.hasApplied)
      } catch (err) {
        console.error(err)
      }
    }

    checkSavedStatus()
    checkAppliedStatus()
  }, [job.id, seekerId])

  const handleSaveToggle = async () => {
    setIsLoading(true)
    try {
      if (isSaved) {
        const res = await fetch("/api/jobaadhar/job-seeker/jobs/unsave", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jobId: job.id, seekerId }),
        })
        if (res.ok) {
          setIsSaved(false)
          toast({ title: "Job removed from saved" })
        }
      } else {
        const res = await fetch("/api/jobaadhar/job-seeker/jobs/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jobId: job.id, seekerId }),
        })
        if (res.ok) {
          setIsSaved(true)
          toast({ title: "Job saved successfully" })
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleApply = async () => {
    setIsApplying(true)
    try {
      const res = await fetch("/api/jobaadhar/job-seeker/application/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: job.id, seekerId }),
      })
      if (res.ok) {
        setHasApplied(true)
        toast({ title: "Application submitted successfully!" })
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsApplying(false)
    }
  }

  // Helper to render bullet points as <ul>
  const renderBulletList = (text) => {
    if (!text) return null
    const lines = text.split("\n").map((line) => line.replace(/^•\s*/, "").trim()).filter(Boolean)
    return (
      <ul className="list-disc ml-5 space-y-1">
        {lines.map((line, idx) => (
          <li key={idx}>{line}</li>
        ))}
      </ul>
    )
  }
  const workModeData = formatWorkMode(job.workMode);
  const employment = formatEmploymentType(job.employmentType);
  return (
    <div className="min-h-screen bg-blue-50 py-10">
      <div className="container mx-auto px-4 max-w-7xl lg:px-10 space-y-6">
        {/* Job Header */}
        <Card className="p-6 flex flex-col md:flex-row items-start justify-between gap-4 bg-white">
          <div className="flex items-start gap-4">
            {job.company?.logoUrl && (
              <img
                src={job.company.logoUrl}
                alt="Company Logo"
                className="h-16 w-auto rounded-xl object-contain"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold text-blue-500">{job.title}</h1>
              <p className="text-gray-500 text-sm">{job.company?.name}</p>
              <div className="mt-2 flex gap-2 flex-wrap text-gray-500 text-sm">
                <span className="flex items-center gap-1">
                  {(() => {
                    switch (job.exp?.toLowerCase()) {
                      case "entry":
                        return "Entry Level";
                      case "mid":
                        return "Mid Level";
                      case "senior":
                        return "Senior Level";
                      case "executive":
                        return "Executive Level";
                      default:
                        return job.exp || "Not specified";
                    }
                  })()}
                </span>
                <span>{job.salary}</span>
                <span className="flex items-center gap-2 text-sm font-medium">
                  {workModeData.icon}
                  {workModeData.label}
                </span>
                <span>{job.location}</span>
              </div>
            </div>
          </div>
          <div className="mt-2 flex gap-2">
            <Button variant="secondary" className="rounded-xl" onClick={handleSaveToggle} disabled={isLoading}>
              {isSaved ? <BookmarkCheck className="h-5 w-5 text-success" /> : <Bookmark className="h-5 w-5" />}
              {isSaved ? "Saved" : "Save"}
            </Button>
            {job.status === "active" ? (
              <Button
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
                onClick={handleApply}
                disabled={isApplying || hasApplied}
              >
                {isApplying ? "Applying..." : hasApplied ? "Applied" : "Apply"}
              </Button>
            ) : job.status === "inactive" ? (
              <Button
                className="bg-gray-400 text-white rounded-xl cursor-not-allowed"
                disabled
              >
                Currently unable to apply
              </Button>
            ) : job.status === "closed" ? (
              <Button
                className="bg-red-500 text-white rounded-xl cursor-not-allowed"
                disabled
              >
                Closed
              </Button>
            ) : null}
            <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="rounded-xl border-gray-300 hover:bg-blue-50 transition flex items-center gap-2"
          >
            <Share2 className="h-5 w-5 text-blue-600" />
            <span>Share</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-28 rounded-xl bg-white shadow-lg border p-1 animate-in fade-in slide-in-from-top-1 duration-200"
        >
          <DropdownMenuItem onClick={handleCopyLink} className="flex items-center gap-2 cursor-pointer">
            <Copy className="h-4 w-4 text-gray-600" />
            <span>Copy Link</span>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleShareEmail} className="flex items-center gap-2 cursor-pointer">
            <Mail className="h-4 w-4 text-gray-600" />
            <span>Email</span>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleShareWhatsApp} className="flex items-center gap-2 cursor-pointer">
            <MessageCircle className="h-4 w-4 text-green-600" />
            <span>WhatsApp</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
          </div>
        </Card>

        {/* Job Details */}
        <Card className="p-6 space-y-4 bg-white">
          <h2 className="text-lg font-semibold text-blue-500">Job Description</h2>
          <p>{job.description}</p>

          <h2 className="text-lg font-semibold text-blue-500">Responsibilities</h2>
          {renderBulletList(job.responsibilities)}

          <h2 className="text-lg font-semibold text-blue-500">Requirements</h2>
          {renderBulletList(job.requirements)}

          <h2 className="text-lg font-semibold text-blue-500">Key Skills</h2>
          <div className="flex flex-wrap gap-2">
            {job.skills?.map((skill) => (
              <Badge key={skill.id} className="bg-accent/20 text-accent">
                {skill.skill?.name || skill.name}
              </Badge>
            ))}
          </div>

          <h2 className="text-lg font-semibold text-blue-500">Job Info</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-gray-100 p-3 rounded">
              <p className="text-gray-500 text-sm">Employment Type</p>
              <span className="flex items-center gap-2 text-sm font-medium text-blue-500">
                {employment.icon}
                {employment.label}
              </span>
            </div>
            <div className="bg-gray-100 p-3 rounded">
              <p className="text-gray-500 text-sm">Experience Level</p>
              <p className="text-blue-500 font-medium">{(() => {
                    switch (job.exp?.toLowerCase()) {
                      case "entry":
                        return "Entry Level";
                      case "mid":
                        return "Mid Level";
                      case "senior":
                        return "Senior Level";
                      case "executive":
                        return "Executive Level";
                      default:
                        return job.exp || "Not specified";
                    }
                  })()}</p>
            </div>
            <div className="bg-gray-100 p-3 rounded">
              <p className="text-gray-500 text-sm">Openings</p>
              <p className="text-blue-500 font-medium">{job.openings || 1}</p>
            </div>
          </div>

          <h2 className="text-lg font-semibold text-blue-500 mt-4">About Company</h2>
          <p>{job.company?.about}</p>

          <p className="text-gray-500 text-sm mt-2">
            Posted: {new Date(job.postedAt).toDateString()} • Applicants: {job.applications?.length || 0}
          </p>
        </Card>
      </div>
    </div>
  )
}

export default JobViewSingle
