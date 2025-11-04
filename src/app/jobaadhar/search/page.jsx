"use client"

import { useState, useMemo, useCallback } from "react"
import { useSearchParams, usePathname, useRouter } from "next/navigation"
import useSWR from "swr"
import Link from "next/link"

// --- Utility functions ---
function parseNumber(val) {
  if (!val) return undefined
  const n = Number(val)
  return isFinite(n) ? n : undefined
}

export function formatSalary(s) {
  if (s == null) return null
  const str = String(s).trim()
  if (str === "") return null
  const parts = str.split(/\s*(?:-|–|—|to)\s*/i).filter(Boolean)
  const formatter = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })
  const formatPart = (p) => {
    if (!p) return null
    const cleaned = p.replace(/[,₹\s]/g, "").toLowerCase()
    const m = cleaned.match(/^([0-9]*\.?[0-9]+)\s*([kmb])?$/i)
    if (m) {
      let num = Number(m[1])
      const suffix = m[2]
      if (suffix) {
        if (suffix.toLowerCase() === "k") num *= 1e3
        if (suffix.toLowerCase() === "m") num *= 1e6
        if (suffix.toLowerCase() === "b") num *= 1e9
      }
      if (!isFinite(num)) return p
      return formatter.format(Math.round(num))
    }
    const digitsOnly = p.replace(/[^\d.]/g, "")
    if (!digitsOnly) return p
    return formatter.format(Math.round(Number(digitsOnly)))
  }
  return parts.map(formatPart).filter(Boolean).join(" - ")
}

function timeAgo(dateLike) {
  if (!dateLike) return null
  const d = new Date(dateLike)
  if (isNaN(d.getTime())) return null
  const diff = Date.now() - d.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

// --- JobCard ---
function JobCard({ job }) {
  const salaryText = formatSalary(job.salary)
  const postedText = timeAgo(job.postedAt)

  return (
    <div className="p-4 border bg-blue-50 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-blue-500 truncate max-w-36">{job.title}</h3>
          {job.company ? <p className="text-sm text-gray-500 mt-1">{job.company}</p> : null}
        </div>
        {postedText ? <span className="text-xs text-white shrink-0 bg-blue-500 p-1 rounded-[10px]">{postedText}</span> : null}
      </div>

      <div className="mt-3 flex flex-col flex-wrap items-start gap-2 text-xs text-black">
        {job.location ? <span className="badge truncate">{job.location}</span> : null}
        {job.workMode ? <span className="bg-blue-500 p-1 text-white rounded-[10px]">{job.workMode}</span> : null}
        {salaryText ? <span className="text-blue-500 text-sm">{salaryText}</span> : null}
      </div>

      <div className="mt-4 w-full flex">
        <Link href={`/jobaadhar/jobs/${job.id}`} className="bg-blue-500 text-white rounded-xl px-4 py-2 text-center w-full">
          View Job Details
        </Link>
      </div>
    </div>
  )
}

function JobCardSkeleton() {
  return (
    <div className="p-4 border bg-blue-50 rounded-xl shadow-sm animate-pulse">
      <div className="space-y-3">
        <div className="h-4 w-3/4 bg-gray-500 rounded" />
        <div className="h-3 w-1/2 bg-gray-500 rounded" />
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-gray-500 rounded" />
          <div className="h-6 w-20 bg-gray-500 rounded" />
          <div className="h-6 w-24 bg-gray-500 rounded" />
        </div>
        <div className="h-9 w-full bg-gray-500 rounded" />
      </div>
    </div>
  )
}

// --- SortBar ---
function SortBar({ sortBy, order, onChange }) {
  return (
    <div className="flex flex-row items-center gap-3">
      <label className="text-lg text-gray-500 font-semibold">Sort Jobs</label>
      <select
        className="px-3 py-2 rounded-xl border bg-blue-500 text-white"
        value={sortBy}
        onChange={(e) => onChange({ sortBy: e.target.value, order })}
      >
        <option value="postedAt">Latest</option>
        <option value="title">Title</option>
        <option value="salary">Salary</option>
      </select>
      <select
        className="px-3 py-2 rounded-xl border bg-blue-500 text-white"
        value={order}
        onChange={(e) => onChange({ sortBy, order: e.target.value })}
      >
        <option value="desc">Desc</option>
        <option value="asc">Asc</option>
      </select>
    </div>
  )
}

// --- Filters ---
const WORK_MODES = ["Remote", "On-site", "Hybrid"]
function Filters({ state, onChange, onClearAll }) {
  const [locationInput, setLocationInput] = useState("")
  function addLocation() {
    const val = locationInput.trim()
    if (!val) return
    if (!state.locations.includes(val)) onChange({ locations: [...state.locations, val] })
    setLocationInput("")
  }
  function removeLocation(val) {
    onChange({ locations: state.locations.filter((l) => l !== val) })
  }

  return (
    <aside className="w-full md:w-64 shrink-0">
      <div className="border rounded-xl p-4 bg-blue-50/20">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-500">Filters</h2>
          <button onClick={onClearAll} className="bg-red-500 p-2 rounded-xl text-white">
            Clear
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <label className="text-sm text-gray-500">Keyword</label>
            <input
              className="mt-1 h-10 bg-blue-50 rounded-xl pl-2 border-[2px]"
              placeholder="e.g. React Developer"
              value={state.keyword}
              onChange={(e) => onChange({ keyword: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && e.target.blur()}
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">Work Mode</label>
            <div className="mt-2 flex flex-col gap-2">
              {WORK_MODES.map((mode) => {
                const checked = state.workModes.includes(mode)
                return (
                  <label key={mode} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => {
                        const next = e.target.checked
                          ? [...state.workModes, mode]
                          : state.workModes.filter((m) => m !== mode)
                        onChange({ workModes: next })
                      }}
                    />
                    {mode}
                  </label>
                )
              })}
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-500">Salary Range (₹)</label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <input
                type="number"
                className="h-10 bg-blue-50 rounded-xl pl-2 border-[2px]"
                placeholder="Min"
                value={state.minSalary ?? ""}
                onChange={(e) => onChange({ minSalary: e.target.value ? Number(e.target.value) : undefined })}
              />
              <input
                type="number"
                className="h-10 bg-blue-50 rounded-xl pl-2 border-[2px]"
                placeholder="Max"
                value={state.maxSalary ?? ""}
                onChange={(e) => onChange({ maxSalary: e.target.value ? Number(e.target.value) : undefined })}
              />
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

// --- Main SearchPage ---
export default function SearchPage() {
  const params = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const keyword = useMemo(() => params.get("keyword") ?? "", [params])
  const locations = useMemo(() => (params.get("locations") || "").split(",").filter(Boolean), [params])
  const sortBy = useMemo(() => params.get("sortBy") || "postedAt", [params])
  const order = useMemo(() => params.get("order") || "desc", [params])
  const workModes = useMemo(() => (params.get("workModes") || "").split(",").filter(Boolean), [params])
  const minSalary = useMemo(() => parseNumber(params.get("minSalary")), [params])
  const maxSalary = useMemo(() => parseNumber(params.get("maxSalary")), [params])

  const setParams = useCallback(
    (patch) => {
      const next = new URLSearchParams(params.toString())
      const setOrDelete = (key, val) => {
        if (val == null || (Array.isArray(val) && val.length === 0) || val === "") next.delete(key)
        else next.set(key, Array.isArray(val) ? val.join(",") : val)
      }
      if ("keyword" in patch) setOrDelete("keyword", patch.keyword)
      if ("locations" in patch) setOrDelete("locations", patch.locations)
      if ("workModes" in patch) setOrDelete("workModes", patch.workModes)
      if ("minSalary" in patch) setOrDelete("minSalary", patch.minSalary)
      if ("maxSalary" in patch) setOrDelete("maxSalary", patch.maxSalary)
      if ("sortBy" in patch) setOrDelete("sortBy", patch.sortBy)
      if ("order" in patch) setOrDelete("order", patch.order)
      router.replace(`${pathname}?${next.toString()}`)
    },
    [params, pathname, router]
  )

  const searchQuery = useMemo(() => {
    const q = new URLSearchParams()
    if (keyword) q.set("keyword", keyword)
    if (locations.length) q.set("locations", locations.join(","))
    if (sortBy) q.set("sortBy", sortBy)
    if (order) q.set("order", order)
    return q.toString()
  }, [keyword, locations, sortBy, order])

  const { data, isLoading, error } = useSWR(`/api/jobaadhar/search?${searchQuery}`, (url) => fetch(url).then((r) => r.json()), { revalidateOnFocus: false })

  const processedJobs = useMemo(() => {
    const list = (data?.jobs ?? []).slice()
    const byWorkMode = workModes.length
      ? list.filter((j) => workModes.some((mode) => mode.toLowerCase() === (j.workMode || "").toLowerCase()))
      : list

    const parseSalary = (s) => {
      if (s == null) return undefined
      if (typeof s === "number") return s
      const n = Number(String(s).replace(/[^\d]/g, ""))
      return isFinite(n) ? n : undefined
    }

    const bySalary = byWorkMode.filter((j) => {
      const s = parseSalary(j.salary)
      if (minSalary != null && (s == null || s < minSalary)) return false
      if (maxSalary != null && (s == null || s > maxSalary)) return false
      return true
    })

    const cmp = (a, b) => {
      let res = 0
      if (sortBy === "title") res = String(a.title || "").localeCompare(String(b.title || ""))
      else if (sortBy === "salary") res = (parseSalary(a.salary) ?? -Infinity) - (parseSalary(b.salary) ?? -Infinity)
      else res = (new Date(a.postedAt || 0)) - (new Date(b.postedAt || 0))
      return order === "asc" ? res : -res
    }
    bySalary.sort(cmp)
    return bySalary
  }, [data?.jobs, workModes, minSalary, maxSalary, sortBy, order])

  // Pagination
  const pageSize = 8
  const totalPages = Math.ceil(processedJobs.length / pageSize)
  const [page, setPage] = useState(1)
  const paginatedJobs = useMemo(() => {
    const start = (page - 1) * pageSize
    return processedJobs.slice(start, start + pageSize)
  }, [processedJobs, page])

  const filtersState = { keyword, locations, workModes, minSalary, maxSalary }
  const handleFiltersChange = (patch) => setParams(patch)
  const handleSortChange = (next) => setParams(next)
  const clearAll = () => setParams({ keyword: "", locations: [], workModes: [], minSalary: undefined, maxSalary: undefined })

  return (
    <div className="container mx-auto p-6">
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-700">
          Search Results{keyword ? ` for "${keyword}"` : ""}
        </h1>
      </header>

      <div className="flex flex-col md:flex-row gap-6">
        <aside className="flex flex-col gap-6 shrink-0">
          <Filters state={filtersState} onChange={handleFiltersChange} onClearAll={clearAll} />
        </aside>

        <main className="flex-1 min-w-0">
          <div className="flex flex-row justify-between items-center mb-4 p-3 border rounded-xl">
            <p className="text-sm text-gray-500 mt-1">
              {isLoading
                ? "Loading jobs..."
                : error
                ? "Failed to load jobs."
                : `Showing ${Math.min(pageSize, paginatedJobs.length)} of ${processedJobs.length} jobs`}
            </p>
            <SortBar sortBy={sortBy} order={order} onChange={handleSortChange} />
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => <JobCardSkeleton key={i} />)}
            </div>
          ) : error ? (
            <div className="p-6 border rounded-xl bg-card text-gray-500">An error occurred while fetching jobs.</div>
          ) : paginatedJobs.length === 0 ? (
            <div className="p-6 border rounded-xl bg-card text-gray-500">No jobs found. Try adjusting filters.</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedJobs.map((job) => <JobCard key={job.id} job={job} />)}
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
                  {pageSize * (page - 1) + 1} - {Math.min(pageSize * page, processedJobs.length)} / {processedJobs.length}
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
        </main>
      </div>
    </div>
  )
}
