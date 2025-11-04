"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bookmark, MapPin, Clock, Building, ChevronRight } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export function FeaturedJobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchJobs() {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch("/api/jobaadhar/jobs") // replace with your backend route
        const data = await res.json()
        if (res.ok) {
          setJobs(data.slice(0, 8)) // show only 8 jobs
        } else {
          setError(data.error || "Failed to fetch jobs")
        }
      } catch (err) {
        setError("Network error")
      } finally {
        setLoading(false)
      }
    }
    fetchJobs()
  }, [])

  if (error) return <p className="text-center py-8 text-red-500">{error}</p>

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  }

  return (
    <section className="bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800">
              Featured Job Opportunities
            </h2>
            <p className="text-gray-500 mt-2 text-pretty">
              Hand-picked positions from top companies
            </p>
          </div>
          <Link href={"/jobaadhar/jobs"}>
            <Button className="hidden sm:flex bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-xl shadow-lg transition-all">
              View all jobs <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>

        {/* Jobs Grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <Card
                  key={i}
                  className="p-6 animate-pulse space-y-4 bg-gray-200 rounded-xl h-72"
                ></Card>
              ))
            : jobs.map((job) => (
                <motion.div
                  key={job.id}
                  variants={cardVariants}
                  whileHover={{ scale: 1.03 }}
                  className="cursor-pointer"
                >
                  <Card className="p-5 hover:shadow-xl transition-all rounded-xl bg-white border border-gray-100">
                    <div className="space-y-3 overflow-hidden">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 bg-gradient-to-br from-cyan-400 to-blue-500 text-white rounded-xl flex items-center justify-center font-bold text-lg">
                            {job.logo || job.company?.[0]?.toUpperCase()}
                          </div>
                          <div className="overflow-hidden ">
                            <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors truncate">
                              {job.title}
                            </h3>
                            <p className="text-sm text-gray-500">{job.company}</p>
                          </div>
                        </div>
                      </div>

                      {/* Meta info */}
                      <div className="space-y-1 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{job.location}</span>
                          {job.remote && (
                            <Badge className="text-xs bg-cyan-500 text-white">
                              Remote
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Building className="h-4 w-4" />
                            <span>{job.type}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{job.posted}</span>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {job.description}
                      </p>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <span className="font-semibold text-gray-800">
                          {(() => {
                              if (!job.salary) return "Not specified";
                              // Split by "-" or "to" for ranges
                              const parts = job.salary.split(/\s*(?:-|–|—|to)\s*/i).filter(Boolean);
                              const formatted = parts.map((p) => {
                                const num = Number(String(p).replace(/[^\d.]/g, ""));
                                if (!isFinite(num)) return p;
                                return `₹${num.toLocaleString("en-IN")}`;
                              });
                              return formatted.join(" - ");
                            })()}
                        </span>
                        <Link href={`/jobaadhar/jobs/${job.id}`}>
                          <Button
                            variant="outline"
                            className="rounded-xl border-gray-200 hover:bg-blue-500 hover:text-white text-cyan-600"
                          >
                            Apply Now
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
        </div>

        {/* Mobile button */}
        <div className="text-center mt-8 sm:hidden">
          <Button size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-xl">
            <Link href={"/jobaadhar/jobs"}>
              View all jobs <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
