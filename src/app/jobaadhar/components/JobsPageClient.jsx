"use client"

import { useMemo, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, Star, Briefcase, MapPin, Filter, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { Laptop, Globe } from "lucide-react";
import { Clock, FileBadge, GraduationCap } from "lucide-react";

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

export default function JobsPageClient({
  jobs = [],
  trendingCompanies = [],
}) {
  const [selectedJobType, setSelectedJobType] = useState("all")
  const [selectedExpLevel, setSelectedExpLevel] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [minSalary, setMinSalary] = useState("")
  const [selectedSkills, setSelectedSkills] = useState(new Set())

  const [sortBy, setSortBy] = useState("relevance")
  const [page, setPage] = useState(1)
  const pageSize = 10

  const jobTypes = [
    { value: "all", label: "All Types" },
    { value: "full-time", label: "Full Time" },
    { value: "part-time", label: "Part Time" },
    { value: "contract", label: "Contract" },
    { value: "remote", label: "Remote" },
  ]

  const expLevels = [
    { value: "all", label: "All Levels" },
    { value: "entry", label: "Entry Level" },
    { value: "mid", label: "Mid Level" },
    { value: "senior", label: "Senior Level" },
  ]

  const allSkills = useMemo(() => {
    const set = new Set()
    for (const j of jobs || []) {
      const skills = Array.isArray(j?.skills) ? j.skills : []
      for (const s of skills) {
        const name = s?.skill?.name || s?.name
        if (name) set.add(name)
      }
    }
    return Array.from(set)
      .sort((a, b) => a.localeCompare(b))
      .slice(0, 12) // limit to 12 to keep UI tidy
  }, [jobs])

  const toNumber = (val) => {
    if (typeof val === "number") return val
    if (typeof val === "string") {
      const n = Number.parseInt(val.replace(/[^0-9.-]/g, ""), 10)
      return Number.isFinite(n) ? n : 0
    }
    return 0
  }

  const matchesJobType = (job) => {
    if (selectedJobType === "all") return true
    const t = (job?.employmentType || job?.employmentType || "").toString().toLowerCase()
    return t.includes(selectedJobType)
  }

  const matchesExpLevel = (job) => {
    if (selectedExpLevel === "all") return true
    const exp = (job?.exp || job?.experience || "").toString().toLowerCase()
    // heuristic match
    if (selectedExpLevel === "entry") return exp.includes("entry") || exp.includes("junior")
    if (selectedExpLevel === "mid") return exp.includes("mid") || exp.includes("intermediate")
    if (selectedExpLevel === "senior") return exp.includes("senior") || exp.includes("lead") || exp.includes("expert")
    return true
  }

  const matchesSearch = (job) => {
    const q = searchTerm.trim().toLowerCase()
    if (!q) return true
    const title = (job?.title || "").toString().toLowerCase()
    const company = (job?.company?.name || "").toString().toLowerCase()
    const location = (job?.location || "").toString().toLowerCase()
    return title.includes(q) || company.includes(q) || location.includes(q)
  }

  const matchesMinSalary = (job) => {
    const min = toNumber(minSalary)
    if (!min) return true
    const salary = toNumber(job?.salary)
    return salary >= min
  }

  const matchesSkills = (job) => {
    if (selectedSkills.size === 0) return true
    const jobSkillNames = new Set(
      (Array.isArray(job?.skills) ? job.skills : []).map((s) => s?.skill?.name || s?.name).filter(Boolean),
    )
    for (const s of selectedSkills) {
      if (!jobSkillNames.has(s)) return false
    }
    return true
  }

  const filteredJobs = useMemo(() => {
    const list = (jobs || []).filter(
      (j) => matchesJobType(j) && matchesExpLevel(j) && matchesSearch(j) && matchesMinSalary(j) && matchesSkills(j),
    )
    return list
  }, [jobs, selectedJobType, selectedExpLevel, searchTerm, minSalary, selectedSkills])

  const sortedJobs = useMemo(() => {
    const list = [...filteredJobs]
    switch (sortBy) {
      case "newest":
        list.sort((a, b) => {
          // prefer createdAt or updatedAt; fallback to id desc
          const aTime = new Date(a?.createdAt || a?.updatedAt || 0).getTime() || toNumber(a?.id) || 0
          const bTime = new Date(b?.createdAt || b?.updatedAt || 0).getTime() || toNumber(b?.id) || 0
          return bTime - aTime
        })
        break
      case "salary_desc":
        list.sort((a, b) => toNumber(b?.salary) - toNumber(a?.salary))
        break
      case "salary_asc":
        list.sort((a, b) => toNumber(a?.salary) - toNumber(b?.salary))
        break
      case "title_asc":
        list.sort((a, b) => (a?.title || "").localeCompare(b?.title || ""))
        break
      // relevance keeps original order
    }
    return list
  }, [filteredJobs, sortBy])

  const totalPages = Math.max(1, Math.ceil(sortedJobs.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * pageSize
  const currentPageJobs = sortedJobs.slice(start, start + pageSize)

  const toggleSkill = (name) => {
    setPage(1)
    setSelectedSkills((prev) => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }

  const onFilterClick = (setter, value) => {
    setter(value)
    setPage(1)
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 lg:px-16 py-10 grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] gap-8">
        {/* -------- Left: Filters -------- */}
        <aside className="space-y-6 order-1 lg:order-none">
          <Card className="p-5 border-2 border-indigo-100 shadow-lg rounded-xl bg-white/80 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-5 w-5 text-indigo-600" />
              <h3 className="text-lg font-bold text-slate-800">Filters</h3>
            </div>

            <div className="space-y-5">
              {/* Search */}
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">Search</label>
                <input
                  aria-label="Search jobs"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setPage(1)
                  }}
                  placeholder="Title, company, or location"
                  className="w-full rounded-xl border border-indigo-200 bg-white/70 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              {/* Job Type */}
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">Job Type</label>
                <div className="flex flex-wrap gap-2">
                  {jobTypes.map((type) => (
                    <Button
                      key={type.value}
                      onClick={() => onFilterClick(setSelectedJobType, type.value)}
                      variant={selectedJobType === type.value ? "default" : "outline"}
                      className={`rounded-xl text-xs transition-all duration-300 ${
                        selectedJobType === type.value
                          ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md"
                          : "border-indigo-200 text-slate-700 hover:border-indigo-400 hover:bg-indigo-50"
                      }`}
                    >
                      {type.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Experience Level */}
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">Experience Level</label>
                <div className="flex flex-wrap gap-2">
                  {expLevels.map((lvl) => (
                    <Button
                      key={lvl.value}
                      onClick={() => onFilterClick(setSelectedExpLevel, lvl.value)}
                      variant={selectedExpLevel === lvl.value ? "default" : "outline"}
                      className={`rounded-xl text-xs transition-all duration-300 ${
                        selectedExpLevel === lvl.value
                          ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md"
                          : "border-indigo-200 text-slate-700 hover:border-indigo-400 hover:bg-indigo-50"
                      }`}
                    >
                      {lvl.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Minimum Salary */}
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">Minimum Salary</label>
                <div className="flex items-center gap-2">
                  <span className="text-slate-600">₹</span>
                  <input
                    aria-label="Minimum salary"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={minSalary}
                    onChange={(e) => {
                      setMinSalary(e.target.value.replace(/[^0-9]/g, ""))
                      setPage(1)
                    }}
                    placeholder="e.g. 500000"
                    className="w-full rounded-xl border border-indigo-200 bg-white/70 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
              </div>

              {/* Skills */}
              {allSkills.length > 0 && (
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">Skills</label>
                  <div className="grid grid-cols-2 gap-2">
                    {allSkills.map((name) => {
                      const checked = selectedSkills.has(name)
                      return (
                        <label
                          key={name}
                          className={`flex items-center gap-1 rounded-xl border px-3 py-2 text-sm cursor-pointer transition-colors ${
                            checked ? "border-indigo-400 bg-indigo-50" : "border-indigo-200 hover:bg-indigo-50/60"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleSkill(name)}
                            className="accent-indigo-600"
                          />
                          <span className="text-slate-700 truncate text-xs">{name}</span>
                        </label>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </aside>

        {/* -------- Center: Jobs List + Sort + Pagination -------- */}
        <main className="order-3 lg:order-none">
          {/* Top Bar: Sort and Count */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div className="flex items-center gap-3">
              <Briefcase className="h-7 w-7 text-indigo-600" />
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                  Jobs
                </h2>
                <p className="text-sm text-slate-600">
                  Showing {sortedJobs.length === 0 ? 0 : start + 1}–
                  {Math.min(sortedJobs.length, start + currentPageJobs.length)} of {sortedJobs.length} jobs
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-5 w-5 text-indigo-600" />
              <label htmlFor="sort" className="sr-only">
                Sort
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value)
                  setPage(1)
                }}
                className="rounded-xl border border-indigo-200 bg-white/80 px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="relevance">Most Relevant</option>
                <option value="newest">Newest</option>
                <option value="salary_desc">Salary: High to Low</option>
                <option value="salary_asc">Salary: Low to High</option>
                <option value="title_asc">Title: A→Z</option>
              </select>
            </div>
          </div>

          {/* Jobs */}
          <div className="space-y-6">
            {currentPageJobs.map((job) => (
              <Card
                key={job.id}
                className="p-6 border-2 border-indigo-100 shadow-lg hover:shadow-xl hover:border-indigo-300 transition-all duration-300 rounded-xl bg-white/80 backdrop-blur-sm"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 w-full">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-3 max-w-[350px]">
                        <h3 className="text-2xl font-bold text-blue-500 mb-2 truncate">{job.title}</h3>
                      </div>
                      <Button className="rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6">
                        <Link href={`/jobaadhar/jobs/${job.id}`}>View Details</Link>
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <p className="text-base font-semibold text-gray-500">{job.company?.name}</p>
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="w-4/5">
                        <div className="flex flex-row flex-nowrap w-full gap-3 text-sm text-slate-600 mb-4">
                          <span className="flex items-center gap-1">
                            <Briefcase className="h-4 w-4 text-indigo-500" />
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
                          <span className="flex items-center gap-1">
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
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4 text-rose-500" />
                            {job.location}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {(Array.isArray(job.skills) ? job.skills : []).map((skill, i) => {
                            const name = skill?.skill?.name || skill?.name || `Skill ${i + 1}`
                            return (
                              <Badge
                                key={`${job.id}-${name}-${i}`}
                                className="bg-gradient-to-r from-indigo-100 to-blue-100 hover:from-indigo-200 hover:to-blue-200 text-indigo-700 text-xs font-medium px-3 py-1 rounded-xl border border-indigo-200"
                              >
                                {name}
                              </Badge>
                            )
                          })}
                        </div>
                      </div>
                      <div className="w-1/5 ">
                        <div className="h-12 w-auto flex items-center justify-center rounded-xl  shadow-md">
                          <img src={job.company.logoUrl} className="h-12 w-auto text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {sortedJobs.length === 0 && (
              <Card className="p-8 text-center border-2 border-indigo-100 bg-white/80 rounded-xl">
                <p className="text-slate-700">No jobs match your filters. Try adjusting your search or filters.</p>
              </Card>
            )}
          </div>

          {/* Pagination */}
          {sortedJobs.length > 0 && (
            <div className="mt-8 flex items-center justify-center gap-4">
              <Button
                variant="outline"
                className="rounded-xl border-indigo-200 bg-transparent"
                disabled={currentPage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Prev
              </Button>
              <span className="text-sm text-slate-700">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                className="rounded-xl border-indigo-200 bg-transparent"
                disabled={currentPage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
        </main>

        {/* -------- Right: Trending Companies -------- */}
        <aside className="space-y-6 order-2 lg:order-none">
          <Card className="p-6 border-2 border-indigo-100 shadow-lg rounded-xl bg-white/80 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-5">
              <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
              <h3 className="text-lg font-bold text-slate-800">Trending Companies</h3>
            </div>
            <div className="space-y-4">
              {trendingCompanies.map((comp) => (
                <Card
                  key={comp.id}
                  className="p-4 border-2 border-indigo-100 shadow-md hover:shadow-lg hover:border-indigo-300 transition-all duration-300 rounded-xl bg-gradient-to-br from-white to-indigo-50/30 cursor-pointer group"
                >
                  <Link href={`/jobaadhar/companies/${comp.id}`}>
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-24 flex items-center justify-center rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300">
                        <img src={comp.logoUrl} className="h-10 w-auto text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-base font-bold text-blue-500 mb-2 group-hover:text-indigo-600 transition-colors">
                          {comp.name}
                        </h4>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {(Array.isArray(comp.tags) ? comp.tags : []).map((tag) => (
                        <Badge
                          key={tag.id || tag.name}
                          className="bg-gradient-to-r from-slate-100 to-indigo-100 text-slate-700 text-xs font-medium px-2 py-0.5 rounded-xl border border-indigo-200"
                        >
                          {tag?.tag?.name}
                        </Badge>
                      ))}
                    </div>
                  </Link>
                </Card>
              ))}
            </div>
          </Card>
        </aside>
      </div>
    </div>
  )
}
